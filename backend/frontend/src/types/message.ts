
export interface Message {
  _id: string;
  senderId: {
    profilePic: string;
    _id: string;
    userName?: string; 
  };
  receiverId: {
  profilePic?: string;
    _id: string;
    userName?: string;
  };
  conversationId:string,
  message: string;
  createdAt?: string;
  updatedAt?: string;
}
