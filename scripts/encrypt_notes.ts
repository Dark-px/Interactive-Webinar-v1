import fs from 'fs';
import path from 'path';
import { slidesData } from '../src/slidesData';
import { encrypt } from '../src/cryptoUtils';

const KEY = "258658";

function run() {
  console.log("Starting slide notes encryption...");
  
  const encryptedSlides = slidesData.map(slide => {
    if (slide.notes) {
      return {
        ...slide,
        notes: encrypt(slide.notes, KEY),
        isEncrypted: true
      };
    }
    return slide;
  });

  const fileContent = `import { Slide } from "./types";

// Note: Speaker notes in this file are secure and encrypted.
// They are decrypted at runtime with the presenter password key.
export const slidesData: any[] = ${JSON.stringify(encryptedSlides, null, 2)};
`;

  const outputPath = path.join(process.cwd(), 'src/slidesData.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log("Encryption completed. Encrypted file written to src/slidesData.ts");
}

run();
