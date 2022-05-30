# 👪 Family Meal Planner

## 📝 Table of Contents

- [About](#about)
- [Live Demo](#live-demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Run Locally](#run-locally)
- [Build](#build)
- [Deploy](#deploy)

## 🍽️ About

Family Meal Planner is an app to help families plan their meals and automatically generate shopping lists to save time to do better things.

<p align="center">  
 <img src="https://user-images.githubusercontent.com/48583281/170964250-6b96a98f-92c6-400a-828d-4dcbd1639564.gif" alt="Demo">
</p>

## 🎮 Live Demo

A working demo of the app can be found here:

[https://andrewvo89.github.io/family-meal-planner-demo/](https://andrewvo89.github.io/family-meal-planner-demo/)

## 🍼 Prerequisites

1. Create a new Firebase project via the Firebase Console.
2. Create a web app via `Project settings` > `Add app`.
3. Open `src/_firebase/index.tsx` and copy your Firebase project settings from your to the `firebaseConfig` constant.

## 💿 Installation

```
yarn install
```

## 🏃 Run Locally

```
yarn start
```

## 🔨 Build

```
yarn build
```

## 🚀 Deployment

In order to deploy to Firebase Hosting, a Firebase project must be initialized using the `firebase cli` first.

```
yarn deploy
```

If deploying to another provider, run their respective script to deploy from the `src/build` folder.
