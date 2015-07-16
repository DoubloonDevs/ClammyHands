find ./app.nw 
if [ "$?" == "0" ]
	then
	rm -rf app.nw
fi
zip -r -X app.nw .
echo -n "Enter name of app directory [ENTER]: "
read dir_name
cd ../..
find ./$dir_name
if [ "$?" == "0" ]
	then
	echo "[SUCCESS] Directory found!"
	else
	echo "[ERROR] No directory found with the name $dir_name"
	exit
fi 
cp -R ./nwjs.app ./$dir_name
if [ "$?" == "0" ]
	then
	echo "[SUCCESS] Package found!"
	else
	echo "[ERROR] Package not found! Place app directory with the Node Webkit app."
	exit
fi 
cd ./$dir_name
mv ./bin/app.nw ./nwjs.app/Contents/Resources
cp ./bin/nw.icns ./nwjs.app/Contents/Resources
find ./$dir_name.app
if [ "$?" == "0" ]
	then
	rm -rf ./$dir_name.app
	mv ./nwjs.app ./$dir_name.app
	else
	mv ./nwjs.app ./$dir_name.app
fi
echo "[SUCCESS] $dir_name packaged successfully!"