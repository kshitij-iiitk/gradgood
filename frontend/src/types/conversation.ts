import { type Message } from "./message";

export interface Conversation {
  _id: string;
  participants: {
    name: any;
    email: any;
    _id: string;
    userName?: string;
    profilePic:string;
  }[];
  messages: Message[];
  createdAt?: string;
  updatedAt?: string;
}
