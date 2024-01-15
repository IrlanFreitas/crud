import { todoRepository } from "../repository/todo";

interface TodoControllerGetParams {
    page: number;
    // limit?: number;
}

async function get({ page }: TodoControllerGetParams) {
    return todoRepository.get({ page: page, limit: 1 });
}

export const todoController = { get };
