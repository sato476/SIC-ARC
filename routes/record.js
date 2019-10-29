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

/* GET users listing. */
router.get('/', function(req, res, next) {
  if( req.session.login == null ){
    res.redirect('/');
  }
  res.render('record', {
    title: '工数勤怠　登録'
  });
});

router.post( '/', async function(req, res ,next){
  // 勤務時間の計算方法の追加が必須
  let i = 0
  let query = [];

  for(i ; i < req.body.project_code.length ; i++){

    query = {
      text: 'INSERT INTO time_dt(id, date, att_time, leave_time, rest_time, product_code, work_content, work_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [ req.session.login,
                req.body.date, 
                req.body.AttTime, 
                req.body.LeaveTime, 
                req.body.RestTime, 
                req.body.project_code[i], 
                req.body.work_content[i], 
                // date,
                '8:00'
              ],
    }
    await pool.query(query,  function (err, res) {
      if(err){
        console.log(err.stack)
      }   
    })
  }
  let test = {
    text: 'select * from time_dt',
  }
  pool.query(test, function (err, res) {
    console.log("log: ")
    console.log( req.body )  
  })
    res.render('record', {
      title: '工数勤怠　登録'
    })
  
})

module.exports = router;