import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatMessages, chatSuggestions } from '@/mocks/homeData';

type Message = {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  time: string;
  bullets?: string[];
  isFollowUp?: boolean;
};

const sidebarChats = [
  { id: 1, title: 'What is a PIP?', preview: 'A PIP — Performance Improvement Plan...', active: true },
  { id: 2, title: 'Notice period negotiation', preview: 'Yes, notice periods can often be...', active: false },
  { id: 3, title: 'Flexible working request', preview: 'You have the right to request...', active: false },
  { id: 4, title: 'Redundancy rights', preview: 'If you are being made redundant...', active: false },
  { id: 5, title: 'Contract changes', preview: 'Your employer cannot change your...', active: false },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(chatMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: messages.length + 2,
        sender: 'ai',
        content: "That is a great question. Here is what you need to know, explained in plain English:",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bullets: [
          'Your rights depend on your contract type and length of service',
          'Always check your employee handbook for specific policies',
          'If in doubt, document everything in writing',
          'You can usually request an informal chat before escalating',
        ],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="h-screen bg-primary-950 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-72 bg-primary-900/80 backdrop-blur-sm border-r border-primary-800/60 flex flex-col transition-transform duration-300`}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-primary-800/60">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-800">
                <i className="ri-book-open-line text-sm text-accent-400"></i>
              </div>
              <span className="text-sm font-heading font-bold text-white">HR Voodoo</span>
            </a>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
          <button
            onClick={() => { setMessages([]); setSidebarOpen(false); }}
            className="mt-4 w-full py-2.5 rounded-lg bg-accent-500/15 border border-accent-500/25 text-accent-400 text-sm font-medium hover:bg-accent-500/25 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="ri-add-line"></i>
            New Chat
          </button>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-white/30 text-xs font-medium uppercase tracking-wider px-3 py-2">Recent</p>
          {sidebarChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSidebarOpen(false)}
              className={`w-full text-left p-3 rounded-xl transition-colors cursor-pointer ${
                chat.active
                  ? 'bg-primary-800/60 border border-primary-700/40'
                  : 'hover:bg-primary-800/30 border border-transparent'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${
                  chat.active ? 'bg-accent-500/20 text-accent-400' : 'bg-primary-800 text-white/40'
                }`}>
                  <i className="ri-chat-3-line text-xs"></i>
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${chat.active ? 'text-white' : 'text-white/70'}`}>
                    {chat.title}
                  </p>
                  <p className="text-xs text-white/40 truncate mt-0.5">{chat.preview}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-primary-800/60">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-2.5 p-3 rounded-xl hover:bg-primary-800/30 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
              <i className="ri-user-line text-sm"></i>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Sign In</p>
              <p className="text-xs text-white/40">to save your chats</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col bg-background-50 min-w-0">
        {/* Chat header */}
        <header className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-background-200/70 bg-background-50/95 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer"
          >
            <i className="ri-menu-line text-lg"></i>
          </button>
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-accent-500 shadow-sm">
            <i className="ri-sparkling-line text-lg text-white"></i>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground-800">HR Voodoo Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              <span className="text-xs text-foreground-400">Online</span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-accent-100 text-accent-500 mb-5">
                <i className="ri-sparkling-line text-3xl"></i>
              </div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary-900 mb-2">
                What is on your mind?
              </h3>
              <p className="text-foreground-500 text-sm max-w-sm mb-6">
                Ask anything about HR, workplace policies, or your rights. We translate the jargon into plain English.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {chatSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 rounded-full bg-background-100 border border-background-200/70 text-foreground-600 text-sm hover:border-accent-300 hover:text-accent-600 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 mt-0.5 ${
                    msg.sender === 'ai'
                      ? 'bg-accent-500 shadow-sm'
                      : 'bg-primary-200'
                  }`}>
                    <i className={`text-sm ${msg.sender === 'ai' ? 'ri-sparkling-line text-white' : 'ri-user-line text-primary-700'}`}></i>
                  </div>

                  {/* Message bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.sender === 'user'
                      ? 'bg-primary-900 text-white'
                      : msg.isFollowUp
                        ? 'bg-accent-50 border border-accent-200/60 text-foreground-700'
                        : 'bg-white border border-background-200/70 text-foreground-700'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>

                    {msg.bullets && (
                      <ul className="mt-3 space-y-2">
                        {msg.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground-600">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                              msg.isFollowUp ? 'bg-accent-400' : 'bg-accent-500'
                            }`}></span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className={`text-[10px] mt-2 ${
                      msg.sender === 'user' ? 'text-white/40' : 'text-foreground-400'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-accent-500 shadow-sm">
                  <i className="ri-sparkling-line text-sm text-white"></i>
                </div>
                <div className="bg-white border border-background-200/70 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input area */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-t border-background-200/70 bg-background-50/95 backdrop-blur-sm">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-3 md:hidden">
              {chatSuggestions.slice(0, 2).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 rounded-full bg-background-100 border border-background-200/70 text-foreground-600 text-xs hover:border-accent-300 transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask anything about HR..."
                className="w-full px-4 py-3 pr-10 rounded-xl bg-background-100 border border-background-200/70 text-foreground-800 text-sm placeholder:text-foreground-400 focus:outline-none focus:border-accent-400 transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-accent-500 transition-colors cursor-pointer">
                <i className="ri-attachment-line text-lg"></i>
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-500 text-white hover:bg-accent-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
            >
              <i className="ri-send-plane-fill text-lg"></i>
            </button>
          </div>
          <p className="text-center text-[10px] text-foreground-400 mt-2">
            HR Voodoo provides general guidance, not legal advice. Always consult a professional for specific situations.
          </p>
        </div>
      </main>
    </div>
  );
}