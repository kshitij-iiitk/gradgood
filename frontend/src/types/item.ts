export interface Item {
  _id: string;
  itemName: string;
  belongTo: {
    _id: string;
    email: string;
  };
  userName: string;
  phoneNumber: string;
  photo: string[];
  price: number;
  gPayID:string;
  
  description: string;
  sold: boolean;
  createdAt?: string;
  updatedAt?: string;
}
