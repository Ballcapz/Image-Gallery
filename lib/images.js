export function isValidImage(file, setError, setFile) {
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (!allowedExtensions.exec(file.name)) {
    return false;
  }

  return true;
}
