import crucible from './crucible';
import director from './director';
import trials from './trials';

let actions = []
    .concat(crucible)
    .concat(director)
    .concat(trials);

export default actions;