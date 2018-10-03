const chai = require('chai');
const chaiHttp = require('chai-http');

const { Post } = require('../app/post.model.js');
const { startServer, closeServer, app } = require('../app/server.js');
const { MONGO_TEST_URL } = require('../app/config.js');

const { createMockDatabase, deleteMockDatabase, getNewFakePost } = require('./database.helper.js');

const should = chai.should();
chai.use(chaiHttp);

describe('/api/post api tests', function () {
    
    before(function() {
        return startServer(MONGO_TEST_URL);
    });

    beforeEach(function() {
        return createMockDatabase();
    })

    afterEach(function() {
        return deleteMockDatabase();
    })

    describe('Read/Get posts', function() {
        it('should return all existing posts', function () {
            let res;
            return chai.request(app)
                    .get('/api/post')
                    .then(_res => {
                        res = _res;
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        res.body.should.have.lengthOf.at.least(1);
                        return Post.count();
                    })
                    .then(count => {
                        res.body.should.have.lengthOf(count);
                    });
        });
        it('should return posts with right fields', function() {
            // bug here
            return chai.request(app)
                    .get('/api/post')
                    .then(function(res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        res.body.should.have.lengthOf.at.least(1);
                        res.body.forEach(function (post) {
                            post.should.be.a('object');
                            post.should.include.keys('id', 'title', 'content', 'author', 'created');
                        });
                    });
        });
    });

});