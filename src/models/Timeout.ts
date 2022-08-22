class Timeout {
  private timeoutTime: null | number;
  private onTimeoutExpire: () => void;

  constructor(onTimeoutExpire: Timeout['onTimeoutExpire'] = () => {}) {
    this.timeoutTime = null;
    this.onTimeoutExpire = onTimeoutExpire;
  }

  get isExpired() {
    return !this.timeoutTime;
  }

  reset() {
    this.timeoutTime = null;
  }

  set(timeoutDuration: number) {
    this.timeoutTime = new Date().getTime() + timeoutDuration;
  }

  iterate() {
    if (this.timeoutTime) {
      const currentTime = new Date().getTime();

      if (currentTime > this.timeoutTime) {
        this.timeoutTime = null;
        this.onTimeoutExpire();
      }
    }
  }
}
