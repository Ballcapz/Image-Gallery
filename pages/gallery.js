import { getImagePaths } from '../lib/images';
import Header from '../components/header';
import styles from '../styles/Gallery.module.css';

export default function Gallery({ imagePaths }) {
  return (
    <>
      <Header />
      <section className={styles.imageList}>
        {imagePaths.map((imagePath) => {
          return (
            <figure className={styles.figure}>
              <img className={styles.image} src={`/UploadedImages/${imagePath}`} alt="picture!" />
            </figure>
          );
        })}
      </section>
    </>
  );
}

export async function getServerSideProps() {
  const imagePaths = getImagePaths();

  return {
    props: {
      imagePaths,
    },
  };
}
