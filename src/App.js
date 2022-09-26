import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
// import { doc } from 'firebase/firestore';

// ここでfirebaseSDKの設定をする
firebase.initializeApp({
  // your config
  apiKey: "AIzaSyAJp1q_-RD3OT9ISV_qJUAqaYvwJsC9JWI",
  authDomain: "fir-react-chat-project.firebaseapp.com",
  projectId: "fir-react-chat-project",
  storageBucket: "fir-react-chat-project.appspot.com",
  messagingSenderId: "1032274550727",
  appId: "1:1032274550727:web:8682ebd3877856fe0c03e2"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
//const analytics = firebase.analytics();


function App() {

  // Googleアカウントでログインするためのuserを宣言
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {/* 画面上部のアイコンとサインアウトボタンを配置 */}
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      {/* userが登録されているかどうかをチェックしsectioinを実行 */}
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}
// サインイン
function SignIn() {

  // グーグルアカウントにサインインするための関数を追加
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      {/*  */}
      <button className="sign-in" onClick={signInWithGoogle}>Googleアカウントでサインインする</button>
      <br />
      <p className='sign-in'>※サインインが完了するとチャット画面に移ります。</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser &&
    <button className="sign-out" onClick={() => auth.signOut()}>サインアウト</button>

}

function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();


    const { uid } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,

    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }


  return (
    <>
      <main>
        {messages && messages.map((msg, index) =>
          <ChatMessage
            key={index}
            message={msg} />)}

        <span ref={dummy}></span>

      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="コメントを入力" />

        <button type="submit" disabled={!formValue}>🕊️</button>
      </form>
    </>)
}


function ChatMessage(props) {
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  //テキスト送信時間を記録したい（したい）
  //const formatTime = "";
  //console.log(formatTime);
  return (
    <>
      <div className={`message ${messageClass}`} >
        {/* グーグルアイコンと入力テキストを表示する画面 */}
        {/* 今ログインしているグーグルユーザーのアイコンを引っ張ってくる */}
        {<img src={auth.currentUser.photoURL} alt="" />}
        <p>{text}
          {/* {formatTime} */}
        </p>

      </div>
    </>
  )
}


export default App;
