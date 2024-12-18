#  MAPPINGIT
 사용자에 마커 루트 정보를 저장하여 사용자 로컬 내에서 파일로 관리 할 수 있도록 하는 앱 

### 사용 라이브러리
- rnMapBoxApi
- rnBackgroundGeolocation
- sqlite
- reanimatedCarousel
- fileReducer

#### 초기화면
![image](https://github.com/user-attachments/assets/bf0f663c-334b-4449-89ca-181ff8ec65f4)

#### 마커 정보
![image](https://github.com/user-attachments/assets/730eb63f-61fe-40ca-8707-fde7465e63af)

#### 마커 아이콘 선택
![image](https://github.com/user-attachments/assets/e687884d-787f-4785-8b85-3a73e29bb37b)

#### 마커 추가
![image](https://github.com/user-attachments/assets/c0153f85-441f-4d3e-8644-dc3206e09017)

#### 루트 정보
![image](https://github.com/user-attachments/assets/2c9f0d6d-e638-47c7-bf52-c3141b9beac2)

#### 파일 정보 
![image](https://github.com/user-attachments/assets/c5fd4533-0190-4ea6-84e7-9a03bc3e7e80)

#### 파일 결합
![image](https://github.com/user-attachments/assets/80efb183-588a-4b9a-b8d9-b435885dfaad)

#### 파일 정보 결합
![image](https://github.com/user-attachments/assets/bb70f8f8-2ae7-46d5-9737-0ef54a5b48f8)

#### 추후 개발 사항
1. 다크 라이트 모드 지원
2. 루트 위치 수정 기능 (현재 진행 중)
3. 아이콘 커스텀화
4. 설정 화면에 사용자 커스텀 추가
5. 유저별 권한 관리를 통한 기능의 permission 제공
6. 클라우드 위치 기록
7. Oauth를 활용한 로그인 회원가입 지원
8. 마커, 루트, 파일 검색 기능 추가 위에 slider위에 검색 조건을 걸음
9. 이후 태그를 통해 #버섯 #산중턱 검색 할 수 있게 변경
10. 경로 svg파일로 변환하기
11. 파일 상세 보기 tab-view 제작  [마커 | 파일 리스트 | 루트] 이렇게
12. 스크롤 페이지네이션 lazy loading 추가

# Tamagui + Solito + Next + Expo Monorepo

```sh
npm create tamagui
```

## 🔦 About

This monorepo is a starter for an Expo + Next.js + Tamagui + Solito app.

Many thanks to [@FernandoTheRojo](https://twitter.com/fernandotherojo) for the Solito starter monorepo which this was forked from. Check out his [talk about using expo + next together at Next.js Conf 2021](https://www.youtube.com/watch?v=0lnbdRweJtA).

## 📦 Included packages

- [Tamagui](https://tamagui.dev) 🪄
- [solito](https://solito.dev) for cross-platform navigation
- Expo SDK
- Next.js
- Expo Router

## 🗂 Folder layout

The main apps are:

- `expo` (native)
- `next` (web)

- `packages` shared packages across apps
  - `ui` includes your custom UI kit that will be optimized by Tamagui
  - `app` you'll be importing most files from `app/`
    - `features` (don't use a `screens` folder. organize by feature.)
    - `provider` (all the providers that wrap the app, and some no-ops for Web.)

## 🏁 Start the app

- Install dependencies: `yarn`

- Next.js local dev: `yarn web`

To run with optimizer on in dev mode (just for testing, it's faster to leave it off): `yarn web:extract`. To build for production `yarn web:prod`.

To see debug output to verify the compiler, add `// debug` as a comment to the top of any file.

- Expo local dev: `yarn native`

## UI Kit

Note we're following the [design systems guide](https://tamagui.dev/docs/guides/design-systems) and creating our own package for components.

See `packages/ui` named `@my/ui` for how this works.

## 🆕 Add new dependencies

### Pure JS dependencies

If you're installing a JavaScript-only dependency that will be used across platforms, install it in `packages/app`:

```sh
cd packages/app
yarn add date-fns
cd ../..
yarn
```

### Native dependencies

If you're installing a library with any native code, you must install it in `expo`:

```sh
cd apps/expo
yarn add react-native-reanimated
cd ..
yarn
```

## Update new dependencies

### Pure JS dependencies

```sh
yarn upgrade-interactive
```

You can also install the native library inside of `packages/app` if you want to get autoimport for that package inside of the `app` folder. However, you need to be careful and install the _exact_ same version in both packages. If the versions mismatch at all, you'll potentially get terrible bugs. This is a classic monorepo issue. I use `lerna-update-wizard` to help with this (you don't need to use Lerna to use that lib).

You may potentially want to have the native module transpiled for the next app. If you get error messages with `Cannot use import statement outside a module`, you may need to use `transpilePackages` in your `next.config.js` and add the module to the array there.

### Deploying to Vercel

- Root: `apps/next`
- Install command to be `yarn set version stable && yarn install`
- Build command: leave default setting
- Output dir: leave default setting
