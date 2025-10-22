export async function GET() {
  const payload = {
    ok: true,
    ts: Date.now(),
    node: process.version,
    env: process.env.NODE_ENV,
    uptime: process.uptime(),
  };
  return new Response(JSON.stringify(payload), {
    headers: { "content-type": "application/json" },
  });
}
