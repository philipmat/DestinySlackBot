import destinyApi from 'mrdandandan-destiny-api-module';

export default searchDestinyPlayer;

function searchDestinyPlayer(membershipType, displayName) {
    return destinyApi.search.searchDestinyPlayer({
        membershipType,
        displayName
    }).then(response => {
        return response;
    });
}