const decodeUrl = (value) => {
    try {
        // Check if value is a string and URL-encoded
        if (typeof value === 'string' && decodeURIComponent(value) !== value) {
            return decodeURIComponent(value);
        }
        return value;
    } catch (error) {
        // In case of an error (e.g., value is not URL-encoded), return the original value
        return value;
    }
};

export default decodeUrl;
