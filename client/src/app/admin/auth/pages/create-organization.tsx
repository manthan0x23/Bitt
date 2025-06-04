import { useStore } from '@tanstack/react-store';
import { authStore } from '@/store/authStore';
import { LogoHeader } from '@/components/ui/logo-header';
import { Link, useRouter } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { CreateOrganizationForm } from '../_components/create-organization-form';
export const CreateOrganizationPage = () => {
  const [user] = useStore(authStore, (state) => [state.user]);
  const router = useRouter();

  if (!user) {
    router.navigate({ to: '/auth/ladder' });
    return null;
  }

  if (user.type !== 'admin') {
    router.navigate({ to: '/auth/admin/login-admin' });
    return null;
  }

  return (
    <div className="screen-full bg-primary-foreground text-primary flex justify-center items-center relative px-4 py-10">
      <LogoHeader className="absolute m-10 top-0 left-0" />

      <div className="w-full max-w-xl p-8 rounded-xl flex flex-col items-start gap-6">
        <div className="flex flex-col items-start gap-2">
          <span className="flex items-center gap-3 relative">
            <Link
              to="/auth/admin/organization-ladder"
              className="absolute -left-9 text-muted-foreground"
            >
              <ArrowLeft />
            </Link>
            <h3 className="text-3xl font-medium">Create Organization</h3>
          </span>
          <p className="text-left text-sm text-primary/60">
            Set up your organization’s details below to get started.
          </p>
        </div>

        <CreateOrganizationForm email={user.email} />
      </div>
    </div>
  );
};
