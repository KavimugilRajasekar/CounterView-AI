import React from 'react';
import styled from 'styled-components';
import MarkdownFormatter from './MarkdownFormatter';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  max-width: 80%;
  align-self: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid black;
  background: ${props => props.sender === 'user' 
    ? '#ffffff' 
    : '#f0fdf4'};
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  color: #333;
`;

const MessageTimestamp = styled.span`
  align-self: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.25rem;
`;

const ChatMessage = ({ message }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MessageContainer sender={message.sender}>
      <MessageBubble sender={message.sender}>
        <MessageText>
          <MarkdownFormatter text={message.text} />
        </MessageText>
      </MessageBubble>
      <MessageTimestamp sender={message.sender}>
        {formatTime(message.timestamp)}
      </MessageTimestamp>
    </MessageContainer>
  );
};

export default ChatMessage;