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
  // if( req.session.login == null ){
  //   res.redirect('http://localhost:3000/');
  // }

  let date_sample = req.body.date.split('-');
  console.log('year: ' + date_sample[0]);
  console.log('month: ' + date_sample[1]);
  console.log('day: ' + date_sample[2]);

  const juniji = new Date('','','','00','00');
  const goji = new Date('','','','5','00');
  const asa = new Date('','','','9','00');
  const teji = new Date('','','','17','45');
  const juji = new Date('','','','22','00');
  const juniji2 = new Date('','','1','00','00');
  const asa2 = new Date('','','1','09','00');
  const goji2 = new Date('','','1','5','00');
  const teji2 = new Date('','','1','17','45');
  const juji2 = new Date('','','1','22','00');
  
  
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

  let LT = req.body.leave_time;
  let AT = req.body.att_time;
  let LT_split = [];
  let AT_split = [];

  let Ltime = [];
  let totaltime = [];
  let timesum ;
  let Atime = [];
  let hikaku_hour = 0;
  let hikaku_min = 0;
  let pp = req.body.leave_time; 

  let work_time;
  let long_time;
  let night_time;

  let work_hour;
  let work_min;

  if(!Array.isArray(pp)){
    pp = 1;
    console.log("配列ではない")
    console.log(pp)
  } else {
    pp = req.body.leave_time.length
    console.log("配列だ")
    console.log(pp)
  }

  // 行ごとの作業時間を求めるまで繰り返す

  for(let num = 0; num<pp;num++ ){
  LT_split = LT[num].split(':');
  AT_split = AT[num].split(':');

  // 単一行の時の処理
  if(LT_split == 0){
    LT_split = LT.split(':');
  }
  if(AT_split == 0){
    AT_split = AT.split(':');
  }
  console.log(LT_split);
  console.log(AT_split);
  // 行ごとの時間と分を各変数に格納
    Ltime[num] = new Date('','','',LT_split[0],LT_split[1]);

    Atime[num] = new Date('','','',AT_split[0],AT_split[1]);

    if(Ltime[num] < Atime[num]){
      Ltime[num] = new Date('','','1',LT_split[0],LT_split[1]);
    }

    // ここからが時間ごとの振り分け
    // 9:00に出勤
    if(asa <= Atime[num] && Atime[num] <= teji){
      // 17:45までに退勤
      if(asa <= Ltime[num] && Ltime[num] <= teji){
        console.log('9:00-17:45')
        work_time =  Ltime[num] - Atime[num];
        // 時刻に加工
        if(work_time >= 1000*60){
          for(work_hour = 0 ; work_time >= 1000*60*60 ; work_hour++){
            work_time = work_time - 1000*60*60;
          }
          for(work_min = 0 ; work_time >= 1000*60 ; work_min++){
            work_time = work_time - 1000*60;
          }
          work_time = work_hour + ':' + work_min
        }
        if(long_time >= 1000*60){
          for(work_hour = 0 ; long_time >= 1000*60*60 ; work_hour++){
            long_time = long_time - 1000*60*60;
          }
          for(work_min = 0 ; long_time >= 1000*60 ; work_min++){
            long_time = long_time - 1000*60;
          }
          long_time = work_hour + ':' + work_min
        }
        if(night_time >= 1000*60){
          for(work_hour = 0 ; night_time >= 1000*60*60 ; work_hour++){
            night_time = night_time - 1000*60*60;
          }
          for(work_min = 0 ; night_time >= 1000*60 ; work_min++){
            night_time = night_time - 1000*60;
          }
          night_time = work_hour + ':' + work_min
        }
      // 22:00までに退勤
      }else if(teji < Ltime[num] && Ltime[num] < juji){
        console.log('9:00-22:00')  
      } 
      // 0:00までに退勤
      else if(juji <= Ltime[num] && Ltime[num] < juniji2){
        console.log('9:00-0:00')  
      } 
      // 5:00までに退勤
      else if(juniji <= Ltime[num] && Ltime[num] < goji){
        console.log('9:00-5:00')  
      } 
      // 翌9:00までに退勤
      else if(goji2 <= Ltime[num] && Ltime[num] < asa2){
        console.log('9:00-9:00')  
        work_time =  teji - Atime[num];
        long_time = (juji - teji) + (Ltime[num] - goji2);
        night_time = (juniji2 - juji) + (goji2 - juniji2); 
        // 時刻に加工
        if(work_time >= 1000*60){
          for(work_hour = 0 ; work_time >= 1000*60*60 ; work_hour++){
            work_time = work_time - 1000*60*60;
          }
          for(work_min = 0 ; work_time >= 1000*60 ; work_min++){
            work_time = work_time - 1000*60;
          }
          work_time = work_hour + ':' + work_min
        }
        if(long_time >= 1000*60){
          for(work_hour = 0 ; long_time >= 1000*60*60 ; work_hour++){
            long_time = long_time - 1000*60*60;
          }
          for(work_min = 0 ; long_time >= 1000*60 ; work_min++){
            long_time = long_time - 1000*60;
          }
          long_time = work_hour + ':' + work_min
        }
        if(night_time >= 1000*60){
          for(work_hour = 0 ; night_time >= 1000*60*60 ; work_hour++){
            night_time = night_time - 1000*60*60;
          }
          for(work_min = 0 ; night_time >= 1000*60 ; work_min++){
            night_time = night_time - 1000*60;
          }
          night_time = work_hour + ':' + work_min
        }
        console.log('時間処理の終了')
      }

    console.log('work_time: ' + work_time);
    console.log('long_time: ' + long_time);
    console.log('night_time: ' + night_time);
  }
  
    // ここまでが時間ごとの振り分け


    

  totaltime[num] = Ltime[num] - Atime[num];
  
    timesum = timesum + totaltime[num]

    // 勤務時間の計算
    if(totaltime[num]>=1000*60){
      for(hour = 0;totaltime[num] >= 1000*60*60;hour++){
        totaltime[num] = totaltime[num] - 1000*60*60;
      }
      for(min = 0;totaltime[num] >= 1000*60;min++){
        totaltime[num] = totaltime[num] - 1000*60;
      }
      totaltime[num] = hour + ':' + min;
      hikaku_hour = hikaku_hour + hour;
      hikaku_min = hikaku_min + min;
    }

  //労働時間比較用変数 
  for(hikaku_min;hikaku_min>60;hikaku_hour++){
    hikaku_min = hikaku_min - 60;
  }

    console.log('Ltime: ' + Ltime[num]);
    console.log('Atime: ' + Atime[num]);
    console.log('totaltime: ' + totaltime[num]);
  }

  timesum = hikaku_hour + ':' + hikaku_min
  console.log('timesum: ' + timesum);


  // ちゃんと書けているかの判断
  if(total == timesum){
    console.log("正しく記入されている")
  } else {
    console.log("記入内容に間違いが存在する")
  }

  // (await function(){
  //   query = {
  //     text:'INSERT INTO date_dt( year, month, day, id, att_time, leave_time, rest_time, work_time ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
  //     values: [ date_sample[0],
  //               date_sample[1],
  //               date_sample[2],
  //               req.session.login,
  //               req.body.AttTime,
  //               req.body.LeaveTime,
  //               req.body.RestTime,
  //               total
  //             ]
  //   }
  // })();

  // // 単一行と複数行の登録
  // if(!Array.isArray(p)){
  //   p=1
  // }
  // console.log(p)
  // for(i ; i < p.length ; i++){

  //   query = {
  //     text: 'INSERT INTO time_dt( year, month, day, project_code, work_content, normal_work_time, long_work_time, night_work_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
  //     values: [ date_sample[0],
  //               date_sample[1],
  //               date_sample[2],
  //               req.body.project_code[i], 
  //               req.body.work_content[i],
  //               total
  //             ],
  //   }
  //   await pool.query(query,  function (err, res) {
  //     if(err){
  //       console.log(err.stack)
  //     }   
  //   })
  // }

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