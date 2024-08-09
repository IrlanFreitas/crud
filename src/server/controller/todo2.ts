import { NextApiRequest, NextApiResponse } from "next";
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
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;

  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "You must to provide a string ID",
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({
        error: {
          message: error.message,
        },
      });
    }
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  // * Validate query schema;
  const QuerySchema = schema.object({
    id: schema.string().uuid().min(1),
  });

  // * Fail Fast Validations
  const parsedQuery = QuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({
      error: {
        message: `You must to provide a valid id`,
      },
    });
    return;
  }

  try {
    const todoId = parsedQuery.data.id;
    if (!todoId || typeof todoId !== "string") {
      res.status(400).json({
        error: {
          message: "You must to provide a string ID",
        },
      });
      return;
    }

    await todoRepository.deleteById(todoId);

    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof HttpNotFoundError) {
      return res.status(error.status).json({
        error: {
          message: error.message,
        },
      });
    }

    // Acho que não deveria ser chumbado o valor e sim exibir o que vem do error
    res.status(500).json({
      error: {
        message: `Internal Server Error`,
      },
    });
  }
}

export const todoController = {
  GET,
  POST,
  toggleDone,
  DELETE,
};
