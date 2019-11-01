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
    res.redirect('http://localhost:3000/');
  }
  res.render('record', {
    title: '工数勤怠　登録'
  });
});

router.post( '/', async function(req, res ,next){
  let i = 0
  let query = [];
  let p =req.body.project_code.length 

  
  // 勤務時間計算
  let hour ;
  let min ;
  let total = '';
  let R = '';
  let I = '';
  let O = '';
  let time = '';

  // 調整が必要 =>get,setか、ちょうどよい日付を見つけるか。
  let LT = req.body.LeaveTime.split(':');
  O = new Date('','','',LT[0],LT[1]);

  let ST = req.body.AttTime.split(':');
  I = new Date('','','',ST[0],ST[1]);

  let RT = req.body.RestTime.split(':');
  R = new Date('','','',RT[0],RT[1]);

  console.log('O: ' + O)
  console.log('I: ' + I)

// 日付をまたいで作業をした場合の処理
if(O < I){
  LT[0] = Number(LT[0]) + 24;
  O = new Date('','','',LT[0],LT[1]);
  console.log('if O: ' + O)
}

  time = O - I

  for(hour = 0;time >= 1000*60*60;hour++){
    time = time - 1000*60*60;
  }
  for(min = 0;time >= 1000*60;min++){
    time = time - 1000*60;
  }

  total = hour + ':' + min

  // O = new Date(d[0],d[1],d[2],hour,min)
  O = new Date('','','',hour,min)

  console.log('O: ' + O);
  console.log('R: ' + R);

  time = O - R

  for(hour = 0;time >= 1000*60*60;hour++){
    time = time - 1000*60*60;
  }
  for(min = 0;time >= 1000*60;min++){
    time = time - 1000*60;
  }

  total = hour + ':' + min

  console.log('time2: ' + time)
  console.log('total2: ' + total)
  

  // 単一行と複数行の登録
  if(!Array.isArray(p)){
    p=1
  }
  console.log(p)
  for(i ; i < p ; i++){

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
                total
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