import React from "react";

export const StateContext = React.createContext();

const emptyGlyphSet = generateEmpyGlyphs();

function generateEmpyGlyphs() {
  const out = [];

  let index = 0;
  for (let glyph of "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
    out.push({
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg: "",
      source: "",
      sourceFontName: ""
    });
  }

  return out;
}

export const initialState = {
  host: 'http://127.0.0.1:5959',

  modelList: ["models-google_external", "models-google_internal"],
  fontList: [],

  modelName: "models-google",
  modelSuffix: "external",
  fontName: "",
  inferenceGlyph: "",

  inputs: [...emptyGlyphSet],
  inferences: [...emptyGlyphSet],
  outputs: [...emptyGlyphSet],

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
        fontName: payload.fontList[0],
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
        modelSuffix: payload.modelSuffix,
      };

    case "loadFont":
      // sanity check
      if (state.fontName === payload.fontName) return state;

      return {
        ...state,
        fontName: payload.fontName,
        inputs: initialState.inputs
      };

    case "loadInference":
      // set our inferenceGlyph and infer
      return {
        ...state,
        inferenceGlyph: payload.inferenceGlyph,
        inferences: initialState.inferences,
        isInferring: true
      };

    //-----------------------------------------------------------------------------
    // inputs / inferences
    //-----------------------------------------------------------------------------

    case "loadedInputs":
      return {
        ...state,
        inputs: payload.inputs,
      };

    case "loadedInferences":
      return {
        ...state,
        inferences: payload.inferences,
        isInferring: false
      };

    //-----------------------------------------------------------------------------
    // outputs
    //-----------------------------------------------------------------------------

    case "clearOutputs":
      return {
        ...state,
        outputs: [...emptyGlyphSet]
      };

    case "clearOutput": {
      const output = state.outputs[payload.index];
      const newOutputs = [...state.outputs];
      newOutputs[payload.index] = {
        index: output.index,
        glyph: output.glyph,
        uni: output.glyph.charCodeAt(0),
        svg: "",
        source: "",
        sourceFontName: ""
      };

      return {
        ...state,
        outputs: newOutputs
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
