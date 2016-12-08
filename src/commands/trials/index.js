import currentMap from './currentMap';
import archnemesis from './archnemesis';
import lastWeek from './weeklystats/lastWeek';
import thisWeek from './weeklystats/thisWeek';
import trialsWeek from './weeklystats/trialsWeek';
import thisMap from './mapstats/thisMap';
import mapStats from './mapstats/mapStats';

export default [
    archnemesis,
    currentMap,
    lastWeek,
    thisWeek,
    trialsWeek,
    thisMap,
    mapStats
]

let commands = {
    archnemesis,
    currentMap,
    lastWeek,
    thisWeek,
    trialsWeek,
    thisMap,
    mapStats
};

export {
    commands
}