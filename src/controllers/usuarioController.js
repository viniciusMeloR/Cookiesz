let usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
    var usuario = req.body.nomeServer;
    var senha = req.body.senhaServer;

    if (usuario == undefined) {
        res.status(400).send(
            "Usuário inválido!"
        );
    }else if (senha == undefined) {
        res.status(400).send(
            "Senha inválida!"
        );

    }
    else {
         usuarioModel.buscarPorUsuario(usuario)
        .then(resultado => {

            if (resultado.length > 0) {
                res.status(409).send("Usuário já existe!");
                return;
            }

            // se não existe, cadastra
            usuarioModel.cadastrar(usuario, senha)
                .then(resultado => {
                    res.json(resultado);
                })
                .catch(erro => {
                    console.log(erro);
                    res.status(500).json(erro.sqlMessage);
                });

        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}
}

function autenticar(req, res) {
    var usuario = req.body.nomeServer;
    var senha = req.body.senhaServer;

    if (usuario == undefined) {
        res.status(400).send("Seu usuário está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(usuario, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                        res.json({
                            id: resultadoAutenticar[0].idUsuario,
                            senha: resultadoAutenticar[0].senha,
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Usuario e/ou senha inválido(s)");
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

module.exports = {
    autenticar,
    cadastrar
}