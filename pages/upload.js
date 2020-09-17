import axios from 'axios';
import { useState } from 'react';
import Header from '../components/header';

import styles from '../styles/Upload.module.css';

export default function Upload({ apiUrl }) {
  const [file, setFile] = useState();
  const [workingImage, setWorkingImage] = useState('');
  const [error, setError] = useState('');
  const [opacity, setOpacity] = useState(1.0);

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
      console.log(res.data);
      setWorkingImage(res.data.filename);
      setFile();
    });
  };

  const onFormChange = (e) => {
    const file = e.target.files[0];
    if (isValidImage(file)) {
      setFile(file);
      setError('');
    }
  };

  const isValidImage = (file) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setError('Please upload an jpg/jpeg, png, or gif image');
      setFile();
      return false;
    }

    return true;
  };

  const handleUpdate = (e) => {
    // handlue ui update
    setOpacity(e.target.value);
    // update the variable
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
      console.log(res.data);
    });
  };

  return (
    <>
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
              onChange={(e) => handleUpdate(e)}
              id="opacity"
              type="range"
              name="opacity"
              min="0.0"
              max="1.0"
              step="0.05"
              value={opacity}
            />
          </section>
          <figure className={styles.figure}>
            <img className={styles.image} src={workingImage} />
          </figure>
          <button onClick={saveOpacity}>Save Opacity</button>
        </section>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.API_URL;
  return { props: { apiUrl } };
}
