// import { useSocketContext } from "../context/SocketContext";
// import useConversation from "../zustand/useConversation";
// import { useEffect } from "react";

// import    noficationsound from "./../assets/sounds/notification.mp3"

// const useListenMessages = () => {
//   const { socket } = useSocketContext();
//   const { message, setMessage } = useConversation();
//   useEffect(() => {
//     if (!socket) return;
//     const handleNewMessage = (newMessage) => {
//       newMessage.ShouldShake = true
//       const sound= new Audio(noficationsound);
//       sound.play();
//       setMessage([...message, newMessage]);
//     };
//     socket?.on("newMessage", handleNewMessage);
//     return () => {
//       socket.off("newMessage");
//     };
//   }, [socket, message, setMessage]);
// };

// export default useListenMessages;
