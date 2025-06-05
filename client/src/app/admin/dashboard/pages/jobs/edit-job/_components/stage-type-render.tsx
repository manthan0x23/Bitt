import type { StageTypeEnumT } from '@/lib/types/stages';
import { twMerge } from 'tailwind-merge';

const sizeClassMap: Record<number, string> = {
  2: 'h-2 w-2',
  4: 'h-4 w-4',
  6: 'h-6 w-6',
  8: 'h-8 w-8',
  10: 'h-10 w-10',
  12: 'h-12 w-12',
};

export const StageTypeRender = ({
  type,
  size,
}: {
  type: StageTypeEnumT;
  size: number;
}) => {
  const sizeClasses = sizeClassMap[size] ?? 'h-4 w-4';

  const typeData = {
    contest: { label: 'Contest', color: 'bg-orange-500' },
    mcq_test: { label: 'Quiz', color: 'bg-pink-500' },
    resume_filter: { label: 'Resume Filter', color: 'bg-green-500' },
    interview: { label: 'Interview', color: 'bg-blue-500' },
  }[type];

  return (
    <p className="flex items-center justify-start gap-2">
      <span className={twMerge(sizeClasses, 'rounded-full', typeData.color)} />
      {typeData.label}
    </p>
  );
};
