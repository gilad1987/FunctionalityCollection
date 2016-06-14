import {GtDomUtil} from "./GtDomUtil";

export class GtEditor extends GtDomUtil{
    
    constructor(){
        super();
        this.editorElement = null;
    }
    
    setStates(stateCollection){
        this.stateCollection = stateCollection;
        this.subscribeToStates();
    }

    subscribeToStates(){
        let stateName,state,states;
        states = this.stateCollection.states;
        for(stateName in states){

            if(!states.hasOwnProperty(stateName)){
                return false;
            }

            state = states[stateName];
            
            if(state.isOn()){
                this.updateCurrentStyleByState(state);
            }
            
            state.subscribe(this.onStateChange, this);
        }
    }

    updateCurrentStyleByState(state){

        if(!state.isOn()){
            delete this.currentStyle[ this.templateStateData[state.actionType].styleKey ];
        }else{
            this.currentStyle[ this.templateStateData[state.actionType].styleKey ] = this.templateStateData[state.actionType].styleValue;
        }
    }

    updateIsStyleChanged(state){
        
        let currentNode = this.gtSelection.getCurrentNode(),
            styleKey = this.templateStateData[state.actionType].styleKey,
            styleValue = this.templateStateData[state.actionType].styleValue;

        this.isStyleChanged =
            ( state.isOn() && !this.hasStyle(currentNode, styleKey, styleValue) ) ||
            ( !state.isOn() && this.hasStyle(currentNode, styleKey, styleValue) );

        return this;
    }

    onStateChange(state){
        console.log('Abstract Callback - GtEditor:onStateChange - no implement');
    }
}