export async function POST(request: Request) {
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      await request.json();
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("contact api error", error);
    return new Response(null, { status: 400 });
  }
}
