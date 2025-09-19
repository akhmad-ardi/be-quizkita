import { z } from 'zod';

export const AddMaterialSchema = z.object({
  class_id: z.string().nonempty({ error: 'class id required' }),
  title: z.string().nonempty({ error: 'title required' }),
  content: z.string().nonempty({ error: 'content required' }),
});
