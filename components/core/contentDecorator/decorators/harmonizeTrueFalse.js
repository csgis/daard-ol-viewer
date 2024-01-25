const harmonizeTrueFalse = (value) => {
    // Check if value is a string that equals 'unknown' or 'UNKNOWN' (case-insensitive)
    if (typeof value === 'string' && value.toLowerCase() === 'true') {
        return 'true';
    }

    if (typeof value === 'string' && value.toLowerCase() === 'false') {
        return 'false';
    }

    // Return the original value if none of the specific cases match
    return value;
};

export default harmonizeTrueFalse;
