import React, { Component } from 'react';
import update from 'react/lib/update';
import { Step } from './';
import { toNumber, computeWindowScale, css, pfx, perspective, 
         translate, rotate, scale, throttle, getElementFromHash } from '../api';
         
import '../styles/_base.scss';

const body = document.body,
      ua = navigator.userAgent.toLowerCase();
      
const defaults = {
    width: 1024,
    height: 768,
    maxScale: 1,
    minScale: 0,
    perspective: 1000,
    transitionDuration: 1000
};

const rootStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "top left",
    transition: "all 0s ease-in-out",
    transformStyle: "preserve-3d"
};

let windowScale = null,
    config = null;
    
let _impressSupported,
    _lastHash = "",
    _stepsData = {},
    _activeStep;

export default class Impress extends Component {
    constructor(props){
        super(props);
        
        // impress & canvas state
        this.state = {
            activeStep: {},
            stepsData: {},
            rootStyles,
            canvasStyles: rootStyles,
            currentState: {
                x: 0, y: 0, z: 0,
                rotateX: 0, rotateY: 0, rotateZ: 0,
                scale: 1
            }
        };
    }
    componentWillMount(){
        // Init impress
        const { rootData } = this.props;
        this.init( rootData || {} );
    }
    componentDidMount(){
        this.setState( update( this.state, {
            activeStep: {
                $set: _activeStep
            },
            stepsData: {
                $set: _stepsData
            }
        }));
        
        // 2017/2/28 暫時想不到好方法
        this.goto( _activeStep, 500 );
        
        document.addEventListener( "keyup", throttle((e) => {
            if ( e.keyCode === 9 ||
               ( e.keyCode >= 32 && e.keyCode <= 34 ) ||
               ( e.keyCode >= 37 && e.keyCode <= 40 ) ) {
                switch ( e.keyCode ) {
                    case 33: // Page up
                    case 37: // Left
                    case 38: // Up
                             this.prev();
                             break;
                    case 9:  // Tab
                    case 32: // Space
                    case 34: // Page down
                    case 39: // Right
                    case 40: // Down
                             this.next();
                             break;
                    default:
                        break;
                }
            }
                
            
            //this.state.stepsData[ Object.keys( this.state.stepsData ) ]
        }, 250), false );
        
        window.addEventListener( "resize", throttle(() => {
            this.goto( this.state.activeStep, 500 );
        }, 250), false );
        
        window.addEventListener( "hashchange", throttle(() => {
            if ( window.location.hash !== _lastHash )
                this.goto( getElementFromHash( _stepsData ), 500 );
        }, 250), false );
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", function( event ) {
            console.log(event.keyCode);
        }, false);
    }
    
    init( rootData ){
        // Check impress support or not.
        _impressSupported =
            // Browser should support CSS 3D transtorms
            ( pfx( "perspective" ) !== null ) &&
            // Browser should support `classList` and `dataset` APIs
            ( body.classList ) &&
            ( body.dataset ) &&
            // But some mobile devices need to be blacklisted,
            // because their CSS 3D support or hardware is not
            // good enough to run impress.js properly, sorry...
            ( ua.search( /(iphone)|(ipod)|(android)/ ) === -1 );
      
        if ( !_impressSupported ) {
            // We can't be sure that `classList` is supported
            body.className += " impress-not-supported ";
        } else {
            body.classList.remove( "impress-not-supported" );
            body.classList.add( "impress-supported" );
        }
        // Config
        config = {
            width: toNumber( rootData.width, defaults.width ),
            height: toNumber( rootData.height, defaults.height ),
            maxScale: toNumber( rootData.maxScale, defaults.maxScale ),
            minScale: toNumber( rootData.minScale, defaults.minScale ),
            perspective: toNumber( rootData.perspective, defaults.perspective ),
            transitionDuration: toNumber(
              rootData.transitionDuration, defaults.transitionDuration
            )
        };
        windowScale = computeWindowScale( config );
        // HTML height
        document.documentElement.style.height = "100%";
        // Body style
        css( body, {
            height: "100%",
            overflow: "hidden"
        } );
        
        this.setState( update( this.state, { 
            rootStyles: {
                $merge: {
                    'transform': perspective( config.perspective / windowScale ) + scale( windowScale )
                }
            }
        }));
        
        body.classList.add( "impress-enabled" );
    }
    
    initStep( step ){
        if ( !_activeStep )
            _activeStep = step;
            
        _stepsData = update( _stepsData, {
            $merge: {
                [ step.id ]: {
                    id: step.id,
                    className: step.className,
                    data: step.data,
                    duration: step.duration
                }
            }
        });
    }
    
    goto( step, duration = 1000 ) {
        let { activeStep, currentState } = this.state;
        
        window.scrollTo(0, 0);
        
        if( activeStep )
            body.classList.remove("impress-on-" + activeStep.id);
        
        body.classList.add("impress-on-" + step.id);
        
        let target = {
            x: -step.data.x,
            y: -step.data.y,
            z: -step.data.z,
            rotateX: -step.data.rotateX,
            rotateY: -step.data.rotateY,
            rotateZ: -step.data.rotateZ,
            scale: 1 / step.data.scale
        };
        
        let zoomin = target.scale >= currentState.scale;
        
        duration = toNumber( duration, config.transitionDuration );
        let delay = ( duration / 2 );
        
        if ( step.id === activeStep.id )
            windowScale = computeWindowScale( config );
        
        let targetScale = target.scale * windowScale;
        
        this.setState( update( this.state, {
          activeStep: {
              $set: step
          },
          currentState: {
              $set: target
          },
          rootStyles: {
              transform: {
                  $set: perspective( config.perspective / targetScale ) + scale( targetScale ),
              },
              transitionDuration: {
                  $set: duration + "ms"
              },
              transitionDelay: {
                  $set: ( zoomin ? delay : 0 ) + "ms" 
              }
          },
          canvasStyles: {
              transform: {
                  $set: rotate( target, true ) + translate( target ),
              },
              transitionDuration: {
                  $set: duration + "ms"
              },
              transitionDelay: {
                  $set: ( zoomin ? 0 : delay ) + "ms"
              }
          }
        }));
        
        window.location.hash = _lastHash = "#/" + step.id;
    }
    prev(){
        const { activeStep } = this.state;
        const stepsDataEntries = Object.entries( _stepsData );
        let prev = stepsDataEntries.findIndex( ([k, v]) => { return k === activeStep.id } ) - 1;
        prev = prev >= 0 ? stepsDataEntries[ prev ][1] : stepsDataEntries[ stepsDataEntries.length - 1 ][1];
            
        this.goto( prev, prev.duration );
    }
    next(){
        const { activeStep } = this.state;
        const stepsDataEntries = Object.entries( _stepsData );
        let next = stepsDataEntries.findIndex( ([k, v]) => { return k === activeStep.id } ) + 1;
        next = next < stepsDataEntries.length ? stepsDataEntries[ next ][1] : stepsDataEntries[ 0 ][1];
            
        this.goto( next, next.duration );
    }
    
    render() {
        const { activeStep, rootStyles, canvasStyles } = this.state;
        const steps = this.props.children || [ <Step><p>Oops! there is no Steps.</p></Step> ];
        
        return (
            <div id="impress" style={ rootStyles }>
                <div style={ canvasStyles }>
                    {
                        _impressSupported ?
                        steps.map( (step, index) => 
                            <Step {...step.props}
                                  key={index}
                                  activeStep={ activeStep }
                                  initStep={this.initStep.bind(this)}
                                  goto={this.goto.bind(this)}>
                                {step.props.children}
                            </Step>
                        ) 
                        :
                        <h1>Sorry, your media or browser doesn't support this.</h1>
                    }
                </div>
            </div>
        );
    }
}