import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = './public/UploadedImages';
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    let obj1 = { files };

    const result = {
      path: obj1.files.file.path.replace(/public/g, '.'),
      title: obj1.files.file.name,
    };
    res.send(JSON.stringify(result));
  });
};
