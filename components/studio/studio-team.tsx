import Image from "next/image";
import { studioTeam, type TeamRecord } from "@/lib/team";

function TeamEntry({ member }: { member: TeamRecord }) {
  return (
    <article data-placeholder={member.placeholder || undefined} className="contents">
      <div className="relative h-[300px] w-full overflow-hidden md:h-[400px] lg:h-[460px]">
        <Image src={member.image} alt={member.imageAlt} fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 80px), min(1328px, calc(100vw - 112px))" className="object-cover object-center" />
      </div>
      <div className="flex flex-col gap-[27px] text-[18px]/[27px] lg:gap-[25px] lg:text-[20px]/[25px]">
        <p>{member.caption}</p>
        <div>
          <p>{member.namesAndRoles}</p>
          <p>{member.introduction}</p>
        </div>
      </div>
    </article>
  );
}

export function StudioTeam() {
  return (
    <section className="bg-ink text-[#f7f7f2]" aria-labelledby="studio-team-heading">
      <div className="mx-auto flex w-full max-w-site flex-col gap-7 px-5 py-12 md:px-10 md:py-14 lg:px-14 lg:py-[72px]">
        <p className="text-[12px]/[15px]">03 / THE PEOPLE</p>
        <h2 id="studio-team-heading" className="text-[36px]/[42px] font-extrabold md:text-[48.6px]/[1.05] lg:text-[64px]/[80px]">The people<br />behind the work.</h2>
        {studioTeam.map((member) => <TeamEntry key={member.id} member={member} />)}
      </div>
    </section>
  );
}
