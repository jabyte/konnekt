const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const memberSchema = mongoose.Schema({
   _id: {
      type: mongoose.Types.ObjectId
   },
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
      required: true
   },
   phoneNumber: {
      type: String,
      required: true
   },
   address: {
      type: String,
      required: true
   },
   registeredAt: {
      type: Date,
      required: true,
      default: Date.now
   }
});

const Member = mongoose.model('Members', memberSchema);

const validate = function validate(member) {
   const validationSchema = Joi.object({
      _id: Joi.string().alphanum(),
      firstName: Joi.string().alphanum().min(3).max(30).required(),
      lastName: Joi.string().alphanum().min(3).max(30).required(),
      phoneNumber: Joi.string().min(11).max(11).required(),
      address: Joi.string().min(10).max(255),
      registeredAt: Joi.date()
   });

   return validationSchema.validate(member);
};

module.exports = {
   Member,
   validate
};
