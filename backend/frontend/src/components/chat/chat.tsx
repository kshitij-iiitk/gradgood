"use client";

import MessageContainer from "../messages/MessageContainer";

const Chat = () => {

  return (
    <div className="flex flex-col flex-1 h-[90vh] lg:h-[97vh]">
      <MessageContainer />
    </div>
  );
};

export default Chat;
