/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.typeOf(res.body.created_on, 'string');
          assert.typeOf(res.body.updated_on, 'string');
          assert.equal(res.body.open, true);
          assert.equal(res.body.msg, 'New issue created');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text required',
            created_by: 'field required too',
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'text required');
            assert.equal(res.body.created_by, 'field required too');
            assert.typeOf(res.body.created_on, 'string');
            assert.typeOf(res.body.updated_on, 'string');
            assert.typeOf(res.body.assigned_to, 'string');
            assert.typeOf(res.body.status_text, 'string');
            assert.equal(res.body.open, true);
            assert.equal(res.body.msg, 'New issue created');
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: '',
            created_by: '',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.msg, 'Fields required');
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({ 
            _id: '',
            issue_title: '',
            issue_text: '',
            created_by: '',
            assigned_to: '',
            status_text: ''
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no updated field sent');
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: '5b4dba78a68891be0cd78895',
            issue_title: 'Functional test'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'successfully updated');
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: '5b4db96b48ac75bde79d358e',
            issue_title: 'Functional test multiple',
            issue_text: 'Make it work',
            created_by: 'FCC',
            assigned_to: 'Camper',
            status_text: 'In QA'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'successfully updated');
            done();
          });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ issue_text: 'text required' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.equal(res.body[0].issue_text, 'text required');
            done();
          });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            issue_title: 'Title',
            issue_text: 'text'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.equal(res.body[0].issue_title, 'Title');
            assert.equal(res.body[0].issue_text, 'text');
            done();
          });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai
          .request(server)
          .delete('/api/issues/test')
          .send({ _id: '' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.msg, `_id error`);
            done();
          });
      });
      
      test('Valid _id', function(done) {
        chai
          .request(server)
          .delete('/api/issues/test')
          .send({ _id: '5b4dbcc08ba4c0be625813dd' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.msg, `deleted ${res.body.id}`);
            done();
          });
      });
      
    });

});
