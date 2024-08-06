import { read, create, update, deleteById as deleteTodoById } from "@db-crud";
import { Todo } from "@src/ui/schema/todo";
import { HttpNotFoundError } from "../infra/errors";

interface TodoRepositoryGetParams {
    page?: number;
    limit?: number;
}

interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

// interface Todo {
//     id: string;
//     content: string;
//     date: string;
//     done: boolean;
// }

function get({
    page,
    limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const ALL_TODOS = read().reverse();

    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = currentPage * currentLimit;
    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
    const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

    return {
        todos: paginatedTodos,
        total: ALL_TODOS.length,
        pages: totalPages,
    };
}

async function createByContent(content: string): Promise<Todo> {
    const newTodo = create(content);
    return newTodo;
}

async function toggleDone(id: string): Promise<Todo> {
    const ALL_TODOS = read();

    const todo = ALL_TODOS.find((todo) => todo.id === id);

    if (!todo) throw new Error(`Todo with id "${id}" not found`);

    const updatedTodo = await update(id, {
        done: !todo.done,
    });

    return updatedTodo;
}

async function deleteById(id: string) {
    if (!id) throw new Error(`You need to provide an id`);

    const ALL_TODOS = read();
    const todo = ALL_TODOS.find((todo) => todo.id === id);
    if (!todo) throw new HttpNotFoundError(`Todo with id "${id}" not found`);

    await deleteTodoById(id);
    // try {
    //     return "Todo deleted with success";
    // } catch (error: any) {
    //     return error.message;
    // }
}

export const todoRepository = {
    get,
    createByContent,
    toggleDone,
    deleteById,
};
