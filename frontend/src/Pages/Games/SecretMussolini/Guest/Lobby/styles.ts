import styled from 'styled-components';

export const Fullscreen = styled.div`
  position: absolute;
  padding: 0;
  margin: 0;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  background: rgba(239, 0, 0, 1);

  z-index: -10;
`;

export const HostTitle = styled.div`
  color: white;
  position: absolute;
  top: 6vw;
  left: 6vw;
  font-size: 3.5vw;
  transform: rotate(-20deg);
`;

export const HostCode = styled.div`
  color: white;
  position: absolute;
  top: 6vw;
  right: 6vw;
  font-size: 3vw;
  transform: rotate(20deg);
`;

export const ClientText = styled.div`
  color: white;
  font-size: 3.5vw;
`;

export const SmallText = styled.div`
  color: white;
  font-size: 2.5vw;
`;

export const BackgroundCircle = styled.div`
  border-radius: 50%;
  background-color: white;
  width: 26vw;
  height: 26vw;
  position: fixed;
  top: 50%;
  left: 50%;
  webkittransform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  color: white;
`;

export const StartButton = styled.button`
  padding: 1vw;
  font-size: 2vw;
  position: absolute;
  bottom: 1vw;
  width: 20vw;
  margin-left: -10vw;
  cursor: pointer;
  background: linear-gradient(to right, red, #4ca2cb) !important;
  text-align: center;
  text-transform: uppercase;

  color: white !important;
  text-transform: uppercase;
  background: #ffffff;
  padding: 20px;
  border: 4px solid white !important;
  border-radius: 6px;
  display: inline-block;
  transition: all 0.3s ease 0s;

  &:hover {
    color: white !important;
    border-radius: 50px;
    transition: all 0.3s ease 0s;
    border-color: white !important;
  }

  &:focus {
    outline: 0;
  }
`;
