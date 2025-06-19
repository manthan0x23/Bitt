import { useEffect, type PropsWithChildren } from 'react';
import { OrganizationSettingsSidePannel } from '../_components/side-pannel';
import { useSidebar } from '@/components/ui/sidebar';

export const OrganizationSettingsLayout = ({ children }: PropsWithChildren) => {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto h-full px-4 py-6">
      <section className="w-full mb-6">
        <h2 className="text-2xl font-semibold">Organization Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your organization’s roles, invites, profile details,
          configurations, and other settings. Use the side panel to navigate
          through the available sections.
        </p>
      </section>
      <div className="w-full h-[75vh] flex items-start justify-between gap-4">
        <section className="w-[25%] h-full overflow-hidden">
          <OrganizationSettingsSidePannel />
        </section>
        <section className="w-[75%] h-full border rounded-lg overflow-y-auto p-6">
          {children}
        </section>
      </div>
    </div>
  );
};
