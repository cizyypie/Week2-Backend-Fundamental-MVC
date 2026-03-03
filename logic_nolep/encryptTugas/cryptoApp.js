import CryptoJS from 'crypto-js';

function encrypt(text, key) {
  return CryptoJS.AES.encrypt(text, key).toString();
}

function decrypt(encryptedText, key) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export { encrypt, decrypt };