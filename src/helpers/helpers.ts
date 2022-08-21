function fillWeaponFrameSet(weaponType: WeaponType, duration: number): Frame[] {
  const frameSet = [];

  for (let i = 0; i < 5; i++) {
    frameSet.push(
      getImageWithSource(`src/assets/weapons/${weaponType.toLowerCase()}/${weaponType.toLowerCase()}_frame_${i}.png`)
    );
  }

  return frameSet.map((frame) => ({
    image: frame,
    duration,
  }));
}

// todo type condition
function fillPortraitFrameSet(condition: string): Frame[] {
  const frameSet = [];

  for (let i = 0; i < 3; i++) {
    frameSet.push(getImageWithSource(`src/assets/hud/portrait/${condition.toLowerCase()}/frame_${i}.png`));
  }

  return [
    {
      image: frameSet[0],
      duration: 2000,
    },
    {
      image: frameSet[1],
      duration: 750,
    },
    {
      image: frameSet[2],
      duration: 750,
    },
    {
      image: frameSet[1],
      duration: 750,
    },
    {
      image: frameSet[0],
      duration: 1500,
    },
    {
      image: frameSet[1],
      duration: 1500,
    },
    {
      image: frameSet[2],
      duration: 200,
    },
    {
      image: frameSet[1],
      duration: 500,
    },
    {
      image: frameSet[2],
      duration: 500,
    },
    {
      image: frameSet[1],
      duration: 500,
    },
  ];
}

function getImageWithSource(path: string) {
  const image = new Image();
  image.src = path;
  return image;
}

function getFontOffsetByNumber(value: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9') {
  return FONT_SYMBOL_WIDTH * Number(value);
}
