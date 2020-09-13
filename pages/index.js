import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Upload from '../components/upload';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Upload an Image</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>LOGIN...</p>
      </main>
      <footer className={styles.footer}>
        <p>Zach Johnson</p>
      </footer>
    </div>
  );
}
