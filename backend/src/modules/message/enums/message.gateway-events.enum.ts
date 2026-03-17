export enum ENUM_MESSAGE_GW_EVENTS {
  // Client -> Server
  JOIN_CONVERSATION = 'joinConversation',
  SEND_MESSAGE = 'sendMessage',
  READ_MESSAGE = 'readMessage',
  TYPING = 'typing',

  // Server -> Client
  JOINED_CONVERSATION = 'joinedConversation',
  NEW_MESSAGE = 'newMessage',
  TYPING_STATUS = 'typingStatus',
  MESSAGE_READ = 'messageRead',
  USER_STATUS = 'userStatus',
  ERROR = 'error',
}
