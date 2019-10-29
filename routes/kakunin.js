var express = require('express');
var router = express.Router();
const pg = require('pg');

const pool = pg.Pool({
  database: 'testdb',
  user: 'postgres', 
  password: 'password', 
  host: 'localhost',
  port: 5432,
});

pool.connect();

router.get('/', function( req, res, next){
  if( req.session.login == null ){
    res.redirect('http://localhost:3000/');
  }

  let data
  
  let test = {
    text: 'select * from time_dt where id = $1',
    values: [
              req.session.login,
    ]
  }
  const request = req;
  const response = res;

  pool.query(test, function (err, res) {
    if(err){
      console.log(err.stack)
    }
    console.log(res.rows)
    data = res.rows
    response.render('kakunin', {
      title:'勤怠管理　確認',
      content: data
    })     
  })
})
      module.exports = router;