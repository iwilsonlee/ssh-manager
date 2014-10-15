var fs = require('fs');
// var JSON = require('./json2.js');
var fileName = __dirname.substr(0,__dirname.indexOf('js')) + 'resources/config.json';
var scriptFileName = __dirname.substr(0,__dirname.indexOf('js')) + 'resources/script.sh';
var new_entity;

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
console.log('data1 is : '+ JSON.stringify(this.entity));
// console.log('file path is:' + fileName);
  getAllData(function(data){
    // var newSSh = new SSHEntity();
    console.log('getAllData : '+JSON.stringify(data) );
    var newId = data.length==0?1:(data.length+1);
    var newSSh = {id:newId,sshEntity:new_entity};
    console.log("this.entity : "+ JSON.stringify(new_entity));
    console.log("newssh : "+ JSON.stringify(newSSh));
    //like : {id:1,sshEntity:newSSh.entity} | \n
    var content = JSON.stringify(newSSh) + "|\n";
    addContent(content);
  });

}

function addContent(scriptContent){
  fs.open(fileName,"a",0755,function(e,fd){
      if(e) throw e;
      fs.write(fd,scriptContent,function(e){
          if(e) throw e;
          fs.closeSync(fd);
      });
  });
}

function getAllData(callback){
  readContent(function(data){
    var jsonArray = [];
    if(data){
      var dataArray = data.split('|');
      var dataLength = dataArray.length-1;
      console.log("read data : " + data);
      console.log("data length :" + dataArray.length);
      for(var i=0; i<dataLength; i++){
        console.log("temp data : " + dataArray[i]);
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
  writeToFile(fileName,newContent);
}

function writeScript(newContent){
  writeToFile(scriptFileName,newContent);
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

function readContent(callback){
  fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }

    console.dir(data);

    callback(data);
  });
}

SshData.prototype.readData = function(callback){
  readContent(callback);
}

// exports.addContent = addContent;
exports.readContent = readContent;
exports.getAllData = getAllData;
exports.getById = getById;
exports.deleteById = deleteById;
exports.writeScript = writeScript;
exports.SshData = SshData;
