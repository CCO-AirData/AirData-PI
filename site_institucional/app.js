//process.env.AMBIENTE_PROCESSO = "desenvolvimento";
process.env.AMBIENTE_PROCESSO = "producao";

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA = process.env.AMBIENTE_PROCESSO == "desenvolvimento" ? 3333 : 8080;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var empresaRouter = require("./src/routes/empresa");
var medidasRouter = require("./src/routes/medidas");
var maquinasRouter = require("./src/routes/maquinas");
var alertasRouter = require("./src/routes/alertas");
var metricasRouter = require("./src/routes/metricas");
var acessoQrCodeRouter = require("./src/routes/acessoQrCode")
var processosRouter = require("./src/routes/processos");
var regressaoRouter = require("./src/routes/regressao");
var pythonRouter = require("./src/routes/python");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/empresa", empresaRouter);
app.use("/medidas", medidasRouter);
app.use("/maquinas", maquinasRouter);
app.use("/alertas", alertasRouter);
app.use("/metricas", metricasRouter);
app.use("/processos", processosRouter);
app.use("/acessoQrCode", acessoQrCodeRouter);
app.use("/regressao", regressaoRouter);
app.use("/python", pythonRouter);

app.listen(PORTA, function () {
    console.log(`Você está rodando sua aplicação em Ambiente de ${process.env.AMBIENTE_PROCESSO} \n
    Acesse o caminho a seguir para visualizar: http://localhost:${PORTA}`)
});
