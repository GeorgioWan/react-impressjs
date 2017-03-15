import React, { Component } from 'react';

import { Impress, Step } from './components';
//import { Impress, Step } from '../';

import './styles/_base.scss';

const data = {
  x: 900,
  y: 0,
  z: 400,
  rotateX: 0,
  rotateY: -45,
  rotateZ: 0,
  scale: 1
}, 
data2 = {
  x: 1300,
  y: 0,
  z: 1300,
  rotateX: 0,
  rotateY: -90,
  rotateZ: 0,
  scale: 1
},
data3 = {
  x: 1620,
  y: 350,
  z: 1300,
  rotateX: 90,
  rotateY: 0,
  rotateZ: 90,
  scale: 1
};

class App extends Component {
  render() {
    return (
      <Impress>
        <Step className={'slide'}>
          <h1>Hello, are u ready ?</h1>
          <p style={{textAlign: "right"}}>I'm <a href="https://github.com/GeorgioWan" target="_blank">oawan</a></p>
        </Step>
        <Step id={'step-2'} className={'slide'} data={data}>
          <p>This is <a href="https://github.com/impress/impress.js/">impress.js</a> build by <b>React!</b></p>
        </Step>
        <Step id={'step-3'} className={'slide'} data={data2}>
          <h3>If you like this repo, please like or fork this!!</h3>
        </Step>
        <Step id={'step-4'} data={data3}>
          <h2>Let's fire</h2>
          <h3>your</h3>
          <h1>creation &</h1>
          <h1>presentation</h1>
          <hr />
          <p style={{textAlign: "right"}}>Try it!!</p>
        </Step>
        <Step id={'overview'} data={{x: 0, y: 0, scale: 5}} />
      </Impress>
    );
  }
}

export default App;
