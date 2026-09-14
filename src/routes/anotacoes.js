let express = require("express");
let router = express.Router();
let anotacoesController = require("../controllers/anotacoesController");

router.post("/cadastrar", function (req,res){
    anotacoesController.cadastrar(req, res);
});

module.exports = router;