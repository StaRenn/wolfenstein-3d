const WEAPONS: Weapons = {
  KNIFE: {
    frameSet: fillWeaponFrameSet('KNIFE', 50),
    maxDistance: 10,
    damage: 10,
    frameDuration: 50,
    ammoPerAttack: 0,
    icon: getImageWithSource('src/assets/hud/knife.png'),
  },
  PISTOL: {
    frameSet: fillWeaponFrameSet('PISTOL', 80),
    maxDistance: 70,
    damage: 40,
    frameDuration: 80,
    ammoPerAttack: 1,
    icon: getImageWithSource('src/assets/hud/pistol.png'),
  },
  MACHINE_GUN: {
    frameSet: fillWeaponFrameSet('MACHINE_GUN', 30),
    maxDistance: 70,
    damage: 20,
    frameDuration: 30,
    ammoPerAttack: 1,
    icon: getImageWithSource('src/assets/hud/machine_gun.png'),
  },
};
