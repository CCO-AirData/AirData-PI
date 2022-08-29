var database = require("../database/config")


// Coloque os mesmos parâmetros aqui. Vá para a var instrucao
function cadastrar(fkEmpresa,nomeAeroporto,numeroAeroporto,ufAeroporto,cidadeAeroporto,bairroAeroporto,ruaAeroporto) {
    var instrucao = `INSERT INTO aeroporto (fkEmpresa,nomeAeroporto,numeroAeroporto,ufAeroporto,cidadeAeroporto,bairroAeroporto,ruaAeroporto) VALUES ('${fkEmpresa}', '${nomeAeroporto}', '${numeroAeroporto}','${ufAeroporto}','${cidadeAeroporto}','${bairroAeroporto}','${ruaAeroporto}');`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {

    cadastrar,
};