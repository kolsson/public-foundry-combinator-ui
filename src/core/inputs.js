function transformInputs(modelName, modelSuffix, fontName, data) {
  const inputs = [];
  let inferenceGlyphRecord = null;

  let index = 0;
  for (let glyph in data) {
    const svg = data[glyph];

    const glyphRecord = {
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg,
      source: "font",
      sourceFontName: fontName,
      sourceModelName: modelName,
      sourceModelSuffix: modelSuffix
    };

    // find our first possible inference glyph record
    if (inferenceGlyphRecord === null && svg !== "") {
      inferenceGlyphRecord = glyphRecord;
    }

    inputs.push(glyphRecord);
  }

  return [inputs, inferenceGlyphRecord];
}

export async function loadInputs(
  host,
  modelName,
  modelSuffix,
  fontName,
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
