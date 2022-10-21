var database = require("../database/config");

function listar(){
    const instrucao = `SELECT * FROM metrica`;
    return database.executar(instrucao);
}

function cadastrar(fkMetrica, idComponente, fkServidor){
    const instrucao = `INSERT INTO parametro 
    (fkMetrica, fkComponente_idComponente, fkComponente_fkServidor) 
    VALUES (${fkMetrica}, ${idComponente}, '${fkServidor}')`;
    return database.executar(instrucao);
}

module.exports = {
    listar,
    cadastrar
};