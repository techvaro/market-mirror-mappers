import React, { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  MailCheck,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

const STEPS = ['email', 'code', 'reset', 'success'] as const;
type Step = (typeof STEPS)[number];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const pulseGlow = {
  scale: [1, 1.05, 1],
  opacity: [0.15, 0.25, 0.15],
  transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
};

const floatingAnimation = {
  y: [-8, 8, -8],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
};

// Simulated code - in production this would be sent via email
const MOCK_CODE = '482951';

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('email');
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeExpiry, setCodeExpiry] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);

  const goToStep = useCallback((next: Step) => {
    setDirection(STEPS.indexOf(next) > STEPS.indexOf(step) ? 1 : -1);
    setStep(next);
  }, [step]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    // Simulate sending code
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    toast({
      title: 'Code sent',
      description: `A verification code was sent to ${email}`,
    });
    // Start expiry timer
    const timer = setInterval(() => {
      setCodeExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    goToStep('code');
  };

  const handleVerifyCode = async () => {
    const codeStr = code.join('');
    if (codeStr.length !== 6) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    if (codeStr === MOCK_CODE) {
      goToStep('reset');
    } else {
      toast({
        title: 'Invalid code',
        description: 'The code you entered is incorrect. Try again.',
      });
      setCode(['', '', '', '', '', '']);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) return;
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords don\'t match',
        description: 'Please make sure both passwords are identical.',
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
      });
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    goToStep('success');
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
    // Auto-submit when all digits entered
    if (value && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        setTimeout(() => handleVerifyCode(), 200);
      }
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newCode = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
      setCode(newCode);
      const focusIndex = Math.min(pasted.length, 5);
      const focusInput = document.getElementById(`code-${focusIndex}`);
      focusInput?.focus();
      if (pasted.length === 6) {
        setTimeout(() => handleVerifyCode(), 200);
      }
    }
  };

  const handleResendCode = async () => {
    setResendCooldown(30);
    setCodeExpiry(300);
    setCode(['', '', '', '', '', '']);
    toast({
      title: 'Code resent',
      description: `A new verification code was sent to ${email}`,
    });
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const stepIndex = STEPS.indexOf(step);

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.slice(0, 3).map((s, i) => (
        <React.Fragment key={s}>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              i < stepIndex
                ? "bg-emerald-500 text-white"
                : i === stepIndex
                ? "bg-[#173B7B] text-white shadow-md shadow-[#173B7B]/30"
                : "bg-[#F1F5F9] text-[#9CA3AF]"
            )}
          >
            {i < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
          {i < 2 && (
            <div
              className={cn(
                "flex-1 h-0.5 rounded-full transition-all duration-500",
                i < stepIndex ? "bg-emerald-500" : "bg-[#F1F5F9]"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const panelContent = (
    <AnimatePresence mode="wait" custom={direction}>
      {/* Step 1: Enter Email */}
      {step === 'email' && (
        <motion.div
          key="email"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#173B7B]/10 flex items-center justify-center mb-5">
              <Mail className="h-7 w-7 text-[#173B7B]" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1F2937] mb-2">Forgot password?</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSendCode}>
            <div className="space-y-1.5">
              <Label htmlFor="reset-email" className="text-[#1F2937] text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@marketmirror.com"
                  className="pl-10 h-12 rounded-[10px] border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#173B7B] focus:ring-[#173B7B]/20 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-reset-email"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-[10px] bg-[#173B7B] hover:bg-[#044E75] text-white font-medium text-sm shadow-lg shadow-[#173B7B]/25 hover:shadow-xl hover:shadow-[#173B7B]/30 transition-all duration-300"
              disabled={isSubmitting}
              data-testid="button-send-code"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </form>
        </motion.div>
      )}

      {/* Step 2: Enter Code */}
      {step === 'code' && (
        <motion.div
          key="code"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <StepIndicator />
          <div className="mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#F36E09]/10 flex items-center justify-center mb-5">
              <MailCheck className="h-7 w-7 text-[#F36E09]" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1F2937] mb-2">Check your email</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              We sent a 6-digit verification code to{' '}
              <span className="font-medium text-[#1F2937]">{email}</span>
            </p>
          </div>

          <div className="space-y-6">
            {/* Code inputs */}
            <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <Input
                  key={i}
                  id={`code-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeInput(i, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  className={cn(
                    "w-12 h-14 text-center text-lg font-bold rounded-[10px] border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] focus:border-[#173B7B] focus:ring-[#173B7B]/20 transition-all duration-200",
                    digit && "border-[#173B7B] bg-[#173B7B]/5"
                  )}
                  data-testid={`input-code-${i}`}
                />
              ))}
            </div>

            {/* Timer & Resend */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                <Clock className="h-3.5 w-3.5" />
                Code expires in{' '}
                <span className={cn("font-mono font-medium", codeExpiry < 60 ? "text-[#EF4444]" : "text-[#6B7280]")}>
                  {formatTime(codeExpiry)}
                </span>
              </div>
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendCode}
                className={cn(
                  "font-medium transition-colors",
                  resendCooldown > 0
                    ? "text-[#9CA3AF] cursor-not-allowed"
                    : "text-[#173B7B] hover:text-[#044E75]"
                )}
                data-testid="button-resend-code"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>

            <Button
              onClick={handleVerifyCode}
              className="w-full h-12 rounded-[10px] bg-[#173B7B] hover:bg-[#044E75] text-white font-medium text-sm shadow-lg shadow-[#173B7B]/25 hover:shadow-xl hover:shadow-[#173B7B]/30 transition-all duration-300"
              disabled={isSubmitting || code.join('').length !== 6}
              data-testid="button-verify-code"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: New Password */}
      {step === 'reset' && (
        <motion.div
          key="reset"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <StepIndicator />
          <div className="mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
              <KeyRound className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1F2937] mb-2">Create new password</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Choose a strong password for your account. Make sure it's at least 6 characters.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleResetPassword}>
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-[#1F2937] text-sm font-medium">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="pl-10 pr-10 h-12 rounded-[10px] border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#173B7B] focus:ring-[#173B7B]/20 transition-all duration-200"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  data-testid="input-new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => {
                      const strength =
                        newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword)
                          ? 4
                          : newPassword.length >= 8 && (/[A-Z]/.test(newPassword) || /\d/.test(newPassword))
                          ? 3
                          : newPassword.length >= 6
                          ? 2
                          : 1;
                      return (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-all duration-300",
                            i < strength
                              ? strength === 4
                                ? "bg-emerald-500"
                                : strength === 3
                                ? "bg-[#F36E09]"
                                : "bg-[#EF4444]"
                              : "bg-[#F1F5F9]"
                          )}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#9CA3AF]">
                    {newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword)
                      ? 'Strong password'
                      : newPassword.length >= 6
                      ? 'Fair password — add uppercase, numbers & symbols for strength'
                      : 'Too short — use at least 6 characters'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-[#1F2937] text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  className={cn(
                    "pl-10 pr-10 h-12 rounded-[10px] border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#173B7B] focus:ring-[#173B7B]/20 transition-all duration-200",
                    confirmPassword && newPassword !== confirmPassword && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20",
                    confirmPassword && newPassword === confirmPassword && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  )}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  data-testid="input-confirm-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] text-[#EF4444]">Passwords don't match</p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-[11px] text-emerald-600">Passwords match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-[10px] bg-[#173B7B] hover:bg-[#044E75] text-white font-medium text-sm shadow-lg shadow-[#173B7B]/25 hover:shadow-xl hover:shadow-[#173B7B]/30 transition-all duration-300"
              disabled={isSubmitting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              data-testid="button-reset-password"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </motion.div>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <motion.div
          key="success"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25"
          >
            <CheckCircle2 className="h-10 w-10 text-white" />
          </motion.div>

          <h2 className="font-heading text-2xl font-bold text-[#1F2937] mb-2">Password reset successful</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            Your password has been updated. You can now sign in with your new credentials.
          </p>

          <Button
            onClick={() => setLocation('/login')}
            className="w-full h-12 rounded-[10px] bg-[#173B7B] hover:bg-[#044E75] text-white font-medium text-sm shadow-lg shadow-[#173B7B]/25 hover:shadow-xl hover:shadow-[#173B7B]/30 transition-all duration-300"
            data-testid="button-back-to-login"
          >
            Back to Sign In
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-[100dvh] w-full flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#173B7B]">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#F36E09]/15 blur-3xl"
            animate={pulseGlow}
          />
          <motion.div
            className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#044E75]/30 blur-3xl"
            animate={{ ...pulseGlow, transition: { ...pulseGlow.transition, delay: 2 } }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <img src={logo} alt="Market Mirror" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-white font-heading font-bold text-xl tracking-tight">Market Mirror</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex-1 flex flex-col justify-center max-w-lg"
          >
            <h1 className="text-white font-heading text-4xl xl:text-5xl font-bold leading-[1.15] mb-6">
              Secure account{' '}
              <span className="text-[#F36E09]">recovery</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              We take account security seriously. Follow the steps to verify your identity and create a new password.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-1.5 text-white/40 text-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            End-to-end encrypted recovery process
          </motion.div>
        </div>

        <motion.div className="absolute top-[15%] right-[10%] w-3 h-3 rounded-full bg-[#F36E09]/40" animate={floatingAnimation} />
        <motion.div className="absolute top-[55%] right-[5%] w-2 h-2 rounded-full bg-white/20" animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }} />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-10 relative">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, #173B7B 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#173B7B] flex items-center justify-center shadow-lg shadow-[#173B7B]/20">
              <img src={logo} alt="Market Mirror" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-heading font-bold text-lg text-[#1F2937]">Market Mirror</span>
          </div>

          {/* Back to login */}
          {step !== 'success' && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                if (step === 'email') {
                  setLocation('/login');
                } else {
                  goToStep(step === 'reset' ? 'code' : 'email');
                }
              }}
              className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#173B7B] transition-colors mb-6"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </motion.button>
          )}

          {panelContent}
        </div>
      </div>
    </div>
  );
}
