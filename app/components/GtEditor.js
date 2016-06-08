import {GtDomUtil} from "./GtDomUtil";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtEditor extends GtDomUtil{

    /**
     * @param {GtFunctionalityCollection} stateCollection
     * @param {Element} [editorElement]
     */
    constructor(stateCollection, editorElement){
        super();
        this.stateCollection = stateCollection;
        
        if(editorElement){
            this.editorElement = editorElement;
            this.render();
        }
        
    }

    /**
     * @param {Element} [editorElement]
     * @returns {GtEditor}
     */
    render(editorElement){
        let editorContent = this.createNewNode('div', null, 'content', null, null, null, {"contenteditable":true}),
            frag = document.createDocumentFragment();

        editorContent.addEventListener('keydown',(event) => {
            this.onKeyUp(event);
        });

        frag.appendChild(editorContent);
        editorElement.appendChild(frag);

        return this;
    }

    onKeyUp(event){
        console.log('onKeyUp');
    }

}