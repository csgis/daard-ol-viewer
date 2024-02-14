const unknownLowerCase = (value) => {
    // Check if value is a string that equals 'unknown' or 'UNKNOWN' (case-insensitive)
    if (typeof value === 'string' && value.toLowerCase() === 'unknown') {
        return value.toLowerCase();
    }

    // Return the original value if none of the specific cases match
    return value;
};

export default unknownLowerCase;
