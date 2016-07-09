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

        if(eventName == 'toolbar:stateValueChange'){ // && startNode == endNode && endOffset - startOffset == 0
            this.gtSelection.restoreSelection( this.gtSelection.getCurrentRange() );
        }

        this.updateStateElements(state);
        
        return this;
    }

    /**
     * @desc Update Element after state's status changed.
     * @param {GtState} state
     * @returns {GtToolbar}
     */
    updateStateElements(state){

        let wrapperButtonsElement,
            button;

        wrapperButtonsElement = this.wrapperElement.querySelectorAll('[data-state-name="'+state.stateName+'"]')[0];

        if(!wrapperButtonsElement){
            return this;
        }

        if(this.hasClass(wrapperButtonsElement,'selection-group')){
            let statesButtons = wrapperButtonsElement.getElementsByClassName('Button');
            button = wrapperButtonsElement.querySelectorAll('[data-selection-index="'+ state.getCurrentIndex() +'"]')[0];
            this.removeClass(statesButtons,this.classNameButtonActive);
            this.addClass(button,this.classNameButtonActive);
        }

        if(this.hasClass(wrapperButtonsElement,'selection-cycler')){
            button = wrapperButtonsElement.getElementsByClassName('Button')[0];
            this.toggleClass(button,this.classNameButtonActive);
        }

        return this;
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

        if(this.hasClass(parentSelectionElement,'selection-opener')){
            //#TODO implement dropdown style option
        }

        if(newIndex == state.getCurrentIndex()){
            return false;
        }


        state.setCurrentIndex(newIndex);
        state.action('toolbar:stateValueChange');
    }


}