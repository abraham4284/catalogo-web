import { useState, type FormEvent } from "react";
import {
  whatsAppContactSchema,
  type WhatsAppContact,
} from "../schemas/whatsapp-contact.schema";
import { getWhatsAppContactHref } from "../utils/whatsapp-contact";

type ContactErrors = Partial<Record<keyof WhatsAppContact, string>>;
const fieldClass =
  "min-h-11 w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring";

export function WhatsAppContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [href, setHref] = useState<string>();
  const [unavailable, setUnavailable] = useState(false);

  function update(field: keyof WhatsAppContact, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setHref(undefined);
    setUnavailable(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = whatsAppContactSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: ContactErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "name" || field === "email" || field === "message")
          nextErrors[field] ??= issue.message;
      }
      setErrors(nextErrors);
      const firstField = event.currentTarget.elements.namedItem(
        Object.keys(nextErrors)[0],
      );
      if (firstField instanceof HTMLElement) firstField.focus();
      return;
    }
    setErrors({});
    const contactHref = getWhatsAppContactHref(parsed.data);
    setHref(contactHref);
    setUnavailable(!contactHref);
    if (contactHref) window.open(contactHref, "_blank", "noopener,noreferrer");
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <label htmlFor="contact-name" className="block text-sm font-medium">
          Nombre *
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          maxLength={80}
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={fieldClass}
        />
        {errors.name && (
          <p id="contact-name-error" className="text-sm">
            {errors.name}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-email" className="block text-sm font-medium">
          Email (opcional)
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={fieldClass}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-sm">
            {errors.email}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-message" className="block text-sm font-medium">
          Mensaje *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={2000}
          rows={6}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : "contact-message-help"
          }
          className={fieldClass}
        />
        <p id="contact-message-help" className="text-xs text-muted-foreground">
          Hasta 2000 caracteres.
        </p>
        {errors.message && (
          <p id="contact-message-error" className="text-sm">
            {errors.message}
          </p>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Al continuar, abriremos WhatsApp con tu mensaje preparado. Los datos de
        este formulario no se guardan en el sitio.
      </p>
      <button
        type="submit"
        className="min-h-11 rounded-md bg-primary px-5 py-3 text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
      >
        Continuar por WhatsApp
      </button>
      {unavailable && (
        <p role="alert">
          El contacto por WhatsApp no está disponible en este momento.
        </p>
      )}
      {href && (
        <p role="status" className="text-sm">
          Mensaje preparado.{" "}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
          >
            Volver a abrir WhatsApp
          </a>
        </p>
      )}
    </form>
  );
}
