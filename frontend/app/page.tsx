import ContactForm from "../components/forms/ContactForm";

export default function HomePage() {
  return (
    <main className="marketing-page">
      <section className="marketing-page__hero">
        <h1>Plan je perfecte event met Mister DJ</h1>
        <p>
          Wij zorgen voor de muziek, sfeer en techniek. Laat je gegevens achter en we
          nemen vrijblijvend contact op.
        </p>
      </section>

      <section id="contact" className="marketing-page__contact">
        <ContactForm className="marketing-page__contact-form" />
      </section>
    </main>
  );
}
