import { GtEvent } from './GtEvent';

export class GtFunctionalityCollection extends GtEvent{

    constructor(){
        this.states = {};
        this.isEnabled = true;
    }

    getAllState(){}

    subscribe(actionType, handler, context, target){
        this.on(actionType, handler, context, target);
        return this;
    }

    unSubscribe(actionType, handler){
        this.off(actionType, handler);
        return this;
    }

    addAction(state){
        this.states[state.actionType] = state;
        return this;
    }

    triggerAction(actionType){
        this.trigger(actionType);
        return this;
    }
    
    isStateOn(actionType){
        
        if(typeof this.states[actionType] == 'undefined'){
            return false;
        }
        
        return this.states[actionType].isOn();
    }

    addObjection(actionType, reason){

    }

    addObjectionAll(reason) {
        reason || (reason = DEFAULT_REASON);
       for (stateName in this.states) {
           this.states[stateName].addObjection(reason);
       }
    }
    
}