// parses maps from http://digitorum.ru/blog/2014/01/23/Wolfenstein-3D-Karty-vseh-urovnej.phtml
// slow af
// needs improvements

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const TEXTURES_PATH = '../../src/assets/textures';
const MAPS_PATH = '../maps';
const OUTPUT_PATH = './output';

const TEXTURES_MAP = {};

async function main() {
  const files = await fs.readdir(TEXTURES_PATH);

  for (let file of files) {
    const buffer = await sharp(path.join(TEXTURES_PATH, file)).jpeg().toBuffer();

    TEXTURES_MAP[path.basename(file, '.png')] = buffer.toString('base64');
  }

  const mapNames = await fs.readdir(MAPS_PATH);

  for (let mapName of mapNames) {
    const image = await sharp(path.join(MAPS_PATH, mapName));
    const metadata = await image.metadata();
    const columns = metadata.height / 66;
    const rows = metadata.width / 66;

    const map = [];

    for (let i = 0; i < rows; i++) {
      map.push([]);

      for (let j = 0; j < columns; j++) {
        map[i].push(0);
      }
    }

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const buffer = await image
          .extract({ width: 64, height: 64, left: column * 66 + 1, top: row * 66 + 1 })
          .jpeg()
          .toBuffer();

        const segmentBase64 = buffer.toString('base64');

        Object.keys(TEXTURES_MAP).forEach((textureId) => {
          if (TEXTURES_MAP[textureId] === segmentBase64) {
            const preparedTextureId = textureId % 2 === 1 ? textureId : textureId - 1;

            // reverse vertically
            map[rows - (row + 1)][column] = Number(preparedTextureId);
          }
        });

        const percentDone = ((row * rows + column) / (columns * rows)) * 100;

        console.clear();
        console.log(`${path.basename(mapName, '.png')} | PROGRESS: ${percentDone.toFixed(2)}%`);
      }
    }

    await fs.writeFile(path.join(OUTPUT_PATH, `${path.basename(mapName, '.png')}.json`), JSON.stringify(map));
  }
}

main();
