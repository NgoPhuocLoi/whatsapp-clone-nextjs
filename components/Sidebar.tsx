import {
  Chat as ChatIcon,
  Logout as LogoutIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import { validate } from 'email-validator';
import { signOut } from 'firebase/auth';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../config/firebase';
import { Conversation } from '../types';
import ConversationSelect from './ConversationSelect';

const Sidebar = () => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [userEmailToChat, setUserEmailToChat] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setUserEmailToChat('');
  };

  // check if conversation already exist between the current user and recipient
  const queryGetConversationForCurrentUser = query(
    collection(db, 'conversations'),
    where('users', 'array-contains', loggedInUser?.email),
  );
  const [conversationSnapshot, __loading, __error] = useCollection(
    queryGetConversationForCurrentUser,
  );
  const isConversationAlreadyExist = (recipientEmail: string) => {
    return conversationSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail),
    );
  };

  const handleCreateConversation = async () => {
    const isInvitingSelf = userEmailToChat === loggedInUser?.email;
    if (
      !userEmailToChat ||
      isInvitingSelf ||
      isConversationAlreadyExist(userEmailToChat)
    )
      return handleClose();
    console.log(123);
    if (validate(userEmailToChat)) {
      setLoading(true);
      await addDoc(collection(db, 'conversations'), {
        users: [loggedInUser?.email, userEmailToChat],
      });
      setLoading(false);
      handleClose();
    } else console.log('Invalid email');
  };
  return (
    <>
      <StyledContainer>
        <StyledHeader>
          <Tooltip title={loggedInUser?.email as string} placement="right">
            <StyledUserAvatar src={loggedInUser?.photoURL || ''} />
          </Tooltip>
          <div>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </div>
        </StyledHeader>
        <StyledSearch>
          <SearchIcon />
          <StyledSearchInput placeholder="Search in conversation" />
        </StyledSearch>
        <StyledSidebarButton onClick={() => setOpenDialog(true)}>
          Start a new conversation
        </StyledSidebarButton>

        {conversationSnapshot?.docs.map((conversation) => (
          <ConversationSelect
            id={conversation.id}
            key={conversation.id}
            conversationUsers={conversation.data().users}
          />
        ))}
      </StyledContainer>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Create new conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter an email to create new conversation!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={userEmailToChat}
            onChange={(e) => setUserEmailToChat(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              disabled={!userEmailToChat}
              onClick={handleCreateConversation}
            >
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  height: 80px;
  padding: 15px;
  border-bottom: 1px solid whitesmoke;
`;
const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
`;
const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;
const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

export default Sidebar;
