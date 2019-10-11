// 格納情報の確認
const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: 'password',
    port: 5432,
})
client.connect()
client.query("SELECT * FROM user_dt WHERE name = 'a'", (err, res) => {
    console.log(err, res.rows)
    client.end()
})
