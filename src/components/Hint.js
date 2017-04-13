import React, { Component } from 'react';
import swipeRight from '../images/swipe-right.png';

export default class Hint extends Component {
    render() {
        const { hint, stepsData, activeStep, hintMessage } = this.props;
        const ua = navigator.userAgent.toLowerCase();
        const isMobile = ( ua.search( /(iphone)|(ipod)|(android)/ ) === -1 );
        
        // If current Step is first one, let hint show up.
        const isFirstStep = Object.keys(stepsData).findIndex((s)=> s === activeStep.id) === 0 ? true : false;
        
        return (
            <div className={ isFirstStep ? 'show' : '' } style={{display: hint ? 'block' : 'none'}}>
            {
                isMobile ?
                <div className="hint">{ hintMessage }</div>
                :
                <div className="mobile-hint">
                    <img src={swipeRight} role="presentation"></img>
                    <span><b>Swipe</b> to navigate</span>
                </div>
            }
            </div>
        );
    }
}