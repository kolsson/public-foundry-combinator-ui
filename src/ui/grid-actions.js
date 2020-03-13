import React from "react";
import { StateContext } from "../core/context";
import { loadFontInferences, loadSvgInferences } from "../core/inferences";
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
  const [{ host, inferenceGlyphRecord }, dispatch] = React.useContext(
    StateContext
  );
  const currInferenceGlyphRecord = inferenceGlyphRecord;

  return (
    <GridAction
      onClick={() => {
        const inferenceGlyphRecord = props.glyphRecord;

        const fetchData = async () => {
          await loadFontInferences(
            host,
            currInferenceGlyphRecord,
            inferenceGlyphRecord,
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

export function GridSvgInferenceAction(props) {
  const [{ host, inferenceGlyphRecord }, dispatch] = React.useContext(
    StateContext
  );
  const currInferenceGlyphRecord = inferenceGlyphRecord;

  return (
    <GridAction
      onClick={() => {
        const inferenceGlyphRecord = props.glyphRecord;

        const fetchData = async () => {
          await loadSvgInferences(
            host,
            currInferenceGlyphRecord,
            inferenceGlyphRecord,
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
