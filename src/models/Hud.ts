class Hud {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly screenData: ScreenData;
  private currentFrameSet: HealthFrameSets[HealthFrameSetName];
  private portraitAnimation: AnimationController<Frame<HTMLImageElement>>;
  private scale: number;
  private width: number;
  private height: number;
  private offsetX: number;
  private offsetY: number;

  constructor(ctx: Hud['ctx'], screenData: Hud['screenData']) {
    this.ctx = ctx;
    this.screenData = screenData;
    this.currentFrameSet = ACTOR_PORTRAIT_FRAME_SETS.HEALTHY;

    this.renderPortrait = this.renderPortrait.bind(this);

    this.portraitAnimation = new AnimationController({
      renderFunction: this.renderPortrait,
      frameSet: this.currentFrameSet,
      initialFrameIdx: 0,
      isLoopAnimation: true,
    });
  }

  getHealthFrameSet(health: number): HealthFrameSets[HealthFrameSetName] {
    if (health > 85) {
      return ACTOR_PORTRAIT_FRAME_SETS.HEALTHY;
    } else if (health > 75) {
      return ACTOR_PORTRAIT_FRAME_SETS.JUST_A_SCRATCH;
    } else if (health > 50) {
      return ACTOR_PORTRAIT_FRAME_SETS.MINOR_DAMAGE;
    } else if (health > 35) {
      return ACTOR_PORTRAIT_FRAME_SETS.MODERATE_DAMAGE;
    } else if (health > 20) {
      return ACTOR_PORTRAIT_FRAME_SETS.SEVERE_DAMAGE;
    } else if (health > 5) {
      return ACTOR_PORTRAIT_FRAME_SETS.SUFFERING;
    } else if (health > 0) {
      return ACTOR_PORTRAIT_FRAME_SETS.NEAR_DEATH;
    } else {
      return ACTOR_PORTRAIT_FRAME_SETS.DEAD;
    }
  }

  renderPortrait(image: HTMLImageElement) {
    const textureXPositionOnScreen = this.offsetX + Math.round(HUD_PANEL.PORTRAIT_X_OFFSET * this.scale);
    const textureYPositionOnScreen = this.offsetY + Math.round(HUD_PANEL.PORTRAIT_Y_OFFSET * this.scale);

    this.ctx.drawImage(
      image,
      0,
      0,
      PORTRAIT_WIDTH,
      PORTRAIT_HEIGHT,
      textureXPositionOnScreen,
      textureYPositionOnScreen,
      Math.round(PORTRAIT_WIDTH * this.scale),
      Math.round(PORTRAIT_HEIGHT * this.scale)
    );
  }

  renderText(value: number, segmentXOffset: number) {
    const stringValue = String(value);
    const valueWidth = Math.ceil(stringValue.length * FONT_SYMBOL_WIDTH * this.scale);

    for (let i = 0; i < stringValue.length; i++) {
      const number = Number(stringValue[i]);

      const textureOffset = number * FONT_SYMBOL_WIDTH;
      const numberOffset = i * FONT_SYMBOL_WIDTH;

      const textureXPositionOnScreen =
        this.offsetX + segmentXOffset + Math.ceil(numberOffset * this.scale) - valueWidth / 2;
      const textureYPositionOnScreen = this.offsetY + Math.ceil(HUD_PANEL.INFO_Y_OFFSET * this.scale);

      this.ctx.drawImage(
        FONT_IMAGE,
        textureOffset,
        0,
        FONT_SYMBOL_WIDTH,
        FONT_SYMBOL_HEIGHT,
        textureXPositionOnScreen,
        textureYPositionOnScreen,
        Math.ceil(FONT_SYMBOL_WIDTH * this.scale),
        Math.ceil(FONT_SYMBOL_HEIGHT * this.scale)
      );
    }
  }

  render({
    ammo,
    lives,
    score,
    health,
    currentWeapon,
    level,
  }: {
    ammo: Actor['ammo'];
    lives: Actor['lives'];
    score: Actor['score'];
    health: Actor['health'];
    currentWeapon: Actor['currentWeapon'];
    level: Actor['level'];
  }) {
    const updatedHealthFrameSet = this.getHealthFrameSet(health);

    if (updatedHealthFrameSet !== this.currentFrameSet) {
      this.currentFrameSet = updatedHealthFrameSet;
      this.portraitAnimation.updateFrameSet(this.currentFrameSet);
    }

    this.scale = (this.screenData.screenWidth * HUD_WIDTH_COEFFICIENT) / HUD_PANEL.WIDTH;

    this.width = Math.round(this.screenData.screenWidth * HUD_WIDTH_COEFFICIENT);
    this.height = Math.round(HUD_PANEL.HEIGHT * this.scale);

    this.offsetX = this.screenData.screenWidth / 2 - this.width / 2;
    this.offsetY = this.screenData.screenHeight - this.height;

    this.ctx.drawImage(
      HUD_PANEL.TEXTURE,
      0,
      0,
      HUD_PANEL.WIDTH,
      HUD_PANEL.HEIGHT,
      this.offsetX,
      this.offsetY,
      this.width,
      this.height
    );

    this.ctx.drawImage(
      WEAPONS[currentWeapon].icon,
      0,
      0,
      WEAPON_ICON_WIDTH,
      WEAPON_ICON_HEIGHT,
      this.offsetX + Math.round(HUD_PANEL.WEAPON_X_OFFSET * this.scale),
      this.offsetY + Math.round(HUD_PANEL.WEAPON_Y_OFFSET * this.scale),
      Math.round(WEAPON_ICON_WIDTH * this.scale),
      Math.round(WEAPON_ICON_HEIGHT * this.scale)
    );

    this.renderText(level, HUD_PANEL.LEVEL_X_OFFSET * this.scale);
    this.renderText(score, HUD_PANEL.SCORE_X_OFFSET * this.scale);
    this.renderText(lives, HUD_PANEL.LIVES_X_OFFSET * this.scale);
    this.renderText(health, HUD_PANEL.HEALTH_X_OFFSET * this.scale);
    this.renderText(ammo, HUD_PANEL.AMMO_X_OFFSET * this.scale);

    this.portraitAnimation.iterate();
  }
}
