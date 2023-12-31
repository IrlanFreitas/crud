import { todoRepository } from "../repository/todo";

interface TodoControllerGetParams {
    page?: number;
    limit?: number;
}

async function get({ page, limit }: TodoControllerGetParams) {
    return todoRepository.get({ page: page || 1, limit: 1 });
}

export const todoController = { get };
