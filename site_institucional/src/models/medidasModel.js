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
        AND horario >= DATEADD(MINUTE, -3, GETDATE())
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

function pegarDadosGrafico(mac){
    var instrucao = `SELECT fk_metrica as metrica, MIN(horario) as horario, valor_leitura as valor FROM fact_historico_leitura
	WHERE fk_servidor = '${mac}'
	AND (fk_metrica = 5 or fk_metrica = 4)
	GROUP BY valor_leitura, fk_metrica
	ORDER BY MIN(horario), valor_leitura DESC;`;
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