const request = require('supertest');
const assert = require('assert');
const app = require('../server.js');

describe('Integration Test: Search Route', () => {
    it('should return 200 and show result for a valid search term', (done) => {
        request(app)
            .post('/search')
            .send('searchTerm=ValidTest')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(res.text.includes('You searched for: <strong>ValidTest</strong>'));
                done();
            });
    });

    it('should redirect (302) to home page for XSS attack', (done) => {
        request(app)
            .post('/search')
            .send('searchTerm=<script>alert(1)</script>')
            .expect(302)
            .expect('Location', '/')
            .end(done);
    });
});
