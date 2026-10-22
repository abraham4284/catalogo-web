import { z } from 'zod'

export const whatsAppContactSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá tu nombre.').max(80, 'Usá hasta 80 caracteres.').transform((value) => value.replace(/\s+/g, ' ')),
  email: z.string().trim().max(254, 'Usá hasta 254 caracteres.').refine((value) => value === '' || z.email().safeParse(value).success, 'Ingresá un email válido.').optional().default(''),
  message: z.string().trim().min(1, 'Escribí tu mensaje.').max(2000, 'Usá hasta 2000 caracteres.').transform((value) => value.replace(/\r\n?/g, '\n')),
})

export type WhatsAppContact = z.infer<typeof whatsAppContactSchema>
