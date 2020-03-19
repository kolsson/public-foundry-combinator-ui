import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

import { StateContext } from "../core/context";

export function InferenceToggleButtonGroup(props) {
  const [{ inferenceType }, dispatch] = React.useContext(StateContext);

  return (
    <ToggleButtonGroup
      type="radio"
      name="type"
      defaultValue={inferenceType}
      onChange={val => {
        dispatch(["setInferenceType", { inferenceType: val }]);
      }}
    >
      <ToggleButton
        value="svg"
        variant="outline-primary"
        style={{ cursor: "pointer" }}
      >
        SVG
      </ToggleButton>
      <ToggleButton
        value="bitmap"
        variant="outline-primary"
        style={{ cursor: "pointer" }}
      >
        Bitmap
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
