import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 as uuidv4} from 'uuid';
import UserAvatar from "./UserAvatar";

export default function NewMessageNotification({}) {
    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();

    useEffect(() => {
      const handleNewMessageNotification = ({ message, user, group_id }) => {
        const uuid = uuidv4();
    
        setToasts((oldToasts) => [...oldToasts, { message, uuid, user, group_id }]);
    
        setTimeout(() => {
          setToasts((oldToasts) => oldToasts.filter((toast) => toast.uuid !== uuid));
        }, 5000);
      };
    
      const unsubscribe = on("newMessageNotification", handleNewMessageNotification);
    
      // Cleanup the event listener on component unmount
      return () => {
        unsubscribe && unsubscribe();
      };
    }, []); // Empty dependency array if `on` is stable
    

    return (

<div className="toast toast-top toast-center min-w-[280px]">
  {toasts.map((toast, index) => (
    <div 
    key={toast.uuid} 
    className="alert alert-success py-3 px-4 text-gray-100 rounded-md ">
    
  <Link href={
    toast.group_id
         ? route('chat.group', toast.group_id) 
         :route('chat.user', toast.user.id) 
  }
  className="flex items-center gap-2"
  >
  <UserAvatar user={toast.user}/>
  <span>{toast.message}</span>
  </Link>
  </div>
  ))}
</div>
   
    );
}