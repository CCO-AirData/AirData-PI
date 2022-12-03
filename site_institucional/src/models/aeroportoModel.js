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

function selecionarUltimoIdAeroporto() {
    let instrucao = `SELECT MAX(idAeroporto) AS id FROM aeroporto ORDER BY id DESC;`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarAeroportoDimensional(id, nome, cep, numero, uf, cidade, bairro, rua){
    let instrucao = `INSERT INTO dim_aeroporto (id, nome, cep, num, uf, cidade, bairro, rua) VALUES ('${id}', '${nome}', '${cep}', ${numero}, '${uf}', '${cidade}', '${bairro}', '${rua}');`;
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
    selecionarUltimoIdAeroporto,
    cadastrarAeroportoDimensional,
};