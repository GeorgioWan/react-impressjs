import React, { Component } from 'react';
import update from 'react/lib/update';
import { toNumber, translate, rotate, scale } from './util';

const defaultData = {
  x: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1
};

export default class Step extends Component {
    constructor(props){
        super(props);

        const { className, duration } = this.props;
        
        this.state = {
            id: this.gtepID(),
            className: className ? ("step " + className ) : "step",
            data: this.getData(),
            duration: duration ? duration : 1000,
            isPresented: false
        };
    }
    componentDidMount(){
        const { initStep } = this.props;
        
        initStep( this.state );
    }
    componentWillReceiveProps( nextProps ){
        const { id, isPresented } = this.state;
        
        if ( id === nextProps.activeStep.id && !isPresented ) 
            this.setState( update( this.state, {
                isPresented: {
                    $set: true
                }
            }));
    }
    
    // Step's Event
    handleClick(e){
        const { goto } = this.props;
        let target = e.target;
        
        while( !target.classList.contains('step') &&
               !target.classList.contains('active') &&
               !target.classList.contains('oi-step-element') &&
                target !== document.documentElement) {
          target = target.parentNode;          
        }
        
        if (target !== document.documentElement)
            if ( target.classList.contains('step') )
                goto( this.state, this.state.duration );
    }
    
    // Step's ID, ClassName, Style
    gtepID(){
        const { id, idHelper } = this.props;
        
        return id || ("step-" + idHelper);
    }
    getClassName(){
        const { activeStep } = this.props;
        const { id, className, isPresented } = this.state;
        
        if ( id === activeStep.id )
            return className + " active present";
        else
            if ( isPresented )
                return className + " past";
            else
                return className + " future";
    }
    getData(){
        const { data } = this.props;
        
        return data? {
            x: toNumber( data.x ),
            y: toNumber( data.y ),
            z: toNumber( data.z ),
            rotateX: toNumber( data.rotateX ),
            rotateY: toNumber( data.rotateY ),
            rotateZ: toNumber( data.rotateZ || data.rotate ),
            scale: toNumber( data.scale, 1 )
        } : defaultData;
    }
    
    getStyle(){
        const { data } = this.state;
        
        let _stepStyle = {
                position: 'absolute',
                transform: 'translate(-50%, -50%) ',
                transformStyle: 'preserve-3d'
            };
            
        _stepStyle.transform += translate( data ? data : defaultData ) + 
                                rotate( data ? data : defaultData ) + 
                                scale( data.scale ? data.scale : defaultData ) ;
            
        
        return _stepStyle;
    }
    
    render() {
        const { children } = this.props;
        const { id } = this.state;
        
        const _stepClassName = this.getClassName();
        const _stepStyle = this.getStyle();
        
        return (
            <div id={ id } 
                 className={ _stepClassName } 
                 style={ _stepStyle } 
                 onClick={ this.handleClick.bind(this) }>
                { children }
            </div>
        );
    }
}