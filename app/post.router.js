'use strict';
const express = require('express');
const postsRouter = express.Router();

const { logInfo, logError, logSuccess, logWarn } = require('./logger.js');
const { Post } = require('./post.model.js');
const { HTTP_STATUS_CODES } = require('./config.js');
const { filterObject, checkObjectProperties } = require('./helpers.js');

postsRouter.post('/', (request, response) => {
    const fieldNotFound = checkObjectProperties(['title', 'content', 'author'], request.body);
    if (fieldNotFound.length > 0) {
        const errorMessage = `Bad Request: missing ${fieldsNotFound.join(', ')}`;
        logError(errorMessage);
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: errorMessage });
    }

    logInfo('Creat new post document ...');

    Post.create({
        title: request.body.title,
        content: request.body.content,
        author: request.body.author
    }).then(
        post => {
            logSuccess('New post created!');
            return response.status(HTTP_STATUS_CODES.CREATED).json(post.serialize());
        }
    ).catch(err => {
        logError(err);
        reponse.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error'});
    });
});

postsRouter.get('/', (request, response) => {
    logInfo('Fetching Post collection ...');
    Post.find()
        .then(posts => {
            logSuccess('Post collection fetched successfully!');
            response.json(posts.map(post => post.serialize));
        }).catch(err => {
            logError(err);
            reponse.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error'});
        });
});

postsRouter.put('/:id', (request, response) => {
    const fieldNotFound = checkObjectProperties(['title', 'content', 'author'], request.body);
    if (fieldNotFound.length > 0) {
        const errorMessage = `Bad Request: missing ${fieldsNotFound.join(', ')}`;
        logError(errorMessage);
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: errorMessage });
    }
    logInfo('Updating Post document');
    const fieldToUpdate = filterObject(['title', 'content', 'author'], request.body);
    Post
    .findByIdAndUpdate(
        request.param.id,
        { $set: fieldsToUpdate },
        { new: true })
    .then(() => {
        logSuccess('Post document updated successfully');
        return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
    })
    .catch(err => {
        logError(err);
        return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error'});
    });
}) 

postsRouter.delete('/:id', (request, response) => {
    logInfo('Deleting Post Document ...');
    Post
    .findByIdAndRemove(request.param.id)
    .then(() => {
        logSuccess('Post deleted');
        reponse.status(HTTP_STATUS_CODES.NO_CONTENT).end();
    })
    .catch(err => {
        logError(err);
        response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: 'Internal server error'});
    });
})

module.exports = { postsRouter };
