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
    // open_editor_file(0);
    goToEditor(0);
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
  // open_editor_file(ssh_id);
  goToEditor(ssh_id);
}

function delete_ssh(ssh_name,ssh_ip,ssh_id){
  if(confirm("警告：你确定要删除这条记录吗？[" + ssh_name +"|" + ssh_ip + "]")){
    // alert('已删除');
    ssh_data.deleteById(ssh_id);
    win.reload();
  }
}

function apendText(text){
  var apendTextEm = document.getElementById('apendText');
  // var element = apendTextEm.createElement('div');
  apendTextEm.appendChild(document.createTextNode(text));
  // document.body.appendChild(element);
}

  function doEditor(id){
    var btnSave = document.querySelector('#btn_save');
    var btnCancel = document.querySelector('#btn_cancel');
    var elementTitle = document.getElementById('editor_title');

    // var id = getUrlPara("id");
    console.log("editor id is : " + id);
    console.log("editor elementTitle is : " + elementTitle.value);
    // alert('id='+id);
    if(id && id!=0){
      elementTitle.innerHTML = '修改SSH';
      console.log("editor id is : " + id);
      ssh_data.getById(id,function(sshEntity){
        console.log("editor id is : " + id);
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
    }else{
      elementTitle.innerHTML = '新增SSH';
      document.getElementById('ssh_name').value = "";
      document.getElementById('ssh_ip').value = "";
      document.getElementById('ssh_port').value = "";
      document.getElementById('ssh_username').value = "";
      document.getElementById('ssh_password').value = "";
      document.getElementById('keyFileContent').style.display = 'none';
      btnSave.value = '确认新增';
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
      if(id && id!=0){
        SshData.updateEntity(id);
      }else{
        // ssh_data.addContent("dfsdfsfsfsdf");
        SshData.addData();
      }
      $('#myModal').modal('hide');
      // win.close();
      win.reload();
    }, false);

    btnCancel.addEventListener("click", function(evt){
      // win.close(true);
      $('#myModal').modal('hide');
    }, false);
  }

function goToEditor(id){
  // document.location.href = "editor.html?ssh_id="+ssh_id;
  // window.location.assign("editor.html?ssh_id="+ssh_id);

  var targetUrl = "editor.html?ssh_id="+id;
  console.log("targetUrl is : " + targetUrl);
  // $('#myModal').removeData("bs.modal");
  $('#myModal').modal({
    backdrop: 'static',
    keyboard: true,
    show: true,
    remote: targetUrl
  }).on("shown.bs.modal", function() {
    console.log("do something 0000 !!!" + id);
    doEditor(id);
  }).on("hidden.bs.modal", function(e) {
    console.log("do something !!!");
    $(e.target).removeData("bs.modal").find(".modal-content").empty();
    console.log("$(this) length is :" + $('#myModal').length);
    id=0;
  });
}

function open_editor_file(ssh_id){
  var editor_file = "editor.html?ssh_id="+ssh_id;
  win.requestAttention(true);
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
