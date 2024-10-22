// routes/dataRoutes.js
const express = require('express');
const Data = require('../models/Data');
const { z } = require('zod');
const { sendTaskToSQS } = require('../services/sqsService');
const axios = require('axios');
const router = express.Router();

// Define Zod schema for incoming data validation
const dataSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
});

// Generate new data from external API
router.post('/generate', async (req, res, next) => {
  try {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const randomData = data[Math.floor(Math.random() * data.length)];

    // Validate the data using Zod
    const parsedData = dataSchema.parse({
      title: randomData.title,
      description: randomData.body,
    });

    const newData = new Data(parsedData);
    await newData.save();
    await sendTaskToSQS(newData._id.toString());

    res.status(201).json(newData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
