/**
 *
 * @param {String} val Date String in the form YYYY:MM:DD
 * @returns {Boolean} true or false depending if the date string is valid or meets the input format
 */
const isValidDate = (val) => {
    let pattern = /^(\d){4}(\-)(0[1-9]{2}|(1[0-1]))(\-)[1-9]{2}$/;
    if (str.match(pattern)) return true;
    return false;
};

module.exports = isValidDate;
