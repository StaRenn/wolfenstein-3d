import { Timeout } from './Timeout';
import { Frame } from '../types';

export class AnimationController<FrameType extends Frame<unknown>> {
  private frameSet: FrameType[];
  private currentFrameIdx: number;
  private isLoopAnimation: boolean;
  private derivedRenderFunction: (frame: FrameType['data']) => void;
  private onAnimationEnd: () => void;
  private onAnimationStart: () => void;
  private onFrameChange: (frameIdx: number) => void;
  private timeout: Timeout;

  constructor({
    frameSet,
    renderFunction,
    initialFrameIdx,
    isLoopAnimation,
    onAnimationEnd = () => {},
    onAnimationStart = () => {},
    onFrameChange = () => {},
  }: {
    frameSet: AnimationController<FrameType>['frameSet'];
    renderFunction: AnimationController<FrameType>['derivedRenderFunction'];
    initialFrameIdx: AnimationController<FrameType>['currentFrameIdx'];
    isLoopAnimation: AnimationController<FrameType>['isLoopAnimation'];
    onAnimationEnd?: AnimationController<FrameType>['onAnimationEnd'];
    onAnimationStart?: AnimationController<FrameType>['onAnimationStart'];
    onFrameChange?: AnimationController<FrameType>['onFrameChange'];
  }) {
    this.frameSet = frameSet;
    this.currentFrameIdx = initialFrameIdx;
    this.derivedRenderFunction = renderFunction;
    this.isLoopAnimation = isLoopAnimation;

    this.onAnimationEnd = onAnimationEnd;
    this.onAnimationStart = onAnimationStart;
    this.onFrameChange = onFrameChange;

    this.playAnimation = this.playAnimation.bind(this);

    this.timeout = new Timeout(this.playAnimation);

    if (isLoopAnimation) {
      this.timeout.set(this.getCurrentFrame().duration);
    }
  }

  updateFrameSet(frameSet: FrameType[]) {
    this.frameSet = frameSet;
    this.currentFrameIdx = 0;
    this.timeout.reset();

    if (this.isLoopAnimation) {
      this.timeout.set(this.getCurrentFrame().duration);
    }
  }

  getCurrentFrame() {
    return this.frameSet[this.currentFrameIdx];
  }

  getIsCurrentlyInTimeout() {
    return !this.timeout.isExpired;
  }

  playAnimation() {
    if (this.currentFrameIdx === this.frameSet.length - 1) {
      this.timeout.reset();
      this.currentFrameIdx = 0;

      this.onAnimationEnd();

      if (this.isLoopAnimation) {
        this.timeout.set(this.getCurrentFrame().duration);
      }
    } else {
      if (this.currentFrameIdx === 0) {
        this.onAnimationStart();
      }

      this.currentFrameIdx += 1;
      this.timeout.set(this.getCurrentFrame().duration);
    }

    this.onFrameChange(this.currentFrameIdx);
  }

  iterate() {
    this.timeout.iterate();

    this.derivedRenderFunction(this.frameSet[this.currentFrameIdx].data);
  }
}
