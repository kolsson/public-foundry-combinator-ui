import React from "react";
import { StateContext } from "../core/context";
import { Button } from "react-bootstrap";

export function ClearOutputsButton(props) {
  const [, dispatch] = React.useContext(StateContext);

  return (
    <Button variant="outline-danger" onClick={() => dispatch(["clearOutputs"])}>
      Clear
    </Button>
  );
}

export function PasteOutputsButton(props) {
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
      Paste
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
        prompt("Please copy the Outputs string below:", outputsString);
      }}
    >
      Copy
    </Button>
  );
}
