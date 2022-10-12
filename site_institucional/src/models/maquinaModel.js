var database = require("../database/config")

function listar(fkTorre) {
    var instrucao = `SELECT * FROM servidor WHERE fkTorre = ${fkTorre};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarComponente(){

}

function deletar(mac) {
    var instrucao = `DELETE FROM servidor WHERE idServidor = "${mac}";`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    cadastrarComponente,
    listar,
    deletar
};