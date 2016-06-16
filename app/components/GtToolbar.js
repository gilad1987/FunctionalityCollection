import {GtEditor} from "./GtEditor";
import {GtSelection} from "./GtSelection";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtToolbar  extends GtEditor{

    /**
     * @param { GtFunctionalityCollection } statesCollection
     * @param {Element} [editorParentElement]
     * @param {Object} [templateStateData]
     */
    constructor(statesCollection, editorParentElement, templateStateData){
        
        super();

        this.currentStyle = {};
        this.templateStateData = templateStateData;
        this.setStates(statesCollection);
        this.classNameButtonActive = 'active';
        this.wrapperElement = editorParentElement;

        /**
         * @desc Reference to DOM Element by state's actionType/eventName
         * @type {{}}
         */
        this.statesNodes = {};

        /**
         * @type {GtSelection}
         */
        this.gtSelection = new GtSelection();
        
        if(this.wrapperElement){
            this.render(this.wrapperElement);
        }
    }

    /**
     * @desc Call when state's status changed.
     * @param {GtState} state
     * @returns {GtToolbar}
     */
    onStateChange(state, eventName){
        // console.log('start : onStateChange : GtToolbar');
        let {startNode, endNode, startOffset, endOffset, range} =  this.gtSelection.getStartAndEndNode();
        this.updateStateButtonElement(state);

        if(eventName == 'toolbarClickButton' && startNode == endNode && endOffset - startOffset == 0){
            this.gtSelection.restoreSelection(range);
        }
        // console.log('end : onStateChange : GtToolbar');
        return this;
    }

    /**
     * @desc Update Element after state's status changed.
     * @param {GtState} state
     * @returns {undefined|boolean}
     */
    updateStateButtonElement(state){
        if( !state ){
            return false;
        }

        let element = this.getStateElementByState(state),
            className = this.classNameButtonActive,
            isStateOn = state.isOn(),
            hasClass = this.hasClass(element, className);


        if(isStateOn && !hasClass){
            this.addClass(element, className);
        }

        if(!isStateOn && hasClass){
            this.removeClass(element, className);
        }

    }


    /**
     * @desc Get DOM element by state.
     * @param {GtState} state
     * @returns {Element}
     */
    getStateElementByState(state){
        return state && this.statesNodes[state.actionType];
    }
    
    /**
     * @param {Element} editorParentElement
     * @param {Array} [groupStates]
     * @returns {GtToolbar}
     */
    render(editorParentElement,groupStates){

        this.wrapperElement = editorParentElement;

        let group = this.createNewNode('div',null,'ButtonGroup'),
            toolbarElement = this.createNewNode('div',null,'ToolBar'),
            frag = document.createDocumentFragment(),
            states = this.stateCollection.states,
            stateName;

        //#TODO implement for groupStates
        for(stateName in states){
            if(states.hasOwnProperty(stateName)){
                let button,
                    state = states[stateName],
                    defaultHtml = this.templateStateData[stateName].iconHtml,
                    dataset = {
                        'actionType' : state['actionType']
                    },
                    attrs = {
                        'type': this.templateStateData[stateName].nodeType
                    },
                    nodeName = this.templateStateData[stateName].nodeName,
                    buttonClassName = this.templateStateData[stateName].buttonClassName;

                button = this.createNewNode(nodeName,null, buttonClassName,null,dataset,defaultHtml,attrs);
                this.statesNodes[ state['actionType'] ] = button;
                group.appendChild(button);
            }
        }

        this.wrapperElement.addEventListener('click',(event) => {
            this.onButtonClick(event);
        });



        toolbarElement.appendChild(group);
        frag.appendChild(toolbarElement);
        this.wrapperElement.appendChild(frag);

        return this;
    }

    fireActionByDomEvent(event){
        let element = this.getParentById(event.target);
        if(!element){
            return false;
        }

        let stateName = element.dataset['actionType'];
        if(!stateName){
            return false;
        }

        if(!this.stateCollection.states[stateName]){
            return false;
        }

        this.stateCollection.states[stateName].action('toolbarClickButton');
    }


    onButtonClick(event){
        this.fireActionByDomEvent(event);
    }
}