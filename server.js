const express = require('express');
const bodyParser = require('body-parser');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(bodyParser.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Reads the key from our secure environment
});

const PORT = process.env.PORT || 3000;

app.post('/generate', async (req, res) => {
  const userPrompt = req.body.prompt;

  if (!userPrompt) {
    return res.status(400).send({ error: 'Prompt is required.' });
  }

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // A fast and cheap, yet powerful model
      max_tokens: 4000,
      messages: [
        { 
          role: "user", 
          content: `You are an expert software developer. Please generate the code based on the following prompt. Respond only with the code itself, without any conversational text or explanations. Here is the prompt: ${userPrompt}`
        }
      ],
    });

    res.send({ generated_code: msg.content[0].text });
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    res.status(500).send({ error: 'Failed to generate code from AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`AI Coder backend listening on port ${PORT}`);
});
