import countries from 'world-countries';

export const countryOptions = countries.map((c) => ({
  value: c.cca2,
  label: c.name.common,
  flag: c.flag,
}));
