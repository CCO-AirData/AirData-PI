var database = require("../database/config")

function listar(fkTorre, limite) {
    var instrucao = `SELECT * FROM vw_alertas where fkTorre = ${fkTorre} LIMIT ${limite};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listar
};