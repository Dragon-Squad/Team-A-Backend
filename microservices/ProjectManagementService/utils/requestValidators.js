function isRequired(field, name, errors) {
    if (!field) errors.push(`${name} is required.`);
}

function isString(field, name, errors) {
    if (field && typeof field !== "string") {
        errors.push(`${name} must be a string.`);
    }
}

function isPositiveNumber(field, name, errors) {
    if (typeof field !== "number" || field <= 0) {
        errors.push(`${name} must be a positive number.`);
    }
}

function isNonNegativeNumber(field, name, errors) {
    if (typeof field !== "number" || field < 0) {
        errors.push(`${name} must be a non-negative number.`);
    }
}

function isEnumValue(field, name, validValues, errors) {
    if (!validValues.includes(field)) {
        errors.push(`${name} must be one of: ${validValues.join(", ")}.`);
    }
}

function isValidDate(field, name, errors) {
    if (!field || isNaN(Date.parse(field))) {
        errors.push(`${name} must be a valid date.`);
    }
}

function isArrayOfStrings(field, name, errors) {
    if (
        field &&
        (!Array.isArray(field) ||
            !field.every((item) => typeof item === "string"))
    ) {
        errors.push(`${name} must be an array of strings.`);
    }
}

module.exports = {
    isRequired,
    isString,
    isPositiveNumber,
    isNonNegativeNumber,
    isEnumValue,
    isValidDate,
    isArrayOfStrings,
};
