import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Hash, LogOut, Users, MessageSquare, AtSign, Plus, X, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { socket, connectSocket, disconnectSocket } from '../../socket';
import { logout } from '../../redux/slices/authSlice';
import api from '../../utils/axios';

export default function ChatLayout() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // App State
  const [activeContext, setActiveContext] = useState({ type: 'channel', id: 'general', name: 'general-chat' });
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityForm, setCommunityForm] = useState({ name: '', inviteCode: '', mode: 'create' });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Chat State
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [unreads, setUnreads] = useState({ channels: {}, dms: {}, global: false });
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load Initial Data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, commiesRes] = await Promise.all([
          api.get('/users'),
          api.get('/communities')
        ]);
        setUsers(usersRes.data);
        setCommunities(commiesRes.data);
      } catch (err) { console.error("Failed to fetch initial data"); }
    };
    fetchInitialData();
  }, []);

  // Fetch Messages when Context Changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setMessages([]); // clear current
        if (activeContext.type === 'channel' && activeContext.id === 'general') {
          const res = await api.get('/messages'); // Global
          setMessages(res.data);
        } else if (activeContext.type === 'channel') {
           const res = await api.get(`/messages/channel/${activeContext.id}`); // Community Channel
           setMessages(res.data);
        } else if (activeContext.type === 'dm') {
          const res = await api.get(`/dms/${activeContext.id}/messages`);
          setMessages(res.data);
        }
      } catch (err) {
        console.error("Failed to load historical messages");
      }
    };
    fetchMessages();
    
    // Clear unreads for new context
    if (activeContext.type === 'channel' && activeContext.id === 'general') {
      setUnreads(prev => ({ ...prev, global: false }));
    } else if (activeContext.type === 'channel') {
      setUnreads(prev => ({ ...prev, channels: { ...prev.channels, [activeContext.id]: 0 } }));
    } else if (activeContext.type === 'dm') {
      setUnreads(prev => ({ ...prev, dms: { ...prev.dms, [activeContext.name]: 0 } }));
    }
  }, [activeContext]);

  // Socket Setup
  useEffect(() => {
    connectSocket();
    const onConnect = () => { setIsConnected(true); socket.emit('user:join'); };
    const onDisconnect = () => setIsConnected(false);

    const onGlobalMessageReceive = (value) => {
      if (activeContext.type === 'channel' && activeContext.id === 'general' && value.isGlobal) {
        setMessages(prev => [...prev, value]);
        removeTypingUser(value.author);
      } else if (value.isGlobal && value.author !== user?.username) {
        setUnreads(prev => ({ ...prev, global: true }));
      }
    };

    const onChannelMessageReceive = (value) => {
      if (activeContext.type === 'channel' && activeContext.id === value.channelId) {
        setMessages(prev => [...prev, value]);
        removeTypingUser(value.author);
      } else if (value.author !== user?.username) {
        setUnreads(prev => ({ ...prev, channels: { ...prev.channels, [value.channelId]: (prev.channels[value.channelId] || 0) + 1 } }));
      }
    };

    const onDmMessageReceive = (value) => {
      if (activeContext.type === 'dm' && activeContext.id === value.dmId) {
        setMessages(prev => [...prev, value]);
        removeTypingUser(value.author);
      } else if (value.author !== user?.username) {
        setUnreads(prev => ({ ...prev, dms: { ...prev.dms, [value.author]: (prev.dms[value.author] || 0) + 1 } }));
      }
    };

    const removeTypingUser = (author) => setTypingUsers(prev => { const n = new Set(prev); n.delete(author); return n; });

    const onPresenceUpdate = (data) => {
      if (activeContext.type === 'channel' && activeContext.id === 'general') {
        setMessages(prev => [...prev, { id: Date.now(), author: 'System', content: `${data.username} is now ${data.status.toLowerCase()}`, isSystem: true }]);
      }
    };

    const handleTypingUpdate = (activeTypeMatch) => ({ username, isTyping }) => {
        if (activeTypeMatch) {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              if (isTyping) newSet.add(username); else newSet.delete(username);
              return newSet;
            });
        }
    };

    const onGlobalTypingUpdate = handleTypingUpdate(activeContext.type === 'channel' && activeContext.id === 'general');
    const onDmTypingUpdate = ({ username, isTyping, dmId }) => handleTypingUpdate(activeContext.type === 'dm' && activeContext.id === dmId)({ username, isTyping });
    const onChannelTypingUpdate = ({ username, isTyping, channelId }) => handleTypingUpdate(activeContext.type === 'channel' && activeContext.id === channelId)({ username, isTyping });


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message:receive', onGlobalMessageReceive);
    socket.on('channel:message:receive', onChannelMessageReceive);
    socket.on('dm:message:receive', onDmMessageReceive);
    socket.on('presence:update', onPresenceUpdate);
    
    socket.on('typing:update', onGlobalTypingUpdate);
    socket.on('dm:typing:update', onDmTypingUpdate);
    socket.on('channel:typing:update', onChannelTypingUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message:receive', onGlobalMessageReceive);
      socket.off('channel:message:receive', onChannelMessageReceive);
      socket.off('dm:message:receive', onDmMessageReceive);
      socket.off('presence:update', onPresenceUpdate);
      socket.off('typing:update', onGlobalTypingUpdate);
      socket.off('dm:typing:update', onDmTypingUpdate);
      socket.off('channel:typing:update', onChannelTypingUpdate);
      disconnectSocket();
    };
  }, [user, activeContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers, activeContext]);

  // Actions
  const handleStartDM = async (targetUserId, targetUsername) => {
    try {
      const res = await api.post(`/dms/${targetUserId}`);
      setActiveContext({ type: 'dm', id: res.data._id, name: targetUsername });
    } catch (err) { console.error("Failed to start DM"); }
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (communityForm.mode === 'create') {
        res = await api.post('/communities', { name: communityForm.name });
      } else {
        res = await api.post('/communities/join', { inviteCode: communityForm.inviteCode });
      }
      
      const newCommunities = await api.get('/communities');
      setCommunities(newCommunities.data);
      setShowCommunityModal(false);
      setCommunityForm({ name: '', inviteCode: '', mode: 'create' });
      
      const joinedComm = newCommunities.data.find(c => c._id === res.data._id);
      if (joinedComm) {
          joinedComm.channels.forEach(ch => socket.emit("channel:join", { channelId: ch._id }));
          setActiveContext({ type: 'channel', id: joinedComm.channels[0]._id, name: joinedComm.channels[0].name, communityId: joinedComm._id });
      }
    } catch (err) { alert(err.response?.data?.error || "Error"); }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    if (e.target.value.trim().length > 0) {
      if (activeContext.type === 'channel' && activeContext.id === 'general') socket.emit('typing:start');
      else if (activeContext.type === 'channel') socket.emit('channel:typing:start', { channelId: activeContext.id });
      else socket.emit('dm:typing:start', { dmId: activeContext.id });

      typingTimeoutRef.current = setTimeout(() => {
        if (activeContext.type === 'channel' && activeContext.id === 'general') socket.emit('typing:stop');
        else if (activeContext.type === 'channel') socket.emit('channel:typing:stop', { channelId: activeContext.id });
        else socket.emit('dm:typing:stop', { dmId: activeContext.id });
      }, 2000);
    } else {
      if (activeContext.type === 'channel' && activeContext.id === 'general') socket.emit('typing:stop');
      else if (activeContext.type === 'channel') socket.emit('channel:typing:stop', { channelId: activeContext.id });
      else socket.emit('dm:typing:stop', { dmId: activeContext.id });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (activeContext.type === 'channel' && activeContext.id === 'general') {
      socket.emit('message:send', { content: message });
      socket.emit('typing:stop');
    } else if (activeContext.type === 'channel') {
      socket.emit('channel:message:send', { content: message, channelId: activeContext.id });
      socket.emit('channel:typing:stop', { channelId: activeContext.id });
    } else {
      socket.emit('dm:message:send', { content: message, dmId: activeContext.id });
      socket.emit('dm:typing:stop', { dmId: activeContext.id });
    }

    setMessage('');
    setShowEmojiPicker(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
  };

  const activeCommunity = communities.find(c => c._id === activeContext.communityId);

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden font-sans">
      
      {/* 1. Far Left Rail - Server Hub */}
      <div className="w-[72px] bg-bg-sidebar flex flex-col items-center py-4 gap-4 overflow-y-auto no-scrollbar border-r border-border">
        <div 
          onClick={() => setActiveContext({ type: 'channel', id: 'general', name: 'general-chat', communityId: null })}
          className={`sidebar-icon font-bold text-xl relative ${!activeContext.communityId ? 'sidebar-icon-active' : ''}`}
        >
          L
          {unreads.global && <div className="absolute top-0 right-0 w-3 h-3 bg-notification rounded-full border-2 border-bg-sidebar"></div>}
        </div>
        <div className="w-8 h-[2px] bg-divider rounded-full"></div>
        
        {/* Communities */}
        {communities.map((comm) => (
           <div 
             key={comm._id}
             onClick={() => setActiveContext({ type: 'channel', id: comm.channels[0]?._id, name: comm.channels[0]?.name, communityId: comm._id })}
             className={`sidebar-icon font-bold text-lg ${activeContext.communityId === comm._id ? 'sidebar-icon-active' : ''}`}
             title={comm.name}
           >
             {comm.name[0].toUpperCase()}
           </div>
        ))}

        {/* Add Community */}
        <div 
          onClick={() => setShowCommunityModal(true)}
          className="sidebar-icon cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Secondary Sidebar - Channels / DMs */}
      <div className="w-64 bg-bg-secondary border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-4 font-bold border-b border-border text-text-primary">
          {activeCommunity ? activeCommunity.name : 'Lescht Hub'}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {activeCommunity ? (
            // Render Community Channels
            <div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-2">Text Channels</div>
              {activeCommunity.channels.map(ch => (
                 <div 
                   key={ch._id}
                   onClick={() => setActiveContext({ type: 'channel', id: ch._id, name: ch.name, communityId: activeCommunity._id })}
                   className={`chat-item ${activeContext.id === ch._id ? 'chat-item-active' : ''}`}
                 >
                   <Hash className="w-5 h-5 opacity-70" />
                   <span className={`font-medium text-sm flex-1 truncate ${unreads.channels[ch._id] ? 'text-primary font-bold' : ''}`}>{ch.name}</span>
                   {unreads.channels[ch._id] > 0 && (
                     <div className="bg-notification text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                       {unreads.channels[ch._id]}
                     </div>
                   )}
                 </div>
              ))}
              
              <div className="mt-8 px-3 py-3 bg-bg-main rounded-md border border-border">
                <div className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-bold">Invite Code</div>
                <div className="font-mono text-primary select-all text-sm font-semibold">{activeCommunity.inviteCode}</div>
              </div>
            </div>
          ) : (
            // Render Global / DMs
            <>
              <div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-2">Channels</div>
                <div 
                  onClick={() => setActiveContext({ type: 'channel', id: 'general', name: 'general-chat', communityId: null })}
                  className={`chat-item ${activeContext.id === 'general' ? 'chat-item-active' : ''}`}
                >
                  <Hash className="w-5 h-5 opacity-70" />
                  <span className={`font-medium text-sm flex-1 ${unreads.global ? 'text-primary font-bold' : ''}`}>general-chat</span>
                  {unreads.global && <div className="w-2 h-2 bg-notification rounded-full"></div>}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-2">Direct Messages</div>
                {users.map(u => (
                  <div 
                    key={u._id}
                    onClick={() => handleStartDM(u._id, u.username)}
                    className={`chat-item ${activeContext.name === u.username ? 'chat-item-active' : ''}`}
                  >
                    <div className="avatar bg-text-secondary w-8 h-8 flex-shrink-0">
                      {u.username[0]}
                      <div className="avatar-status bg-status-online"></div>
                    </div>
                    <span className={`font-medium text-sm truncate flex-1 ${unreads.dms[u.username] ? 'text-primary font-bold' : ''}`}>{u.username}</span>
                    {unreads.dms[u.username] > 0 && (
                      <div className="bg-notification text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreads.dms[u.username]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Profile Area */}
        <div className="h-[72px] bg-bg-main flex items-center px-4 gap-3 border-t border-border">
          <div className="avatar bg-text-primary text-text-onPrimary">
              {user?.username?.[0]}
              <div className={`avatar-status ${isConnected ? 'bg-status-online' : 'bg-status-offline'}`}></div>
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <span className="font-bold text-sm text-text-primary truncate block">{user?.username}</span>
            <span className="text-xs text-text-muted font-mono">#{user?._id?.slice(-4)}</span>
          </div>
          <button onClick={() => dispatch(logout())} className="p-2 text-text-secondary hover:text-primary transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Main Chat Area */}
      <div className="flex-1 flex flex-col bg-bg-main min-w-0 position-relative">
        
        {/* Chat Header */}
        <div className="h-16 flex items-center px-6 border-b border-border justify-between bg-bg-main shadow-sm z-10">
          <div className="flex items-center gap-3">
            {activeContext.type === 'channel' ? <Hash className="w-5 h-5 text-text-secondary" /> : <AtSign className="w-5 h-5 text-text-secondary" />}
            <h2 className="font-bold text-lg text-text-primary">{activeContext.name}</h2>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-text-muted mt-10">
               {activeContext.type === 'channel' ? <Hash className="w-16 h-16 mb-4 opacity-20" /> : <AtSign className="w-16 h-16 mb-4 opacity-20" />}
               <h3 className="text-xl font-bold mb-2 text-text-primary">Welcome to {activeContext.name}</h3>
               <p>This is the start of the conversation.</p>
             </div>
          )}

          {messages.map((msg, idx) => {
            if (msg.isSystem) {
              return (
                <div key={idx} className="flex justify-center">
                  <span className="text-xs text-text-secondary bg-bg-secondary px-3 py-1 text-center rounded-full border border-border">
                    {msg.content}
                  </span>
                </div>
              );
            }

            const isMe = msg.author === user.username;

            return (
              <div key={idx} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="avatar bg-text-secondary text-text-onPrimary flex-shrink-0 mt-1" style={{width: '36px', height: '36px'}}>
                  {msg.author[0]}
                </div>
                <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-baseline gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-semibold text-xs text-text-primary">{msg.author}</span>
                    <span className="text-xs text-text-muted">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`msg ${isMe ? 'msg-sent' : 'msg-received'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator Display */}
          {typingUsers.size > 0 && (
            <div className="flex items-center gap-3 text-text-secondary text-sm italic">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="input-bar position-relative">
          <form onSubmit={handleSendMessage} className="w-full flex items-center bg-bg-secondary rounded-xl border border-border focus-within:border-primary transition-colors overflow-visible relative">
            <button 
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 text-text-secondary hover:text-primary transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-50">
                <EmojiPicker 
                  onEmojiClick={onEmojiClick} 
                  theme="light"
                  skinTonesDisabled
                  searchDisabled={false}
                />
              </div>
            )}

            <input 
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder={`Message ${activeContext.type === 'channel' ? '#' : '@'}${activeContext.name}`}
              className="flex-1 bg-transparent border-none px-2 py-3 text-text-primary focus:outline-none placeholder-text-muted text-sm z-10"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="p-3 text-primary hover:text-primary-hover disabled:text-text-muted disabled:cursor-not-allowed transition-colors relative z-10"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Community Creation Modal */}
      {showCommunityModal && (
        <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md bg-bg-main border-none">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Add a Server</h2>
              <button onClick={() => setShowCommunityModal(false)} className="text-text-muted hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex gap-3 mb-6 bg-bg-sidebar p-1 rounded-xl">
              <button 
                onClick={() => setCommunityForm({ ...communityForm, mode: 'create' })}
                className={`flex-1 py-2 text-sm rounded-lg font-semibold transition-all ${communityForm.mode === 'create' ? 'bg-bg-main text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Create
              </button>
              <button 
                onClick={() => setCommunityForm({ ...communityForm, mode: 'join' })}
                className={`flex-1 py-2 text-sm rounded-lg font-semibold transition-all ${communityForm.mode === 'join' ? 'bg-bg-main text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Join
              </button>
            </div>

            <form onSubmit={handleCommunitySubmit} className="flex flex-col gap-4">
              {communityForm.mode === 'create' ? (
                <div>
                  <label className="text-xs uppercase text-text-secondary font-bold mb-1.5 block">Server Name</label>
                  <input 
                    required
                    type="text" 
                    value={communityForm.name}
                    onChange={e => setCommunityForm({...communityForm, name: e.target.value})}
                    placeholder="My Awesome Server" 
                    className="w-full bg-bg-secondary border border-border p-3 rounded-md text-text-primary focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs uppercase text-text-secondary font-bold mb-1.5 block">Invite Code</label>
                  <input 
                    required
                    type="text" 
                    value={communityForm.inviteCode}
                    onChange={e => setCommunityForm({...communityForm, inviteCode: e.target.value})}
                    placeholder="e.g. 8f2a9b" 
                    className="w-full bg-bg-secondary border border-border p-3 rounded-md text-text-primary focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                  />
                </div>
              )}
              
              <button type="submit" className="btn btn-primary w-full mt-2 text-base py-3">
                {communityForm.mode === 'create' ? 'Create Server' : 'Join Server'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
