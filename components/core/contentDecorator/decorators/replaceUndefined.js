const replaceUndefined = (value) => {

    // Check if the value is undefined or an empty string
    if (typeof value === 'undefined' 
        || value == undefined 
        || value == 'undefined' 
        || value == null 
        || value == 'null' 
        || typeof value === 'null' 
        || value == '' 
        || value == false) {
            return '-';
        }

    return value;
};

export default replaceUndefined;