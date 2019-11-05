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
  let p =req.body.project_code 

  
  // 勤務時間計算
  // 初めに出勤時間と退勤時間と休憩時間から労働時間の算出
  let hour ;
  let min ;
  let total = '';
  let R = '';
  let I = '';
  let O = '';
  let time = '';

  let FT = req.body.LeaveTime.split(':');
  O = new Date('','','',FT[0],FT[1]);

  let ST = req.body.AttTime.split(':');
  I = new Date('','','',ST[0],ST[1]);

  let RT = req.body.RestTime.split(':');
  R = new Date('','','',RT[0],RT[1]);

  console.log('O: ' + O)
  console.log('I: ' + I)

// 日付をまたいで作業をした場合の処理
if(O < I){
  FT[0] = Number(FT[0]) + 24;
  O = new Date('','','',FT[0],FT[1]);
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
  // ここまでが労働時間の計算

  // 工数ごとの開始時間と狩猟時間の算出

  
  let LT = req.body.leave_time
  let AT = req.body.att_time
  let Ltime = [];
  let totaltime = [];
  let timesum = 0;

  // 行ごとの作業時間を求めるまで繰り返す
  for(let num = 0; num<LT.length;num++ ){
  
  // 行ごとの時間と分を各変数に格納
  Ltime = LT[num].split(':');
  Atime = AT[num].split(':');

  Ltime[num] = new Date('','','',Ltime[0],Ltime[1]);
  Atime[num] = new Date('','','',Atime[0],Atime[1]);
  totaltime[num] = Ltime[num] - Atime[num];
  
  timesum = timesum + totaltime[num]

  for(hour = 0;totaltime[num] >= 1000*60*60;hour++){
    totaltime[num] = totaltime[num] - 1000*60*60;
  }
  for(min = 0;totaltime[num] >= 1000*60;min++){
    totaltime[num] = totaltime[num] - 1000*60;
  }
  totaltime[num] = hour + ':' + min;
  }

  //労働時間比較用変数 
    // for(hour = 0;timesum >= 1000*60*60;hour++){
    //   hour = timesum - 1000*60*60;
    // }
    // for(min = 0;timesum >= 1000*60;min++){
    //   min = timesum - 1000*60;
    // }
    // timesum = hour + ':' + min;

  console.log('Ltime: ' + Ltime);
  console.log('Atime: ' + Atime);
  console.log('totaltime: ' + totaltime);
  console.log('timesum: ' + timesum)

  // 単一行と複数行の登録
  if(!Array.isArray(p)){
    p=1
  }
  console.log(p)
  for(i ; i < p.length ; i++){

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