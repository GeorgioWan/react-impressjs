# React-impressJS

impress.js via React :tada:

[![NPM version][npm-image]][npm-url]
[![NPM download][npm-download-image]][npm-download-url]
[![Build Status][travis-image]][travis-url]
[![LICENCE][licence-image]][licence-url]

[npm-image]: https://img.shields.io/npm/v/react-impressjs.svg
[npm-url]: https://www.npmjs.com/package/react-impressjs
[travis-image]: https://travis-ci.org/GeorgioWan/react-impressjs.svg?branch=master
[travis-url]: https://travis-ci.org/GeorgioWan/react-impressjs
[licence-image]: https://img.shields.io/npm/l/react-impressjs.svg
[licence-url]: https://github.com/GeorgioWan/react-impressjs/blob/master/LICENSE
[npm-download-image]: https://img.shields.io/npm/dm/react-impressjs.svg
[npm-download-url]: https://www.npmjs.com/package/react-impressjs

## Why React-impressJS

Easy to create an impressive **Slide**/**Introduction**/**Presentation** in ReactJS.

## Install

[![NPM install](https://nodei.co/npm/react-impressjs.png)](https://www.npmjs.com/package/react-impressjs)

## Feature

### Quick Navigation

#### Navigation on Mobile devise (YES! We provide mobile browser now :tada:)

Just **Swipe** to navigate:

`swipe right`: Go to the previous Step.

`swipe left`: Go to the next Step.

#### Navigation on PC/Laptop

You can use **Spacebar** or **Arrow keys** to navigate, and here's all the keys for navigation:

`←` or `↑` or `PageUp`: Go to the previous Step.

`→` or `↓` or `Space` or `PageDown`: Go to the next Step.

`Home`: Go to the first Step.

`End`: Go to the last Step.

> p.s. You can also **Click** the Step directly.

### Progress (Step Counter)

Provide **progress bar** and **Slide Counter** (current/total number), let presentation more clearly.

### Hash Permalinks

You can navigate to the Step you want with `#/step-id`.

## Usage

### Components

**React-impressJS** have two components: **`<Impress />`** and **`<Step />`**, as same as [**impress.js**](https://github.com/impress/impress.js/).

**`<Impress />`** contains the **root of impress** and the **camera**, then put **`<Step />`** inside impress component, magic happens :sparkles:

> What's **impress.js**!? 
>
> It's an awesome presentation framework power of CSS3 transorms and transitions, please check [THIS](https://github.com/impress/impress.js) first!!

## API

### Impress props

| name     | type    | description     | default      |
|----------|----------------|----------|--------------|
|rootData | Object | setting impress basic config | **defaults** |
|fallbackMessage | String or Element | fallback message is only visible when there is `impress-not-supported` | - |
|hint | Boolean | display hint or not | **true** |
|hintMessage | String or Element | hint for presentation | - |
|progress | Boolean | progress of presentation | **false** |

```js
const defaults = {
    width: 1024,
    height: 768,
    maxScale: 1,
    minScale: 0,
    perspective: 1000,
    transitionDuration: 1000
};
```

### Step props

| name     | type    | description     | default      |
|----------|----------------|----------|--------------|
|id | String | id of dom node | "step-" + ~**timestamp**~ **idHelper**(counter of Step) |
|className | String | additional css class of step dom node | '' |
|data | Object | setting Step's presentation | **defaultData** |
|duration | number | define duration of the transition in ms  | **1000** |

```js
const defaultData = {
  x: 0,       // as data-x
  y: 0,       // as data-y
  z: 0,       // as data-z
  rotateX: 0, // as data-rotate-x
  rotateY: 0, // as data-rotate-y
  rotateZ: 0, // as data-rotate and data-rotate-z
  scale: 1    // as data-scale
};
```

### Basic Use

```jsx
import { Impress, Step } from 'react-impressjs';
// styles of react-impressjs
import 'react-impressjs/styles/react-impressjs.css';

<Impress 
    progress={true}
    fallbackMessage={<p>Sorry, your <b>device or browser</b> couldn't support well.</p>}
    >
    <Step id={'overview'} /> 
    <Step id={'any_id'} className={'class_name'} />
    <Step className={'without_id_is_ok'} 
          data={
            {
                x:100,
                y:-100,
                scale:2
            }}/>
    <Step duration={1500}>
        <h1>Any Element write in Step!</h1>
        <hr />
        <p>Made by your <b>Creativity</b> !!</p>
    </Step>
</Impress>
```

## Style

Currently, you can use style of **impress.js** or **React-impressJS** in your app:

```js
// style of impress
import 'react-impressjs/styles/impress-demo.css';

// style of react-impressjs
import 'react-impressjs/styles/react-impressjs.css';
```

> We suggest you use the **React-impressJS**.
>
> If you have the better one, I'm glad you can share with us, expect yours! :grin::grin:

## Development

This Component is still under development, if you have any suggestion, you could tell me in [**issue**](https://github.com/GeorgioWan/react-impressjs/issues) or [**fork this repo**](https://github.com/GeorgioWan/react-impressjs#fork-destination-box) :muscle:

## License

**React-impressJS** is released under the [MIT license](https://github.com/GeorgioWan/react-impressjs/blob/master/LICENSE).


> This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
