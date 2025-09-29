import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth, db } from './firebase'; // Import db
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { User, UserRole } from '../types'; // Import UserRole

class AuthService {
  async signUp(email: string, password: string, name?: string, role: UserRole = UserRole.INTERVIEWEE): Promise<User> {
    try {
      // Check if user with this email already exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        // User already exists, check their stored role
        const userDocRef = doc(db, 'users', email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const existingUserData = userDoc.data();
          if (existingUserData.role && existingUserData.role !== role) {
            throw new Error(`Account already exists as ${existingUserData.role}. Please sign in with your existing role.`);
          }
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        await updateProfile(firebaseUser, { displayName: name });
        // Store user role in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: firebaseUser.email,
          name: name || '',
          role: role,
        });
      }

      // Return user with the specified role
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || undefined,
        role: role, // Use the role parameter directly
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.mapFirebaseUserToUser(userCredential.user);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => { // Make async
        unsubscribe();
        resolve(firebaseUser ? await this.mapFirebaseUserToUser(firebaseUser) : null); // Await mapFirebaseUserToUser
      });
    });
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => { // Make async
      callback(firebaseUser ? await this.mapFirebaseUserToUser(firebaseUser) : null); // Await mapFirebaseUserToUser
    });
  }

  private async mapFirebaseUserToUser(firebaseUser: FirebaseUser): Promise<User> { // Make async and return Promise<User>
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : {};

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || undefined,
      role: userData.role || UserRole.INTERVIEWEE, // Default role to INTERVIEWEE if not found
    };
  }
}

export const authService = new AuthService();