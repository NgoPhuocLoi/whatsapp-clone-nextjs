import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import styled from 'styled-components';
import WhatsAppLogo from '../assets/whatsapplogo.png';

const Loading = () => {
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <Image
          src={WhatsAppLogo}
          alt="Whatsapp logo"
          height="200px"
          width="200px"
        />
      </StyledImageWrapper>

      <CircularProgress />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

export default Loading;
