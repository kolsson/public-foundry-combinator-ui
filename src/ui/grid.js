import React from "react";
import styled from "styled-components";

import { StateContext } from "../core/context";

import {
  GridSetOutputAction,
  GridFontInferenceAction,
  GridSvgInferenceAction,
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

export const GridSvg = styled.div`
  background-color: ${props => (props.selected ? "lightblue" : "white")};
  width: 100%;
  height: 50px;
`;

export const GridGlyph = styled.div``;

export const GridActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const GridAction = styled.div`
  font-size: 18px;

  &:hover {
    color: lightblue;
  }

  cursor: pointer;
`;

export const GridActionSpacer = styled.div`
  padding-right: 5px;
`;

export function GridInputsActions(props) {
  return (
    <GridActions>
      <GridSetOutputAction glyphRecord={props.x} />
      <GridActionSpacer />
      <GridFontInferenceAction glyphRecord={props.x} />
    </GridActions>
  );
}

export function GridInferencesActions(props) {
  return (
    <GridActions>
      <GridSetOutputAction glyphRecord={props.x} />
      <GridActionSpacer />
      <GridSvgInferenceAction glyphRecord={props.x} />
    </GridActions>
  );
}

export function GridOutputsActions(props) {
  if (!props.x.svg) {
    return (
      <GridActions>
        <GridAction>&nbsp;</GridAction>
      </GridActions>
    );
  }

  return (
    <GridActions>
      <GridClearOutputAction index={props.x.index} />
      {props.x.source === "font" && (
        <>
          <GridActionSpacer />
          <GridFontInferenceAction glyphRecord={props.x} />
        </>
      )}
      {props.x.source === "inference" && (
        <>
          <GridActionSpacer />
          <GridSvgInferenceAction glyphRecord={props.x} />
        </>
      )}
    </GridActions>
  );
}

function checkSelected(title, inferenceGlyphRecord, x) {
  let selected = false;

  if (inferenceGlyphRecord) {
    switch (title) {
      case "Inputs":
      case "Outputs":
        selected = inferenceGlyphRecord.gid === x.gid;
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
          <GridItem key={x.glyph}>
            <GridSvg
              style={{ cursor: "pointer" }}
              selected={checkSelected(props.title, inferenceGlyphRecord, x)}
              dangerouslySetInnerHTML={{ __html: x.svg }}
              onClick={() => {
                // present details

                let modelNameAndSuffix = x.modelName;
                if (!!x.modelSuffix)
                  modelNameAndSuffix = `${modelNameAndSuffix}_${x.modelSuffix}`;

                alert(`gid: ${x.gid}
glyph: ${x.glyph} (${x.uni})
model: ${modelNameAndSuffix}
svg: ${!!x.svg}

source: ${x.source}
sourceGid: ${x.sourceGid}
sourceFontName: ${x.sourceFontName}`);
              }}
            ></GridSvg>
            <GridGlyph>{x.glyph}</GridGlyph>
            {props.title === "Inputs" && <GridInputsActions x={x} />}
            {props.title === "Inferences" && <GridInferencesActions x={x} />}
            {props.title === "Outputs" && <GridOutputsActions x={x} />}
          </GridItem>
        ))}
      </GridLayout>
      <GridTitle>{props.title}</GridTitle>
    </div>
  );
}
