import type { z } from 'zod/v4';
import { MarkdownPreview } from '@/components/common/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { CreateJobFormSchema } from '../schemas';

interface Props {
  state: Partial<z.infer<typeof CreateJobFormSchema>>;
}

export const CreateJobFormPreview = ({ state }: Props) => {
  return (
    <div className="w-full h-auto  space-y-4 text-wrap">
      <div className="w-full h-auto flex flex-col gap-6 rounded-md bg-background relative">
        <>
          <header>
            <h2 className="text-2xl font-semibold">
              {state.title || 'Job Title Not Provided'}
            </h2>
          </header>

          {state.tags && state.tags.length > 0 && (
            <div className="w-1/3 h-auto flex items-center justify-start flex-wrap gap-1">
              {state.tags.map((tag) => (
                <Badge variant={'outline'} key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-between gap-6 text-sm">
            <div className="flex-1">
              <p className="text-muted-foreground">Location</p>
              <p>{state.location || 'Not specified'}</p>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground">Job Type</p>
              <p className="capitalize">{state.type || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex justify-between gap-6 text-sm">
            <div className="flex-1">
              <p className="text-muted-foreground">Screening Type</p>
              <p className="capitalize">
                {state.screeningType || 'Not specified'}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground">Job ID</p>
              <p>{state.slug || 'Auto-generated'}</p>
            </div>
          </div>

          <div className="flex justify-start items-center gap-6 text-sm">
            <div className="flex-1">
              <p className="text-muted-foreground">Application ends at</p>
              <p>
                {state.endDate
                  ? new Date(state.endDate).toUTCString()
                  : 'Please add application end date time'}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground">Experience</p>
              <p>{state.experience}+ years</p>
            </div>
          </div>

          <div className="space-y-2">
            {!state.description && (
              <p className="text-muted-foreground text-sm font-medium">
                Description
              </p>
            )}
            <MarkdownPreview
              value={state.description || 'No description provided.'}
            />
          </div>
        </>
      </div>
    </div>
  );
};
