# ssh-manager app for node-webkit

Here are ssh-manager app for [node-webkit](https://github.com/rogerwang/node-webkit).

Please visit [node-webkit group](http://groups.google.com/group/node-webkit) for discussions.

The ssh-manager app can manager the ssh server connection information in MAC OSX.

This app is builded by [grunt](http://gruntjs.com/) and [grunt-node-webkit-builder](https://github.com/mllrsohn/grunt-node-webkit-builder).

这是一个在mac osx系统下进行ssh服务器连线信息管理的app.

此app基于[node-webkit](https://github.com/rogerwang/node-webkit)进行开发。

此app使用[grunt](http://gruntjs.com/)和[grunt-node-webkit-builder](https://github.com/mllrsohn/grunt-node-webkit-builder)进行构建。

---------------------------------------

# Building
To build this app, run the following commands:

<pre>
npm install
cd public/ && npm install && cd -
grunt nodewebkit
</pre>

#Running (Mac)
On Mac, you can now open your app using:
<pre>
open build/ssh-manager/osx/ssh-manager.app/
</pre>
