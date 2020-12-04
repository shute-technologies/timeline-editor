import { ATEStyles } from '../../config/ateStyles';
import { ATEEnumDataType } from '../../runtime/ateEnumDataType';
import { ATEEnumTweenType } from '../../runtime/ateEnumTweenType';
import { ATEResources } from '../../config/ateResources';

export class ATELayerHelper {

  static setLabelCSS_LayerName(selector: JQuery<HTMLElement>): void {
    selector.css('height', ATEStyles.ac_TimelineLayerHeight);
    selector.css('font-size', '11px');
    selector.css('color', ATEStyles.ac_TimelineSubSegment_Color);
    selector.css('font-family', 'arial');
    selector.css('margin-left', '4px');
    selector.css('white-space', 'nowrap');
    selector.css('overflow', 'hidden');
    selector.css('text-overflow', 'ellipsis');
    selector.css('max-width', '90px');
    selector.css('padding-top', '8px');
    selector.css('max-height', '20px');
  }

  static setLabelCSS_LayerValue(selector: JQuery<HTMLElement>, dataType: ATEEnumDataType): void {
    dataType  = !!dataType ? dataType : ATEEnumDataType.Numeric;

    selector.css('font-size', '11px');
    selector.css('font-family', 'arial');
    selector.css('margin-right', '2px');
    selector.css('float', 'right');
    selector.attr('disabled', 'true');

    switch (dataType) {
      case ATEEnumDataType.Numeric:
      case ATEEnumDataType.Color:
      case ATEEnumDataType.String:
        selector.css('width', '40px');
        break;
    }
  }

  static createTweenSelect(): JQuery<HTMLElement> {
    let html = `<select style='display:none;margin-right:2px;float:left;width:55px'>`;

    for (const name of Object.keys(ATEEnumTweenType)) {
      if (!(parseInt(name, 10) >= 0)) {
        html += `   <option value='${ATEEnumTweenType[name]}'>${name}</option>`;
      }
    }

    html += '</select>';

    return $(html);
  }

  static createKeyframeAddButton(): JQuery<HTMLElement> {
    const html = `<img src='${ATEResources.diamond.path}' width='${ATEResources.diamond.timelineWidth}' height='${ATEResources.diamond.timelineHeight}' style='display:none;margin-right:2px;float:right;margin-top: 5px;'/>`;
    return $(html);
  }

  static createHR(): JQuery<HTMLElement> {
    const hrSelector = $('<hr />');
    hrSelector.css('border-color', ATEStyles.cStroke_Color);
    hrSelector.css('border-width', '0.5px');
    hrSelector.css('margin', '0');
    hrSelector.css('padding', '0');
    hrSelector.css('-webkit-margin-before', '0');
    hrSelector.css('-webkit-margin-before', '0');
    hrSelector.css('-webkit-margin-start', '0');
    hrSelector.css('-webkit-margin-end', '0');
    return hrSelector;
  }

  static getDefaultValueFromDataType(dataType: ATEEnumDataType): void {
    let result = null;

    switch (dataType) {
      case ATEEnumDataType.Numeric: result = 0; break;
      case ATEEnumDataType.Boolean: result = false; break;
      case ATEEnumDataType.Color: result = { r: 0, g: 0, b: 0, a: 1}; break;
      case ATEEnumDataType.String: result = ''; break;
      default:
        result = {};
      break;
    }

    return result;
  }
}
