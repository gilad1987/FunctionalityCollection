import {GtDomUtil} from "./GtDomUtil";

export class GtEditor extends GtDomUtil{
    
    constructor(){
        super();
        this.editorElement = null;
        this.range = null;
        this.currentStyle = {};
    }
    
    setStates(functionalityCollection){
        this.functionalityCollection = functionalityCollection;
        this.subscribeToStates();
    }
    
    getStates(){
        return this.functionalityCollection.getAllStates();
    }
    
    getState(stateName){
        return this.getStates()[stateName];
    }

    getStateData(state){
        return this.templateStateData[state.stateName];
    }
    
    

    subscribeToStates(){
        let stateName,state,states;
        states = this.getStates();
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
        let stateData = this.templateStateData[state.stateName];
        this.currentStyle[stateData.style.key] = stateData.style.values[ state.getCurrentIndex() ];
        return this;
    }

    /**
     * @desc Compare current style with element if equal return true else return false
     * @param node
     * @returns {boolean}
     */
    compareStyleWithElement(node){
        let style,
            elementToCompare,
            isCompare = true;

        for(style in this.currentStyle){
            elementToCompare = node;
            if(style=='text-align'){
                elementToCompare = node.closest('p');
                if(!elementToCompare){
                    continue;
                }

                if(!this.hasStyle(elementToCompare,style,this.currentStyle[style])){
                    isCompare = false;
                    break;
                }
                
            }

        }
        
        return this.isStyleChanged  = isCompare;
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