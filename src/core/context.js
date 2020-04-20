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
      bitmap: "",
      source: "",
      sourceGid: -1,
      sourceFontName: "",
      modelName: "",
      modelSuffix: ""
    });
  }

  return out;
}

const hostList = [
  {
    name: "lyra (WAN)",
    url: "http://67.201.10.48:5959/api"
  },
  {
    name: "lyra (LAN)",
    url: "http://10.0.1.210:5959/api"
  },
  {
    name: "localhost",
    url: "http://127.0.0.1:5959/api"
  }
];

const defaultHost = localStorage.getItem("host") || hostList[0].url;

const modelList = ["v1", "v1b", "pf1", "google_external", "google_internal"];

const defaultModelName = "google";
const defaultModelSuffix = "external";

const bitmapContrastList = [
  {
    name: "None",
    value: 1
  },
  {
    name: "Auto",
    value: "auto"
  },
  {
    name: "Level 1",
    value: 2
  },
  {
    name: "Level 2",
    value: 3
  },
  {
    name: "Level 3",
    value: 4
  },
  {
    name: "Level 4",
    value: 5
  },
  {
    name: "Low",
    value: 0.5
  }
];

const defaultBitmapContrast = bitmapContrastList[0].value;

export const initialState = {
  hostList,
  host: defaultHost,

  modelList,
  fontList: [],

  modelName: defaultModelName,
  modelSuffix: defaultModelSuffix,
  fontName: "",
  inferenceType: "bitmap",
  bitmapDepth: 8,
  bitmapContrastList,
  bitmapContrast: defaultBitmapContrast,
  inferenceGlyphRecord: null,

  inputs: [...emptyGlyphRecordSet],
  inferences: [...emptyGlyphRecordSet],
  outputs: [...emptyGlyphRecordSet],

  isInferring: false
};

export const reducer = (state, [type, payload]) => {
  console.log("Reducer action:", type, payload);

  switch (type) {
    //-----------------------------------------------------------------------------
    // host
    //-----------------------------------------------------------------------------

    case "setHost":
      return {
        ...state,
        host: payload.host
      };

    //-----------------------------------------------------------------------------
    // fontlist / model / inferencetype
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

    case "setInferenceType":
      return {
        ...state,
        inferenceType: payload.inferenceType
      };

    case "setBitmapDepth":
      return {
        ...state,
        bitmapDepth: payload.bitmapDepth
      };

    case "setBitmapContrast":
      return {
        ...state,
        bitmapContrast: payload.bitmapContrast
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
        bitmap: "",
        source: "",
        sourceGid: -1,
        sourceFontName: "",
        modelName: "",
        modelSuffix: ""
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
