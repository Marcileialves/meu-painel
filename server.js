const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let inventarioContas = {};

// Rota onde o executor do celular vai enviar os dados (POST)
app.post('/meu-painel', (req, res) => {
    const { username, level, fruits } = req.body;
    
    inventarioContas[username] = { 
        level: level || 0, 
        frutas: fruits || [], 
        atualizadoEm: new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }) 
    };
    
    console.log(`[NUVEM] Conta atualizada: ${username}`);
    res.status(200).send({ status: "Sucesso" });
});

// Rota onde você entra no navegador para ver a tabela (GET)
app.get('/meu-painel', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Painel Global Blox Fruits</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body{font-family:sans-serif;background:#121214;color:#fff;padding:20px}
                table{width:100%;border-collapse:collapse;margin-top:20px}
                th,td{border:1px solid #29292e;padding:12px;text-align:left}
                th{background:#1f1f23;color:#00e77f}
                h2{color:#00e77f}
            </style>
        </head>
        <body>
            <h2>Estoque das Minhas Contas — Global</h2>
            <table>
                <tr><th>Conta</th><th>Nível</th><th>Frutas no Baú</th><th>Última Atualização</th></tr>
                ${Object.keys(inventarioContas).map(user => `
                    <tr>
                        <td><strong>${user}</strong></td>
                        <td>${inventarioContas[user].level}</td>
                        <td>${inventarioContas[user].frutas.join(', ') || '<i>Nenhuma fruta encontrada</i>'}</td>
                        <td>${inventarioContas[user].atualizadoEm}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `);
});

// Correção: Faz o link puro sem o barra redirecionar direto para a tabela
app.get('/', (req, res) => {
    res.redirect('/meu-painel');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando globalmente na porta ${PORT}`));
