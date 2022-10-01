var database = require("../database/config")

function medidasPercentCpuDiskRam(idMaquina) {
    var instrucao = `SELECT horarioMonitoramento, cpuMaquinaGhz, discoMaquinaGb, memoriaMaquinaGb 
    FROM monitoramento 
    WHERE fkMaquina = ${idMaquina}
    LIMIT 1;`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {

    medidasPercentCpuDiskRam,
};