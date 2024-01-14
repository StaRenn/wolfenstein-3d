import type { Events } from './eventTypes';

type CallBack<T> = (data: T) => void;

export class EventEmitter {
  private events: { [Key in keyof Events]?: CallBack<Events[Key]>[] } = {};

  on<T extends keyof Events>(event: T, callback: CallBack<Events[T]>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event]!.push(callback);
  }

  once<T extends keyof Events>(event: T, callback: CallBack<Events[T]>) {
    const onceListener = (data: Events[T]) => {
      this.off(event, onceListener);

      callback(data);
    };

    this.on(event, onceListener);
  }

  off<T extends keyof Events>(event: T, callback: CallBack<Events[T]>) {
    if (!this.events[event]) {
      return;
    }

    const callbackIndex = this.events[event]!.indexOf(callback);

    if (callbackIndex >= 0) {
      this.events[event]!.splice(callbackIndex, 1);
    }
  }

  emit<T extends keyof Events>(event: T, data: Events[T]) {
    if (!this.events[event]) {
      return;
    }

    this.events[event]!.forEach((callback: CallBack<Events[T]>) => callback(data));
  }
}
