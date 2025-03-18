# AI Screen Analyzer

AI Screen Analyzer is a powerful web application that allows users to capture screenshots, analyze them using various AI providers and models, and engage in conversations about the captured images.



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
   # OpenAI GPT-4o is used for image analysis and chat
   # Ollama uses llava for image analysis 
   
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ANTHROPIC_MODEL=claude-3-sonnet-20240620

   OLLAMA_API_URL=http://localhost:11434
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## 🧰 Technologies Used

- **Frontend**: React, Tailwind CSS, HeroIcons
- **Backend**: Node.js, Express
- **AI Services**: OpenAI API, Anthropic API, Ollama
- **Containerization**: Docker

## 🔧 Configuration
- Add your API keys in `.env` file
- To change the default Anthropic model, update the `ANTHROPIC_MODEL` variable
- For Ollama, the default URL is `http://localhost:11434` when running natively, and `host.docker.internal:11434` in Docker

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions to AI Screen Analyzer are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## 🙏 Support

If you encounter any problems or have questions, please open an issue in the GitHub repository.

---

Made with ❤️ by [bigsk1](https://github.com/bigsk1)
