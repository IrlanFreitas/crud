import { z as schema } from "zod";
import { todoRepository } from "../repository/todo";
import { HttpNotFoundError } from "../infra/errors";

async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  };
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "'page' must be a number",
        },
      }),
      {
        status: 400,
      }
    );
  }

  if (query.limit && isNaN(limit)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "'limit' must be a number",
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const output = await todoRepository.get({
      page,
      limit,
    });

    return new Response(
      JSON.stringify({
        total: output.total,
        pages: output.pages,
        todos: output.todos,
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        }),
        {
          status: 400,
        }
      );
    }
    if (error instanceof HttpNotFoundError) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        })
      );
    }
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to fetch To-Dos",
        },
      }),
      {
        status: 400,
      }
    );
  }
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});

async function POST(req: Request) {
  // * Fail Fast Validations
  const body = TodoCreateBodySchema.safeParse(await req.json());

  // * Type Narrowing
  if (!body.success) {
    return new Response(
      JSON.stringify({
        error: {
          message: "You need to provide a content to create a TODO",
          description: body.error.issues,
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    // * Aqui temos o dado garantido
    const createdTodo = await todoRepository.createByContent(body.data.content);

    return new Response(
      JSON.stringify({
        todo: createdTodo,
      }),
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        }),
        {
          status: 400,
        }
      );
    }
    if (error instanceof HttpNotFoundError) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        })
      );
    }
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to post To-Do",
        },
      }),
      {
        status: 400,
      }
    );
  }
}

async function toggleDone(id: string) {
  if (!id || typeof id !== "string") {
    return new Response(
      JSON.stringify({
        error: {
          message: "You must to provide a string ID",
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(id);

    return new Response(
      JSON.stringify({
        todo: updatedTodo,
      })
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        }),
        {
          status: 400,
        }
      );
    }
    if (error instanceof HttpNotFoundError) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        })
      );
    }
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to toggle To-Dos",
        },
      }),
      {
        status: 400,
      }
    );
  }
}

async function DELETE(id: string) {
  // * Validate query schema;
  const QuerySchema = schema.object({
    id: schema.string().uuid().min(1),
  });

  // * Fail Fast Validations
  const parsedQuery = QuerySchema.safeParse({ id });
  if (!parsedQuery.success) {
    return new Response(
      JSON.stringify({
        error: {
          message: `You must to provide a valid id`,
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const todoId = parsedQuery.data.id;
    if (!todoId || typeof todoId !== "string") {
      return new Response(
        JSON.stringify({
          error: {
            message: "You must to provide a string ID",
          },
        }),
        {
          status: 400,
        }
      );
    }

    await todoRepository.deleteById(todoId);

    return new Response(null, {
      status: 204,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        }),
        {
          status: 400,
        }
      );
    }
    if (error instanceof HttpNotFoundError) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        })
      );
    }
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to delete To-Do",
        },
      }),
      {
        status: 400,
      }
    );
  }
}

export const todoController = {
  GET,
  POST,
  toggleDone,
  DELETE,
};
