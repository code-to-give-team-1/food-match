import { env } from '~/env.mjs'

import sendgrid from '@sendgrid/mail'

type SendMailParams = {
  recipient: string
  body: string
  subject: string
}

if (env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(env.SENDGRID_API_KEY)
}

export const sgClient = env.SENDGRID_API_KEY ? sendgrid : null

export const sendMail = async (params: SendMailParams): Promise<void> => {
  if (sgClient && env.SENDGRID_FROM_ADDRESS) {
    await sgClient.send({
      from: env.SENDGRID_FROM_ADDRESS,
      to: params.recipient,
      subject: params.subject,
      html: params.body,
    })
    return
  }

  console.warn(
    'POSTMAN_API_KEY or SENDGRID_API_KEY missing. Logging the following mail: ',
    params,
  )
  return
}
