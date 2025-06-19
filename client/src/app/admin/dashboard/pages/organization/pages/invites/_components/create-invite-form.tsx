import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateInviteForm = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div>
          <h4>Create Invite</h4>
          <p className="text-muted-foreground text-sm">
            Fill in the invite details to onboard a new member.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
