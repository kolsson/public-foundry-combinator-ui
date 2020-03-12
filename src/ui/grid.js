import React from "react";
import styled from "styled-components";

import {
  GridSetOutputAction,
  GridFontInferenceAction,
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
        source="input"
      />
      <GridActionSpacer />
      <GridFontInferenceAction glyph={props.x.glyph} />
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
        source="inference"
      />
      <GridActionSpacer />
      <GridAction>↻</GridAction>
    </GridActions>
  );
}

export function GridOutputsActions(props) {
  return (
    <GridActions>
      <GridClearOutputAction index={props.x.index} />
      <GridActionSpacer />
      <GridAction>↻</GridAction>
    </GridActions>
  );
}
