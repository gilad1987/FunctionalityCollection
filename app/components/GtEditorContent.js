import {GtEditor} from "./GtEditor";
import {GtSelection} from "./GtSelection";

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

        this.currentStyle = {};
        this.templateStateData = templateStateData;
        this.setStates(statesCollection);
        this.editorContentElement = null;
        this.wrapperElement = editorParentElement;
        this.isStyleChanged = false;

        /**
         * @desc true when apply style in process
         * @type {boolean}
         */
        this.inProcess = false;

        /**
         * @type {GtSelection}
         */
        this.gtSelection = new GtSelection();

        if(this.wrapperElement){
            this.render(this.wrapperElement);
        }
    }

    /**
     * @param {Element} [editorParentElement]
     * @returns {GtEditor}
     */
    render(editorParentElement){
        this.wrapperElement = editorParentElement;
        this.editorContentElement = this.createNewNode('div', null, 'content', null, null, null, {"contenteditable":true});
        let frag = document.createDocumentFragment();

        this.editorContentElement.addEventListener('keydown',(event) => {
            this.onKeyUp(event);
        });


        frag.appendChild(this.editorContentElement);
        this.wrapperElement.appendChild(frag);

        document.getElementsByClassName('content')[0].innerHTML = '<span class="wordwrapper">moshe</span><span class="wordwrapper">gilad</span><span class="wordwrapper">yael</span><span class="wordwrapper">aviadASDASDAan</span>'

        return this;
    }



    checkIfSplitRequired(event){
        return this.isStyleChanged; // || event.keyCode == 13
    }

    onKeyUp(event){

        // console.log('onKeyUp');
        
        /**
         * 40 arrow bottom
         * 38 arrow top
         * 37 arrow left
         * 39 arrow right
         */
        if(event.keyCode==8 || event.keyCode==40 || event.keyCode==38 || event.keyCode==37 || event.keyCode==39){
            return;
        }

        if(!this.hasChildren(this.editorContentElement)){
            let { node } = this.gtSelection.createNewTextWrapper();
            this.setStyleCollection( node, this.currentStyle );
            return;
        }

        let splitRequired = this.checkIfSplitRequired(event);


        if(splitRequired){

        }

    }

    onSelectionChange(event){
        if(!this.inProcess){
            console.log('selection change');
        }
    }

    onStateChange(state, sourceEvent){
        
        
        this.updateCurrentStyleByState(state);
        this.updateIsStyleChanged(state);

        if(this.isStyleChanged && sourceEvent == 'toolbarClickButton'){
            this.applyStyle(state);
        }

        if(this.isStyleChanged && sourceEvent == 'changeSelection'){

        }

    }

    applyStyle(state){

        if(!this.gtSelection.isTextSelected()){
            return;
        }

        this.inProcess = true;

        let s = window.getSelection();
        let r = s.getRangeAt(0);
        let sc = r.startContainer;
        let ec = r.endContainer;
        let {startNode, endNode} = this.gtSelection.getStartAndEndNode(r);
        let element = startNode;
        let elementNeedSplit = false;

        let textData = {
            startOffset: r.startOffset,
            endOffset: r.endOffset,
            startLength: sc.length,
            endLength: ec.length
        };

        let lastElement = false,
            newRangeStartNode,
            newRangeEndNode;

        let count = 0;


        do{
            let startOffset = element === startNode ? textData.startOffset : 0,
                length = element === startNode ? textData.startLength : textData.endLength,
                endOffset = element === startNode ? length : textData.endOffset;

            if(startNode === endNode){
                textData.endOffset = endOffset = r.endOffset - r.startOffset;

                if(startNode.firstChild.length > textData.endOffset){
                    let {node} = this.gtSelection.splitRangeByStyle(element, 0, textData.startOffset, length, true);
                    textData.startOffset  = 0;
                    startOffset = 0;
                }

                endNode = element;
            }


            elementNeedSplit = (textData.endOffset < element.firstChild.length) &&
                ( (startNode === endNode && (textData.endOffset - textData.startOffset) > 0 ) ||
                ( element === startNode && textData.startOffset > 0 ) ||
                ( element === endNode && (textData.endOffset > 0) ) ) ;

            lastElement = ( element === endNode );
            length = textData.endLength  = element.firstChild.length;

            if( elementNeedSplit ){
                let {node} = this.gtSelection.splitRangeByStyle(element, startOffset, endOffset, element.firstChild.length, lastElement);
                element = node;

            }

            if(state.isOn()){
                this.setStyle(element, this.templateStateData[state.actionType].styleKey, this.templateStateData[state.actionType].styleValue);
            }else{
                this.removeStyle(element, this.templateStateData[state.actionType].styleKey);
            }

            if(!newRangeStartNode){
                newRangeStartNode = element;
            }

            if(lastElement){
                newRangeEndNode = element;
            }

            count++;
            if(count>20) break;

        }while( (!lastElement) && (element = element.nextSibling));

        // create new range for restore
        let newRange = document.createRange();
        newRange.setStart(newRangeStartNode, 0);
        newRange.setEnd(newRangeEndNode.firstChild, newRangeEndNode.firstChild.length);

        this.gtSelection.restoreSelection(newRange);
        this.isStyleChanged = false;
        this.inProcess = false;


    }

}