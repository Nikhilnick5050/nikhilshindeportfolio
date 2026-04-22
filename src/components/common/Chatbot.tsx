import React, { useState, useRef, useEffect } from 'react';
import { IconWrapper } from '../../utils/IconWrapper';
import styled, { keyframes } from 'styled-components';
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CHAT_API_CANDIDATES = Array.from(
  new Set(
    [
      process.env.REACT_APP_CHAT_API_URL,
      '/api/chat',
      '/admin/chat.php',
      'http://localhost/pratikportfolio/admin/chat.php',
      'http://localhost/admin/chat.php',
    ].filter((value): value is string => Boolean(value && value.trim()))
  )
);

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const ChatWidget = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ToggleButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradients.primary};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatWindow = styled(motion.div)`
  width: 350px;
  height: 500px;
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.1);
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.gradients.primary};
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  /* Add text shadow for better visibility on bright backgrounds */
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);

  h3 {
    margin: 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const MessageList = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.colors.background.primary};
  
  /* Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  margin-bottom: 10px;
  /* User: White Bubble | AI: Dark/Transparent Bubble */
  background: ${({ $isUser, theme }) => $isUser ? 'white' : 'rgba(255,255,255,0.1)'};
  /* User: Black Text | AI: White Text */
  color: ${({ $isUser }) => $isUser ? 'black' : 'white'};
  align-self: ${({ $isUser }) => $isUser ? 'flex-end' : 'flex-start'};
  border: 1px solid rgba(255,255,255,0.1);
  word-wrap: break-word; /* Ensure long words don't overflow */
  border-bottom-${({ $isUser }) => $isUser ? 'right' : 'left'}-radius: 2px;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const InputArea = styled.form`
  padding: 15px;
  display: flex;
  gap: 10px;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: ${({ theme }) => theme.colors.background.card};
`;

const Input = styled.input`
  flex: 1;
  background: white !important;
  border: 1px solid rgba(0,0,0,0.1);
  padding: 10px 15px;
  border-radius: 20px;
  /* Ensure high contrast for input text */
  color: black !important;
  outline: none;

  &::placeholder {
    color: rgba(0,0,0,0.5) !important;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const SendButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Badge = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: 75px; 
  transform: translateY(-50%) !important;
  background: white;
  color: black;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  pointer-events: none;
  z-index: 10000;

  /* Arrow pointing right */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -6px;
    transform: translateY(-50%);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid white;
    border-right: none;
  }
`;

interface Message {
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm Nikhil's AI Assistant. Ask me anything about his work!", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle badge visibility
  useEffect(() => {
    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setShowBadge(false);
    }, 5000);

    // Hide on scroll
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBadge(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setIsLoading(true);

    try {
      let connected = false;
      let lastErrorMessage = '';

      for (const url of CHAT_API_CANDIDATES) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg }),
          });

          const raw = await response.text();
          if (!raw || raw.trim().startsWith('<')) {
            lastErrorMessage = `Received non-JSON response from ${url}`;
            continue;
          }

          const data = JSON.parse(raw);

          if (!response.ok) {
            lastErrorMessage = data?.error?.message || data?.error || `HTTP ${response.status} from ${url}`;
            continue;
          }

          if (data.choices && data.choices[0]?.message?.content) {
            setMessages(prev => [...prev, { text: data.choices[0].message.content, isUser: false }]);
            connected = true;
            break;
          }

          if (data.error) {
            lastErrorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            continue;
          }

          lastErrorMessage = `Invalid response format from ${url}`;
        } catch (attemptError) {
          lastErrorMessage = attemptError instanceof Error ? attemptError.message : 'Connection failed';
        }
      }

      if (!connected) {
        setMessages(prev => [
          ...prev,
          {
            text: `Chat backend not connected. Set REACT_APP_CHAT_API_URL (or use /api/chat) and restart dev server. Last error: ${lastErrorMessage}`,
            isUser: false
          }
        ]);
      }
    } catch {
      setMessages(prev => [...prev, { text: 'Chat connection failed. Please try again.', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatWidget>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Header>
              <h3><IconWrapper icon={FaRobot} /> Nikhil AI</h3>
              <IconWrapper icon={FaTimes} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
            </Header>
            <MessageList>
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} $isUser={msg.isUser}>
                  {msg.text.split(/(\*\*.*?\*\*)/).map((part, i) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={i}>{part.slice(2, -2)}</strong>
                    ) : (
                      part
                    )
                  )}
                </MessageBubble>
              ))}
              {isLoading && (
                <MessageBubble $isUser={false}>
                  <IconWrapper icon={FaCommentDots} className="animate-pulse" /> Typing...
                </MessageBubble>
              )}
              <div ref={messagesEndRef} />
            </MessageList>
            <InputArea onSubmit={handleSubmit}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask something..."
              />
              <SendButton type="submit" disabled={isLoading}>
                <IconWrapper icon={FaPaperPlane} />
              </SendButton>
            </InputArea>
          </ChatWindow>
        )}
      </AnimatePresence>

      {!isOpen && (
        <AnimatePresence>
          {showBadge && (
            <Badge
              initial={{ opacity: 0, y: 10, x: 0 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 1 }}
            >
              Talk to me to know more!
            </Badge>
          )}
        </AnimatePresence>
      )}

      <ToggleButton onClick={() => setIsOpen(!isOpen)} whileTap={{ scale: 0.9 }}>
        {isOpen ? <IconWrapper icon={FaTimes} /> : <IconWrapper icon={FaCommentDots} />}
      </ToggleButton>
    </ChatWidget>
  );
};

export default Chatbot;
