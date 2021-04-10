import menu from "../assets/menu.svg";
import close from "../assets/close.svg";
import Loader from "../components/loader";
import logoutPng from "../assets/logout.png";
import settings from "../assets/settings.png";
import UsersList from "../components/usersList";
import { store } from '../stateManagement/store';
import { logout } from "../components/authController";
import ChatInterface from "../components/chatInterface";
import React, { useState, useContext, useEffect } from 'react';
import { UserAvatar, ProfileModal } from '../components/homeComponent';

const Home = (props) => {
    const [ userdetail, setUserDetail ] = useState(null);
    const [ activeUser, setActiveUser ] = useState(null);
    const [ showProfile, setShowProfile ] = useState(false);
    const [ profileClosable, setProfileClosable] = useState(true);
    const [ showProfileModal, setShowProfileModal ] = useState(false);
    const { state: {userDetail, activeChatUser} } = useContext(store);

    useEffect(() => {
        // User profile
        if(userDetail !== userdetail){
            setUserDetail(userDetail);
            if(!userDetail.first_name){
                setShowProfile(true);
                setProfileClosable(false);
            }
        }

        // Active user
        if(activeUser !== activeChatUser){
            setActiveUser(activeChatUser);
            closeSideBar();
        }
    }, [userDetail, activeChatUser]);

    if(!userdetail){
        return(
            <div className="centerAll">
                <Loader/>
            </div>
        )
    }

    const toggleSideBar = () => {
        const sideBar = document.getElementById("sideBar")
        if(sideBar.classList.contains("close")){
            sideBar.classList.remove("close")
        }
        else{
            sideBar.classList.add("close")
        }
    }
    
    const closeSideBar = () => {
        const sideBar = document.getElementById("sideBar")
        if(!sideBar.classList.contains("close")){
            sideBar.classList.add("close")
        }
    }
    
    return(
        <>
            <ProfileModal 
                {...props}
                close={() => setShowProfile(false)} 
                visible={showProfile} 
                closable={profileClosable} 
                userDetail={userdetail}
                setClosable={() => setProfileClosable(true)}
            />

            {activeUser && (
                <ProfileModal 
                    {...props}
                    close={() => setShowProfileModal(false)} 
                    visible={showProfileModal} 
                    closable={true} 
                    userDetail={activeChatUser}
                    setClosable={() => null}
                    view
                />
            )}
            
            <div className="home-container">
                <div className="side close" id="sideBar">
                    <div className="flex align-center justify-between top">
                        <UserAvatar 
                            noStatus 
                            isV2 
                            name={`${userdetail.first_name || ""} ${userdetail.last_name || ""}`} 
                            profilePicture={userdetail.profile_picture ? userdetail.profile_picture.file_upload : ""}
                        />
                        <div>
                            <img src={settings} onClick={() => {setShowProfile(true); closeSideBar(); }} />
                            <div className="mobile">
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <img src={close} alt="" onClick={toggleSideBar} style={{width:15}}/>
                            </div>
                        </div>
                    </div>
                    <UsersList/>
                    <div className="logout" onClick={() => logout(props)}>
                        <img src={logoutPng} />
                        <div> Logout </div>
                    </div>
                    <div className="colorChange">
                        <img src={settings} />
                        <div> Dark </div>
                    </div>
                </div>
                <div className="mobile overlay" onClick={toggleSideBar}/>
                <div className="main">
                    {activeUser ? (
                        <ChatInterface activeUser={activeUser} loggedUser={userdetail} showProfileModal={showProfileModal} setShowProfileModal={setShowProfileModal} toggleSideBar={toggleSideBar} />
                    ) : (
                        <div>
                            <div className="heading mobile">
                                <div style={{height:"100%"}} className="flex align-center">
                                    <img src={menu} alt="" onClick={toggleSideBar}/>&nbsp;&nbsp;
                                </div>
                            </div>
                            <div className="noUser">Click on a user to start chat</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;
