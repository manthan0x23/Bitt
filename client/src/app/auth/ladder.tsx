import { useCallback, useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { BsBuildingsFill } from 'react-icons/bs'
import { FaUserAlt } from 'react-icons/fa'
import { ShieldCheck, Lock, CheckCircle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { LogoHeader } from '@/components/ui/logo-header'
import { GoArrowRight } from 'react-icons/go'
import { useNavigate } from '@tanstack/react-router'

const roles = [
  {
    id: 'organization',
    label: 'Continue as Organization',
    icon: <BsBuildingsFill className="w-5 h-5" />,
  },
  {
    id: 'user',
    label: 'Continue as User',
    icon: <FaUserAlt className="w-5 h-5" />,
  },
]

export const Ladder = () => {
  const [selected, setSelected] = useState<string | null>(null)
  const navigate = useNavigate()
  const nextPage = useCallback(() => {
    if (selected == 'organization') {
      navigate({
        to: '/admin/auth/login-admin',
        resetScroll: true,
      })
    } else {
      navigate({
        to: '/auth/login',
        resetScroll: true,
      })
    }
  }, [selected])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-10 relative">
      <LogoHeader size="xl" className="mb-4 absolute m-10 top-0 left-0" />

      <div className="text-left max-w-lg mb-10 px-7">
        <h2 className="text-4xl font-medium text-black">Welcome to Bittt.</h2>
        <p className="text-gray-700 mt-2 text-sm">
          Whether you're managing a company or solving coding challenges, we
          tailor the experience for your needs. Choose your identity to get
          started.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <RadioGroup
          value={selected ?? ''}
          onValueChange={setSelected}
          className="space-y-4"
        >
          {roles.map((role) => (
            <div
              key={role.id}
              className={twMerge(
                ' cursor-pointer h-[6rem] text-6xl flex items-center justify-between border rounded-md px-6 py-4 transition-all duration-200 hover:scale-[1.01] ',
                selected === role.id
                  ? 'border-black bg-neutral-100 shadow-sm'
                  : 'border-gray-300 bg-white hover:border-black/20',
              )}
              onClick={() => setSelected(role.id)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem id={role.id} value={role.id} />
                <Label htmlFor={role.id}>{role.label}</Label>
              </div>
              <div>{role.icon}</div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="mt-10 w-full max-w-md space-y-4 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <Lock className="w-5 h-5 text-green-600 mt-0.5" />
          <p>
            Your credentials are encrypted using AES-256 military-grade
            encryption.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
          <p>
            Zero-knowledge architecture – we never store plain text passwords.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <p>Compliant with GDPR and international security standards.</p>
        </div>

        <div className="w-full flex justify-end items-center">
          <Button
            size={'sm'}
            className="p-5 text-sm cursor-pointer"
            disabled={!selected}
            variant={selected ? 'default' : 'outline'}
            onClick={nextPage}
          >
            Next
            <GoArrowRight size={7} />
          </Button>
        </div>
      </div>
    </div>
  )
}
