let database = require("../database/config")

function cadastrar(tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao,idUsuario){
     console.log("ACESSEI O anotacoes MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao, idUsuario);
        var instrucaoSql = `
            INSERT INTO mapleStorage (tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao, fkUsuario) VALUES ('${tituloAnotacao}', '${categoriaAnotacao}' , '${tecnologiaAnotacao}' ,'${conteudoAnotacao}',${idUsuario});
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
function buscarTodas(idUsuario){
        var instrucaoSql = `
            SELECT idAnotacao, tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao,fkUsuario FROM mapleStorage WHERE fkUsuario = ${idUsuario};
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql); 
}
function editar(tituloAnotacao, categoriaAnotacao, tecnologiaAnotacao, conteudoAnotacao, idAnotacao, idUsuario){
        var instrucaoSql = `
            UPDATE mapleStorage SET tituloAnotacao = '${tituloAnotacao}', categoriaAnotacao = '${categoriaAnotacao}',
             tecnologiaAnotacao = '${tecnologiaAnotacao}', conteudoAnotacao = '${conteudoAnotacao}' WHERE idAnotacao = ${idAnotacao} AND fkUsuario = ${idUsuario}
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql); 
}

function excluir(idAnotacao,idUsuario){
     var instrucaoSql = `
            DELETE FROM mapleStorage WHERE idAnotacao = ${idAnotacao} AND fkUsuario = ${idUsuario}
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql); 
}

module.exports = {
    cadastrar,
    buscarTodas,
    buscar,
    editar,
    excluir
};