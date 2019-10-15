// ログイン機能
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

// ログインするための情報の入力を促す
router.get('/', function(req, res, next) {
  res.render('login', {
    title:'勤怠管理システム', 
    content:'ユーザーIDとパスワードを入力してください。',
  });
});

// 入力された時の処理。DBへ照合を行い、一致した場合sessionを付与する
router.post('/',function( req, res, next ){
  let nm = req.body.name;
  let pass = req.body.password;
  let request = req;
  console.log( 'name: ' + nm )
  console.log( 'password: ' + pass )
  pool.connect( function(err, client) {
    // DBにアクセスできるかどうかの判断を行う
    if (err) {
      console.log(err);
    } else {
      client.query("SELECT * FROM user_dt where name = '" + nm + "' and password ='" + pass + "'", 
      function (err, model) {
        console.log(model.rows);
        console.log(model);
        // DBに照合を行ったとき情報が返ってくるかの判断を行う
        if ( model.rows == '' ){
          res.render('login', {
            title: '再入力',
            content: '名前とパスワードが一致しません'
          })
        } else {
          request.session.login = 'id';
          res.render('home', {
            title: '勤怠管理システム',
            content:model.rows[0].name + 'でログイン',
            datas: model.rows,
          })
        console.log(req.session);
        }
      });
    }
  });
});

module.exports = router;