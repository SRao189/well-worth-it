import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const rewards: Record<string, number> = { awareness: 200, 'site-preparation': 250, digging: 300, 'pump-installation': 400, 'clean-water-flow': 500 };
Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const body = await request.json().catch(() => null);
  if (!body?.sessionId || !rewards[body.phaseId] || !Number.isInteger(body.durationMs) || body.durationMs < 500 || body.durationMs > 30000) return Response.json({ error: 'invalid score event' }, { status: 400 });
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { error } = await supabase.from('score_events').insert({ session_id: body.sessionId, phase_id: body.phaseId, duration_ms: body.durationMs, reward: rewards[body.phaseId] });
  if (error?.code === '23505') return Response.json({ accepted: true, duplicate: true });
  if (error) return Response.json({ error: 'score not recorded' }, { status: 500 });
  return Response.json({ accepted: true, reward: rewards[body.phaseId] });
});
