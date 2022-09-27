import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useRecipient } from '../hooks/userRecipient';
import { Conversation } from '../types';
import RecipientAvatar from './RecipientAvatar';

interface Props {
  id: string;
  conversationUsers: Conversation['users'];
}

const ConversationSelect = ({ id, conversationUsers }: Props) => {
  const { recipientEmail, recipient } = useRecipient(conversationUsers);
  const router = useRouter();

  const handleSelectConversation = () => {
    router.push(`/conversations/${id}`);
  };
  return (
    <StyledContainer onClick={handleSelectConversation}>
      <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
      <span>{recipientEmail}</span>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;

  :hover {
    background-color: #e9eaeb;
  }
`;

export default ConversationSelect;
