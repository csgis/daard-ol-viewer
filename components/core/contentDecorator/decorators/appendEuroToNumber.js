const appendEuroToNumber = (value) => {
    return typeof value === 'number' ? `${value} €` : value;
};

export default appendEuroToNumber;
