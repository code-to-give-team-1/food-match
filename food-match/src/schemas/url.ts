import { z } from 'zod'
import { HOME } from '~/lib/routes'

export const callbackUrlSchema = z.string().optional().default(HOME).catch(HOME)
