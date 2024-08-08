import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method === "PUT") {
        await todoController.toggleDone(request, response);
        return;
    }

    response.status(405).json({
        error: {
            message: "Method not allowed",
        },
    });
}
