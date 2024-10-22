const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    calculatedField: {
      type: String,
      default: '',
    },
  }, {
    timestamps: true, 
  });

module.exports = mongoose.model('Data', DataSchema);
