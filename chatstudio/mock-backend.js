// Mock Backend System for ChatStudio
class MockBackend {
    constructor() {
        this.responseTypes = {
            helpful: {
                name: 'Helpful Assistant',
                responses: [
                    "I'd be happy to help you with that! Let me break this down step by step:",
                    "That's a great question! Here's what I can tell you:",
                    "I understand what you're looking for. Let me provide a comprehensive answer:",
                    "Absolutely! I can help you solve this problem. Here's my approach:",
                    "That's an interesting challenge. Let me walk you through the solution:",
                    "Perfect! I have some insights that might be useful for your situation:",
                    "I see what you're trying to accomplish. Here's how we can approach this:",
                    "Excellent question! Let me share some best practices and recommendations:"
                ],
                followups: [
                    "\n\nWould you like me to elaborate on any of these points?",
                    "\n\nDoes this approach make sense for your use case?",
                    "\n\nLet me know if you need clarification on any part!",
                    "\n\nIs there a specific aspect you'd like to dive deeper into?",
                    "\n\nFeel free to ask if you have any follow-up questions!",
                    "\n\nHow does this solution sound to you?"
                ]
            },
            technical: {
                name: 'Technical Expert',
                responses: [
                    "From a technical perspective, the optimal solution involves:",
                    "Let's analyze the architecture and implementation details:",
                    "The most efficient approach would be to implement:",
                    "Based on performance benchmarks and scalability requirements:",
                    "Considering the system constraints and technical specifications:",
                    "The recommended technical stack for this would include:",
                    "From an engineering standpoint, we need to consider:",
                    "The implementation should follow these technical patterns:"
                ],
                followups: [
                    "\n\n```javascript\n// Example implementation:\nconst solution = {\n  // Technical details here\n};\n```",
                    "\n\n**Performance Considerations:**\n- Memory usage: O(n)\n- Time complexity: O(log n)\n- Scalability: Horizontal scaling supported",
                    "\n\n**Technical Requirements:**\n- Node.js 16+\n- TypeScript support\n- Unit test coverage > 90%",
                    "\n\n```python\n# Python implementation example\ndef optimize_solution():\n    return \"Optimized result\"\n```"
                ]
            },
            creative: {
                name: 'Creative Thinker',
                responses: [
                    "Let's think outside the box and explore some innovative approaches:",
                    "What if we approached this problem from a completely different angle?",
                    "Here's a creative solution that might surprise you:",
                    "I love challenges like this! Let's brainstorm some unique ideas:",
                    "Sometimes the best solutions come from unconventional thinking:",
                    "Let me propose a creative framework that could work here:",
                    "What if we reimagined this problem entirely? Here's my take:",
                    "Creative problem-solving often leads to breakthrough insights:"
                ],
                followups: [
                    "\n\n🎨 **Creative Ideas:**\n• Gamification approach\n• Visual storytelling method\n• Community-driven solution\n• Interactive experience design",
                    "\n\n💡 **Innovation Opportunities:**\n- Reverse engineering the problem\n- Cross-industry inspiration\n- User-centric design thinking",
                    "\n\n🚀 **Bold Concepts:**\n1. Revolutionary user interface\n2. AI-powered personalization\n3. Collaborative ecosystem approach",
                    "\n\n✨ **Out-of-the-box thinking:**\n- What would happen if we removed all constraints?\n- How would a child solve this problem?\n- What's the opposite of the obvious solution?"
                ]
            },
            concise: {
                name: 'Concise Responses',
                responses: [
                    "Quick answer:",
                    "Here's the solution:",
                    "Simply put:",
                    "Direct approach:",
                    "Bottom line:",
                    "Key point:",
                    "Essential info:",
                    "Core concept:"
                ],
                followups: [
                    "\n\nNeed more details? Just ask!",
                    "\n\nAny questions?",
                    "\n\nMore info available if needed.",
                    "\n\nClear?",
                    "\n\nLet me know if you want elaboration.",
                    "\n\nQuestions welcome!"
                ]
            }
        };

        this.settings = {
            responseType: 'helpful',
            streamingSpeed: 50,
            errorRate: 0,
            responseDelay: 500
        };

        this.conversationContext = [];
        this.isStreaming = false;
        this.currentStreamId = null;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    // Simulate realistic response generation
    generateResponse(userMessage) {
        const responseType = this.responseTypes[this.settings.responseType];
        let response = '';

        // Context-aware response selection
        if (userMessage.toLowerCase().includes('code') || userMessage.toLowerCase().includes('implement')) {
            response = this.generateCodeResponse(userMessage);
        } else if (userMessage.toLowerCase().includes('explain') || userMessage.toLowerCase().includes('how')) {
            response = this.generateExplanationResponse(userMessage, responseType);
        } else if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('problem')) {
            response = this.generateHelpResponse(userMessage, responseType);
        } else {
            response = this.generateGeneralResponse(userMessage, responseType);
        }

        // Add follow-up based on response type
        const followup = responseType.followups[Math.floor(Math.random() * responseType.followups.length)];
        response += followup;

        // Store conversation context
        this.conversationContext.push({
            user: userMessage,
            assistant: response,
            timestamp: Date.now()
        });

        return response;
    }

    generateCodeResponse(userMessage) {
        const codeExamples = [
            `Here's a clean implementation:

\`\`\`javascript
// Modern async/await approach
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error;
    }
}
\`\`\``,
            `I'll show you the optimal solution:

\`\`\`python
def process_data(data):
    """
    Process data with error handling and validation
    """
    if not data:
        raise ValueError("Data cannot be empty")
    
    return {
        'processed': [item.strip().lower() for item in data],
        'count': len(data),
        'timestamp': datetime.now().isoformat()
    }
\`\`\``,
            `Here's the recommended approach:

\`\`\`typescript
interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

class ApiClient {
    private baseUrl: string;
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
        return {
            data: await response.json(),
            status: response.status,
            message: response.statusText
        };
    }
}
\`\`\``
        ];
        
        return codeExamples[Math.floor(Math.random() * codeExamples.length)];
    }

    generateExplanationResponse(userMessage, responseType) {
        const explanations = [
            `${responseType.responses[Math.floor(Math.random() * responseType.responses.length)]}

**Key Concepts:**
1. **Foundation**: Understanding the core principles
2. **Implementation**: Step-by-step approach
3. **Best Practices**: Industry standards and recommendations
4. **Common Pitfalls**: What to avoid and why

The process works by breaking down complex problems into manageable components, then systematically addressing each part while maintaining overall coherence.`,

            `${responseType.responses[Math.floor(Math.random() * responseType.responses.length)]}

Let me walk through this systematically:

**Phase 1: Analysis**
- Identify requirements and constraints
- Map out dependencies and relationships
- Assess risks and potential challenges

**Phase 2: Design**
- Create architectural blueprint
- Define interfaces and contracts
- Plan for scalability and maintainability

**Phase 3: Implementation**
- Build core functionality first
- Add features incrementally
- Test thoroughly at each stage`,

            `${responseType.responses[Math.floor(Math.random() * responseType.responses.length)]}

Here's the detailed breakdown:

**Understanding the Problem:**
The challenge here involves multiple interconnected factors that need careful consideration.

**The Solution Framework:**
1. **Input Processing**: Clean and validate incoming data
2. **Core Logic**: Apply business rules and transformations  
3. **Output Generation**: Format results for consumption
4. **Error Handling**: Graceful failure management

**Why This Approach Works:**
This method provides flexibility while maintaining reliability and performance.`
        ];

        return explanations[Math.floor(Math.random() * explanations.length)];
    }

    generateHelpResponse(userMessage, responseType) {
        const helpResponses = [
            `${responseType.responses[Math.floor(Math.random() * responseType.responses.length)]}

**Immediate Actions:**
✅ First, let's identify the root cause
✅ Then we'll implement a targeted solution
✅ Finally, we'll set up prevention measures

**Troubleshooting Steps:**
1. Gather relevant information and context
2. Isolate the specific issue from broader problems
3. Test potential solutions in a controlled environment
4. Monitor results and adjust as needed

**Resource Recommendations:**
- Documentation and official guides
- Community forums and discussions
- Testing tools and validation methods`,

            `${responseType.responses[Math.floor(Math.random() * responseType.responses.length)]}

**Quick Fix:**
Try this solution first - it resolves the issue in most cases.

**Comprehensive Solution:**
If the quick fix doesn't work, here's the detailed approach:

**Step 1**: Diagnostic phase
- Check configuration settings
- Verify dependencies and versions
- Review recent changes

**Step 2**: Resolution phase  
- Apply targeted fixes
- Test functionality
- Validate results

**Step 3**: Prevention phase
- Update documentation
- Set up monitoring
- Create backup procedures`,

            `${responseType.responses[Math.floor(Math.random() * responseType.responses.length)]}

**Problem Analysis:**
Based on your description, this appears to be a common issue with well-established solutions.

**Solution Options:**
- **Option A**: Quick workaround (temporary fix)
- **Option B**: Proper implementation (recommended)
- **Option C**: Advanced optimization (for complex cases)

**Implementation Guide:**
I recommend starting with Option B as it provides the best balance of reliability and maintainability.

**Success Metrics:**
You'll know it's working when you see improved performance and reduced error rates.`
        ];

        return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }

    generateGeneralResponse(userMessage, responseType) {
        const base = responseType.responses[Math.floor(Math.random() * responseType.responses.length)];
        
        const extensions = [
            `The key insight here is understanding the underlying patterns and how they apply to your specific situation.

**Core Principles:**
- Start with the fundamentals
- Build incrementally  
- Test assumptions regularly
- Adapt based on feedback

**Practical Applications:**
This approach has been proven effective across various domains and use cases.`,

            `This is actually quite interesting from multiple perspectives.

**Technical Perspective:**
The implementation involves several layers of abstraction that work together seamlessly.

**User Experience Perspective:**  
The end result should feel intuitive and natural, despite the complexity behind the scenes.

**Business Perspective:**
This solution provides measurable value while remaining cost-effective and scalable.`,

            `Let me provide you with a comprehensive overview that covers all the important aspects.

**Background Context:**
Understanding the historical evolution helps explain why current best practices exist.

**Current State:**
Here's what the landscape looks like today and the main considerations.

**Future Considerations:**
Emerging trends and technologies that might influence your decisions.`
        ];

        return base + '\n\n' + extensions[Math.floor(Math.random() * extensions.length)];
    }

    // Simulate streaming response
    async streamResponse(message, onChunk, onComplete, onError) {
        if (this.isStreaming) {
            onError(new Error('Already streaming a response'));
            return;
        }

        // Simulate random errors based on error rate
        if (Math.random() * 100 < this.settings.errorRate) {
            setTimeout(() => {
                onError(new Error('Simulated network error - connection timeout'));
            }, Math.random() * 2000 + 500);
            return;
        }

        this.isStreaming = true;
        this.currentStreamId = Date.now();
        const streamId = this.currentStreamId;

        try {
            // Initial delay to simulate network latency
            await new Promise(resolve => setTimeout(resolve, this.settings.responseDelay));

            if (!this.isStreaming || this.currentStreamId !== streamId) {
                return; // Stream was cancelled
            }

            const response = this.generateResponse(message);
            const words = response.split(' ');
            let currentText = '';

            for (let i = 0; i < words.length; i++) {
                if (!this.isStreaming || this.currentStreamId !== streamId) {
                    return; // Stream was cancelled
                }

                currentText += (i === 0 ? '' : ' ') + words[i];
                onChunk(currentText);

                // Variable delay based on content
                let delay = this.settings.streamingSpeed;
                
                // Pause longer at punctuation
                if (words[i].endsWith('.') || words[i].endsWith('!') || words[i].endsWith('?')) {
                    delay *= 3;
                } else if (words[i].endsWith(',') || words[i].endsWith(':') || words[i].endsWith(';')) {
                    delay *= 2;
                }

                // Slower typing for code blocks
                if (words[i].includes('```') || words[i].includes('`')) {
                    delay *= 1.5;
                }

                await new Promise(resolve => setTimeout(resolve, delay));
            }

            this.isStreaming = false;
            this.currentStreamId = null;
            onComplete(currentText);

        } catch (error) {
            this.isStreaming = false;
            this.currentStreamId = null;
            onError(error);
        }
    }

    // Cancel current streaming
    cancelStream() {
        this.isStreaming = false;
        this.currentStreamId = null;
    }

    // Get conversation history
    getConversationHistory() {
        return [...this.conversationContext];
    }

    // Clear conversation history
    clearHistory() {
        this.conversationContext = [];
    }

    // Simulate connection status
    getConnectionStatus() {
        // Simulate occasional connection issues based on error rate
        const isHealthy = Math.random() * 100 > this.settings.errorRate;
        
        return {
            connected: isHealthy,
            latency: Math.random() * 200 + 50, // 50-250ms
            responseTime: this.settings.streamingSpeed,
            errorRate: this.settings.errorRate,
            lastUpdate: Date.now()
        };
    }

    // Simulate different response scenarios for testing
    async simulateScenario(scenario, message, onChunk, onComplete, onError) {
        switch (scenario) {
            case 'timeout':
                setTimeout(() => {
                    onError(new Error('Request timeout - server did not respond'));
                }, 5000);
                break;
                
            case 'rate_limit':
                setTimeout(() => {
                    onError(new Error('Rate limit exceeded - please wait before sending another message'));
                }, 1000);
                break;
                
            case 'server_error':
                setTimeout(() => {
                    onError(new Error('Internal server error - please try again later'));
                }, Math.random() * 2000 + 500);
                break;
                
            case 'partial_response':
                // Start streaming then cut off
                this.streamResponse(message, onChunk, () => {
                    onError(new Error('Connection lost during streaming'));
                }, onError);
                
                setTimeout(() => {
                    this.cancelStream();
                }, Math.random() * 3000 + 1000);
                break;
                
            default:
                this.streamResponse(message, onChunk, onComplete, onError);
        }
    }
}

// Export the mock backend
window.MockBackend = MockBackend;