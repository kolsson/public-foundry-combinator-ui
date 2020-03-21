import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { StateContext } from "../core/context";
import { loadFont } from "../core/fonts";
import { loadFontInferences, loadSvgInferences } from "../core/inferences";

export function ModelsDropdown(props) {
  const [
    {
      host,
      modelList,
      modelName,
      modelSuffix,
      inferenceType,
      bitmapDepth,
      inferenceGlyphRecord
    },
    dispatch
  ] = React.useContext(StateContext);

  let modelNameAndSuffix = modelName;
  if (!!modelSuffix)
    modelNameAndSuffix = `${modelNameAndSuffix}_${modelSuffix}`;

  return (
    <DropdownButton
      variant="outline-primary"
      id="dropdown-basic-button"
      title={`Model: ${modelNameAndSuffix}`}
      onSelect={ek => {
        const [newModelName, newModelSuffix] = modelList[ek].split("_");

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
    {
      host,
      fontList,
      modelName,
      modelSuffix,
      fontName,
      inferenceType,
      bitmapDepth
    },
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
                inferenceType,
                bitmapDepth
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

export function HostsDropdown(props) {
  const [{ hostList, host }, dispatch] = React.useContext(StateContext);

  return (
    <DropdownButton
      alignRight
      variant="outline-primary"
      id="dropdown-basic-button"
      title={`Host: ${hostList.find(h => h.url === host).name}`}
      onSelect={ek => {
        const newHost = hostList[ek].url;

        if (host !== newHost) {
          const fetchData = async () => {
            // for now we don't update anything except our host
            dispatch(["setHost", { host: newHost }]);
            localStorage.setItem("host", newHost);
          };

          fetchData();
        }
      }}
    >
      {hostList.map((option, i) => (
        <Dropdown.Item key={i} eventKey={i}>
          {option.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export function BitmapDepthDropdown(props) {
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
    <DropdownButton
      alignRight
      variant="outline-primary"
      id="dropdown-basic-button"
      title={`Bitmap Depth: ${bitmapDepth}-bit`}
      onSelect={ek => {
        const fetchData = async () => {
          const bitmapDepth = ek;

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
      <Dropdown.Item key={8} eventKey={8}>
        8-bit
      </Dropdown.Item>
      <Dropdown.Item key={1} eventKey={1}>
        1-bit
      </Dropdown.Item>
    </DropdownButton>
  );
}
