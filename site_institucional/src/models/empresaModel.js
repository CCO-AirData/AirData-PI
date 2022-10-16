var database = require("../database/config")

function cadastrar(nomeEmpresa,cnpjEmpresa,telefoneEmpresa) {
    if(process.env.AMBIENTE_PROCESSO == "desenvolvimento") {

    } else if(process.env.AMBIENTE_PROCESSO == "producao") {
        var instrucao = `INSERT INTO empresa (nomeEmpresa,cnpjEmpresa,telefoneEmpresa) VALUES ('${nomeEmpresa}', '${cnpjEmpresa}', '${telefoneEmpresa}');
                        SELECT @@IDENTITY AS ID;`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    }
    return database.executar(instrucao);
}

module.exports = {
    cadastrar
};