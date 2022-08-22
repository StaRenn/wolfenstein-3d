function fillWeaponFrameSet(weaponType: WeaponType, duration: number): Frame<HTMLImageElement>[] {
  const frameSet = [];

  for (let i = 0; i < 5; i++) {
    frameSet.push(
      getImageWithSource(`src/assets/weapons/${weaponType.toLowerCase()}/${weaponType.toLowerCase()}_frame_${i}.png`)
    );
  }

  return frameSet.map((frame) => ({
    data: frame,
    duration,
  }));
}

function fillPortraitFrameSet(condition: HealthFrameSetName): Frame<HTMLImageElement>[] {
  const frameSet = [];

  for (let i = 0; i < 3; i++) {
    frameSet.push(getImageWithSource(`src/assets/hud/portrait/${condition.toLowerCase()}/frame_${i}.png`));
  }

  return [
    {
      data: frameSet[0],
      duration: 2000,
    },
    {
      data: frameSet[1],
      duration: 750,
    },
    {
      data: frameSet[2],
      duration: 750,
    },
    {
      data: frameSet[1],
      duration: 750,
    },
    {
      data: frameSet[0],
      duration: 1500,
    },
    {
      data: frameSet[1],
      duration: 1500,
    },
    {
      data: frameSet[2],
      duration: 200,
    },
    {
      data: frameSet[1],
      duration: 500,
    },
    {
      data: frameSet[2],
      duration: 500,
    },
    {
      data: frameSet[1],
      duration: 500,
    },
  ];
}

function getImageWithSource(path: string) {
  const image = new Image();
  image.src = path;
  return image;
}
