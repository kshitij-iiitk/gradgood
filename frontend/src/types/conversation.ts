import { type Message } from "./message";

export interface Conversation {
  _id: string;
  participants: {
    userName: any;
    email: any;
    _id: string;
    profilePic:string;
    upiId:string;
  }[];
  messages: Message[];
  createdAt?: string;
  updatedAt?: string;
}
