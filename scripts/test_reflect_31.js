import { reflectIntlToNigSq } from './train_from_screenshot.js';
import { sqToRC } from '../js/engine50.js';

console.log('Intl 37 -> Nig:', reflectIntlToNigSq(37));
console.log('Intl 31 -> Nig:', reflectIntlToNigSq(31));
console.log('Intl 31 RC:', sqToRC(31, true));
const rcNig = { r: sqToRC(31, true).r, c: 9 - sqToRC(31, true).c };
console.log('Nig RC of mirrored 31:', rcNig);
