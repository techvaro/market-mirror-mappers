import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  MapPin,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import logo from '@/assets/logo.png';

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  {
    icon: MapPin,
    title: 'Smart Mapping',
    desc: 'Precision vendor location tracking across markets.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Track tasks, completions, and performance at a glance.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Seamless coordination across field teams.',
  },
];

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

  // Forgot password dialog
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'sending' | 'sent'>('email');
  const [forgotError, setForgotError] = useState('');

  // Rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      toast({
        title: 'Welcome back',
        description: 'Signed in successfully.',
      });
      setLocation('/dashboard');
    } catch {
      setError('Invalid credentials. Try any email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feature = features[activeFeature];

  const openForgot = () => {
    setForgotEmail(email);
    setForgotStep('email');
    setForgotError('');
    setForgotOpen(true);
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotEmail) {
      setForgotError('Please enter your email address');
      return;
    }

    setForgotStep('sending');
    await new Promise((r) => setTimeout(r, 1200));
    setForgotStep('sent');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-[#173B7B] via-[#044E75] to-[#0A1F3C]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <motion.div
            className="absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(243,110,9,0.18) 0%, transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(23,59,123,0.3) 0%, transparent 70%)' }}
            animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[55%] left-[50%] w-[250px] h-[250px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(243,110,9,0.1) 0%, transparent 70%)' }}
            animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Top - Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <img src={logo} alt="Market Mirror" className="w-6 h-6" />
            </div>
            <span className="text-white text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Market Mirror
            </span>
          </motion.div>

          {/* Center - Headline + Feature cards */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F36E09] animate-pulse" />
                Mapper Portal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white text-4xl xl:text-5xl font-bold leading-[1.15] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Manage. Map.{' '}
              <span className="text-[#F36E09]">Grow.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/65 text-lg leading-relaxed mb-10"
            >
              The all-in-one platform for field mappers to register vendors, track tasks, and deliver results.
            </motion.p>

            {/* Feature highlight card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="bg-white/[0.07] backdrop-blur-md rounded-2xl border border-white/[0.1] p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#F36E09]/15 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-[#F36E09]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-base mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                          {feature.title}
                        </h3>
                        <p className="text-white/55 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-2 mt-5">
                  {features.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFeature(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeFeature ? 'bg-[#F36E09] w-6' : 'bg-white/20 w-1.5 hover:bg-white/35'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom - Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-white/30 text-xs">
              &copy; {new Date().getFullYear()} Market Mirror. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-[#173B7B] blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:hidden mb-8"
          >
            <div className="flex justify-center">
              <img src={logo} alt="Market Mirror" className="w-10 h-10" />
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <h2
              className="text-foreground text-3xl font-bold mb-2 text-center lg:text-left"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Welcome back
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <p className="text-muted-foreground mb-8 text-center lg:text-left">
              Sign in to your mapper dashboard
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@marketmirror.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="pl-10 h-11 rounded-[10px] bg-muted/40 border-border focus-visible:ring-primary/30 focus-visible:border-primary"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={openForgot}
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="pl-10 pr-10 h-11 rounded-[10px] bg-muted/40 border-border focus-visible:ring-primary/30 focus-visible:border-primary"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(val) => setRemember(val === true)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-[10px]">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-[10px] bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-medium tracking-wider">
                  or continue with
                </span>
              </div>
            </div>
          </motion.div>

          {/* Social logins */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-[10px] border-border hover:bg-muted/50 font-medium text-sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>
          </motion.div>

          {/* Demo hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Demo: use any email and password to sign in.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[18px] p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {forgotStep === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease }}
                className="p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <DialogTitle className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Check your email
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mb-1">
                  We've sent a password reset link to
                </DialogDescription>
                <p className="text-sm font-medium text-foreground mb-6">{forgotEmail}</p>
                <p className="text-xs text-muted-foreground mb-6">
                  Didn't receive it? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-[10px] border-border font-medium"
                  onClick={() => setForgotOpen(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease }}
                className="p-8"
              >
                <DialogHeader className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    Reset your password
                  </DialogTitle>
                  <DialogDescription>
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="you@marketmirror.com"
                        value={forgotEmail}
                        onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                        className="pl-10 h-11 rounded-[10px] bg-muted/40 border-border focus-visible:ring-primary/30 focus-visible:border-primary"
                        autoFocus
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {forgotError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-[10px]">
                          {forgotError}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={forgotStep === 'sending'}
                    className="w-full h-11 rounded-[10px] bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all duration-200"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {forgotStep === 'sending' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Send reset link
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
