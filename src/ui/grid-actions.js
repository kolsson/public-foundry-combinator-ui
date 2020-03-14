import React from "react";
import { StateContext } from "../core/context";
import { loadFontInferences, loadSvgInferences } from "../core/inferences";
import { GridAction } from "./grid.js";

export function GridSetOutputAction(props) {
  const [, dispatch] = React.useContext(StateContext);

  return (
    <GridAction
      onClick={() => {
        // make a copy
        dispatch(["setOutput", { output: { ...props.glyphRecord } }]);
      }}
    >
      ↓
    </GridAction>
  );
}

export function GridFontInferenceAction(props) {
  const [
    { host, modelName, modelSuffix, inferenceGlyphRecord },
    dispatch
  ] = React.useContext(StateContext);
  const currInferenceGlyphRecord = inferenceGlyphRecord;

  return (
    <GridAction
      onClick={() => {
        const inferenceGlyphRecord = props.glyphRecord;

        const fetchData = async () => {
          await loadFontInferences(
            host,
            modelName,
            modelSuffix,
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
  const [
    { host, modelName, modelSuffix, inferenceGlyphRecord },
    dispatch
  ] = React.useContext(StateContext);
  const currInferenceGlyphRecord = inferenceGlyphRecord;

  return (
    <GridAction
      onClick={() => {
        const inferenceGlyphRecord = props.glyphRecord;

        const fetchData = async () => {
          await loadSvgInferences(
            host,
            modelName,
            modelSuffix,
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
