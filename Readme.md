# Setting up the Project

```
npm install
npm start
```
Now open up [http://localhost:2304/livetracking](http://localhost:2304/livetracking)

> Note that "npm start" will auto-build bundle.js and index.css and keep them in __memory__ rather than actually putting them in the given directory. So you won't see the generated files in the destination directory.


## For Debug mode

Add this json config in localStorage.
remoteServerUrl is for where should the ajax requests hit in case you wish to set it/override it.
```
"debugConfig": {
  "debug": true,
  "remoteJsUrl": "http://localhost:2304/dist/"
  "remoteServerUrl": <server url>
}
```

## For production:
```
npm install
npm run build
```


## Regarding this project:
- Entry point is `index.js`

## Loading svg icons, fonts, images.

#### SVG icons
- Add your svg icons in the folder `res/svg/`.
- The config file svg-icons.font.js in the root directory which would look like this:
```javascript
module.exports = {
  fontName: "svgicons",
  files: [
    "./res/svg/*.svg"
  ],
  baseClass: "svgicons",
  classPrefix: "svgicons-"
};
```
- Say you added `foo.svg` in the folder. Now just use `<span class="svgicons svgicons-foo"/>"` in your component, and save. If npm start is running, it'll auto-build and the svg will be included and used.

>__How this works__: See webpack.config.js. You'll find the loader fontgen being used along with url-loader. Currently embed is set true, so the created fonts are embedded in the final css file as data-uri.
 
#### Fonts
- For custom font after adding it in the directory `res/fonts/`, simple create a @font-face declaration in the suitable scss file and use the ___path relative to the output css file after bundling___.
>__How this works__: Webpack's `url-loader` loads these fonts. See webpack.config.js for the current configuration.

#### Images
- Add the image in `res/images/`
- Use it with `background: url()` in your scss file and use the ___path relative to the output css file after bundling___ inside url.
>__How this works__: Webpacks's `url-loader` loads these images. See webpack.config.js for the current configuration. If the image is smaller than 10kb it'll be embedded as data-uri. (See webpack.config.js)

## React tips:

- Comments: {/* add comment like this */}
- To dynamically navigate to a route, first add this parallel to the `render()` function:
    ```javascript
    contextTypes: {
      router: React.PropTypes.object
    }
    ```
    then use this: `this.context.router.push("/whatever/route");`
## Webpack tips:

- For debugging while working on chrome, add source map by adding `devtool: '#source-map'` in `webpack.config.js`. Find more options [here](https://webpack.github.io/docs/configuration.html#devtool)
- Whenever you make any changes in webpack config do stop npm start and run it again for the change to take effect.