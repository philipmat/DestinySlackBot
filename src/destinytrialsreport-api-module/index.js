import general from './endpoints/general';
import slack from './endpoints/slack';

export default {
    general,
    slack
};

general.currentMap()
    .then(response => console.log(response));