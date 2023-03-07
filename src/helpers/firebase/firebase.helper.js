// const {initializeApp} = require('firebase-admin/app');
// const {
//     getAuth,
// } = require("firebase/auth");

const FirebaseAdmin = require("firebase-admin");

// const serviceAccount = require("./molerat-16ec2-firebase-adminsdk-p5ysn-3b329a6916.json");
const serviceAccount = {
    "type": process.env.VITE_FIREBASE_TYPE,
    "project_id": process.env.VITE_FIREBASE_PROJECT_ID,
    "private_key_id": process.env.VITE_FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.VITE_FIREBASE_PRIVATE_KEY,
    "client_email": process.env.VITE_FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.VITE_FIREBASE_CLIENT_ID,
    "auth_uri": process.env.VITE_FIREBASE_AUTH_URI,
    "token_uri": process.env.VITE_FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.VITE_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.VITE_FIREBASE_CLIENT_X509_CERT_URL
}
// console.log("serviceAccount", serviceAccount)
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount)
});


// const firebaseConfig = {
//     apiKey: process.env.VITE_FIREBASE_API_KEY,
//     authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.VITE_FIREBASE_APP_ID,
//     measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
// }
// const firebaseApp = initializeApp(firebaseConfig);

module.exports = {
    FirebaseAdmin
};