import { z as schema } from "zod";
import { todoRepository } from "../repository/todo";
import { Todo } from "../schema/todo";

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

interface TodoControllerCreateParams {
    content?: string;
    onSuccess: (todo: Todo) => void;
    onError: (customMessage?: string) => void;
}

async function create({
    content,
    onSuccess,
    onError,
}: TodoControllerCreateParams) {
    // * Fail Fast Validations
    const parsedParams = schema.string().min(1).safeParse(content);

    if (!parsedParams.success) {
        // ? Como pode ser feito sem o zod
        // if (!content) {
        onError("Você precisa prover um conteúdo");
        return;
    }

    todoRepository
        .createByContent(parsedParams.data)
        .then((newTodo) => {
            onSuccess(newTodo);
        })
        .catch((error) => {
            onError();
        });

    // const todo = {
    //     id: "12345",
    //     content,
    //     date: new Date().toISOString(),
    //     done: false,
    // };

    // try {
    //     const todo = await todoRepository.createByContent(content);
    //     onSuccess(todo);
    // } catch (error) {
    //     onError();
    // }
    // return;
}

interface TodoControllerToggleDoneParams {
    content?: string;
    onError: (customMessage?: string) => void;
    updateTodoOnScreen: () => void;
}

async function toggleDone({
    content: id,
    onError,
    updateTodoOnScreen,
}: TodoControllerToggleDoneParams) {
    // * Fail Fast Validations
    const parsedParams = schema.string().min(1).safeParse(id);

    if (!parsedParams.success) {
        // ? Como pode ser feito sem o zod
        // if (!content) {
        throw new Error("Você precisa informar um todo id");
    }

    // * Optimistic Update
    updateTodoOnScreen();
    todoRepository.toggleDone(parsedParams.data).catch(() => {
        onError();
    });
    // .then(() => {
    //     // * Update Real
    //     updateTodoOnScreen();
    // });
}

export const todoController = { get, filterTodosByContent, create, toggleDone };
