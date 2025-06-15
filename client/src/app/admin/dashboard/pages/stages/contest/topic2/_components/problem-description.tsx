import { MarkdownPreview } from '@/components/common/markdown-preview';
import type { ContestProblemSchemaT } from '@/lib/types/contests';

type Props = {
  problem: Partial<ContestProblemSchemaT>;
};

export const ProblemDescription = ({ problem }: Props) => {
  return (
    <div className="h-full w-full space-y-6">
      <div className="h-auto w-full flex  gap-2 items-center justify-start cursor-grab">
        <h3>Q{problem.problemIndex}</h3>
        <h3>{problem.title}</h3>
      </div>
      <div className="space-y-2">
        <h4>Description</h4>
        <MarkdownPreview value={problem.description!} />
      </div>
      <div className="space-y-2">
        <h4>Input Description</h4>
        <MarkdownPreview value={problem.inputDescription!} />
      </div>
      <div className="space-y-2">
        <h4>Output Description</h4>
        <MarkdownPreview value={problem.outputDescription!} />
      </div>
      <div className="space-y-2">
        <h4>Constraints</h4>
        <MarkdownPreview value={problem.constraints!} />
      </div>
    </div>
  );
};
