# ChatStudio - Developer Chat API Testing Tool

A feature-rich HTML template for developers to test and tune their chat backend APIs with real-time streaming, session management, and comprehensive debugging capabilities.

## Features

### 🎨 Beautiful Pastel UI
- Modern developer tool aesthetic with soft pastel colors
- Responsive design that works on desktop and mobile
- Light/dark theme support
- Smooth animations and transitions

### 💬 Advanced Chat Interface
- **Streaming Response Support**: Real-time typewriter effect
- **Markdown Rendering**: Full markdown support with syntax highlighting
- **File Upload**: Drag & drop image support with preview
- **Rich Text Input**: Emoji picker, code block insertion
- **Message History**: Persistent conversation storage

### 🔧 Mock Backend System
- **Multiple Personalities**: Helpful, Technical, Creative, Concise response types
- **Configurable Streaming**: Adjustable typing speed (10-200ms)
- **Error Simulation**: Configurable error rates for testing
- **Smart Responses**: Context-aware reply generation
- **Connection Simulation**: Realistic latency and status indicators

### 📊 Session Management
- **Save & Restore**: Persistent session storage in localStorage
- **Session History**: Visual list with previews and metadata
- **Export/Import**: JSON export for session sharing
- **Auto-save**: Optional automatic session persistence
- **Session Naming**: Custom naming with timestamps

### 🛠️ Developer Tools
- **Debug Console**: Raw message inspection and system stats
- **Performance Metrics**: Response time tracking and averages
- **Error Monitoring**: Error count and detailed logging
- **Connection Status**: Real-time backend health monitoring
- **Keyboard Shortcuts**: Efficient developer workflow

## Quick Start

1. Clone or download the files
2. Open `index.html` in your browser
3. Start testing your chat interface immediately!

```bash
# Simple local server
python -m http.server 8000
# or
npx serve .
```

## File Structure

```
chatstudio/
├── index.html          # Main application interface
├── styles.css          # Pastel theme styling
├── app.js              # Core application logic
├── mock-backend.js     # Response simulation system
└── README.md          # This file
```

## Usage Guide

### Basic Chat Testing
1. Type your message in the input area
2. Press Ctrl+Enter or click Send
3. Watch the streaming response with realistic typing
4. Adjust mock backend settings in the right panel

### Session Management
- **New Session**: Start fresh conversation
- **Save Session**: Preserve current chat for later
- **Load Session**: Restore previous conversation
- **Export Session**: Download as JSON file

### Mock Backend Configuration
- **Response Type**: Choose AI personality (Helpful, Technical, Creative, Concise)
- **Streaming Speed**: Adjust typing speed from 10-200ms
- **Error Rate**: Simulate connection issues 0-30%

### Advanced Features
- **Image Upload**: Click 📷 or drag & drop images
- **Code Blocks**: Click 💻 to insert formatted code
- **Emoji Support**: Click 😀 for quick emoji insertion
- **Debug Mode**: View raw messages and system stats
- **Theme Toggle**: Switch between light and dark modes

## Customization

### Styling
Edit `styles.css` to customize the pastel color palette:
```css
:root {
    --primary-500: #7c6aef;    /* Main accent color */
    --success-500: #22c55e;    /* Success messages */
    --warning-500: #f59e0b;    /* Warnings */
    --error-500: #ef4444;      /* Error states */
}
```

### Mock Responses
Modify `mock-backend.js` to add new response types:
```javascript
this.responseTypes.custom = {
    name: 'Custom Assistant',
    responses: ['Your custom responses here...'],
    followups: ['Custom follow-up questions...']
};
```

### API Integration
Replace the mock backend with real API calls:
```javascript
// In app.js, replace mockBackend.streamResponse with:
async function callRealAPI(message, onChunk, onComplete, onError) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    
    const reader = response.body.getReader();
    // Handle streaming response...
}
```

## Keyboard Shortcuts

- `Ctrl+Enter` - Send message
- `Ctrl+/` - Focus message input
- `Escape` - Close modal dialogs

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technical Details

### Dependencies (CDN)
- **Marked.js**: Markdown parsing and rendering
- **Highlight.js**: Code syntax highlighting

### Storage
- **localStorage**: Session persistence and user preferences
- **No server required**: Fully client-side application

### Performance
- **Responsive UI**: 60fps animations with CSS transforms
- **Memory Efficient**: Automatic cleanup of old sessions
- **Fast Rendering**: Optimized DOM manipulation

## API Integration Examples

### OpenAI ChatGPT
```javascript
async function streamOpenAI(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            stream: true
        })
    });
}
```

### Anthropic Claude
```javascript
async function streamClaude(message) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            messages: [{ role: 'user', content: message }],
            stream: true
        })
    });
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add your improvements
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use in your projects!

## Changelog

### v1.0.0
- Initial release with full feature set
- Pastel UI theme
- Mock backend with streaming
- Session management
- Developer tools and debugging
- Mobile responsive design