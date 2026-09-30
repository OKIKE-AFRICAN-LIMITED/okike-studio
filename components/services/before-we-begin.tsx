const questions = [
  {
    question: "Do we need all three services?",
    answer: "Start with the part you need. The enquiry helps us define the scope around your existing brand, website or product.",
  },
  {
    question: "What happens after an enquiry?",
    answer: "We review the brief, clarify the requirements and prepare a quote. Sending an enquiry does not confirm a booking or request payment.",
  },
  {
    question: "What determines the final price?",
    answer: "Page count is a starting point. Functionality, integrations, content needs and additional services shape the final scope and quote.",
  },
] as const;

export function BeforeWeBegin() {
  return (
    <section className="bg-[#d9ccf2] text-black" aria-labelledby="before-we-begin-heading">
      <div className="mx-auto flex w-full max-w-site flex-col gap-8 px-5 py-12 md:px-10 md:py-14 lg:px-14 lg:py-16">
        <h2 id="before-we-begin-heading" className="text-[36px]/[47px] font-extrabold md:text-[48.6px]/[1.05] lg:text-[56px]/[73px]">Before we begin.</h2>
        <dl className="flex flex-col gap-8">
          {questions.map((item) => (
            <div key={item.question} className="flex flex-col gap-3">
              <dt className="text-[22px]/[29px] font-extrabold lg:text-[26px]/[34px]">{item.question}</dt>
              <dd className="text-[18px]/[23px] lg:text-[20px]/[26px]">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
