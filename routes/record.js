var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;


// 行の増減に関するコード
/**
 * ----------------------------------------------------------
 * addList()
 * ＋を押した行の番号をインクリメントした行を追加する
 * ----------------------------------------------------------
 */
function addList(obj) {
  var tr=obj.parentNode.parentNode;
  var num=tr.cells[0].innerHTML;
  num++;
 
  document.all.listOperation.innerHTML = document.all.listOperation.innerHTML
                                       + '<tr><td>'+ num +'</td>'
                                       + '<td><input type="button" value="－" onClick="deleteList(this)">'
                                       + '<input type="button" value="＋" onClick="addList(this)"></td></tr>';
 
}
 
/**
 * ----------------------------------------------------------
 * deleteList()
 * －ボタンを押した行を削除する
 * ----------------------------------------------------------
 */
function deleteList(obj) {
  var tbody=document.getElementById("listOperation");
  var tr=obj.parentNode.parentNode;
  tbody.removeChild(tr);
}

