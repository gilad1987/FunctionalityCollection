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
        this.editorContentElementInit = false;

        this.initCurrentStyle();

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
            let {startNode} = this.gtSelection.getCursorInfo();
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

        // this.editorContentElement.innerHTML = '<p><span class="wordwrapper">moshe</span><span class="wordwrapper">gilad</span><span class="wordwrapper">moshe</span><span class="wordwrapper">gilad</span></p><p><span class="wordwrapper">yael</span><span class="wordwrapper">aviadASDASDAan</span></p>'

        return this;
    }

    onSelectionchange(event){

        if(this.isStyleChanged == true){
            return;
        }

        let {startNode} = this.gtSelection.getCursorInfo(),
            state, stateData, newIndex, length, i = 0,currentStyleToUpdate;

        if(startNode.nodeName != 'SPAN'){
            return;
        }
        
        let stylesNotEqual = this.compareCurrentStyleWithStyleElement(startNode);
        
        if(length = stylesNotEqual.length){
            for(;i<length;i++){
                currentStyleToUpdate = stylesNotEqual[i];
                stateData = this.getStateData(currentStyleToUpdate.state);
                newIndex = stateData.style.values.indexOf(currentStyleToUpdate.nodeStyleValue);
                currentStyleToUpdate.state.setCurrentIndex(newIndex);
                currentStyleToUpdate.state.action('editor:updateStateByCurrentNode');
            }
        }

    }
    
    checkIfSplitRequired(event){
        return   (this.isStyleChanged || event.keyCode == 13);
    }

    isBr(node){
        return node && this.hasClass(node,'br');
    }

    isWordWrapper(node){
        return node && this.hasClass(node,'wordwrapper');
    }

    setStyleToLine(lineElement){
        this.setStyle(lineElement,'text-align',this.currentStyle['text-align'].value);
    }

    onKeyUp(event){

        //#TODO implement when user press delete and cursor in offset == 0 in wordwrapper element

        if(this.editorContentElementInit && !this.isStyleChanged){
            return;
        }
        
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

            let lineElement = this.createNewLine();
            let wordwrapper = this.createNewNode('span',null,null,null,null,"\u200B");
            this.setStyleByCollection( wordwrapper, this.currentStyle ,['text-align']);
            lineElement.appendChild(wordwrapper);
            this.editorContentElement.appendChild(lineElement);
            this.setStyleToLine(lineElement);
            this.gtSelection.addRange(wordwrapper);
            this.editorContentElementInit = true;
            return;
        }

        if(!this.checkIfSplitRequired(event)){
            return;
        }

        let {startNode, endNode, startOffset, endOffset} = this.gtSelection.getCursorInfo();

        let {firstElement, lastElement} = this.gtSelection.splitText(startNode,0,endOffset);
        this.gtSelection.addRange(lastElement);
        this.gtSelection.setSelectionBefore(lastElement);

        // keyCode 13 -> Enter key
        if(event.keyCode == 13){
            let newlineElement = this.createNewLine();
            this.setStyleToLine(newlineElement);

            let nextElement,
                currentElement,
                lineElement,
                frag = document.createDocumentFragment();

            nextElement = lastElement;

            do{
                currentElement = nextElement;
                nextElement = nextElement.nextElementSibling;
                frag.appendChild(currentElement);
            }while(nextElement);

            lineElement = this.getLineElement(firstElement);

            newlineElement.appendChild(frag);
            this.insertAfter(newlineElement, lineElement);
            this.gtSelection.addRange(lastElement);

        }else{

        }
        
        this.isStyleChanged = false;
        if(event.keyCode == 13){
            event.preventDefault();
            return false;
        }

    }

    getLineElement(node){
        return node.closest('p');
    }

    createNewLine(isNotEmpty){
        return this.createNewNode('p',null,null,null,null, isNotEmpty ? "\u200B" : '');
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
    

    getCurrentStyleByState(state){
        return{
            key:this.currentStyle[state.stateName].key,
            value:this.currentStyle[state.stateName].value
        }
    }

    onStateChange(state, eventName){
        
        this.updateCurrentStyleByState(state);
        
        if(eventName == 'toolbar:stateValueChange'){
            let element = this.gtSelection.getCurrentNode();
            if(this.isStateOfLine(state)){
                element = element.closest('p');
            }
            let {key,value} = this.getCurrentStyleByState(state);
            this.isStyleChanged = !this.hasStyle(element,key,value);
            if(this.isStyleChanged){
                let styleToApply = this.getCurrentStyle(state);
                this.applyStyle(styleToApply,element);
            }

        }

    }

    getCurrentStyle(state){
        return this.currentStyle[state.stateName];
    }

    isStateOfLine(state){
        return state.stateName == 'text-align' || state.stateName == 'direction';
    }

    isStyleLine(style){
        return style.key == 'text-align' || style.key == 'direction';
    }

    applyStyle(style,element){

        if(!this.gtSelection.isTextSelected()){
            if(this.isStyleLine(style)){
                this.setStyle(element,style.key ,style.value);
                this.isStyleChanged = false;
            }
            return;
        }

    }

}