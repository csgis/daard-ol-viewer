const replaceBullet = (value) => {
    
    if (typeof value === 'undefined' 
        || typeof value !== 'string'
        || value == undefined 
        || value == 'undefined' 
        || value == null 
        || value == '' 
        || value == false) {
            return value;
        }

    return value.replaceAll('●', '<br>')
};

export default replaceBullet;
