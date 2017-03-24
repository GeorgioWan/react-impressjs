import React, { Component } from 'react';
import { Circle } from 'rc-progress';

export default class Progress extends Component {
    render() {
        const { stepsData, activeStep, stepsTotal } = this.props;
        let currentStepIndex = Object.keys(stepsData).findIndex((s)=> s === activeStep.id) + 1;
        let progress = parseInt(currentStepIndex/stepsTotal * 100, 10);
        
        return (
            <aside style={{position:'absolute', bottom:0, right:0, marginRight:7, width: 75, height: 65}}>
                <div style={{position: 'relative'}}>
                    <Circle percent={progress} 
                            strokeWidth={10} strokeColor={"#e5b560"}
                            trailWidth={6} trailColor={"#3e4852"}
                            gapDegree={90}
                            gapPosition={"bottom"} />
                    <p style={{position:'absolute', bottom:'40%', fontSize:20, color:'#3e4852', width:'100%', textAlign:'center'}}>
                    {
                        progress === 100 ? <b style={{fontSize:15}}>Done!</b> :
                        <span>
                            { currentStepIndex }
                            <span style={{paddingLeft:1, fontSize:12}}>{'/' + stepsTotal}</span>
                        </span>
                    }
                    </p>
                </div>
            </aside>
        );
    }
}