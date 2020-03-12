import React from "react";
import { StateContext } from "../core/context";
import { loadFontInferences } from "../core/inferences";
import { GridAction } from "./grid.js";

export function GridSetOutputAction(props) {
  const [{ fontName }, dispatch] = React.useContext(StateContext);

  return (
    <GridAction
      onClick={() => {
        const output = {
          index: props.index,
          glyph: props.glyph,
          uni: props.glyph.charCodeAt(0),
          svg: props.svg,
          source: props.source,
          sourceFontName: fontName
        };

        dispatch(["setOutput", { output }]);
      }}
    >
      ↓
    </GridAction>
  );
}

export function GridFontInferenceAction(props) {
  const [
    { host, modelName, modelSuffix, fontName },
    dispatch
  ] = React.useContext(StateContext);

  return (
    <GridAction
      onClick={() => {
        const inferenceGlyph = props.glyph;

        const fetchData = async () => {
          await loadFontInferences(
            host,
            modelName,
            modelSuffix,
            fontName,
            inferenceGlyph,
            dispatch
          );
        };

        fetchData();
      }}
    >
      ↻
    </GridAction>
  );
}

export function GridClearOutputAction(props) {
  const [, dispatch] = React.useContext(StateContext);

  return (
    <GridAction
      onClick={() => {
        dispatch(["clearOutput", { index: props.index }]);
      }}
    >
      ⨉
    </GridAction>
  );
}
