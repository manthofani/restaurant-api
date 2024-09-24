import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
    email: z.string().min(1).max(100),
    roles: z.string().min(1).max(5),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).optional(),
    roles: z.string().min(1).max(5).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    username: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    roles: z.string().min(1).optional(),
  });
}
