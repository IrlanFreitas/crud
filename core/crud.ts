/* eslint-disable no-console */
import fs from "fs"; // * ES6
// * const fs = require("fs"); Common JS
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db.json";

// console.log("[CRUD]");

type UUID = string;

interface Todo {
    id: UUID;
    content: string;
    date: string;
    done: boolean;
}

export function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        content,
        date: new Date().toISOString(),
        done: false,
    };

    const todos: Array<Todo> = [...read(), todo];

    // * Salvando no sistema || No arquivo
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));

    return todo;
}

export function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");

    if (!db.todos) {
        return [];
    }
    return db.todos;
}

// * Partial é pra indicar que vai receber alguma informação
// * de todo, mas não precisa descrever isso
function update(id: UUID, partialTodo: Partial<Todo>): Todo {
    let updatedTodo;
    const todos = read();

    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo);
        }
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));

    if (!updatedTodo) {
        throw new Error("Please, provide another ID!");
    }

    return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo {
    return update(id, {
        content,
    });
}

function deleteById(id: UUID) {
    const allTodos = read();

    const todos = allTodos.filter((todo) => todo.id !== id);

    console.log({ todos });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "");
}

// * [SIMULATION]

// CLEAR_DB();
// create("Primeira TODO");
// const secundTodo = create("Segunda TODO");
// const thirdTodo = create("Terceira TODO");
// deleteById(secundTodo.id);
// const extraTodo = create("Extra TODO");
// deleteById(extraTodo.id);
// // update(terceiraTODO.id, {
// //   content: "TODO ATUALIZADA PELO MÉTODO",
// //   done: true,
// // });
// updateContentById(thirdTodo.id, "Terceira TODO - Atualizado");
// const todos = read();
// console.log(todos);
// console.log(todos.length);
