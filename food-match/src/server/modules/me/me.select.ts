import { Prisma, type PrismaClient } from '@prisma/client'

/**
 * Default selector for when retrieving logged in user.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultMeSelect = Prisma.validator<
  Pick<
    Prisma.UserSelect,
    | 'id'
    | 'email'
    | 'emailVerified'
    | 'image'
    | 'name'
    | 'dob'
    | 'mobile'
    | 'mobileVerified'
  >
>()({
  id: true,
  email: true,
  emailVerified: true,
  image: true,
  name: true,
  dob: true,
  mobile: true,
  mobileVerified: true,
})

export const getUserById = (prisma: PrismaClient, id: string) => {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: defaultMeSelect,
  })
}
