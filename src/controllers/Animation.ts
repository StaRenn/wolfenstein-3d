import { Timeout } from './Timeout';

import type { Frame } from 'src/types';

type AnimationParams<FrameType extends Frame<unknown>> = {
  frameSet: Animation<FrameType>['_frameSet'];
  initialFrameIdx?: Animation<FrameType>['_currentFrameIdx'];
  isLoopAnimation?: Animation<FrameType>['_isLoopAnimation'];
  renderFunction?: Animation<FrameType>['_derivedRenderFunction'];
  onAnimationEnd?: Animation<FrameType>['_onAnimationEnd'];
  onAnimationStart?: Animation<FrameType>['_onAnimationStart'];
  onFrameChange?: Animation<FrameType>['_onFrameChange'];
};

export class Animation<FrameType extends Frame<unknown>> {
  private _frameSet: FrameType[];
  private _currentFrameIdx: number;
  private _isLoopAnimation: boolean;
  private _derivedRenderFunction: (frame: FrameType['data']) => void;
  private _onAnimationEnd: () => void;
  private _onAnimationStart: () => void;
  private _onFrameChange: (frameIdx: number) => void;
  private _timeout: Timeout;

  constructor({
    frameSet,
    initialFrameIdx = 0,
    isLoopAnimation = false,
    renderFunction = () => {},
    onAnimationEnd = () => {},
    onAnimationStart = () => {},
    onFrameChange = () => {},
  }: AnimationParams<FrameType>) {
    this._frameSet = frameSet;
    this._currentFrameIdx = initialFrameIdx;
    this._derivedRenderFunction = renderFunction;
    this._isLoopAnimation = isLoopAnimation;

    this._onAnimationEnd = onAnimationEnd;
    this._onAnimationStart = onAnimationStart;
    this._onFrameChange = onFrameChange;

    this.playAnimation = this.playAnimation.bind(this);

    this._timeout = new Timeout(this.playAnimation);

    if (isLoopAnimation && this.currentFrame.duration !== Infinity) {
      this._timeout.set(this.currentFrame.duration);
    }
  }

  set onAnimationEnd(callback: Animation<FrameType>['_onAnimationEnd']) {
    this._onAnimationEnd = callback;
  }

  set onAnimationStart(callback: Animation<FrameType>['_onAnimationStart']) {
    this._onAnimationStart = callback;
  }

  set onFrameChange(callback: Animation<FrameType>['_onFrameChange']) {
    this._onFrameChange = callback;
  }

  get currentFrameIdx() {
    return this._currentFrameIdx;
  }

  get currentFrame() {
    return this._frameSet[this._currentFrameIdx];
  }

  get isCurrentlyInTimeout() {
    return !this._timeout.isExpired;
  }

  playAnimation() {
    // if last frame: reset and call callbacks, else: set next frame
    if (this._currentFrameIdx === this._frameSet.length - 1) {
      this._timeout.reset();
      this._currentFrameIdx = 0;

      this._onAnimationEnd();

      // if looped, start same animation
      if (this._isLoopAnimation && this.currentFrame.duration !== Infinity) {
        this._timeout.set(this.currentFrame.duration);
      }
    } else {
      if (this._currentFrameIdx === 0) {
        this._onAnimationStart();
      }

      this._currentFrameIdx += 1;

      if (this.currentFrame.duration !== Infinity) {
        this._timeout.set(this.currentFrame.duration);
      }
    }

    this._onFrameChange(this._currentFrameIdx);
  }

  updateFrameSet(frameSet: FrameType[]) {
    this._frameSet = frameSet;
    this._currentFrameIdx = 0;
    this._timeout.reset();

    if (this._isLoopAnimation && this.currentFrame.duration !== Infinity) {
      this._timeout.set(this.currentFrame.duration);
    }
  }

  setActiveFrameIdx(frameIdx: number) {
    if (frameIdx > this._frameSet.length - 1) {
      throw Error(`Frame ${frameIdx} is out of bounds`);
    }

    this._currentFrameIdx = frameIdx;
    this._timeout.reset();

    if (this._isLoopAnimation && this.currentFrame.duration !== Infinity) {
      this._timeout.set(this.currentFrame.duration);
    }
  }

  iterate() {
    this._timeout.iterate();
  }

  render() {
    this._derivedRenderFunction(this._frameSet[this._currentFrameIdx].data);
  }
}
