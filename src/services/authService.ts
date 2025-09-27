import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { User } from '../types';

class AuthService {
  async signUp(email: string, password: string, name?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (name && firebaseUser) {
        await updateProfile(firebaseUser, { displayName: name });
      }

      return this.mapFirebaseUserToUser(firebaseUser);
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
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        unsubscribe();
        resolve(firebaseUser ? this.mapFirebaseUserToUser(firebaseUser) : null);
      });
    });
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? this.mapFirebaseUserToUser(firebaseUser) : null);
    });
  }

  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || undefined,
    };
  }
}

export const authService = new AuthService();
