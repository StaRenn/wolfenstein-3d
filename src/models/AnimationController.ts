class AnimationController {
  private frameSet: Frame[];
  private frameTime: null | number; // ms
  private currentFrameIdx: number;
  private derivedRenderFunction: (frame: HTMLImageElement) => void;
  private onAnimationEnd: () => void;
  private onAnimationStart: () => void;
  private onFrameChange: (frameIdx: number) => void;
  private isLoopAnimation: boolean;
  private frameSetChangeTimeout: number; // ms
  private timeoutTime: null | number; // ms

  constructor({
    renderFunction,
    frameSet,
    initialFrameIdx,
    isLoopAnimation,
    frameSetChangeTimeout = 0,
    onAnimationEnd = () => {},
    onAnimationStart = () => {},
    onFrameChange = () => {},
  }: {
    renderFunction: AnimationController['derivedRenderFunction'];
    onAnimationEnd?: AnimationController['onAnimationEnd'];
    onAnimationStart?: AnimationController['onAnimationStart'];
    onFrameChange?: AnimationController['onFrameChange'];
    frameSet: AnimationController['frameSet'];
    initialFrameIdx: AnimationController['currentFrameIdx'];
    isLoopAnimation: AnimationController['isLoopAnimation'];
    frameSetChangeTimeout?: AnimationController['frameSetChangeTimeout'];
  }) {
    this.frameSet = frameSet;
    this.frameTime = null;
    this.timeoutTime = null;
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

      return currentTime >= this.frameTime + this.frameSet[this.currentFrameIdx].duration;
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
    console.log(this.frameSet);
    this.derivedRenderFunction(this.frameSet[this.currentFrameIdx].image);
  }
}
