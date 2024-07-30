/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

// const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";

// * Por estar dentro da pasta public dá pra acessar pela url
const bgPublic = "/assets/bg.jpeg";

interface HomeTodo {
    id: string;
    content: string;
    done: boolean;
}

function HomePage() {
    // const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const initialLoadComplete = React.useRef(false);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = React.useState(1);
    const [newTodoContent, setNewTodoContent] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [todos, setTodos] = React.useState<HomeTodo[]>([]);

    const homeTodos = todoController.filterTodosByContent<HomeTodo>(
        search,
        todos
    );

    const hasMorePages = totalPages > page;
    const hasNoTodos = homeTodos.length === 0 && !isLoading;

    React.useEffect(() => {
        // setInitialLoadComplete(true);
        if (!initialLoadComplete.current) {
            todoController
                .get({ page })
                .then(({ todos, pages }) => {
                    setTodos(todos);
                    setTotalPages(pages);
                })
                .finally(() => {
                    setIsLoading(false);
                    initialLoadComplete.current = true;
                });
        }
    }, [page]);

    async function toggleDone(id: string) {}

    return (
        <main>
            <GlobalStyles themeName="coolGrey" />
            <header
                style={{
                    backgroundImage: `url('${bgPublic}')`,
                }}
            >
                <div className="typewriter">
                    <h1>O que fazer hoje?</h1>
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        todoController.create({
                            content: newTodoContent,
                            onSuccess(todo: HomeTodo) {
                                setTodos((oldTodos) => {
                                    return [todo, ...oldTodos];
                                });
                                setNewTodoContent("");
                            },
                            onError(customMessage) {
                                alert(
                                    customMessage ||
                                        "Você precisa do conteúdo para criar uma TODO!"
                                );
                            },
                        });
                    }}
                >
                    <input
                        name="add-todo"
                        type="text"
                        placeholder="Correr, Estudar..."
                        value={newTodoContent}
                        onChange={(event) => {
                            setNewTodoContent(event.target.value);
                        }}
                    />
                    <button type="submit" aria-label="Adicionar novo item">
                        +
                    </button>
                </form>
            </header>

            <section>
                <form>
                    <input
                        type="text"
                        placeholder="Filtrar lista atual, ex: Dentista"
                        onChange={(event) => {
                            setSearch(event.target.value);
                        }}
                    />
                </form>

                <table border={1}>
                    <thead>
                        <tr>
                            <th align="left">
                                <input type="checkbox" disabled />
                            </th>
                            <th align="left">Id</th>
                            <th align="left">Conteúdo</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {homeTodos?.map((currentTodo) => {
                            return (
                                <tr key={currentTodo?.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            defaultChecked={currentTodo.done}
                                            onChange={function handleToggleDone() {
                                                todoController.toggleDone({
                                                    content: currentTodo?.id,
                                                    onError() {
                                                        alert(
                                                            "Falha ao atualizar a TODO :("
                                                        );
                                                    },
                                                    // Update Real
                                                    // * Optmistic Update - Eu não sei se deu certo a operação mas eu quero que atualize a tela
                                                    updateTodoOnScreen() {
                                                        setTodos(
                                                            (currentTodos) => {
                                                                return currentTodos.map(
                                                                    (todo) => {
                                                                        if (
                                                                            todo.id ===
                                                                            currentTodo.id
                                                                        ) {
                                                                            return {
                                                                                ...todo,
                                                                                done: !todo.done,
                                                                            };
                                                                        }

                                                                        return todo;
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    },
                                                });
                                            }}
                                        />
                                    </td>
                                    <td>{currentTodo?.id.substring(0, 4)}</td>
                                    <td>
                                        {!currentTodo?.done &&
                                            currentTodo?.content}
                                        {currentTodo?.done && (
                                            <s>{currentTodo?.content}</s>
                                        )}
                                    </td>
                                    <td align="right">
                                        <button
                                            onClick={function handleDelete() {
                                                // todoController.deleteById({
                                                //     content: currentTodo?.id,
                                                //     onError() {
                                                //         alert(
                                                //             "Falha ao atualizar a TODO :("
                                                //         );
                                                //     },
                                                //     // Update Real
                                                //     // * Optmistic Update - Eu não sei se deu certo a operação mas eu quero que atualize a tela
                                                //     updateTodoOnScreen() {
                                                //         setTodos(
                                                //             (currentTodos) => {
                                                //                 return currentTodos.map(
                                                //                     (todo) => {
                                                //                         if (
                                                //                             todo.id ===
                                                //                             currentTodo.id
                                                //                         ) {
                                                //                             return {
                                                //                                 ...todo,
                                                //                                 done: !todo.done,
                                                //                             };
                                                //                         }

                                                //                         return todo;
                                                //                     }
                                                //                 );
                                                //             }
                                                //         );
                                                //     },
                                                // });
                                                todoController.deleteById(currentTodo?.id)
                                                .then(() => {
                                                    setTodos((currentTodos) => {
                                                        return currentTodos.filter( (todo) => {
                                                            return todo.id !== currentTodo?.id
                                                        }) 
                                                    })
                                                })
                                                .catch(() => {
                                                    console.error("Failed to delete")
                                                })
                                                
                                            }}
                                            data-type="delete"
                                        >
                                            Apagar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: "center" }}
                                >
                                    Carregando...
                                </td>
                            </tr>
                        )}

                        {hasNoTodos && (
                            <tr>
                                <td colSpan={4} align="center">
                                    Nenhum item encontrado
                                </td>
                            </tr>
                        )}

                        {hasMorePages && (
                            <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: "center" }}
                                >
                                    <button
                                        onClick={() => {
                                            setIsLoading(true);
                                            const nextPage = page + 1;
                                            setPage(nextPage);

                                            todoController
                                                .get({ page: nextPage })
                                                .then(({ todos, pages }) => {
                                                    setTodos((oldTodos) => {
                                                        return [
                                                            ...oldTodos,
                                                            ...todos,
                                                        ];
                                                    });
                                                    setTotalPages(pages);
                                                })
                                                .finally(() => {
                                                    setIsLoading(false);
                                                });
                                        }}
                                        data-type="load-more"
                                    >
                                        Página {page}, Carregar mais
                                        <span
                                            style={{
                                                display: "inline-block",
                                                marginLeft: "4px",
                                                fontSize: "1.2em",
                                            }}
                                        >
                                            ↓
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

export default HomePage;
