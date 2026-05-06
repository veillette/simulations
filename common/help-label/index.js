import PIXIHelpLabel from './help-label-pixi';
import HTMLHelpLabel from './help-label';

function HelpLabelView(options){

    if(options.attachTo && options.attachTo.$el){
        return new HTMLHelpLabel(options);
    } else {
        return new PIXIHelpLabel(options);
    }

}

export default HelpLabelView;