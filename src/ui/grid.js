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

  background-color: white;

  width: 100%;
  height: 50px;
`;

export const GridSvg = styled.div`
  width: 100%;
  height: 50px;

  overflow: hidden;
`;

export const GridBitmap = styled.div`
  & img {
    width: 100%;
    height: 50px;
  }
`;

export const GridInference = styled.div`
  position: absolute;

  top: 0;

  ${"" /* lightblue = #ADD8E6 (173, 223, 255) */}
  background-color: ${props =>
    props.selected ? "rgba(91, 191, 255, 0.5)" : "transparent"};
  width: 100%;
  height: 100%;

  z-index: 10;

  cursor: pointer;

  &:hover {
    ${"" /* pink = #FAAFBE (250, 175, 190) */}
    background-color: rgba(245, 95, 125, 0.5);
  }
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
    {
      host,
      modelName,
      modelSuffix,
      inferenceType,
      bitmapDepth,
      bitmapContrast,
      inferenceGlyphRecord
    },
    dispatch
  ] = React.useContext(StateContext);
  const currInferenceGlyphRecord = inferenceGlyphRecord;

  return (
    <GridInference
      selected={props.selected}
      onClick={() => {
        const inferenceGlyphRecord = props.glyphRecord;

        const fetchData = async () => {
          await loadFontInferences(
            {
              host,
              modelName,
              modelSuffix,
              inferenceType,
              bitmapDepth,
              bitmapContrast,
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
    {
      host,
      modelName,
      modelSuffix,
      inferenceType,
      bitmapDepth,
      bitmapContrast,
      inferenceGlyphRecord
    },
    dispatch
  ] = React.useContext(StateContext);
  const currInferenceGlyphRecord = inferenceGlyphRecord;

  return (
    <GridInference
      selected={props.selected}
      onClick={() => {
        const inferenceGlyphRecord = props.glyphRecord;

        const fetchData = async () => {
          await loadSvgInferences(
            {
              host,
              modelName,
              modelSuffix,
              inferenceType,
              bitmapDepth,
              bitmapContrast,
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
  if (!props.glyphRecord.svg && !props.glyphRecord.bitmap) {
    return (
      <GridActions>
        <GridActionSpacer />
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
  const [{ inferenceType, inferenceGlyphRecord }] = React.useContext(
    StateContext
  );

  return (
    <div>
      <GridLayout>
        {props.data.map(x => (
          <GridItem key={x.gid}>
            <GridContent>
              {((inferenceType === "svg" || inferenceType === "autotrace") || props.title === "Inputs") &&
                x.svg && (
                  <GridSvg dangerouslySetInnerHTML={{ __html: x.svg }} />
                )}
              {inferenceType === "bitmap" &&
                props.title !== "Inputs" &&
                x.bitmap && (
                  <GridBitmap dangerouslySetInnerHTML={{ __html: x.bitmap }} />
                )}
              {props.title === "Inputs" && (
                <GridFontInference
                  glyphRecord={x}
                  selected={checkSelected(props.title, inferenceGlyphRecord, x)}
                />
              )}
              {props.title === "Inferences" && (
                <GridSvgInference
                  glyphRecord={x}
                  selected={checkSelected(props.title, inferenceGlyphRecord, x)}
                />
              )}
              {props.title === "Outputs" && x.source === "font" && (
                <GridFontInference
                  glyphRecord={x}
                  selected={checkSelected(props.title, inferenceGlyphRecord, x)}
                />
              )}
              {props.title === "Outputs" && x.source === "inference" && (
                <GridSvgInference
                  glyphRecord={x}
                  selected={checkSelected(props.title, inferenceGlyphRecord, x)}
                />
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
