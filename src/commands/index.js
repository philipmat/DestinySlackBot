import crucible from './crucible';
import director from './director';
import trials from './trials';

import {commands as crucibleCommands} from './crucible';
import {commands as directorCommands} from './director';
import {commands as trialsCommands} from './trials';


let actions = []
    .concat(crucible)
    .concat(director)
    .concat(trials);

export default actions;
export {
    crucibleCommands as crucible,
    directorCommands as director,
    trialsCommands as trials
};