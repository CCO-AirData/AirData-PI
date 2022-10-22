var database = require("../database/config");

function listar(fkServidor){
    var instrucao = `SELECT idComponente, tipoComponente, memoria, tipoMemoria FROM componente WHERE fkServidor = '${fkServidor}'`;
    return database.executar(instrucao);
}

function listarOpcoesComponentes() {
    var instrucao = `SELECT DISTINCT nomeComponente FROM metrica`;
    return database.executar(instrucao);
}

function listarOpcoesParametro(nomeComponente) {
    var instrucao = `SELECT idMetrica, nomeMetrica FROM metrica WHERE nomeComponente = '${nomeComponente}'`;
    return database.executar(instrucao);
}

function cadastrar(fkMetrica, idComponente, fkServidor){
    var instrucao = `INSERT INTO parametro 
    (fkMetrica, fkComponente_idComponente, fkComponente_fkServidor) 
    VALUES (${fkMetrica}, ${idComponente}, '${fkServidor}')`;
    return database.executar(instrucao);
}

function deletar(idComponente) {
    var instrucao = `DELETE FROM alerta WHERE fkComponente = ${idComponente};`
    database.executar(instrucao);
    instrucao = `DELETE FROM leitura WHERE fkComponente_idComponente = ${idComponente};`
    database.executar(instrucao);
    instrucao = `DELETE FROM parametro WHERE fkComponente_idComponente = ${idComponente};`
    database.executar(instrucao);
    instrucao = `DELETE FROM componente WHERE idComponente = ${idComponente};`
    return database.executar(instrucao);

}

module.exports = {
    listar,
    listarOpcoesComponentes,
    listarOpcoesParametro,
    cadastrar,
    deletar
};