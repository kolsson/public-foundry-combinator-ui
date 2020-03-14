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
    rgb(96, 109, 188, 0.75),
    rgb(96, 109, 188, 0.75) 10px,
    rgb(70, 82, 152, 0.75) 10px,
    rgb(70, 82, 152, 0.75) 20px
  );

  z-index: 1000;
`;

export const LoadingText = styled.div`
  padding: 30px;
  border: 3px solid white;
`;
