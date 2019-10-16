var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('record', {
    title: '工数・勤怠　登録'
  });
});

module.exports = router;