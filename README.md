

# AI Screen Analyzer

AI Screen Analyzer is a powerful web application that allows users to capture screenshots, analyze them using various AI providers and models, and engage in conversations about the captured images. 

You can capture a website you like and then ask the AI to provide the code to build the same thing. 

You can capture any window or full screen ask OpenAI gpt-4o to describe anything about it and then switch providers and follow up with Claude or any Ollama model which will have the previous context and still understand the past conversation and image. 

## Features

- **Screen Capture**: Easily capture screenshots of your desktop or specific windows.
- **Multi-Model AI Analysis**: Analyze images using multiple AI models:
  - OpenAI's GPT-4 Vision
  - Anthropic's Claude 3 Sonnet
  - Ollama's local models (including LLaVA)
- **Intelligent Chat**: Engage in conversations about the analyzed images or any other topic.
- **Model Switching**: Seamlessly switch between different AI models for varied perspectives without losing context.
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing.
- **Local Setup**: Run the application locally for enhanced privacy and customization.
- **Docker**: Run in docker because we all love docker.


![ai-screen](https://imagedelivery.net/WfhVb8dSNAAvdXUdMfBuPQ/33c4e5b3-3722-403a-e877-b6906677e600/public)



## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18.0.0 or later)
- Ollama (for local model support)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/bigsk1/ai-screen-analyzer.git
   cd ai-screen-analyzer
   ```

2. Install dependencies for both the client and server:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:

   ```env
   # for openai gpt-4o is used for image analysis and chat
   # ollama uses llava for image analysis 
   
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ANTHROPIC_MODEL=claude-3-sonnet-20240620

   OLLAMA_API_URL=http://localhost:11434
   ```

## Usage

1. Start the server and react app:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Use the "Start Capturing" button to begin a screen capture.

4. Select the window or area you want to capture.

5. Click "Capture Screenshot" to analyze the image.

6. Choose an AI model from the dropdown menu to analyze the image or engage in chat.

7. Type your questions or comments in the chat box and press send.


## Docker 

There is a `docker-compose.yml` file in root which will build the `Dockerfile`

   ```bash
   docker-compose up -d --build
   ```

visit http://localhost:3000

To remove 

```bash
docker-compose down
```


## Configuration
- Add your OpenAI API Key in `.env`
- To change the default Anthropic model, update the `ANTHROPIC_MODEL` variable in your `.env` files.
- If using `ollama` and your host if different then change in the .env, by default when running nativly using npm run dev it uses locahost:11434 and when running docker it uses host.docker.internal:11434 so no need to change in the .env

## Contributing

Contributions to the AI Screen Analyzer are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.



## Support

If you encounter any problems or have any questions, please open an issue in the GitHub repository.
