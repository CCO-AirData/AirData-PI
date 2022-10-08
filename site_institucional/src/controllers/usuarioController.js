var usuarioModel = require("../models/usuarioModel");
var sha512 = require('js-sha512');

function entrar(req, res) {
    var email = req.body.emailPessoalServer;
    var senha = req.body.passwordServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.entrar(email, sha512(senha))
            .then(
                function (resultado) {
                    console.log(`\nResultados encontrados: ${resultado.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultado)}`); // transforma JSON em String

                    if (resultado.length == 1) {
                        console.log(resultado);
                        res.json(resultado[0]);
                    } else if (resultado.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer;
    var cargo = req.body.cargoServer;
    var tipoUsuarioCadastrante = req.body.tipoUsuarioServer;
    var idUsuarioCadastrante = req.body.idUsuarioServer;
    var fkAeroporto = req.body.fkAeroportoServer;
    var fkGestor = req.body.fkGestorServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (cpf == undefined) {
        res.status(400).send("Seu CPF está undefined!");
    } else if (tipoUsuarioCadastrante == undefined) {
        res.status(400).send("O tipo do usuário está undefined!");
    } else if (idUsuarioCadastrante == undefined) {
        res.status(400).send("O id do usuário está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("O cargo do usuário está undefined!");
    } else {
        usuarioModel.cadastrar(nome, email, sha512(senha), cpf, 'G', fkAeroporto, tipoUsuarioCadastrante, idUsuarioCadastrante, fkGestor, cargo)
            .then(
                function (resultado) {
                    console.log(`\nCadastro: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function listar(req, res) {
    var fkAeroporto = req.body.fkAeroportoServer;

    if (fkAeroporto == undefined) {
        res.status(400).send("O id do aeroporto está undefined!");
    } else {
        usuarioModel.listar(fkAeroporto)
            .then(
                function (resultado) {
                    console.log(`\nUsuários: ${resultado}`);
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            )
    }
}

function deletar (req, res) {
    var idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).send("O id do usuário está undefined!");
    } else {
        usuarioModel.deletar(idUsuario)
            .then(
                function (resultado) {
                    res.json(resultado)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao deletar o usuário! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);                   
                }
            )
    }
}

module.exports = {
    entrar,
    cadastrar,
    listar,
    deletar
}