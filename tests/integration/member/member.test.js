const request = require('supertest');
const Member = require('../../../models/member.model');
const mongoose = require('mongoose');
const endpoint = '/api/members';

describe('GET /', () => {
   let server;

   beforeEach(() => server = require('../../../index'));
   afterEach(() => server.close());

   it('should return all members', (done) => {
      const res = request(server).get(endpoint);
      expect(res.status).toBe(200);
      done();
   });
});