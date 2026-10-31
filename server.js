const express = require('express');
const app = express();
app.use(express.json());

let inventarioContas = {};

app.post('/meu-painel', (req, res) => {
    const { username, level, fruits } = req.body;
    
    // Tratamento de dados seguro para aceitar o formato enviado pelo Roblox
    let listaDeFrutas = [];
    if (Array.isArray(fruits)) {
        listaDeFrutas = fruits;
    } else if (typeof fruits === 'string') {
        listaDeFrutas = [fruits]; // Transforma string em array para não quebrar o .join()
    }

    inventarioContas[username] = { 
        level: level || 0, 
        frutas: listaDeFrutas, 
        atualizadoEm: new Date() 
    };
    
    console.log(`[ATUALIZADO] Conta: ${username}`);
    res.status(200).send({ status: "Sucesso" });
});

app.get('/meu-painel', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Meu Estoque Blox Fruits</title>
            <style>
                body{font-family:sans-serif;background:#121214;color:#fff;padding:20px}
                table{width:100%;border-collapse:collapse}
                th,td{border:1px solid #29292e;padding:12px;text-align:left}
                th{background:#1f1f23}
            </style>
        </head>
        <body>
            <h2>Estoque das Minhas Contas — Global</h2>
            <table>
                <tr><th>Conta</th><th>Nível</th><th>Frutas no Baú</th></tr>
                ${Object.keys(inventarioContas).map(user => `
                    <tr>
                        <td>${user}</td>
                        <td>${inventarioContas[user].level}</td>
                        <td>${inventarioContas[user].frutas.join(', ') || 'Nenhuma'}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `);
});

// Excelente configuração para o Render! Usa a porta deles de forma dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Painel online na porta ${PORT}`));
