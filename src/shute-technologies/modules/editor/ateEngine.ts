import { ATESegment } from './ateSegment';
import { ATELayer } from './ateLayer';
import { ATEPlayback } from './atePlayback';
import { ATEHTMLButton } from '../components/ateHtmlButton';
import { SimpleCallback, SimpleGCallback, ATEIAnimationData } from '../common/ateInterfaces';
import { ATEStyles } from '../config/ateStyles';
import { ATEEngineHelper } from './helpers/ateEngineHelper';

export class ATEEngine {

  static readonly IgnoreExtraParams = 999999019.091;
  static readonly RemoveExtraParams = 999999019.092;

  private _ctx: CanvasRenderingContext2D;

  private _parentSelectorName: string;
  private _parentSelector: JQuery<HTMLElement>;

  private _parentGUISelectorNameParentCanvasSelector: JQuery<HTMLElement>;
  private _parentCanvasSelectorName: string;

  private _parentGUISelector: JQuery<HTMLElement>;
  private _parentGUISelectorName: string;

  private _inputCurrentTimeSelector;
  private _inputTimeLimitSelector: JQuery<HTMLElement>;

  // UI Controls
  private _controlsUI_Selector: JQuery<HTMLElement>;

  // Layer Controls
  private _layersUI_Selector: JQuery<HTMLElement>;

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

  get parentSelector(): JQuery<HTMLElement> { return this._parentSelector; }
  get parentGUISelector(): JQuery<HTMLElement> { return this._parentGUISelector; }
  get controlsUI_Selector(): JQuery<HTMLElement> { return this._controlsUI_Selector; }
  get layersUI_Selector(): JQuery<HTMLElement> { return this._layersUI_Selector; }
  get inputCurrentTimeSelector(): JQuery<HTMLElement> { return this._inputCurrentTimeSelector; }

  // internal for GUI
  get width(): number { return this._width; }
  get height(): number { return this._height; }
  get scrollX(): number { return this._scrollX; }
  get scrollY(): number { return this._scrollY; }
  get gui_RealSegmentWidth(): number { return this._GUI_RealSegmentWidth; }
  get gui_RealSubSegmentWidth(): number { return this._GUI_RealSubSegmentWidth; }

  get layers(): Array<ATELayer> { return this._layers; }
  get segments(): Array<ATESegment> { return this._segments; }
  get playbackController(): ATEPlayback { return this._playbackController; }
  get currentFocusSegment(): number { return this._currentFocusSegment; }
  get ctx (): CanvasRenderingContext2D { return this._ctx; }

  set forceATEHeight(val: number) { this._height = val; }
  set onRecordCallback(val: SimpleCallback) { this._onRecordCallback = val; }
  set onPlayOrPauseCallback(val: SimpleGCallback<boolean>) { this._onPlayOrPauseCallback = val; }
  set onStopCallback(val: SimpleCallback) { this._onStopCallback = val; }

  get animationData(): ATEIAnimationData {
    const resultData = ATEEngineHelper.defaultAnimationData();
    resultData.animationSeconds = this._animationSeconds;
    resultData.fps = this._playbackController.fps;
    resultData.layerCount = this._layers.length;

    for (const layer of this._layers) {
      resultData.layers.push({
        data: layer.layerData,
        name: layer.layerName,
        dataType: layer.layerDataType,
        isInterpolable: layer.layerIsInterpolable,
        extraParams: layer.extraLayerParams
      });
    }

    return resultData;
  }

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
