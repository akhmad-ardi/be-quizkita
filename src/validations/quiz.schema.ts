import { z } from 'zod';

export const SubmitAnswerSchema = z.object({
  answers: z
    .array(
      z.object({
        question_id: z.string().nonempty(),
        answer_id: z.string().nonempty(),
      })
    )
    .nonempty({ error: 'answer required' }),
});

export type SubmitAnswerType = z.infer<typeof SubmitAnswerSchema>;
