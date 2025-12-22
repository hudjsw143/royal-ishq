import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Phone, Mail, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import romanticBg from "@/assets/romantic-bg.jpg";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [loginMethod, setLoginMethod] = useState<"select" | "phone" | "otp">("select");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  
  const { 
    signInWithGoogle, 
    sendOtp, 
    verifyOtp, 
    loading, 
    error,
    clearError 
  } = useFirebaseAuth();

  const handleGoogleLogin = async () => {
    const success = await signInWithGoogle();
    if (success) {
      onLogin();
    }
  };

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length >= 10) {
      const success = await sendOtp(phoneNumber);
      if (success) {
        setLoginMethod("otp");
      }
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length === 6) {
      const success = await verifyOtp(otp);
      if (success) {
        onLogin();
      }
    }
  };

  const handleMethodChange = (method: "select" | "phone" | "otp") => {
    clearError();
    setLoginMethod(method);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
    >
      {/* Recaptcha container for phone auth */}
      <div id="recaptcha-container" />
      
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${romanticBg})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mx-4 w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="font-display text-4xl font-bold">
              <span className="text-gradient-gold">Royal</span>{" "}
              <span className="text-foreground">Ishq</span>
            </h1>
            <p className="mt-2 font-body text-muted-foreground">
              Begin your journey of love
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card rounded-2xl p-8"
        >
          {loginMethod === "select" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="mb-6 text-center font-display text-xl text-foreground">
                Welcome Back
              </h2>

              {/* Google Login */}
              <Button
                variant="glass"
                size="xl"
                className="w-full justify-start gap-4"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                )}
                <span>Continue with Google</span>
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card/80 px-3 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Phone Login */}
              <Button
                variant="gold-outline"
                size="xl"
                className="w-full justify-start gap-4"
                onClick={() => handleMethodChange("phone")}
                disabled={loading}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
                  <Phone className="h-4 w-4 text-secondary" />
                </div>
                <span>Continue with Phone</span>
              </Button>
            </motion.div>
          )}

          {loginMethod === "phone" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Phone className="mx-auto mb-3 h-10 w-10 text-secondary" />
                <h2 className="font-display text-xl text-foreground">
                  Enter your phone number
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll send you a verification code
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-secondary"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handlePhoneSubmit}
                  disabled={phoneNumber.length < 10 || loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={() => handleMethodChange("select")}
                  disabled={loading}
                >
                  ← Back to login options
                </Button>
              </div>
            </motion.div>
          )}

          {loginMethod === "otp" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Mail className="mx-auto mb-3 h-10 w-10 text-secondary" />
                <h2 className="font-display text-xl text-foreground">
                  Enter verification code
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sent to {phoneNumber}
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-2xl tracking-[0.5em] border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground placeholder:tracking-normal placeholder:text-sm focus:border-secondary"
                  maxLength={6}
                  disabled={loading}
                />

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleOtpSubmit}
                  disabled={otp.length !== 6 || loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Verify & Continue
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={() => handleMethodChange("phone")}
                  disabled={loading}
                >
                  ← Change phone number
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          By continuing, you agree to our Terms of Service
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LoginScreen;
