import { z } from 'zod'

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  // NEXT_PUBLIC_ENABLE_STORAGE: coerceBoolean.default('false'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('food-match'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.0.0'),
})

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z
  .object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    OTP_EXPIRY: z.coerce.number().positive().optional().default(600),
    SENDGRID_API_KEY: z.string().optional(),
    SENDGRID_FROM_ADDRESS: z.union([
      z.string().email().optional(),
      z.string().length(0),
    ]),
    SESSION_SECRET: z.string().min(32),
    R2_BUCKET_NAME: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_ACCOUNT_ID: z.string().optional(),
    R2_PUBLIC_HOSTNAME: z.string().optional(),
    ML_SERIVCE_URL: z.string().optional(),
    TELEGRAM_CHAT_ID: z.string().optional(),
    TELEGRAM_TOKEN: z.string().optional(),
  })
  .merge(client)
  .refine((val) => !(val.SENDGRID_API_KEY && !val.SENDGRID_FROM_ADDRESS), {
    message: 'SENDGRID_FROM_ADDRESS is required when SENDGRID_API_KEY is set',
    path: ['SENDGRID_FROM_ADDRESS'],
  })

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 * Intellisense should work due to inference.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  // Server-side env vars
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  OTP_EXPIRY: process.env.OTP_EXPIRY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_ADDRESS: process.env.SENDGRID_FROM_ADDRESS,
  SESSION_SECRET: process.env.SESSION_SECRET,
  // Client-side env vars
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_VERSION:
    process.env.NEXT_PUBLIC_APP_VERSION ??
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  // NEXT_PUBLIC_ENABLE_STORAGE: process.env.NEXT_PUBLIC_ENABLE_STORAGE,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_PUBLIC_HOSTNAME: process.env.R2_PUBLIC_HOSTNAME,
  ML_SERIVCE_URL: process.env.ML_SERIVCE_URL,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
}

// Don't touch the part below
// --------------------------
/** @typedef {z.input<typeof server>} MergedInput */
/** @typedef {z.infer<typeof server>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

// @ts-expect-error Types are wonky from refinement
let env = /** @type {MergedOutput} */ (process.env)

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === 'undefined'

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? server.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  )

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
        )
      return target[/** @type {keyof typeof target} */ (prop)]
    },
  })
} else if (process.env.STORYBOOK) {
  const parsed = client
    .partial()
    .safeParse(JSON.parse(process.env.STORYBOOK_ENVIRONMENT ?? '{}'))
  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  }
  // @ts-expect-error Injection of environment variables is optional
  env = parsed.data
}

export { env }
