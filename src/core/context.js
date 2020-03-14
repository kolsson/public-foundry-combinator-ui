import React from "react";

export const StateContext = React.createContext();

const emptyGlyphRecordSet = generateEmptyGlyphRecordSet();

// we can't use a regular variable or the compiler will complain

export function generateId() {
  if (isNaN(window.currentGid)) window.currentGid = 100;
  return window.currentGid++;
}

function generateEmptyGlyphRecordSet() {
  const out = [];

  let index = 0;
  for (let glyph of "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
    out.push({
      gid: generateId(),
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg: "",
      source: "",
      sourceGid: -1,
      sourceFontName: "",
      sourceModelName: "",
      sourceModelSuffix: ""
    });
  }

  return out;
}

export const initialState = {
  host: "http://67.201.10.48:5959/api", // lyra WAN
  // host: "http://10.0.1.210:5959", // lyra LAN
  // host: "http://127.0.0.1:5959", // local

  modelList: ["models-v1", "models-google_external", "models-google_internal"],
  fontList: [],

  modelName: "models-v1",
  modelSuffix: "",
  fontName: "",
  inferenceGlyphRecord: null,

  inputs: [...emptyGlyphRecordSet],
  inferences: [...emptyGlyphRecordSet],
  outputs: [...emptyGlyphRecordSet],

  isInferring: false
};

export const reducer = (state, [type, payload]) => {
  // console.log('Reducer action:', type, payload);

  switch (type) {
    //-----------------------------------------------------------------------------
    // model / font
    //-----------------------------------------------------------------------------

    case "loadingFontList":
      return {
        ...state,
        fontList: initialState.fontList
      };

    case "loadedFontList":
      return {
        ...state,
        fontList: payload.fontList,
        fontName: payload.fontList[0]
      };

    case "setModel":
      // sanity check
      if (
        state.modelName === payload.modelName &&
        state.modelSuffix === payload.modelSuffix
      )
        return state;

      return {
        ...state,
        modelName: payload.modelName,
        modelSuffix: payload.modelSuffix
      };

    //-----------------------------------------------------------------------------
    // inputs / inferences
    //-----------------------------------------------------------------------------

    case "loadFont":
      // sanity check
      if (state.fontName === payload.fontName) return state;

      return {
        ...state,
        fontName: payload.fontName,
        inputs: initialState.inputs
      };

    case "loadedFont":
      return {
        ...state,
        inputs: payload.inputs
      };

    // we don't have a loadedFontFailed because it is fatal

    case "loadInference":
      // set our inferenceGlyphRecord and infer
      return {
        ...state,
        inferenceGlyphRecord: payload.inferenceGlyphRecord,
        // inferences: initialState.inferences, // do not clear our inferences in case of error
        isInferring: true
      };

    case "loadedInferences":
      return {
        ...state,
        inferences: payload.inferences,
        isInferring: false
      };

    case "loadedInferencesFailed":
      return {
        ...state,
        inferenceGlyphRecord: payload.inferenceGlyphRecord,
        isInferring: false
      };

    //-----------------------------------------------------------------------------
    // outputs
    //-----------------------------------------------------------------------------

    case "clearOutputs":
      return {
        ...state,
        outputs: [...emptyGlyphRecordSet]
      };

    case "clearOutput": {
      const output = state.outputs[payload.index];
      const newOutputs = [...state.outputs];
      newOutputs[payload.index] = {
        gid: generateId(),
        index: output.index,
        glyph: output.glyph,
        uni: output.glyph.charCodeAt(0),
        svg: "",
        source: "",
        sourceGid: -1,
        sourceFontName: "",
        sourceModelName: "",
        sourceModelSuffix: ""
      };

      return {
        ...state,
        outputs: newOutputs
      };
    }

    case "setOutputs": {
      return {
        ...state,
        outputs: [...payload.outputs]
      };
    }

    case "setOutput": {
      const newOutputs = [...state.outputs];
      newOutputs[payload.output.index] = payload.output;

      return {
        ...state,
        outputs: newOutputs
      };
    }

    default:
      return state;
  }
};
