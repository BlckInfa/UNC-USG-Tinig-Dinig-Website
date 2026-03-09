import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = path.resolve('src/assets/department_leader');
const outputDir = path.resolve('src/assets/department_leader/optimized');

const files = [
  'USG PRESIDENT_Jan Marill Dominguez_.jpg',
  'BACC CHAIRPERSON_Osher San Agustin.jpg',
  'CS CHAIRPERSON_Bryann Joshua Francisco.jpg',
  'EACC CHAIRPERSON_Charles Emil Carillo.jpg',
  'ECC CHAIRPERSON_Hannah Beatrice Reginaldo.jpg',
  'NCC CHAIRPERSON_Mary Claire Razon.jpg',
  'SSNSCC CHAIRPERSON_Princess Jean Madera.jpg',
  'FSOFS PRESIDENT_Felicity Marcaida.jpg',
];

await fs.mkdir(outputDir, { recursive: true });

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const outputFileName = `${path.parse(file).name}.webp`;
  const outputPath = path.join(outputDir, outputFileName);

  const image = sharp(inputPath, { failOn: 'none' });
  const metadata = await image.metadata();
  const width = metadata.width && metadata.width > 1600 ? 1600 : metadata.width;

  await image
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile(outputPath);

  const stats = await fs.stat(outputPath);
  const sizeInMb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`${outputFileName} -> ${sizeInMb} MB`);
}