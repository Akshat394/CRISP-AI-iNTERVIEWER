import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  Firestore,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5tAl_edtWEtPZv4bJYL2G4TQTinvgEss",
  authDomain: "crisp-ai-41c4d.firebaseapp.com",
  projectId: "crisp-ai-41c4d",
  storageBucket: "crisp-ai-41c4d.firebasestorage.app",
  messagingSenderId: "809670942705",
  appId: "1:809670942705:web:bf09d247508190301aee50",
  measurementId: "G-CSECEJK3P1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore with optimized settings
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
  experimentalForceLongPolling: true, // Use long polling instead of WebSockets
  ignoreUndefinedProperties: true // Ignore undefined fields in documents
});

// Setup connection state listeners
const setupConnectionListeners = () => {
  // Add connection state listeners
  window.addEventListener('online', () => {
    console.log('Connection restored, syncing Firestore data');
  });
  
  window.addEventListener('offline', () => {
    console.log('Connection lost, Firestore using cached data');
  });
  
  // Log successful initialization
  console.log('Firestore initialized with persistent cache');
};

// Initialize connection listeners
setupConnectionListeners();

export default app;
