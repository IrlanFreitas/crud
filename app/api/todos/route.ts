import { todoController } from "@src/server/controller/todo";

export async function GET(request: Request) {
  return await todoController.GET(request);
}

export async function POST(request: Request) {
  return await todoController.POST(request);
}

// export async function DELETE(
//     request: Request,
//     { params }: { params: { id: string } }
//   ) {
//     const id = params.id;
//     //   return await todoController.DELETE(request);
//     return new Response(`Id:${id}`, {
//       status: 200,
//     });
//   }


