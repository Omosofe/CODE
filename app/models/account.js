// WIP: work in progress

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
    // Reference to the user model in session.
    user: {type: Schema.Types.ObjectId, ref: 'User'},

    // User's information displayed to user dashboard
    student_info       : {
      full_name		:	{type: String},
      user_name   : {type: String},
      phone_number: {type: String},
      address     : {type: String},
      state       : {type: String}
    },

    chat         : {
      question   : {type: String},
      issue      : {type: String},
      suggestion : {type: String},
      outbox     : {type: String},
      inbox      : {type: String},
      chat_time  : {type: String}
    },


},// Displays a time stamp added to shema ( update_at & created_at)
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports = mongoose.model('Account', accountSchema);
