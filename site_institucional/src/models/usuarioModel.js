var database = require("../database/config")

function listar() {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");
    var instrucao = `
        SELECT * FROM usuario;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function entrar(emailUsuario, senhaUsuario) {
    var instrucao = `SELECT * FROM vw_iniciarSessao WHERE emailUsuario = '${emailUsuario}' AND senhaUsuario = '${senhaUsuario}';`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucao
function cadastrar(nomeUsuario,emailUsuario,password,cpfUsuario,tipoUsuario,fkAeroporto){
    var instrucao = `INSERT INTO usuario (nomeUsuario,emailUsuario,senhaUsuario,cpfUsuario,tipoUsuario,fkAeroporto) VALUES ('${nomeUsuario}', '${emailUsuario}', '${password}','${cpfUsuario}','${tipoUsuario}','${fkAeroporto}');`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    entrar,
    cadastrar,
    listar,
};