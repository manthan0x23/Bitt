import type { Capability } from '@/lib/types/capabilities';
import { authStore } from '@/store/authStore';
import { useStore } from '@tanstack/react-store';

export function useHasCapability(required: Capability | Capability[]) {
  const { user } = useStore(authStore);

  if (!user) return false;

  const { capabilities } = user;

  if (!capabilities) return false;

  if (Array.isArray(required))
    return required.every((c) => capabilities.includes(c));

  return capabilities.includes(required);
}
