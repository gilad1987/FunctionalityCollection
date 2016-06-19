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
     * @param {array|string|null} [classes]
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
     * @param target
     * @param nodeName
     * @returns {Element}
     */
    getParentByNodeName(target,nodeName){
        if(target.nodeName == nodeName){
            return event.target;
        }
        return target.closest('button');
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
        return value ? node.style[key] == value : node.style[key] != '';
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
     * @param collection
     */
    setStyleByCollection(node,collection){
        let property;
        for(property in collection){
            if(collection.hasOwnProperty(property))
                this.setStyle(node,property,collection[property]);
        }
    }

    /**
     *
     * @param {Element} node
     * @param {object} collection
     * @returns {boolean}
     */
    hasStyleCollection(node,collection){
        let property,
            hasStyleCollection = true;

        for(property in collection){
            if(collection.hasOwnProperty(property) && !this.hasStyle(node,property,collection[property])){
                hasStyleCollection = false;
                break;
            }
        }

        return hasStyleCollection;
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
     * @param {Element} node
     * @param {string} className
     * @returns {*}
     */
    removeClass(node,className){
        if(!node) return;
        node.classList.remove(className);
        return this;
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
    

}