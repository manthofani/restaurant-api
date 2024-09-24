import { z, ZodType } from 'zod';

export class ReservationValidation {
  static readonly CREATE: ZodType = z.object({
    reserved_time: z.string().min(1).max(10),
    id_table: z.number().positive(),
    status: z.number().positive(),
    username: z.string().min(1).max(100),
    email: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    reserved_time: z.string().min(1).max(10).optional(),
    id_table: z.number().positive().optional(),
    username: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    receipt: z.number().positive().optional(),
    reserved_time: z.string().min(1).max(10).optional(),
    id_table: z.number().positive().optional(),
    username: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).optional(),
  });
}
