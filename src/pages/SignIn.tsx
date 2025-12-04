import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  Leaf, 
  Chrome,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// --- 1. IMPORT SUPABASE CLIENT ---
import { supabase } from '../supabaseClient'; // Make sure this path is correct

const SignIn = () => {
  const [signInMethod, setSignInMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async () => {
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${signInMethod === 'phone' ? phoneNumber : email}`,
      });
    }, 1500);
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    // Simulate sign in
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      navigate('/dashboard');
    }, 1500);
  };

  // --- 2. REPLACE THE GOOGLE SIGN-IN FUNCTION ---
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not sign in with Google. Please try again.",
      });
      console.error("Google Sign-In Error:", error.message);
      setIsLoading(false);
    }
    // No need to set isLoading to false on success, as the page will redirect.
  };

  const handleDigilockerSignIn = () => {
    toast({
      title: "Digilocker Integration",
      description: "Digilocker authentication will be integrated for Aadhaar verification.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="card-3d animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-gradient-primary">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your Ayusutra account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Sign In Method Selector */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={signInMethod === 'phone' ? 'default' : 'outline'}
                onClick={() => setSignInMethod('phone')}
                className="w-full"
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </Button>
              <Button
                variant={signInMethod === 'email' ? 'default' : 'outline'}
                onClick={() => setSignInMethod('email')}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>

            {/* Phone Sign In */}
            {signInMethod === 'phone' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleSendOTP} 
                      className="w-full bg-gradient-primary"
                      disabled={!phoneNumber || isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="mt-1"
                        maxLength={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setOtpSent(false)}
                        className="flex-1"
                      >
                        Change Number
                      </Button>
                      <Button 
                        onClick={handleSignIn} 
                        className="flex-1 bg-gradient-primary"
                        disabled={!otp || isLoading}
                      >
                        {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                      </Button>
                    </div>
                    <Button variant="ghost" onClick={handleSendOTP} className="w-full text-sm">
                      Resend OTP
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Email Sign In */}
            {signInMethod === 'email' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-light">
                    Forgot password?
                  </Link>
                </div>
                <Button 
                  onClick={handleSignIn} 
                  className="w-full bg-gradient-primary"
                  disabled={!email || !password || isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            )}

            <Separator />

            {/* Social Sign In */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleGoogleSignIn}
                className="w-full hover-lift"
                disabled={isLoading} 
              >
                <Chrome className="w-4 h-4 mr-2" />
                {isLoading ? 'Redirecting...' : 'Continue with Google'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDigilockerSignIn}
                className="w-full hover-lift"
              >
                <Shield className="w-4 h-4 mr-2" />
                Continue with Digilocker
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary-light font-medium inline-flex items-center gap-1"
                >
                  Sign up now
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;