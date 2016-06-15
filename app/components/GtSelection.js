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
     * @param text
     * @param startOffset
     * @param endOffset
     * @param html
     * @param node
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
    getStartAndEndNode(range){
        
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
     * @param length
     * @param {boolean} [setSelectionBefore]
     * @returns {{range, node}|{range: Range, node: Element}}
     */
    splitRangeByStyle(element, startOffset, endOffset, length, setSelectionBefore){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        let textForNewNode;

        length = length!=null ? length : element.firstChild.length;

        // get element.firstChild for text Element
        setSelectionBefore ?
            this.setSelectionBefore(element) :
            this.setSelectionAfter(element);

        textForNewNode = element.firstChild.nodeValue.toString().substr(startOffset,endOffset);

        let result = this.createNewTextWrapper(textForNewNode);



        element.firstChild.nodeValue = element.firstChild.nodeValue.toString().substr(
            startOffset == 0 ? endOffset : 0  ,
            startOffset == 0 ? length : startOffset
        );

        this.cloneStyle(element,result.node);

        return result;
    }

    /**
     * @param {Element} node
     * @returns {Range}
     */
    createNewRangeByNode(node){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        let sc = r.startContainer;
        let ec = r.endContainer;

        r = r.cloneRange();

        r.deleteContents();
        r.insertNode(node);

        r.setStart(node.firstChild,0);
        r.setEnd(node.firstChild,0);

        s.removeAllRanges();
        s.addRange(r);
        
        return r;
    }

    getCursorData(){

    }

    isTextSelected(){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        let {startNode, endNode} = this.getStartAndEndNode(r);

        return ( ( r.endOffset - r.startOffset ) != 0 ) || startNode !== endNode;
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