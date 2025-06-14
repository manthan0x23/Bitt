import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { BsBuildingsFill } from 'react-icons/bs';
import { IoMdLink } from 'react-icons/io';
import { ShieldCheck, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { LogoHeader } from '@/components/ui/logo-header';
import { GoArrowRight } from 'react-icons/go';
import { Link, useNavigate } from '@tanstack/react-router';

const roles = [
  {
    id: 'create',
    label: 'Create a New Organization',
    icon: <BsBuildingsFill className="w-5 h-5" />,
  },
  {
    id: 'join',
    label: 'Join via Invite Code/Link',
    icon: <IoMdLink className="w-5 h-5" />,
  },
];

export const OrganizationLadder = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const nextPage = useCallback(() => {
    if (selected === 'create') {
      navigate({ to: '/auth/admin/create-organization', resetScroll: true });
    } else {
      navigate({ to: '/auth/admin/join-organization', resetScroll: true });
    }
  }, [selected, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-10 relative">
      <LogoHeader className="mb-4 absolute m-10 top-0 left-0" />

      <div className="text-left max-w-lg mb-10 px-7 relative">
        <Link
          to="/auth/ladder"
          className="absolute -left-7 top-2 text-muted-foreground"
        >
          <ArrowLeft />
        </Link>
        <h2 className="text-4xl font-medium">
          Manage with Bittt.
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Whether you're starting fresh or joining an existing workspace, Bittt
          makes it easy to manage and collaborate within your organization.
        </p>
      </div>
      <div className="w-full max-w-md space-y-6">
        <RadioGroup
          value={selected ?? ''}
          onValueChange={setSelected}
          className="space-y-4"
        >
          {roles.map((role) => (
            <div
              key={role.id}
              className={twMerge(
                'cursor-pointer h-[6rem] text-6xl flex items-center justify-between border rounded-md px-6 py-4 transition-all duration-200 hover:scale-[1.007]',
                selected === role.id
                  ? 'border-primary/80 bg-secondary shadow-sm'
                  : 'border-primary/40 bg-secondary hover:border-primary/70',
              )}
              onClick={() => setSelected(role.id)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem id={role.id} value={role.id} />
                <Label htmlFor={role.id}>{role.label}</Label>
              </div>
              <div>{role.icon}</div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="mt-10 w-full max-w-md space-y-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <Lock className="w-5 h-5  mt-0.5 text-primary" />
          <p>We use AES-256 encryption to secure all organizational data.</p>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 mt-0.5 text-primary" />
          <p>Your organizational credentials are never stored in plain text.</p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 mt-0.5 text-primary" />
          <p>
            Fully compliant with SOC 2, GDPR, and enterprise-grade policies.
          </p>
        </div>

        <div className="w-full flex justify-end items-center">
          <Button
            size={'sm'}
            className="p-5 text-sm cursor-pointer"
            disabled={!selected}
            variant={selected ? 'default' : 'outline'}
            onClick={nextPage}
          >
            Next
            <GoArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
