import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

import { StateContext } from "../core/context";
import { loadFontInferences, loadSvgInferences } from "../core/inferences";

import { ControlBarSpacer, ControlBarLabel } from "./controlbar";

export function InferenceTypeToggleButtonGroup(props) {
  const [
    { host, modelName, modelSuffix, inferenceGlyphRecord, inferenceType },
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

export function BitmapTypeToggleButtonGroup(props) {
  const [
    {
      host,
      modelName,
      modelSuffix,
      inferenceType,
      bitmapType,
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
        defaultValue={bitmapType}
        onChange={val => {
          const fetchData = async () => {
            const bitmapType = val;

            dispatch(["setBitmapType", { bitmapType }]);

            if (inferenceGlyphRecord.source === "font") {
              await loadFontInferences(
                {
                  host,
                  modelName,
                  modelSuffix,
                  inferenceType,
                  bitmapType,
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
                  bitmapType,
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
