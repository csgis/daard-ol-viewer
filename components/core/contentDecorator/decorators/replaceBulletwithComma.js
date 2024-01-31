const replaceBulletwithComma = (value) => {

    if (typeof value === 'undefined' 
        || typeof value !== 'string'
        || value == undefined 
        || value == 'undefined' 
        || value == null 
        || value == '' 
        || value == false) {
            return value;
        }

    return value.replaceAll(' ● ', ', ')
};

export default replaceBulletwithComma;
