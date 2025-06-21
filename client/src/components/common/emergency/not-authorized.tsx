import { Button } from '@/components/ui/button';

export function NotAuthorized() {
  return (
    <div className="flex h-full w-full items-center justify-center p-7 pr-0">
      <div className="w-1/2 space-y-1 text-center">
        <h1>401</h1>
        <p className="text-base font-medium text-foreground text-wrap">
          Well, this wasn't supposed to happen.
        </p>
        <p className="text-xs text-muted-foreground text-wrap">
          You don&#39;t have access to this page. Contact an admin if you think this
          is a mistake.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer mt-4"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
