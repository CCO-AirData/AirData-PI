var database = require("../database/config")

function medidasGraficoTempoReal(idMaquina, metrica, limite) {
    if(process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        var instrucao = `SELECT * FROM vw_${metrica} WHERE idServidor = "${idMaquina}" LIMIT ${limite};`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    } else if(process.env.AMBIENTE_PROCESSO == "producao") {
        var instrucao = `SELECT TOP ${limite} * FROM vw_${metrica} WHERE idServidor = '${idMaquina}';`;
        console.log("Executando a instrução SQL: \n" + instrucao);           
    }
    return database.executar(instrucao);
}

function medidasCardsTempoReal(idMaquina, metrica, limite) {
    if(process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        var instrucao = `SELECT * FROM vw_${metrica} WHERE idServidor = "${idMaquina}" LIMIT ${limite};`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    } else if(process.env.AMBIENTE_PROCESSO == "producao") {
        var instrucao = `SELECT TOP ${limite} * FROM vw_${metrica} WHERE idServidor = '${idMaquina}';`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    }
    return database.executar(instrucao);
}


module.exports = {
    medidasGraficoTempoReal,
    medidasCardsTempoReal
};