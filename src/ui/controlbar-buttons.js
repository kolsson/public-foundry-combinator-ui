import React from "react";
import { Button } from "react-bootstrap";

import { StateContext } from "../core/context";

export function ClearOutputsButton(props) {
  const [, dispatch] = React.useContext(StateContext);

  return (
    <Button variant="outline-danger" onClick={() => dispatch(["clearOutputs"])}>
      Clear Outputs
    </Button>
  );
}

export function PasteOutputsButton(props) {
  // temporarily disabled due to prompt limitations
  // https://stackoverflow.com/questions/15969503/prompt-max-length

  const [, dispatch] = React.useContext(StateContext);
  return (
    <Button
      variant="outline-success"
      onClick={() => {
        const outputsString = prompt(
          "Please paste your Outputs string below:",
          ""
        );

        if (!!outputsString) {
          try {
            const outputs = JSON.parse(outputsString);

            // do proper model checking here

            dispatch(["setOutputs", { outputs }]);
          } catch (error) {
            alert("Your Outputs were invalid!");
          }
        }
      }}
    >
      Paste Outputs
    </Button>
  );
}

export function CopyOutputsButton(props) {
  const [{ outputs }] = React.useContext(StateContext);
  return (
    <Button
      variant="outline-success"
      onClick={() => {
        const outputsString = JSON.stringify(outputs);
        console.info(outputsString);
        alert("Outputs copied to the console!");

        // prompt can't handle long strings
        // prompt("Please copy the Outputs string below:", outputsString);
      }}
    >
      Copy Outputs
    </Button>
  );
}
