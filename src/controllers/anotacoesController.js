let anotacoesModel = require("../models/anotacoesModel");

function cadastrar(req, res) {
    let tituloAnotacao = req.body.tituloAnotacaoServer;
    let categoriaAnotacao = req.body.categoriaAnotacaoServer;
    let tecnologiaAnotacao = req.body.tecnologiaAnotacaoServer;
    let conteudoAnotacao = req.body.conteudoAnotacaoServer;
    let idUsuario = req.body.idUsuarioServer
    if (tituloAnotacao == undefined || categoriaAnotacao == undefined
        || tecnologiaAnotacao == undefined || conteudoAnotacao == undefined) {
        res.status(400).send(
            "Algum campo inválido!"
        );
    }
    else {
        anotacoesModel.cadastrar(tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao, idUsuario)
            .then(resultado => {
                res.json(resultado);
            })
            .catch(erro => {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscar(req, res) {
    let idAnotacao = req.params.idAnotacao
    anotacoesModel.buscar(idAnotacao)

    
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarTodas(req, res) {
    let idUsuario = req.params.idUsuario    
    anotacoesModel.buscarTodas(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function editar(req, res) {
    let tituloAnotacao = req.body.tituloAnotacaoServer;
    let categoriaAnotacao = req.body.categoriaAnotacaoServer;
    let tecnologiaAnotacao = req.body.tecnologiaAnotacaoServer;
    let conteudoAnotacao = req.body.conteudoAnotacaoServer;
    let idAnotacao = req.params.idAnotacao
    let idUsuario = req.body.idUsuarioServer
    anotacoesModel.editar(tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao, idAnotacao, idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function excluir(req,res){
    let idAnotacao = req.params.idAnotacao
    let idUsuario = req.body.idUsuarioServer
    anotacoesModel.excluir(idAnotacao, idUsuario)
     .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrar,
    buscar,
    buscarTodas,
    editar,
    excluir
}