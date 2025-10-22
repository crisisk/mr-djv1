"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Vul minimaal 2 tekens in")
    .max(100, "Naam mag maximaal 100 tekens bevatten"),
  email: z.string().email("Vul een geldig e-mailadres in"),
  message: z
    .string()
    .min(10, "Beschrijf je aanvraag in minimaal 10 tekens")
    .max(1000, "Bericht is te lang"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

type SubmissionState = "idle" | "success" | "error";

type ContactFormProps = {
  className?: string;
};

export default function ContactForm({ className }: ContactFormProps) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionError(null);
    setSubmissionState("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Ongeldige response: ${response.status}`);
      }

      reset();
      setSubmissionState("success");
    } catch (error) {
      console.error("contact form submission failed", error);
      setSubmissionState("error");
      setSubmissionError(
        "Het versturen van het formulier is niet gelukt. Probeer het later nog eens."
      );
    }
  });

  return (
    <section className={className} aria-live="polite">
      <header>
        <h2>Stuur ons een bericht</h2>
        <p>
          Vul het formulier in en we nemen binnen één werkdag contact met je op om de
          mogelijkheden te bespreken.
        </p>
      </header>

      {submissionState === "success" ? (
        <div className="contact-form__success" role="status">
          <p>
            Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.
          </p>
        </div>
      ) : null}

      {submissionState === "error" && submissionError ? (
        <p className="contact-form__error" role="alert">
          {submissionError}
        </p>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <div className="contact-form__field">
          <label htmlFor="contact-name">Naam</label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name ? (
            <span className="contact-form__error" role="alert">
              {errors.name.message}
            </span>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-email">E-mailadres</label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email ? (
            <span className="contact-form__error" role="alert">
              {errors.email.message}
            </span>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-message">Bericht</label>
          <textarea
            id="contact-message"
            rows={5}
            {...register("message")}
            aria-invalid={errors.message ? "true" : "false"}
          />
          {errors.message ? (
            <span className="contact-form__error" role="alert">
              {errors.message.message}
            </span>
          ) : null}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Versturen..." : "Verstuur bericht"}
        </button>
      </form>
    </section>
  );
}
