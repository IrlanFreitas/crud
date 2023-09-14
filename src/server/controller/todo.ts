import { read } from "@db-crud";
import { NextApiRequest, NextApiResponse } from "next";

function get(req: NextApiRequest, res: NextApiResponse) {
    const ALL_TODOS = read();
    res.status(200).json({
        todos: ALL_TODOS,
    });
    return;
}

export const todoController = {
    get,
};
