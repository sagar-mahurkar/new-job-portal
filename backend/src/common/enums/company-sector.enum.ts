export const COMPANY_SECTORS = [
  "IT",
  "FINANCE",
  "HEALTHCARE",
  "EDUCATION",
  "MANUFACTURING"
] as const;

export type CompanySector = 
  typeof COMPANY_SECTORS[number]