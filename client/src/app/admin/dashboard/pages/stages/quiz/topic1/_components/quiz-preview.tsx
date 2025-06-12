import type { UpdateQuizSchemaT } from '../schema/update-quiz-input';
import { MarkdownPreview } from '@/components/common/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Props = {
  data: UpdateQuizSchemaT;
};

export const QuizPreview = ({ data }: Props) => {
  return (
    <div className="w-full space-y-6 mt-4">
      <div className="rounded-md bg-background space-y-4">
        <header>
          <h2 className="text-2xl font-semibold">{data.title}</h2>
        </header>

        <Separator />
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Start Time</p>
            <p>{new Date(data.startAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">End Time</p>
            <p>{new Date(data.endAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="text-primary">{data.duration} minutes</p>
          </div>
          <div>
            <p className="text-muted-foreground">Accessibility</p>
            <p className="capitalize">{data.accessibility}</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Tags</p>
            <div className="capitalize flex items-center flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge variant={'secondary'} className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">
            Monitoring Enabled
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              data.requiresVideoMonitoring && 'Video',
              data.requiresAudioMonitoring && 'Audio',
              data.requiresAIMonitoring && 'AI',
              data.requiresScreenMonitoring && 'Screen',
            ]
              .filter(Boolean)
              .map((item, idx) => (
                <Badge variant={'outline'} key={idx}>
                  {item}
                </Badge>
              ))}
            {!(
              data.requiresVideoMonitoring ||
              data.requiresAudioMonitoring ||
              data.requiresAIMonitoring ||
              data.requiresScreenMonitoring
            ) && <p className="text-sm text-muted-foreground">None</p>}
          </div>
        </div>

        <Separator />
        <div className="space-y-2 mt-4">
          <h3>Description</h3>

          <MarkdownPreview
            value={data.description || 'No description provided.'}
          />
        </div>
        <Separator />
        <div className="space-y-2 mt-4">
          <h3>Instructions</h3>
          <MarkdownPreview
            value={data.instructions || 'No instructions provided.'}
          />
        </div>
        <Separator />
      </div>
    </div>
  );
};
