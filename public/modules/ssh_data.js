var fs = require('fs');
// var JSON = require('./json2.js');
var appResourcesName = "/ssh-manager";
var configFile = appResourcesName + '/config.json';
var scriptFile = appResourcesName + '/script.sh';
var exec = require('child_process').exec;
// last = exec('echo $HOME');
var new_entity;

function initPath(callback){
  exec('echo $HOME').stdout.on('data', function (data) {
    var userPath = data.trim();
    var configFileName = userPath + configFile;
    var scriptFileName = userPath + scriptFile;

    var appResourcesPath = userPath + appResourcesName;

    fs.exists(appResourcesPath,function(result){
      console.log("file path result is : " + result);
      if(!result){
        makePath(appResourcesPath,function(e){
          if(e){
            console.log('Error: ' + err);
            return;
          }
          fs.exists(configFileName, function(r1){
            if(!r1){
              writeToFile(configFileName,"");
            }
            fs.exists(scriptFileName, function(r2){
              if(!r2){
                writeToFile(scriptFileName,"");
              }
            });
          });
        });

      }
    });

    callback(configFileName,scriptFileName);
  });
}

function SshData(documentsData){
   this.ssh_name = documentsData.getElementById('ssh_name').value;
   this.ssh_ip = documentsData.getElementById('ssh_ip').value;
   this.ssh_port = documentsData.getElementById('ssh_port').value;
   this.ssh_username = documentsData.getElementById('ssh_username').value;
   this.ssh_password = documentsData.getElementById('ssh_password').value;
   this.keyFile = documentsData.getElementById('keyDialog').value;
   this.entity = {
     name:this.ssh_name,
     ip:this.ssh_ip,
     port:this.ssh_port,
     username:this.ssh_username,
     password:this.ssh_password,
     keyfile:this.keyFile
   };
   new_entity = this.entity;
  //  this.array = {id:0,sshEntity:this.entity};
}


SshData.prototype.addData = function(){
// console.log('data1 is : '+ JSON.stringify(this.entity));
// console.log('file path is:' + configFileName);
  getAllData(function(data){
    // var newSSh = new SSHEntity();
    // console.log('getAllData : '+JSON.stringify(data) );
    var newId = data.length==0?1:(data.length+1);
    var newSSh = {id:newId,sshEntity:new_entity};
    // console.log("this.entity : "+ JSON.stringify(new_entity));
    // console.log("newssh : "+ JSON.stringify(newSSh));
    //like : {id:1,sshEntity:newSSh.entity} | \n
    var content = JSON.stringify(newSSh) + "|\n";
    addContent(content);
  });

}

function addContent(scriptContent){
  initPath(function(configFileName,scriptFileName){
    fs.open(configFileName,"a",0755,function(e,fd){
        if(e) throw e;
        fs.write(fd,scriptContent,function(e){
            if(e) throw e;
            fs.closeSync(fd);
        });
    });
  });

}

function getAllData(callback){
  readContent(function(data){
    var jsonArray = [];
    if(data){
      var dataArray = data.split('|');
      var dataLength = dataArray.length-1;
      // console.log("read data : " + data);
      // console.log("data length :" + dataArray.length);
      for(var i=0; i<dataLength; i++){
        // console.log("temp data : " + dataArray[i]);
        var aJson = JSON.parse(dataArray[i]);
        jsonArray[i] = aJson;
      }
    }
    callback(jsonArray);

  });
}

function getById(id, callback){
  getAllData(function(jsonArray){
    for(var i in jsonArray){
      var data = jsonArray[i];
      if(data.id == id){
        callback(data.sshEntity);
        break;
      }
    }
  });
}

function deleteById(id){
  getAllData(function(jsonArray){
    var newContent = "";
    var n = 0;
    for(var i in jsonArray){
      var data = jsonArray[i];
      if(data.id != id){
        data.id=n+1;
        newContent += JSON.stringify(data) + "|\n";
        n++;
      }
    }

    writeContent(newContent);

  });
}

SshData.prototype.updateEntity = function(id){

  var newSSh = {id:parseInt(id),sshEntity:new_entity};

  getAllData(function(jsonArray){
    var newContent = "";
    for(var i in jsonArray){
      var data = jsonArray[i];
      if(data.id == newSSh.id){
        if(!new_entity.keyfile){
          new_entity.keyfile = data.sshEntity.keyfile;
          newSSh = {id:parseInt(id),sshEntity:new_entity};
        }
        data = newSSh;
      }
      data.id=parseInt(i)+1;
      newContent += JSON.stringify(data) + "|\n";
    }

    writeContent(newContent);

  });
}

function writeContent(newContent){
  initPath(function(configFileName,scriptFileName){
    writeToFile(configFileName,newContent);
  });

}

function writeScript(newContent){
  initPath(function(configFileName,scriptFileName){
    writeToFile(scriptFileName,newContent);
  });


}

function writeToFile(filepath, content){
  fs.open(filepath,"w",0755,function(e,fd){
      if(e) throw e;
      fs.write(fd,content,function(e){
          if(e) throw e;
          fs.closeSync(fd);
      });
  });
}

function makePath(pathName, callback){
  fs.mkdirSync(pathName, 0755, callback());
}

function readContent(callback){
  // console.log('process.cwd() : ' + process.cwd());
  initPath(function(configFileName,scriptFileName){
    fs.readFile(configFileName, 'utf8', function (err, data) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }

      // console.dir(data);

      callback(data);
    });
  });

}

SshData.prototype.readData = function(callback){
  readContent(callback);
}

exports.readContent = readContent;
exports.getAllData = getAllData;
exports.getById = getById;
exports.deleteById = deleteById;
exports.writeScript = writeScript;
exports.SshData = SshData;
