const getBaseUrl = (url) => {
    let baseurl = url.substring(0, url.lastIndexOf('/') + 1);
    return baseurl
}


const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

export { getBaseUrl, isValidUrl };
