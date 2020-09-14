import fs from 'fs';
import { join } from 'path';

const imageDirectory = join(process.cwd(), 'public', 'UploadedImages');

export function getImagePaths() {
  return fs.readdirSync(imageDirectory);
}
