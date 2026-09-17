let express = require("express");
let router = express.Router();
let anotacoesController = require("../controllers/anotacoesController");
const e = require("express");

router.post("/cadastrar", function (req,res){
    anotacoesController.cadastrar(req, res);
});

router.get("/buscar/:idAnotacao", function (req,res){
    anotacoesController.buscar(req, res);
});
router.get("/buscarTodas/:idUsuario", function (req,res){
    anotacoesController.buscarTodas(req, res);
});

router.put("/editar/:idAnotacao", function (req,res){
    anotacoesController.editar(req, res);
});
router.delete("/deletar/:idAnotacaoExcluir", function (req,res){
    anotacoesController.excluir(req,res);
});

module.exports = router;