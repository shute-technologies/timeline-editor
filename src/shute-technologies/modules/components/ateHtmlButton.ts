import { ATEEngine } from '../editor/ateEngine';
import { SimpleGCallback, FnCallback } from '../common/ateInterfaces';

export class ATEHTMLButton {

  private _srcState1;
  private _srcState2;
  private _button: JQuery<HTMLElement>;
  private _isToggled: boolean;
  private _callbackClick: SimpleGCallback<any>;
  private _callbackCanClick: FnCallback<boolean>;

  get buttonSelector(): JQuery<HTMLElement> { return this._button; }

  set callbackClick(val: SimpleGCallback<any>) { this._callbackClick = val; }
  set callbackCanClick(val: FnCallback<boolean>) { this._callbackCanClick = val; }

  constructor (private readonly _ate: ATEEngine) {
    this._isToggled = false;
  }

  initialize(srcState1: string, srcState2: string): void {
    this._srcState1 = srcState1;
    this._srcState2 = srcState2;

    this._button = $(`<img src='${this._srcState1}' width='20' />`);
    this._button.on('click', this.onClick);
  }

  reset(): void {
    this._isToggled = false;
    this._button.attr('src', this._srcState1);
  }

  addMargin(): void {
    this._button.css('margin-left', '4px');
  }

  private onClick(evt): void {
    let canClick = true;

    if (this._callbackCanClick) {
      canClick = this._callbackCanClick();
    }

    if (canClick) {
      this._isToggled = !this._isToggled;

      if (this._srcState2) {
        this._button.attr('src', this._isToggled ? this._srcState2 : this._srcState1);
      }

      if (this._callbackClick) {
        this._callbackClick(evt);
      }
    }
  }
}
