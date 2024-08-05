// * Trailing Slash - Barra no final "/"
// * assim "http://localhost:3000" ou "http://localhost:3000/"
const BASE_URL = "http://localhost:3000";

describe("/ - Todo Feed", () => {
    it("when load, renders the page", () => {
        cy.visit(BASE_URL);
    });

    it.only("when create a new todo, it must appears in the screen", () => {
        // ? Descrição do passo-a-passo

        // * 0 - ??? Vamos interceptar as chamadas (mock)
        // * Interceptações/Interceptação
        cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
            request.reply({
                statusCode: 201,
                body: {
                    todo: {
                        id: "a47c4138-9826-4f73-bf37-b71b3c82805b",
                        content: "Criando meu unico com TODO cy.intercept",
                        date: "2024-01-17T18:04:19.355Z",
                        done: false,
                    },
                },
            });
        }).as("Post de TO-DO");

        // * 1 - Abrir a página
        cy.visit(BASE_URL);

        // * 2 - Selecionar o input de criar nova
        // Usar seletores que tenha mais sentido com a questão de acessibilidade na web
        // o que pode ser usado futuramente como teste de acessibilidade.

        // * Esse jeito de fazer será modificado por conta de boas práticas
        // const $inputAddTodo = cy.get("header > form > input");

        // * 3 - Digitar um texto nesse input que foi selecionado
        // $inputAddTodo.type("Criando meu unico com TODO cy.intercept");

        const inputAddTodo = "input[name='add-todo']";
        cy.get(inputAddTodo).type("Criando meu unico com TODO cy.intercept");

        // * 4 - Clicar no botão
        // const $btnAddTodo = cy.get("button[aria-label='Adicionar novo item']");
        const buttonAddTodo = "button[aria-label='Adicionar novo item']";
        cy.get(buttonAddTodo).click();

        // * 5 - Chegar se na página surgiu um novo elemento

        cy.get("table > tbody").contains(
            "Criando meu unico com TODO cy.intercept"
        );
    });
});
