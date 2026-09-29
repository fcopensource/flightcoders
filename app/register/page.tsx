import Link from "next/link";
import styles from "../auth.module.css";

export const metadata = { title: "Register" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string; sent?: string; email?: string }> }) {
  const params = await searchParams;
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}><span className={styles.mark}>FC</span> FlightCoders</Link>
      <section className={styles.visual}>
        <div className={styles.kicker}>JOIN FLIGHTCODERS / 01</div>
        <h1>Make something.<br /><span>Finish it.</span></h1>
        <p>Create your account and get ready for the next FlightCoders build sprint.</p>
        <div className={styles.note}><span>NO PASSIVE LEARNING</span><span>BUILD IN PUBLIC</span></div>
      </section>
      <section className={styles.formSide}>
        <form className={styles.form} action="/api/auth/register" method="post">
          <span className={styles.code}>AUTH / REGISTER</span>
          <h2>Create account</h2>
          <p className={styles.intro}>One account for upcoming FlightCoders challenges.</p>
          {params.sent && <div className={styles.message}>Account created. Check {params.email || "your email"} for the verification link.</div>}
          {params.error && <div className={styles.error}>{params.error}</div>}
          <Link className={styles.github} href="/api/auth/github?next=%2F"><span className={styles.gh}>GH</span><b>Continue with GitHub</b><span>↗</span></Link>
          <div className={styles.divider}>OR REGISTER WITH EMAIL</div>
          <div className={styles.fields}>
            <label className={styles.label}>Full name<input name="name" autoComplete="name" placeholder="Your name" required maxLength={80} /></label>
            <label className={styles.label}>Email<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required maxLength={190} /></label>
            <label className={styles.label}>Password<input type="password" name="password" autoComplete="new-password" placeholder="8+ characters" required minLength={8} maxLength={72} /></label>
            <label className={styles.label}>Confirm password<input type="password" name="confirmPassword" autoComplete="new-password" placeholder="Repeat password" required minLength={8} maxLength={72} /></label>
          </div>
          <input type="hidden" name="role" value="Developer" />
          <input type="hidden" name="track" value="Build Sprint" />
          <small className={styles.rule}>Use uppercase, lowercase, a number, and at least 8 characters.</small>
          <label className={styles.check}><input type="checkbox" name="terms" required /><span>I agree to create a FlightCoders account and receive essential account emails.</span></label>
          <button className={styles.submit} type="submit">Create account ↗</button>
          <p className={styles.switch}>Already have an account? <Link href="/login">Sign in</Link></p>
        </form>
      </section>
    </main>
  );
}
