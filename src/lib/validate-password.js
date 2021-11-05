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

module.exports = passwordChecker;
