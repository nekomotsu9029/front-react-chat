import style from "../../static/style.module.css";

const ChatView = ({
  nickName,
  message,
  messages,
  setMenuUser,
  sendMessage,
  setMessage,
  activeInputChat,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <section className={style.msger}>
      <header className={style.msger_header}>
        <button
          className={style.btn_back}
          onClick={() => {
            setMenuUser();
          }}
        >
          Atras
        </button>
        <div className={style.msger_header_title}>{nickName}</div>
      </header>
      <div className={style.msger_chat}>
        {messages?.map((item, index) => {
          return (
            <div
              key={index}
              className={`${style.msg} ${
                item.myMessage ? style.right_msg : style.left_msg
              }`}
            >
              <div className={style.msg_bubble}>
                <div className={style.msg_info}>
                  <div className={style.msg_info_name}>{item.nickName}</div>
                  <div className={style.msg_info_time}>
                    <small>{item.currentDate}</small>
                  </div>
                </div>
                <div className={style.msg_text}>{item.message}</div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className={style.msger_inputarea}>
        {activeInputChat && (
          <>
            <input
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className={style.msger_input}
              value={message}
              placeholder="Enter your message..."
              type="text"
            />
            <button type="submit" className={style.msger_send_btn}>
              Send
            </button>
          </>
        )}
      </form>
    </section>
  );
};

export default ChatView;
