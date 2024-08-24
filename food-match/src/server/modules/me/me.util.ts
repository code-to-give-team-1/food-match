import { type getUserById } from './me.select'

export function getIsProfileComplete(
  user: Awaited<ReturnType<typeof getUserById>>,
) {
  return Boolean(
    user.name &&
      user.email &&
      user.emailVerified &&
      user.mobile &&
      user.mobileVerified &&
      user.dob &&
      (user.beneficiary || user.donor),
  )
}
