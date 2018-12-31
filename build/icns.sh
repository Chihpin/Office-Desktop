#!/bin/bash

png='icon.png' 
icons='icons.iconset'

rm -r ./icons
rm -r ./icon.icns
rm -r ./icon.ico

mkdir $icons

sips -z 16 16     $png --out $icons/icon_16x16.png

sips -z 32 32     $png --out $icons/icon_16x16@2x.png

sips -z 32 32     $png --out $icons/icon_32x32.png

sips -z 64 64     $png --out $icons/icon_32x32@2x.png

sips -z 64 64     $png --out $icons/icon_64x64.png

sips -z 128 128   $png --out $icons/icon_64x64@2x.png

sips -z 128 128   $png --out $icons/icon_128x128.png

sips -z 256 256   $png --out $icons/icon_128x128@2x.png

sips -z 256 256   $png --out $icons/icon_256x256.png

sips -z 512 512   $png --out $icons/icon_256x256@2x.png

sips -z 512 512   $png --out $icons/icon_512x512.png

sips -z 1024 1024   $png --out $icons/icon_512x512@2x.png

cp -r $icons icons

iconutil -c icns icons.iconset -o icon.icns

rm -r $icons


if command -v png-to-ico >/dev/null 2>&1; then 
    echo ''
else 
    npm i -g png-to-ico >/dev/null
fi

png-to-ico icon.png > icon.ico