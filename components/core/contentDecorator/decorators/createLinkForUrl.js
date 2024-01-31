const createLinkForUrl = (value) => {

    if (typeof value === 'undefined' 
        || typeof value !== 'string'
        || value == undefined 
        || value == 'undefined' 
        || value == null 
        || value == '' 
        || value == false) {
        return value;
    }

    const urlPattern = /(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;()]*[-A-Z0-9+&@#/%=~_|])/ig;
    return value.replace(urlPattern, (url) => {
        let displayUrl = url.length > 40 ? url.substring(0, 40) + '…' : url;
        return `<a href="${url}" x-tooltip.placement.top="'Link opens in new window'" target="_blank" class="link-secondary">${displayUrl}</a>`;
    });
};

export default createLinkForUrl;
