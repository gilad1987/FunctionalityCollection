import {GtDomUtil} from "./GtDomUtil";

/**
 * @date 13.7.2016
 * @author Gilad Takoni
 */
export class GtSelection extends GtDomUtil{
    
    constructor(){
        super();
    }


    
    getCurrentNode(){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        return this.getParentNodeByRange(r);
    }

    getCurrentRange(){
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        return r;
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

    isTextSelected(){
        let {startNode, endNode, startOffset, endOffset} =  this.getCursorInfo();
        return ( startNode === endNode && ( startOffset-endOffset != 0 ) ) || startNode !== endNode;
    }

    addRange(startNode, endNode, startOffset, endOffset){
        let range = document.createRange(),
            selection = window.getSelection();

        range.selectNode(startNode);
        range.setStart(startNode.firstChild,0);
        range.setEnd(startNode.firstChild,0);
        
        selection.removeAllRanges();
        // console.log('addRange');
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

}