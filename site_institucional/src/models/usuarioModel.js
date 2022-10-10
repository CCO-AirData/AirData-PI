var database = require("../database/config")

function listar(fkAeroporto) {
    var instrucao = `SELECT * FROM vw_iniciarSessao WHERE fkAeroporto = ${fkAeroporto};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function entrar(emailUsuario, senhaUsuario) {
    var instrucao = `SELECT * FROM vw_iniciarSessao WHERE emailUsuario = '${emailUsuario}' AND senhaUsuario = '${senhaUsuario}';`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucao
function cadastrar(nomeUsuario,emailUsuario,password,cpfUsuario,tipoUsuario,fkAeroporto, tipoUsuarioCadastrante, idUsuarioCadastrante, fkGestor, cargo){
    if(tipoUsuarioCadastrante == "G") {
        var instrucao = `INSERT INTO usuario (nomeUsuario,emailUsuario,senhaUsuario,cpfUsuario,tipoUsuario,fkAeroporto,fkGestor) VALUES ('${nomeUsuario}', '${emailUsuario}', '${password}','${cpfUsuario}','${cargo}','${fkAeroporto}','${idUsuarioCadastrante}');`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    } else if (tipoUsuarioCadastrante == "S") {
        var instrucao = `INSERT INTO usuario (nomeUsuario,emailUsuario,senhaUsuario,cpfUsuario,tipoUsuario,fkAeroporto,fkGestor,fkSupervisor) VALUES ('${nomeUsuario}', '${emailUsuario}', '${password}','${cpfUsuario}','${cargo}','${fkAeroporto}','${fkGestor}','${idUsuarioCadastrante}');`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    } else {
        var instrucao = `INSERT INTO usuario (nomeUsuario,emailUsuario,senhaUsuario,cpfUsuario,tipoUsuario,fkAeroporto) VALUES ('${nomeUsuario}', '${emailUsuario}', '${password}','${cpfUsuario}','${tipoUsuario}','${fkAeroporto}');`;
        console.log("Executando a instrução SQL: \n" + instrucao);    
    }

    return database.executar(instrucao);
}

function deletar(idUsuario) {
    var instrucao = `DELETE FROM usuario WHERE idUsuario = ${idUsuario};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    entrar,
    cadastrar,
    listar,
    deletar
};