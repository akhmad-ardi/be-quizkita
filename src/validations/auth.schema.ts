import { z } from 'zod';

export const SignInSchema = z.object({
  username: z.string().nonempty({ error: 'username required' }),
  password: z.string().nonempty({ error: 'password required' }),
});

export const SignUpSchema = z
  .object({
    username: z.string().nonempty({ error: 'username required' }),
    fullname: z.string().nonempty({ error: 'fullname required' }),
    password: z.string().nonempty({ error: 'password required' }).min(6),
    confirm_password: z.string().nonempty({ error: 'confirm password required' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'confirm password is not match',
  });
