import 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
  interface User extends AdapterUser {
    id: string;
    capabilities: string[];
  }

  interface Session {
    user: User;
  }
}