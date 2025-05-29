import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, Env } from '@/lib/utils';
import { useRouter } from '@tanstack/react-router';
import countries from 'world-countries';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import type { CreateOrganizationInputT } from '../types/create-organization-input.type';
import axios from 'axios';
import { getAxiosResponseError } from '@/lib/error';

type Props = {
  email: string;
};

const createOrganizationCall = (body: CreateOrganizationInputT) => {
  return axios.post(`${Env.server_url}/api/admin/create-organization`, body, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const CreateOrganizationForm = ({ email }: Props) => {
  const router = useRouter();

  const companyExt = email.split('@')[1];
  const defaultName = companyExt?.split('.')[0]?.toUpperCase() || '';
  const defaultUrl = `https://${companyExt}`;

  const [orgName, setOrgName] = useState(defaultName);
  const [url] = useState(defaultUrl);
  const [description, setDescription] = useState('');
  const [billingEmail, setBillingEmail] = useState(email);
  const [origin, setOrigin] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();

  const { mutate, isPending } = useMutation({
    mutationFn: createOrganizationCall,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        name: orgName.trim(),
        url,
        description,
        billingEmailAddress: billingEmail.toLowerCase(),
        origin,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      },
      {
        onSuccess: (data) => {
          if (data.status >= 400) {
            console.log(data);
          } else {
            toast.success('Organization created!', { richColors: true });
            setTimeout(() => {
              router.navigate({ to: '/admin' });
            }, 1500);
          }
        },
        onError: (err) => {
          toast.error(getAxiosResponseError(err) || 'Something went wrong', {
            richColors: true,
          });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <div className="grid w-full gap-2">
          <Label htmlFor="org-name">Organization Name</Label>
          <Input
            disabled={isPending}
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
          <Input id="url" value={url} disabled className="cursor-not-allowed" />
        </div>
      </div>

      <div className="flex justify-between items-center w-full gap-4">
        <div className="grid w-1/2 gap-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger disabled={isPending} asChild>
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
          <Select disabled={isPending} value={origin} onValueChange={setOrigin}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="max-h-[20rem] max-w-[100%]">
              {countries.map((country) => (
                <SelectItem key={country.cca2} value={country.cca2}>
                  <span className="mr-2">{country.flag}</span>
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
          disabled={isPending}
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
          disabled={isPending}
          onChange={(e) => setBillingEmail(e.target.value)}
          placeholder="billing@yourcompany.com"
          required
        />
      </div>

      <div className="flex justify-end items-center">
        <Button
          type="submit"
          disabled={
            !orgName.length || !origin || !billingEmail || !url || isPending
          }
        >
          {isPending ? 'Creating...' : 'Create Organization'}
        </Button>
      </div>
    </form>
  );
};
