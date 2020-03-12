import styled from "styled-components";

export const ControlBarLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  min-height: 60px;

  padding: 10px;
  text-align: left;
  background-color: lightgray;
`;

export const ControlBarGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ControlBarSpacer = styled.div`
  padding-right: 10px;
`;
