import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";
import { todoRepository } from "../repository/todo";
import { HttpNotFoundError } from "../infra/errors";

function get(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query;
    const page = Number(query.page);
    const limit = Number(query.limit);

    if (query.page && isNaN(page)) {
        res.status(400).json({
            error: {
                message: "'page' must be a number",
            },
        });
        return;
    }

    if (query.limit && isNaN(limit)) {
        res.status(400).json({
            error: {
                message: "'limit' must be a number",
            },
        });
        return;
    }

    const output = todoRepository.get({
        page,
        limit,
    });

    res.status(200).json({
        total: output.total,
        pages: output.pages,
        todos: output.todos,
    });
}

const TodoCreateBodySchema = schema.object({
    content: schema.string(),
});

async function post(req: NextApiRequest, res: NextApiResponse) {
    // * Fail Fast Validations
    const body = TodoCreateBodySchema.safeParse(req.body);

    // * Type Narrowing
    if (!body.success) {
        res.status(400).json({
            error: {
                message: "You need to provide a content to create a TODO",
                description: body.error.issues,
            },
        });
        return;
    }

    // * Aqui temos o dado garantido
    const createdTodo = await todoRepository.createByContent(body.data.content);

    res.status(201).json({
        todo: createdTodo,
    });
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
    } catch (error: any) {
        if (error instanceof Error) {
            res.status(404).json({
                error: {
                    message: error.message,
                },
            });
        }
    }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
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
    } catch (error: any) {
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
    get,
    post,
    toggleDone,
    deleteById,
};
