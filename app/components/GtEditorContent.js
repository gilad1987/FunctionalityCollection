import {GtEditor} from "./GtEditor";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtEditorContent extends GtEditor{

    /**
     * @param {GtFunctionalityCollection} statesCollection
     * @param {Element} [editorParentElement]
     * @param {object} [templateStateData]
     */
    constructor(statesCollection, editorParentElement, templateStateData){

        super();

        this.setStates(statesCollection);
        this.templateStateData = templateStateData;
        this.editorContentElement = null;
        this.editorElement = editorParentElement;

        if(this.editorElement){
            this.render(this.editorElement);
        }
    }

    /**
     * @param {Element} [editorParentElement]
     * @returns {GtEditor}
     */
    render(editorParentElement){
        this.editorElement = editorParentElement;
        this.editorContentElement = this.createNewNode('div', null, 'content', null, null, null, {"contenteditable":true});
        let frag = document.createDocumentFragment();

        this.editorContentElement.addEventListener('keydown',(event) => {
            this.onKeyUp(event);
        });

        frag.appendChild(this.editorContentElement);
        this.editorElement.appendChild(frag);

        return this;
    }

    onKeyUp(event){
        console.log('onKeyUp');
    }

    onStateChange(state){
    }

}