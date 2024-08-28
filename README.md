# Bosch EasyPRO app

## Requirements

### Node.js

Recomended last stable version (LTS) for your OS
[https://nodejs.org/en/download/](https://nodejs.org/en/)

### Ionic framework

[Installing Ionic oficial site](https://ionicframework.com/docs/intro/cli)

```
npm install -g @ionic/cli
```

### Android Studio

Select your OS version:
[https://developer.android.com/studio?hl=es#downloads](https://developer.android.com/studio?hl=es)

## Move to repository folder

```
cd existing_repo
```

## Clone project

```
https://gitlab.com/darecodeprojects/bosch-easypro-app.git
```

## Enter to de cloned folder

```
cd bosch-easypro-app
```

## Change to specific branch if necesary (ej: development)

```
git checkout development
```

## Install Node dependencies

```
npm install
```

## Run the App in browser

```
ionic serve
```

## Build app

### For add android folder

```
ionic build
ionic cap add android
```

### For build and open in Android Studio

```
ionic cap build android
```

### For only open in Android Studio

```
ionic cap open android
```

More info about capacitor cli: [https://capacitorjs.com/docs/cli](https://capacitorjs.com/docs/cli)

### To modify AndroidManifest file

Within your `AndroidManifest.xml` file, change the following:

```diff
<?xml version="1.0" encoding="utf-8"?>
<manifest
  xmlns:android="http://schemas.android.com/apk/res/android"
+  xmlns:tools="http://schemas.android.com/tools"
  package="com.example">

  <application
+    android:hardwareAccelerated="true"
  >
  </application>

+  <uses-permission android:name="android.permission.CAMERA" />

+  <uses-sdk tools:overrideLibrary="com.google.zxing.client.android" />
</manifest>
```

## More information:

In Android Studio you can easly debbug your app, in your mobile device, virtual device, or generate portable APK.
Oficial documentation: [https://developer.android.com/studio/intro](https://developer.android.com/studio/intro?hl=es)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thank you to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.

## Notas para construir APK


1. Eliminar carpeta ./android del projecto
2. Shell: Establece el entorno de trabajo cp ./.env.development /.env
3. Shell: ionic build
4. Shell: ionic cap add android / npx cap sync 
5. Shell: cordova-res android --skip-config --copy

**Nota** El fichero build.sh automatiza los 5 primeros pasos y genera el el fichero google-services.json del (17/12/2021)

6. Descargar google-services.json de nuestro proyecto en la sección Configuración del SDK de Firebase y pegarlo en ./android/app
7. Modifca la versión del SDK en el fichero android/variables.gradle para utilizar la min-sdk 25
8. Modificar el fichero ./android/app/src/main/AndroidManifest.xml 

```diff   

+    <uses-permission android:name="android.permission.CAMERA" />
+    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>


```

9. Modificar el fichero ./android/build.gradle

```diff   
buildscript {
    
    repositories {
        google()
        jcenter()
+        mavenCentral()  // Maven Central repository
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.3.1'
+        classpath 'com.google.gms:google-services:4.3.13'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

apply from: "variables.gradle"

allprojects {
    repositories {
        google()
        jcenter()
+        mavenCentral()  // Maven Central repository
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}

```
10. Modificar el fichero ./android/app/build.gradle

```diff   

  apply plugin: 'com.android.application'
+  apply plugin: 'com.google.gms.google-services'


dependencies {
+  // Import the Firebase BoM
+  implementation platform('com.google.firebase:firebase-bom:31.1.1')


+  // TODO: Add the dependencies for Firebase products you want to use
+  // When using the BoM, don't specify versions in Firebase dependencies
+  implementation 'com.google.firebase:firebase-analytics'


+  // Add the dependencies for any other desired Firebase products
+  // https://firebase.google.com/docs/android/setup#available-libraries
}
```


11. Modificar la versión de compilación en ./android/app/build.gradle

```diff   

        applicationId "com.bosch.easypro"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
+       versionCode 1
+       versionName "1.0"

```

12.a. Shell: ionic cap open android
12.b. Android Studio: Tools->AGP Upgrade Assistans -> Check Upgrade 
12.c. Android Studio: Build->Build Bundle(s) / APK(s)-> Bild APK(s)

13.a. Para generar la APK desde la línea de comandos accede a la carpeta android y ejecuta el comando:
      ./gradlew build