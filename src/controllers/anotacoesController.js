function cadastrar(req, res) {
    let tituloAnotacao = req.body.tituloAnotacaoServer;
    let categoriaAnotacao = req.body.categoriaAnotacaoServer;
    let tecnologiaAnotacao = req.body.tecnologiaAnotacaoServer;
    let conteudoAnotacao = req.body.conteudoAnotacaoServer;
    if (tituloAnotacao == undefined || categoriaAnotacao == undefined
        || tecnologiaAnotacao == undefined || conteudoAnotacao == undefined) {
        res.status(400).send(
            "Algum campo inválido!"
        );
    }
    else {
        anotacoesModel.cadastrar(tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao)
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
    anotacoesModel.buscarTodas()
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
    buscarTodas
}