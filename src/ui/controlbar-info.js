import React from "react";
import styled from "styled-components";

import { StateContext } from "../core/context";

import { ControlBarGroup, ControlBarSpacer } from "./controlbar";

const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 0 10px;
  height: 40px;

  color: white;

  background-color: gray;
  border-radius: 5px;
`;

const InfoGlyphBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 0 10px;
  height: 40px;

  color: white;

  background-color: gray;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const InfoSvgBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: lightblue;
  width: 40px;
  height: 40px;

  padding: 5px;

  border: 2px solid gray;
  border-left: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export function InfoGroup() {
  const [{ inferenceGlyphRecord }] = React.useContext(StateContext);

  if (!inferenceGlyphRecord) return <ControlBarGroup />;

  const adjustedSvg = inferenceGlyphRecord.svg.replace(/50px/g, "30px");
  let modelNameAndSuffix = inferenceGlyphRecord.sourceModelName;
  if (!!inferenceGlyphRecord.sourceModelSuffix)
    modelNameAndSuffix = `${modelNameAndSuffix}_${inferenceGlyphRecord.sourceModelSuffix}`;

  return (
    <ControlBarGroup>
      {!!inferenceGlyphRecord.sourceModelName && (
        <>
          <InfoBox>{modelNameAndSuffix}</InfoBox>
          <ControlBarSpacer />
        </>
      )}
      {!!inferenceGlyphRecord.sourceFontName && (
        <>
          <InfoBox>{inferenceGlyphRecord.sourceFontName}</InfoBox>
          <ControlBarSpacer />
        </>
      )}
      {!!inferenceGlyphRecord.glyph && (
        <>
          <InfoGlyphBox>{inferenceGlyphRecord.glyph}</InfoGlyphBox>
          <InfoSvgBox dangerouslySetInnerHTML={{ __html: adjustedSvg }} />
        </>
      )}
    </ControlBarGroup>
  );
}
