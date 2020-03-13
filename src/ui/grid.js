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
      <GridSetOutputAction
        index={props.x.index}
        glyph={props.x.glyph}
        svg={props.x.svg}
        source={props.x.source}
      />
      <GridActionSpacer />
      <GridFontInferenceAction glyphRecord={props.x} />
    </GridActions>
  );
}

export function GridInferencesActions(props) {
  return (
    <GridActions>
      <GridSetOutputAction
        index={props.x.index}
        glyph={props.x.glyph}
        svg={props.x.svg}
        source={props.x.source}
      />
      <GridActionSpacer />
      <GridSvgInferenceAction glyphRecord={props.x} />
    </GridActions>
  );
}

export function GridOutputsActions(props) {
  return (
    <GridActions>
      <GridClearOutputAction index={props.x.index} />
      <GridActionSpacer />
      <GridSvgInferenceAction glyphRecord={props.x} />
    </GridActions>
  );
}

function checkSelected(title, inferenceGlyphRecord, x) {
  let selected = false;

  if (inferenceGlyphRecord) {
    switch (title) {
      case "Outputs":
        break;

      case "Inferences":
        break;

      case "Inputs":
      default:
        // a. our current inferenceGlyphRecord says we are inferring from a font
        // b. the current inferenceGlyphRecord glyph is the same as this glpyhRecord font
        // c. the current inferenceGlyphRecord fontName is the same as this glpyhRecord fontName

        selected =
          inferenceGlyphRecord.source === "font" &&
          inferenceGlyphRecord.sourceFontName === x.sourceFontName &&
          inferenceGlyphRecord.glyph === x.glyph;

        // if (x.glyph === '0')
        //   console.warn(
        //     false,
        //     inferenceGlyphRecord.source,
        //     inferenceGlyphRecord.sourceFontName,
        //     inferenceGlyphRecord.glyph,
        //     x.sourceFontName,
        //     x.glyph,
        //     inferenceGlyphRecord.sourceFontName === x.sourceFontName,
        //     inferenceGlyphRecord.glyph === x.glyph
        //   );
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
              selected={checkSelected(props.title, inferenceGlyphRecord, x)}
              dangerouslySetInnerHTML={{ __html: x.svg }}
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
