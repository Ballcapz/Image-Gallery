import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';
import Header from '../components/header';
import { isValidImage } from '../lib/images';
import styles from '../styles/Upload.module.css';

export default function Upload({ apiUrl }) {
  const [file, setFile] = useState();
  const [workingImage, setWorkingImage] = useState('');
  const [error, setError] = useState('');
  const [opacity, setOpacity] = useState(1);
  const [savedStatus, setSavedStatus] = useState('');

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please Upload an Image File');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    axios.post(apiUrl, formData, config).then((res) => {
      setWorkingImage(res.data.filename);
      setFile();
      setOpacity(1);
    });
  };

  const onFormChange = (e) => {
    const file = e.target.files[0];
    if (isValidImage(file)) {
      setFile(file);
      setError('');
    } else {
      setError('Please upload an jpg/jpeg, png, or gif image');
      setFile();
    }
  };

  const handleOpacityUpdate = (e) => {
    setOpacity(e.target.value);
    document.documentElement.style.setProperty('--opacity', e.target.value);
  };

  const saveOpacity = (e) => {
    e.preventDefault();

    const lastSlash = workingImage.lastIndexOf('/');
    const imageName = workingImage.substr(lastSlash + 1);

    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };

    axios.post(`${apiUrl}/${imageName}/${opacity}`, {}, config).then((res) => {
      setSavedStatus('Success!');
    });
  };

  return (
    <>
      <Head>
        <title>Upload an Image</title>
      </Head>
      <Header />
      <form className={styles.form} onSubmit={onFormSubmit}>
        <h1>Upload an image and change it's opacity</h1>
        <input type="file" name="file" id="file" className={styles.upload} onChange={onFormChange} />
        <label htmlFor="file" className={styles.uploadLabel}>
          Choose a file
        </label>
        {file && <span className={styles.fileToUpload}>Your Chosen File: {file.name}</span>}
        {error !== '' && <span className={styles.error}>{error}</span>}
        <button type="submit" className={styles.submit}>
          Upload
        </button>
      </form>

      {workingImage !== '' && (
        <section className={styles.imageContainer}>
          <h2 className={styles.title}>Uploaded Image</h2>
          <section className={styles.control}>
            <label htmlFor="opacity">Change Opacity: </label>
            <input
              onChange={(e) => handleOpacityUpdate(e)}
              id="opacity"
              type="range"
              name="opacity"
              min="0.0"
              max="1.0"
              step="0.05"
              value={opacity}
            />
            <button onClick={saveOpacity} className={styles.submit}>
              Save Opacity
            </button>
          </section>
          <p className={styles.opacityValue}>
            Opacity set to {(opacity * 100).toFixed(0)}%
            {savedStatus !== '' && <span className={styles.saved}>{savedStatus}</span>}
          </p>
          <figure className={styles.figure}>
            <img className={styles.image} src={workingImage} />
          </figure>
        </section>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.API_URL;
  return { props: { apiUrl } };
}
