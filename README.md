# public-foundry-combinator-ui

## About Public Foundry

[Public Foundry](http://publicfoundry.ai) is a project by Yvan Martinez, Joshua Trees and Krister Olsson, supported by a Google Focused Research Award from the Artists and Machine Intelligence program and the Hoffmitz Milken Center for Typography at ArtCenter College of Design.

## About Public Foundry Combinator

The Public Foundry Combinator was built to test different machine learning models for font generation. This version was built specifically to work with Google's SVG-VAE model architecture: [SVG VAE: Generating Scalable Vector Graphics Typography](https://magenta.tensorflow.org/svg-vae)

The Combinator comprises a Flask-based [server](https://github.com/kolsson/public-foundry-combinator) component and React-based [client](https://github.com/kolsson/public-foundry-combinator-ui) component.

To begin, the user selects a model and a preprocessed font to use for inference. Next, the user can adjust the output format: SVG, inferred using the SVG decoder; Bitmap, inferred using the VAE; and Bitmap to SVG, inferred using the VAE and then postprocessed with potrace to create SVG glyphs. For the latter two output options bitmap depth and / or bitmap contrast can also be adjusted.

Once inference is complete the user can opt to ‘keep’ individual inferred glyphs to build their output typeface. An output typeface can include glyphs from any number of inferences across any number of models.

![Combinator](http://publicfoundry.ai/assets/combinator.png)

## Setup

1. Install the necessary dependencies
```
yarn install
```    
2. Edit the **src/core/context.js** *hostlist* variable to point to your Combinator [server](https://github.com/kolsson/public-foundry-combinator)

For example:
```
const hostList = [
 {
    name: "lyra",
    url: "http://10.0.1.210:5959/api"
  },
  {
    name: "localhost",
    url: "http://127.0.0.1:5959/api"
  }
];
```

## Usage

```
PORT=5858 yarn start
```

Inferences are made based on the settings at the top left of the Combinator window. These settings should be largely self explanatory.

Click a glyph in *Inputs* to make inferences based on that glyph. In SVG mode a glyph in *Inferences* can also be clicked, and an inference will be made. In practice the results are currently very poor.

To move an *Input* or *Inference* glyph to your *Outputs* click the checkmark below the glyph. To remove an *Output* glyph click the X mark below the glyph.

The circled character below a glyph can be clicked to download the SVG or bitmap version of the glyph.

The **i** mark below a glyph can be clicked for detailed information about the glyph.

The "Copy Outputs" button at the top right of the window will dump the data for all *Outputs* glyphs to the console, including SVG or bitmap data. SVG markup can be copied directly into a new file and once backslashes have been removed from before quote marks, saved as a readable SVG file.

## License

This project is open sourced under MIT license.
