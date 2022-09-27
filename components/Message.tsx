import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../config/firebase';
import { IMessage } from '../types';

interface Props {
  message: IMessage;
}

const Message = ({ message }: Props) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const MessageType =
    loggedInUser?.email === message.sent_user
      ? StyledSenderMessage
      : StyledReceiverMessage;

  return (
    <MessageType>
      {message.text}
      <StyledTimestamp>{message.sent_at}</StyledTimestamp>
    </MessageType>
  );
};

const StyledMessage = styled.p`
  width: fit-content;
  word-break: break-all;
  max-width: 90%;
  min-width: 30%;
  padding: 15px 15px 30px;
  border-radius: 10px;
  position: relative;
`;

const StyledSenderMessage = styled(StyledMessage)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const StyledReceiverMessage = styled(StyledMessage)`
  background-color: whitesmoke;
`;

const StyledTimestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: x-small;
  bottom: 0;
  right: 0;
  position: absolute;
  text-align: right;
`;

export default Message;
