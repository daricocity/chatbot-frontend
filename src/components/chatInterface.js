import moment from 'moment';
import Loader from './loader';
import menu from "../assets/menu.svg";
import send from "../assets/send.png";
import smiley from "../assets/smiley.png";
import favorite from "../assets/star.png";
import settings from "../assets/settings.png";
import { store } from '../stateManagement/store';
import favoriteActive from "../assets/favActive.png";
import { ChatBubble, UserAvatar } from './homeComponent';
import React, { useState, useEffect, useContext } from 'react';
import { axiosHandler, errorHandler, getToken } from '../helper';
import { activeChatAction, triggerRefreshUserListAction } from '../stateManagement/actions';
import { MESSAGE_URL, CHECK_FAVORITE_URL, UPDATE_FAVORITE_URL, READ_MESSAGE_URL } from '../urls';

let goneNext = false;

function ChatInterface(props) {
    const [ message, setMessage ] = useState("");
    const [ messages, setMessages ] = useState([]);
    const [ fetching, setFetching ] = useState(true);
    const [ nextPage, setNextPage ] = useState(1);
    const [ canGoNext, setCanGoNext ] = useState(false);
    const [ isFavorite, setIsFavorite ] = useState(false);
    const [shouldHandleScroll, setShouldHandleScroll] = useState(false);

    const { state:{ activeChat }, dispatch } = useContext(store);

    const checkIsFav = async () => {
        const token = await getToken();
        const result = await axiosHandler({
            method: "get",
            url: CHECK_FAVORITE_URL + props.activeUser.user.id,
            token
        }).catch(e => console.log(errorHandler(e)));
        if(result){
            setIsFavorite(result.data);
        }
    }

    // Get messages from backend
    const getMessages = async (append=false, page) => {
        setCanGoNext(false);
        const token = await getToken();
        const result = await axiosHandler({
            method: "get",
            url: MESSAGE_URL + `?user_id=${props.activeUser.user.id}&page=${page ? page : nextPage}`,
            token
        }).catch(e => console.log(errorHandler(e)));
        if(result){
            if(append){
                setMessages(...result.data.results.reverse(), ...messages);
                goneNext = false;
            } else {
                setMessages(result.data.results.reverse());
            }

            // Checking unread messages
            const messages_not_read = []
            result.data.results.map(item => {
                if(item.is_read) return null
                if(item.receiver.user.id === props.loggedUser.user.id){
                    messages_not_read.push(item.id)
                    // updateMessage(item.id);
                };
                return null
            });

            if(messages_not_read.length > 0){
                updateMessage(messages_not_read)
            }

            // Paginating message
            if(result.data.next){
                setCanGoNext(true);
                setNextPage(nextPage + 1);
            }
            setFetching(false)
            if(!append){
                scrollToBottom();
                setTimeout(() => setShouldHandleScroll(false), 1000);
            };
        }
    }

    // update message to mark that message is read
    const updateMessage = async (message_ids) => {
        const token = await getToken();
        axiosHandler({
            method: "post",
            url: READ_MESSAGE_URL,
            token,
            data: {message_ids},
        });
        dispatch({
            type: triggerRefreshUserListAction, 
            payload: true
        });
    };

    const reset = () => {
        setMessages([])
        setFetching(true)
        setCanGoNext(false)
    }

    useEffect(() => {
        reset()
        getMessages(false, 1);
        checkIsFav();
    }, [props.activeUser])

    // Update Favorite
    const updateFav = async () => {
        setIsFavorite(!isFavorite);
        const token = await getToken();
        const result = await axiosHandler({
            method: "post",
            url: UPDATE_FAVORITE_URL,
            data: {favorite_id: props.activeUser.user.id},
            token
        }).catch(e => console.log(errorHandler(e)));
        if(!result){
            setIsFavorite(!isFavorite);
        }
    }

    useEffect(() => {
        if(activeChat){
            getMessages();
            dispatch({
                type: activeChatAction,
                payload: null
            });
        };
    }, [activeChat])

    const submitMessage = async (e) => {
        e.preventDefault();
        let data = {
            sender_id: props.loggedUser.user.id,
            receiver_id: props.activeUser.user.id,
            message,
        };
        const lastIndex = messages.length;
        setMessages([...messages, data]);
        setMessage("");
        
        // Send message to backend
        const token = await getToken();
        const result = await axiosHandler({
            method: "post",
            url: MESSAGE_URL,
            token,
            data
        }).catch(e => console.log(errorHandler(e)));

        // Update the message on frontend
        if(result){
            messages[lastIndex] = result.data
            setMessages(messages)
            scrollToBottom()
        }

    };

    const handleBubbleType = (item) => {
        if(item.sender_id) return "sender"
        if(item.sender.user.id === props.loggedUser.user.id) return "sender"
        else return ""
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            let chatArea = document.getElementById('chatArea');
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 300);
    }

    const handleScroll = (e) => {
        if(!shouldHandleScroll)return;
        if(e.target.scrollTop <= 100){
            if(canGoNext && !goneNext){
                goneNext = true;
                getMessages(true);
            };
        };
    };

    return (
        <>
            <div className="flex align-center justify-between heading">
                <div className="flex align-center">
                    <div className="mobile">
                        <img src={menu} alt="" onClick={props.toggleSideBar} alt="menpics"/>&nbsp;&nbsp;
                    </div>
                    <UserAvatar 
                        name={`${props.activeUser.first_name || ""} ${props.activeUser.last_name || ""}`} 
                        profilePicture={props.activeUser.profile_picture ? props.activeUser.profile_picture.file_upload : ""} 
                        caption={props.activeUser.caption}
                    />
                </div>
                <div className="flex align-center rightItems">
                    <img src={isFavorite ? favoriteActive : favorite} onClick={updateFav} alt="favpics" />
                    <img src={settings} onClick={() => props.setShowProfileModal(true)} alt="settipics" />
                </div>
            </div>
            <div className="chatArea" id="chatArea" onScroll={handleScroll}>
                {fetching ? (
                    <center> <Loader/> </center>
                ) : (
                    messages.length < 1 ? (
                        <div className="noUser">No message yet</div>
                    ) : (
                        messages.map((item, ind) => (
                            <ChatBubble 
                                key={ind} 
                                message={item.message}
                                bubbleType={handleBubbleType(item)} 
                                time={item.created_at ? moment(item.created_at).format('YYYY-MM-DD hh:mm a') : ""}
                            />
                        ))
                    )
                )}
            </div>
            <form onSubmit={submitMessage} className="messageZone">
                <div className="flex align-center justify-between topPart">
                    <img src={smiley} alt="smilpics"/>
                    <button type="submit"><img className="sendButton" src={send} alt="sendipics" /></button>
                </div>
                <input 
                    placeholder="Type your message here... "
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
            </form>
        </>
    )
}

export default ChatInterface

// update message to mark that message is read
// const updateMessage = async (message_id) => {
//     const token = await getToken();
//     axiosHandler({
//         method: "patch",
//         url: MESSAGE_URL+`/${message_id}`,
//         token,
//         data: {is_read: true},
//     })
// };
