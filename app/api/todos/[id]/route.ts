import { todoController } from "@src/server/controller/todo";

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const id = params.id;
//   //   return await todoController.DELETE(request);
//   return new Response(`Id:${id}`, {
//     status: 200,
//   });
// }

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    return await todoController.DELETE(params.id);
  }
