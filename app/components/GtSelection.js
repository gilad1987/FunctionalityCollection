import {GtDomUtil} from "./GtDomUtil";

/**
 * @date 13.7.2016
 * @author Gilad Takoni
 */
export class GtSelection extends GtDomUtil{
    
    constructor(){
        super();
    }

    /**
     *
     * @param {string} [text]
     * @param {number} [startOffset]
     * @param {number} [endOffset]
     * @param {string} [html]
     * @param {Element} [node]
     * @returns {{range: Range, node: Element}}
     */
    createNewTextWrapper(text,startOffset,endOffset,html,node){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        let sc = r.startContainer;
        let ec = r.endContainer;
        let defaultText = text ? text : "\u200B";
        let span = node ? node : this.createNewNode('span',null,null,null,null,defaultText);

        span.className = 'wordwrapper';

        r = r.cloneRange();
        r.insertNode(span);

        r.setStart(span,startOffset?startOffset:0);
        r.setEnd(span,endOffset?endOffset:0);

        r.deleteContents();

        s.removeAllRanges();
        // console.log('createNewTextWrapper');
        s.addRange(r);

        return {
            range:r,
            node:span
        }
    }
    
    getCurrentNode(){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        return this.getParentNodeByRange(r);
    }

    /**
     * @desc
     * @param {Range} [range]
     * @returns {Node}
     */
    getParentNodeByRange(range){
        let s = window.getSelection();
        let r = range ? range : s.getRangeAt(0);
        return r.startContainer.nodeName == 'SPAN' ? r.startContainer : r.startContainer.parentNode;
    }


    /**
     * @param {Range} [range]
     * @returns {{startNode: Node, endNode: Node}}
     */
    getCursorInfo(range){
        
        let s = window.getSelection();
        let r = range ? range : s.getRangeAt(0);
        
        return {
            startNode: r.startContainer.nodeName == 'SPAN' ? r.startContainer : r.startContainer.parentNode,
            endNode: r.endContainer.nodeName == 'SPAN' ? r.endContainer : r.endContainer.parentNode,
            startOffset: r.startOffset,
            endOffset: r.endOffset,
            range: r
        }
    }

    /**
     *
     * @param element
     * @param startOffset
     * @param endOffset
     * @returns {{firstElement: Element, middleElement: Element|undefined, lastElement: Element}}
     */
    splitText(element, startOffset, endOffset) {

        let nodeTextToSplit = element.firstChild,
            middleElement,
            lastElement,
            textStart,
            textMiddle,
            textLast;

        if(startOffset > 0 && endOffset < length){
            textStart = nodeTextToSplit.nodeValue.toString().substr(0,startOffset);
            textMiddle = nodeTextToSplit.nodeValue.toString().substr(startOffset,endOffset);
            textLast = nodeTextToSplit.nodeValue.toString().substr(endOffset,nodeTextToSplit.length);
            nodeTextToSplit.nodeValue = textStart;
            middleElement = this.createNewNode('span',null,'wordwrapper',null,null,textMiddle);
            lastElement = this.createNewNode('span',null,'wordwrapper',null,null,textLast);
            this.insertAfter(middleElement, element);
            this.insertAfter(lastElement, middleElement);
        }else{
            textStart = nodeTextToSplit.nodeValue.toString().substr(startOffset,endOffset);
            textLast = nodeTextToSplit.nodeValue.toString().substr(endOffset,nodeTextToSplit.length);
            nodeTextToSplit.nodeValue = textStart;
            lastElement = this.createNewNode('span',null,'wordwrapper',null,null,textLast);
            this.insertAfter(lastElement,element);
        }

        return{
            firstElement:element,
            middleElement:middleElement,
            lastElement:lastElement
        }

    }

    /**
     * @param {Element} node
     * @param {boolean} [collapse]
     * @returns {Range}
     */
    createNewRangeByNode(node,collapse){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        let sc = r.startContainer;
        let ec = r.endContainer;

        r = r.cloneRange();
        // r.deleteContents();
        r.insertNode(node);

        r.setStart(node.firstChild,0);
        r.setEnd(node.firstChild,0);

        s.removeAllRanges();
        // console.log('createNewRangeByNode');
        s.addRange(r);
        
        return r;
    }

    getCursorData(){

    }

    isTextSelected(){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        let {startNode, endNode} = this.getCursorInfo(r);

        return ( ( r.endOffset - r.startOffset ) != 0 ) || startNode !== endNode;
    }

    addRange(startNode, endNode, startOffset, endOffset){
        let range = document.createRange(),
            selection = window.getSelection();

        range.selectNode(startNode);
        range.setStart(startNode.firstChild,0);
        range.setEnd(startNode.firstChild,0);
        
        selection.removeAllRanges();
        selection.addRange(range);

        return range;
    }

    restoreSelection(range,deleteContent,startOffset,endOffset) {
        if (range) {
            deleteContent = typeof deleteContent == 'undefined' ? false : deleteContent;
            let sel = window.getSelection();

            if(deleteContent){
                range.deleteContents();
            }

            if(startOffset){
                range.setStart(range.startContainer,startOffset);
            }
            if(endOffset){
                range.setEnd(range.startContainer,endOffset);
            }
            sel.removeAllRanges();
            // console.log('restoreSelection');
            sel.addRange(range);
        }
    }


    setSelectionBefore(node){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        s.removeAllRanges();
        r = r.cloneRange();
        r.setStartBefore(node);
        s.addRange(r);
        // console.log('setSelectionBefore');
        return r;
    }

    setSelectionAfter(node,setStart){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        s.removeAllRanges();
        r = r.cloneRange();
        r.setStartAfter(node);
        if(setStart){
            r.setStart(node,0);
            r.setEnd(node,0);
        }
        // console.log('setSelectionAfter');
        s.addRange(r);
        return r;
    }
    
    getCurrentRange(){
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }
}