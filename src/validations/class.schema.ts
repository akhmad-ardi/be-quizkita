import { z } from 'zod';

export const AddClassSchema = z.object({
  name: z.string().nonempty({ error: 'name required' }),
});

export const JoinClassSchema = z.object({
  invite_code: z.string().nonempty({ error: 'invite code required' }),
});

export const AddUserToClassSchema = z.object({
  username: z.string().nonempty({ error: 'username required' }),
});

export const DeleteClassMemberSchema = z.object({
  user_id: z.string().nonempty({ error: 'id user required' }),
});
