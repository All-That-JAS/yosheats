import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Chatroom(props) {
  const { text, uid, photoURL } = props.message;
  const { currentUser } = useAuth();

  const messageClass = uid === currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      {/* {!currentUser.photoURL ? null : <img src={photoURL} alt='user' />} */}
  
      {/* <p>{text.map(txt => (<>{txt}</>))}</p> */}
      <p>{text}</p>
      {!currentUser.displayName ? null : currentUser.displayName }
    </div>
  );
}
