import { encrypt, decrypt } from './cryptoApp.js';
import { scheduleTask } from './scheduleApp.js';

console.log('--- Testing cryptoApp ---');

const encryptedText = encrypt('Hello, World!', 'mysecretkey');
console.log('Encrypted Text:', encryptedText);

const decryptedText = decrypt(encryptedText, 'mysecretkey');
console.log('Decrypted Text:', decryptedText);
console.log('--- Testing scheduleApp ---');
console.log (scheduleTask());
