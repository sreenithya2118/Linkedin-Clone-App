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

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('bearer_token', result.token);

      toast.success('Welcome back!');
      
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
            Sign in
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Stay updated on your professional world
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                })}
                className="h-12"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
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
            <span className="text-muted-foreground">New to LinkedIn? </span>
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Join now
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent items-center justify-center p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to your professional community
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with professionals, share insights, and grow your career.
          </p>
        </div>
      </div>
    </div>
  );
}