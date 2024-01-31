const replaceUndefined = (value) => {
    // Check if the value is undefined or an empty string

    console.log("value is", value);
    console.log(typeof value)

    if (typeof value === 'undefined' 
        || typeof value !== 'string'
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