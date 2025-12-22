import { useState, useEffect, useCallback } from "react";
import {
  signInWithPopup,
  signInWithPhoneNumber,
  signInAnonymously as firebaseSignInAnonymously,
  signOut,
  onAuthStateChanged,
  ConfirmationResult,
  User,
} from "firebase/auth";
import { auth, googleProvider, setupRecaptcha } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

interface UseFirebaseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  confirmationResult: ConfirmationResult | null;
  signInWithGoogle: () => Promise<boolean>;
  signInAsGuest: () => Promise<boolean>;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useFirebaseAuth = (): UseFirebaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Google Sign-In
  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      toast({
        title: "Welcome!",
        description: `Signed in as ${result.user.displayName || result.user.email}`,
      });
      return true;
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Guest Sign-In (Anonymous)
  const signInAsGuest = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await firebaseSignInAnonymously(auth);
      setUser(result.user);
      toast({
        title: "Welcome, Guest!",
        description: "You're playing as a guest. Sign in later to save your progress.",
      });
      return true;
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      toast({
        title: "Guest login failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send OTP
  const sendOtp = useCallback(async (phoneNumber: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Setup recaptcha
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");
      
      // Format phone number (add +91 if not present)
      const formattedPhone = phoneNumber.startsWith("+") 
        ? phoneNumber 
        : `+91${phoneNumber.replace(/\D/g, "")}`;
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${formattedPhone}`,
      });
      return true;
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      toast({
        title: "Failed to send OTP",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify OTP
  const verifyOtp = useCallback(async (otp: string): Promise<boolean> => {
    if (!confirmationResult) {
      setError("No verification in progress");
      return false;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await confirmationResult.confirm(otp);
      setUser(result.user);
      setConfirmationResult(null);
      toast({
        title: "Verified!",
        description: "Phone number verified successfully",
      });
      return true;
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [confirmationResult]);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      toast({
        title: "Signed out",
        description: "See you next time!",
      });
    } catch (err: any) {
      console.error("Logout error:", err);
    }
  }, []);

  return {
    user,
    loading,
    error,
    confirmationResult,
    signInWithGoogle,
    signInAsGuest,
    sendOtp,
    verifyOtp,
    logout,
    clearError,
  };
};

// Helper function to get user-friendly error messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/popup-closed-by-user":
      return "Sign in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Popup was blocked. Please allow popups for this site.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email.";
    case "auth/invalid-phone-number":
      return "Invalid phone number. Please check and try again.";
    case "auth/missing-phone-number":
      return "Please enter a phone number.";
    case "auth/quota-exceeded":
      return "Too many attempts. Please try again later.";
    case "auth/invalid-verification-code":
      return "Invalid OTP. Please check and try again.";
    case "auth/code-expired":
      return "OTP has expired. Please request a new one.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "An error occurred. Please try again.";
  }
}

export default useFirebaseAuth;
