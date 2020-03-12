import React from "react";
import styled from "styled-components";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";

import "./App.css";

//-----------------------------------------------------------------------------
// state
//-----------------------------------------------------------------------------

const StateContext = React.createContext();

const emptyGlyphs = [];
let index = 0;
for (let glyph of "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
  emptyGlyphs.push({
    index: index++,
    glyph,
    uni: glyph.charCodeAt(0),
    svg: "",
    source: "",
    sourceFontName: ""
  });
}

const initialState = {
  modelList: ["models-google_external", "models-google_internal"],
  fontList: [],

  modelName: "models-google",
  modelSuffix: "external",
  fontName: "...",
  inferenceGlyph: "...",

  inputs: [...emptyGlyphs],
  inferences: [...emptyGlyphs],
  outputs: [...emptyGlyphs],

  isLoading: false
};

const reducer = (state, [type, payload]) => {
  // console.log('Reducer action:', type, payload);

  switch (type) {
    //-----------------------------------------------------------------------------
    // model / font
    //-----------------------------------------------------------------------------

    case "loadingFontList":
      return {
        ...state,
        fontList: initialState.fontList
        // isLoading: true
      };

    case "loadedFontList":
      return {
        ...state,
        fontList: payload.fontList,
        fontName: payload.fontList[0],
        isLoading: false
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
        isLoading: true
      };

    case "setFontName":
      // sanity check
      if (state.fontName === payload.fontName) return state;

      return {
        ...state,
        fontName: payload.fontName,
        inputs: initialState.inputs
        // isLoading: true
      };

    case "setInferenceGlyph":
      // set our inferenceGlyph and load our inference
      return {
        ...state,
        inferenceGlyph: payload.inferenceGlyph,
        inferences: initialState.inferences,
        isLoading: true
      };

    //-----------------------------------------------------------------------------
    // inputs / inferences
    //-----------------------------------------------------------------------------

    case "loadedInputs":
      return {
        ...state,
        inputs: payload.inputs,
        isLoading: false
      };

    case "loadedInferences":
      return {
        ...state,
        inferences: payload.inferences,
        isLoading: false
      };

    //-----------------------------------------------------------------------------
    // outputs
    //-----------------------------------------------------------------------------

    case "clearOutputs":
      return {
        ...state,
        outputs: [...emptyGlyphs]
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
      newOutputs[payload.index] = payload.output;

      return {
        ...state,
        outputs: newOutputs
      };
    }

    default:
      return state;
  }
};

//-----------------------------------------------------------------------------
// App
//-----------------------------------------------------------------------------

const LoadingCover = styled.div`
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;

  font-size: 36px;
  line-height: 36px;

  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
  opacity: 0.75;
  z-index: 1000;
`;

const ContainerLayout = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  grid-auto-flow: dense;
  padding: 10px;
`;

const GridTitle = styled.div`
  padding: 0 10px 10px;
  color: white;
  text-align: left;
`;

const GridItem = styled.div`
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

const GridSvg = styled.div`
  background-color: ${props => (props.selected ? "lightblue" : "white")};
  width: 100%;
  height: 50px;
`;

const GridGlyph = styled.div``;

const GridActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const GridAction = styled.div`
  font-size: 18px;

  &:hover {
    color: lightblue;
  }

  cursor: pointer;
`;

const ControlsLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  min-height: 60px;

  padding: 10px;
  text-align: left;
  background-color: lightgray;
`;

const InfoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0 10px;
  height: 40px;

  color: white;

  background-color: gray;
  border-radius: 5px;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HSpacer = styled.div`
  padding-right: 10px;
`;

function Grid(props) {
  const [{ modelName, modelSuffix, fontName, inferenceGlyph }, dispatch] = React.useContext(
    StateContext
  );
  return (
    <div>
      <GridLayout>
        {props.data.map(x => (
          <GridItem key={x.glyph}>
            <GridSvg
              selected={
                props.title === "Inputs" &&
                x.sourceFontName === fontName &&
                x.glyph === inferenceGlyph
              }
              dangerouslySetInnerHTML={{ __html: x.svg }}
            ></GridSvg>
            <GridGlyph>{x.glyph}</GridGlyph>
            {props.title === "Inputs" && (
              <GridActions>
                <GridAction
                  onClick={() => {
                    const output = {
                      index: x.index,
                      glyph: x.glyph,
                      uni: x.glyph.charCodeAt(0),
                      svg: x.svg,
                      source: "input",
                      sourceFontName: fontName
                    };

                    dispatch(["setOutput", { index: x.index, output }]);
                  }}
                >
                  ↓
                </GridAction>
                <div style={{ paddingRight: 5 }} />
                <GridAction
                  onClick={() => {
                    const inferenceGlyph = x.glyph;

                    const fetchData = async () => {
                      await loadFontInferences(
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
              </GridActions>
            )}
            {props.title === "Inferences" && (
              <GridActions>
                <GridAction
                  onClick={() => {
                    const output = {
                      index: x.index,
                      glyph: x.glyph,
                      uni: x.glyph.charCodeAt(0),
                      svg: x.svg,
                      source: "inference",
                      sourceFontName: fontName
                    };

                    dispatch(["setOutput", { index: x.index, output }]);
                  }}
                >
                  ↓
                </GridAction>
                <div style={{ paddingRight: 5 }} />
                <GridAction>↻</GridAction>
              </GridActions>
            )}
            {props.title === "Outputs" && (
              <GridActions>
                <GridAction
                  onClick={() => {
                    dispatch(["clearOutput", { index: x.index }]);
                  }}
                >
                  ⨉
                </GridAction>
                <div style={{ paddingRight: 5 }} />
                <GridAction>↻</GridAction>
              </GridActions>
            )}
          </GridItem>
        ))}
      </GridLayout>
      <GridTitle>{props.title}</GridTitle>
    </div>
  );
}

function Controls(props) {
  const [
    {
      modelList,
      fontList,
      modelName,
      modelSuffix,
      fontName,
      inferenceGlyph,
      outputs
    },
    dispatch
  ] = React.useContext(StateContext);

  return (
    <ControlsLayout>
      <ControlGroup>
        <InfoBox>
          {modelName}_{modelSuffix}
        </InfoBox>
        <HSpacer />
        <InfoBox>{fontName}</InfoBox>
        <HSpacer />
        <InfoBox>
          <strong>{inferenceGlyph}</strong>
        </InfoBox>
      </ControlGroup>
      <ControlGroup>
        <DropdownButton
          variant="outline-primary"
          id="dropdown-basic-button"
          title="Model"
          onSelect={(ek, e) => {
            const [newModelName, newModelSuffix] = modelList[ek].split("_");

            if (newModelName !== modelName || newModelSuffix !== modelSuffix) {
              const fetchData = async () => {
                const modelName = newModelName,
                  modelSuffix = newModelSuffix;

                dispatch(["setModel", { modelName, modelSuffix }]);
                await loadFontInferences(
                  modelName,
                  modelSuffix,
                  fontName,
                  inferenceGlyph,
                  dispatch
                );
              };
              fetchData();
            }
          }}
        >
          {modelList.map((option, i) => (
            <Dropdown.Item key={i} eventKey={i}>
              {option}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <HSpacer />
        <DropdownButton
          variant="outline-primary"
          id="dropdown-basic-button"
          title="Font"
          onSelect={(ek, e) => {
            if (fontName !== fontList[ek]) {
              const fetchData = async () => {
                const fontName = fontList[ek]; // override our context
                const inferenceGlyph = await loadInputs(fontName, dispatch);
                await loadFontInferences(
                  modelName,
                  modelSuffix,
                  fontName,
                  inferenceGlyph,
                  dispatch
                );
              };
              fetchData();
            }
          }}
        >
          {fontList.map((option, i) => (
            <Dropdown.Item key={i} eventKey={i}>
              {option}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </ControlGroup>
      <ControlGroup>
        <Button
          variant="outline-danger"
          onClick={() => dispatch(["clearOutputs"])}
        >
          Clear Outputs
        </Button>
        <HSpacer />
        <Button
          variant="outline-success"
          onClick={() => {
            const outputsString = JSON.stringify(outputs);
            prompt(
              "Please select and copy the Outputs string below:",
              outputsString
            );
          }}
        >
          Copy Outputs
        </Button>
      </ControlGroup>
    </ControlsLayout>
  );
}

async function loadInputs(fontName, dispatch) {
  dispatch(["setFontName", { fontName }]);

  const result = await fetch(`http://127.0.0.1:5959/inputs/${fontName}`);
  const data = (await result.json()).inputs;
  const [inputs, inferenceGlyph] = transformInputs(fontName, data);

  dispatch(["loadedInputs", { inputs }]);

  return inferenceGlyph;
}

async function loadFontInferences(
  modelName,
  modelSuffix,
  fontName,
  inferenceGlyph,
  dispatch
) {
  dispatch(["setInferenceGlyph", { inferenceGlyph }]);
  const ms = modelSuffix || "0";

  const result = await fetch(
    `http://127.0.0.1:5959/infer/${modelName}/${ms}/${fontName}/${inferenceGlyph}`
  );
  const data = (await result.json()).inferences;
  const inferences = transformInferences(fontName, data);

  dispatch(["loadedInferences", { inferences }]);
}

function transformInputs(fontName, data) {
  const inputs = [];
  let inferenceGlyph = "";

  let index = 0;
  for (let glyph in data) {
    const svg = data[glyph];

    // set our first inference glyph
    if (inferenceGlyph === "" && svg !== "") {
      inferenceGlyph = glyph;
    }

    inputs.push({
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg,
      source: "input",
      sourceFontName: fontName
    });
  }

  return [inputs, inferenceGlyph];
}

function transformInferences(fontName, data) {
  const inferences = [];

  let index = 0;
  for (let glyph in data) {
    const svg = data[glyph];

    inferences.push({
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg,
      source: "inference",
      sourceFontName: fontName
    });
  }

  return inferences;
}

function Container(props) {
  const [
    {
      isLoading,
      modelName,
      modelSuffix,
      fontName,
      inputs,
      inferences,
      outputs
    },
    dispatch
  ] = React.useContext(StateContext);

  React.useEffect(() => {
    const fetchData = async () => {
      dispatch(["loadingFontList"]);
      const result = await fetch("http://127.0.0.1:5959/fonts");
      const fontList = (await result.json()).fonts;
      dispatch(["loadedFontList", { fontList }]);

      const fontName = fontList[0]; // override our context
      const inferenceGlyph = await loadInputs(fontName, dispatch);
      await loadFontInferences(
        modelName,
        modelSuffix,
        fontName,
        inferenceGlyph,
        dispatch
      );
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading && (
        <LoadingCover>
          <div style={{ padding: 30, border: "3px solid white" }}>
            Inferring...
          </div>
        </LoadingCover>
      )}
      <Controls fontName={fontName} />
      <ContainerLayout>
        <Grid data={inputs} fontName={fontName} title="Inputs" />
        <Grid data={inferences} title="Inferences" />
        <Grid data={outputs} title="Outputs" />
      </ContainerLayout>
    </>
  );
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <div className="App">
        <Container />
      </div>
    </StateContext.Provider>
  );
}

export default App;
