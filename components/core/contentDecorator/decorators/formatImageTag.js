const formatImageTag = (value) => {
    const imgPattern = /\.(jpeg|jpg|gif|png)$/;
    return imgPattern.test(value) ? `<img src="${value}" alt="Image" style="max-height: 100px; max-width: 100px;" />` : value;
};

export default formatImageTag;
