import { read, create, update, deleteById as deleteTodoById } from "@db-crud";
import { Todo } from "@src/ui/schema/todo";
import { HttpNotFoundError } from "../infra/errors";

import { createClient } from "@supabase/supabase-js";
import { TodoSchema } from "../schema/todo";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

interface TodoRepositoryGetParams {
    page?: number;
    limit?: number;
}

interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

async function get({
    page,
    limit,
}: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {
    const currentPage = page || 1;
    const currentLimit = limit || 10;

    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = currentPage * currentLimit - 1;

    const { data, error, count } = await supabase
        .from("todos")
        .select("*", {
            count: "exact",
        })
        .order("date", { ascending: false })
        .range(startIndex, endIndex);

    if (error) throw new Error("Failed to fetch data");

    const parsedData = TodoSchema.array().safeParse(data);

    if (!parsedData.success)
        throw new Error(`Failed to parsed data: ${parsedData.error}`);

    const todos = parsedData.data;
    const total = count || todos.length;
    const pages = Math.ceil(total / currentLimit);
    return {
        todos,
        total,
        pages,
    };

    // const currentPage = page || 1;
    // const currentLimit = limit || 10;
    // const ALL_TODOS = read().reverse();

    // const startIndex = (currentPage - 1) * currentLimit;
    // const endIndex = currentPage * currentLimit;
    // const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
    // const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

    // return {
    //     todos: paginatedTodos,
    //     total: ALL_TODOS.length,
    //     pages: totalPages,
    // };
}

async function createByContent(content: string): Promise<Todo> {
    const { data, error } = await supabase
        .from("todos")
        .insert([{ content }])
        .select()
        .single();

    if (error) throw new Error("Failed to create to-do");

    const parsedData = TodoSchema.parse(data);

    return parsedData;

    // const newTodo = create(content);
    // return newTodo;
}
async function getTodoById(id: string): Promise<Todo> {
    const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error("Failed to get todo by id");

    const parsedTodo = TodoSchema.safeParse(data);
    if (!parsedTodo.success) throw new Error("Failed to parse TODO created");

    return parsedTodo.data;
}

async function toggleDone(id: string): Promise<Todo> {
    const todo = await getTodoById(id);
    const { data, error } = await supabase
        .from("todos")
        .update({
            done: !todo.done,
        })
        .eq("id", todo.id)
        .select()
        .single();

    if (error) throw new Error("Failed to get todo by Id");

    const parsedTodo = TodoSchema.safeParse(data);
    if (!parsedTodo.success) throw new Error("Failed to return updated todo");
    
    return parsedTodo.data;
    // const ALL_TODOS = read();

    // const todo = ALL_TODOS.find((todo) => todo.id === id);

    // if (!todo) throw new Error(`Todo with id "${id}" not found`);

    // const updatedTodo = await update(id, {
    //     done: !todo.done,
    // });

    // return updatedTodo;
}

async function deleteById(id: string) {
    const { error } = await supabase.from("todos").delete().match({
        id,
    });

    if (error) throw new Error("Failed to delete");

    // if (!id) throw new Error(`You need to provide an id`);

    // const ALL_TODOS = read();
    // const todo = ALL_TODOS.find((todo) => todo.id === id);
    // if (!todo) throw new HttpNotFoundError(`Todo with id "${id}" not found`);

    // await deleteTodoById(id);

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
