import React, { Component } from 'react';
import update from 'react/lib/update';
import { toNumber, computeWindowScale, css, pfx, perspective, 
         translate, rotate, scale, throttle, getElementFromHash } from './util';

import Progress from './Progress';

const body = document.body,
      ua = navigator.userAgent.toLowerCase();
    
let _lastHash = "",
    _stepsData = {},
    _activeStep,
    _idHelper = 1;

export default class Impress extends Component {
    constructor(props){
        super(props);
        
        // Setting defaults with props attributes.
        const {
            rootData        = {},
            hint            = true, 
            hintMessage     = <p>Use <b>Spacebar</b> or <b>Arrow keys</b> to navigate</p>, 
            fallbackMessage = <p>Your browser <b>doesn't support the features required</b> by React-impressJS, so you are presented with a simplified version of this presentation.</p>, 
            progress        = false
        } = props;
        
        const rootStyles = {
            position: "absolute",
            top: "50%",
            left: "50%",
            transformOrigin: "top left",
            transition: "all 0s ease-in-out",
            transformStyle: "preserve-3d"
        };
        const currentState = {
            x: 0, y: 0, z: 0,
            rotateX: 0, rotateY: 0, rotateZ: 0,
            scale: 1
        };
        
        // <Impress /> State
        this.state = {
            /** Impress Config **/
            rootStyles,
            canvasStyles: rootStyles,
            currentState: currentState,
            windowScale: null,
            config: null,
            impressSupported: false,
            
            /** Step Status **/
            activeStep: {},
            
            /**
             * Public attributes provide to use.
             * 
             * @params: hint, hintMessage, fallbaceMessage, progress, rootData
             */
            rootData: rootData, // (not recommended)
            hint: hint,
            hintMessage: hintMessage,
            fallbackMessage: fallbackMessage,
            progress: progress
        };
    }
    componentWillMount(){
        // Init impress
        this.init();
    }
    componentDidMount(){
        const { impressSupported } = this.state;
        
        this.setState( update( this.state, {
            activeStep: {
                $set: _activeStep
            }
        }));
        
        // 2017/2/28 暫時想不到好方法
        if ( impressSupported )
            this.goto( _activeStep, 500 );
        
        document.addEventListener( "keyup", throttle((e) => {
            if ( e.keyCode === 9 ||
               ( e.keyCode >= 32 && e.keyCode <= 40 ) ) {
                switch ( e.keyCode ) {
                    case 35: // End
                            this.end();
                            break;
                    case 36: // Home
                            this.home();
                            break;
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
            if ( impressSupported )
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
            hint: nextPorps.hint,
            hintMessage: nextPorps.hintMessage
        });
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", function( event ) {
            console.log(event.keyCode);
        }, false);
    }
    
    init(){
        const { rootData } = this.state;
        let { windowScale, config, impressSupported } = this.state;
        
        const defaults = {
            width: 1024,
            height: 768,
            maxScale: 1,
            minScale: 0,
            perspective: 1000,
            transitionDuration: 1000
        };
        
        // Check impress support or not.
        impressSupported =
            // Browser should support CSS 3D transtorms
            ( pfx( "perspective" ) !== null ) &&
            // Browser should support `classList` and `dataset` APIs
            ( body.classList ) &&
            ( body.dataset );// &&
            // But some mobile devices need to be blacklisted,
            // because their CSS 3D support or hardware is not
            // good enough to run impress.js properly, sorry...
            //( ua.search( /(iphone)|(ipod)|(android)/ ) === -1 );
        
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
        // Window Scale
        windowScale = computeWindowScale( config );
        // HTML height
        document.documentElement.style.height = "100vh";
        document.documentElement.style.overflow = "hidden";
        // Body style
        css( body, {
            height: "100vh",
            overflow: "hidden",
            
            // mobile devise supported
            position: "relative"
        } );
        
        
        this.setState( update( this.state, {
            windowScale: { 
                $set: windowScale
            },
            config: { 
                $set: config 
            },
            impressSupported: {
                $set: impressSupported  
            },
            rootStyles: {
                $merge: {
                    'transform': perspective( config.perspective / windowScale ) + scale( windowScale )
                }
            }
        }));
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
    
    /**
     * Navigate to the SPECIFY Step.
     * 
     * @param {Step} step you want to navigate to.
     * @param {number} 1000 speed of navigation.
     */
    goto( step, duration = 1000 ) {
        const { config, activeStep, currentState } = this.state;
        let { windowScale } = this.state;
        
        window.scrollTo(0, 0);
        
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
    
    // Navigate to the PREVIOUS Step.
    prev(){
        const { activeStep } = this.state;
        const stepsDataEntries = Object.entries( _stepsData );
        let prev = stepsDataEntries.findIndex( ([k, v]) => { return k === activeStep.id } ) - 1;
        prev = prev >= 0 ? stepsDataEntries[ prev ][1] : stepsDataEntries[ stepsDataEntries.length - 1 ][1];
            
        this.goto( prev, prev.duration );
    }
    
    // Navigate to the NEXT Step.
    next(){
        const { activeStep } = this.state;
        const stepsDataEntries = Object.entries( _stepsData );
        let next = stepsDataEntries.findIndex( ([k, v]) => { return k === activeStep.id } ) + 1;
        next = next < stepsDataEntries.length ? stepsDataEntries[ next ][1] : stepsDataEntries[ 0 ][1];
            
        this.goto( next, next.duration );
    }
    
    // Navigate to the FIRST Step.
    home(){
        const stepsDataEntries = Object.entries( _stepsData );
        const firstStep = stepsDataEntries[ 0 ][1];
        
        this.goto( firstStep, firstStep.duration );
    }
    
    // Navigate to the LAST Step.
    end(){
        const stepsDataEntries = Object.entries( _stepsData );
        const lastStep = stepsDataEntries[ stepsDataEntries.length - 1 ][1];
        
        this.goto( lastStep, lastStep.duration );
    }
    
    /**
     * Create <Step />
     * 
     * @return {Step} to render children.
     */
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
        const { 
            impressSupported,
            rootStyles, canvasStyles, activeStep, 
            hint, hintMessage, 
            fallbackMessage, 
            progress
        } = this.state;
        const steps = React.Children.map( this.props.children, this.stepComponent.bind(this) );
        const stepsTotal = React.Children.count(this.props.children) ;
        
        return (
            <div id="react-impressjs" 
                 className={ 
                    (impressSupported ? 'impress-supported' : 'impress-not-supported') + 
                    (activeStep ? ' impress-on-' + activeStep.id : '') + ' impress-enabled' }>
                 
                <div id="impress" style={ rootStyles }>
                    <div style={ canvasStyles }>
                    { 
                        impressSupported ? steps : 
                        <div className="fallback-message">{ fallbackMessage }</div>
                    }
                    </div>
                </div>
                { hint ? <div className="hint">{ hintMessage }</div> : '' }
                { progress ? <Progress stepsData={ _stepsData } 
                                       activeStep={ activeStep } 
                                       stepsTotal={ stepsTotal } /> : '' }
            </div>
        );
    }
}