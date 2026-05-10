// See https://svelte.dev/docs/kit/types#app.d.ts
import type { D1Database } from '@cloudflare/workers-types';

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        ASSETS: Fetcher;
        DB?: D1Database;
      };
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
}

export {};
