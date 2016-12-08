import crucible from './crucible';
import director from './director';
import trials from './trials';
import twitch from './twitch';

let actions = []
    .concat(crucible)
    .concat(director)
    .concat(trials)
    .concat(twitch);

export default actions;