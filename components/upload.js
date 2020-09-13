import { post } from 'axios';
import { useState } from 'react';

import styles from '../styles/Upload.module.css';

export default function Upload() {
  const [file, setFile] = useState();
  const [workingImage, setWorkingImage] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [error, setError] = useState('');

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please Upload a File');
      return;
    }
    fileUpload(file).then((response) => {
      console.log('In response', response.data);
      setWorkingImage(response.data.path);
      setImageTitle(response.data.title);
      setFile();
    });
  };

  const onFormChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
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

  return (
    <>
      <form className={styles.form} onSubmit={onFormSubmit}>
        <h1>Upload an image and change it's opacity</h1>
        <input type="file" onChange={onFormChange} />
        {error !== '' && <span className={styles.error}>{error}</span>}
        <button type="submit">Upload</button>
      </form>

      {workingImage !== '' && (
        <section className={styles.imageContainer}>
          <h2 className={styles.title}>Uploaded Image: {imageTitle}</h2>
          <figure className={styles.figure}>
            <img className={styles.image} src={workingImage} />
          </figure>
        </section>
      )}
    </>
  );
}
