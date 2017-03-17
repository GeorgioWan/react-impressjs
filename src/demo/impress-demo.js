import React from 'react';

export default [
  {
      id:"bored",
      className:"slide",
      data:{
          x:-1000, 
          y:-1500
      },
      content:[
          <q>Aren’t you just <b>bored</b> with all those slides-based presentations?</q>
      ]
  },
  {
      className:"slide",
      data:{
          y:-1500
      },
      content:[
          <q>Don’t you think that presentations given <strong>in modern browsers</strong> shouldn’t <strong>copy the limits</strong> of ‘classic’ slide decks?</q>
      ]
  },
  {
      className:"slide",
      data:{
          x:1000,
          y:-1500
      },
      content:[
          <q>Would you like to <strong>impress your audience</strong> with <strong>stunning visualization</strong> of your talk?</q>
      ]
  },
  {
      id:"title",
      data:{
          scale: 4
      },
      content:[
          <span className="try">then you should try</span>,
          <h1>impress.js<sup>*</sup></h1>,
          <span className="footnote"><sup>*</sup> no rhyme intended</span>
      ]
  },
  {
      id: "its",
      data:{
          x:850,
          y:3000,
          rotateZ:90,
          scale:5
      },
      content:[
          <p>It’s a <strong>presentation tool</strong> <br/>
          inspired by the idea behind <a href="http://prezi.com" target="_blank" rel="nofollow">prezi.com</a> <br/>
          and based on the <strong>power of CSS3 transforms and transitions</strong> in modern browsers.</p>
      ]
  },
  {
      id: "big",
      data:{
          x:3500,
          y:2100,
          rotateZ:180,
          scale:6
      },
      content:[
          <p>visualize your <b>big</b> <span className="thoughts">thoughts</span></p>
      ]
  },
  {
      id: "tiny",
      data:{
          x:2825,
          y:2325,
          z:-3000,
          rotateZ:300,
          scale:1
      },
      content:[
          <p>and <b>tiny</b> ideas</p>
      ]
  },
  {
      id: "ing",
      data:{
          x:3500,
          y:-850,
          rotateZ:270,
          scale:6
      },
      content:[
          <p>by <b className="positioning">positioning</b>, <b className="rotating">rotating</b> and <b className="scaling">scaling</b> them on an infinite canvas</p>
      ]
  },
  {
      id: "imagination",
      data:{
          x:6700,
          y:-300,
          scale:6
      },
      content:[
          <p>the only <b>limit</b> is your <b className="imagination">imagination</b></p>
      ]
  },
  {
      id: "source",
      data:{
          x:6300,
          y:2000,
          rotateZ:20,
          scale:4
      },
      content:[
          <p>want to know more?</p>,
          <q><a href="http://github.com/bartaz/impress.js" target="_blank" rel="nofollow">use the source</a>, Luke!</q>
      ]
  },
  {
      id: "one-more-thing",
      data:{
          x:6000,
          y:4000,
          scale:2
      },
      content:[
          <p>one more thing...</p>
      ]
  },
  {
      id: "its-in-3d",
      data:{
          x:6200,
          y:4300,
          z:-100,
          rotateX:-40,
          rotateY:10,
          scale:2
      },
      content:[
          <p><span className="have">have</span> <span className="you">you</span> <span className="noticed">noticed</span> <span className="its">it’s</span> <span className="in">in</span> <b>3D<sup>*</sup></b>?</p>,
          <span className="footnote">* beat that, prezi ;)</span>
      ]
  },
  {
      id: "by-react-impressjs",
      data:{
          x:3000,
          y:6000,
          z:4000,
          rotateX:-70,
          rotateY:30,
          scale:10
      },
      content:[
          <p>This demo of impress.js is made via <a href="https://github.com/GeorgioWan/react-impressjs" target="_blank"><b>React-impressJS</b></a></p>
      ]
  }
];