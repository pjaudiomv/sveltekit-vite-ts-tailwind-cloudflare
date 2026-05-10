<script lang="ts">
  import { Button } from '@/lib/components/ui/button';

  let message = $state<string>('');
  let loading = $state(false);

  async function ping() {
    loading = true;
    const res = await fetch('/api/hello');
    const data = (await res.json()) as { message: string };
    message = data.message;
    loading = false;
  }
</script>

<main class="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
  <h1 class="text-4xl font-bold">SvelteKit on Cloudflare Workers</h1>
  <p class="text-muted-foreground">Vite + Tailwind v4 + shadcn-svelte + Drizzle (D1-ready)</p>

  <Button onclick={ping} disabled={loading}>
    {loading ? 'Loading…' : 'Call /api/hello'}
  </Button>

  {#if message}
    <pre class="bg-muted rounded-md border px-4 py-2 text-sm">{message}</pre>
  {/if}
</main>
