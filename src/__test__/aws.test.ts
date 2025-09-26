import { describe, it, expect } from 'vitest';
import { GenerateQuestions } from '../lib/aws-bedrock';

describe('Amazon Bedrock Testing', () => {
  it('Test One', async () => {
    await GenerateQuestions({
      content: `Tata Surya adalah kumpulan benda langit yang terdiri dari Matahari sebagai pusatnya, serta planet, satelit, asteroid, komet, dan meteoroid yang mengorbit mengelilinginya. Planet-planet terbagi menjadi dua kelompok: planet dalam (Merkurius, Venus, Bumi, Mars) yang ukurannya kecil dan berbatu, serta planet luar (Jupiter, Saturnus, Uranus, Neptunus) yang berukuran besar dan sebagian besar terdiri dari gas.`,
    });
  });
});
