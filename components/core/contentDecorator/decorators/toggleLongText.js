const toggleLongText = (value) => {

    if (typeof value === 'undefined' 
        || typeof value !== 'string'
        || value == undefined 
        || value == 'undefined' 
        || value == null 
        || value == '' 
        || value == false) {
            return value;
        }

    if (value.length > 600) {
        var outStr = `<details><summary style="cursor: pointer;">Read more</summary><p class="about__text">${value}</p></details>`;
    } else {
        var outStr = value
    }


    return outStr
};

export default toggleLongText;


