import { todoRepository } from "../repository/todo";

interface TodoControllerGetParams {
    page: number;
    limit?: number;
}

async function get({ page }: TodoControllerGetParams) {
    return todoRepository.get({ page: page, limit: 2 });
}

function filterTodosByContent<Todo>(
    search: string,
    todos: Array<Todo & { content: string }>
): Todo[] {
    const homeTodo = todos.filter((todo) => {
        const searchNormalized = search.toLocaleLowerCase();
        const contentNormalized = todo.content.toLocaleLowerCase();
        return contentNormalized.includes(searchNormalized);
    });
    return homeTodo;
}

export const todoController = { get, filterTodosByContent };
