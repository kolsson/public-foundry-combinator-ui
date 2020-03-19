import React from "react";
import styled from "styled-components";

import { StateContext } from "../core/context";
import { loadFontInferences, loadSvgInferences } from "../core/inferences";

import {
  GridSetOutputAction,
  GridInfoAction,
  GridClearOutputAction
} from "./grid-actions";

export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  grid-auto-flow: dense;
  padding: 10px;
`;

export const GridTitle = styled.div`
  padding: 0 10px 10px;
  color: white;
  text-align: left;
`;

export const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: 4px 0;
  background-color: lightgray;
  border-radius: 5px;

  &:nth-child(odd) {
    background-color: darkgray;
  }
`;

export const GridContent = styled.div`
  position: relative;

  background-color: ${props => (props.selected ? "lightblue" : "white")};
  width: 100%;
  height: 50px;

  &:hover {
    background-color: pink;
  }
`;

export const GridSvg = styled.div`
  width: 100%;
  height: 100%;
`;

export const GridInference = styled.div`
  position: absolute;

  top: 0;

  width: 100%;
  height: 100%;

  z-index: 1000;

  cursor: pointer;
`;

export const GridGlyph = styled.div``;

export const GridActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`;

export const GridAction = styled.div`
  width: 18px;
  text-align: center;

  &:hover {
    color: pink;
  }

  cursor: pointer;
`;

export const GridActionSpacer = styled.div`
  padding-right: 5px;
`;

export function GridFontInference(props) {
  const [
    { host, modelName, modelSuffix, inferenceType, inferenceGlyphRecord },
    dispatch
  ] = React.useContext(StateContext);
  const currInferenceGlyphRecord = inferenceGlyphRecord;

  return (
    <GridInference
      onClick={() => {
        const inferenceGlyphRecord = props.glyphRecord;

        const fetchData = async () => {
          await loadFontInferences(
            {
              host,
              modelName,
              modelSuffix,
              inferenceType,
              inferenceGlyphRecord
            },
            dispatch,
            currInferenceGlyphRecord
          );
        };

        fetchData();
      }}
    />
  );
}

export function GridSvgInference(props) {
  const [
    { host, modelName, modelSuffix, inferenceType, inferenceGlyphRecord },
    dispatch
  ] = React.useContext(StateContext);
  const currInferenceGlyphRecord = inferenceGlyphRecord;

  return (
    <GridInference
      onClick={() => {
        const inferenceGlyphRecord = props.glyphRecord;

        const fetchData = async () => {
          await loadSvgInferences(
            {
              host,
              modelName,
              modelSuffix,
              inferenceType,
              inferenceGlyphRecord
            },
            dispatch,
            currInferenceGlyphRecord
          );
        };

        fetchData();
      }}
    />
  );
}

export function GridInputsActions(props) {
  return (
    <GridActions>
      <GridSetOutputAction glyphRecord={props.glyphRecord} />
      <GridActionSpacer />
      <GridInfoAction glyphRecord={props.glyphRecord} />
    </GridActions>
  );
}

export function GridInferencesActions(props) {
  return (
    <GridActions>
      <GridSetOutputAction glyphRecord={props.glyphRecord} />
      <GridActionSpacer />
      <GridInfoAction glyphRecord={props.glyphRecord} />
    </GridActions>
  );
}

export function GridOutputsActions(props) {
  if (!props.glyphRecord.svg) {
    return (
      <GridActions>
        <GridAction>&nbsp;</GridAction>
      </GridActions>
    );
  }

  return (
    <GridActions>
      <GridClearOutputAction index={props.glyphRecord.index} />
      <GridActionSpacer />
      <GridInfoAction glyphRecord={props.glyphRecord} />
    </GridActions>
  );
}

function checkSelected(title, inferenceGlyphRecord, glyphRecord) {
  let selected = false;

  if (inferenceGlyphRecord) {
    switch (title) {
      case "Inputs":
      case "Outputs":
        selected = inferenceGlyphRecord.gid === glyphRecord.gid;
        break;

      default:
    }
  }

  return selected;
}

export function Grid(props) {
  const [{ inferenceGlyphRecord }] = React.useContext(StateContext);

  return (
    <div>
      <GridLayout>
        {props.data.map(x => (
          <GridItem key={x.gid}>
            <GridContent
              selected={checkSelected(props.title, inferenceGlyphRecord, x)}
            >
              <GridSvg dangerouslySetInnerHTML={{ __html: x.svg }} />
              {props.title === "Inputs" && (
                <GridFontInference glyphRecord={x} />
              )}
              {props.title === "Inferences" && (
                <GridSvgInference glyphRecord={x} />
              )}
              {props.title === "Outputs" && x.source === "font" && (
                <GridFontInference glyphRecord={x} />
              )}
              {props.title === "Outputs" && x.source === "inference" && (
                <GridSvgInference glyphRecord={x} />
              )}
            </GridContent>
            <GridGlyph>{x.glyph}</GridGlyph>
            {props.title === "Inputs" && <GridInputsActions glyphRecord={x} />}
            {props.title === "Inferences" && (
              <GridInferencesActions glyphRecord={x} />
            )}
            {props.title === "Outputs" && (
              <GridOutputsActions glyphRecord={x} />
            )}
          </GridItem>
        ))}
      </GridLayout>
      <GridTitle>{props.title}</GridTitle>
    </div>
  );
}
