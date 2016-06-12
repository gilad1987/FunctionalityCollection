import { GtEvent } from './GtEvent';

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtState extends GtEvent{

    /**
     * 
     * @param actionType
     * @param on
     * @param enabled
     */
    constructor(actionType,on,enabled){
        super();
        this.actionType = actionType;
        this._isOn = on;
        this._isEnabled = enabled;
    }

    subscribe(handler){
        this.on(this.actionType, handler);
        return this;
    }

    unSubscribe(handler){
        this.off(this.actionType, handler);
        return this;
    }
    
    isOn(){
        return this._isOn;
    }

    isEnable(){
        return this._isEnabled.length == 0;
    }

    setOn(isOn){
        this._isOn = !!isOn;
    }

    setEnabled(isEnabled, reason){
        if (this._isEnabled[reason])
            return;
        var triggerEvent = (this.isEnabled());

        if (this._isEnabled[reason] = isEnabled)
            this.reasonCount--;
        else
            this.reasonCount++;

        if (triggerEvent){
            this.trigger("isEnabledChanged", triggerEvent);
        }
    }

    action() {
        this.trigger(this.actionType,[this]);
    }

    addObjection(){

    }
}