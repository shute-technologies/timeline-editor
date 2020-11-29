import { ATESegment } from './ateSegment';
import { ATELayer } from './ateLayer';
import { ATEPlayback } from './atePlayback';
import { ATEHTMLButton } from '../components/ateHtmlButton';
import { SimpleCallback, SimpleGCallback } from '../common/ateInterfaces';
import { ATEStyles } from '../config/ateStyles';

export class ATEEngine {

  private _ctx: CanvasRenderingContext2D;

  private _parentSelectorName: string;
  private _parentSelector;

  private _parentGUISelectorNameParentCanvasSelector;
  private _parentCanvasSelectorName: string;

  private _parentGUISelector;
  private _parentGUISelectorName: string;

  private _inputCurrentTimeSelector;
  private _inputTimeLimitSelector;

  // UI Controls
  private _controlsUI_Selector;

  // Layer Controls
  private _layersUI_Selector;

  private _width: number;
  private _height: number;
  private _contentHeight: number;
  private _scrollX: number;
  private _scrollY: number;

  // variables
  private _animationSeconds: number;
  private _subSegments: number;
  private _segments: Array<ATESegment>;
  private _layers: Array<ATELayer>;
  private _playbackController: ATEPlayback;
  private _currentFocusSegment: number;

  // internal variables for GUI
  private _GUI_RealSegmentWidth: number;
  private _GUI_RealSubSegmentWidth: number;

  // buttons
  private _button_playOrPause: ATEHTMLButton;
  private _button_record: ATEHTMLButton;
  private _button_stop: ATEHTMLButton;

  // scrollBar: X
  private _scrollXSelector;
  private _scrollXContentSelector;
  // scrollBar: Y
  private _scrollYSelector;
  private _scrollYContentSelector;

  // functions callback events
  private _onRecordCallback: SimpleCallback;
  private _onPlayOrPauseCallback: SimpleGCallback<boolean>;
  private _onStopCallback: SimpleCallback;
  onChangeCallback: SimpleCallback;

  get buttonPlayOrPause(): ATEHTMLButton { return this._button_playOrPause; }
  get buttonRecord(): ATEHTMLButton { return this._button_record; }
  get buttonStop(): ATEHTMLButton { return this._button_stop; }

  get animationSeconds(): number { return this._animationSeconds; }
  get subSegments(): number { return this._subSegments; }

  get parentSelector() { return this._parentSelector; }
  get parentGUISelector() { return this._parentGUISelector; }
  get controlsUI_Selector() { return this._controlsUI_Selector; }
  get layersUI_Selector() { return this._layersUI_Selector; }
  get inputCurrentTimeSelector() { return this._inputCurrentTimeSelector; }

  // internal for GUI
  get width() { return this._width; }
  get height() { return this._height; }
  get scrollX() { return this._scrollX; }
  get scrollY() { return this._scrollY; }
  get gui_RealSegmentWidth() { return this._GUI_RealSegmentWidth; }
  get gui_RealSubSegmentWidth() { return this._GUI_RealSubSegmentWidth; }

  get layers() { return this._layers; }
  get segments() { return this._segments; }
  get playbackController() { return this._playbackController; }
  get currentFocusSegment () { return this._currentFocusSegment; }
  get ctx (): CanvasRenderingContext2D { return this._ctx; }

  set forceATEHeight(val: number) { this._height = val; }
  set onRecordCallback(val: SimpleCallback) { this._onRecordCallback = val; }
  set onPlayOrPauseCallback(val: SimpleGCallback<boolean>) { this._onPlayOrPauseCallback = val; }
  set onStopCallback(val: SimpleCallback) { this._onStopCallback = val; }


  constructor() {
    this._width = 0;
    this._height = 0;
    this._contentHeight = 0;
    this._scrollX = 0;
    this._scrollY = 0;
    this._subSegments = ATEStyles.default_SubSegments;
    this._segments = [];
    this._layers = [];
    this._currentFocusSegment = -1;
    this._onRecordCallback = null;
    this._onPlayOrPauseCallback = null;
    this._onStopCallback = null;
    this.onChangeCallback = null;
  }
}