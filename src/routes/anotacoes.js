let express = require("express");
let router = express.Router();
let anotacoesController = require("../controllers/anotacoesController");

router.post("/cadastrar", function (req,res){
    anotacoesController.cadastrar(req, res);
});

router.post("/buscar", function (req,res){
    anotacoesController.buscar(req, res);
});
router.post("/buscarTodas", function (req,res){
    anotacoesController.buscarTodas(req, res);
});


module.exports = router;