import React from "react";
import styled from "styled-components";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";

import { StateContext, reducer, initialState } from "./core/context";
import { loadFontList, loadFont } from "./core/fonts";
import { loadFontInferences } from "./core/inferences";

import {
  GridLayout,
  GridTitle,
  GridItem,
  GridSvg,
  GridGlyph,
  GridInputsActions,
  GridInferencesActions,
  GridOutputsActions
} from "./ui/grid";

import {
  ControlBarLayout,
  ControlBarGroup,
  ControlBarSpacer
} from "./ui/controlbar";
import { InfoGroup } from "./ui/controlbar-info";
import { LoadingCover, LoadingText } from "./ui/loading";

import "./App.css";

//-----------------------------------------------------------------------------
// App
//-----------------------------------------------------------------------------

const GridsContainerLayout = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

function Grid(props) {
  const [{ fontName, inferenceGlyph }] = React.useContext(StateContext);
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

function ControlBar(props) {
  const [
    {
      host,
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
    <ControlBarLayout>
      <InfoGroup />
      <ControlBarGroup>
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
                  host,
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
        <ControlBarSpacer />
        <DropdownButton
          variant="outline-primary"
          id="dropdown-basic-button"
          title="Font"
          onSelect={(ek, e) => {
            if (fontName !== fontList[ek]) {
              const fetchData = async () => {
                const fontName = fontList[ek]; // override our context
                await loadFont(
                  host,
                  modelName,
                  modelSuffix,
                  fontName,
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
      </ControlBarGroup>
      <ControlBarGroup>
        <Button
          variant="outline-danger"
          onClick={() => dispatch(["clearOutputs"])}
        >
          Clear Outputs
        </Button>
        <ControlBarSpacer />
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
      </ControlBarGroup>
    </ControlBarLayout>
  );
}

function Container(props) {
  const [
    {
      host,
      modelName,
      modelSuffix,
      fontName,
      inputs,
      inferences,
      outputs,
      isInferring
    },
    dispatch
  ] = React.useContext(StateContext);

  React.useEffect(() => {
    // first run

    const fetchData = async () => {
      const fontList = await loadFontList(host, dispatch);
      const fontName = fontList[0]; // override our context
      await loadFont(host, modelName, modelSuffix, fontName, dispatch);
    };

    fetchData();
  }, []);

  return (
    <>
      {isInferring && (
        <LoadingCover>
          <LoadingText>Inferring...</LoadingText>
        </LoadingCover>
      )}
      <ControlBar fontName={fontName} />
      <GridsContainerLayout>
        <Grid data={inputs} fontName={fontName} title="Inputs" />
        <Grid data={inferences} title="Inferences" />
        <Grid data={outputs} title="Outputs" />
      </GridsContainerLayout>
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
