import { SimpleGCallback } from './ateInterfaces';

export class ATERenderLoop {

  private readonly _gameLoopInterval: NodeJS.Timeout;
  private readonly _functionLoop: SimpleGCallback<number>;
  private readonly _framerate: number;

  private _lastTime: number;

  private constructor(functionLoop: SimpleGCallback<number>, framerate: number) {
    this._framerate = framerate;
    this._functionLoop = functionLoop;
    this._lastTime = new Date().getTime();
    this._gameLoopInterval = setInterval(() => this.internalLoop(), 1000 / this._framerate);
  }

  private internalLoop(): void {
    const currentTime = new Date().getTime();
    const deltaTime = (currentTime - this._lastTime) / 1000;
    this._lastTime = currentTime;

    this._functionLoop(deltaTime);
  }

  static create(functionLoop: SimpleGCallback<number>, framerate: number): ATERenderLoop {
    return new ATERenderLoop(functionLoop, framerate);
  }
}
