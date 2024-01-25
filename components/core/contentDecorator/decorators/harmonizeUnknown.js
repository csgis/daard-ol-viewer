const harmonizeUnknown = (value) => {
    // Check if value is a string that equals 'unknown' or 'UNKNOWN' (case-insensitive)
    if (typeof value === 'string' && value.toLowerCase() === 'unknown') {
        return 'unknown';
    }

    // Return the original value if none of the specific cases match
    return value;
};

export default harmonizeUnknown;
