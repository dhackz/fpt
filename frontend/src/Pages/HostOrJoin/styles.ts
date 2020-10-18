import styled from 'styled-components';

export const BubblyBtn = styled.button`
  display: inline-block;
  font-size: 1em;
  padding: 1em 2em;
  margin-bottom: 2rem;
  width: 200px;
  -webkit-appearance: none;
  appearance: none;
  background-color: #5ebd02;
  color: #fff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
  box-shadow: 0 2px 25px rgba(255, 255, 255, 0.4);

  &:focus {
    outline: 0;
  }

  &:active {
    transform: scale(0.9);
    background-color: #5ebd02;
    box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
  }
`;
