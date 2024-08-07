/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    // console.log(request.method);

    if (request.method === "GET") {
        todoController.get(request, response);
        return;
    }

    if (request.method === "POST") {
        todoController.post(request, response);
        return;
    }

    response.status(405).json({
        error: {
            message: "Method not allowed",
        },
    });
}
