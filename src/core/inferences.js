import { generateId } from "../core/context";

function transformInferences(
  modelName,
  modelSuffix,
  inferenceType,
  inferenceGlyphRecord,
  source,
  data
) {
  const inferences = [];

  let index = 0;
  for (let glyph in data) {
    inferences.push({
      gid: generateId(),
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg: inferenceType === "svg" ? data[glyph] : "",
      bitmap: inferenceType === "bitmap" ? data[glyph] : "",
      source,
      sourceGid: inferenceGlyphRecord.gid,
      sourceFontName: inferenceGlyphRecord.sourceFontName,
      modelName,
      modelSuffix
    });
  }

  return inferences;
}

export async function loadFontInferences(
  { host, modelName, modelSuffix, inferenceType, inferenceGlyphRecord },
  dispatch,
  currInferenceGlyphRecord
) {
  dispatch(["loadInference", { inferenceGlyphRecord }]);
  const ms = modelSuffix || "-";
  const api = `${host}/infer/${inferenceType}/models-${modelName}/${ms}/${inferenceGlyphRecord.sourceFontName}/${inferenceGlyphRecord.glyph}`;

  try {
    const result = await fetch(api);
    const data = await result.json();
    if (data.error) throw data.error;

    const inferences = transformInferences(
      modelName,
      modelSuffix,
      inferenceType,
      inferenceGlyphRecord,
      "inference", // font -> fontInference (1 step away from the font)
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
  { host, modelName, modelSuffix, inferenceType, inferenceGlyphRecord },
  dispatch,
  currInferenceGlyphRecord
) {
  if (inferenceType === "bitmap") {
    alert("Cannot infer a bitmap from a bitmap inference!");
  } else {
    dispatch(["loadInference", { inferenceGlyphRecord }]);
    const ms = modelSuffix || "-";
    const api = `${host}/infer/${inferenceType}/models-${modelName}/${ms}/${inferenceGlyphRecord.glyph}`;

    try {
      // must use POST
      const result = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          svg: inferenceGlyphRecord.svg
        })
      });

      const data = await result.json();
      if (data.error) throw data.error;

      const inferences = transformInferences(
        modelName,
        modelSuffix,
        inferenceType,
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
}
