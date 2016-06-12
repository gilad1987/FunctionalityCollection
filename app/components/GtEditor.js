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
            if(states.hasOwnProperty(stateName)){
                state = states[stateName];
                state.subscribe(
                    this.onStateChange,
                    this
                );
            }
        }
    }

    onStateChange(state){}
}