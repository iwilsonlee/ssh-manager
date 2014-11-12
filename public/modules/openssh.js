var exec = require('child_process').exec;

exports.connect = function(scriptFilePath){
  var last = exec('open ' + scriptFilePath);

  last.stdout.on('data', function (data) {
    console.log('标准输出：' + data);
  });

  last.on('exit', function (code) {
    console.log('子进程已关闭，代码：' + code);
  });
}
