import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import axiosInstance from '../../api/axios'; // Import the axios instance

const SkillSwapperChat = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch chat users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/chat/users');
        setUsers(response.data);
        if (response.data.length > 0) {
          // Optionally select the first user by default
          setSelectedChatUser(response.data[0]);
        }
      } catch (err) {
        setError('Failed to fetch users.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fetch messages when selectedChatUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChatUser) {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/api/chat/messages/${selectedChatUser._id}`);
          setMessages(response.data);
        } catch (err) {
          setError('Failed to fetch messages.');
          console.error('Error fetching messages:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMessages();
  }, [selectedChatUser]);

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !selectedChatUser) return;

    try {
      await axiosInstance.post('/api/chat/message', {
        receiverId: selectedChatUser._id,
        messageText: newMessageText,
      });
      setNewMessageText('');
      // Refresh messages after sending
      const response = await axiosInstance.get(`/api/chat/messages/${selectedChatUser._id}`);
      setMessages(response.data);
    } catch (err) {
      setError('Failed to send message.');
      console.error('Error sending message:', err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedChatUser(user);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Skill Swapper Chat</h1>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <Input
              type="text"
              placeholder="Search a chat here..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Chat Layout */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
          {/* Left Panel - User List */}
          <Card className="w-full lg:w-1/4 p-4 shadow-lg rounded-lg overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Chats</h2>
            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && filteredUsers.length === 0 && <p>No users found matching your search.</p>}
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 ${
                  selectedChatUser?._id === user._id ? 'bg-purple-100' : 'hover:bg-gray-50'
                } ${user.email === 'admin@admin.com' ? 'bg-blue-100 border-blue-300 border' : ''}`}
                onClick={() => handleUserClick(user)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePicture ? `${import.meta.env.VITE_API_URL}/${user.profilePicture}` : '/src/assets/profile-pic.png'} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">
                    {user.name} {user.email === 'admin@admin.com' && <span className="text-xs text-blue-600">(Admin)</span>}
                  </p>
                  <p className="text-sm text-gray-500">{user.skills?.join(', ') || 'No skills'}</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Right Panel - Chat Window */}
          <Card className="flex-grow p-6 shadow-lg rounded-lg flex flex-col">
            {selectedChatUser ? (
              <>
                {/* Current Chat User Info */}
                <div className="flex items-center pb-4 border-b border-gray-200 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedChatUser.profilePicture || '/src/assets/pfp.jpeg'} alt={selectedChatUser.name} />
                    <AvatarFallback>{selectedChatUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold text-lg">{selectedChatUser.name}</p>
                    {selectedChatUser.email !== 'admin@admin.com' && (
                      <>
                        <p className="text-sm text-gray-600">{selectedChatUser.skills?.join(', ') || 'No skills'}</p>
                        {/* You can add more user details here if available in the user object */}
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{selectedChatUser.city || 'N/A'}, {selectedChatUser.country || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15.711c-2.791 0-5.48-.568-7.923-1.646a.865.865 0 00-.477.049C3.933 14.5 3 15.248 3 16.358V19a2 2 0 002 2h14a2 2 0 002-2v-2.642c0-1.111-.933-1.86-2.202-2.145zM12 6a3 3 0 110 6 3 3 0 010-6z" />
                          </svg>
                          <span>{selectedChatUser.yearsOfExperience || 0}+ years Experience</span>
                        </div>
                      </>
                    )}
                    {/* Assuming user_rating model exists and can be fetched for average rating */}
                    {/* <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div> */}
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {loading && <p>Loading messages...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {!loading && messages.length === 0 && <p>No messages yet. Start a conversation!</p>}
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender === selectedChatUser._id ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {message.sender === selectedChatUser._id && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={selectedChatUser.profilePicture || '/src/assets/pfp.jpeg'} alt={selectedChatUser.name} />
                          <AvatarFallback>{selectedChatUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`p-3 rounded-lg max-w-xs ${
                          message.sender === selectedChatUser._id
                            ? 'bg-purple-200 text-gray-800'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        {message.message_text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex items-center pt-4 border-t border-gray-200">
                  <Input
                    type="text"
                    placeholder="Message"
                    className="flex-grow mr-4 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
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
                <p className="text-gray-500">Select a user to start chatting.</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SkillSwapperChat;
