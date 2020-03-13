import styled from "styled-components";

export const LoadingCover = styled.div`
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;

  font-size: 36px;
  line-height: 36px;

  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
  opacity: 0.75;
  z-index: 1000;
`;

export const LoadingText = styled.div`
    padding: 30px;
    border: 3px solid white;
`;
