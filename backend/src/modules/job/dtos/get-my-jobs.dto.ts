import { z } from "zod";

export const getMyJobsSchema = z.object({}).strict();

export type GetMyJobsDto = z.infer<typeof getMyJobsSchema>;
