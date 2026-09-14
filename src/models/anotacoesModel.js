let database = require("../database/config")

function cadastrar(tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao){
     console.log("ACESSEI O anotacoes MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao);
        var instrucaoSql = `
            INSERT INTO mapleStorage (tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao) VALUES ('${tituloAnotacao}', ${categoriaAnotacao} , ${tecnologiaAnotacao},${conteudoAnotacao}', NOW());
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
}
function buscar(idAnotacao){
        var instrucaoSql = `
            SELECT idAnotacao, tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao FROM mapleStorage WHERE idAnotacao = ${idAnotacao};
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql); 
}
function buscarTodas(){
        var instrucaoSql = `
            SELECT idAnotacao, tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao FROM mapleStorage;
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql); 
}

module.exports = {
    cadastrar,
    buscarTodas
};