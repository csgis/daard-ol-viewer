import appendEuroToNumber from './decorators/appendEuroToNumber';
import createLinkForUrl from './decorators/createLinkForUrl';
import decodeUrl from './decorators/decodeUrl.js'
import formatImageTag from './decorators/formatImageTag';
import harmonizeMonth from './decorators/harmonizeMonth.js';
import harmonizeTrueFalse from './decorators/harmonizeTrueFalse.js';
import harmonizeUnknown from './decorators/harmonizeUnknown.js';
import removeListIfOnlyOneLi from './decorators/removeListIfOnlyOneLi'
import replaceBullet from './decorators/replaceBullet';
import replaceBulletwithComma from './decorators/replaceBulletwithComma';
import replaceDatingMethod from './decorators/replaceDatingMethod';
import replaceUndefined from './decorators/replaceUndefined';
import toggleLongText from './decorators/toggleLongText';
import unknownLowerCase from './decorators/unknownLowerCase';

const decorators = {
    appendEuroToNumber,
    createLinkForUrl,
    formatImageTag,
    decodeUrl,
    replaceBullet,
    harmonizeUnknown,
    harmonizeTrueFalse,
    harmonizeMonth,
    removeListIfOnlyOneLi,
    replaceBulletwithComma,
    replaceUndefined,
    toggleLongText,
    replaceDatingMethod,
    unknownLowerCase
};

const decorateValue = (value, usedDecorators = []) => {
    Object.entries(decorators).forEach(([decoratorName, decoratorFunction]) => {
        if (usedDecorators.includes(decoratorName)) {
            value = decoratorFunction(value);
        }
    });
    return value;
};

export { decorateValue };
