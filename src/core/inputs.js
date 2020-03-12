function transformInputs(fontName, data) {
    const inputs = [];
    let inferenceGlyph = "";
  
    let index = 0;
    for (let glyph in data) {
      const svg = data[glyph];
  
      // set our first inference glyph
      if (inferenceGlyph === "" && svg !== "") {
        inferenceGlyph = glyph;
      }
  
      inputs.push({
        index: index++,
        glyph,
        uni: glyph.charCodeAt(0),
        svg,
        source: "input",
        sourceFontName: fontName
      });
    }
  
    return [inputs, inferenceGlyph];
  }
  
  export async function loadInputs(host, fontName, dispatch) {
    dispatch(["loadFont", { fontName }]);
  
    const result = await fetch(`${host}/inputs/${fontName}`);
    const data = (await result.json()).inputs;
    const [inputs, inferenceGlyph] = transformInputs(fontName, data);
  
    dispatch(["loadedInputs", { inputs }]);
  
    return inferenceGlyph;
  }
  