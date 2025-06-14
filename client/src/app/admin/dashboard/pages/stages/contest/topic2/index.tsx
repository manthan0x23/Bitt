import type { ContestSchemaT } from '@/lib/types/contests';
import { ProblemPage } from './_components/problem-page';
import { SidePannel } from './_components/side-pannel';

type Props = {
  contest: ContestSchemaT;
};

export const ContestTopic2 = ({ contest }: Props) => {
  return (
    <div className="w-full h-full p-0 max-h-full flex items-center gap-2">
      <section className="w-[80%] border h-full">
        <ProblemPage />
      </section>
      <section className="w-[20%] h-full">
        <SidePannel contest={contest} />
      </section>
    </div>
  );
};
