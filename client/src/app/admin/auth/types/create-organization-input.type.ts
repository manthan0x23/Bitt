export type CreateOrganizationInputT = {
  name: string;
  url: string;
  description?: string;
  billingEmailAddress: string;
  origin: string;
  startDate: string;
};
