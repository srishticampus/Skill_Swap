import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import axiosInstance from '../../api/axios';
import AuthContext from '../../context/AuthContext'; // Import AuthContext
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const SkillSwapperChat = () => {
  const { user } = useContext(AuthContext); // Get authenticated user/organization from context
  const [chatEntities, setChatEntities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChatEntity, setSelectedChatEntity] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      });
    }
  }, []);

  const handleNewMessageTextChange = useCallback((e) => {
    setNewMessageText(e.target.value);
  }, []);

  // Fetch chat entities on component mount and when selectedChatEntity changes
  useEffect(() => {
    const fetchChatEntities = async () => {
      try {
        const response = await axiosInstance.get('/api/chat/conversations');
        setChatEntities(response.data);
        if (response.data.length > 0 && !selectedChatEntity) {
          setSelectedChatEntity(response.data[0]);
        }
      } catch (err) {
        setError('Failed to fetch chat entities.');
        console.error('Error fetching chat entities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatEntities();
  }, [selectedChatEntity]); // Re-fetch entities to update unread counts

  const filteredChatEntities = useMemo(() => {
    return chatEntities.filter(entity =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entity.type === 'User' && entity.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [chatEntities, searchTerm]);

  // Fetch messages and mark as read when selectedChatEntity changes
  useEffect(() => {
    const fetchMessagesAndMarkRead = async () => {
      if (selectedChatEntity) {
        try {
          setLoading(true);
          // Fetch messages
          const messagesResponse = await axiosInstance.get(`/api/chat/messages/${selectedChatEntity._id}?otherEntityType=${selectedChatEntity.type}`);
          setMessages(messagesResponse.data);

          // Mark messages as read
          await axiosInstance.put(`/api/chat/messages/read/${selectedChatEntity._id}`, { otherEntityType: selectedChatEntity.type });

          // Re-fetch chat entities to update unread counts in the sidebar
          const entitiesResponse = await axiosInstance.get('/api/chat/conversations');
          setChatEntities(entitiesResponse.data);

        } catch (err) {
          setError('Failed to fetch messages or mark as read.');
          console.error('Error fetching messages or marking as read:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMessagesAndMarkRead();
  }, [selectedChatEntity]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessageText.trim() || !selectedChatEntity) return;

    try {
      await axiosInstance.post('/api/chat/message', {
        receiverId: selectedChatEntity._id,
        receiverType: selectedChatEntity.type,
        messageText: newMessageText,
      });
      setNewMessageText('');
      // Refresh messages after sending
      const response = await axiosInstance.get(`/api/chat/messages/${selectedChatEntity._id}?otherEntityType=${selectedChatEntity.type}`);
      setMessages(response.data);
    } catch (err) {
      setError('Failed to send message.');
      console.error('Error sending message:', err);
    }
  }, [newMessageText, selectedChatEntity, setMessages, setNewMessageText, setError]);

  // Scroll to bottom whenever messages or selectedChatEntity changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatEntity, scrollToBottom]);

  const handleChatEntityClick = useCallback((entity) => {
    setSelectedChatEntity(entity);
  }, [setSelectedChatEntity]);

  const getAvatarSrc = (entity) => {
    if (entity.type === 'User') {
      return entity.profilePicture ? `${import.meta.env.VITE_API_URL}/${entity.profilePicture}` : '/src/assets/profile-pic.png';
    } else if (entity.type === 'Organization') {
      return entity.logo ? `${import.meta.env.VITE_API_URL}/${entity.logo}` : '/src/assets/skillswaplogo.svg'; // Assuming organization logo is in 'logo' field or first file
    }
    return '/src/assets/profile-pic.png'; // Default fallback
  };

  const getFallback = (entity) => {
    return entity?.name?.charAt(0) || ''; // Safely access name and return first char, or empty string
  };

  const isSender = (message) => {
    return message.sender === user.id && message.senderType === user.type;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Chat</h1>

        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <input
              type="text"
              placeholder="Search a chat here..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchTerm}
              onChange={useCallback((e) => setSearchTerm(e.target.value), [setSearchTerm])}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
          <Card className="w-full lg:w-1/4 p-4 shadow-lg rounded-lg overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Conversations</h2>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center p-3 rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredChatEntities.length === 0 ? (
              <p>No conversations found matching your search.</p>
            ) : (
              filteredChatEntities.map((entity) => (
                <div
                  key={entity._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 ${
                    selectedChatEntity?._id === entity._id ? 'bg-purple-100' : 'hover:bg-gray-50'
                  } ${entity.type === 'Organization' ? 'bg-blue-100 border-blue-300 border' : ''}`}
                  onClick={() => handleChatEntityClick(entity)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getAvatarSrc(entity)} alt={entity.name} />
                    <AvatarFallback>{getFallback(entity)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-grow">
                    <p className="font-medium">
                      {entity.name} {entity.type === 'Organization' && <span className="text-xs text-blue-600">(Organization)</span>}
                      {entity.email === 'admin@admin.com' && <span className="text-xs text-blue-600">(Admin)</span>}
                    </p>
                    {entity.type === 'User' && entity.email !== 'admin@admin.com' && (
                      <p className="text-sm text-gray-500">{entity.skills?.join(', ') || 'No skills'}</p>
                    )}
                  </div>
                  {entity.unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {entity.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </Card>

          <Card className="flex-grow p-6 shadow-lg rounded-lg flex flex-col">
            {selectedChatEntity ? (
              <>
                <div className="flex items-center pb-4 border-b border-gray-200 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={getAvatarSrc(selectedChatEntity)} alt={selectedChatEntity.name} />
                    <AvatarFallback>{getFallback(selectedChatEntity)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold text-lg">{selectedChatEntity.name}</p>
                    {selectedChatEntity.type === 'User' && selectedChatEntity.email !== 'admin@admin.com' && (
                      <>
                        <p className="text-sm text-gray-600">{selectedChatEntity.skills?.join(', ') || 'No skills'}</p>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{selectedChatEntity.city || 'N/A'}, {selectedChatEntity.country || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15.711c-2.791 0-5.48-.568-7.923-1.646a.865.865 0 00-.477.049C3.933 14.5 3 15.248 3 16.358V19a2 2 0 002 2h14a2 2 0 002-2v-2.642c0-1.111-.933-1.86-2.202-2.145zM12 6a3 3 0 110 6 3 3 0 010-6z" />
                          </svg>
                          <span>{selectedChatEntity.yearsOfExperience || 0}+ years Experience</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
                  {loading ? (
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <Skeleton className="h-10 w-1/2" />
                      </div>
                      <div className="flex justify-end">
                        <Skeleton className="h-10 w-1/2" />
                      </div>
                      <div className="flex justify-start">
                        <Skeleton className="h-10 w-2/3" />
                      </div>
                      <div className="flex justify-end">
                        <Skeleton className="h-10 w-1/3" />
                      </div>
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : messages.length === 0 ? (
                    <p>No messages yet. Start a conversation!</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${isSender(message) ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isSender(message) && (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={getAvatarSrc(selectedChatEntity)} alt={selectedChatEntity.name} />
                            <AvatarFallback>{getFallback(selectedChatEntity)}</AvatarFallback>
                          </Avatar>
                        )}
                        <p
                          className={`p-3 rounded-lg max-w-xs break-words ${
                            isSender(message)
                              ? 'bg-gray-600 text-white'
                              : 'bg-purple-200 text-gray-800'
                          }`}
                        >
                          {message.message_text}
                        </p>
                        {isSender(message) && (
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarImage src={getAvatarSrc(user)} alt={user.name} />
                            <AvatarFallback>{getFallback(user)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center pt-4 border-t border-gray-200">
                  <input
                    key={selectedChatEntity?._id || 'no-entity'}
                    type="text"
                    placeholder="Message"
                    className="flex-grow mr-4 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newMessageText}
                    onChange={handleNewMessageTextChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Button>
                  <Button className="ml-2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700" onClick={handleSendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a conversation to start chatting.</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SkillSwapperChat;
