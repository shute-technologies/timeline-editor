// A jsdom page for the editor tests: the lib uses the global `$`, and draws on a canvas jsdom cannot render,
// so the canvas gets a context that records what each draw call was made with.
const { JSDOM } = require('jsdom');
// Required before any global window exists, so jquery returns its factory and can bind to each new page.
const jqueryFactory = require('jquery');

class RecordingContext {
  constructor() {
    this.calls = [];
    this.fillStyle = '#000000';
    this.strokeStyle = '#000000';
    this.font = '10px sans-serif';
    this.lineWidth = 1;
    this.textAlign = 'start';
  }

  record(op, args) {
    this.calls.push({ op, fillStyle: this.fillStyle, strokeStyle: this.strokeStyle, font: this.font, args });
  }

  fillRect(...args) { this.record('fillRect', args); }
  fillText(...args) { this.record('fillText', args); }
  stroke() { this.record('stroke', []); }
  drawImage(image, ...args) { this.record('drawImage', args); }
  clearRect() {}
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  translate() {}

  // The colours used by the calls that paint: fills for fillRect / fillText, strokes for stroke.
  paintedColours() {
    const colours = new Set();
    for (const call of this.calls) {
      if (call.op === 'stroke') { colours.add(call.strokeStyle); }
      if (call.op === 'fillRect' || call.op === 'fillText') { colours.add(call.fillStyle); }
    }
    return colours;
  }
}

function createPage() {
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="ate" style="width:800px"></div></body></html>');
  const ctx = new RecordingContext();

  global.window = dom.window;
  global.document = dom.window.document;
  global.$ = global.jQuery = jqueryFactory(dom.window);
  dom.window.HTMLCanvasElement.prototype.getContext = () => ctx;

  return { window: dom.window, document: dom.window.document, ctx, root: dom.window.document.getElementById('ate') };
}

module.exports = { createPage, RecordingContext };
