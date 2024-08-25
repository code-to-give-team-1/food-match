import { z } from 'zod'

const clientImageSchema = {
  images:
    typeof window === 'undefined'
      ? z.undefined()
      : z.array(z.instanceof(File)).optional(),
}

export const addDonationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Please enter the name of the item to donate.' })
    .max(100, { message: 'Name should not exceed 100 characters.' }),

  tagsIds: z
    .array(z.string())
    .min(1, { message: 'Please select at least one tag.' })
    .max(5, { message: 'You can select up to 5 tags only.' })
    .optional(),

  imageKeys: z
    .array(z.string({ message: 'Please enter a valid URL.' }))
    .min(1, { message: 'Please provide at least one image URL.' })
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, { message: 'Please enter a description.' })
    .max(500, { message: 'Description should not exceed 500 characters.' }),

  expiry: z.date(),

  // .refine((val) => !isNaN(new Date(val).getTime()), {
  //   message: 'Invalid date format.',
  // })
  // .transform((val) => new Date(val))
  // .refine((date) => date > new Date(), {
  //   message: 'Expiry date must be in the future.',
  // }),

  quantity: z.string().trim().min(1, { message: 'Please enter the quantity.' }),

  passCode: z.string().optional(),
  // .max(10, { message: 'Passcode should not exceed 10 characters.' }),

  donorId: z.string().min(1, { message: 'Donor ID is required.' }).optional(),

  beneficiaryId: z
    .string()
    .min(1, { message: 'Beneficiary ID is required.' })
    .optional(),
})

export const clientAddDonationSchema = addDonationSchema
  .extend(clientImageSchema)
  .omit({ imageKeys: true })
