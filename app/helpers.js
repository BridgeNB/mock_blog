'use strict';
module.exports = {
    filterObject,
    checkObjectProperties
};

function filterObject(propertiesToFilter, objectToFilter) {
    const filterObject = {};
    propertiesToFilter.forEach(propertyName => {
        if (propertyName in objectToFilter) {
            filteredObject[propertyName] = objectToFilter[propertyName]
        }
    });
    return filterObject;
}

function checkObjectProperties(propertiesToCheck, objectToCheck) {
    const propertiesNotFound = [];
    propertiesToCheck.forEach(propertyName => {
        if (!objectToCheck.hasOwnProperty(propertyName)) {
            propertiesNotFound.push(propertyName);
        }
    });
    return propertiesNotFound;
}

