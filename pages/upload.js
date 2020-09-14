import { post } from 'axios';
import { useState } from 'react';
import Header from '../components/header';

import styles from '../styles/Upload.module.css';

export default function Upload() {
  const [file, setFile] = useState();
  const [workingImage, setWorkingImage] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [error, setError] = useState('');
  const [opacity, setOpacity] = useState(1.0);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please Upload an Image File');
      return;
    }
    fileUpload(file).then((response) => {
      setWorkingImage(response.data.path);
      setImageTitle(response.data.title);
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

  const fileUpload = (file) => {
    const url = `${window.location.origin}/api/upload-file`;
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    return post(url, formData, config);
  };

  const handleUpdate = (e) => {
    // handlue ui update
    setOpacity(e.target.value);
    // update the variable
    document.documentElement.style.setProperty('--opacity', e.target.value);
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
          <h2 className={styles.title}>Uploaded Image: {imageTitle}</h2>
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
        </section>
      )}
    </>
  );
}
