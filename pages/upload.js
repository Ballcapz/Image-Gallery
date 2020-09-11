import { post } from 'axios';
import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState();
  const [workingImage, setWorkingImage] = useState('');
  const [imageTitle, setImageTitle] = useState('');

  const onFormSubmit = (e) => {
    e.preventDefault();
    fileUpload(file).then((response) => {
      console.log('In response', response.data);
      setWorkingImage(response.data.path);
      setImageTitle(response.data.title);
    });
  };

  const onFormChange = (e) => {
    setFile(e.target.files[0]);
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
      <form onSubmit={onFormSubmit}>
        <h1>Upload an image</h1>
        <input type="file" onChange={onFormChange} />
        <button type="submit">Upload</button>
      </form>

      {workingImage !== '' && (
        <section>
          <h2>{imageTitle}</h2>
          <figure>
            <img src={workingImage} />
          </figure>
        </section>
      )}
    </>
  );
}
