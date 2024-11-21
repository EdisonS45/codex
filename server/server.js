import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios'; // Import Axios for HTTP requests

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cohere API Endpoint
const COHERE_API_URL = "https://api.cohere.ai/v1/generate"; // Cohere API endpoint

// Set up the POST route
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required.',
      });
    }

    // Send the request to Cohere API
    const response = await axios.post(
      COHERE_API_URL,
      {
        model: "command-xlarge-nightly", // Use the appropriate Cohere model
        prompt: prompt,
        max_tokens: 500, // Customize the number of tokens as needed
        temperature: 0.7, // Customize the temperature setting for randomness
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`, // Using your Cohere API Key
        },
      }
    );

    // Check if the response contains the generated text
    if (response.data && response.data.generations && response.data.generations.length > 0) {
      const botResponse = response.data.generations[0].text.trim(); // Extracting the 'text' from the generations array

      res.status(200).send({
        bot: botResponse,
      });
    } else {
      res.status(500).json({
        error: 'No valid response from Cohere API.',
      });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || 'Something went wrong with the Cohere API request.',
    });
  }
});

// Test route
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello from Cohere API!',
  });
});

app.listen(5000, () =>
  console.log('Server is running on the port http://localhost:5000')
);
