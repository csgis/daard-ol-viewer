const removeListIfOnlyOneLi = (value) => {
    // Regex pattern to find all <li>...</li> tags
    const liPattern = /<li>.*?<\/li>/gs;

    // Find all <li>...</li> matches
    const liMatches = value.match(liPattern);

    // If there's exactly one <li>...</li>, remove <ul>, </ul>, <li>, and </li> tags
    if (liMatches && liMatches.length === 1) {
        return value.replace(/<\/?ul>/g, '').replace(/<\/?li>/g, '');
    }

    // Return the original value if there's not exactly one <li> item
    return value;
};

export default removeListIfOnlyOneLi;
