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

function selecionarUltimoIdComponente() {
    let instrucao = `SELECT MAX(idComponente) AS id FROM componente;`;
    return database.executar(instrucao);
}

function getComponente(idComponente, fkServidor) {
    let instrucao = `SELECT * FROM componente WHERE idComponente = ${idComponente} && fkServidor = '${fkServidor}'`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarComponenteDimensional(id, nome, tipo, memoria, tipoMemoria) {
    let instrucao = `INSERT INTO dim_componente (id, nome, tipo, memoria, tipo_memoria) VALUES (${id}, '${nome}', '${tipo}', '${memoria}', '${tipoMemoria}');`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function deletar(mac) {
    let instrucao = `DELETE FROM servidor WHERE idServidor = "${mac}";`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarPorMacAeroporto(idMaquina, idAeroporto){
    const instrucao = `SELECT * FROM vw_maquinaPorMacEAeroporto WHERE idServidor = '${idMaquina}' AND fkAeroporto = '${idAeroporto}';`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function editarNome(idServidor, apelidoServidor) {
    let instrucao = `UPDATE servidor SET apelido = '${apelidoServidor}' WHERE idServidor = '${idServidor}';`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    cadastrarComponente,
    getComponente,
    listar,
    listarComEstado,
    listarMaiorUsoCpu,
    deletar,
    selecionarUltimoIdComponente,
    cadastrarComponenteDimensional,
    listarPorMacAeroporto,
    editarNome
};