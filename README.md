# AI Screen Analyzer

AI Screen Analyzer is a powerful web application that allows users to capture screenshots, analyze them using various AI providers and models, and engage in conversations about the captured images.

![Image](https://github.com/user-attachments/assets/997bd717-6f7f-4c83-b0aa-395360ea4698)

## 🚀 Features

- **Modern UI**: Sleek, responsive interface with dark/light mode and glass morphism effects
- **Screen Capture**: Easily capture screenshots of your desktop or specific windows
- **Multi-Model AI Analysis**: Analyze images using multiple AI models:
  - OpenAI's GPT-4o Vision
  - Anthropic's Claude 3 
  - Ollama's local models (including LLaVA)
- **Intelligent Chat**: Engage in conversations about the analyzed images or any topic
- **Model Switching**: Seamlessly switch between different AI models without losing context
- **Dark/Light Mode**: Toggle between dark and light themes based on preference or system settings
- **Capture History**: View and manage your recent screen captures
- **Responsive Design**: Works great on desktop and mobile devices
- **Local Setup**: Run the application locally for enhanced privacy and customization
- **Docker Support**: Run in Docker for easy deployment


## ✨ Use Cases

- **UI/UX Research**: Capture and analyze interfaces for design inspiration
- **Code Generation**: Capture a website you like and ask the AI to provide the code
- **Technical Support**: Take screenshots of errors and get AI assistance
- **Content Analysis**: Analyze charts, graphs, or visual data
- **Learning Tool**: Ask questions about anything you see on your screen

## 🚀 Quick Start

### Docker (Recommended)

Add your API keys in `.env` file:

```bash
docker-compose up -d --build
```

Visit http://localhost:3000

Prerequisites:
- Docker
- Node.js (v22 or higher)
- npm

### Local Setup

1. Clone the repository:
   ```
   git clone https://github.com/bigsk1/ai-screen-analyzer.git
   cd ai-screen-analyzer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:

   ```env 
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

   OLLAMA_API_URL=http://localhost:11434
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

![Image](https://github.com/user-attachments/assets/afc1eb69-37d5-4fef-8ed0-c1e00bce4c02)

## 🧰 Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **AI Services**: OpenAI API, Anthropic API, Ollama
- **Containerization**: Docker

## 🔧 Configuration
- Add your API keys in `.env` file
- To change the default Anthropic model, update the `ANTHROPIC_MODEL` variable
- For Ollama, the default URL is `http://localhost:11434` when running natively, and `host.docker.internal:11434` in Docker

