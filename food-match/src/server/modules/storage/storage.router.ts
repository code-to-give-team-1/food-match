import { generateSignedPutUrl } from '~/lib/r2'
import { createId } from '@paralleldrive/cuid2'
import {
  presignImageInputSchema,
  presignImageOutputSchema,
} from '~/schemas/presign'
import { protectedProcedure, router } from '~/server/trpc'
import { env } from '~/env.mjs'

export const storageRouter = router({
  presignAvatar: protectedProcedure
    .input(presignImageInputSchema)
    .output(presignImageOutputSchema)
    .mutation(async ({ ctx, input: { fileContentType } }) => {
      const imageKey = `user/${ctx.user.id}/avatar-${Date.now()}`

      return {
        url: await generateSignedPutUrl({
          Bucket: env.R2_BUCKET_NAME,
          Key: imageKey,
          ACL: 'public-read',
          ContentType: fileContentType,
        }),
        key: imageKey,
      }
    }),
  presignPostImage: protectedProcedure
    .input(presignImageInputSchema)
    .output(presignImageOutputSchema)
    .mutation(async ({ input: { fileContentType } }) => {
      const imageKey = `donation/${createId()}-${Date.now()}`

      return {
        url: await generateSignedPutUrl({
          Bucket: env.R2_BUCKET_NAME,
          Key: imageKey,
          ACL: 'public-read',
          ContentType: fileContentType,
        }),
        key: imageKey,
      }
    }),
})
