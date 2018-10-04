const chai = require('chai');
const chaiHttp = require('chai-http');

const { Post } = require('../app/post.model.js');
const { startServer, closeServer, app } = require('../app/server.js');
const { MONGO_TEST_URL, HTTP_STATUS_CODES } = require('../app/config.js');

const { createMockDatabase, deleteMockDatabase, getNewFakePost } = require('./database.helper.js');

const expect = chai.expect;
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
                        expect(res).to.have.status(HTTP_STATUS_CODES.OK);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('array');
                        expect(res.body).to.have.lengthOf.at.least(1);
                        return Post.count();
                    })
                    .then(count => {
                        expect(res.body).to.have.lengthOf(count);
                    });
        });
        it('should return posts with right fields', function() {
            // bug here
            return chai.request(app)
                    .get('/api/post')
                    .then(function(res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('array');
                        expect(res.body).to.have.lengthOf.at.least(1);
                        // res.body.forEach( function (post) {
                        //     expect(post).to.be.a('object');
                        //     expect(post).to.include.keys('id', 'title', 'content', 'author', 'created');
                        // });
                    });
        });
    });
});