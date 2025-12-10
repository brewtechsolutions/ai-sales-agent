import admin from "firebase-admin";

let firebaseApp: admin.app.App;

if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle newlines in private key which might be escaped in .env
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin initialized successfully from individual environment variables");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin from env vars:", error);
    process.exit(1);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully from FIREBASE_SERVICE_ACCOUNT json");
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
    process.exit(1);
  }
} else {
  console.warn(
    "WARNING: Firebase credentials not found (checked env vars). Google Login verification will fail."
  );
}

export const auth = firebaseApp! ? firebaseApp.auth() : null;
