const fs = require("fs");
const DB_FILE_PATH = "./core/db";

console.log("[CRUD]");

function create (content) {
    // * Salvando no sistema
    fs.writeFileSync(DB_FILE_PATH, content);
    return content;
}

// * [SIMULATION]
create("Fazendo o curso que me propus a fazer!")