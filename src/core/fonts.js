export async function loadFontList(host, dispatch) {
  dispatch(["loadingFontList"]);
  const result = await fetch(`${host}/fonts`);

  console.log(result);
  const fontList = (await result.json()).fonts;
  dispatch(["loadedFontList", { fontList }]);

  return fontList;
}
