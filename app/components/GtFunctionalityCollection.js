import { GtEvent } from './GtEvent';

/**
 *
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
    
    addAction(state){
        if(!this.states[state.actionType]){
            this.states[state.actionType] = state;
        }
        return this;
    }
    
    addActionCollection(states){
        let len = states.length,
            i=0;

        for(;i<len;i++){

            if(states[i].constructor.name != 'GtState'){
                // throw new Error('Try to add state with non GtState Constructor');
            }

            this.addAction(states[i]);
        }
    }

    triggerAction(eventName){
        this.trigger(eventName);
        return this;
    }

    isStateOn(actionType){
        if(actionType && typeof this.states[actionType] == 'undefined'){
            return false;
        }
        return this.states[actionType].isOn();
    }
    
    addObjection(actionType, reason){}
    
    addObjectionAll(reason) {
        // reason || (reason = DEFAULT_REASON);

        for (stateName in this.states) {
            this.states[stateName].addObjection(reason);
        }
    }

}