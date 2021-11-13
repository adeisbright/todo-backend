const validateEmail = (val) => {
    const emailPattern =
        /^[a-zA-Z]+((\d+|_+|\.)?([a-zA-Z]+|\d+)*)+@[a-zA-Z]{3,}\.[a-zA-Z]{2,6}$/;
    try {
        if (String(val).match(emailPattern)) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

const passwordChecker = (val) => {
    let upperCasePattern = /[A-Z]+/;
    let lowerCasePattern = /[a-z]+/;
    let digitPattern = /[0-9]+/;
    let specialTextPattern = /(_|!|@|£|\$|%|#|&|\^|\*|\(|\))+/;
    try {
        if (
            String(val).match(upperCasePattern) &&
            String(val).match(lowerCasePattern) &&
            String(val).match(digitPattern) &&
            String(val).length >= 8 &&
            String(val).match(specialTextPattern)
        ) {
            return {
                name: "Matched",
                value: val.trim(),
            };
        } else {
            throw {
                name: "Please provide a valid password",
                value: null,
            };
        }
    } catch (err) {
        return {
            name: err.name,
            value: err.value,
        };
    }
};
module.exports = {
    validateEmail,
    passwordChecker,
};
