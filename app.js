var ambiente_processo = process.env.AMBIENTE_PROCESSO || 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");

var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuario");
var anotacoesRouter = require("./src/routes/anotacoes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuario", usuarioRouter);
app.use("/anotacoes", anotacoesRouter);

app.listen(PORTA_APP, HOST_APP, function () {
    console.log(`
=========================================
Servidor do Maple Storage iniciado!
=========================================

Acesse:
http://${HOST_APP}:${PORTA_APP}

Ambiente: ${process.env.AMBIENTE_PROCESSO}

Banco:
${ambiente_processo === 'producao'
    ? 'RDS (banco remoto)'
    : 'Banco local'}

=========================================
`);
});