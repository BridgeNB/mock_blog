'use strict';
const mongoose = require('mongoose');
const faker = require('faker');

const { Post } = require('../app/post.model.js');
const { logInfo, logWarn, logSuccess, logError } = require('../app/logger.js');

module.exports = {
    createMockDatabase,
    deleteMockDatabase,
    getNewFakePost
};

function createMockDatabase() {
    logWarn('seeding mock post database ...');
    const seedData = [];
    for (let i = 0; i <= 10; i++) {
        seedData.push({
            author: faker.name.firstName(),
            title: faker.lorem.sentence(),
            content: faker.lorem.text()
        });
    }
    return Post.insertMany(seedData)
        .then(() => {
            logWarn('Mock post database created.')
        })
        .catch(err => {
            logError(err);
        });
}

function deleteMockDatabase() {
    return new Promise((resolve, reject) => {
        logWarn('Deleting mock database ...');
        mongoose.connection.dropDatabase()
            .then(result => {
                logWarn('Mock database deleted.');
                resolve(result);
            })
            .catch(err => {
                logError(err);
                reject(err);
            });
    });
}

function getNewFakePost() {
    return {
        author: faker.name.firstName(),
        title:  faker.lorem.sentence(),
        content: faker.lorem.text()
    };
}