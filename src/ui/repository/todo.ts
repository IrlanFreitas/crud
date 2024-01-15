interface TodoRepositoryGetParams {
    page: number;
    limit: number;
}
interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

// * Model/Schema
interface Todo {
    id: string;
    content: string;
    date: Date;
    done: boolean;
}

function get({
    page,
    limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
        async (respostaDoServer) => {
            const todosString = await respostaDoServer.text();

            // * Como garantir a tipagem de tipos desconhecidos ?
            const responseParsed = parseTodosFromServer(
                JSON.parse(todosString)
            );

            return {
                todos: responseParsed.todos,
                total: responseParsed.total,
                pages: responseParsed.pages,
            };
        }
    );
}

function parseTodosFromServer(responseBody: unknown): {
    total: number;
    pages: number;
    todos: Array<Todo>;
} {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        "total" in responseBody &&
        "pages" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo == null && typeof todo !== "object") {
                    throw new Error("Invalid todo from API");
                }

                // * Casting
                const { id, content, date, done } = todo as {
                    id: string;
                    content: string;
                    date: string;
                    done: string;
                };

                return {
                    id,
                    content,
                    done: String(done).toLowerCase() === "true",
                    date: new Date(date),
                };
            }),
        };
    }

    return {
        total: 0,
        pages: 1,
        todos: [],
    };
}

export const todoRepository = {
    get,
};
