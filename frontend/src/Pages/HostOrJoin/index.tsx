import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Styled from './styles';

const HostButton = (props: {name: string}) => {
  const history = useHistory();
  return (
    <div>
      <Styled.BubblyBtn onClick={() => history.push('/create-lobby')}>Host game</Styled.BubblyBtn>
    </div>
  )
}
const JoinButton = (props: {name: string}) => {
  const history = useHistory();
  return (
    <div>
      <Styled.BubblyBtn onClick={() => history.push('/join-lobby')}>Join game</Styled.BubblyBtn>
    </div>
  )
}

const HostOrJoin = () => {
  const history = useHistory();
  return (
    <>
      <div style={{ padding: '3rem' }}>Welcome boiii</div>
      <HostButton name={"hostbutton"}/>
      <JoinButton name={"joinbutton"}/>
    </>
  );
};

export default HostOrJoin;
