import {GtDomUtil} from "./GtDomUtil";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtEditor extends GtDomUtil{

    /**
     * @param {Node} [editorElement]
     * @param {GtFunctionalityCollection} stateCollection
     */
    constructor(stateCollection, editorElement){
        super();
        this.stateCollection = stateCollection;
        if(editorElement){
            this.render(editorElement);
        }
    }

    /**
     * @param {Node} editorElement
     */
    render(editorElement){
        
    }
}