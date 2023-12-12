import appendEuroToNumber from './decorators/appendEuroToNumber';
import createLinkForUrl from './decorators/createLinkForUrl';
import decodeUrl from './decorators/decodeUrl.js'
import formatImageTag from './decorators/formatImageTag';
import replaceBullet from './decorators/replaceBullet';

const decorators = {
    appendEuroToNumber,
    createLinkForUrl,
    formatImageTag,
    decodeUrl,
    replaceBullet
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
