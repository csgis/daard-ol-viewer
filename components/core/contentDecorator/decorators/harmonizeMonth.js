const harmonizeMonth = (value) => {
    // Check if value is a string that equals 'unknown' or 'UNKNOWN' (case-insensitive)
    if (typeof value === 'string' && value.toLowerCase() === 'months') {
        alert("found it")
        return 'months';
    }

    // Return the original value if none of the specific cases match
    return value;
};

export default harmonizeMonth;
