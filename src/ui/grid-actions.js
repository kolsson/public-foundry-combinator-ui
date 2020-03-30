import React from "react";
import styled from "styled-components";

import { StateContext } from "../core/context";
import { GridAction } from "./grid.js";

const Check = styled.span`
  font-size: 20px;
  line-height: 24px;
`;

const X = styled.span`
  font-size: 20px;
  line-height: 24px;
`;

const Info = styled.span`
  font-size: 22px;
  line-height: 20px;
`;

export function GridSetOutputAction(props) {
  const [, dispatch] = React.useContext(StateContext);

  return (
    <GridAction
      onClick={() => {
        // make a copy
        dispatch(["setOutput", { output: { ...props.glyphRecord } }]);
      }}
    >
      <Check>✓</Check>
    </GridAction>
  );
}

export function GridInfoAction(props) {
  const x = props.glyphRecord;

  return (
    <GridAction
      onClick={() => {
        // present details

        let modelNameAndSuffix = x.source === "font" ? "N/A" : x.modelName;
        if (!!x.modelSuffix)
          modelNameAndSuffix = `${modelNameAndSuffix}_${x.modelSuffix}`;

        alert(`gid: ${x.gid}
glyph: ${x.glyph} (${x.uni})
model: ${modelNameAndSuffix}
svg: ${!!x.svg}
bitmap: ${!!x.bitmap}

source: ${x.source}
sourceGid: ${x.sourceGid}
sourceFontName: ${x.sourceFontName}`);
      }}
    >
      <Info>ℹ</Info>
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
      <X>✗</X>
    </GridAction>
  );
}
