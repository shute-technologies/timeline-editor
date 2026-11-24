import { ATEEngine } from '../editor/ateEngine';
import { SimpleGCallback, FnCallback, ATEIHTMLButtonOptions } from '../common/ateInterfaces';

// A <button type='button'> showing an image or host markup, optionally a toggle between two states.
export class ATEHTMLButton {

  static readonly ClassName = 'ate-button';
  static readonly ToggledClassName = 'is-toggled';
  static readonly StyleElementId = 'ate-button-styles';
  static readonly ImageWidth = 20;

  private _srcState1: string;
  private _srcState2: string;
  private _options: ATEIHTMLButtonOptions;
  private _button: JQuery<HTMLElement>;
  private _isToggled: boolean;
  private _callbackClick: SimpleGCallback<JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>>;
  private _callbackCanClick: FnCallback<boolean>;

  get buttonSelector(): JQuery<HTMLElement> { return this._button; }
  get isToggled(): boolean { return this._isToggled; }

  set callbackClick(val: SimpleGCallback<JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>>) { this._callbackClick = val; }
  set callbackCanClick(val: FnCallback<boolean>) { this._callbackCanClick = val; }

  constructor (private readonly _ate: ATEEngine) {
    this._isToggled = false;
  }

  /**
   * state1 is what the button shows, state2 what it shows while toggled (each click toggles it). A state
   * starting with '<' is markup, inserted as HTML; anything else is an image URL.
   */
  initialize(srcState1: string, srcState2?: string, options?: ATEIHTMLButtonOptions): void {
    this._srcState1 = srcState1;
    this._srcState2 = srcState2;
    this._options = options || {};

    ATEHTMLButton.injectStyles();

    this._button = $(`<button type='button'></button>`);
    this._button.addClass(ATEHTMLButton.ClassName);

    if (this._options.className) {
      this._button.addClass(this._options.className);
    }

    this._button.on('click', (evt) => this.onClick(evt));
    this.render();
  }

  reset(): void {
    this._isToggled = false;
    this.render();
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

      if (this._srcState2 || this._options.toggle) {
        this.render();
      }

      if (this._callbackClick) {
        this._callbackClick(evt);
      }
    }
  }

  private render(): void {
    const isToggled = this._isToggled && !!this._srcState2;
    ATEHTMLButton.setContent(this._button, isToggled ? this._srcState2 : this._srcState1);

    if (this._options.toggle) {
      this._button.toggleClass(ATEHTMLButton.ToggledClassName, this._isToggled);
      this._button.attr('aria-pressed', this._isToggled ? 'true' : 'false');
    }

    const label = this._isToggled && this._options.toggledLabel ? this._options.toggledLabel : this._options.label;

    if (label) {
      this._button.attr('aria-label', label);
    }
  }

  destroy(): void {
    this._srcState1 = null;
    this._srcState2 = null;
    this._options = null;
    this._button = null;
    this._callbackClick = null;
    this._callbackCanClick = null;
  }

  static isMarkup(content: string): boolean {
    return typeof content === 'string' && /^\s*</.test(content);
  }

  private static setContent(button: JQuery<HTMLElement>, content: string): void {
    if (ATEHTMLButton.isMarkup(content)) {
      button.html(content);
      return;
    }

    const children = button.children();

    // An image already: swap its source, as the button always has
    if (children.length === 1 && children.is('img')) {
      children.attr('src', content);
    } else {
      button.empty().append($('<img />').attr({ src: content, width: ATEHTMLButton.ImageWidth, alt: '' }));
    }
  }

  // Strips the button's own look so it shows only its content. One class selector, first in <head>: any
  // host rule for .ate-button or anything more specific overrides it, without !important.
  private static injectStyles(): void {
    if (typeof document === 'undefined' || document.getElementById(ATEHTMLButton.StyleElementId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = ATEHTMLButton.StyleElementId;
    style.textContent = `.${ATEHTMLButton.ClassName}{margin:0;padding:0;border:0;border-radius:0;background:none;`
      + 'font:inherit;color:var(--ate-label);vertical-align:baseline;-webkit-appearance:none;appearance:none}'
      + `.${ATEHTMLButton.ClassName}::-moz-focus-inner{padding:0;border:0}`;

    const head = document.head || document.documentElement;
    head.insertBefore(style, head.firstChild);
  }
}
