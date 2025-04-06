import { auth } from './config.firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  AuthError,
  AuthErrorCodes,
  setPersistence,
  browserLocalPersistence,
  deleteUser as deleteFirebaseUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config.firebase';

/**
 * User profile interface with additional fields
 */
export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Register a new user with name, email and password
 * @param name User's name
 * @param email User's email
 * @param password User's password
 * @param role User's role (default: 'user')
 * @returns Promise resolving to UserCredential
 * @throws {AuthError} If registration fails
 */
export const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  role: string = 'user'
): Promise<UserCredential> => {
  try {
    // Set persistence to LOCAL to persist the auth state
    await setPersistence(auth, browserLocalPersistence);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with the name
    await updateProfile(userCredential.user, {
      displayName: name
    });
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: name,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
    
    // Refresh the user to get updated profile
    await userCredential.user.reload();
    
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        throw new Error('This email is already registered. Please use a different email or login.');
      case AuthErrorCodes.WEAK_PASSWORD:
        throw new Error('Password is too weak. Please use a stronger password.');
      case AuthErrorCodes.INVALID_EMAIL:
        throw new Error('Invalid email address format.');
      default:
        throw new Error(`Registration failed: ${authError.message}`);
    }
  }
};

/**
 * Sign in an existing user with email and password
 * @param email User's email
 * @param password User's password
 * @returns Promise resolving to UserCredential with additional profile data
 * @throws {AuthError} If login fails
 */
export const loginUser = async (email: string, password: string): Promise<UserCredential & {userProfile?: UserProfile}> => {
  try {
    // Set persistence to LOCAL to persist the auth state
    await setPersistence(auth, browserLocalPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Ensure we have the latest user data
    await userCredential.user.reload();

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      return {
        ...userCredential,
        userProfile: userDoc.data() as UserProfile
      };
    }
    
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case AuthErrorCodes.USER_DELETED:
        throw new Error('No account exists with this email. Please register first.');
      case AuthErrorCodes.INVALID_PASSWORD:
        throw new Error('Invalid password. Please try again.');
      case AuthErrorCodes.USER_DISABLED:
        throw new Error('This account has been disabled. Please contact support.');
      default:
        throw new Error(`Login failed: ${authError.message}`);
    }
  }
};

/**
 * Sign in or sign up with Google
 * @param role User's role (default: 'user')
 * @returns Promise resolving to UserCredential
 * @throws {AuthError} If Google authentication fails
 */
export const signInWithGoogle = async (role: string = 'user'): Promise<UserCredential> => {
  try {
    // Set persistence to LOCAL to persist the auth state
    await setPersistence(auth, browserLocalPersistence);
    
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    // If user doesn't exist, create profile
    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        role: role,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
    }
    
    // Ensure we have the latest user data
    await userCredential.user.reload();
    
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        throw new Error('Google sign-in was cancelled. Please try again.');
      case AuthErrorCodes.POPUP_BLOCKED:
        throw new Error('Pop-up was blocked by the browser. Please allow pop-ups and try again.');
      default:
        throw new Error(`Google authentication failed: ${authError.message}`);
    }
  }
};

/**
 * Sign out the current user
 * @returns Promise<void>
 * @throws {AuthError} If logout fails
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(`Logout failed: ${authError.message}`);
  }
};

/**
 * Get the current authenticated user and their Firestore profile
 * @returns Promise resolving to UserProfile or null
 */
export const getCurrentUser = async (): Promise<{ firebaseUser: User; profile: UserProfile | null } | null> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await user.reload();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          resolve({
            firebaseUser: user,
            profile: userDoc.exists() ? (userDoc.data() as UserProfile) : null,
          });
        } else {
          resolve(null);
        }
        unsubscribe();
      });
    });
  };

/**
 * Delete a user account
 * This deletes both the Firebase Auth account and Firestore profile
 * @param options Object containing either password for current user or userId for admin deletion
 * @returns Promise<void>
 * @throws {Error} If deletion fails
 */
export const deleteUserAccount = async (
  options?: string | { password?: string; userId?: string; adminMode?: boolean }
): Promise<void> => {
  try {
    // Handle string parameter as password for backward compatibility
    let password: string | undefined;
    let userId: string | undefined;
    let adminMode = false;

    if (typeof options === 'string') {
      // Backward compatibility - string is treated as password
      password = options;
    } else if (options && typeof options === 'object') {
      // New object-based parameter
      password = options.password;
      userId = options.userId;
      adminMode = options.adminMode || false;
    }

    // For admin deletion (from admin panel)
    if (adminMode && userId) {
      // Only delete the Firestore profile
      await deleteDoc(doc(db, 'users', userId));
      return;
    }

    // For user self-deletion
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    // For email/password users, we need to reauthenticate before deletion
    if (password && user.email && user.providerData.some(provider => provider.providerId === 'password')) {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    }

    // Delete the user's profile from Firestore
    await deleteDoc(doc(db, 'users', user.uid));
    
    // Delete the Firebase Auth account
    await deleteFirebaseUser(user);
    
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case 'auth/requires-recent-login':
        throw new Error('For security reasons, you need to sign in again before deleting your account');
      case 'auth/wrong-password':
        throw new Error('Incorrect password. Please try again');
      default:
        throw new Error(`Failed to delete account: ${authError.message}`);
    }
  }
};