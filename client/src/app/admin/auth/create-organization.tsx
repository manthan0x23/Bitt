import { useState } from 'react'
import { LogoHeader } from '@/components/ui/logo-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import countries from 'world-countries'
import { useStore } from '@tanstack/react-store'
import { authStore } from '@/store/authStore'

export const CreateOrganization = () => {
  const [user] = useStore(authStore, (state) => [state.user])
  const router = useRouter()

  const companyExt = user?.email.split('@')[1]
  const companyUrl = 'https://' + companyExt

  const [orgName, setOrgName] = useState(companyExt?.toUpperCase() || '')
  const [url, setUrl] = useState(companyUrl || '')
  const [description, setDescription] = useState('')
  const [billingEmail, setBillingEmail] = useState(user?.email || '')
  const [origin, setOrigin] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Handle organization creation
  }

  if (!user) {
    return null
  }

  if (user.type != 'admin') {
    router.navigate({
      to: '/admin/auth/login-admin',
    })
  }

  return (
    <div className="screen-full bg-white text-black flex justify-center items-center relative px-4 py-10">
      <LogoHeader size="xl" className="absolute m-10 top-0 left-0" />

      <div className="w-full max-w-xl p-8 rounded-xl flex flex-col items-start gap-6 ">
        <div className="flex flex-col items-start gap-2">
          <span className="flex items-center gap-3 relative">
            <Link
              to="/admin/auth/organization-ladder"
              className="absolute -left-9 text-muted-foreground"
            >
              <ArrowLeft />
            </Link>
            <h3 className="text-3xl font-medium">Create Organization</h3>
          </span>
          <p className="text-left text-sm text-gray-600">
            Set up your organization’s details below to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="flex justify-between items-center w-full gap-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                autoFocus
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Ex: DevStack Inc."
                required
              />
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="url">Organization URL</Label>
              <Input
                id="url"
                value={url}
                disabled
                onChange={(e) => setUrl(e.target.value)}
                placeholder="your-org.bittt.dev"
                required
                className="cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-between items-center w-full gap-4">
            <div className="grid w-1/2 gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Select a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid w-1/2 gap-2">
              <Label htmlFor="origin">Origin Country</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="max-h-[20rem] max-w-[100%]">
                  {countries.map((country) => (
                    <SelectItem key={country.cca2} value={country.cca2}>
                      <span style={{ marginRight: '4px' }}>{country.flag}</span>
                      {country.name.common}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A few lines about your organization..."
              rows={5}
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="billing-email">Billing Email Address</Label>
            <Input
              id="billing-email"
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="billing@yourcompany.com"
              required
            />
          </div>

          <div className="flex justify-end items-center">
            <Button type="submit" className=" cursor-pointer">
              Create Organization
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
