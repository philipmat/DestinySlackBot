import currentMap from './currentMap';
import archnemesis from './archnemesis';
import lastWeek from './weeklystats/lastWeek';
import thisWeek from './weeklystats/thisWeek';
import trialsWeek from './weeklystats/trialsWeek';

export default [
    archnemesis,
    currentMap,
    lastWeek,
    thisWeek,
    trialsWeek
]

let commands = {
    archnemesis,
    currentMap,
    lastWeek,
    thisWeek,
    trialsWeek
};

export {
    commands
}