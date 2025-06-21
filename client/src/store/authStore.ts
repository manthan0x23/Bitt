// stores/authStore.ts
import type { Capability } from '@/lib/types/capabilities';
import { Store } from '@tanstack/store';

export interface JwtPayload {
  id: string;
  email: string;
  name?: string | null;
  sub?: string;
  picture?: string | null;
  type: 'user' | 'admin';
  roleId: string | null;
  role: string;
  capabilities: Capability[];
}

interface AuthState {
  user: JwtPayload | null;
  isLoading: boolean;
  isError: boolean;
}

export const authStore = new Store<AuthState>({
  user: null,
  isLoading: true,
  isError: false,
});
