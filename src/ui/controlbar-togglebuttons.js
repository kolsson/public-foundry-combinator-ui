import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

import { StateContext } from "../core/context";
import { loadFontInferences, loadSvgInferences } from "../core/inferences";

import { ControlBarSpacer, ControlBarLabel } from "./controlbar";

export function InferenceTypeToggleButtonGroup(props) {
  const [
    {
      host,
      modelName,
      modelSuffix,
      inferenceType,
      bitmapDepth,
      bitmapContrast,
      inferenceGlyphRecord
    },
    dispatch
  ] = React.useContext(StateContext);

  return (
    <ToggleButtonGroup
      type="radio"
      name="type"
      defaultValue={inferenceType}
      onChange={val => {
        const fetchData = async () => {
          const inferenceType = val;

          dispatch(["setInferenceType", { inferenceType }]);

          if (inferenceGlyphRecord.source === "font") {
            await loadFontInferences(
              {
                host,
                modelName,
                modelSuffix,
                inferenceType,
                bitmapDepth,
                bitmapContrast,
                inferenceGlyphRecord
              },
              dispatch,
              inferenceGlyphRecord
            );
          } else {
            await loadSvgInferences(
              {
                host,
                modelName,
                modelSuffix,
                inferenceType,
                bitmapDepth,
                bitmapContrast,
                inferenceGlyphRecord
              },
              dispatch,
              inferenceGlyphRecord
            );
          }
        };
        fetchData();
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
        value="autotrace"
        variant="outline-primary"
        style={{ cursor: "pointer" }}
      >
        Bitmap ⮕ SVG
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
