import React, { Component } from 'react';
import update from 'react/lib/update';
import { toNumber, computeWindowScale, css, pfx, perspective, 
         translate, rotate, scale, throttle, getElementFromHash } from './util';

import  Progress  from './Progress';

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
    _activeStep,
    _idHelper = 1;

export default class Impress extends Component {
    constructor(props){
        super(props);
        
        const { hintOn, hintMessage, fallbackMessage, progressOn } = props;
        
        // impress & canvas state
        this.state = {
            activeStep: {},
            rootStyles,
            canvasStyles: rootStyles,
            currentState: {
                x: 0, y: 0, z: 0,
                rotateX: 0, rotateY: 0, rotateZ: 0,
                scale: 1
            },
            fallbackMessage: fallbackMessage || <p>Your browser <b>doesn't support the features required</b> by React-impressJS, so you are presented with a simplified version of this presentation.</p>,
            hintOn: hintOn !== undefined ? hintOn : true,
            hintMessage: hintMessage || <p>Use a spacebar or arrow keys to navigate</p>,
            progressOn: progressOn !== undefined ? progressOn : false
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
            }
        }));
        
        // 2017/2/28 暫時想不到好方法
        if ( _impressSupported )
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
        }, 250), false );
        
        window.addEventListener( "resize", throttle(() => {
            if ( _impressSupported )
                this.goto( this.state.activeStep, 500 );
        }, 250), false );
        
        window.addEventListener( "hashchange", throttle(() => {
            if ( window.location.hash !== _lastHash )
                this.goto( getElementFromHash( _stepsData ), 500 );
        }, 250), false );
    }
    componentWillReceiveProps( nextPorps ){
        this.setState({
            fallbackMessage: nextPorps.fallbackMessage,
            hintOn: nextPorps.hintOn,
            hintMessage: nextPorps.hintMessage
        });
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
    
    stepComponent( step, index ){
        const { activeStep } = this.state;
        
        return React.cloneElement( step, {
                    key: index,
                    idHelper: step.props.id ? '' : _idHelper++,
                    activeStep: activeStep,
                    initStep: this.initStep.bind(this),
                    goto: this.goto.bind(this)
                }, step.props.children );
    }
    
    render() {
        const { rootStyles, canvasStyles, activeStep, hintOn, hintMessage, fallbackMessage, progressOn } = this.state;
        const steps = React.Children.map( this.props.children, this.stepComponent.bind(this) );
        const stepsTota = React.Children.count(this.props.children) ;
    
        return (
            <div id="react-impressjs">
                <div id="impress" style={ rootStyles }>
                    <div style={ canvasStyles }>
                    { 
                        _impressSupported ? steps : 
                        <div className="fallback-message">{ fallbackMessage }</div>
                    }
                    </div>
                </div>
                { hintOn ? <div className="hint">{ hintMessage }</div> : '' }
                { progressOn ? <Progress stepsData={ _stepsData } 
                                         activeStep={ activeStep } 
                                         stepsTotal={ stepsTota } /> : '' }
            </div>
        );
    }
}