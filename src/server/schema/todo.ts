import { z as schema } from "zod";

export const TodoSchema = schema.object({
    id: schema.string(),
    content: schema.string(),
    // date: schema.string().datetime(),
    date: schema.string().transform((date) => {
        return new Date(date).toISOString();
    }),
    // done: schema.boolean(),
    done: schema.boolean(),
});

export type Todo = schema.infer<typeof TodoSchema>;