import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import style from "../../static/style.module.css";

import ChatMessages from "../ChatMessages";
import ListUsers from "../ListUsers";

import io from "socket.io-client";

const api = "http://localhost:4000";

const socket = io(api);

const Main = () => {
  const [nickName, setNickName] = useState("");
  const [tempNickName, setTempNickName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [userNicknameSelectedchat, setUserNicknameSelectedchat] = useState("");
  const [errorUserAlreadyExists, setErrorUserAlreadyExists] = useState(false);
  const [listNewMessages, setListNewMessages] = useState([]);
  const [viewListUsers, setViewListUsers] = useState(true);

  const getListUser = () => {
    fetch(
      `${api}/listUsersConected`,

      {
        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })

      .then(({ listUsers }) => {
        setUsersOnline(listUsers);
      });
  };

  const saveInLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const addMessage = (objMessage) => {
    const tempMessages = [...messages, objMessage];
    setMessages(tempMessages);
    saveInLocalStorage("react-socket", {
      nickName,
      messages: tempMessages,
    });
  };

  const sendMessage = () => {
    const dateTemp = new Date();

    const newObjMessage = {
      nickName,
      message,
      to: userNicknameSelectedchat,
      myMessage: true,
      currentDate: dateTemp.toLocaleString(),
    };

    socket.emit("sendMessage", newObjMessage);

    addMessage(newObjMessage);
    setMessage("");
  };

  const receiveMessage = (objMessage) => {
    if (objMessage.nickName !== userNicknameSelectedchat) {
      setListNewMessages([...listNewMessages, objMessage.nickName]);
    }
    objMessage.myMessage = false;
    addMessage(objMessage);
  };

  useEffect(() => {
    socket.on(`newMessage${nickName}`, receiveMessage);
    console.log(`newMessage${nickName}`);
    return () => {
      socket.off(`newMessage${nickName}`, receiveMessage);
    };
  }, [messages, nickName]);

  useEffect(() => {
    const userAlreadyExists =
      usersOnline.filter((item) => item.nickName === nickName).length > 0;

    const nickNameVoid = nickName === "" || nickName === null;

    if (!(nickNameVoid || userAlreadyExists)) {
      socket.emit("newUser", {
        nickName,
      });
    }

    if (userAlreadyExists) {
      setErrorUserAlreadyExists(true);
      setNickName("");
    }
  }, [nickName]);

  useEffect(() => {
    socket.on("joinUser", setUsersOnline);
    return () => {
      socket.off("joinUser", setUsersOnline);
    };
  }, [usersOnline]);

  useEffect(() => {
    const retrievedMessages = JSON.parse(localStorage.getItem("react-socket"));

    getListUser();

    if (retrievedMessages) {
      setMessages(retrievedMessages?.messages);
      setNickName(retrievedMessages?.nickName);
    }
  }, []);

  return (
    <div className={style.body}>
      <ListUsers
        nickName={nickName}
        usersOnline={usersOnline}
        setViewListUsers={setViewListUsers}
        setListNewMessages={setListNewMessages}
        setUserNicknameSelectedchat={setUserNicknameSelectedchat}
        listNewMessages={listNewMessages}
        viewListUsers={viewListUsers}
      />
      <ChatMessages
        nickName={userNicknameSelectedchat}
        setMenuUser={() => {
          setViewListUsers(true);
        }}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        activeInputChat={userNicknameSelectedchat !== ""}
        messages={
          userNicknameSelectedchat !== ""
            ? messages.filter((item) => {
                return (
                  item.to === userNicknameSelectedchat ||
                  item.nickName === userNicknameSelectedchat
                );
              })
            : []
        }
      />
      <Modal show={nickName === "" || nickName === null}>
        <Modal.Header closeButton>
          <Modal.Title>Select a nickname</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2" style={{ width: "100%" }}>
            <input
              onChange={(e) => {
                setTempNickName(e.target.value);
              }}
              placeholder="your nickname"
              type="text"
            />
          </div>
          {usersOnline?.filter((item) => item.nickName === tempNickName)
            .length > 0 || errorUserAlreadyExists ? (
            <span>user already exists</span>
          ) : (
            <span>write your nickname to chat</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-grid gap-2" style={{ width: "100%" }}>
            <Button
              variant="success"
              size="lg"
              onClick={() => {
                setNickName(tempNickName);
              }}
            >
              Save Changes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Main;
