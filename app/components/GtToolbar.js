import {GtDomUtil} from "./GtDomUtil";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtToolbar  extends GtDomUtil{

    /**
     * @param { GtFunctionalityCollection } stateCollection
     * @param {Element} [toolbarElement]
     */
    constructor(stateCollection, toolbarElement){
        super();
        this.stateCollection = stateCollection;
        if(toolbarElement){
            this.render(toolbarElement);
        }
    }
    
    /**
     * @param {Element} toolbarElement
     * @param {Array} [groupStates]
     */
    render(toolbarElement,groupStates){
        let group = this.createNewNode('div',null,'ButtonGroup'),
            frag = document.createDocumentFragment(),
            state;

        for(state in this.stateCollection.states){
            let button,
                styles,
                stateInstance = this.stateCollection.states[state];

            let dataValue = stateInstance['actionType'];
            let dataset = { 'actionType' : dataValue};
            button = this.createNewNode('button',null, 'Button',null,dataset,stateInstance['iconHtml'],{'type':'button'});
            button.addEventListener('click',function(){
                stateInstance.action();
            });
            
            group.appendChild(button);
        }

        frag.appendChild(group);

        toolbarElement.innerHTML = '';
        toolbarElement.appendChild(frag);

    }
}