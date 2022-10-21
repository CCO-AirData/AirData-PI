var database = require("../database/config")

function cadastrarAeroporto(fkEmpresa,nomeAeroporto,cepAeroporto,numeroAeroporto,ufAeroporto,cidadeAeroporto,bairroAeroporto,ruaAeroporto) {
    let instrucao = "";
    if(process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucao = `INSERT INTO aeroporto (fkEmpresa,nomeAeroporto,cepAeroporto,numeroAeroporto,ufAeroporto,cidadeAeroporto,bairroAeroporto,ruaAeroporto) VALUES ('${fkEmpresa}', '${nomeAeroporto}', '${cepAeroporto}', '${numeroAeroporto}', '${ufAeroporto}', '${cidadeAeroporto}', '${bairroAeroporto}', '${ruaAeroporto}');`;
    } else if(process.env.AMBIENTE_PROCESSO == "producao") {
        instrucao = `INSERT INTO aeroporto (fkEmpresa,nomeAeroporto,cepAeroporto,numeroAeroporto,ufAeroporto,cidadeAeroporto,bairroAeroporto,ruaAeroporto) VALUES ('${fkEmpresa}', '${nomeAeroporto}', '${cepAeroporto}', '${numeroAeroporto}', '${ufAeroporto}', '${cidadeAeroporto}', '${bairroAeroporto}', '${ruaAeroporto}');
                    SELECT @@IDENTITY AS ID`;
    }
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarTorre(fkAeropoto){
    var instrucao = `INSERT INTO torre (fkAeroporto) VALUES ('${fkAeropoto}');`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    cadastrarTorre,
    cadastrarAeroporto,
};