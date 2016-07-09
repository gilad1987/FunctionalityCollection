import {GtEvent} from "./GtEvent";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export class GtDomUtil extends GtEvent{

    constructor(){
        super();
    }

    /**
     *
     * @param {string} nodeName
     * @param {Object|null} [styles]
     * @param {Array|string|null} [classes]
     * @param {string|null} [id]
     * @param {object|string} [dataset]
     * @param {Element|string} [htmlOrString]
     * @param {Object} [attrs]
     * @returns {Element}
     */
    createNewNode(nodeName, styles, classes, id, dataset, htmlOrString, attrs){
        let node = document.createElement(nodeName),
            length,i;

        if(htmlOrString){
            node.innerHTML = htmlOrString;
        }

        // set style in node
        if(styles){
            let property;
            for(property in styles){
                if(styles.hasOwnProperty(property)){
                    node.style[property] = styles[property];
                }
            }
        }

        // add class to node
        if(classes){
            if(Array.isArray(classes)){
                length = classes.length;

                for(i=0;i<length;i++){
                    node.classList.add(classes[i]);
                }
            }
            
            if(typeof classes == 'string'){
                node.classList.add(classes);
            }
        }

        // set data dataSet
        if(dataset){
            if(typeof dataset === 'object'){
                let currentDataset;
                for(currentDataset in dataset){
                    if(dataset.hasOwnProperty(currentDataset)){
                        node.dataset[currentDataset] = dataset[currentDataset];
                    }
                }
            }
        }

        // set attributes
        if(attrs){
            let attribute;
            for(attribute in attrs){
                if(attrs.hasOwnProperty(attribute)){
                    node.setAttribute(attribute,attrs[attribute]);
                }
            }
        }

        // set attributes
        if(id){
            node.setAttribute('id',id);
        }
        
        return node;
    }

    /**
     *
     * @param {Element} node
     * @param {string} key
     * @param {string} [value]
     * @returns {boolean}
     */
    hasStyle(node,key,value){
        // console.log('hasStyle');
        if(!node) return false;
        let s = node.style[key];
        return node.style[key] == value || (value=='' && typeof s == 'undefined');
    }

    /**
     *
     * @param {Element} node
     * @param {string} key
     * @param {string} value
     * @returns {*}
     */
    setStyle(node,key,value){
        if(!node) return;
        node.style[key] = value;
        return this;
    }

    /**
     *
     * @param {Element} node
     * @param key
     * @returns {*}
     */
    removeStyle(node,key){
        if(!node) return;
        node.style[key] = null;
        return this;
    }

    /**
     *
     * @param {Element} node
     * @param {Array} [preventStyle]
     * @param collection
     */
    setStyleByCollection(node,collection,preventStyle){
        let style;
        for(style in collection){
            let _preventStyle = preventStyle && preventStyle.indexOf(style) != -1;
            if(collection.hasOwnProperty(style) && !_preventStyle){
                this.setStyle(node,style,collection[style].value);
            }

        }
    }

    /**
     *
     * @param {Element} node
     * @param {string} className
     * @returns {*|DOMTokenList|boolean}
     */
    hasClass(node,className){
        return node && node.classList && node.classList.contains(className);
    }

    /**
     *
     * @param {Element} node
     * @param {string} className
     * @returns {*}
     */
    addClass(node,className){
        if(!node) return;
        node.classList.add(className);
        return this;
    }

    /**
     * 
     * @param newNode
     * @param referenceNode
     */
    insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    
    /**
     *
     * @param {Element|Array|NodeList} elements
     * @param {string} className
     * @returns {*}
     */
    removeClass(elements,className){
        if(!elements) return this;

        if(Array.isArray(elements)){
            elements = [elements];
        }

        let i=0,len=elements.length;
        for(;i<len;i++){
            elements[i].classList.remove(className);
        }

        return this;
    }

    getStyleValue(node, key){
        return node.style[key];
    }

    /**
     *
     * @param {Element} node
     * @param {string} className
     * @returns {*}
     */
    toggleClass(node,className){
        if(!node) return false;
        
        node.classList.contains(className) ? 
            node.classList.remove(className) : 
            node.classList.add(className);
        
        return this;
    }

    /**
     *
     * @param {Element} node
     * @returns {boolean}
     */
    hasChildren(node){
        return node.childNodes.length!=0;
    }

    /**
     *
     * @param {Element} node
     * @param {object} styleCollection
     */
    removeStyleHasNoInCollection(node, styleCollection){
        let key = 0,property;
        
        while (property = node.style[key]){
            if( typeof styleCollection[property] == 'undefined'){
                node.style[property] = null;
            }

            key++;
        }
    }

    /**
     *
     * @param {Element} nodeHasStyle
     * @param {Element} node
     * @returns {GtDomUtil}
     */
    cloneStyle(nodeHasStyle, node){
        let key = 0,property;

        while (property = nodeHasStyle.style[key]){
            node.style[property] = nodeHasStyle.style[property];
            key++;
        }
        
        return this;
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
            length = nodeTextToSplit.length,
            textStart,
            textMiddle,
            result,
            textLast;

        result = {
            firstElement:element,
            middleElement:null,
            lastElement:element
        };

        if(startOffset > 0 && endOffset < length){
            textStart = nodeTextToSplit.nodeValue.toString().substr(0,startOffset);
            textMiddle = nodeTextToSplit.nodeValue.toString().substr(startOffset,endOffset);
            textLast = nodeTextToSplit.nodeValue.toString().substr(endOffset,nodeTextToSplit.length);
            nodeTextToSplit.nodeValue = textStart;
            result.middleElement = this.createNewNode('span',null,null,null,null,textMiddle);
            result.lastElement = this.createNewNode('span',null,null,null,null,textLast);
            this.insertAfter(result.middleElement, element);
            this.insertAfter(result.lastElement, result.middleElement);
        }

        if(startOffset == 0 && endOffset < length){
            textStart = nodeTextToSplit.nodeValue.toString().substr(startOffset,endOffset);
            textLast = nodeTextToSplit.nodeValue.toString().substr(endOffset,nodeTextToSplit.length);
            nodeTextToSplit.nodeValue = textStart;
            result.lastElement = this.createNewNode('span',null,null,null,null,textLast);
            this.insertAfter(result.lastElement,element);
        }

        return result;
    }
    

}