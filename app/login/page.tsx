import Link from "next/link";
import styles from "../auth.module.css";

export const metadata = { title: "Login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; verified?: string }> }) {
  const params = await searchParams;
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}><span className={styles.mark}>FC</span> FlightCoders</Link>
      <section className={styles.visual}>
        <div className={styles.kicker}>MEMBER ACCESS / 01</div>
        <h1>Welcome back.<br /><span>Keep building.</span></h1>
        <p>Your account is the doorway. The work is what matters.</p>
        <div className={styles.note}><span>BUILD → SHIP → REPEAT</span><span>FC / 2026</span></div>
      </section>
      <section className={styles.formSide}>
        <form className={styles.form} action="/api/auth/login" method="post">
          <span className={styles.code}>AUTH / LOGIN</span>
          <h2>Sign in</h2>
          <p className={styles.intro}>Use your FlightCoders account to continue.</p>
          {params.verified && <div className={styles.message}>Email verified. You can sign in now.</div>}
          {params.error && <div className={styles.error}>{params.error}</div>}
          <Link className={styles.github} href="/api/auth/github?next=%2F"><span className={styles.gh}>GH</span><b>Continue with GitHub</b><span>↗</span></Link>
          <div className={styles.divider}>OR USE EMAIL</div>
          <input type="hidden" name="next" value="/" />
          <label className={[styles.label, styles.full].join(" ")}>Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label className={[styles.label, styles.full].join(" ")} style={{ marginTop: 14 }}>Password<input type="password" name="password" autoComplete="current-password" placeholder="Your password" required /></label>
          <button className={styles.submit} type="submit" style={{ marginTop: 20 }}>Sign in ↗</button>
          <p className={styles.switch}>New here? <Link href="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}
