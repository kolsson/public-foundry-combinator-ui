import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { StateContext } from "../core/context";
import { loadFont } from "../core/fonts";
import { loadFontInferences, loadSvgInferences } from "../core/inferences";

export function ModelsDropdown(props) {
  const [
    { host, modelList, modelName, modelSuffix, inferenceType, inferenceGlyphRecord },
    dispatch
  ] = React.useContext(StateContext);

  return (
    <DropdownButton
      variant="outline-primary"
      id="dropdown-basic-button"
      title="Model"
      onSelect={ek => {
        const [newModelName, newModelSuffix] = modelList[
          ek
        ].split("_");

        if (newModelName !== modelName || newModelSuffix !== modelSuffix) {
          const fetchData = async () => {
            const modelName = newModelName;
            const modelSuffix = newModelSuffix;

            dispatch(["setModel", { modelName, modelSuffix }]);

            inferenceGlyphRecord.modelName = newModelName;
            inferenceGlyphRecord.modelSuffix = newModelSuffix;

            // we can't unwind a model change right now (nor should we need to)
            // so we don't pass a currInferenceGlyphRecord

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
        }
      }}
    >
      {modelList.map((option, i) => (
        <Dropdown.Item key={i} eventKey={i}>
          {option}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export function FontsDropdown(props) {
  const [
    { host, fontList, modelName, modelSuffix, fontName, inferenceType },
    dispatch
  ] = React.useContext(StateContext);

  return (
    <DropdownButton
      variant="outline-primary"
      id="dropdown-basic-button"
      title="Font"
      onSelect={ek => {
        if (fontName !== fontList[ek]) {
          const fetchData = async () => {
            const fontName = fontList[ek]; // override our context
            await loadFont(
              {
                host,
                modelName,
                modelSuffix,
                fontName,
                inferenceType
              },
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
  );
}
