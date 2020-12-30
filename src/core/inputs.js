import { generateId, glyphCharacters } from "../core/context";


function transformInputs(modelName, modelSuffix, fontName, data) {
  const inputs = [];
  let inferenceGlyphRecord = null;

  for (let glyph in data) {
    const svg = data[glyph];

    // generate a new record

    const glyphRecord = {
      gid: generateId(),
      index: glyphCharacters.indexOf(glyph),
      glyph,
      uni: glyph.charCodeAt(0),
      svg,
      bitmap: "",
      source: "font",
      sourceGid: -1,
      sourceFontName: fontName,
      modelName: "",
      modelSuffix: ""
    };

    // find our first possible inference glyph record
    if (inferenceGlyphRecord === null && svg !== "") {
      inferenceGlyphRecord = { ...glyphRecord };
      inferenceGlyphRecord.modelName = modelName;
      inferenceGlyphRecord.modelSuffix = modelSuffix;
    }

    inputs.push(glyphRecord);
  }

  return [inputs, inferenceGlyphRecord];
}

export async function loadInputs(
  { host, modelName, modelSuffix, fontName },
  dispatch
) {
  dispatch(["loadFont", { fontName }]);

  const result = await fetch(`${host}/inputs/${fontName}`);
  const data = (await result.json()).inputs;
  const [inputs, inferenceGlyphRecord] = transformInputs(
    modelName,
    modelSuffix,
    fontName,
    data
  );

  dispatch(["loadedFont", { inputs }]);

  return inferenceGlyphRecord;
}
