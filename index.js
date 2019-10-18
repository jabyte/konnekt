const config = require('config');
const _ = require('lodash');
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const {
   Member,
   validate
} = require('./models/member.model');
const app = express();

const port = process.env.PORT || 5000;


// Middlewares
app.use(morgan("combined"));
app.use(express.json());

// Database setup
mongoose
   .connect(config.get('db.url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
   })
   .then(console.info('Successfully Connected to database'))
   .catch(err => {
      console.error('Unable to establish connection to database:', err.message)
   });

// Application routes
app.get('/api/members', async (req, res) => {
   try {
      const members = await Member.find({});

      res
         .status(200)
         .json(members);
   } catch (err) {
      res
         .status(500)
         .json({
            message: err.message
         });
   }
});

app.get('/api/members/:id', async (req, res) => {
   try {
      const member = await Member.findById(req.params.id);

      if (member) {
         res
            .status(200)
            .json(member);
      }

      res
         .status(404)
         .json({
            message: 'Member not found.'
         });

   } catch (err) {
      res
         .status(500)
         .json({
            error: err.message
         });
   }
});

app.post('/api/members', async (req, res) => {
   const {
      error,
      value
   } = validate(req.body);

   if (error) {
      res
         .status(400)
         .json({
            error: error.message
         });
   }

   try {
      const member = await Member.create(value);

      res
         .status(201)
         .header('Location', req.originalUrl + '/' + member._id)
         .json(member);
   } catch (err) {
      res
         .status(400)
         .json({
            error: err.message
         });
   }
});

app.put('/api/members', async (req, res) => {
   const {
      error,
      value
   } = validate(req.body);

   if (error) {
      res
         .status(400)
         .json({
            error: error.mesage
         });
   }

   try {
      const member = await Member.findById(value._id);

      if (member) {
         await Member.updateOne(value, {
            _id: value._id
         });
         res
            .status(200)
            .json(value);
      } else {
         res
            .status(404)
            .json({
               error: 'Member with that id not found'
            });
      }

   } catch (err) {
      res
         .status(400)
         .json({
            error: err.message
         });
   }
});

app.delete('/api/members/:id', async (req, res) => {
   const memberId = req.params.id;

   try {
      const member = await Member.findById(memberId);

      if (member) {
         res
            .status(200)
            .json({
               result: `Member with id ${memberId} deleted.`
            });
      }

      res
         .status(404)
         .json({
            error: `Member with id ${memberId} doesn't exist`
         });

   } catch (err) {
      res
         .status(400)
         .json({
            message: err.message
         });
   }
});

module.exports = app.listen(port, () => {
   return console.info(`Server running on port ${port}`);
});
