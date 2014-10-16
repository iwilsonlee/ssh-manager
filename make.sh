#!/bin/bash
filePath=../${PWD##*/}.nw
appPath=../ssh-manager.app/Contents/Resources/app.nw
echo "filePath is $filePath."
echo "appPath is $appPath."
rm -rf $filePath &&
zip -r $filePath * &&
rm -rf $appPath &&
mv $filePath $appPath
echo "make app successful!"
