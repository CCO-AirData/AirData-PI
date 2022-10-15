var database = require("../database/config")

function receberDadosAlertas(fkTorre) {
    var instrucao = `SELECT * FROM servidor WHERE fkTorre = ${fkTorre};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    receberDadosAlertas
};