import type { UpdateContestSchemaT } from '../schema/update-contest';
import { MarkdownPreview } from '@/components/common/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDatePPpp } from '@/lib/date/format-date';
import { formatMinutesToHoursAndMinutes } from '@/lib/date/format-minutes';

type Props = {
  data: UpdateContestSchemaT;
};

export const ContestPreview = ({ data }: Props) => {
  return (
    <div className="w-full space-y-6 mt-4">
      <div className="rounded-md bg-background space-y-4">
        <header>
          <h2 className="text-2xl font-semibold">{data.title}</h2>
        </header>

        <Separator />
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p>{formatDatePPpp(data.startAt)}</p>
          </div>
          {data.contestType != 'live' && data.endAt && (
            <div>
              <p className="text-muted-foreground">End Date</p>
              <p>{formatDatePPpp(data.endAt)}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="text-primary">
              {formatMinutesToHoursAndMinutes(data.duration)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Accessibility</p>
            <p className="capitalize">{data.accessibility}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="capitalize">{data.contestType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Publish State</p>
            <p className="capitalize">{data.state}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Number of Problems</p>
            <p>{data.noOfProblems}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Available for Practise</p>
            <p>{data.availableForPractise ? 'Yes' : 'No'}</p>
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
                <Badge variant={'secondary'} key={idx}>
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

        {data.warnings.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3>Warnings</h3>
            <div className="flex flex-wrap gap-2">
              {data.warnings.map((w, i) => (
                <Badge key={i} variant="destructive">
                  {w}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
