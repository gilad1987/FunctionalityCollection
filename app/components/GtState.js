import { GtEvent } from './GtEvent';

export class GtState extends GtEvent{

    constructor(actionType,on,enabled,styleKey,styleValue,className){
        this.actionType = actionType;
        this._isOn = on;
        this._isEnabled = enabled;
        this.className = className;
        this.styleKey = styleKey;
        this.styleValue = styleValue;
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

        if (triggerEvent)
            this.trigger("isEnabledChanged", triggerEvent);


    }

    action() {
        this.trigger("action", this.actionType);
    }

    addObjection(){

    }
}