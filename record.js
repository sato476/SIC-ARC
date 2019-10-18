var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  if( req.session.login == null ){
    res.redirect('http://localhost:3000/');
  }
  res.render('record', {
    title: '工数勤怠　登録'
  });
});

router.post( '/', function(req, res ,next){
  console.log(req)
})

module.exports = router;