import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Styled from './styles';

const HostOrJoin = () => {
  const history = useHistory();
  return (
    <>
      <div style={{ padding: '3rem' }}>Welcome boiii</div>
      <div>
        <Styled.BubblyBtn onClick={() => history.push('/create-lobby')}>Host game</Styled.BubblyBtn>
      </div>
      <div>
        <Styled.BubblyBtn onClick={() => history.push('/join-lobby')}>Join game</Styled.BubblyBtn>
      </div>
    </>
  );
};

export default HostOrJoin;
