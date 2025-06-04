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

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCredentialLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Call your login API here
  };

  const handleGoogleLogin = () => {
    window.location.assign(`${Env.server_url}/api/auth/google`);
  };

  return (
    <div className="screen-full bg-primary-foreground text-primary flex justify-center items-center relative">
      <LogoHeader className="absolute m-10 top-0 left-0" />

      <div className="w-full max-w-md p-8 rounded-xl flex flex-col items-start gap-6">
        <div className=" flex flex-col items-start justify-center gap-2">
          <span className="flex justify-start items-center gap-3 relative">
            <Link
              to="/auth/ladder"
              className="absolute -left-9 text-muted-foreground"
            >
              <ArrowLeft />
            </Link>
            <h3 className="text-3xl font-medium">Sign in </h3>
          </span>
          <p className="text-left text-sm text-primary/60">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        <form onSubmit={handleCredentialLogin} className="space-y-6 w-full">
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

          <Button size={'lg'} type="submit" className="w-full cursor-pointer">
            Sign In
          </Button>
        </form>

        <Separator />

        <Button
          size={'lg'}
          variant="outline"
          className="w-full flex justify-center items-center gap-2 cursor-pointer"
          onClick={handleGoogleLogin}
          aria-label="Sign in with Google"
        >
          <FcGoogle />
          Sign in with Google
        </Button>

        <p className="text-sm text-primary/60 text-center mt-4">
          Don&#39;t have an account?{' '}
          <Link
            to="/auth/register"
            className="underline text-primary hover:text-blue-600"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};
