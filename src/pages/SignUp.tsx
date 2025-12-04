import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
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
import { supabase } from '../supabaseClient'; // Make sure this path is correct

const SignUp = () => {
  const [signUpMethod, setSignUpMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    dateOfBirth: '',
    agreeTerms: false,
    subscribeUpdates: true
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrimaryAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      toast({ title: "Terms & Conditions", description: "You must accept the terms to continue.", variant: "destructive" });
      return;
    }

    if (signUpMethod === 'phone') {
      await handleSendPhoneOtp();
    } else {
      await handleEmailSignUp();
    }
  };

  const handleEmailSignUp = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
        }
      }
    });

    if (error) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } else if (data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: data.user.id, full_name: formData.fullName, dob: formData.dateOfBirth });

        if (profileError) {
             toast({ title: "Profile Creation Error", description: profileError.message, variant: "destructive" });
        } else {
            toast({ title: "Account Created!", description: "Please check your email to verify your account." });
            navigate('/signin');
        }
    }
    setIsLoading(false);
  };

  const handleSendPhoneOtp = async () => {
    setIsLoading(true);
    const formattedPhoneNumber = formData.phoneNumber.startsWith('+91') ? formData.phoneNumber : `+91${formData.phoneNumber}`;
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhoneNumber,
    });

    if (error) {
      toast({ title: "Error sending OTP", description: error.message, variant: "destructive" });
    } else {
      setOtpSent(true);
      toast({ title: "OTP Sent", description: `Verification code sent to ${formattedPhoneNumber}` });
    }
    setIsLoading(false);
  };

  const handleVerifyOtpAndSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formattedPhoneNumber = formData.phoneNumber.startsWith('+91') ? formData.phoneNumber : `+91${formData.phoneNumber}`;
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      phone: formattedPhoneNumber,
      token: otp,
      type: 'sms',
    });

    if (error) {
      toast({ title: "Verification Error", description: error.message, variant: "destructive" });
      setIsLoading(false);
      return;
    } 

    if (session) {
      // --- THIS IS THE FIX: Changed .update() to .insert() ---
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
          id: session.user.id, 
          full_name: formData.fullName, 
          dob: formData.dateOfBirth
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast({ title: "Profile Creation Error", description: profileError.message, variant: "destructive" });
      } else {
        toast({ title: "Account Created!", description: "Welcome to Ayusutra." });
        navigate('/dashboard');
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      toast({ title: "Google Sign Up Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDigilockerSignUp = () => {
    toast({ title: "Coming Soon!", description: "Digilocker integration will be available in a future update." });
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
              {otpSent ? 'Verify Your Account' : 'Join Ayusutra'}
            </CardTitle>
            <CardDescription>
              {otpSent ? `Enter the code we sent to ${formData.phoneNumber}` : 'Start your Panchakarma wellness journey'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!otpSent ? (
              <form onSubmit={handlePrimaryAction}>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant={signUpMethod === 'phone' ? 'default' : 'outline'} onClick={() => setSignUpMethod('phone')}>
                    <Phone className="w-4 h-4 mr-2" /> Phone
                  </Button>
                  <Button type="button" variant={signUpMethod === 'email' ? 'default' : 'outline'} onClick={() => setSignUpMethod('email')}>
                    <Mail className="w-4 h-4 mr-2" /> Email
                  </Button>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="mt-1" required />
                  </div>
                  {signUpMethod === 'phone' ? (
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} className="mt-1" required />
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="mt-1" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative mt-1">
                          <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="pr-10" required />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} className="mt-1" />
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)} />
                    <Label htmlFor="terms" className="text-sm leading-5">I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link></Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="updates" checked={formData.subscribeUpdates} onCheckedChange={(checked) => handleInputChange('subscribeUpdates', checked as boolean)} />
                    <Label htmlFor="updates" className="text-sm">Receive health tips and appointment reminders</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-primary mt-6" disabled={isLoading}>
                  {isLoading ? 'Processing...' : (signUpMethod === 'phone' ? 'Send OTP' : 'Create Account')}
                </Button>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Button variant="outline" onClick={handleGoogleSignUp} className="w-full hover-lift">
                    <Chrome className="w-4 h-4 mr-2" /> Continue with Google
                  </Button>
                  <Button variant="outline" onClick={handleDigilockerSignUp} className="w-full hover-lift">
                    <Shield className="w-4 h-4 mr-2" /> Continue with Digilocker
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpAndSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Enter Verification Code</Label>
                  <Input id="otp" type="text" placeholder="Enter 6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 text-center text-lg tracking-wider" maxLength={6} required />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setOtpSent(false)} className="flex-1">Back</Button>
                  <Button type="submit" className="flex-1 bg-gradient-primary" disabled={!otp || isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify & Sign Up'}
                  </Button>
                </div>
                <Button type="button" variant="ghost" onClick={handleSendPhoneOtp} className="w-full text-sm">
                  Resend Code
                </Button>
              </form>
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/signin" className="text-primary hover:underline font-medium">
                  Sign in here <ArrowRight className="w-3 h-3 inline" />
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;