import type { WolfParams } from 'src/entities/actors/Wolf';

import type { EventEmitter } from 'src/services/EventEmitter/EventEmitter';

import { Animation } from 'src/controllers/Animation';

import { HUD_WIDTH_COEFFICIENT, TEXTURE_SIZE, WEAPONS } from 'src/constants/config';
import {
  ACTOR_PORTRAIT_FRAME_SETS,
  FONT_IMAGE,
  FONT_SYMBOL_HEIGHT,
  FONT_SYMBOL_WIDTH,
  HUD_PANEL,
  PORTRAIT_HEIGHT,
  PORTRAIT_WIDTH,
  WEAPON_ICON_HEIGHT,
  WEAPON_ICON_WIDTH,
} from 'src/constants/hud';

import { generatePostEffectFrameSet } from 'src/utils/frameSets';

import type { Frame, HealthFrameSets, PostEffectFrame, ScreenData } from 'src/types';

type HudParams = {
  ctx: Hud['_ctx'];
  emitter: Hud['_emitter'];
  screenData: Hud['_screenData'];
  initialWeapon: keyof typeof WEAPONS;
};

export class Hud {
  private readonly _ctx: CanvasRenderingContext2D;
  private readonly _screenData: ScreenData;
  private readonly _weaponAnimation: Animation<Frame<HTMLImageElement>>;
  private readonly _postEffectAnimation: Animation<PostEffectFrame>;
  private readonly _portraitAnimation: Animation<Frame<HTMLImageElement>>;
  private readonly _emitter: EventEmitter;

  private _currentFrameSet: HealthFrameSets[keyof HealthFrameSets];
  private _scale: number;
  private _width: number;
  private _height: number;
  private _offsetX: number;
  private _offsetY: number;

  constructor(params: HudParams) {
    this._ctx = params.ctx;
    this._screenData = params.screenData;
    this._currentFrameSet = ACTOR_PORTRAIT_FRAME_SETS.HEALTHY;
    this._emitter = params.emitter;

    this._scale = (this._screenData.width * HUD_WIDTH_COEFFICIENT) / HUD_PANEL.WIDTH;

    this._width = Math.round(this._screenData.width * HUD_WIDTH_COEFFICIENT);
    this._height = Math.round(HUD_PANEL.HEIGHT * this._scale);

    this._offsetX = this._screenData.width / 2 - this._width / 2;
    this._offsetY = this._screenData.height - this._height;

    this._portraitAnimation = new Animation({
      renderFunction: this.renderPortrait.bind(this),
      frameSet: this._currentFrameSet,
      initialFrameIdx: 0,
      isLoopAnimation: true,
      emitter: this._emitter,
    });

    this._weaponAnimation = new Animation({
      renderFunction: this.renderWeapon.bind(this),
      initialFrameIdx: 0,
      isLoopAnimation: false,
      frameSet: WEAPONS[params.initialWeapon].frameSet,
      emitter: this._emitter,
    });

    this._postEffectAnimation = new Animation({
      renderFunction: this.renderPostEffect.bind(this),
      initialFrameIdx: 0,
      isLoopAnimation: false,
      frameSet: generatePostEffectFrameSet([255, 255, 0]),
      emitter: this._emitter,
    });

    this.registerEvents();
  }

  static getHealthFrameSet(health: number): HealthFrameSets[keyof HealthFrameSets] {
    if (health > 85) {
      return ACTOR_PORTRAIT_FRAME_SETS.HEALTHY;
    }

    if (health > 75) {
      return ACTOR_PORTRAIT_FRAME_SETS.JUST_A_SCRATCH;
    }

    if (health > 50) {
      return ACTOR_PORTRAIT_FRAME_SETS.MINOR_DAMAGE;
    }

    if (health > 35) {
      return ACTOR_PORTRAIT_FRAME_SETS.MODERATE_DAMAGE;
    }

    if (health > 20) {
      return ACTOR_PORTRAIT_FRAME_SETS.SEVERE_DAMAGE;
    }

    if (health > 5) {
      return ACTOR_PORTRAIT_FRAME_SETS.SUFFERING;
    }

    if (health > 0) {
      return ACTOR_PORTRAIT_FRAME_SETS.NEAR_DEATH;
    }

    return ACTOR_PORTRAIT_FRAME_SETS.DEAD;
  }

  private registerEvents() {
    this._emitter.on('wolfWeaponChange', this.onWeaponChange.bind(this));
    this._emitter.on('wolfBoostPickup', this.onBoostPickup.bind(this));
    this._emitter.on('wolfAttack', this.onAttack.bind(this));
    this._emitter.on('wolfHit', this.onWolfHit.bind(this));
  }

  private renderPostEffect(data: PostEffectFrame['data']) {
    this._ctx.fillStyle = data.color;
    this._ctx.fillRect(0, 0, this._screenData.width, this._screenData.height);
  }

  private renderWeapon(texture: HTMLImageElement) {
    const hudHeight = ((this._screenData.width * HUD_WIDTH_COEFFICIENT) / HUD_PANEL.WIDTH) * HUD_PANEL.HEIGHT;
    const weaponSize = this._screenData.height - hudHeight;
    const xOffset = this._screenData.width / 2 - weaponSize / 2;
    const yOffset = this._screenData.height - weaponSize - hudHeight;

    this._ctx.drawImage(texture, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE, xOffset, yOffset, weaponSize, weaponSize);
  }

  private renderPortrait(image: HTMLImageElement) {
    const textureXPositionOnScreen = this._offsetX + Math.round(HUD_PANEL.PORTRAIT_X_OFFSET * this._scale);
    const textureYPositionOnScreen = this._offsetY + Math.round(HUD_PANEL.PORTRAIT_Y_OFFSET * this._scale);

    this._ctx.drawImage(
      image,
      0,
      0,
      PORTRAIT_WIDTH,
      PORTRAIT_HEIGHT,
      textureXPositionOnScreen,
      textureYPositionOnScreen,
      Math.round(PORTRAIT_WIDTH * this._scale),
      Math.round(PORTRAIT_HEIGHT * this._scale)
    );
  }

  private renderText(value: number, segmentXOffset: number) {
    const stringValue = String(value);
    const valueWidth = Math.ceil(stringValue.length * FONT_SYMBOL_WIDTH * this._scale);

    for (let i = 0; i < stringValue.length; i++) {
      const number = Number(stringValue[i]);

      const textureOffset = number * FONT_SYMBOL_WIDTH;
      const numberOffset = i * FONT_SYMBOL_WIDTH;

      const textureXPositionOnScreen =
        this._offsetX + segmentXOffset + Math.ceil(numberOffset * this._scale) - valueWidth / 2;
      const textureYPositionOnScreen = this._offsetY + Math.ceil(HUD_PANEL.INFO_Y_OFFSET * this._scale);

      this._ctx.drawImage(
        FONT_IMAGE,
        textureOffset,
        0,
        FONT_SYMBOL_WIDTH,
        FONT_SYMBOL_HEIGHT,
        textureXPositionOnScreen,
        textureYPositionOnScreen,
        Math.ceil(FONT_SYMBOL_WIDTH * this._scale),
        Math.ceil(FONT_SYMBOL_HEIGHT * this._scale)
      );
    }
  }

  private onWeaponChange(newWeapon: keyof typeof WEAPONS) {
    this._weaponAnimation.updateFrameSet(WEAPONS[newWeapon].frameSet);
  }

  private onBoostPickup() {
    this._postEffectAnimation.updateFrameSet(generatePostEffectFrameSet([255, 255, 0]));
    this._postEffectAnimation.playAnimation();
  }

  private onWolfHit() {
    this._postEffectAnimation.updateFrameSet(generatePostEffectFrameSet([255, 0, 0]));
    this._postEffectAnimation.playAnimation();
  }

  private onAttack() {
    this._weaponAnimation.setActiveFrameIdx(0);
    this._weaponAnimation.playAnimation();
  }

  render({
    ammo,
    lives,
    score,
    health,
    currentWeapon,
    level,
  }: {
    ammo: WolfParams['ammo'];
    lives: WolfParams['lives'];
    score: WolfParams['score'];
    health: WolfParams['health'];
    currentWeapon: WolfParams['currentWeapon'];
    level: WolfParams['level'];
  }) {
    const updatedHealthFrameSet = Hud.getHealthFrameSet(health);

    if (updatedHealthFrameSet !== this._currentFrameSet) {
      this._currentFrameSet = updatedHealthFrameSet;
      this._portraitAnimation.updateFrameSet(this._currentFrameSet);
    }

    this._scale = (this._screenData.width * HUD_WIDTH_COEFFICIENT) / HUD_PANEL.WIDTH;

    this._width = Math.round(this._screenData.width * HUD_WIDTH_COEFFICIENT);
    this._height = Math.round(HUD_PANEL.HEIGHT * this._scale);

    this._offsetX = this._screenData.width / 2 - this._width / 2;
    this._offsetY = this._screenData.height - this._height;

    this._postEffectAnimation.render();

    this._ctx.drawImage(
      HUD_PANEL.TEXTURE,
      0,
      0,
      HUD_PANEL.WIDTH,
      HUD_PANEL.HEIGHT,
      this._offsetX,
      this._offsetY,
      this._width,
      this._height
    );

    this._ctx.drawImage(
      WEAPONS[currentWeapon].icon,
      0,
      0,
      WEAPON_ICON_WIDTH,
      WEAPON_ICON_HEIGHT,
      this._offsetX + Math.round(HUD_PANEL.WEAPON_X_OFFSET * this._scale),
      this._offsetY + Math.round(HUD_PANEL.WEAPON_Y_OFFSET * this._scale),
      Math.round(WEAPON_ICON_WIDTH * this._scale),
      Math.round(WEAPON_ICON_HEIGHT * this._scale)
    );

    this.renderText(level, HUD_PANEL.LEVEL_X_OFFSET * this._scale);
    this.renderText(score, HUD_PANEL.SCORE_X_OFFSET * this._scale);
    this.renderText(lives, HUD_PANEL.LIVES_X_OFFSET * this._scale);
    this.renderText(health, HUD_PANEL.HEALTH_X_OFFSET * this._scale);
    this.renderText(ammo, HUD_PANEL.AMMO_X_OFFSET * this._scale);

    this._weaponAnimation.render();
    this._portraitAnimation.render();
  }
}
