import { z } from 'zod'

export const publicSlugSchema = z.string().max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
