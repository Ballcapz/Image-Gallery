import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../components/header';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Upload an Image</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className={styles.main}>
        <p>LOGIN...</p>
      </main>
    </div>
  );
}
