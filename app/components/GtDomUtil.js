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
        
        if(attrs){
            let attribute;
            for(attribute in attrs){
                if(attrs.hasOwnProperty(attribute)){
                    node.setAttribute(attribute,attrs[attribute]);
                }
            }
        }


        if(id){
            node.setAttribute('id',id);
        }
        
        return node;
    }

    getParentById(target,id){
        if(target.nodeName == id){
            return event.target;
        }
        return target.closest('button');
    }
    
    toggleClass(node,className){
        if(!node) return false;
        
        return node.classList.contains(className) ?
            node.classList.remove(className) :
            node.classList.add(className);
    }
}