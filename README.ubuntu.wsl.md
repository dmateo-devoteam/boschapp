```shell
sudo apt install zip unzip curl android-sdk

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc

export ANDROID_SDK_ROOT=/usr/lib/android-sdk
sudo mkdir -p $ANDROID_SDK_ROOT
cd $ANDROID_SDK_ROOT
PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/cmdline-tools/tools/bin
sudo wget https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip
sudo unzip commandlinetools-linux-6858069_latest.zip
cd $ANDROID_SDK_ROOT/cmdline-tools
sudo mkdir latest
sudo mv ./* ./latest/
cd latest/bin

export ANDROID_HOME=/usr/lib/android-sdk/
cd $ANDROID_HOME/tools/bin
sudo $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platforms;android-32" --sdk_root=$ANDROID_HOME
sudo $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "build-tools;30.0.3" --sdk_root=$ANDROID_HOME
sudo $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses --sdk_root=$ANDROID_HOME

rm -rf android
rm -rf node_modules
rm -rf dist
nvm install 18.10
nvm use 18.10
npm i -g @ionic/cli
npm i -g npm@10.1.0
npm i -g cordova-res@latest --save
ionic build
ionic cap add android
cordova-res android --skip-config --copy

cp ./extras/google-services.json ./android/app/google-services.json
mv ./android/app/src/main/AndroidManifest.xml ./android/app/src/main/AndroidManifest.xml.bak
cp ./extras/app/src/main/AndroidManifest.xml ./android/app/src/main/AndroidManifest.xml
cp ./extras/app/src/main/res/xml/network_security_config.xml ./android/app/src/main/res/xml/network_security_config.xml
mkdir -p ./android/app/src/main/res/raw/
cp ./extras/app/src/main/res/raw/certificate.crt ./android/app/src/main/res/raw/certificate.crt
mv ./android/build.gradle ./android/build.gradle.bak
cp ./extras/build.gradle ./android/build.gradle
mv ./android/app/build.gradle ./android/app/build.gradle.bak
cp ./extras/app/build.gradle ./android/app/build.gradle


cd android
./gradlew build assembleRelease --warning-mode all
./gradlew build bundleRelease --warning-mode all
```