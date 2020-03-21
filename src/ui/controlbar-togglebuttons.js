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
        value="bitmap"
        variant="outline-primary"
        style={{ cursor: "pointer" }}
      >
        Bitmap
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export function BitmapDepthToggleButtonGroup(props) {
  const [
    {
      host,
      modelName,
      modelSuffix,
      inferenceType,
      bitmapDepth,
      inferenceGlyphRecord
    },
    dispatch
  ] = React.useContext(StateContext);

  if (inferenceType !== "bitmap") return <></>;

  return (
    <>
      <ControlBarLabel>Bitmap Depth:</ControlBarLabel>
      <ControlBarSpacer />
      <ToggleButtonGroup
        type="radio"
        name="type"
        defaultValue={bitmapDepth}
        onChange={val => {
          const fetchData = async () => {
            const bitmapDepth = val;

            dispatch(["setBitmapDepth", { bitmapDepth }]);

            if (inferenceGlyphRecord.source === "font") {
              await loadFontInferences(
                {
                  host,
                  modelName,
                  modelSuffix,
                  inferenceType,
                  bitmapDepth,
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
          value="8"
          variant="outline-primary"
          style={{ cursor: "pointer" }}
        >
          8-bit
        </ToggleButton>
        <ToggleButton
          value="1"
          variant="outline-primary"
          style={{ cursor: "pointer" }}
        >
          1-bit
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
