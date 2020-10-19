import styled, { keyframes } from 'styled-components';

const spin = keyframes`
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  animation: ${spin} 2s linear infinite;
  vertical-align: center;
  margin: 1rem auto;

  border: 8px solid #f3f3f3;
  border-top: 8px solid #555;
  border-bottom: 8px solid #555;
  border-radius: 50%;
  width: 50px;
  height: 50px;
`;
