import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MarkdownEditor } from '@/components/common/markdown-editor';

const CreateJob = () => {
  const [step, setStep] = useState(1);
  const [withContest, setWithContest] = useState(false);
  const [description, setDescription] = useState('');

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-3/4 h-full rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Create Job</h2>
        <Separator className="mb-4" />

        <div className="space-y-6">
          <MarkdownEditor
            value={description}
            onChange={(val) => setDescription(val)}
            placeholder="Write the job description in markdown..."
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={prev} disabled={step === 1}>
              Back
            </Button>
            <Button onClick={next}>{step === 3 ? 'Finish' : 'Next'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
