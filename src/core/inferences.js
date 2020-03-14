import { generateId } from "../core/context";

function transformInferences(inferenceGlyphRecord, source, data) {
  const inferences = [];

  let index = 0;
  for (let glyph in data) {
    const svg = data[glyph];

    inferences.push({
      gid: generateId(),
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg,
      source,
      sourceGid: inferenceGlyphRecord.gid,
      sourceFontName: inferenceGlyphRecord.sourceFontName,
      sourceModelName: inferenceGlyphRecord.sourceModelName,
      sourceModelSuffix: inferenceGlyphRecord.sourceModelSuffix
    });
  }

  return inferences;
}

export async function loadFontInferences(
  host,
  modelName,
  modelSuffix,
  currInferenceGlyphRecord,
  inferenceGlyphRecord,
  dispatch
) {
  dispatch(["loadInference", { inferenceGlyphRecord }]);
  const ms = modelSuffix || "-";

  const api = `${host}/infer/${modelName}/${ms}/${inferenceGlyphRecord.sourceFontName}/${inferenceGlyphRecord.glyph}`;

  try {
    const result = await fetch(api);
    const data = await result.json();
    if (data.error) throw data.error;

    const inferences = transformInferences(
      inferenceGlyphRecord,
      "inference", // font -> fontInference (1 step aaway from the font)
      data.inferences
    );

    dispatch(["loadedInferences", { inferences }]);
  } catch (error) {
    dispatch([
      "loadedInferencesFailed",
      { inferenceGlyphRecord: currInferenceGlyphRecord }
    ]);
    alert(error);
  }
}

export async function loadSvgInferences(
  host,
  modelName,
  modelSuffix,
  currInferenceGlyphRecord,
  inferenceGlyphRecord,
  dispatch
) {
  dispatch(["loadInference", { inferenceGlyphRecord }]);
  const ms = modelSuffix || "-";

  const api = `${host}/infer/${modelName}/${ms}/${
    inferenceGlyphRecord.glyph
  }?svg=${encodeURIComponent(inferenceGlyphRecord.svg)}`;

  try {
    const result = await fetch(api);
    const data = await result.json();
    if (data.error) throw data.error;

    const inferences = transformInferences(
      inferenceGlyphRecord,
      "inference", // font -> fontInference -> svgInference (so 2+ steps away from the font)
      data.inferences
    );

    dispatch(["loadedInferences", { inferences }]);
  } catch (error) {
    dispatch([
      "loadedInferencesFailed",
      { inferenceGlyphRecord: currInferenceGlyphRecord }
    ]);
    alert(error);
  }
}
