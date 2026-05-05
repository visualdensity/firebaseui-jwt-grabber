// Firebase project configurations
// Copy this file to secrets.js and fill in your project's credentials from:
// Firebase Console → Project Settings → Your apps → SDK setup and configuration
//
// secrets.js is listed in .gitignore and will NOT be committed to the repository.

const firebaseConfigs = {
  "DEV": {
    apiKey:            "YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID",
  },
  "PROD": {
    apiKey:            "YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID",
  },
};
