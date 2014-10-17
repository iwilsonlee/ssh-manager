global.$ = $;

var openssh = require("./js/openssh");
var gui = require('nw.gui');
var win = gui.Window.get();
var ssh_data = require("./js/ssh_data");

$(document).ready(function() {
  // ssh_data.readContent(function(data){
  //   apendText(JSON.stringify(data));
  // });
  var btnSave = document.querySelector('#btn_save');
  var btnCancel = document.querySelector('#btn_cancel');
  var elementTitle = document.getElementById('editor_title');

  var ssh_id = getUrlPara("ssh_id");
  // alert('ssh_id='+ssh_id);
  if(ssh_id && ssh_id!=0){
    ssh_data.getById(ssh_id,function(sshEntity){
      // alert("sshEntity=" + JSON.stringify(sshEntity));
      document.getElementById('ssh_name').value = sshEntity.name;
      document.getElementById('ssh_ip').value = sshEntity.ip;
      document.getElementById('ssh_port').value = sshEntity.port;
      document.getElementById('ssh_username').value = sshEntity.username;
      document.getElementById('ssh_password').value = sshEntity.password;
      if(sshEntity.keyfile){
        document.getElementById('keyFileContent').style.display = 'block';
        document.getElementById('keyFilePath').innerHTML = sshEntity.keyfile;
      }
    });
    btnSave.value = '确认修改';
    elementTitle.innerHTML = '修改SSH';
  }else{
    btnSave.value = '确认新增';
    elementTitle.innerHTML = '新增SSH';
  }

  var chooser = document.querySelector('#keyDialog');
  //对修改选择框的选择文件之后的事件监听代码，获取选择文件的路径。
  chooser.addEventListener("change", function(evt){
    apendText(this.value);
  }, false);



  btnSave.addEventListener("click", function(evt){
    var ssh_name = document.getElementById('ssh_name').value;
    var ssh_ip = document.getElementById('ssh_ip').value;
    var ssh_port = document.getElementById('ssh_port').value;
    var ssh_username = document.getElementById('ssh_username').value;
    var ssh_password = document.getElementById('ssh_password').value;
    var keyFile = document.getElementById('keyDialog').value;

    var scriptContent = "ssh_name;"+ssh_name +
    " | ssh_ip:"+ssh_ip +
    " | ssh_port:"+ssh_port +
    " | ssh_username:"+ssh_username +
    " | ssh_password:"+ssh_password +
    " | keyFile:"+keyFile;
    apendText(scriptContent);

    var SshData = new ssh_data.SshData(document);
    if(ssh_id && ssh_id!=0){
      SshData.updateEntity(ssh_id);
    }else{
      // ssh_data.addContent("dfsdfsfsfsdf");
      SshData.addData();
    }

    win.close();
  }, false);

  btnCancel.addEventListener("click", function(evt){
    win.close(true);
  }, false);

  function apendText(text){
    var element = document.createElement('div');
    element.appendChild(document.createTextNode(text));
    document.body.appendChild(element);
  }

  function getUrlPara(paraName){
    var sUrl  =  location.href;
    var sReg  =  "(?:\\?|&){1}"+paraName+"=([^&]*)"
    var re=new RegExp(sReg,"gi");
    re.exec(sUrl);
    return RegExp.$1;
  }

});
