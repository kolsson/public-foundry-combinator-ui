function transformInferences(inferenceGlyphRecord, source, data) {
  const inferences = [];

  let index = 0;
  for (let glyph in data) {
    const svg = data[glyph];

    inferences.push({
      index: index++,
      glyph,
      uni: glyph.charCodeAt(0),
      svg,
      source,
      sourceFontName: inferenceGlyphRecord.sourceFontName,
      sourceModelName: inferenceGlyphRecord.sourceModelName,
      sourceModelSuffix: inferenceGlyphRecord.sourceModelSuffix
    });
  }

  return inferences;
}

export async function loadFontInferences(
  host,
  currInferenceGlyphRecord,
  inferenceGlyphRecord,
  dispatch
) {
  dispatch(["loadInference", { inferenceGlyphRecord }]);
  const ms = inferenceGlyphRecord.sourceModelSuffix || "0";

  const api = `${host}/infer/${inferenceGlyphRecord.sourceModelName}/${ms}/${inferenceGlyphRecord.sourceFontName}/${inferenceGlyphRecord.glyph}`;

  try {
    const result = await fetch(api);
    const data = (await result.json()).inferences;
    const inferences = transformInferences(
      inferenceGlyphRecord,
      "fontInference", // font -> fontInference (1 step aaway from the font)
      data
    );

    dispatch(["loadedInferences", { inferences }]);
  } catch (error) {
    // test for 400 error

    dispatch([
      "loadedInferencesFailed",
      { inferenceGlyphRecord: currInferenceGlyphRecord }
    ]);
    alert(error);
  }
}

export async function loadSvgInferences(
  host,
  currInferenceGlyphRecord,
  inferenceGlyphRecord,
  dispatch
) {
  dispatch(["loadInference", { inferenceGlyphRecord }]);
  const ms = inferenceGlyphRecord.sourceModelSuffix || "0";

  const api = `${host}/infer/${inferenceGlyphRecord.sourceModelName}/${ms}/${
    inferenceGlyphRecord.glyph
  }?svg=${encodeURIComponent(inferenceGlyphRecord.svg)}`;

  try {
    const result = await fetch(api);
    const data = (await result.json()).inferences;
    const inferences = transformInferences(
      inferenceGlyphRecord,
      "svgInference", // font -> fontInference -> svgInference (so 2+ steps away from the font)
      data
    );

    dispatch(["loadedInferences", { inferences }]);
  } catch (error) {
    // test for 400 error

    dispatch([
      "loadedInferencesFailed",
      { inferenceGlyphRecord: currInferenceGlyphRecord }
    ]);
    alert(error);
  }
}
