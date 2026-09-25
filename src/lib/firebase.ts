import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

import {
  getAuth,
  connectAuthEmulator,
  type Auth,
} from 'firebase/auth';

import {
  initializeFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';

import {
  getFunctions,
  connectFunctionsEmulator,
  type Functions,
} from 'firebase/functions';


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


// ============================================================
// STATUS KONFIGURASI
// ============================================================

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);


// ============================================================
// EMULATOR SETTINGS
// ============================================================

const useAuthEmulator =
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_AUTH_EMULATOR === 'true';

const useFirestoreEmulator =
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true';

const useFunctionsEmulator =
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true';


// ============================================================
// FIREBASE INSTANCES
// ============================================================

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let functionsInstance: Functions | null = null;


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

if (isFirebaseConfigured) {

  app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);


  // ----------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------

  authInstance = getAuth(app);

  if (useAuthEmulator) {

    connectAuthEmulator(
      authInstance,
      'http://127.0.0.1:9099',
      {
        disableWarnings: true,
      }
    );

    console.log(
      '[Firebase] Auth menggunakan Emulator.'
    );

  } else {

    console.log(
      '[Firebase] Auth menggunakan Firebase asli.'
    );

  }


  // ----------------------------------------------------------
  // FIRESTORE
  // ----------------------------------------------------------

  // NOTE: We intentionally use `initializeFirestore` (instead of the plain
  // `getFirestore`) with `experimentalAutoDetectLongPolling` enabled.
  //
  // Root cause of the "checkout ngebleng" (checkout hangs/freezes) bug:
  // Firestore's default transport is a WebChannel streaming connection.
  // On many Indonesian ISPs, corporate/school networks, VPNs, and with some
  // browser ad-blockers, that streaming connection gets silently blocked –
  // the write Promise then never resolves *and* never rejects, so the
  // checkout button spinner just spins forever ("ngebleng"). Google's Auth
  // popup (used for login) does not use this transport, which is why login
  // still works fine while checkout appears frozen.
  //
  // Auto-detecting long-polling makes Firestore fall back to plain HTTP
  // long-polling automatically when it detects the streaming channel isn't
  // working, which fixes the hang for those users.
  dbInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });

  if (useFirestoreEmulator) {

    connectFirestoreEmulator(
      dbInstance,
      '127.0.0.1',
      8080
    );

    console.log(
      '[Firebase] Firestore menggunakan Emulator.'
    );

  } else {

    console.log(
      '[Firebase] Firestore menggunakan Firebase asli.'
    );

  }


  // ----------------------------------------------------------
  // CLOUD FUNCTIONS
  // ----------------------------------------------------------

  functionsInstance = getFunctions(
    app,
    'us-central1'
  );

  if (useFunctionsEmulator) {

    connectFunctionsEmulator(
      functionsInstance,
      '127.0.0.1',
      5001
    );

    console.log(
      '[Firebase] Functions menggunakan Emulator.'
    );

  } else {

    console.log(
      '[Firebase] Functions menggunakan Firebase asli.'
    );

  }

} else {

  console.error(
    '[Firebase] Konfigurasi Web Firebase tidak lengkap. ' +
    'Pastikan keenam VITE_FIREBASE_* tersedia saat build.'
  );

}


// ============================================================
// EXPORT
// ============================================================

export const auth = authInstance;
export const db = dbInstance;
export const functions = functionsInstance;

export default app;