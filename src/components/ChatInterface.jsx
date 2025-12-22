import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage';
import VoiceRecorder from './VoiceRecorder';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  gap: 0.5rem;
`;

const TextInput = styled.textarea`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  resize: none;
  outline: none;
  font-size: 1rem;
  min-height: 20px;
  max-height: 150px;
  background: rgba(255, 255, 255, 0.8);
  
  &:focus {
    border-color: rgba(0, 0, 0, 0.4);
  }
`;

const SendButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #10b981, #fbbf24);
  color: black;
  border: 1px solid black;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant powered by local Ollama Gemma3:1b model. I can help analyze news articles and provide insights. Select a news article from the left panel to get started!", sender: 'ai', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interimText, setInterimText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for news selection events
  useEffect(() => {
    const handleNewsSelected = (event) => {
      const { title, description, category } = event.detail;
      
      const newsMessage = {
        id: messages.length + 1,
        text: `I've received a news article for analysis:\n\nTitle: ${title}\n\nDescription: ${description}\n\nCategory: ${category}`,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newsMessage]);
    };

    const handleAnalysisComplete = (event) => {
      const { category, sentiment, oppositionView } = event.detail;
      
      const analysisMessage = {
        id: messages.length + 1,
        text: `I've completed my analysis of the news article you selected.

Category: ${category}
Sentiment: ${sentiment}

Opposition Viewpoint:
${oppositionView}

Feel free to ask me any questions about this analysis or discuss alternative perspectives!`,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, analysisMessage]);
    };

    window.addEventListener('newsSelected', handleNewsSelected);
    window.addEventListener('analysisComplete', handleAnalysisComplete);

    return () => {
      window.removeEventListener('newsSelected', handleNewsSelected);
      window.removeEventListener('analysisComplete', handleAnalysisComplete);
    };
  }, [messages]);

  const callOllamaAPI = async (userMessage) => {
    try {
      // Build conversation history context
      let conversationHistory = '';
      messages.forEach(msg => {
        if (msg.sender === 'user') {
          conversationHistory += `User: ${msg.text}\n`;
        } else if (msg.sender === 'ai') {
          conversationHistory += `Assistant: ${msg.text}\n`;
        }
      });
      
      // Add the current user message
      conversationHistory += `User: ${userMessage}\nAssistant:`;
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3:1b',
          prompt: `You are a helpful AI assistant that analyzes news articles and provides insights. You specialize in discussing opposition viewpoints and balanced perspectives on current events.\n\nConversation History:\n${conversationHistory}`,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Call the Ollama API with streaming
      const response = await callOllamaAPI(inputText);
      
      // Add initial AI message
      const aiMessageId = messages.length + 2;
      let aiMessageText = '';
      
      const aiMessage = {
        id: aiMessageId,
        text: aiMessageText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Process the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      // Create a temporary message array for streaming updates
      let updatedMessages = [...messages, userMessage, aiMessage];
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.trim() !== '') {
              try {
                const parsed = JSON.parse(line);
                const content = parsed.response || '';
                
                if (content) {
                  aiMessageText += content;
                  
                  // Update the last message (AI message) with new content
                  updatedMessages = updatedMessages.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, text: aiMessageText } 
                      : msg
                  );
                  
                  setMessages([...updatedMessages]);
                }
              } catch (parseError) {
                // Skip invalid JSON
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = (transcript) => {
    setInputText(prevText => prevText + transcript);
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <TextInput
          ref={textareaRef}
          value={inputText + interimText}
          onChange={(e) => {
            // Clear interim text when user manually types
            setInterimText('');
            setInputText(e.target.value);
          }}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about the news analysis"
          rows={1}
          disabled={isLoading}
        />
        <VoiceRecorder onTranscript={handleVoiceInput} onInterimResult={setInterimText} />
        <SendButton onClick={handleSend} disabled={inputText.trim() === '' || isLoading}>
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;