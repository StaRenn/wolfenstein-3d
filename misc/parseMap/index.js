// parses maps from http://digitorum.ru/blog/2014/01/23/Wolfenstein-3D-Karty-vseh-urovnej.phtml
// slow af
// needs improvements

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const TEXTURES_PATH = '../../src/assets/textures';
const SECRETS_PATH = './secretWallsTextures';
const STATIC_SPRITES_PATH = '../../src/assets/sprites/static';
const HOLLOW_SPRITES_PATH = '../../src/assets/sprites/hollow';
const COLLECTING_SPRITES_PATH = '../../src/assets/sprites/collecting';
const MAPS_PATH = '../maps';
const OUTPUT_PATH = './output';
const START_POS_PATH = './playerStartPosition';

// these maps has broken sprites, without 2px from the bottom and 1 px from the top, so we need to crop our textures
const CELL_SIZE_WITH_BORDER = 66;
const CELL_WIDTH = 64;
const CELL_HEIGHT = 61;
const CELL_TOP_OFFSET = 2;
const CELL_LEFT_OFFSET = 1;

const BFS_ALLOWED_VALUES = [0, 27, 28, 33, 34];

async function prepareSpritesMap(spritesPath) {
  const spritesMap = {};

  const spriteImages = await fs.readdir(spritesPath);

  for (let file of spriteImages) {
    const buffer = await sharp(path.join(spritesPath, file))
      .extract({
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        left: 0,
        top: 1, // check code line 20
      })
      .flatten({ background: { r: 107, g: 111, b: 110, alpha: 1 } })
      .jpeg({ quality: 1 })
      .toBuffer();

    spritesMap[path.basename(file, '.png')] = buffer.toString('base64');
  }

  return spritesMap;
}

async function prepareTexturesMap(texturesPath) {
  const texturesMap = {};

  const texturesImages = await fs.readdir(texturesPath);

  for (let file of texturesImages) {
    const buffer = await sharp(path.join(texturesPath, file))
      .extract({
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        left: 0,
        top: 1, // check code line 20
      })
      .jpeg({ quality: 1 })
      .toBuffer();

    texturesMap[path.basename(file, '.png')] = buffer.toString('base64');
  }

  return texturesMap;
}

// bfs
function resolveSecrets(array, root) {
  const graph = array.map((arr) => [...arr]);
  const queue = [root];

  function checkNeighbor(coordinates, endCoordinates, arrayToMutate) {
    const node = (graph[coordinates[0]] || [])[coordinates[1]];
    const isSecretWallStart = typeof node === 'string' && node.includes('START') && node !== 'START_POS';

    if (BFS_ALLOWED_VALUES.includes(node) || isSecretWallStart) {
      const node = graph[coordinates[0]][coordinates[1]];

      if (typeof node === 'string' && node.includes('START')) {
        array[endCoordinates[0]][endCoordinates[1]] = node.replace('START', 'END');
      }

      graph[coordinates[0]][coordinates[1]] = 1;
      arrayToMutate.push([coordinates[0], coordinates[1]]);
    }
  }

  while (queue.length !== 0) {
    const current = queue.shift();

    checkNeighbor([current[0] - 1, current[1]], [current[0] - 3, current[1]], queue);
    checkNeighbor([current[0] + 1, current[1]], [current[0] + 3, current[1]], queue);
    checkNeighbor([current[0], current[1] + 1], [current[0], current[1] + 3], queue);
    checkNeighbor([current[0], current[1] - 1], [current[0], current[1] - 3], queue);
  }

  return array;
}

async function main() {
  const texturesMap = await prepareTexturesMap(TEXTURES_PATH);
  const secretsMap = await prepareTexturesMap(SECRETS_PATH);
  const playerStartPosMap = await prepareTexturesMap(START_POS_PATH);

  const staticSpritesMap = await prepareSpritesMap(STATIC_SPRITES_PATH);
  const hollowSpritesMap = await prepareSpritesMap(HOLLOW_SPRITES_PATH);
  const collectingSpritesMap = await prepareSpritesMap(COLLECTING_SPRITES_PATH);

  const mapNames = await fs.readdir(MAPS_PATH);

  for (let mapName of mapNames) {
    const image = await sharp(path.join(MAPS_PATH, mapName));
    const metadata = await image.metadata();
    const columns = metadata.height / CELL_SIZE_WITH_BORDER;
    const rows = metadata.width / CELL_SIZE_WITH_BORDER;

    let playerStartPosition = [0, 0];

    mapName = path.basename(mapName, '.png');

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
          .extract({
            width: CELL_WIDTH,
            height: CELL_HEIGHT,
            left: column * CELL_SIZE_WITH_BORDER + CELL_LEFT_OFFSET,
            top: row * CELL_SIZE_WITH_BORDER + CELL_TOP_OFFSET,
          })
          .jpeg({ quality: 1 })
          .toBuffer();

        const segmentBase64 = buffer.toString('base64');

        Object.keys(texturesMap).forEach((textureId) => {
          if (texturesMap[textureId] === segmentBase64) {
            const preparedTextureId = textureId % 2 === 1 ? textureId : textureId - 1;

            // reverse vertically
            map[rows - (row + 1)][column] = Number(preparedTextureId);
          }
        });

        Object.keys(secretsMap).forEach((textureId) => {
          if (secretsMap[textureId] === segmentBase64) {
            const preparedTextureId = textureId % 2 === 1 ? textureId : textureId - 1;

            // reverse vertically
            map[rows - (row + 1)][column] = `${preparedTextureId}_ID${row}${column}_START`;
          }
        });

        Object.keys(playerStartPosMap).forEach((textureId) => {
          if (playerStartPosMap[textureId] === segmentBase64) {
            map[rows - (row + 1)][column] = 'START_POS';
            playerStartPosition = [rows - (row + 1), column];
          }
        });

        Object.keys(staticSpritesMap).forEach((textureId) => {
          if (staticSpritesMap[textureId] === segmentBase64) {
            // reverse vertically
            map[rows - (row + 1)][column] = `${textureId}_SPRITE`;
          }
        });

        Object.keys(hollowSpritesMap).forEach((textureId) => {
          if (hollowSpritesMap[textureId] === segmentBase64) {
            // reverse vertically
            map[rows - (row + 1)][column] = `${textureId}_SPRITE_HOLLOW`;
          }
        });

        Object.keys(collectingSpritesMap).forEach((textureId) => {
          if (collectingSpritesMap[textureId] === segmentBase64) {
            // reverse vertically
            map[rows - (row + 1)][column] = `${textureId}_SPRITE_COLLECTING`;
          }
        });

        const percentDone = ((row * rows + column + 1) / (columns * rows)) * 100;

        console.clear();
        console.log(`${mapName} | PROGRESS: ${percentDone.toFixed(2)}%`);
      }
    }

    const resolvedMap = resolveSecrets(map, playerStartPosition);

    await fs.writeFile(path.join(OUTPUT_PATH, `${mapName}.json`), JSON.stringify(resolvedMap));
  }
}

main();
