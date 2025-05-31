import { LogoHeader } from '@/components/ui/logo-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { Env } from '@/lib/utils'

export const LoginAdmin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Authenticate with email and password
  }

  const handleGoogleLogin = () => {
    window.location.assign(`${Env.server_url}/api/admin/auth/google`)
  }

  return (
    <div className="screen-full bg-white text-black flex justify-center items-center relative">
      <LogoHeader size="xl" className="absolute m-10 top-0 left-0" />

      <div className="w-full max-w-md p-8 rounded-xl flex flex-col items-start gap-6">
        <div className=" flex flex-col items-start justify-center gap-2">
          <span className="flex justify-start items-center gap-3 relative text-2xl">
            <Link
              to="/auth/ladder"
              className="absolute -left-9 text-muted-foreground"
            >
              <ArrowLeft />
            </Link>
            <h3 className="font-medium text-3xl">Sign in </h3>
          </span>
          <p className="text-left text-sm text-gray-600">
            Login with your work credentials to securely access the dashboard.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6 w-full">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Work Email</Label>
            <Input
              autoFocus
              size={30}
              type="email"
              id="email"
              placeholder="you@company.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              size={30}
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
          variant="outline"
          className="w-full flex justify-center items-center gap-2 cursor-pointer"
          onClick={handleGoogleLogin}
          aria-label="Sign in with Google"
          size={'lg'}
        >
          <FcGoogle />
          Sign in with Google
        </Button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Don&#39;t have an admin account?{' '}
          <Link
            to="/auth/admin/register-admin"
            className="underline text-black hover:text-blue-600"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
