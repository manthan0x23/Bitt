import { LogoHeader } from '@/components/ui/logo-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Separator } from '@/components/ui/separator';
import { Env } from '@/lib/utils';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirmPassword] = useState('');

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Call your register API here
  };

  const handleGoogleRegister = () => {
    window.location.assign(`${Env.server_url}/api/auth/google`);
  };

  return (
    <div className="screen-full bg-white text-black flex justify-center items-center relative">
      <LogoHeader size="xl" className="absolute m-10 top-0 left-0" />

      <div className="w-full max-w-md p-8 rounded-xl flex flex-col items-start gap-6">
        <div className=" flex flex-col items-start justify-center gap-2">
          <span className="flex justify-start items-center gap-3 relative">
            <Link
              to="/auth/ladder"
              className="absolute -left-9 text-muted-foreground"
            >
              <ArrowLeft />
            </Link>
            <h3 className="text-3xl font-medium">Create your account</h3>
          </span>
          <p className="text-left text-sm text-gray-600">
            Enter your details to sign up and get started.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 w-full">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              autoFocus
              type="email"
              id="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              type="password"
              id="confirm-password"
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button size={'lg'} type="submit" className="w-full cursor-pointer">
            Sign Up
          </Button>
        </form>

        <Separator />

        <Button
          size={'lg'}
          variant="outline"
          className="w-full flex justify-center items-center gap-2 cursor-pointer"
          onClick={handleGoogleRegister}
          aria-label="Sign up with Google"
        >
          <FcGoogle />
          Sign up with Google
        </Button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="underline text-black hover:text-blue-600"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
