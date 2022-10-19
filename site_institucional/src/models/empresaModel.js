var database = require("../database/config")

function cadastrar(nomeEmpresa,cnpjEmpresa,telefoneEmpresa) {
    let instrucao = "";
    if(process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucao = `INSERT INTO empresa (nomeEmpresa,cnpjEmpresa,telefoneEmpresa) VALUES ('${nomeEmpresa}', '${cnpjEmpresa}', '${telefoneEmpresa}');`;
    } else if(process.env.AMBIENTE_PROCESSO == "producao") {
        instrucao = `INSERT INTO empresa (nomeEmpresa,cnpjEmpresa,telefoneEmpresa) VALUES ('${nomeEmpresa}', '${cnpjEmpresa}', '${telefoneEmpresa}');
                        SELECT @@IDENTITY AS ID;`; 
    }
    console.log("Executando a instrução SQL: \n" + instrucao);   
    return database.executar(instrucao);
}

module.exports = {
    cadastrar
};