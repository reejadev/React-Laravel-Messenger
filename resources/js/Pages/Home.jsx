import ChatLayout from '@/Layouts/ChatLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useRef, useEffect, useState, useCallback } from 'react';
import MessageItem from '@/Components/App/MessageItem';
import ConversationHeader from '@/Components/App/ConversationHeader';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import MessageInput from '@/Components/App/MessageInput';
import { useEventBus } from '@/EventBus';
import axios from 'axios';

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const loadMoreIntersect = useRef(null);
    const messagesCtrRef = useRef(null);
    const {on} = useEventBus();


    const messageCreated = (message) => {
        console.log('New message received:', message);
    
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            console.log('Adding message to group:', selectedConversation.id);
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id || 
                selectedConversation.id == message.receiver_id)
        ) {
            console.log('Adding message to user conversation:', selectedConversation.id);
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    };

const loadMoreMessages = useCallback(() => {

if(noMoreMessages){
    return;
}

    const firstMessage = localMessages[0];
    axios
        .get(route("message.loadOlder", firstMessage.id))
        .then((data) => {
            if (data.data.length === 0){
                setNoMoreMessages(true);
                return;
            }

            const scrollHeight = messagesCtrRef.current.scrollHeight;
            const scrollTop = messagesCtrRef.current.scrollTop;
            const clientHeight = messagesCtrRef.current.clientHeight;
            const tmpScrollFromBottom = scrollHeight-scrollTop-clientHeight;
            console.log("tmpScrollFromBottom", tmpScrollFromBottom);
            setScrollFromBottom(scrollHeight-scrollTop-clientHeight);

            setLocalMessages((prevMessages) => {
                return [...data.data.reverse(), ...prevMessages];
            });
        });
}, [localMessages, noMoreMessages]);

    useEffect(() => {
        setTimeout(() => {
            if(messagesCtrRef.current){
            messagesCtrRef.current.scrollTop = 
            messagesCtrRef.current.scrollHeight;
            }
        }, 10);

       const offCreated = on('message.created', messageCreated);

       setScrollFromBottom(0);
       setNoMoreMessages(false);

       return() =>{
        offCreated();
       };  
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);


    useEffect(() => {

        if(messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop = 
            messagesCtrRef.current.scrollHeight -
            messagesCtrRef.current.offsetHeight -
            scrollFromBottom;
        }
        if (setNoMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => 
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
                {
                    rootMargin: "0px 0px 250px 0px",
                }
        );

        if(loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);

            },100);
        }

        return() => {
            observer.disconnect();
        };

    }, [localMessages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select a conversation to see the messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}
            {messages && (
                <div className="flex flex-col h-full">
                    <ConversationHeader selectedConversation={selectedConversation} />
                    <div ref={messagesCtrRef} className="flex-1 overflow-y-auto p-5">
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">No messages found</div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                <div ref = {loadMoreIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem key={message.id} message={message} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-auto">
                        <MessageInput conversation={selectedConversation} />
                    </div>
                </div>
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout>{page}</ChatLayout>
        </AuthenticatedLayout>
    );
};

export default Home;
