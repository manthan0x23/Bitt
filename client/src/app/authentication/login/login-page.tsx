import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa6'
import { Env } from '@/lib/utils'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle email/password login
    alert(`Logging in with ${email} ; ${password}`)
  }

  const handleGoogleLogin = () => {
    window.location.href = `${Env.server_url}/api/auth/google`
  }

  return (
    <div className="screen-full flex justify-center items-center ">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-5xl text-black font-bold">
          Bitt.
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            Login
          </Button>
        </form>
        <Separator />
        <Button
          variant="outline"
          className="w-full flex justify-center items-center gap-2 cursor-pointer"
          onClick={handleGoogleLogin}
          aria-label="Login with Google"
        >
          <FcGoogle />
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          className="w-full flex justify-center items-center gap-2 cursor-pointer"
          onClick={handleGoogleLogin}
          aria-label="Login with Google"
        >
          <FaGithub />
          Sign in with Github
        </Button>
      </Card>
    </div>
  )
}

export default LoginPage
