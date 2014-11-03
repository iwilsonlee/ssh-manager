global.$ = $;

var openssh = require("./modules/openssh");
var gui = require('nw.gui');
var win = gui.Window.get();
var ssh_data = require("./modules/ssh_data");
var myMenu = require("./modules/menu");
var myShortcut = require("./modules/shortcut");

$(document).ready(function() {

  var manifest = gui.App.manifest;
  win.title = manifest.window.title + " V-" + manifest.version;
  myMenu.Menu(gui);
  // myShortcut.Shortcut(gui);
  ssh_data.getAllData(function(data){
    if(data){
      // console.log("read data :" + JSON.stringify(data));
      var content = "";
      for(var i in data){
        var ssh_id = data[i].id;
        var sshEntity = data[i].sshEntity;
        // console.log("read arrEntity :" + JSON.stringify(data[i]));
        var ssh_name = sshEntity.name;
        var ssh_ip = sshEntity.ip;
        content += createContent(ssh_name,ssh_ip,ssh_id);
      }
      showCotent(content);
    }
  });

  var href_add = document.querySelector('#btn_add');
  // var btn_quit = document.querySelector('#btn_quit');


  href_add.addEventListener('click', function(){
    open_editor_file(0);
  });

  // btn_quit.addEventListener('click', function(){
  //   var app = gui.App;
  //   app.quit();
  // });


  function createContent(ssh_name,ssh_ip,ssh_id){
    var htmlContent = "<tr>"+
      "<td>"+ssh_name+"</td>"+
      "<td>"+ssh_ip+"</td>"+
      "<td>" +
      "<input type='button' value='连接' id='btn_connect' class='btn btn-xs btn-primary' onclick='connect_ssh("+ssh_id+")'/> "+
      "<input type='button' value='编辑' id='btn_update' class='btn btn-xs btn-primary' onclick='update_ssh("+ssh_id+")'/> " +
      "<input type='button' value='删除' id='btn_delete' class='btn btn-xs btn-primary' "+
      "onclick='delete_ssh(\""+ssh_name+"\",\""+ssh_ip+"\","+ssh_id+")'/>" +
      "</td>"+
    "</tr>";
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

  var win_editor = gui.Window.open(editor_file,{position: 'center',
  width: 380,height: 550,focus: true,frame:true,
  toolbar:false,fullscreen:false});
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
    var exec = require('child_process').exec,
    last = exec('echo $HOME');
    last.stdout.on('data', function (data) {
      var userPath = data.trim();
      userPath += "/ssh-manager/script.sh";
      openssh.connect(userPath);
    });

  });
}
