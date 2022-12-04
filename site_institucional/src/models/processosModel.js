var database = require("../database/config")

function listarProcessos(fkTorre, limite, fkServidor) {
    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        var instrucao = `SELECT nome, sum(porcentagemCpu) as 'cpu', pid, usuario FROM processos 
        WHERE DAY(horario) >= DAY(now()) AND HOUR(horario) >= HOUR(now())
        AND fkServidor = "${fkServidor}"
        GROUP BY nome ORDER BY sum(porcentagemCpu) DESC LIMIT ${limite};`;
        console.log("Executando a instrução SQL: \n" + instrucao);
      
    } else if(process.env.AMBIENTE_PROCESSO == "producao") {
        var instrucao = `SELECT TOP ${limite} nome, SUM(porcentagemCpu) as 'cpu', pid, usuario FROM [dbo].[processos]
        WHERE fkServidor = '${fkServidor}'
        AND horario BETWEEN DATEADD(HOUR, -3, DATEADD(SECOND, -10, CURRENT_TIMESTAMP)) AND DATEADD(HOUR, -3, DATEADD(SECOND, 0, CURRENT_TIMESTAMP))
        GROUP BY nome, pid, usuario
        ORDER BY SUM(porcentagemCpu) DESC;`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    }
    return database.executar(instrucao);
}

function deletarProcesso(pid) {
    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        var instrucao = `INSERT INTO deletarPid(pid) values (${pid});`
        console.log("Executando a instrução SQL: \n" + instrucao);
    } else if (process.env.AMBIENTE_PROCESSO == "producao") {
        var instrucao = `INSERT INTO deletarPid(pid) values (${pid});`
        console.log("Executando a instrução SQL: \n" + instrucao);
    }
    return database.executar(instrucao);
}

function obterProcessos(horarioInicio, horarioFim, mac) {
    var instrucao = `SELECT TOP 3 nome, MAX(porcentagemCpu) as usoCpu FROM [dbo].[processos]
	WHERE fkServidor = '${mac}'
	AND horario BETWEEN '${horarioInicio}' AND '${horarioFim}'
	GROUP BY nome
	ORDER BY MAX(porcentagemCpu) DESC;`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listarProcessos,
    deletarProcesso,
    obterProcessos,
};