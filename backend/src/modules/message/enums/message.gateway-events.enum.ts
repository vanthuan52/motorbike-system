export enum EnumMessageGwEvents {
  // Client -> Server
  joinConversation = 'joinConversation',
  sendMessage = 'sendMessage',
  readMessage = 'readMessage',
  typing = 'typing',

  // Server -> Client
  joinedConversation = 'joinedConversation',
  newMessage = 'newMessage',
  typingStatus = 'typingStatus',
  messageRead = 'messageRead',
  userStatus = 'userStatus',
  error = 'error',
}
