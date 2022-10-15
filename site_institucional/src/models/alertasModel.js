var database = require("../database/config")

function receberDadosAlertas(fkTorre) {
    var instrucao = `SELECT * FROM vw_alertas where fkTorre = ${fkTorre};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    receberDadosAlertas
};