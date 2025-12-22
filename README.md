# CounterView-AI

CounterView-AI is an innovative React-based application that combines real-time news fetching with advanced AI analysis to provide balanced perspectives on current events. The application focuses on Indian news and provides AI-generated opposition viewpoints along with sentiment analysis.

## Features

- **News Aggregation**: Fetches the latest Indian news from trusted sources using cloud APIs
- **AI-Powered Analysis**: Utilizes the local Ollama Gemma3:1b model to generate insightful opposition viewpoints
- **Sentiment Detection**: Automatically identifies the sentiment tone of news content
- **Balanced Perspectives**: Generates respectful counter-arguments to encourage critical thinking
- **Real-time Streaming**: AI responses are streamed in real-time for a smooth user experience
- **Integrated Chat Interface**: Discuss news articles with the AI in a conversational format
- **Voice Input**: Real-time voice recording with speech-to-text conversion
- **Expandable Content Display**: View full news content with expand/collapse functionality
- **Formatted Text Display**: Markdown-style formatting rendered with visual styling
- **Conversation Context**: AI maintains session memory for coherent responses
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Fallback Systems**: Simulated data when external services are unavailable
- **Responsive Design**: Clean, modern interface with gradient color scheme (green-yellow-white)
- **Cross-Browser Compatibility**: Works on modern browsers with Web Speech API support

## How It Works

### Initial Setup
1. Ensure Ollama service is running with Gemma3:1b model installed
2. Start the application with `npm run dev`
3. Access the application through your web browser

### News Analysis Workflow
1. Click "Fetch Indian News" to retrieve current articles from NewsAPI.org
2. Browse through categorized Sports and Political news articles
3. Select an article to analyze by clicking on it
4. Click "Analyze Selected News with AI" to initiate processing
5. View AI-generated opposition viewpoint and sentiment analysis

### Interactive Discussion
1. Type questions or comments in the chat input field
2. Alternatively, click the microphone to speak naturally
3. Receive real-time AI responses in the conversation panel
4. Continue the discussion with follow-up questions
5. Explore different perspectives on the selected news article

### Advanced Features
1. Expand truncated news content to view full articles
2. Observe formatted text with highlighted key points
3. Benefit from conversation context awareness
4. Experience seamless fallback during service interruptions

## Detailed Application Workflow

### Phase 1: News Fetching and Filtering
1. **API Request**: The application sends a request to NewsAPI.org with the query "India" to fetch relevant Indian news
2. **Response Processing**: NewsAPI returns a collection of articles from various Indian news sources
3. **Content Filtering**: The application filters articles using keyword analysis:
   - **Sports Keywords**: cricket, football, soccer, tennis, badminton, hockey, sport, match, game, player, team, etc.
   - **Political Keywords**: government, minister, prime minister, president, election, vote, parliament, congress, bjp, modi, policy, etc.
4. **Category Assignment**: Each article is categorized as either "Sports" or "Political" based on keyword matches
5. **Content Presentation**: Filtered articles are displayed in a scrollable list with truncated descriptions for readability

### Phase 2: News Selection and Analysis
1. **Article Selection**: User clicks on any news article from the list to select it for analysis
2. **Content Expansion**: Selected article shows full title, source, and expandable content preview
3. **AI Analysis Trigger**: Clicking "Analyze Selected News with AI" initiates the analysis process
4. **Prompt Engineering**: The application creates a specialized prompt for the AI model including:
   - Article title and content
   - Instructions for category detection
   - Requirements for sentiment analysis
   - Guidelines for generating opposition viewpoints
5. **Local AI Processing**: The prompt is sent to the locally hosted Ollama Gemma3:1b model
6. **Response Parsing**: AI response is parsed to extract:
   - Detected category (Sports/Political)
   - Sentiment classification (Positive/Negative/Neutral/Mixed)
   - Generated opposition viewpoint
7. **Results Display**: Analysis results are shown in two sections:
   - **Opposition Report**: Formatted opposition viewpoint with disclaimer
   - **Sentiment Analysis**: Visual sentiment badge with explanation

### Phase 3: Interactive Chat Interface
1. **Conversation Initialization**: Chat begins with a welcome message and automatically receives selected news article
2. **Message Exchange**: Users can send text messages or use voice input to discuss the article
3. **Voice Recognition**: Microphone button activates Web Speech API for real-time speech-to-text conversion
4. **Real-time Feedback**: Interim speech results appear instantly in the chat input field
5. **Final Transcription**: Completed speech segments are added to the chat input for sending
6. **AI Response Generation**: User messages are sent to Ollama Gemma3:1b with conversation history
7. **Streaming Responses**: AI responses are streamed back character-by-character for immediate feedback
8. **Conversation Context**: All messages are maintained in session memory for contextual responses

### Phase 4: Advanced Features
1. **Content Expansion**: Expand/collapse functionality for viewing full article content
2. **Formatted Display**: Markdown-style formatting (**bold text**) rendered with visual styling
3. **Error Handling**: Graceful handling of API failures, speech recognition errors, and network issues
4. **Fallback Systems**: Simulated news data when external APIs are unavailable
5. **Responsive Design**: Adaptable layout for different screen sizes and devices

## Tech Stack

- **Frontend**: React with Hooks and Functional Components
- **Styling**: CSS3 with gradient backgrounds and responsive design
- **AI Integration**: Local Ollama Gemma3:1b model
- **News API**: NewsAPI.org for fetching current Indian news
- **Build Tool**: Vite for fast development and bundling
- **State Management**: React built-in useState and useEffect hooks

## Data Flow Architecture

### Client-Side Processing
1. **User Interface Layer**: React components handle user interactions and display
2. **State Management**: useState hooks maintain application state (news articles, chat messages, UI controls)
3. **Event Handling**: Custom event listeners coordinate between components
4. **API Communication**: Fetch API handles requests to external services

### External Services
1. **NewsAPI.org**: Provides current Indian news articles
2. **Ollama Service**: Hosts Gemma3:1b model for AI processing
3. **Web Speech API**: Browser-native speech recognition service

### Data Transformation Pipeline
1. **News Fetching**: API → JSON parsing → Content filtering → UI display
2. **AI Analysis**: Selected content → Prompt engineering → Model inference → Response parsing → UI rendering
3. **Chat Interaction**: User input → Message storage → Context assembly → Model inference → Streaming response → UI updates
4. **Voice Processing**: Audio capture → Speech recognition → Text transcription → Input field update

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── App.css                 # Global styles
├── index.css               # Base styles
├── main.jsx                # Entry point
└── components/
    ├── ChatInterface.jsx   # Chat interface with AI streaming
    ├── ChatMessage.jsx     # Individual chat message bubbles
    ├── VoiceRecorder.jsx   # Voice recording component
    └── MarkdownFormatter.jsx # Text formatting component
```

## Component Interactions

### App.jsx (Main Component)
- Manages overall application state
- Coordinates news fetching and filtering
- Handles AI analysis requests and responses
- Communicates with child components via custom events

### NewsAnalyzer (Child Component)
- Implements news fetching logic
- Filters and categorizes articles
- Manages analysis process
- Dispatches custom events for inter-component communication

### ChatInterface.jsx
- Manages chat message state
- Handles user input (text and voice)
- Implements AI communication
- Streams responses in real-time
- Listens for custom events from NewsAnalyzer

### ChatMessage.jsx
- Renders individual chat messages
- Applies formatting using MarkdownFormatter
- Displays timestamps and sender information

### VoiceRecorder.jsx
- Handles microphone access
- Implements Web Speech API
- Manages recording state
- Provides real-time speech feedback

### MarkdownFormatter.jsx
- Parses markdown-style formatting
- Renders bold text with visual styling
- Maintains paragraph structure

## Core Functionality

### News Analysis
- Fetches Indian news articles from NewsAPI.org using API key: `517b05764ff34cabab0d4c1dbc695f81`
- Presents articles in a selectable list format (non-editable to ensure data integrity)
- Truncates long content for display with expand/collapse functionality
- When an article is selected, it's automatically sent to the chat interface
- Fallback to simulated data when API is unavailable
- Note: NewsAPI.org free tier may limit full article content availability

### AI Opposition Generation
- Uses specialized prompt engineering for consistent output format
- Generates category-appropriate opposition viewpoints (Sports/Political)
- Performs sentiment analysis on input content
- Creates respectful, non-inflammatory counter-arguments
- Processes requests using locally hosted Ollama Gemma3:1b model
- Maintains conversation context for coherent responses
- Streams responses in real-time for immediate feedback

### Voice Input
- Real-time speech recognition using Web Speech API
- Continuous voice recording with interim results
- Support for multiple languages (defaults to English-US)
- Comprehensive error handling for common issues
- Real-time text updates in chat input field
- Visual feedback during recording with interim results display
- Automatic cleanup of interim text when user types manually
- Browser compatibility checks with user-friendly error messages

### Integrated Chat Interface
- Real-time streaming of AI responses using local Ollama Gemma3:1b model
- Message bubbles with timestamps
- Voice recording capability with real-time speech-to-text conversion
- Real-time text updates during voice recording
- Black-outlined elements for visual clarity
- Automatic receipt of selected news articles for discussion

## Error Handling and Fallbacks

### Network Failures
- NewsAPI.org unavailability triggers simulated data fallback
- Ollama service errors display user-friendly error messages
- Graceful degradation maintains core functionality

### Speech Recognition Issues
- Browser compatibility checks with clear guidance
- Microphone access errors provide specific troubleshooting steps
- Audio capture failures suggest hardware verification
- Service unavailability recommends browser settings review

### Data Integrity
- Immutable news content prevents accidental modifications
- Input validation ensures proper data handling
- State management prevents inconsistent UI states

### User Experience
- Loading states provide visual feedback during operations
- Error messages guide users toward solutions
- Fallback content ensures continuous usability

## Color Scheme

- Primary gradient: Green (#10b981) to Yellow (#fbbf24) to White (#ffffff)
- Message bubbles: Light green/white gradients with black borders
- Background: Subtle gradient from light green to light yellow to white
- Sentiment badges: Color-coded (Green=Positive, Red=Negative, Gray=Neutral)

## API Keys

The application uses one API key:

1. **NewsAPI.org**: `517b05764ff34cabab0d4c1dbc695f81` for fetching news articles

Additionally, it uses a locally hosted Ollama Gemma3:1b model for AI processing.

**Note**: The NewsAPI.org free tier may limit access to full article content. Some articles may display truncated content with "..." indicators. The application provides expand/collapse functionality to view more content when available.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (usually bundled with Node.js)
- Ollama service installed and running
- Gemma3:1b model installed in Ollama
- Modern web browser with Web Speech API support (Chrome, Edge, Safari)

### Installation
1. Install dependencies:
   ```
   npm install
   ```

2. Ensure Ollama is running:
   ```
   ollama serve
   ```

3. Verify Gemma3:1b model is installed:
   ```
   ollama list
   ```
   If not installed, run:
   ```
   ollama pull gemma3:1b
   ```

### Running the Application
1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to the provided local address

### Building for Production
1. Build for production:
   ```
   npm run build
   ```

2. Preview production build:
   ```
   npm run preview
   ```

## Development Guidelines

- Follow RESTful conventions for any new API endpoints
- Use camelCase for JavaScript variables and functions
- Maintain the gradient color scheme and black-outlined elements
- Ensure responsive design works on all screen sizes
- Preserve real-time streaming functionality for AI responses
- Follow clean, minimal UI principles without unnecessary animations
- Keep news content immutable to ensure data integrity
- Maintain compatibility with Web Speech API for voice input
- Handle speech recognition errors gracefully with user-friendly messages

## Performance Optimizations

### Rendering Efficiency
- Virtualized lists for news article display
- Memoized components to prevent unnecessary re-renders
- Efficient state updates to minimize DOM manipulations

### Memory Management
- Cleanup of event listeners to prevent memory leaks
- Proper disposal of speech recognition resources
- State pruning to maintain optimal performance

### Network Optimization
- Local AI processing eliminates network latency for inference
- Efficient API requests with proper error handling
- Caching strategies for improved responsiveness

### User Experience
- Smooth animations and transitions
- Loading states for better perceived performance
- Progressive enhancement for feature availability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes with meaningful messages
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Common Issues

**Microphone Not Working**
- Ensure browser has microphone permissions
- Check that no other applications are using the microphone
- Verify microphone is properly connected
- Try refreshing the page

**AI Responses Not Appearing**
- Confirm Ollama service is running (`ollama serve`)
- Verify Gemma3:1b model is installed (`ollama list`)
- Check network connectivity to localhost:11434

**News Not Loading**
- Verify internet connection
- Check NewsAPI.org API key validity
- Confirm firewall settings aren't blocking requests

**Formatting Not Displaying**
- Ensure browser supports modern CSS features
- Check browser console for JavaScript errors
- Refresh the page to reload components

### Debugging Steps
1. Check browser console for error messages
2. Verify all required services are running
3. Confirm API keys are properly configured
4. Test with different browsers if issues persist
5. Review network tab for failed requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.