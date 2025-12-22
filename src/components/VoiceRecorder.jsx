import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
`;

const RecorderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RecordButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.isRecording 
    ? 'linear-gradient(135deg, #ef4444, #f87171)' 
    : 'linear-gradient(135deg, #10b981, #6ee7b7)'};
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  
  ${props => props.isRecording && `
    animation: ${pulse} 1.5s infinite;
  `}
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MicIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: black;
`;

const StopIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: white;
`;

const VoiceRecorder = ({ onTranscript, onInterimResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const startRecording = async () => {
    try {
      // Check if Web Speech API is available
      if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      // Initialize speech recognition
      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setInterimTranscript(interimTranscript);
        
        // Send interim results to parent component if callback exists
        if (onInterimResult) {
          onInterimResult(interimTranscript);
        }
        
        // Send final transcript to parent component
        if (finalTranscript.trim()) {
          onTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Speech recognition error occurred.';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech was detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone was found. Please ensure your microphone is connected and try again.';
            break;
          case 'not-allowed':
            errorMessage = 'Permission to use microphone was denied. Please allow microphone access and try again.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech service is not allowed. Please check your browser settings.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        alert(errorMessage);
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          // Restart recognition if still recording
          try {
            recognition.start();
          } catch (err) {
            console.error('Error restarting recognition:', err);
            setIsRecording(false);
          }
        }
      };

      recognition.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Error accessing microphone. Please ensure your microphone is connected and permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript('');
    }
  };

  // Reset interim transcript when starting recording
  const startRecordingWithReset = async () => {
    setInterimTranscript('');
    if (onInterimResult) {
      onInterimResult('');
    }
    await startRecording();
  };

  const toggleRecording = (e) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
    } else {
      startRecordingWithReset();
    }
  };



  return (
    <RecorderContainer>
      <RecordButton 
        isRecording={isRecording} 
        onClick={toggleRecording}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <StopIcon viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </StopIcon>
        ) : (
          <MicIcon viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </MicIcon>
        )}
      </RecordButton>
      {isRecording && interimTranscript && (
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '12px',
          maxWidth: '200px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          zIndex: 1000
        }}>
          {interimTranscript}
        </div>
      )}
    </RecorderContainer>
  );
};

export default VoiceRecorder;