import React from "react";
import styled from "styled-components";

import { StateContext } from "../core/context";

import { ControlBarGroup, ControlBarSpacer } from "./controlbar";

const InfoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0 10px;
  height: 40px;

  color: white;

  background-color: gray;
  border-radius: 5px;
`;

export function InfoGroup() {
  const [
    { modelName, modelSuffix, fontName, inferenceGlyph }
  ] = React.useContext(StateContext);

  return (
    <ControlBarGroup>
      <InfoBox>
        {modelName}_{modelSuffix}
      </InfoBox>
      <ControlBarSpacer />
      {fontName && (
        <>
          <InfoBox>{fontName}</InfoBox>
          <ControlBarSpacer />
        </>
      )}
      {inferenceGlyph && (
        <InfoBox>
          <strong>{inferenceGlyph}</strong>
        </InfoBox>
      )}
    </ControlBarGroup>
  );
}
