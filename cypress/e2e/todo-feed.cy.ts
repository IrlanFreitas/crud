const BASE_URL = "http://localhost:3000"

describe("/ - Todo Feed", () => {
    it("when load, renders the page", () => {
        // * Trailing Slash - Barra no final "/"
        cy.visit(BASE_URL);
    });

    it("when create a new todo, it must appears in the screen", () => {
        // ? Descrição do passo-a-passo

        // * 0 - ??? Vamos interceptar as chamadas (mock)
        cy.intercept("POST", `${BASE_URL}/api/todos`, request => {
            request.reply({
                statusCode: 400,
                body: {}
            })
        })

        // * 1 - Abrir a página
        cy.visit(BASE_URL);

        // * 2 - Selecionar o input de criar nova 
        // Usar seletores que tenha mais sentido com a questão de acessibilidade na web
        // o que pode ser usado futuramente como teste de acessibilidade.
        // const $inputAddTodo = cy.get("header > form > input");
        const $inputAddTodo = cy.get("input[name='add-todo']");
        
        // * 3 - Digitar um texto nesse input que foi selecionado
        $inputAddTodo.type("Cypress Test Todo");

        // * 4 - Clicar no botão
        const $btnAddTodo = cy.get("[aria-label='Adicionar novo item']");
        $btnAddTodo.click();

        // * 5 - Chegar se na página surgiu um novo elemento

    });
});
