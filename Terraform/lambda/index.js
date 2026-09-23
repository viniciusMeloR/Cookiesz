const mysql = require("mysql2/promise");

async function conectarComRetry() {

    const maxTentativas = 30;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {

        let connection;

        try {

            console.log(
                `Tentativa ${tentativa}/${maxTentativas}: conectando ao RDS...`
            );

            connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                port: Number(process.env.DB_PORT || 3306)
            });

            console.log("Conexão com o RDS realizada com sucesso!");

            return connection;

        } catch (erro) {

            console.log(
                `RDS ainda não está disponível: ${erro.message}`
            );

            if (connection) {
                await connection.end();
            }

            if (tentativa === maxTentativas) {
                throw erro;
            }

            console.log("Aguardando 10 segundos para tentar novamente...");

            await new Promise(resolve => {
                setTimeout(resolve, 10000);
            });
        }
    }
}


exports.handler = async (event) => {

    let connection;

    try {

        console.log("======================================");
        console.log("Iniciando Lambda do Maple Storage");
        console.log("======================================");

        connection = await conectarComRetry();

        console.log("Criando tabelas...");


        // =====================================================
        // TABELA USUARIO
        // =====================================================

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS usuario (
                idUsuario INT PRIMARY KEY AUTO_INCREMENT,
                usuario VARCHAR(100) NOT NULL,
                senha VARCHAR(255) NOT NULL
                );
        `);

        console.log("Tabela usuario criada/verificada.");


        // =====================================================
        // TABELA MAPLE STORAGE
        // =====================================================

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS mapleStorage (
                idAnotacao INT PRIMARY KEY AUTO_INCREMENT,
                tituloAnotacao VARCHAR(100) NOT NULL,
                categoriaAnotacao VARCHAR(100) NOT NULL,
                tecnologiaAnotacao VARCHAR(100),
                conteudoAnotacao TEXT NOT NULL,
                fkUsuario INT NOT NULL,

                CONSTRAINT fk_usuario_anotacao
                    FOREIGN KEY (fkUsuario)
                    REFERENCES usuario(idUsuario)
            );
        `);

        console.log("Tabela mapleStorage criada/verificada.");


        console.log("======================================");
        console.log("Tabelas criadas com sucesso!");
        console.log("======================================");


        return {
            statusCode: 200,

            body: JSON.stringify({
                sucesso: true,
                mensagem: "Banco de dados inicializado com sucesso!"
            })
        };


    } catch (erro) {

        console.error("======================================");
        console.error("ERRO AO INICIALIZAR O BANCO");
        console.error("======================================");

        console.error(erro);


        return {
            statusCode: 500,

            body: JSON.stringify({
                sucesso: false,
                mensagem: "Erro ao inicializar o banco de dados.",
                erro: erro.message
            })
        };


    } finally {

        if (connection) {

            await connection.end();

            console.log("Conexão com o RDS encerrada.");
        }
    }
};