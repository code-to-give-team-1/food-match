import { z } from 'zod'

export const updateMeSchema = z.object({
  email: z.string().email().nullable(),
  name: z.string().nullable(),
  dob: z.date().nullable(),
  mobile: z.string().nullable(),
})
