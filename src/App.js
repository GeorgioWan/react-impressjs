import React, { Component } from 'react';

import { Impress, Step } from './components';

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
          <h1>Are u ready ?</h1>
          <a href="https://www.facebook.com/georgiowan" target="_blank">oawan</a>
        </Step>
        <Step id={'test'} className={'slide'} data={data}>
          <h1>5566</h1>
        </Step>
        <Step id={'test2'} className={'slide'} data={data2}>
          <h1>7788</h1>
        </Step>
        <Step id={'test3'} className={'slide'} data={data3}>
          <h1>9487</h1>
          <hr />
          <p>94狂r!</p>
        </Step>
        <Step id={'overview'} data={{x: 0, y: 0, scale: 5}} />
      </Impress>
    );
  }
}

export default App;
