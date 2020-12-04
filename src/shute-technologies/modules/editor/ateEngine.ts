import { ATESegment } from './ateSegment';
import { ATELayer } from './ateLayer';
import { ATEPlayback } from './atePlayback';
import { ATEHTMLButton } from '../components/ateHtmlButton';
import { SimpleCallback, SimpleGCallback, ATEIAnimationData, ATEAnimationDataLayer, ATEIGetLayerResult, ATEIAddLayerResult } from '../common/ateInterfaces';
import { ATEStyles } from '../config/ateStyles';
import { ATEEngineHelper } from './helpers/ateEngineHelper';
import { ATEResources } from '../config/ateResources';
import { ATEUtils } from '../common/ateUtils';
import { ATEEnumDataType } from '../runtime/ateEnumDataType';
import { ATEPlaybackEngine } from '../runtime/atePlaybackEngine';
import { ATELayerHelper } from './helpers/ateLayerHelper';

export class ATEEngine {

  static readonly IgnoreExtraParams = 999999019.091;
  static readonly RemoveExtraParams = 999999019.092;

  private _ctx: CanvasRenderingContext2D;

  private _parentSelectorName: string;
  private _parentSelector: JQuery<HTMLElement>;

  private _parentCanvasSelector: JQuery<HTMLElement>;

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
      } as ATEAnimationDataLayer);
    }

    return resultData;
  }

  constructor(selectorName: string) {
    // variable initialize
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

    this._parentSelectorName = selectorName;
    this._parentSelector = $(selectorName);
    this._parentSelector.css('height', '100%');
    this._width = this._parentSelector.width();
    this._height = ATEStyles.guiHeight;
    this._contentHeight = this._height - ATEStyles.scrollbarHeight;

    const imgSelector = $(`<img id='${ATEResources.diamond.id}' src='${ATEResources.diamond.path}' />`);
    imgSelector.css('display', 'none');

    const imgSelectorSelected = $(`<img id='${ATEResources.diamondSelected.id}' src='${ATEResources.diamondSelected.path}' />`);
    imgSelectorSelected.css('display', 'none');

    this._parentSelector.append(imgSelector);
    this._parentSelector.append(imgSelectorSelected);

    this.createGUI();
    this.createMouseEvents();
    this.changeAnimationSeconds(ATEStyles.default_Seconds);

    this._playbackController = new ATEPlayback(this);
    this._playbackController.configureFPS(ATEStyles.playback.defaultTime);
  }

  reset(): void {
    this._button_playOrPause.reset();
    this._button_record.reset();
    this._button_stop.reset();
    this._playbackController.stop();

    this.invalidateLayers();
  }

  invalidateLayers(): void {
    for (const layer of this._layers) {
      layer.invalidate();
    }
  }

  private createMouseEvents(): void {
    const getMousePosNestedFn = (canvas, evt) => {
      const rect = canvas.getBoundingClientRect();
      return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    };

    // Mouse Move
    this._parentCanvasSelector.on('mousemove', (evt) => {
        const mousePos = getMousePosNestedFn(this._parentCanvasSelector[0], evt);
      // on mouse move
      this._playbackController.onMouseMove(mousePos);
    });

    // Mouse Up
    this._parentCanvasSelector.on('mouseup', (evt) => {
      const mousePos = getMousePosNestedFn(this._parentCanvasSelector[0], evt);
      // on mouse move
      this._playbackController.onMouseUp(mousePos);
    });

    // Move Down
    this._parentCanvasSelector.on('mousedown', (evt) => {
      const mousePos = getMousePosNestedFn(this._parentCanvasSelector[0], evt);
      // on mouse move
      this._playbackController.onMouseDown(mousePos);
    });

    // Mouse Click
    this._parentCanvasSelector.on('click', (evt) => {
      // var mousePos = __getMousePos(this._parentCanvasSelector[0], evt);
    });

    // Move DoubleClick
    this._parentCanvasSelector.on('dblclick', (evt) => {
      // var mousePos = __getMousePos(this._parentCanvasSelector[0], evt);
    });

    this._parentCanvasSelector.on('mouseout', (evt) => {
      const mousePos = getMousePosNestedFn(this._parentCanvasSelector[0], evt);

      // mScrollBar_GeneralY.OnMouseOut(mousePos);
      this._playbackController.onMouseOut(mousePos);
    });
  }

  private createGUI(): void {
    const createControlsGUINestedFn = () => {
      const hrSelector = $(`<hr style='border-color:${ATEStyles.cStroke_Color};border-width: 0.5px;margin: 0;padding: 0;-webkit-margin-before: 0;-webkit-margin-after: 0;-webkit-margin-start: 0;-webkit-margin-end: 0;transform: translateY(1px);' />`);

      this._controlsUI_Selector = $('<div><div>');
      this._controlsUI_Selector.css('height', ATEStyles.ac_TimelineHeight - 1);

      // create container for buttons
      const buttonsUISelector = $('<div><div>');
      buttonsUISelector.css('padding-top', '4px');
      buttonsUISelector.css('padding-left', '4px');
      this._controlsUI_Selector.append(buttonsUISelector);

      // buttons: Record
      this._button_record = new ATEHTMLButton(this);
      this._button_record.initialize('res/spRecord.png', 'res/spStopRecording.png');
      this._button_record.callbackClick = () => {
        // on record
        if (this._onRecordCallback) { this._onRecordCallback(); }
      };

      // buttons: Play/Pause
      this._button_playOrPause = new ATEHTMLButton(this);
      this._button_playOrPause.initialize('res/spPlay.png', 'res/spPause.png');
      this._button_playOrPause.addMargin();
      this._button_playOrPause.callbackClick = () => {
        // play/pause playback
        this._playbackController.playOrPause();
        if (this._onPlayOrPauseCallback) { this._onPlayOrPauseCallback(this._playbackController.isPlaying); }
      };

      // buttons: Stop
      this._button_stop = new ATEHTMLButton(this);
      this._button_stop.initialize('res/spStop.png');
      this._button_stop.addMargin();
      this._button_stop.callbackClick = () => {
        // reset button play/pause
        this._button_playOrPause.reset();
        // stop playback
        this._playbackController.stop();
        if (this._onStopCallback) { this._onStopCallback(); }
      };

      // time limit
      const inputTimeLimitLabelSelector = $(`<label style='font-size:12px;color:white;margin-left:5px'>Time:<label/>`);
      this._inputCurrentTimeSelector = $(`<input type='text' value='0.00' />`);

      this._inputTimeLimitSelector = $(`<input type='text' value='${ATEUtils.getDigitsByValue(ATEStyles.default_Seconds, 2)}.00'/>`);
      this._inputTimeLimitSelector.on('change', (evt) => {
        debugger;
        let val: any = Math.floor(parseFloat(evt.currentTarget['value']));
        val = ATEUtils.getDigitsByValue(val, 2);
        this._inputTimeLimitSelector.val(`${val}.00`);

        // change animation seconds
        this.changeAnimationSeconds(parseInt(val, 10));
      });

      ATEEngineHelper.setStylesInputTime(this._inputCurrentTimeSelector, true);
      ATEEngineHelper.setStylesInputTime(this._inputTimeLimitSelector);

      // add buttons to the selector
      buttonsUISelector.append(this._button_record.buttonSelector);
      buttonsUISelector.append(this._button_playOrPause.buttonSelector);
      buttonsUISelector.append(this._button_stop.buttonSelector);

      buttonsUISelector.append(inputTimeLimitLabelSelector);
      buttonsUISelector.append(this._inputCurrentTimeSelector);
      buttonsUISelector.append($(`<label style='color:white'>/<label/>`));
      buttonsUISelector.append(this._inputTimeLimitSelector);

      this._parentGUISelector.append(this._controlsUI_Selector);
      this._parentGUISelector.append(hrSelector);
    };

    const createLayersGUINestedFn = () => {
      this._layersUI_Selector = $('<div><div>');
      this._layersUI_Selector.css('height', `${this._contentHeight - ATEStyles.ac_TimelineHeight - 1}px`);
      this._layersUI_Selector.css('overflow-y', 'hidden');

      this._parentGUISelector.append(this._layersUI_Selector);

      // add empty div for offset
      this._layersUI_Selector.append($(`<div style='height:${ATEStyles.timeline.offsetY }px'></div>`));
    };

    this._parentGUISelectorName = `gui-${this._parentSelectorName.substring(1)}`;
    this._parentGUISelector = $(`<div id='${this._parentGUISelectorName}'></div>`);
    this._parentGUISelector.css('width', `${ATEStyles.ac_Width}px`);
    this._parentGUISelector.css('height', `${this._height}px`);
    this._parentGUISelector.css('float', 'left');
    this._parentGUISelector.css('background-color', ATEStyles.backgroundColor);

    // add HTML canvas
    this._parentSelector.append(this._parentGUISelector);

    this._parentCanvasSelectorName = `canvas-${this._parentSelectorName.substring(1)}`;
    this._parentCanvasSelector = $(`<canvas id='${this._parentCanvasSelectorName}' width='${this._width - ATEStyles.ac_Width}' height='${this._contentHeight}'></canvas>`);
    this._parentCanvasSelector.css('float', 'left');
    // add HTML canvas
    this._parentSelector.append(this._parentCanvasSelector);

    // ScrollY HTML
    this._scrollYSelector = $(`<div style='height:${this._contentHeight}px;width:${ATEStyles.scrollbarHeight}px;float: right;overflow-y: auto;'></div>`);
    this._scrollYContentSelector = $(`<div style='height:${this._contentHeight}px'></div>`);
    this._scrollYSelector.append(this._scrollYContentSelector);
    this._parentSelector.append(this._scrollYSelector);

    // ScrollX HTML
    this._scrollXSelector = $(`<div style='height:${this._height - this._contentHeight}px;width: 0px;float: left;overflow-X: auto;'></div>`);
    this._scrollXContentSelector = $(`<div style='width:0px;height:1px'></div>`);
    this._scrollXSelector.append(this._scrollXContentSelector);
    this._parentSelector.append(this._scrollXSelector);

    // get Canvas Context as 2D
    this._ctx = (this._parentCanvasSelector[0] as HTMLCanvasElement).getContext('2d');

    createControlsGUINestedFn();
    createLayersGUINestedFn();
  }

  changeAnimationSeconds(seconds: number, noChange?: boolean) {
    this._animationSeconds = seconds;
    this.createSegments(this._animationSeconds);

    // update UI control
    let val: number | string = Math.floor(parseFloat(this._animationSeconds as any));
    val = ATEUtils.getDigitsByValue(val, 2);
    this._inputTimeLimitSelector.val(`${val}.00`);

    // change
    if (!!!noChange) {
      if (this.onChangeCallback) { this.onChangeCallback(); }
    }
  }

  reconstructFrom(animationData: ATEIAnimationData): void {
    this.removeAllLayers();

    if (animationData && Object.keys(animationData).length > 0) {
      const animationSeconds = !animationData.animationSeconds ?
        ATEStyles.default_Seconds : animationData.animationSeconds;
      const fps = !animationData.fps ? ATEStyles.playback.defaultTime : animationData.fps;

      this.changeAnimationSeconds(animationSeconds, true);
      this._playbackController.configureFPS(fps, true);

      for (let i = 0; i < animationData.layerCount; i++) {
        const layerData = animationData.layers[i];
        this.addLayerFrom(layerData);
      }
    }
  }

  removeAllLayers(): void {
    for (const layer of this._layers) {
      layer.destroy();
    }

    this._layers = [];
  }

  getLayer(name: string): ATEIGetLayerResult  {
    const result = {
      exists: false,
      layer: null
    } as ATEIGetLayerResult;

    for (const layer of this._layers) {
      if (layer.layerName === name) {
        result.exists = true;
        result.layer = layer;
        break;
      }
    }

    return result;
  }

  addLayer(name: string, time: number, value?, dataType?: ATEEnumDataType, extraLayerParams?, extraKeyframeParams?): ATEIAddLayerResult {
    const result = {
      layer: null,
      keyframe: null
    } as ATEIAddLayerResult;
    const layerResult = this.getLayer(name);
    value = (!!!value && !!dataType) ? ATELayerHelper.getDefaultValueFromDataType(dataType) : value;

    if (layerResult.exists) {
        result.layer = layerResult.layer;
        result.layer.extraLayerParams = extraLayerParams;
        result.keyframe = layerResult.layer.setKeyframe(time, value, extraKeyframeParams);
    } else {
      const layer = new ATELayer(this);
      layer.initialize(name, dataType);
      layer.extraLayerParams = extraLayerParams;

      // now first add it to the array
      this._layers.push(layer);

      result.layer = layer;
      result.keyframe = layer.setKeyframe(time, value, extraKeyframeParams);
    }

    return result;
  }

  addLayerFrom(layerData: ATEAnimationDataLayer): void {
    const layer = new ATELayer(this);
    layer.initialize(layerData.name, layerData.dataType, layerData.isInterpolable);
    layer.extraLayerParams = layerData.extraParams;
    layer.reconstructFrom(layerData.data);

    this._layers.push(layer);
  }

  createSegments(seconds: number): void {
    const updateSegmentsNestedFn = () => {
      // tslint:disable-next-line: no-shadowed-variable
      for (let i = 0; i < this._segments.length; i++) {
        this._segments[i].firstSegment = i === 0;
        this._segments[i].lastSegment = i === (seconds - 1);
      }
    };

    const createSegmentsByNestedFn = (startIndex: number, size: number) => {
      startIndex = !!!startIndex ? 0 : startIndex;

      // tslint:disable-next-line: no-shadowed-variable
      for (let i = startIndex; i < size; i++) {
        const segment = new ATESegment(this);
        segment.initialize(i);
        segment.firstSegment = i === 0;
        segment.lastSegment = i === (seconds - 1);

        this._segments.push(segment);
      }
    };

    if (this._segments.length === 0) {
      createSegmentsByNestedFn(0, seconds);
    } else {
      const offset = seconds - this._segments.length;

      if (offset > 0) {
        createSegmentsByNestedFn(this._segments.length, seconds);
      } else {
        // destroy unneeded segments
        const segumentSize = this._segments.length;

        for (let i = segumentSize - 1; i >= segumentSize + offset; i--) {
          this._segments[i].destroy();
        }

        this._segments.splice((segumentSize + offset), Math.abs(offset));

        // destroy unnecesary keyframe
        for (const layer of this._layers) {
          layer.removeKeyframesBetween(seconds + ATEPlaybackEngine.EPSILON, Number.MAX_VALUE);
        }
      }

      // update segments
      updateSegmentsNestedFn();
    }
  }

  private drawGUI(dt: number): void {
    // Clear
    this._ctx.clearRect(0, 0, this._width, this._height);

    // Background
    this._ctx.fillStyle = ATEStyles.backgroundColor;
    this._ctx.fillRect(0, 0, this._width, this._height);

    // Change coordinate system by half
    this._ctx.translate(0.5, 0.5);

    // Draw controls strokes background
    this._ctx.beginPath();
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(0, this._contentHeight);
    this._ctx.lineWidth = 1;
    this._ctx.strokeStyle = ATEStyles.cStroke_Color;
    this._ctx.stroke();
    this._ctx.closePath();

    // Draw Timeline GUI
    this._ctx.beginPath();
    this._ctx.moveTo(0, ATEStyles.ac_TimelineHeight + ATEStyles.timeline.offsetY);
    this._ctx.lineTo(this._width, ATEStyles.ac_TimelineHeight + ATEStyles.timeline.offsetY);
    this._ctx.lineWidth = 1;
    this._ctx.strokeStyle = ATEStyles.cStroke_Color;
    this._ctx.stroke();
    this._ctx.closePath();
  }

  private drawSegments(dt: number): void {
    const sizeX = (this._GUI_RealSegmentWidth * this._animationSeconds) + ATEStyles.timeline.offsetX;
    const sizeY = ATEStyles.ac_TimelineHeight;

    // clear
    this._ctx.fillStyle = ATEStyles.backgroundColor;
    this._ctx.fillRect(0, 0, sizeX, sizeY);

    for (let i = 0; i < this._animationSeconds; i++) {
      this._segments[i].draw(dt);
    }
  }

  private drawLayers(dt: number): void {
    for (let i = 0; i < this._layers.length; i++) {
      this._layers[i].update(i, dt);
    }
  }

  private drawLayersGUI(dt: number): void {
    for (let i = 0; i < this._layers.length; i++) {
      this._layers[i].drawGUI(i, dt);
    }
  }

  private computeVariables(): void {
    this._GUI_RealSubSegmentWidth = ATEStyles.ac_TimelineSegmentWidth / (this._subSegments + 1);
    this._GUI_RealSegmentWidth = ATEStyles.ac_TimelineSegmentWidth - this._GUI_RealSubSegmentWidth;

    // ScrollX
    const layerContentWidth = (this._GUI_RealSegmentWidth * this._animationSeconds) + ATEStyles.ac_TimelineHeight;
    this._scrollXSelector.css('width', (this._width - ATEStyles.ac_Width));
    this._scrollXContentSelector.css('width', layerContentWidth);
    // set scroll value
    this._scrollX = -this._scrollXSelector[0].scrollLeft;

    // ScrollY
    const layerContentHeight = ((this._layers.length + 2) * ATEStyles.ac_TimelineLayerHeight);
    this._scrollYContentSelector.css('height', layerContentHeight);
    // set scroll valiue
    this._scrollY = -this._scrollYSelector[0].scrollTop;
    this._layersUI_Selector[0].scrollTop = -this._scrollY;

    // responsive size
    this._parentCanvasSelector.attr('width', this._width - ATEStyles.ac_Width - 20);
    this._parentCanvasSelector.attr('height', this._contentHeight);
    this._parentGUISelector.css('height', `${this._height}px`);
    this._scrollYSelector.css('height', `${this._contentHeight}px`);
    // mScrollYContentSelector.css('height', mContentHeight + "px");
    this._scrollXSelector.css('height', `${this._height - this._contentHeight}px`);
    this._layersUI_Selector.css('height', `${this._contentHeight - ATEStyles.ac_TimelineHeight - 1}px`);
  }

  update(dt: number): void {
    // Update size dynamically
    this._width = this._parentSelector.width();
    // mHeight = mParentSelector.height();
    this._contentHeight = this._height - ATEStyles.scrollbarHeight;

    // Compute
    this.computeVariables();

    // Draw
    this.drawGUI(dt);
    this.drawLayersGUI(dt);
    this.drawLayers(dt);
    this.drawSegments(dt);

    this._playbackController.update(dt);
  }
}
