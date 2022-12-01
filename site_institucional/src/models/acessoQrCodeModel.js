var database = require("../database/config")

function listarAcessos(idUsuario) {
    let instrucao = ''
    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        //untested
        instrucao = `SELECT *, TIMESTAMPDIFF(MINUTE, momentoAcesso, NOW()) as diferencaTempo from logQrCode WHERE fkUsuario = ${idUsuario} AND TIMESTAMPDIFF(MINUTE, momentoAcesso, NOW()) <= 5 AND foiNotificado = 0;`;
    } else if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucao = `SELECT TOP 1 *, DATEDIFF(minute, momentoAcesso, DATEADD(HOUR, -3, CURRENT_TIMESTAMP)) AS diferencaTempo from [dbo].[logQrCode]
        WHERE fkUsuario = ${idUsuario} AND DATEDIFF(minute, momentoAcesso, DATEADD(HOUR, -3, CURRENT_TIMESTAMP)) <= 5 AND foiNotificado = 0
        ORDER BY diferencaTempo;`;
    }
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function setNotificado(idAcesso) {
    let instrucao = `UPDATE logQrCode SET foiNotificado = 1 WHERE idQrCodeAccess = ${idAcesso};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarAcesso(idUsuario, idMaquina) {
    let instrucao = ``;
    console.log("################################ TO CADASTRANDO EM")
    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        //untested
        instrucao = `INSERT INTO logQrCode (fkUsuario, fkMaquina, momentoAcesso, foiNotificado) VALUES
        (${idUsuario}, ${idMaquina}, NOW(), 0);`;
    } else if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucao = `INSERT INTO logQrCode (fkUsuario, fkMaquina, momentoAcesso, foiNotificado) VALUES
        (${idUsuario}, '${idMaquina}', DATEADD(HOUR, -3, CURRENT_TIMESTAMP), 0);`;
    }
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listarAcessos,
    setNotificado,
    cadastrarAcesso
};