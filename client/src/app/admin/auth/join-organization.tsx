import { useState } from 'react'
import { LogoHeader } from '@/components/ui/logo-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

export const JoinOrganization = () => {
  const [inviteLink, setInviteLink] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Handle organization joining logic
    console.log({ inviteLink, inviteCode })
  }

  return (
    <div className="screen-full bg-white text-black flex justify-center items-center relative px-4 py-10">
      <LogoHeader size="xl" className="absolute m-10 top-0 left-0" />

      <div className="w-full max-w-md p-8 rounded-xl flex flex-col items-start gap-6 ">
        <div className="flex flex-col items-start gap-2">
          <span className="flex items-center gap-3 relative">
            <Link
              to="/admin/auth/organization-ladder"
              className="absolute -left-9 text-muted-foreground"
            >
              <ArrowLeft />
            </Link>
            <h3 className="text-3xl font-medium">Join Organization</h3>
          </span>
          <p className="text-left text-sm text-gray-600">
            Use either an invite link or a code to join your team.
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-6 w-full">
          <div className="grid w-full gap-2">
            <Label htmlFor="invite-link">Invite Link</Label>
            <Input
              type="link"
              id="invite-link"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder="https://bittt.dev/org/invite/xyz"
            />
          </div>

          <div className="my-8">
            <Separator className="relative">
              <span className="bg-white px-2 text-sm text-muted-foreground absolute -top-2.5 left-[50%] -translate-x-1/2">
                or
              </span>
            </Separator>
          </div>

          <div className="grid w-full gap-4">
            <Label htmlFor="invite-code">Invite Code</Label>
            <div className="w-full flex items-center justify-center">
              <InputOTP
                maxLength={9}
                id="invite-code"
                value={inviteCode}
                onChange={setInviteCode}
                className="w-full flex items-center justify-around"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                  <InputOTPSlot index={7} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex justify-end items-center pt-2">
            <Button
              type="submit"
              className="tracking-wide text-sm font-normal cursor-pointer"
              disabled={!inviteLink.trim() && inviteCode.length < 8}
            >
              Join
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
