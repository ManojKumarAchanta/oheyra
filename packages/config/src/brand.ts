export interface BrandConfig {
  name: string;
  tagline: string;
  launchCity: string;
  country: string;
  defaultLocale: string;
  defaultCurrency: string;
  siteUrl: string;
  supportEmail: string;
}

export const brand: BrandConfig = {
  name: 'Oheyra',
  tagline: 'Your city has plans.',
  launchCity: 'Hyderabad',
  country: 'India',
  defaultLocale: 'en-IN',
  defaultCurrency: 'INR',
  siteUrl: 'https://oheyra.city',
  supportEmail: 'hello@oheyra.city',
};
