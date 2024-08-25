import { type getUserById } from './me.select'

export function getIsProfileComplete(
  user: Awaited<ReturnType<typeof getUserById>>,
) {
  console.log('>>> getIsProfileComplete')
  console.log(user)
  console.log(
    Boolean(user.name && user.email && user.emailVerified && user.dob),
  )
  return Boolean(user.name && user.email && user.emailVerified && user.dob)
}
