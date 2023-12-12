const createLinkForUrl = (value) => {
    return value.replaceAll('●', '<br>')
};

export default createLinkForUrl;
