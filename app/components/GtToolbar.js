import {GtEditor} from "./GtEditor";
import {GtSelection} from "./GtSelection";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtToolbar  extends GtEditor{

    /**
     * @param { GtFunctionalityCollection } functionalityCollection
     * @param {Element} [editorParentElement]
     * @param {Object} [templateStateData]
     */
    constructor(functionalityCollection, editorParentElement, templateStateData){
        
        super();

        this.currentStyle = {};
        this.templateStateData = templateStateData;
        this.setStates(functionalityCollection);
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
     * @param {string} eventName
     * @returns {GtToolbar}
     */
    onStateChange(state, eventName){

        let {startNode, endNode, startOffset, endOffset, range} =  this.gtSelection.getStartAndEndNode();

        if(eventName == 'toolbar:stateValueChange' && startNode == endNode && endOffset - startOffset == 0){
            this.gtSelection.restoreSelection(range);
        }
        
        return this;
    }




    /**
     * @desc Get DOM element by state.
     * @param {GtState} state
     * @returns {Element}
     */
    getStateElementByState(state){
        return state && this.statesNodes[state.stateName];
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
            states = this.getStates(),
            stateName;

        //#TODO implement for groupStates
        for(stateName in states){
            if( states.hasOwnProperty(stateName) ){

                let state,
                    stateData,
                    i,
                    buttonsConfig,
                    buttonConfig,
                    selectionIndex,
                    buttonElement,
                    ul,li,
                    toolbarSelectionElement,
                    currentButtonConfig,
                    toolbarSelectionElementClasses;

                state = states[stateName];
                stateData = this.templateStateData[stateName];
                i=0;

                if(!stateData){
                    throw new Error('Invalid template state data for: '+stateName);
                }

                buttonsConfig = stateData.buttons;

                toolbarSelectionElementClasses= ['gt-toolbar-selection'];

                if(stateData.type=='group'){
                    toolbarSelectionElementClasses.push('selection-group');
                }

                if(stateData.type=='toggle'){
                    toolbarSelectionElementClasses.push('selection-cycler');
                }

                if(stateData.type=='list'){
                    toolbarSelectionElementClasses.push('selection-opener');
                }

                toolbarSelectionElement = this.createNewNode('div',null,toolbarSelectionElementClasses,null,{'stateName':state.stateName});
                ul = this.createNewNode('ul');

                for(buttonConfig in buttonsConfig){
                    currentButtonConfig = buttonsConfig[buttonConfig];
                    li = this.createNewNode('li');
                    selectionIndex = stateData.style.values.indexOf(buttonConfig);
                    buttonElement = this.createNewNode(currentButtonConfig.nodeName, null, 'Button', null, {'selectionIndex':selectionIndex}, currentButtonConfig.icon, currentButtonConfig.elementAttrs);

                    li.appendChild(buttonElement);
                    ul.appendChild(li);
                }

                toolbarSelectionElement.appendChild(ul);
                group.appendChild(toolbarSelectionElement);

            }
        }

        this.wrapperElement.addEventListener('click',(event) => {
            this.onToolbarSelectionClick(event);
        });


        toolbarElement.appendChild(group);
        frag.appendChild(toolbarElement);
        this.wrapperElement.appendChild(frag);


        return this;
    }

    onToolbarSelectionClick(event){

        let button = event.target.closest('button');
        let parentSelectionElement,
            state,
            stateData,
            newIndex;

        if(!button){
            return false;
        }

        if(this.hasClass(button,'opener')){
            return false;
        }

        parentSelectionElement = button.closest('.gt-toolbar-selection');

        let stateName = parentSelectionElement.dataset['stateName'];

        if(!stateName){
            return false;
        }

        state = this.getState(stateName);
        stateData = this.getStateData(state);
        if(!stateData){
            return false;
        }

        if(this.hasClass(parentSelectionElement,'selection-cycler')){
            newIndex = state.getCurrentIndex() + 1;
            if(newIndex > stateData.style.values.length-1){
                newIndex = 0;
            }
        }

        if(this.hasClass(parentSelectionElement,'selection-group')){
            newIndex = button.dataset['selectionIndex'];
        }

        if(newIndex == state.getCurrentIndex()){
            return false;
        }

        this.updateStateElements(parentSelectionElement, button );
        state.setCurrentIndex(newIndex);
        state.action('toolbar:stateValueChange');
    }

    /**
     * @desc Update Element after state's status changed.
     * @param {Element} parentSelectionElement
     * @param {Element} button
     * @returns {GtToolbar}
     */
    updateStateElements(parentSelectionElement, button){
        if(this.hasClass(parentSelectionElement,'selection-group')){
            let statesButtons = parentSelectionElement.getElementsByClassName('Button');
            this.removeClass(statesButtons,'active');
            this.addClass(button,'active');
        }
        if(this.hasClass(parentSelectionElement,'selection-cycler')){
            this.toggleClass(button,'active');
        }
        return this;
    }
}