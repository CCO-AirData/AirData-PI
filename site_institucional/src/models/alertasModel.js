var database = require("../database/config")

function listarAlertas(fkTorre, limite) {
    if(process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        var instrucao = `SELECT * FROM vw_alertas WHERE fkTorre = ${fkTorre} LIMIT ${limite};`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    } else if(process.env.AMBIENTE_PROCESSO == "producao") {
        var instrucao = `SELECT TOP ${limite} * FROM vw_alertas WHERE fkTorre = ${fkTorre};`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    }
    return database.executar(instrucao);
}

function listarFiltros(fkTorre) {
    var instrucao = `SELECT DISTINCT idServidor, tipoComponente FROM vw_alertas WHERE fkTorre = ${fkTorre};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarAlertasFiltrados(fkTorre, limite, hardware, maquina) {
    if(process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        if (hardware == 'null') {
            var instrucao = `SELECT * FROM vw_alertas WHERE fkTorre = ${fkTorre} AND idServidor = '${maquina}' LIMIT ${limite};`;
            console.log("Executando a instrução SQL: \n" + instrucao);    
        } else if (maquina == 'null') {
            var instrucao = `SELECT * FROM vw_alertas WHERE fkTorre = ${fkTorre} AND tipoComponente = '${hardware}' LIMIT ${limite};`;
            console.log("Executando a instrução SQL: \n" + instrucao);    
        } else {
            var instrucao = `SELECT * FROM vw_alertas WHERE fkTorre = ${fkTorre} AND idServidor = '${maquina}' AND tipoComponente = '${hardware}' LIMIT ${limite};`;
            console.log("Executando a instrução SQL: \n" + instrucao);    
        }
    } else if(process.env.AMBIENTE_PROCESSO == "producao") {
        if (hardware == 'null') {
            var instrucao = `SELECT TOP ${limite} * FROM vw_alertas WHERE fkTorre = ${fkTorre} AND idServidor = '${maquina}';`;
            console.log("Executando a instrução SQL: \n" + instrucao);    
        } else if (maquina == 'null') {
            var instrucao = `SELECT TOP ${limite} * FROM vw_alertas WHERE fkTorre = ${fkTorre} AND tipoComponente = '${hardware}';`;
            console.log("Executando a instrução SQL: \n" + instrucao);    
        } else {
            var instrucao = `SELECT TOP ${limite} * FROM vw_alertas WHERE fkTorre = ${fkTorre} AND idServidor = '${maquina}' AND tipoComponente = '${hardware}';`;
            console.log("Executando a instrução SQL: \n" + instrucao);    
        }    
    }

    return database.executar(instrucao);
}

function listarRecentes(fkTorre){
    let instrucao = `SELECT * FROM vw_alertasRecentes WHERE fkTorre = ${fkTorre}`;
    console.log("Executando a instrução SQL: \n" + instrucao); 
    return database.executar(instrucao);
}

module.exports = {
    listarFiltros,
    listarAlertas,
    listarAlertasFiltrados,
    listarRecentes
};