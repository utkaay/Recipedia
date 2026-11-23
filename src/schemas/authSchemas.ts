import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.').trim(),
  password: z.string().min(1, 'Enter your password.'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name.'),
    email: z.email('Enter a valid email address.').trim(),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginInput = z.input<typeof loginSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
