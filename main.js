global.$ = $;

var openssh = require("./js/openssh");
var gui = require('nw.gui');
var win = require('nw.gui').Window.get();
var scriptPath = 'resources/25.sh';
var ssh_data = require("./js/ssh_data");

$(document).ready(function() {
  ssh_data.getAllData(function(data){
    if(data){
      console.log("read data :" + JSON.stringify(data));
      var content = "";
      for(var i in data){
        var ssh_id = data[i].id;
        var sshEntity = data[i].sshEntity;
        console.log("read arrEntity :" + JSON.stringify(data[i]));
        var ssh_name = sshEntity.name;
        var ssh_ip = sshEntity.ip;
        content += createContent(ssh_name,ssh_ip,ssh_id);
      }
      showCotent(content);
    }
  });
  // var href_connect = document.getElementById('connect');
  // var href_edit = document.getElementById('edit');
  var href_add = document.querySelector('#btn_add');
  //
  // href_connect.addEventListener('click', function(){
  //   openssh.connect(scriptPath);
  // });
  //

  href_add.addEventListener('click', function(){
    // win.window.close();
    // var x = window.screenX;
    // var y = window.screenY;
    // window.open('editor.html','screenX=' + x + ',screenY=' + y);
    open_editor_file(0);
  });
  //
  // function apendText(text){
  //   var element = document.createElement('div');
  //   element.appendChild(document.createTextNode(text));
  //   document.body.appendChild(element);
  // }

  function createContent(ssh_name,ssh_ip,ssh_id){
    var htmlContent = "<div class='row'>"+
      "<div class='col-xs-4'>"+ssh_name+"</div>"+
      "<div class='col-xs-4'>"+ssh_ip+"</div>"+
      "<div class='col-xs-4'>" +
      "<input type='button' value='连接' id='btn_connect' onclick='connect_ssh("+ssh_id+")'/> "+
      "| <input type='button' value='编辑' id='btn_update' onclick='update_ssh("+ssh_id+")'/> " +
      "| <input type='button' value='删除' id='btn_delete' "+
      "onclick='delete_ssh(\""+ssh_name+"\",\""+ssh_ip+"\","+ssh_id+")'/>" +
      "</div>"+
    "</div>";
    return htmlContent;
  }

  function showCotent(content){
    var element = document.getElementById('content');
    // element.appendChild(document.write(htmlContent));
    // document.body.appendChild(element);
    element.innerHTML=content;
  }




});

function update_ssh(ssh_id){
  open_editor_file(ssh_id);
}

function delete_ssh(ssh_name,ssh_ip,ssh_id){
  if(confirm("警告：你确定要删除这条记录吗？[" + ssh_name +"|" + ssh_ip + "]")){
    // alert('已删除');
    ssh_data.deleteById(ssh_id);
    win.reload();
  }
}

function open_editor_file(ssh_id){
  var editor_file = "editor.html?ssh_id="+ssh_id;

  var win_editor = gui.Window.open(editor_file,{position: 'center',width: 400,height: 400,focus: true});
  win_editor.on('close',function(){
    console.log("win_editor closing...");
    this.close(true);
    win.reload();
  });
}

function connect_ssh(ssh_id){
  ssh_data.getById(ssh_id,function(sshEntity){
    var name = sshEntity.name;
    var ip = sshEntity.ip;
    var port = sshEntity.port;
    var username = sshEntity.username;
    var password = sshEntity.password;
    var keyFile = sshEntity.keyfile;
    var scriptcontent = "#!/bin/bash\n";
    scriptcontent += "ssh -p "+port ;
    if(keyFile){
      scriptcontent += " -i " + keyFile;
    }
    scriptcontent += " " +username+"@"+ip;
    ssh_data.writeScript(scriptcontent);
    openssh.connect('resources/script.sh');
  });
}
