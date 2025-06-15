import { MarkdownPreview } from '@/components/common/markdown-preview';
import { Badge } from '@/components/ui/badge';
import type { ContestProblemSchemaT } from '@/lib/types/contests';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Lightbulb } from 'lucide-react';
import { difficultyColorMap } from '@/integrations/theme/colors/problems';

type Props = {
  problem: Partial<ContestProblemSchemaT>;
};

export const ProblemDescription = ({ problem }: Props) => {
  return (
    <div className="h-full w-full space-y-6">
      <div className="space-y-2">
        <div className="h-auto w-full flex  gap-2 items-center justify-start cursor-grab">
          <h3>Q{problem.problemIndex}</h3>
          <h3>{problem.title}</h3>
        </div>
        {(problem.timeLimitMs || problem.memoryLimitMb) && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            {problem.timeLimitMs && (
              <div>Time Limit: {problem.timeLimitMs} ms</div>
            )}
            {problem.memoryLimitMb && (
              <div>Memory Limit: {problem.memoryLimitMb} MB</div>
            )}
          </div>
        )}
        <span className="w-1/2 flex gap-2 flex-wrap">
          <Badge
            className={`capitalize ${difficultyColorMap[problem.difficulty as keyof typeof difficultyColorMap] ?? ''}`}
          >
            {problem.difficulty}
          </Badge>{' '}
          <Badge>{problem.points}</Badge>
        </span>
      </div>

      <div className="space-y-3">
        <h5>Description</h5>
        <MarkdownPreview
          className="opacity-80"
          fontSize=".9rem"
          lineHeight={1}
          value={problem.description!}
        />
      </div>
      <div className="space-y-3">
        <h5>Input Description</h5>
        <MarkdownPreview
          className="opacity-80"
          fontSize=".9rem"
          lineHeight={1.5}
          value={problem.inputDescription!}
        />
      </div>
      <div className="space-y-3">
        <h5>Output Description</h5>
        <MarkdownPreview
          className="opacity-80"
          fontSize=".9rem"
          lineHeight={1}
          value={problem.outputDescription!}
        />
      </div>
      <div className="space-y-3">
        <h5>Constraints</h5>
        <MarkdownPreview
          className="opacity-80"
          fontSize=".9rem"
          lineHeight={1}
          value={problem.constraints!}
        />
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex gap-6 flex-wrap">
          <span>
            <strong className="text-foreground">Acceptance:</strong> 87.2%
          </span>
          <span>
            <strong className="text-foreground">Submissions:</strong> 1,232
          </span>
        </div>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="tags">
          <AccordionTrigger className="hover:no-underline">
            Problem Tags
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-2 w-1/2 flex-wrap">
              {(problem.tags ?? []).map((tag) => (
                <Badge variant={'secondary'} className="capitalize">
                  {tag.split('-').join(' ')}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {(problem.hints ?? []).map((hint, idx) => (
          <AccordionItem value={`hint-${idx}`}>
            <AccordionTrigger className="hover:no-underline">
              <span className="flex justify-start items-center gap-3">
                <Lightbulb size={15} />
                Hint {idx + 1}
              </span>
            </AccordionTrigger>
            <AccordionContent>{hint}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
