import Header from '../components/header';
import Head from 'next/head';
import styles from '../styles/Gallery.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Gallery({ apiUrl }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get(apiUrl).then((res) => {
      setImages(res.data);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Image Gallery</title>
      </Head>
      <Header />
      {images.length > 0 && (
        <section className={styles.imageList}>
          {images.map((image) => {
            return (
              <figure className={styles.figure} key={image.image.name}>
                <img
                  className={styles.image}
                  style={{ filter: `opacity(${image.opacity})` }}
                  src={`https://imageupload22.blob.core.windows.net/images/${image.image.name}`}
                  alt={image.name}
                />
              </figure>
            );
          })}
        </section>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.API_URL;
  return {
    props: {
      apiUrl,
    },
  };
}
