const express = require('express');
const router = express.Router();
const pg = require('pg');

const pool = pg.Pool({
  database: 'testdb',
  user: 'postgres', 
  password: 'password', 
  host: 'localhost',
  port: 5432,
});

router.get('/', function(req, res, next) {
  res.render('index', {
    title:'勤怠管理システム', 
    content:'ユーザーIDとパスワードを入力してください。',
  });
});

router.post('/',function( req, res, next ){
  let nm = req.body.name;
  let pass = req.body.password;
  console.log( 'name: ' + nm )
  console.log( 'password: ' + pass )
  pool.connect( function(err, client) {
    if (err) {
      console.log(err);
    } else {
      client.query("SELECT * FROM user_dt where name = '" + nm + "' and password ='" + pass + "'", function (err, result) {
        console.log(result.rows);
        console.log(result);
        // session作成後置き換える必要あり。
        if ( result.rowCount == 0 ){
          res.render('index', {
            title: '再入力',
            content: '名前とパスワードが一致しません'
          })
        } else {
          // html文にデータの引き渡し
          // result.rowsは配列型なので注意が必要
          // indexに持っていく必要はないので、システムのホーム画面を作成後そちらにrenderを設定
          res.render('index', {
            title: '勤怠管理システム',
            content:result.rows[0].name + 'でログイン',
            datas: result.rows,
          })
        }
      })
    }
  })
})

module.exports = router;