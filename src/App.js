import { store } from './stateManagement/store';
import { sendTestSocket } from './socketService';
import React, { useState, useContext, useEffect } from 'react';
import { activeChatAction, userDetailAction } from './stateManagement/actions';

const SimpleMessage = () => {

  const [name, setName] = useState('');
  const [ showMessage, setShowMessage ] = useState(false);

  const { dispatch } = useContext(store)

  const onsubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: userDetailAction,
      payload: name
    });
    setShowMessage(true);
  }

  return(
    <>
      {!showMessage ? (
        <div>
          <h3>Hello, Enter Name</h3>
          <form onSubmit={onsubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button>sibmit</button>
          </form>
        </div>
      ) : (
        <MessageInterface/>
      )}
    </>
  )
}

export default SimpleMessage;

const MessageInterface = (props) => {
  const [name, setName] = useState('');
  const [ message, setMessage ] = useState('');
  const [ receiver, setReceiver ] = useState('');
  const [ messages, setMessages ] = useState([]);
  const { state:{userDetail, activeChat}, dispatch} = useContext(store);

  useEffect(() => {
    if(name !== userDetail){
      setName(userDetail)
    }
    if(activeChat){
      setMessages([...messages, activeChat]);
      dispatch({
        type: activeChatAction,
        payload: null
      });
    }
  }, [userDetail, activeChat]);

  const submit = e => {
    e.preventDefault();
    let data = {
      sender: name,
      receiver,
      message,
    };
    setMessages([...messages, data]);
    sendTestSocket(data);
    // console.log(data);
  };

  return(
    <div>
      <h2>Hello, {name}</h2>
      <form onSubmit={submit}>
        <input placeholder='Enter Receiver Name' value={receiver} onChange={(e) => setReceiver(e.target.value)}/>
        <br/>
        <textarea placeholder='Start typing' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
        <button type='submit'>send</button>
      </form>
      <br/>
      {
        messages.length < 1 ? (
          <div>No message yet </div>
        ) : (
          messages.map((item, index) => {
            return(
              <div key={index}>
                <b>{item.message}</b>
                <br/>
                <small>{item.sender}</small>
                <hr/>
              </div>
            );
          })
        )
      }
    </div>
  )
}
