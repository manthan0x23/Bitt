import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center p-7 pr-0">
      <div className="w-1/2 space-y-1 text-center">
        <h1>404</h1>
        <p className="text-base font-medium text-foreground text-wrap">
          Looks like you&#39;re lost in the void.
        </p>
        <p className="text-xs text-muted-foreground text-wrap">
          The page you&#39;re looking for doesn&#39;t exist or has been moved. If you typed the URL directly, double-check it.
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
