import { whatsAppContactSchema } from '../schemas/whatsapp-contact.schema'

export function buildWhatsAppContactMessage(input: unknown): string {
  const { name, email, message } = whatsAppContactSchema.parse(input)
  return [
    `Hola, soy ${name}.`,
    ...(email ? ['', `Email: ${email}`] : []),
    '', 'Consulta:', message,
  ].join('\n')
}
