#!/usr/bin/bash

echo "<!DOCTYPE html>
<html>
<body>

<h1>All my projects:</h1>" > index.html

for dir in */; 
do
	dir_name=${dir%*/}
	# Exception list (folders to not show)
	if [[ "$dir_name" != "libraries" ]];
	then
		# Add the folder with its expected deployment link
		echo "<p><a href='https://maxim-durand.github.io/generativeArt/$dir_name/index.html'>$dir_name</a></p>" >> index.html
	fi
done

echo "</body>
</html>" >> index.html
