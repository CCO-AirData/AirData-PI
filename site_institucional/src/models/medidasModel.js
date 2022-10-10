var database = require("../database/config")

function medidasGraficoTempoReal(idMaquina, metrica, limite) {
    var instrucao = `SELECT * FROM vw_${metrica} WHERE idServidor = "${idMaquina}" LIMIT ${limite}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function medidasCardsTempoReal(idMaquina, metrica, limite) {
    var instrucao = `SELECT * FROM vw_${metrica} WHERE idServidor = "${idMaquina}" LIMIT ${limite}`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}


module.exports = {
    medidasGraficoTempoReal,
    medidasCardsTempoReal
};