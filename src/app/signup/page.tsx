"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('bearer_token', result.token);

      toast.success('Account created successfully! Welcome to LinkedIn!');
      
      // Redirect to feed on success
      router.push('/feed');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Toaster />
      
      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-card">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-2xl">
              in
            </div>
          </div>

          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Make the most of your professional life
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                className="h-12"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (6+ characters)</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="h-12"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                className="h-12"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By clicking Agree & Join, you agree to the LinkedIn{' '}
              <Link href="#" className="text-primary hover:underline">
                User Agreement
              </Link>
              ,{' '}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , and{' '}
              <Link href="#" className="text-primary hover:underline">
                Cookie Policy
              </Link>
              .
            </p>

            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? 'Creating account...' : 'Agree & Join'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already on LinkedIn? </span>
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent items-center justify-center p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Join your professional community
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with the right people, discover opportunities, and grow your career.
          </p>
        </div>
      </div>
    </div>
  );
}