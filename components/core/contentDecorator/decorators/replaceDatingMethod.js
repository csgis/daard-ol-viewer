const replaceDatingMethod = (value) => {
    // Check if the value is undefined, not a string, or empty
    if (typeof value === 'undefined' 
        || typeof value !== 'string'
        || value === undefined 
        || value === 'undefined' 
        || value === null 
        || value === '' 
        || value === false) {
            return value;
    }

    // Mapping of values to replace
    const replacements = {
        'human_bone': 'Human bone',
        'animal_bone': 'Animal bone',
        'horn': 'Horn',
        'ivory': 'Ivory',
        'tooth': 'Tooth',
        'hair': 'Hair',
        'skin': 'Skin',
        'soft_tissues': 'Soft tissues',
        'wood': 'Wood',
        'textile': 'Textile',
        'botanical_remains': 'Botanical remains',
        'stratigraphic': 'Stratigraphic',
        'funerary-structures': 'Funerary structures',
        'grave_goods': 'Grave goods',
        'archives': 'Archives',
        'texts': 'Texts',
        'epigraphic_sources': 'Epigraphic sources',
        'numismatic': 'Numismatic',
        'unknown': 'Unknown',
    };

    // Iterate over the replacements object and replace each occurrence of the key in the value
    Object.keys(replacements).forEach(key => {
        const pattern = new RegExp(key, 'g');
        value = value.replace(pattern, replacements[key]);
    });

    return value;
};

export default replaceDatingMethod;
