import { z } from 'zod';

export const SignInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const SignUpSchema = z
  .object({
    username: z.string({ error: 'username required' }),
    fullname: z.string({ error: 'fullname required' }),
    password: z.string().min(6),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'confirm password is not match',
  });
