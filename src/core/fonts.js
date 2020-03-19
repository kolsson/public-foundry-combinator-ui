import { loadInputs } from "./inputs";
import { loadFontInferences } from "./inferences";

export async function loadFontList(host, dispatch) {
  dispatch(["loadingFontList"]);
  const result = await fetch(`${host}/fonts`);
  const data = await result.json();

  const fontList = data.fonts;
  fontList.sort();

  dispatch(["loadedFontList", { fontList }]);

  return fontList;
}

export async function loadFont(
  { host, modelName, modelSuffix, fontName, inferenceType },
  dispatch
) {
  const inferenceGlyphRecord = await loadInputs(
    { host, modelName, modelSuffix, fontName },
    dispatch
  );

  // we can't unwind a font change right now (nor should we need to)
  // so we don't pass a currInferenceGlyphRecord

  await loadFontInferences(
    { host, modelName, modelSuffix, inferenceType, inferenceGlyphRecord },
    dispatch,
    inferenceGlyphRecord
  );
}
