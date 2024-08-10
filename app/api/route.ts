export async function GET(request: Request) {
  return new Response(JSON.stringify("Server working"), {
    status: 200,
  });
}
