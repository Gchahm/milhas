import { auth } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { customerService } from './customer.service';

export interface AuthResponse {
  user: User | null;
  error?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signup(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Initialize user document in Firestore
      await customerService.initializeUserDocument(userCredential.user);
      return { user: userCredential.user };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  initializeAuthListener(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  }
}; 