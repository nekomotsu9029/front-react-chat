import React from "react";
import style from "../../static/style.module.css";

const ListUsers = ({
  usersOnline,
  nickName,
  listNewMessages,
  setViewListUsers,
  setListNewMessages,
  setUserNicknameSelectedchat,
  viewListUsers,
}) => {
  const thereIsAnUnreadMessage = (item) => {
    return (
      listNewMessages.filter((item2) => item2 === item.nickName).length > 0
    );
  };

  const selectAChat = (item) => {
    const userListWithoutSelectedUser = listNewMessages.filter(
      (item2) => item2 !== item.nickName
    );

    setViewListUsers(false);
    setListNewMessages(userListWithoutSelectedUser);
    setUserNicknameSelectedchat(item.nickName);
  };

  return (
    <div className={`${style.box_users} ${viewListUsers ? style.active : ""}`}>
      <strong>Users online</strong>
      <hr />
      {usersOnline
        ?.filter((itemToFilfer) => itemToFilfer.nickName !== nickName)
        .map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => {
                selectAChat(item);
              }}
              className={style.box_users_item}
            >
              {item.nickName}
              {thereIsAnUnreadMessage(item) && (
                <>
                  <br />
                  <span className={style.new_message}>new message</span>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ListUsers;
