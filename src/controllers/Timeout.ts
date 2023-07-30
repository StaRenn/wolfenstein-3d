import type { EventEmitter } from 'src/services/EventEmitter/EventEmitter';

export class Timeout {
  private _timeoutTime: null | number;
  private _onTimeoutExpire: (() => void) | null;
  private _emitter: EventEmitter;

  constructor(emitter: EventEmitter, onTimeoutExpire: Timeout['_onTimeoutExpire'] = null) {
    this._timeoutTime = null;
    this._onTimeoutExpire = onTimeoutExpire;
    this._emitter = emitter;

    this.registerEvents();
  }

  private registerEvents() {
    this._emitter.on('frameUpdate', this.update.bind(this));
  }

  private update() {
    if (this._timeoutTime) {
      const currentTime = new Date().getTime();

      // check expiration
      if (currentTime > this._timeoutTime) {
        this._timeoutTime = null;

        if (this._onTimeoutExpire) {
          this._onTimeoutExpire();
        }
      }
    }
  }

  set onTimeoutExpire(callback: Timeout['_onTimeoutExpire']) {
    this._onTimeoutExpire = callback;
  }

  get isExpired() {
    return !this._timeoutTime;
  }

  reset() {
    this._timeoutTime = null;
  }

  set(timeoutDuration: number) {
    this._timeoutTime = new Date().getTime() + timeoutDuration;
  }
}
