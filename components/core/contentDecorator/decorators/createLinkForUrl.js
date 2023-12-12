const createLinkForUrl = (value) => {
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    return urlPattern.test(value) ? `<a href="${value}" x-tooltip.placement.top="'Link opens in new window'" target="_blank" class="link-secondary">${value}</a>` : value;
};

export default createLinkForUrl;
