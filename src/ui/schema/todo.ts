import { z as schema } from "zod";

// interface Toƒo {
//     id: string;
//     content: string;
//     date: string;
//     done: boolean;
// }

export const TodoSchema = schema.object({
    id: schema.string(),
    content: schema.string(),
    date: schema.string().datetime(),
    done: schema.boolean(),
});

export type Todo = schema.infer<typeof TodoSchema>;
