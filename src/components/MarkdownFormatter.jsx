import React from 'react';
import styled from 'styled-components';

const FormattedTextContainer = styled.div`
  line-height: 1.6;
  
  .bold-text {
    font-weight: bold;
    color: #2d3748;
    background-color: #f0f8ff;
    padding: 2px 4px;
    border-radius: 3px;
    border: 1px solid #d1e7ff;
  }
  
  p {
    margin: 0.5rem 0;
  }
`;

const MarkdownFormatter = ({ text }) => {
  if (!text) return null;
  
  // Function to convert **text** to bold elements
  const formatText = (input) => {
    // Split text by ** markers
    const parts = input.split(/\*\*(.*?)\*\*/);
    
    return parts.map((part, index) => {
      // Odd indices are the content between **
      if (index % 2 === 1) {
        return <span key={index} className="bold-text">{part}</span>;
      }
      // Even indices are regular text
      return part;
    });
  };
  
  // Split text into paragraphs and format each
  const paragraphs = text.split('\n');
  
  return (
    <FormattedTextContainer>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          {formatText(paragraph)}
        </p>
      ))}
    </FormattedTextContainer>
  );
};

export default MarkdownFormatter;