const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash')
const {
   Member
} = require('../../../models/member.model');

const endpoint = '/api/members';

let app;

let id1
let id2

let member1
let member2

describe('/api/members', () => {

   beforeEach(async () => {
      app = await require('../../../index')

      id1 = mongoose.Types.ObjectId()
      id2 = mongoose.Types.ObjectId()

      member1 = await new Member({
         _id: id1,
         firstName: 'Jabir',
         lastName: 'Minjibir',
         phoneNumber: '08032175464',
         address: 'Garki 2, Abuja'
      })

      member2 = await new Member({
         _id: id2,
         firstName: 'Muhammad',
         lastName: 'Minjibir',
         phoneNumber: '08042175464',
         address: 'Nasswarawa G.R.A, Kano'
      })

      await Member.insertMany([
         member1,
         member2
      ])
   })

   afterEach(async () => {
      await app.close()
      await Member.deleteMany({})
   });

   describe('GET', () => {
      it('by ID should return 404 with invalid message if the ID is not valid MongoDB Id', async () => {
         const res = await request(app).get(endpoint + '/anyId')

         expect(res.status).toBe(404)
         expect(res.body).toHaveProperty('error')
      })

      it(`by ID should return 404 with "message" property specifying "does not exist" if the member doesn't exist`, async () => {
         const res = await request(app).get(endpoint + '/' + mongoose.Types.ObjectId())

         expect(res.status).toBe(404)
         expect(res.body).toHaveProperty('message')
      })

      it('by Id should return a member with the specified ID', async () => {
         const res = await request(app).get(endpoint + '/' + id1);

         expect(res.status).toBe(200);
         expect(res.body._id).toContain(id1)
      })

      it('all should return all members', async () => {
         const res = await request(app).get(endpoint);
         expect(res.status).toBe(200);
         expect(res.body.length).toBe(2);
         expect(res.body.some(m => m.firstName == member1.firstName)).toBeTruthy()
         expect(res.body.some(m => m.firstName == member2.firstName)).toBeTruthy()
      });
   })

   describe('POST', () => {
      it('should return 400 with "error" property specifying the missing requirement', async () => {
         const res = await request(app)
            .post(endpoint)
            .send(_.pick(member1, ['lastName', 'phoneNumber', 'address']))

         expect(res.status).toBe(400)
      })

      it('should return 201 with the newly registered membmer', async () => {
         const res = await request(app)
            .post(endpoint)
            .send(member2)

         expect(res.status).toBe(201)
         // expect(res.body.firstName).toContain(m.firstName)
      })
   })

});