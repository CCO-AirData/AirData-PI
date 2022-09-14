var database = require("../database/config")

function cadastrar(nomeEmpresa,cnpjEmpresa,telefoneEmpresa) {
    var instrucao = `INSERT INTO empresa (nomeEmpresa,cnpjEmpresa,telefoneEmpresa) VALUES ('${nomeEmpresa}', '${cnpjEmpresa}', '${telefoneEmpresa}');`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    cadastrar
};