import { loadInputs } from "./inputs";
import { loadFontInferences } from "./inferences";

export async function loadFontList(host, dispatch) {
  dispatch(["loadingFontList"]);
  const result = await fetch(`${host}/fonts`);

  console.log(result);
  const fontList = (await result.json()).fonts;
  dispatch(["loadedFontList", { fontList }]);

  return fontList;
}

export async function loadFont(
  host,
  modelName,
  modelSuffix,
  fontName,
  dispatch
) {
  const inferenceGlyph = await loadInputs(host, fontName, dispatch);
  await loadFontInferences(
    host,
    modelName,
    modelSuffix,
    fontName,
    inferenceGlyph,
    dispatch
  );
}
