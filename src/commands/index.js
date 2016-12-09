import crucible from './crucible';
import director from './director';
import info from './info';
import trials from './trials';
import twitch from './twitch';

let actions = []
    .concat(crucible)
    .concat(director)
    .concat(info)
    .concat(trials)
    .concat(twitch);

export default actions;