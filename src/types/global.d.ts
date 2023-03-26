import { RESOLUTIONS_SCALE_VALUES } from '../constants/config';

declare global {
  var RESOLUTION_SCALE: typeof RESOLUTIONS_SCALE_VALUES[number];
  var IS_PAUSED: boolean;
  var FOV_DEGREES: number;
  var FOV: number;
  var TIME_SCALE: number;
}
