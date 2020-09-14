import { getImagePaths } from '../lib/images';
import Header from '../components/header';

export default function Gallery({ imagePaths }) {
  return (
    <>
      <Header />
      <ul>
        {imagePaths.map((imagePath) => {
          return (
            <li>
              <img style={{ height: '50px', width: 'auto' }} src={`/UploadedImages/${imagePath}`} alt="picture!" />
            </li>
          );
        })}
      </ul>
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
