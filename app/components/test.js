import GtEventManager from 'components/gt-event-manager/GtEventManager';

let events = new GtEventManager();
let i=1;
for(;i<=10;i++){
    events.on('event_number:'+i,function(target,number,number2){
        console.log('event_number: '+number+' number2 = '+number2);
    });
    if(i==5){
        events.off('event_number:'+i);
    }
}

i=1;
for(;i<=10;i++){
    let arg = [null,i,i+5];
    events.trigger('event_number:'+i,arg);
}