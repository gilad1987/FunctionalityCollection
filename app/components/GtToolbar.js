import {GtEditor} from "./GtEditor";

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

        this.setStates(statesCollection);
        this.templateStateData = templateStateData;
        this.classNameButtonActive = 'active';
        
        if(editorParentElement){
            this.render(editorParentElement);
        }
    }

    onStateChange(state){
        this.updateStateButtonElement(state);
    }

    updateStateButtonElement(state){
        if(!state || !state.nodeElement){
            return false;
        }

        return this.toggleClass(
            state.nodeElement,
            this.classNameButtonActive
        );
    }
    
    /**
     * @param {Element} editorParentElement
     * @param {Array} [groupStates]
     * @returns {GtToolbar}
     */
    render(editorParentElement,groupStates){
        let group = this.createNewNode('div',null,'ButtonGroup'),
            toolbarElement = this.createNewNode('div',null,'ToolBar'),
            frag = document.createDocumentFragment(),
            stateName;

        //#TODO implement for groupStates
        for(stateName in this.stateCollection.states){
            if(this.stateCollection.states.hasOwnProperty(stateName)){
                let button,
                    state = this.stateCollection.states[stateName],
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
                state.nodeElement = button;
                group.appendChild(button);
            }
        }

        editorParentElement.addEventListener('click',(event) => {
            this.onButtonClick(event);
        });

        toolbarElement.appendChild(group);
        frag.appendChild(toolbarElement);
        editorParentElement.appendChild(frag);

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

        this.stateCollection.states[stateName].action();
    }

    onButtonClick(event){
        this.fireActionByDomEvent(event);
    }
}