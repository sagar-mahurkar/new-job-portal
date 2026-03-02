export const EXPERIENCE_LEVELS =  [
  'JUNIOR',
  'MID',
  'SENIOR'
] as const;

export type ExperienceLevel = 
  typeof EXPERIENCE_LEVELS[number];