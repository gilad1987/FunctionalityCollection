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
     * @param styleKey
     * @param styleValue
     * @param className
     * @param iconHtml
     */
    constructor(actionType,on,enabled,styleKey,styleValue,className,iconHtml){
        super();
        this.actionType = actionType;
        this._isOn = on;
        this._isEnabled = enabled;
        this.className = className;
        this.styleKey = styleKey;
        this.styleValue = styleValue;
        this.reasonCount = 0;
        this.iconHtml = iconHtml;
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

        if (triggerEvent)
            this.trigger("isEnabledChanged", triggerEvent);


    }

    action() {

        console.log('fire action: '+this.actionType);
        this.trigger(this.actionType);
    }

    addObjection(){

    }
}