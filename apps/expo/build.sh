#!/bin/bash

HOST='seaon.iptime.org'
PORT='2121'
USER='heyon'
PASS='rkskek112233!'
SOURCE_DIR='android/app/build/outputs/apk/release/'
TARGET_DIR='등산앱(가칭)/베타/'
APP_VERSION="mappingit_0.2.30.apk"

# React Native 빌드
bun x react-native bundle --platform android --dev false \--entry-file App.js \--bundle-output android/app/src/main/assets/index.android.bundle \  --assets-dest android/appbuild/intermediates/res/merged/release/

# 안드로이드 리소스 폴더 삭제
rm -rf ./android/app/src/main/res/raw
rm -rf android/app/src/main/res/drawable-*

# 안드로이드 빌드
cd android
./gradlew assembleRelease
cd ..

# APK 파일 복사
cp android/app/build/outputs/apk/release/"app-release.apk" android/app/build/outputs/apk/release/$APP_VERSION

lftp -p $PORT -u $USER,$PASS $HOST << EOF
cd $TARGET_DIR
mput $SOURCE_DIR$APP_VERSION
EOF