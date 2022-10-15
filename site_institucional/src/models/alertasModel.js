var database = require("../database/config")

function listar(fkTorre) {
    var instrucao = `SELECT * FROM vw_alertas where fkTorre = ${fkTorre};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listar
};