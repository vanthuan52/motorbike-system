export enum EnumMessageGwEvents {
  // Client → Server
  joinConversation = 'joinConversation',
  leaveConversation = 'leaveConversation',
  sendMessage = 'sendMessage',
  readMessage = 'readMessage',
  typing = 'typing',
  deleteMessage = 'deleteMessage',
  unsendMessage = 'unsendMessage',

  // Server → Client
  joinedConversation = 'joinedConversation',
  newMessage = 'newMessage',
  typingStatus = 'typingStatus',
  messageRead = 'messageRead',
  messageDelivered = 'messageDelivered',
  messageDeleted = 'messageDeleted',
  messageUnsent = 'messageUnsent',
  userStatus = 'userStatus',
  error = 'error',
}
