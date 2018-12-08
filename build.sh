echo "Cleaning up ./build...\n"
rm -rf ./build/*
mkdir ./build/js
mkdir ./build/css
mkdir ./build/img
echo "./build is cleaned up!\n"

echo "Start build:\n"


echo "Build js files..."
for f in ./js/*.js; do
    echo "Compressing ${f}....."
    jname=$(basename "$f" ".js")
    uglifyjs --compress --mangle -- ${f} > ./build/js/${jname}.js
    echo "Done\n"
done

echo "Build html files..."
for f in ./*.html; do
    echo "Compressing ${f}....."
    hname=$(basename "$f" ".html")
    html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true ${f} > ./build/${hname}.html
    echo "Done\n"
done
#echo "Copying html files...."
#cp ./*.html ./build/
#echo "Done\n"


echo "Copying css files...."
cp ./css/* ./build/css/
echo "Done\n"

echo "Copying image files...."
cp ./img/* ./build/img/
cp favicon.ico ./build/
echo "Done\n"