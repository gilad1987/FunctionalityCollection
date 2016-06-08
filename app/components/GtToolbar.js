import {GtDomUtil} from "./GtDomUtil";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtToolbar  extends GtDomUtil{

    /**
     * @param { GtFunctionalityCollection } stateCollection
     * @param {Element} [editorElement]
     */
    constructor(stateCollection, editorElement){
        super();
        this.stateCollection = stateCollection;
        if(editorElement){
            this.render(editorElement);
        }
    }
    
    /**
     * @param {Element} editorElement
     * @param {Array} [groupStates]
     * @returns {GtToolbar}
     */
    render(editorElement,groupStates){
        let group = this.createNewNode('div',null,'ButtonGroup'),
            toolbarElement = this.createNewNode('div',null,'ToolBar'),
            frag = document.createDocumentFragment(),
            state;

        //#TODO implement for groupStates

        for(state in this.stateCollection.states){
            if(this.stateCollection.states.hasOwnProperty(state)){

                let button,
                    stateInstance = this.stateCollection.states[state],
                    dataset = {
                        'actionType' : stateInstance['actionType']
                    };

                //#TODO add title to button (ask Yuval where put the data)
                
                button = this.createNewNode('button',null, 'Button',null,dataset,stateInstance['iconHtml'],{'type':'button'});
                button.addEventListener('click',function(){
                    stateInstance.action();
                });

                group.appendChild(button);
            }
        }

        toolbarElement.appendChild(group);
        frag.appendChild(toolbarElement);

        editorElement.appendChild(frag);

        return this;
    }
}