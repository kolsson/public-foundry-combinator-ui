import React from "react";
import styled from "styled-components";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { StateContext, reducer, initialState } from "./core/context";
import { loadFontList, loadFont } from "./core/fonts";
import { loadFontInferences, loadSvgInferences } from "./core/inferences";

import { Grid } from "./ui/grid";

import {
  ControlBarLayout,
  ControlBarGroup,
  ControlBarSpacer
} from "./ui/controlbar";
import {
  ClearOutputsButton,
  PasteOutputsButton,
  CopyOutputsButton
} from "./ui/controlbar-buttons";
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

function ControlBar(props) {
  const [
    {
      host,
      modelList,
      fontList,
      modelName,
      modelSuffix,
      fontName,
      inferenceGlyphRecord
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
                dispatch(["setModel", { modelName, modelSuffix }]);

                inferenceGlyphRecord.sourceModelName = newModelName;
                inferenceGlyphRecord.sourceModelSuffix = newModelSuffix;

                // we can't unwind a model change right now (nor should we need to)
                // so we don't pass a currInferenceGlyphRecord

                if (inferenceGlyphRecord.source === "font") {
                  await loadFontInferences(
                    host,
                    inferenceGlyphRecord,
                    inferenceGlyphRecord,
                    dispatch
                  );
                } else {
                  await loadSvgInferences(
                    host,
                    inferenceGlyphRecord,
                    inferenceGlyphRecord,
                    dispatch
                  );
                }
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
        <ClearOutputsButton />
        <ControlBarSpacer />
        <PasteOutputsButton />
        <ControlBarSpacer />
        <CopyOutputsButton />
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
