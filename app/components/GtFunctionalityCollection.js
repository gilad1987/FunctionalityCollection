import { GtEvent } from './GtEvent';

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtFunctionalityCollection extends GtEvent{
    
    constructor(){
        super();
        this.states = {};
        this.isEnabled = true;
    }
    
    getAllStates(){
        return this.states;
    }
    
    subscribe(eventName, handler, context, target){
        this.on(eventName, handler, context, target);
        return this;
    }
    
    unSubscribe(eventName, handler){
        this.off(eventName, handler);
        return this;
    }

    addState(state){
        if(!this.states[state.stateName]){
            this.states[state.stateName] = state;
        }
        return this;
    }
    
    addStateCollection(states){
        let len = states.length,
            i=0;

        for(;i<len;i++){

            if(states[i].constructor.name != 'GtState'){
                // throw new Error('Try to add state with non GtState Constructor');
            }

            this.addState(states[i]);
        }
    }

    triggerAction(eventName){
        this.trigger(eventName);
        return this;
    }

    isStateOn(actionType){
        return actionType &&
            this.states[actionType] &&
            this.states[actionType].isOn();
    }
    
    addObjection(actionType, reason){}
    
    addObjectionAll(reason) {
        // reason || (reason = DEFAULT_REASON);

        for (stateName in this.states) {
            this.states[stateName].addObjection(reason);
        }
    }

}