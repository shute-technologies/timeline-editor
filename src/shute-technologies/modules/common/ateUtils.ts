import { ATEExtraParams } from './ateInterfaces';
export class ATEUtils {

  private constructor() {}

  static getDigitsByValue(value: number, numDigits: number): string {
    let s = String(value);
    const offset = numDigits - s.length;

    for (let i = 0; i < offset; i++) { s = '0' + s; }
    return s;
  }

  static formatTime(milliseconds: number, secondDigits: number, showDecimals = false): string {
    secondDigits = secondDigits <= 1 ? 2 : secondDigits;

    const minutes = (milliseconds / 1000.0) / 60.0;
    const minutesFloor = Math.floor(minutes);
    const secondsRaw = minutes - minutesFloor;
    let seconds = 0.0;
    let decimals = 0;
    const canShowDecimals = !!!showDecimals ? false : showDecimals;

    if (secondDigits === 2 && !canShowDecimals) {
        seconds = Math.floor(secondsRaw * 60);
    } else {
      const factor = Math.pow(10, (secondDigits - 2));

      seconds = secondsRaw * 60.0;
      decimals = Math.floor((seconds - Math.floor(seconds) * factor) * 100);
      seconds = Math.floor(secondsRaw * 60);
    }

    return `${ATEUtils.getDigitsByValue(minutesFloor, minutesFloor > 9 ? 1 : 2)}:${ATEUtils.getDigitsByValue(seconds, 2)}${(canShowDecimals
      ? `.${ATEUtils.getDigitsByValue(decimals, 2)}`
      : '')}`;
  }

  static formatTimeAsSeconds(milliseconds: number): string {
    let seconds = milliseconds / 1000;
    let decimals = 0;

    decimals = Math.floor((seconds - Math.floor(seconds)) * 100);
    seconds = Math.floor(seconds);

    return `${ATEUtils.getDigitsByValue(seconds, 2)}.${ATEUtils.getDigitsByValue(decimals, 2)}`;
  }

  static hitTestCenterByPoint(x: number, y: number, sizeX: number, sizeY: number, pointX: number, pointY: number): boolean {
    const hSize = sizeX * 0.5;
    const vSize = sizeY * 0.5;

    return (x - hSize) < pointX && (x + hSize) > pointX && (y - vSize) < pointY && (y + vSize) > pointY;
  }

  static hitTestByPoint(x: number, y: number, sizeX: number, sizeY: number, pointX: number, pointY: number): boolean {
    return x < pointX && (x + sizeX) > pointX && y < pointY && (y + sizeY) > pointY;
  }

  static deepClone<T>(item): T {
    return JSON.parse(JSON.stringify(item));
  }

  static getComposedPath(path: string, extra?: ATEExtraParams): string {
    return `${extra ? extra.externalResourcePath : ''}${path}`;
  }
}
