export class Timeout {
  private _timeoutTime: null | number;
  private _onTimeoutExpire: (() => void) | null;

  constructor(onTimeoutExpire: Timeout['_onTimeoutExpire'] = null) {
    this._timeoutTime = null;
    this._onTimeoutExpire = onTimeoutExpire;
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

  iterate() {
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
}
