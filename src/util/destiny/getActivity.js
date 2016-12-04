import destiny from 'mrdandandan-destiny-api-module';

export default getActivity;

function getActivity(activityHash) {
    return destiny.manifest.getActivity({activityId: activityHash})
        .then(response => response.activity);
}