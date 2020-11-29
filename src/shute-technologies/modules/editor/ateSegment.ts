import { ATEEngine } from './ateEngine';
import { ATEUtils } from '../common/ateUtils';
import { ATEStyles } from '../config/ateStyles';

export class ATESegment {
  private readonly _ctx: CanvasRenderingContext2D;

  firstSegment: boolean;
  lastSegment: boolean;

  private _actualSecond: number;
  private _actualSecondString: string;
  private _lastSecondString: string;

  constructor(private readonly _ate: ATEEngine) {
    this._ctx = this._ate.ctx;
    this.firstSegment = false;
    this.lastSegment = false;
    this._actualSecond = 0;
    this._actualSecondString = '';
    this._lastSecondString = '';
  }

  initialize(second: number): void {
    this._actualSecond = second;
    this._actualSecondString = ATEUtils.formatTime(this._actualSecond * 1000, 2);
    this._lastSecondString = ATEUtils.formatTime((this._actualSecond + 1) * 1000, 2);
  }

  // tslint:disable-next-line: cyclomatic-complexity
  draw(dt: number): void {
    const tsWidth = ATEStyles.ac_TimelineSegmentWidth;
    const subSegments = this._ate.subSegments + 1;
    const subSegmentWidth = tsWidth / subSegments;

    const scrollX = this._ate.scrollX;
    const initX = this._actualSecond * tsWidth - (this._actualSecond !== 0 ? subSegmentWidth * this._actualSecond : 0);
    const initY = ATEStyles.ac_TimelineHeight;

    for (let i = 0; i < subSegments; i++) {
      const x = Math.round(initX + i * subSegmentWidth) + ATEStyles.timeline.offsetX + scrollX;
      const y = Math.round(initY) + ATEStyles.timeline.offsetY;
      const isLimit = i === 0 || i === subSegments - 1;
      const subSegmentHeight = isLimit ? ATEStyles.ac_TimelineSubSegmentLimitsHeight : ATEStyles.ac_TimelineSubSegmentHeight;
      const canRenderTime = i === 0 || (i === subSegments - 1 && this.lastSegment);

      // Draw second and milliseconds lines
      this._ctx.beginPath();
      this._ctx.moveTo(x, y);
      this._ctx.lineTo(x, y - subSegmentHeight);
      this._ctx.lineWidth = 1;
      this._ctx.strokeStyle = ATEStyles.ac_TimelineSubSegment_Color;
      this._ctx.stroke();
      this._ctx.closePath();

      // Draw background line
      this._ctx.beginPath();
      this._ctx.moveTo(x, y);
      this._ctx.lineTo(x, this._ate.height - ATEStyles.scrollbarHeight);
      this._ctx.lineWidth = 1;
      this._ctx.strokeStyle = isLimit ? ATEStyles.ac_TimelineSubSegment_Color : ATEStyles.cStroke_Color;
      this._ctx.stroke();
      this._ctx.closePath();

      if (canRenderTime) {
        const offsetTextY = 10;
        const text = i === subSegments - 1 && this.lastSegment ? this._lastSecondString : this._actualSecondString;

        this._ctx.font = ATEStyles.ac_TimelineSubSegment_TextStyle;
        this._ctx.fillStyle = ATEStyles.font_Color;
        this._ctx.textAlign = /*this._actualSecond === 0 ? 'left' : */ 'center';
        this._ctx.fillText(text, x, y - ATEStyles.ac_TimelineSubSegmentLimitsHeight - offsetTextY);
      }
    }
  }

  destroy(): void {
    (this as any)['_ctx'] = null;
    (this as any)['_ate'] = null;
    this._actualSecondString = null;
    this._lastSecondString = null;
  }
}
