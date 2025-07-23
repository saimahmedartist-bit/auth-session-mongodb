import Link from 'next/link';
import styles from './index.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Authentication App🚀</h1>
      <p className={styles.subtitle}>Simple authentication with Next.js & Express by Saim Ahmed</p>

      <div className={styles.buttonGroup}>
        <Link href="/register">
          <button className={styles.button}>Register Here</button>
        </Link>

        <Link href="/login">
          <button className={styles.button}>Login Here</button>
        </Link>
      </div>
    </div>
  );
}
