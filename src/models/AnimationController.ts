class AnimationController {
  private readonly ctx: CanvasRenderingContext2D;
  private frameSet: HTMLImageElement[];
  private frameTime: null | number; // ms
  private currentFrameIdx: number;
  private derivedRenderFunction: (frame: HTMLImageElement) => void;
  private onAnimationEnd: () => void;
  private onAnimationStart: () => void;
  private onFrameChange: (frameIdx: number) => void;
  private isLoopAnimation: boolean;
  private frameDuration: number; // ms
  private frameSetChangeTimeout: number; // ms
  private timeoutTime: null | number; // ms

  constructor({
    ctx,
    renderFunction,
    frameSet,
    frameDuration,
    initialFrameIdx,
    isLoopAnimation,
    frameSetChangeTimeout = 0,
    onAnimationEnd = () => {},
    onAnimationStart = () => {},
    onFrameChange = () => {},
  }: {
    ctx: AnimationController['ctx'];
    renderFunction: AnimationController['derivedRenderFunction'];
    onAnimationEnd?: AnimationController['onAnimationEnd'];
    onAnimationStart?: AnimationController['onAnimationStart'];
    onFrameChange?: AnimationController['onFrameChange'];
    frameSet: AnimationController['frameSet'];
    frameDuration: AnimationController['frameDuration'];
    initialFrameIdx: AnimationController['currentFrameIdx'];
    isLoopAnimation: AnimationController['isLoopAnimation'];
    frameSetChangeTimeout?: AnimationController['frameSetChangeTimeout'];
  }) {
    this.ctx = ctx;

    this.frameSet = frameSet;
    this.frameTime = null;
    this.frameDuration = frameDuration;
    this.frameSetChangeTimeout = frameSetChangeTimeout;
    this.currentFrameIdx = initialFrameIdx;
    this.derivedRenderFunction = renderFunction;
    this.isLoopAnimation = isLoopAnimation;

    this.onAnimationEnd = onAnimationEnd;
    this.onAnimationStart = onAnimationStart;
    this.onFrameChange = onFrameChange;

    if (isLoopAnimation) {
      this.frameTime = new Date().getTime();
    }
  }

  updateFrameSet(frameSet: AnimationController['frameSet']) {
    this.frameSet = frameSet;
    this.currentFrameIdx = 0;
    this.frameTime = null;
    this.timeoutTime = new Date().getTime();
  }

  getCurrentFrame() {
    return this.currentFrameIdx;
  }

  updateCurrentFrame(frameIdx: AnimationController['currentFrameIdx']) {
    this.currentFrameIdx = frameIdx;
    this.frameTime = null;

    this.onFrameChange(this.currentFrameIdx);
  }

  updateFrameDuration(frameDuration: AnimationController['frameDuration']) {
    this.frameDuration = frameDuration;
  }

  getIsCurrentlyInTimeout() {
    const currentTime = new Date().getTime();

    if (!this.timeoutTime) {
      return false;
    }

    return currentTime < this.timeoutTime + this.frameSetChangeTimeout;
  }

  checkIsFrameTimeExpired() {
    if (this.frameTime) {
      const currentTime = new Date().getTime();

      return currentTime >= this.frameTime + this.frameDuration;
    }

    return false;
  }

  playAnimation() {
    if (this.currentFrameIdx === this.frameSet.length - 1) {
      this.frameTime = null;
      this.currentFrameIdx = 0;

      this.onAnimationEnd();

      if (this.isLoopAnimation) {
        this.frameTime = new Date().getTime();
      }
    } else {
      if (this.currentFrameIdx === 0) {
        this.onAnimationStart();
      }

      this.currentFrameIdx += 1;
      this.frameTime = new Date().getTime();
    }

    this.onFrameChange(this.currentFrameIdx);
  }

  iterate() {
    if (this.timeoutTime && !this.getIsCurrentlyInTimeout()) {
      this.timeoutTime = null;
    }

    if (this.checkIsFrameTimeExpired()) {
      this.playAnimation();
    }

    this.derivedRenderFunction(this.frameSet[this.currentFrameIdx]);
  }
}
