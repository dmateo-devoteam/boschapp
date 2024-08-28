FROM node:18-bookworm-slim as builder
LABEL authors="dmateo"

ARG BUILD_TOOLS=build-tools;34.0.0
ARG PLATFORMS=platforms;android-34

WORKDIR /opt/android-sdk/

# RUN apk --update add openjdk11 curl unzip npm build-base \
#     cairo-dev \
#     pango-dev \
#     jpeg-dev \
#     giflib-dev \
#     librsvg-dev \


RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    npm \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    openjdk-17-jdk-headless

# Establece las variables de entorno
# ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV ANDROID_SDK_ROOT /opt/android-sdk
ENV ANDROID_NDK_HOME /opt/android-ndk
ENV PATH $PATH:$ANDROID_SDK_ROOT/cmdline-tools/bin:$JAVA_HOME/bin:$ANDROID_NDK_HOME

RUN mkdir -p /opt/android-sdk/cmdline-tools
# RUN curl https://dl.google.com/android/repository/commandlinetools-linux-7302050_latest.zip -o cmdline-tools.zip && \
RUN curl https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip -o cmdline-tools.zip && \
    unzip cmdline-tools.zip -d . && \
    rm cmdline-tools.zip

WORKDIR /opt/android-sdk/
RUN mkdir -p /opt/android-ndk

RUN curl https://dl.google.com/android/repository/android-ndk-r27-linux.zip -o ndk-tools.zip && \
    unzip ndk-tools.zip -d . && \
    rm ndk-tools.zip


RUN yes | sdkmanager --licenses  --sdk_root=$ANDROID_SDK_ROOT
RUN sdkmanager --update --sdk_root=$ANDROID_SDK_ROOT
RUN sdkmanager "$BUILD_TOOLS" --sdk_root=$ANDROID_SDK_ROOT
RUN sdkmanager "$PLATFORMS" --sdk_root=$ANDROID_SDK_ROOT

# platforms;android-32
RUN npm install -g ionic cordova cordova-res npm
RUN npm install --platform=linux --arch=x64 -g sharp

WORKDIR /usr/src/app
COPY package.json ./
COPY . .

# Instala las dependencias de node y construye el proyecto con ionic
RUN npm install --legacy-peer-deps
# RUN sed -i 's/"build": "vue-cli-service build"/"ionic:build": "vue-cli-service build"/g' package.json
RUN ionic build

# Añade la plataforma android al proyecto y genera los recursos para android
RUN ionic cap add android
RUN cordova-res android --skip-config --copy

# Copia el archivo google-services.json y reemplaza el archivo AndroidManifest.xml y los archivos de construcción de gradle
RUN mkdir -p ./android/app/src/main/res/raw/ && \
    mkdir -p ./android/app/src/main/res/xml/ && \
    mkdir -p ./signature/
RUN cp ./extras/google-services.json ./android/app/google-services.json
RUN cp ./extras/app/src/main/AndroidManifest.xml ./android/app/src/main/AndroidManifest.xml
RUN cp ./extras/app/src/main/res/xml/network_security_config.xml ./android/app/src/main/res/xml/network_security_config.xml
RUN cp ./extras/app/src/main/res/raw/certificate.crt ./android/app/src/main/res/raw/certificate.crt
RUN cp ./extras/build.gradle ./android/build.gradle
RUN cp ./extras/app/build.gradle ./android/app/build.gradle
RUN sed -i 's/minSdkVersion = 22/minSdkVersion = 25/' ./android/variables.gradle


WORKDIR /usr/src/app/android
RUN chmod +x gradlew
RUN ./gradlew assembleRelease
RUN ./gradlew build bundleRelease

#  gradlew build assembleRelease
#  gradle build assembleRelease

FROM openjdk:17-jdk-slim AS signer

ARG BUILD_TOOLS=build-tools;34.0.0
ARG PLATFORMS=platforms;android-34
ARG SIGN_STOREPASS=Boschbosch
ARG SIGN_KEYPASS=Boschbosch
ARG SIGN_ALIAS=key0

WORKDIR /opt/android-sdk/

# Actualizar paquetes e instalar curl y unzip (si no están ya instalados)
RUN apt-get update && apt-get install -y curl unzip wget zip

ENV ANDROID_SDK_ROOT /opt/android-sdk
ENV PATH $PATH:$ANDROID_SDK_ROOT/cmdline-tools/bin:$JAVA_HOME/bin

RUN mkdir -p /opt/android-sdk/cmdline-tools
RUN curl https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip -o cmdline-tools.zip && \
    unzip cmdline-tools.zip -d . && \
    rm cmdline-tools.zip

# Aceptar todas las licencias
RUN yes | sdkmanager --licenses  --sdk_root=$ANDROID_SDK_ROOT

# Instalar las build tools
RUN sdkmanager --update --sdk_root=$ANDROID_SDK_ROOT
RUN sdkmanager "$BUILD_TOOLS" --sdk_root=$ANDROID_SDK_ROOT
RUN sdkmanager "$PLATFORMS" --sdk_root=$ANDROID_SDK_ROOT


WORKDIR /app

# Generar firma si no se encuentra en /app/signature/
RUN mkdir signature
COPY --from=builder /usr/src/app/signature/keystore.jks ./signature/keystore.jks

RUN if [ ! -f "/app/signature/keystore.jks" ]; then \
        keytool -genkey -v -noprompt \
          -alias $SIGN_ALIAS \
          -dname "CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown" \
          -keystore /app/signature/keystore.jks \
          -storepass $SIGN_STOREPASS \
          -keypass $SIGN_KEYPASS \
          -keyalg RSA -keysize 2048 -validity 10000; \
    fi

# Copia el APK y AAB sin firmar desde el builder
COPY --from=builder /usr/src/app/android/app/build/outputs/apk/release/app-release-unsigned.apk .
COPY --from=builder /usr/src/app/android/app/build/outputs/bundle/release/app-release.aab ./app-release-unsigned.aab


# Firmar el APK
RUN jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /app/signature/keystore.jks -storepass $SIGN_STOREPASS -keypass $SIGN_KEYPASS app-release-unsigned.apk $SIGN_ALIAS
# Alinear el APK
RUN $ANDROID_SDK_ROOT/build-tools/34.0.0/zipalign -v 4 app-release-unsigned.apk app-release-signed.apk

# Firma el AAB
RUN $ANDROID_SDK_ROOT/build-tools/34.0.0/apksigner sign --ks /app/signature/keystore.jks --min-sdk-version 25 --ks-pass pass:$SIGN_STOREPASS --key-pass pass:$SIGN_KEYPASS --out app-release-signed.aab app-release-unsigned.aab

# Comprimiendo carpeta
WORKDIR /
RUN zip -r App_files.zip app
RUN mv App_files.zip app/