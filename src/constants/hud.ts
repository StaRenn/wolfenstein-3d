import { HealthFrameSets } from '../types';
import { fillPortraitFrameSet } from '../helpers/frameSets';
import { getImageWithSource } from '../utils/getImageWithSource';

export const HUD_PANEL = {
  TEXTURE: getImageWithSource(`src/assets/hud/panel.png`),
  WIDTH: 400,
  HEIGHT: 40,
  INFO_Y_OFFSET: 16,
  WEAPON_Y_OFFSET: 8,
  LEVEL_X_OFFSET: 65,
  SCORE_X_OFFSET: 111,
  LIVES_X_OFFSET: 156,
  HEALTH_X_OFFSET: 219,
  AMMO_X_OFFSET: 262,
  WEAPON_X_OFFSET: 296,
  PORTRAIT_X_OFFSET: 174,
  PORTRAIT_Y_OFFSET: 5,
} as const;

export const FONT_IMAGE = getImageWithSource('src/assets/hud/font.png');

export const FONT_SYMBOL_WIDTH = 8;
export const FONT_SYMBOL_HEIGHT = 16;

export const WEAPON_ICON_WIDTH = 48;
export const WEAPON_ICON_HEIGHT = 24;

export const PORTRAIT_WIDTH = 30;
export const PORTRAIT_HEIGHT = 31;

export const ACTOR_PORTRAIT_FRAME_SETS: HealthFrameSets = {
  HEALTHY: fillPortraitFrameSet('HEALTHY'),
  JUST_A_SCRATCH: fillPortraitFrameSet('JUST_A_SCRATCH'),
  MINOR_DAMAGE: fillPortraitFrameSet('MINOR_DAMAGE'),
  MODERATE_DAMAGE: fillPortraitFrameSet('MODERATE_DAMAGE'),
  SEVERE_DAMAGE: fillPortraitFrameSet('SEVERE_DAMAGE'),
  SUFFERING: fillPortraitFrameSet('SUFFERING'),
  NEAR_DEATH: fillPortraitFrameSet('NEAR_DEATH'),
  DEAD: [
    {
      data: getImageWithSource('src/assets/hud/portrait/dead/frame_0.png'),
      duration: 10000,
    },
  ],
};
