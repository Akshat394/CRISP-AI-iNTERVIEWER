# Configuration Guide

## Setting up the Gemini API Key

1. Create a `.env` file in the root directory of your project
2. Add your Gemini API key to the `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

3. If you don't have a Gemini API key:
   - Go to the Google AI Studio (https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key and paste it in your `.env` file

4. Restart the development server after adding the API key

## Important Notes

- Never commit your `.env` file to version control
- Keep your API key secure and don't share it publicly
- The Gemini API key is required for:
  - Resume analysis
  - Question generation
  - Answer evaluation
  - Interview feedback

## Troubleshooting

If you're seeing "AI services unavailable" messages:

1. Check that your `.env` file exists in the project root
2. Verify that the environment variable is named exactly `VITE_GEMINI_API_KEY`
3. Ensure the API key is valid and not expired
4. Restart the development server after making changes

For more information about Gemini API, visit: https://ai.google.dev/docs