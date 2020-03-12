function transformInferences(fontName, data) {
  const inferences = [];

  let index = 0;
  for (let glyph in data) {
    const svg = data[glyph];

    inferences.push({
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg,
      source: "inference",
      sourceFontName: fontName
    });
  }

  return inferences;
}

export async function loadFontInferences(
  host,
  modelName,
  modelSuffix,
  fontName,
  inferenceGlyph,
  dispatch
) {
  dispatch(["loadInference", { inferenceGlyph }]);
  const ms = modelSuffix || "0";

  const api = `${host}/infer/${modelName}/${ms}/${fontName}/${inferenceGlyph}`;

  const result = await fetch(api);
  const data = (await result.json()).inferences;
  const inferences = transformInferences(fontName, data);

  dispatch(["loadedInferences", { inferences }]);
}
