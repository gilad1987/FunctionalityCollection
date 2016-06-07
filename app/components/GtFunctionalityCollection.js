import { GtEvent } from './GtEvent';

export class GtFunctionalityCollection extends GtEvent{

    constructor(GtEventManager){
        this.eventManager = new GtEventManager();
        this.states = {};
        this.isEnabled = true;
    }

    getAllState(){}

    subscribe(actionType, handler, context, target){
        this.eventManager.on(actionType, handler, context, target);
        return this;
    }

    unSubscribe(actionType, handler){
        this.eventManager.off(actionType, handler);
        return this;
    }

    addAction(state){
        this.states[state.actionType] = state;
    }

    triggerAction(actionType){
        this.eventManager.trigger(actionType);
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

