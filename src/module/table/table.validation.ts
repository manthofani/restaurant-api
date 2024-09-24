import { z, ZodType } from 'zod';

export class TableValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    status: z.number().positive(),
    open_hr: z.string().min(1).max(10),
    closed_hr: z.string().min(1).max(10),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    status: z.number().positive().optional(),
    open_hr: z.string().min(1).max(10).optional(),
    closed_hr: z.string().min(1).max(10).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    status: z.number().positive().optional(),
  });
}
