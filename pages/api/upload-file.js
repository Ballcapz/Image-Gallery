import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = './public/UploadedImages' || './UploadedImages';
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      let fileObject = { files };

      const result = {
        path: fileObject.files.file.path.replace(/public/g, '.'),
        title: fileObject.files.file.name,
      };
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
      resolve();
    });
  });
};
