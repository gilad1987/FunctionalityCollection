import {GtEditor} from "./GtEditor";
import {GtSelection} from "./GtSelection";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtEditorContent extends GtEditor{

    /**
     * @param {GtFunctionalityCollection} functionalityCollection
     * @param {Element} [editorParentElement]
     * @param {object} [templateStateData]
     */
    constructor(functionalityCollection, editorParentElement, templateStateData){

        super();

        
        this.templateStateData = templateStateData;
        this.setStates(functionalityCollection);
        this.editorContentElement = null;
        this.wrapperElement = editorParentElement;
        this.isStyleChanged = false;
        this.preventSelectionChange = false;

        /**
         * @desc true when apply style in process
         * @type {boolean}
         */
        this.inProcess = false;

        /**
         * @type {GtSelection}
         */
        this.gtSelection = new GtSelection();
        this.gtSelection.on('preventSelectionChange',()=>{});

        if(this.wrapperElement){
            this.render(this.wrapperElement);
        }
    }

    /**
     * @param {Element} [editorParentElement]
     * @param {Array} [textForInit]
     * @returns {GtEditor}
     */
    render(editorParentElement,textForInit){
        this.wrapperElement = editorParentElement;
        this.editorContentElement = this.createNewNode('div', null, 'content', null, null, null, {"contenteditable":true});
        let frag = document.createDocumentFragment();

        this.editorContentElement.addEventListener('keydown',(event) => {
            this.onKeyUp(event);
        });

        let selection = new GtSelection();
        document.addEventListener('selectionchange',(event) => {
            let {startNode} = this.gtSelection.getStartAndEndNode();
            let contentElement = startNode.closest('.content');
            if(contentElement !== this.editorContentElement){
                return false;
            }
            this.onSelectionchange(event);
        });

        if(textForInit){
            for(let i=0;i<textForInit.length; i++){
                let current = textForInit[i];
                let style = {};
                let node;

                if(current.italic){
                    style['font-style'] = 'italic';
                }
                if(current.bold){
                    style['font-weight'] = 'bold';
                }
                if(current.text != 'br'){
                    node = this.createNewNode('span', style, 'wordwrapper');
                    node.innerText = current.text;
                }else{
                    node = this.createBr();
                }

                this.editorContentElement.appendChild(node);
            }
        }



        frag.appendChild(this.editorContentElement);
        this.wrapperElement.appendChild(frag);

        // document.getElementsByClassName('content')[0].innerHTML = '<span class="wordwrapper">moshe</span><span class="wordwrapper">gilad</span><span class="wordwrapper">yael</span><span class="wordwrapper">aviadASDASDAan</span>'
        // document.getElementsByClassName('content')[0].innerHTML = '<span class="wordwrapper">moshe</span><span class="wordwrapper">gilad</span><span class="wordwrapper">yael</span><span class="wordwrapper">aviadASDASDAan</span>'

        return this;
    }

    onSelectionchange(event){


        if(this.isStyleChanged == true){
            return;
        }

        // console.log('onSelectionchange');

        let {startNode,endNode} = this.gtSelection.getStartAndEndNode(),
            states = this.getStates(),
            currentState,
            actionType,
            hasStyle,
            isStateOn;

        if(startNode.nodeName != 'SPAN'){
            return;
        }

        for(actionType in states){
            if(!states.hasOwnProperty(actionType)){
                return;
            }
            currentState = states[actionType];
            hasStyle = this.gtSelection.hasStyle(
                startNode,
                this.templateStateData[actionType].styleKey,
                this.templateStateData[actionType].styleValue
            );
            isStateOn = currentState.isOn();
            if(hasStyle && !isStateOn || !hasStyle && isStateOn){
                currentState.action('selectionchange');
            }
        }
    }


    checkIfSplitRequired(event){
        let {startNode, endNode, startOffset, endOffset} = this.gtSelection.getStartAndEndNode();
        return  !this.isBr(startNode) && ( endOffset>0 && startOffset>0 ) && (this.isStyleChanged || event.keyCode == 13);
    }

    isBr(node){
        return node && this.hasClass(node,'br');
    }

    isWordWrapper(node){
        return node && this.hasClass(node,'wordwrapper');
    }

    onKeyUp(event){

        
        /**
         * 40 arrow bottom
         * 38 arrow top
         * 37 arrow left
         * 39 arrow right
         */
        if(event.keyCode==8 || event.keyCode==40 || event.keyCode==38 || event.keyCode==37 || event.keyCode==39){
            return;
        }

        event = event || window.event;
        let key = event.which || event.keyCode; // keyCode detection
        let ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection

        /**
         * key == 86 -> Ctrl + V Pressed
         * key == 67 -> Ctrl + C Pressed
         * key == 66 -> Ctrl + B Pressed
         * key == 85 -> Ctrl + U Pressed
         * key == 73 -> Ctrl + I Pressed
         */
        if(ctrl && [86,67,66,65,85,63].indexOf(key) == -1){
            return;
        }

        // console.log('onKeyUp');

        if(!this.hasChildren(this.editorContentElement)){
            let { node } = this.gtSelection.createNewTextWrapper();
            this.setStyleByCollection( node, this.currentStyle );
            return;
        }

        let onKeyUpRange = this.gtSelection.getCurrentRange(),
            rangeToRestore = onKeyUpRange;

        let splitRequired = this.checkIfSplitRequired(event);
        let splitRange;

        let currentNode = this.gtSelection.getParentNodeByRange(onKeyUpRange);

        let {startNode, endNode, startOffset, endOffset} = this.gtSelection.getStartAndEndNode();

        if(splitRequired){
            let {range, node} = this.gtSelection.splitRangeByStyle(startNode,startOffset,startNode.firstChild.length,startNode.firstChild.length,false);
            rangeToRestore = range;
            currentNode = node;
            this.gtSelection.restoreSelection(range);
        }

        // keyCode 13 -> Enter key
        if(event.keyCode == 13){
            let isWordWrapper = this.isWordWrapper(currentNode);
            this.prepareBeforeCreateBr( true );
            this.addBr();
            this.gtSelection.restoreSelection(rangeToRestore);
        }

        currentNode = this.gtSelection.getParentNodeByRange(rangeToRestore);

        if(event.keyCode != 13 && ( this.isStyleChanged || !this.isWordWrapper(currentNode) )){
            let wordWrapper = this.createNewNode('span',this.currentStyle,'wordwrapper',null,null,"\u200B");
            this.gtSelection.setSelectionBefore(currentNode);
            let range = this.gtSelection.createNewRangeByNode(wordWrapper);
            this.gtSelection.setSelectionAfter(wordWrapper);
        }

        this.isStyleChanged = false;



        if(event.keyCode == 13){
            event.preventDefault();
            return false;
        }

    }


    createBr(){
        return this.createNewNode('span',null,'br',null,null,"\u200B<br>");
    }

    /**
     * @desc Create new <span>\u200B<br></span>
     * @returns {Range}
     */
    addBr(){
        let wrapper = this.createBr();
        return this.gtSelection.createNewRangeByNode(wrapper);
    }

    prepareBeforeCreateBr(setSelectionBefore){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        let sc = r.startContainer;
        let ec = r.endContainer;
        let nodeToCheckIsBr = sc.nodeName == 'SPAN' ? sc : sc.parentNode;
        let newRange;
        if(setSelectionBefore){
            newRange = this.gtSelection.setSelectionBefore(nodeToCheckIsBr);
        }else{
            newRange = this.gtSelection.setSelectionAfter(nodeToCheckIsBr);
        }

        return newRange;
    }
    

    onStateChange(state, sourceEvent){
        // console.log(sourceEvent);
        this.updateCurrentStyleByState(state);
        let { startNode } = this.gtSelection.getStartAndEndNode();
        this.compareStyleWithElement(startNode);

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

                if(startNode.firstChild.length > textData.endOffset  && textData.startOffset > 0){
                    this.gtSelection.splitRangeByStyle(element, 0, textData.startOffset, length, true);
                    textData.startOffset  = 0;
                    startOffset = 0;
                }

                endNode = element;
            }


            let fcLength = this.gtSelection.getParentNodeByRange(r).firstChild.length;
            elementNeedSplit =



                // (textData.endOffset < element.firstChild.length) &&
                ( (startNode === endNode && ((textData.endOffset - textData.startOffset) > 0) && (textData.endOffset - textData.startOffset) < fcLength ) ||
                ( element === startNode && textData.startOffset > 0 ) ||
                ( element === endNode && (textData.endOffset > 0) && textData.startOffset>0) ) ;

            lastElement = ( element === endNode );
            length = textData.endLength  = element.firstChild.length;

            if( elementNeedSplit ){
                let {node} = this.gtSelection.splitRangeByStyle(element, startOffset, endOffset, element.firstChild.length, lastElement);
                element = node;

            }

            if(this.isBr(element)){
                continue;
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
            if(count>20) {
                console.log('break');
                break;
            }

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