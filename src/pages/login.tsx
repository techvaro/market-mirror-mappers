import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, Eye, EyeOff, ShieldCheck, MapPin, BarChart3, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const floatingAnimation = {
  y: [-8, 8, -8],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

const pulseGlow = {
  scale: [1, 1.05, 1],
  opacity: [0.15, 0.25, 0.15],
  transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
};

const features = [
  { icon: MapPin, title: 'Smart Mapping', desc: 'Precision vendor location tracking' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Insights that drive decisions' },
  { icon: Users, title: 'Team Collaboration', desc: 'Seamless coordination across teams' },
];

export default function Login() {
  const [location, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      toast({
        title: 'Welcome back',
        description: 'Signed in successfully.',
      });
      setLocation('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#173B7B]">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#F36E09]/15 blur-3xl"
            animate={pulseGlow}
          />
          <motion.div
            className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#044E75]/30 blur-3xl"
            animate={{ ...pulseGlow, transition: { ...pulseGlow.transition, delay: 2 } }}
          />
          <motion.div
            className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#F36E09]/10 blur-2xl"
            animate={{ ...pulseGlow, transition: { ...pulseGlow.transition, delay: 1 } }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top - Logo */}
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

          {/* Center - Main content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col justify-center max-w-lg"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F36E09] animate-pulse" />
                Mapper Portal
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-white font-heading text-5xl xl:text-6xl font-bold leading-[1.1] mb-6"
            >
              Manage. Map.{' '}
              <span className="text-[#F36E09]">Grow.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/60 text-lg leading-relaxed mb-10 max-w-md"
            >
              The all-in-one platform for field mappers to register vendors, track tasks, and deliver results — all in real time.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={4 + i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F36E09]/15 flex items-center justify-center flex-shrink-0">
                    <f.icon className="h-5 w-5 text-[#F36E09]" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{f.title}</p>
                    <p className="text-white/50 text-xs">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom - Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-1.5 text-white/40 text-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Enterprise-grade security &middot; SOC 2 Compliant
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-[15%] right-[10%] w-3 h-3 rounded-full bg-[#F36E09]/40"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute top-[55%] right-[5%] w-2 h-2 rounded-full bg-white/20"
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
        />
        <motion.div
          className="absolute bottom-[25%] right-[15%] w-4 h-4 rounded-full border border-white/10"
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
        />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-10 relative">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, #173B7B 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 rounded-2xl bg-[#173B7B] flex items-center justify-center shadow-lg shadow-[#173B7B]/20"
            >
              <img src={logo} alt="Market Mirror" className="w-10 h-10 object-contain" />
            </motion.div>
            <div className="text-center">
              <h1 className="font-heading text-xl font-bold tracking-tight text-[#1F2937]">
                Market Mirror
              </h1>
              <p className="text-xs text-[#6B7280]">Mapper Portal</p>
            </div>
          </div>

          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-heading text-2xl font-bold text-[#1F2937] mb-2">Welcome back</h2>
            <p className="text-[#6B7280] text-sm">
              Sign in to your mapper account to continue.
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="space-y-5"
            onSubmit={handleLogin}
          >
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-[#1F2937] text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@marketmirror.com"
                  className="pl-10 h-12 rounded-[10px] border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#173B7B] focus:ring-[#173B7B]/20 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-login-email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-[#1F2937] text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 rounded-[10px] border-[#E5E7EB] bg-[#F8FAFC] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#173B7B] focus:ring-[#173B7B]/20 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-login-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-xs font-medium text-[#173B7B] hover:text-[#044E75] transition-colors"
                data-testid="link-forgot-password"
                onClick={() => setLocation('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="w-full h-12 rounded-[10px] bg-[#173B7B] hover:bg-[#044E75] text-white font-medium text-sm shadow-lg shadow-[#173B7B]/25 hover:shadow-xl hover:shadow-[#173B7B]/30 transition-all duration-300"
                disabled={isSubmitting}
                data-testid="button-login"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Bottom info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF]"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Prototype build — sign-in is simulated for demonstration only.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
