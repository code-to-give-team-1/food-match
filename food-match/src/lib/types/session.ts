import { type User } from '@prisma/client'
import { type IronSession } from 'iron-session'

export type SessionData = {
  userId?: User['id']
}

export type Session = IronSession<SessionData>
