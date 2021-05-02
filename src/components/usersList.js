import Loader from './loader';
import { PROFILE_URL } from '../urls';
import searchImg from "../assets/search.png";
import { UserMain } from './homeComponent';
import { store } from '../stateManagement/store';
import React, { useState, useEffect, useContext } from 'react';
import { axiosHandler, getToken, LastUserChat } from '../helper';
import { activeChatUserAction, triggerRefreshUserListAction } from '../stateManagement/actions';

let goneNext = false;

function UsersList(){
    const [ users, setUsers ] = useState([]);
    const [ fetching, setFetching ] = useState(true);
    const [ nextPage, setNextPage ] = useState(1);
    const [ search, setSearch ] = useState("");
    const [ canGoNext, setCanGoNext ] = useState(false);
    const { state:{ triggerRefreshUserList }, dispatch } = useContext(store);

    useEffect(() => {
        getUserList()
    }, [search])

    useEffect(() => {
        if(triggerRefreshUserList){
            getUserList()
            dispatch({
                type: triggerRefreshUserListAction, 
                payload: false
            })
        }
    }, [triggerRefreshUserList])

    // Get user list
    const getUserList = async (append = false) => {
        // Search
        let extra = "";
        if(search !== ""){
            extra += `&keyword=${search}`
        }
        setCanGoNext(false);
        // Get user list
        const _token = await getToken();
        const _users = await axiosHandler({
            method: "get",
            url: PROFILE_URL + `?page=${nextPage}${extra}`,
            token: _token
        }).catch((e) => null);
        if(_users){
            if(_users.data.next){
                setNextPage(nextPage + 1);
                setCanGoNext(true);
            }
            if(append){
                setUsers([...users, ..._users.data.results]);
                goneNext = false;
            } else {
                setUsers(_users.data.results);
            }
            setFetching(false);
        };
        checkLastChat(_users.data.results);
    };

    // Check last user chat history
    const checkLastChat = (users) => {
        let lastUserChat = localStorage.getItem(LastUserChat);
        if(lastUserChat){
            lastUserChat = JSON.parse(lastUserChat);
            if(users.filter(item => item.id === lastUserChat.id).length){
                // dispatch({
                //     type: activeChatUserAction,
                //     payload: lastUserChat
                // });
                setActiveUser(lastUserChat);
            };
        };
    }

    // Clickable action
    const setActiveUser = (user_data) => {
        // Set last chat user data
        localStorage.setItem(LastUserChat, JSON.stringify(user_data));
        dispatch({
            type: activeChatUserAction,
            payload: user_data
        })
    };

    const handleScroll = (e) => {
        if(e.target.scrollTop >= (e.target.scrollHeight - (e.target.offsetHeight + 200))){
            if(canGoNext && !goneNext){
                getUserList(true);
            };
        };
    };

    return(
        <div>
            <SearchDebounce setSearch={setSearch} />
            <div className="userList" onScroll={handleScroll}>
                {fetching ? (
                    <div className="centerAll"><Loader/></div>
                ) : (
                    users.length < 1 ? (
                        <div className="noUser">You don't have any user to chat with</div>
                    ) : (
                        users.map((item, ind) => (
                            <UserMain 
                                key={ind} 
                                name={`${item.first_name || ""} ${item.last_name || ""}`} 
                                profilePicture={item.profile_picture ? item.profile_picture.file_upload : ""} 
                                caption={item.caption} 
                                count={item.message_count} 
                                clickable
                                onClick={() => setActiveUser(item)}
                                lastSeen
                                isOnline={item.user.is_online}
                            />
                        ))
                    )
                )}
            </div>
        </div>
    )
};

// Search with Debounce
let debounceTimeout;
const SearchDebounce = (props) => {
    const [ search, setSearch ] = useState("");
    useEffect(() => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            props.setSearch(search);
        }, 1000);
    }, [search])
    return(
        <div className="searchCon">
            <img src={searchImg} alt="searpics" />
            <input placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
    )
}

export default UsersList;