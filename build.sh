rm -r ./android
ionic build
ionic cap add android
cordova-res android --skip-config --copy

cp ./xtras/android/app/google-services.json ./android/app/google-services.json
mv ./android/app/src/main/AndroidManifest.xml ./android/app/src/main/AndroidManifest.xml.bak
cp ./xtras/android/app/src/main/AndroidManifest.xml ./android/app/src/main/AndroidManifest.xml 
mv ./android/build.gradle ./android/build.gradle.bak
cp ./xtras/android/build.gradle ./android/build.gradle
mv ./android/app/build.gradle ./android/app/build.gradle.bak
cp ./xtras/android/app/build.gradle ./android/app/build.gradle

echo ""
echo "Se han modificado los siguientes ficheros:"
echo ""
echo "./android/app/google-services.json"
echo "./android/app/src/main/AndroidManifest.xml"
echo "./android/build.gradle"
echo "./android/app/build.gradle"
echo ""
echo "Modificar la versión de compilación en ./android/app/build.gradle"
echo ""
echo "cuando modifique los ficheros ejecute -> ionic cap open android"
