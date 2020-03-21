import React from "react";
import styled from "styled-components";

import { StateContext, reducer, initialState } from "./core/context";
import { loadFontList, loadFont } from "./core/fonts";

import { Grid } from "./ui/grid";
import { PrimaryControlBar, SecondaryControlBar } from "./ui/controlbar";
import { LoadingCover, LoadingText } from "./ui/loading";

import "./App.css";

//-----------------------------------------------------------------------------
// App
//-----------------------------------------------------------------------------

const GridsContainerLayout = styled.div`
  position: absolute;
  top: 120px;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

function Container(props) {
  const [
    {
      host,
      modelName,
      modelSuffix,
      fontName,
      inferenceType,
      bitmapDepth,
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
      await loadFont(
        {
          host,
          modelName,
          modelSuffix,
          fontName,
          inferenceType,
          bitmapDepth
        },
        dispatch
      );
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
      <PrimaryControlBar />
      <SecondaryControlBar />
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
