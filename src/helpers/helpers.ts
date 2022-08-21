function fillWeaponFrameSet(weaponType: WeaponType) {
  const frameSet = [];

  for (let i = 0; i < 5; i++) {
    const image = new Image();
    image.src = `src/assets/weapons/${weaponType.toLowerCase()}/${weaponType.toLowerCase()}_frame_${i}.png`;
    frameSet.push(image);
  }

  return frameSet;
}
