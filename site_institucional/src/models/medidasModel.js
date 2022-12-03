var database = require("../database/config")

function getComponentesServidor(idMaquina) {
    var instrucao = `SELECT * FROM vw_componenteMetrica WHERE fkServidor = '${idMaquina}';`;
    console.log("Executando a instrução SQL: \n" + instrucao);

    return database.executar(instrucao);
}

function medidasCardsTempoReal(idMaquina, metrica, nomeComponente, nomeMetrica, limite) {
    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        var instrucao = `SELECT * FROM vw_${metrica} WHERE idServidor = '${idMaquina}' LIMIT ${limite};`;
        // console.log("Executando a instrução SQL: \n" + instrucao);
    } else if (process.env.AMBIENTE_PROCESSO == "producao") {
        var instrucao = `SELECT TOP ${limite} idComponente, fkServidor AS idServidor, leitura.horario, valorLido, unidadeMedida FROM leitura
        JOIN componente ON fkComponente_idComponente = idComponente AND fkComponente_fkServidor = fkServidor
        JOIN metrica ON fkMetrica = idMetrica
        WHERE metrica.nomeComponente = '${nomeComponente}'
        AND metrica.nomeMetrica = '${nomeMetrica}'
        AND fkServidor = '${idMaquina}'
        ORDER BY horario DESC;`;
        console.log("Executando a instrução SQL: \n" + instrucao);
    }
    return database.executar(instrucao);
}

function medidasGraficoTempoReal(idMaquina, metrica, idComponente, idMetrica, mes) {
    var instrucao = `SELECT * FROM vw_${metrica} WHERE idServidor = '${idMaquina}' AND idComponente = ${idComponente} AND idMetrica = ${idMetrica} AND Mes = '${mes}';`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function getDadosAnalytics(idTorre, idServidor, idComponente, mesAtual, mesAnterior, idMetrica) {
    var instrucao = `SELECT mes, media, unidadeMedida FROM vw_dadosAnalytics WHERE idTorre = ${idTorre} AND idServidor = '${idServidor}' AND idComponente = ${idComponente} AND fkMetrica = ${idMetrica} AND mes IN (${mesAnterior}, ${mesAtual}) ORDER BY mes;`
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function getTodasAsMediasPorMes(idTorre, idServidor, idComponente, idMetrica, mesAtual) {
    var instrucao = `SELECT media FROM vw_dadosAnalytics WHERE idTorre = ${idTorre} AND idServidor = '${idServidor}' AND idComponente = ${idComponente} AND fkMetrica = ${idMetrica} AND mes != ${mesAtual};`
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function pegarDadosGrafico(){
    var instrucao = `SELECT fkMetrica, MIN(horario) as horario, valorLido FROM leitura
	WHERE fkComponente_fkServidor = '02:42:ac:11:00:03'
	AND fkMetrica = 5
	AND horario >= '2022-11-27 15:29:40'
	GROUP BY valorLido, fkMetrica
	ORDER BY MIN(horario), valorLido DESC;`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}


module.exports = {
    getComponentesServidor,
    medidasCardsTempoReal,
    medidasGraficoTempoReal,
    getDadosAnalytics,
    getTodasAsMediasPorMes,
    pegarDadosGrafico
};