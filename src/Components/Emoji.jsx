import EmojiPicker from "emoji-picker-react";
import React from "react";

const Emoji = ({handleEmojiClick}) => {
  return (
    <div className="emojiPicker-container">
      <EmojiPicker height={350} width={300} onEmojiClick={handleEmojiClick} />
    </div>
  );
};

export default Emoji;
