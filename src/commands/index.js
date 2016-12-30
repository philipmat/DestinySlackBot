import crucible from './crucible';
import director from './director';
import info from './info';
import trials from './trials';
import twitch from './twitch';
import vendors from './vendors';

let actions = []
    .concat(crucible)
    .concat(director)
    .concat(info)
    .concat(trials)
    .concat(twitch)
    .concat(vendors);

export default actions;