var database = require("../database/config")

function cadastrar(fkEmpresa,nomeAeroporto,cepAeroporto,numeroAeroporto,ufAeroporto,cidadeAeroporto,bairroAeroporto,ruaAeroporto) {
    var instrucao = `INSERT INTO aeroporto (fkEmpresa,nomeAeroporto,cepAeroporto,numeroAeroporto,ufAeroporto,cidadeAeroporto,bairroAeroporto,ruaAeroporto) VALUES ('${fkEmpresa}', '${nomeAeroporto}', '${cepAeroporto}', '${numeroAeroporto}', '${ufAeroporto}', '${cidadeAeroporto}', '${bairroAeroporto}', '${ruaAeroporto}');`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {

    cadastrar,
};