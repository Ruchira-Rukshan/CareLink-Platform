import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiX, FiSend, FiUser, FiActivity, FiArrowRight } from 'react-icons/fi';

const AI_API = 'http://localhost:8000/api/ai-chat';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm CareBot, your AI healthcare assistant. How can I help you understand health concepts or lifestyle advice today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);
    const chatRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.slice(1); // Exclude the first welcome message
            const res = await axios.post(AI_API, {
                history: history,
                message: input
            });

            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I'm having trouble connecting right now. Please check if the AI service is runing on port 8000." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="chatbot-wrapper" 
            ref={chatRef}
            style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 10000 }}
        >
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(207, 249, 113, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0a2e0e',
                    fontSize: '24px',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: isOpen ? 'rotate(90deg) scale(0.9)' : 'scale(1)',
                }}
            >
                {isOpen ? <FiX /> : <FiMessageSquare />}
                {!isOpen && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        width: '18px',
                        height: '18px',
                        background: '#fff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#1AB088',
                        animation: 'pulse 2s infinite'
                    }}>1</span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div 
                    className="glass-card animate-in"
                    style={{
                        position: 'absolute',
                        bottom: '85px',
                        right: '0',
                        width: '380px',
                        height: '550px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid rgba(207, 249, 113, 0.3)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        background: 'rgba(15, 55, 58, 0.95)',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, rgba(207, 249, 113, 0.1) 0%, rgba(26, 176, 136, 0.1) 100%)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0a2e0e'
                        }}>
                            <FiActivity />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>CareBot</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary)' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }} />
                                AI Assistant Online
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div 
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            padding: '1.5rem',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            scrollbarWidth: 'none'
                        }}
                    >
                        {messages.map((msg, i) => (
                            <div 
                                key={i}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}
                            >
                                <div style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                    background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                                    color: msg.role === 'user' ? '#0a2e0e' : '#fff',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                    boxShadow: msg.role === 'user' ? '0 4px 12px rgba(207, 249, 113, 0.2)' : 'none'
                                }}>
                                    {msg.content}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.role === 'user' ? 'You' : 'CareBot'}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.08)', padding: '0.8rem 1rem', borderRadius: '18px 18px 18px 2px', display: 'flex', gap: '4px' }}>
                                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'chatBounce 1s infinite' }} />
                                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'chatBounce 1s infinite 0.2s' }} />
                                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'chatBounce 1s infinite 0.4s' }} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form 
                        onSubmit={handleSend}
                        style={{
                            padding: '1.2rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            gap: '10px',
                            background: 'rgba(255, 255, 255, 0.02)'
                        }}
                    >
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything about health..."
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '12px',
                                padding: '0.7rem 1rem',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'var(--primary)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0a2e0e',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                opacity: !input.trim() || isLoading ? 0.5 : 1
                            }}
                        >
                            <FiSend />
                        </button>
                    </form>

                    <style>{`
                        @keyframes chatBounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-5px); }
                        }
                        @keyframes pulse {
                            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
                            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
