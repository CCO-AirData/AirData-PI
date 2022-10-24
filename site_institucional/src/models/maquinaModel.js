var database = require("../database/config")

function listar(fkTorre) {
    var instrucao = `SELECT * FROM servidor WHERE fkTorre = ${fkTorre};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarComEstado(fkTorre) {
    var instrucao = `SELECT * FROM vw_onlineServers WHERE fkTorre = ${fkTorre};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarMaiorUsoCpu(fkTorre) {
    let instrucao = `SELECT * FROM vw_maquinasMaiorUsoCpu WHERE fkTorre = ${fkTorre};`
    return database.executar(instrucao);
}

function cadastrarComponente(fkServidor, tipoComponente, nomeComponente, memoria, tipoMemoria) {
    let instrucao = "";
    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucao = `INSERT INTO componente (fkServidor, tipoComponente, nomeComponente, tipoMemoria, memoria) 
        VALUES ('${fkServidor}', '${tipoComponente}', '${nomeComponente}', '${tipoMemoria}', '${memoria}');`;
    } else if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucao = `INSERT INTO componente (fkServidor, tipoComponente, nomeComponente, tipoMemoria, memoria) VALUES ('${fkServidor}', '${tipoComponente}', '${nomeComponente}', '${tipoMemoria}', '${memoria}');
                    SELECT @@IDENTITY AS ID;`;
    }
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function getComponente(idComponente, fkServidor) {
    let instrucao = `SELECT * FROM componente WHERE idComponente = ${idComponente} && fkServidor = '${fkServidor}'`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function deletar(mac) {
    var instrucao = `DELETE FROM servidor WHERE idServidor = "${mac}";`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    cadastrarComponente,
    getComponente,
    listar,
    listarComEstado,
    listarMaiorUsoCpu,
    deletar
};