import fs from 'fs';

if (!fs.existsSync('.next') || !fs.existsSync('.next/static')) {
  console.error('ERROR: .next/static ontbreekt na build.');
  process.exit(2);
}

console.log('OK: .next/static aanwezig.');
