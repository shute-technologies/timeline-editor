import { ATEEngine } from './ateEngine';
import { ATEStyles } from '../config/ateStyles';
import { ATEVector2 } from '../common/ateInterfaces';
import { ATEUtils } from '../common/ateUtils';
import { ATEPlaybackEngine } from '../runtime/atePlaybackEngine';
import { ATEEngineHelper } from './helpers/ateEngineHelper';

export class ATEPlayback {

  private _ctx: CanvasRenderingContext2D;
  private _isPlaying: boolean;
  private _wasStopped: boolean;
  private _fps: number;
  private _currentTime: number;
  private _animationSecondsToPlay: number;
  private _playingSpeed: number;
  private _inputCurrentTimeSelector: JQuery<HTMLElement>;

  // variables: not playing
  private _isMouseDown: boolean;
  private _mousePos: ATEVector2;

  get isPlaying(): boolean { return this._isPlaying; }
  get wasStopped(): boolean { return this._wasStopped; }
  get currentTime(): number { return this._currentTime; }
  get fps(): number { return this._fps; }

  constructor (private readonly _ate: ATEEngine) {
    this._ctx = this._ate.ctx;
    this._isPlaying = false;
    this._wasStopped = false;
    this._fps = 0;
    this._currentTime = 0;
    this._animationSecondsToPlay = 0;
    this._playingSpeed = ATEStyles.playback.defaultTime;
    this._inputCurrentTimeSelector = this._ate.inputCurrentTimeSelector;

    // variables: not playing
    this._isMouseDown = false;
    this._mousePos = { x: 0, y: 0 };
  }

  configureFPS(fps: number, noChange = false): void {
    this._fps = fps;

    this._playingSpeed = ATEStyles.playback.defaultTime;

    if (!noChange) {
      // change
      if (this._ate.onChangeCallback) { this._ate.onChangeCallback(); }
    }
  }

  onMouseOut(mousePos: ATEVector2): void {
    if (!this._isPlaying) {
      this._isMouseDown = false;
    }
  }

  onMouseMove(mousePos: ATEVector2): void {
    this._mousePos = mousePos;
  }

  onMouseUp(mousePos: ATEVector2): void {
    if (!this._isPlaying) {
      this._isMouseDown = false;
    }
  }

  onMouseDown(mousePos: ATEVector2): void {
    if (!this._isPlaying) {
      const scrollX = this._ate.scrollX;
      const offsetX = ATEStyles.timeline.offsetX;
      const animationSeconds = this._ate.animationSeconds;
      const segmentWidth = this._ate.gui_RealSegmentWidth;
      const x = offsetX;
      const y = 0;
      const width = (segmentWidth * animationSeconds);
      const height = this._ate.height + ATEStyles.ac_TimelineHeight;

      if (ATEUtils.hitTestByPoint(x, y, width, height, mousePos.x, mousePos.y)) {
        this._isMouseDown = true;
      }
    }
  }

  playOrPause(): void {
    this._isPlaying = !this._isPlaying;
    this._wasStopped = false;

    const lastKeyframe = ATEPlaybackEngine.getLastKeyframeInAnimation(this._ate.layers);
    this._animationSecondsToPlay = lastKeyframe.time === 0
      ? this._ate.animationSeconds
      : lastKeyframe.time;

    // Layers: OnPlayOrPause
    for (const layer of this._ate.layers) { layer.onPlayOrPause(this._isPlaying); }
  }

  stop(): void {
    this._isPlaying = false;
    this._wasStopped = true;
    this._currentTime = 0;

    // Layers: OnPlayOrPause
    for (const layer of this._ate.layers) { layer.onStop(); }
    // Update
    this._inputCurrentTimeSelector.val(ATEUtils.formatTimeAsSeconds(this._currentTime * 1000));
  }

  // tslint:disable-next-line: cyclomatic-complexity
  update(dt: number): void {
    let changedTime = false;

    if (this._isPlaying) {
        if (this._currentTime >= this._animationSecondsToPlay) {
          this._currentTime = 0;
        } else {
          this._currentTime += this._playingSpeed * dt;
          this._currentTime = this._currentTime < 0 ? 0 : this._currentTime;
          this._currentTime = this._currentTime > this._animationSecondsToPlay
            ? this._animationSecondsToPlay
            : this._currentTime;
        }

        changedTime = true;
    } else {
      if (this._isMouseDown) {
        const scrollX = this._ate.scrollX;
        const inSegment = ATEEngineHelper.getSegment(this._ate, this._mousePos.x - scrollX, this._mousePos.y);
        const newTime = inSegment / ATEStyles.default_SubSegments;
        const animationSeconds = this._ate.animationSeconds;

        if (this._currentTime !== newTime) {
          this._currentTime = newTime;
          this._currentTime = this._currentTime < 0 ? 0 : this._currentTime;
          this._currentTime = this._currentTime > animationSeconds ? animationSeconds : this._currentTime;

          changedTime = true;
        }
      }
    }

    if (this._isPlaying || this._isMouseDown) {
      const isEditable = !this._isPlaying && this._isMouseDown;
      for (const layer of this._ate.layers) { layer.updateFromPlayback(this._currentTime, dt, isEditable); }
    }

    this.draw(dt, changedTime);
  }

  private draw(dt: number, changedTime: boolean) {
    const scrollX = this._ate.scrollX;
    const segmentWidth = this._ate.gui_RealSegmentWidth;
    const subSegmentWidth = this._ate.gui_RealSubSegmentWidth;
    const x = ((ATEStyles.timeline.offsetX + (this._currentTime * segmentWidth)) -
      subSegmentWidth - (ATEStyles.playback.gui_Width / 4) + 1) + scrollX;
    const y = ATEStyles.timeline.offsetY;
    const xCenter = x + (ATEStyles.playback.gui_Width * 0.5) + 1;

    // Draw box
    this._ctx.beginPath();
    this._ctx.fillStyle = ATEStyles.playback.gui_BackgroundColor;
    this._ctx.fillRect(x + ATEStyles.playback.gui_TextTimeOffset.x, y,
      ATEStyles.playback.gui_Width, ATEStyles.playback.gui_Height);
    this._ctx.closePath();

    // Draw line
    this._ctx.beginPath();
    this._ctx.moveTo(xCenter, y);
    this._ctx.lineTo(xCenter, this._ate.height);
    this._ctx.lineWidth = 1;
    this._ctx.strokeStyle = ATEStyles.playback.gui_LineColor;
    this._ctx.stroke();
    this._ctx.closePath();

    // Draw time
    this._ctx.font = ATEStyles.playback.gui_TextStyle;
    this._ctx.fillStyle = ATEStyles.playback.gui_TextColor;
    this._ctx.textAlign = 'center';
    this._ctx.fillText(
      ATEUtils.formatTime((this._currentTime + ATEPlaybackEngine.EPSILON) * 1000, 2, true),
      xCenter,
      y + ATEStyles.playback.gui_Height + ATEStyles.playback.gui_TextTimeOffset.y
    );

    if (changedTime) {
      // set the GUI current time
      this._inputCurrentTimeSelector.val(ATEUtils.formatTimeAsSeconds((this._currentTime + ATEPlaybackEngine.EPSILON) * 1000));
    }
  }
}
