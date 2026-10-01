import assert from "node:assert/strict";
import test from "node:test";
import { buildPayload, parsePackage, payloadErrors, servicesForPackage, type EnquiryAnswers } from "../lib/enquiry.ts";
import { renderEnquiryEmail, validateEnquiry } from "../lib/enquiry-server.ts";
import { handleEnquiryRequest, type EnquiryHandlerDependencies } from "../lib/enquiry-handler.ts";

const answers: EnquiryAnswers = { goal:"Launch",brand:"Refresh",website:"Five pages",software:"Dashboard",budget:"₦500k",timing:"Flexible",name:"Ada",email:"ada@example.com",company:"OKIKE" };

test("parses only known packages",()=>{assert.equal(parsePackage("starter")?.id,"starter");assert.equal(parsePackage("unknown"),undefined);assert.equal(parsePackage(["business-pro","starter"])?.id,"business-pro")});
test("maps package entry paths",()=>{assert.deepEqual(servicesForPackage("starter"),["website"]);assert.deepEqual(servicesForPackage("business-pro"),["website"]);assert.deepEqual(servicesForPackage("custom-software"),["software"])});
test("payload excludes deselected service answers",()=>{const payload=buildPayload(["website"],false,"starter",answers);assert.equal(payload.project.website,"Five pages");assert.equal("brand" in payload.project,false);assert.equal("software" in payload.project,false)});
test("combined payload contains each selected branch once",()=>{const payload=buildPayload(["brand","website","software"],false,undefined,answers);assert.deepEqual(Object.keys(payload.project),["goal","brand","website","software","budget","timing"])});
test("validates selection, goal and contact",()=>{const payload=buildPayload([],false,undefined,{...answers,goal:"",name:"",email:"bad"});assert.equal(payloadErrors(payload).length,4);assert.deepEqual(payloadErrors(buildPayload([],true,undefined,answers)),[])});

const submission = { id: "123e4567-e89b-12d3-a456-426614174000", startedAt: 1_700_000_000_000, companyWebsite: "" };
const validPayload = buildPayload(["website"], false, "starter", answers, submission);

test("server validation trusts package records rather than submitted names or prices",()=>{
  const result=validateEnquiry({...validPayload,packageName:"Free",packagePrice:"₦0"},submission.startedAt+3000);
  assert.equal(result.success,true);
  if(result.success){assert.equal(result.data.package?.name,"Starter Site");assert.equal(result.data.package?.price,"From ₦150,000")}
});

test("server validation rejects invalid fields, oversized content and package mismatches",()=>{
  const result=validateEnquiry({...validPayload,services:["software"],project:{...validPayload.project,goal:"x".repeat(2001)},contact:{...validPayload.contact,email:"bad"}},submission.startedAt+3000);
  assert.equal(result.success,false);
  if(!result.success){assert.ok(result.errors["project.goal"]);assert.ok(result.errors["contact.email"]);assert.ok(result.errors.packageId)}
});

test("server validation rejects honeypot submissions",()=>{
  const result=validateEnquiry({...validPayload,submission:{...submission,companyWebsite:"https://spam.example"}},submission.startedAt+100);
  assert.equal(result.success,false);
  if(!result.success)assert.ok(result.errors.form);
});

test("server validation allows fast package-prefilled submissions for autofill users",()=>{
  const result=validateEnquiry(validPayload,submission.startedAt+100);
  assert.equal(result.success,true);
});

test("email rendering escapes visitor content and includes trusted package data",()=>{
  const result=validateEnquiry({...validPayload,contact:{...validPayload.contact,name:"<Ada & Co>\r\nBcc: attacker@example.com"}},submission.startedAt+3000);
  assert.equal(result.success,true);
  if(result.success){const email=renderEnquiryEmail(result.data);assert.match(email.html,/&lt;Ada &amp; Co&gt;/);assert.doesNotMatch(email.html,/<Ada & Co>/);assert.match(email.text,/Starter Site — From ₦150,000/);assert.doesNotMatch(email.subject,/\r|\n/)}
});

function requestFor(body: unknown) {
  return new Request("http://localhost/api/enquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
}

function dependencies(send: EnquiryHandlerDependencies["send"]): EnquiryHandlerDependencies {
  return { apiKey: "test-key", from: "OKIKE Studio <enquiries@verified.example>", to: "studio@okike.com", send };
}

test("provider acceptance returns success and forwards reply-to plus idempotency key",async()=>{
  let capturedMessage: Parameters<EnquiryHandlerDependencies["send"]>[0] | undefined;
  let capturedOptions: Parameters<EnquiryHandlerDependencies["send"]>[1] | undefined;
  const response=await handleEnquiryRequest(requestFor(validPayload),dependencies(async(message,options)=>{capturedMessage=message;capturedOptions=options;return {data:{id:"email_test_123"},error:null}}));
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{ok:true,message:"Your enquiry has been submitted."});
  assert.equal(capturedMessage?.replyTo,"ada@example.com");
  assert.deepEqual(capturedMessage?.to,["studio@okike.com"]);
  assert.equal(capturedOptions?.idempotencyKey,submission.id);
});

test("returned provider errors are hidden and return failure",async()=>{
  const response=await handleEnquiryRequest(requestFor(validPayload),dependencies(async()=>({data:null,error:{name:"rate_limit_exceeded",message:"private provider detail"}})));
  assert.equal(response.status,502);
  assert.doesNotMatch(JSON.stringify(await response.json()),/private provider detail|rate_limit_exceeded/);
});

test("thrown provider errors are hidden and return failure",async()=>{
  const response=await handleEnquiryRequest(requestFor(validPayload),dependencies(async()=>{throw new Error("private exception")}));
  assert.equal(response.status,502);
  assert.doesNotMatch(JSON.stringify(await response.json()),/private exception/);
});

test("missing configuration never calls Resend",async()=>{
  let calls=0;
  const response=await handleEnquiryRequest(requestFor(validPayload),{...dependencies(async()=>{calls+=1;return {data:{id:"unexpected"},error:null}}),apiKey:undefined});
  assert.equal(response.status,503);
  assert.equal(calls,0);
});

test("invalid requests never call Resend",async()=>{
  let calls=0;
  const response=await handleEnquiryRequest(requestFor({...validPayload,contact:{...validPayload.contact,email:"invalid"}}),dependencies(async()=>{calls+=1;return {data:{id:"unexpected"},error:null}}));
  assert.equal(response.status,422);
  assert.equal(calls,0);
});

test("provider response without a message ID is treated as failure",async()=>{
  const response=await handleEnquiryRequest(requestFor(validPayload),dependencies(async()=>({data:null,error:null})));
  assert.equal(response.status,502);
});
