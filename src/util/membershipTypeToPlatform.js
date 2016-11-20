export default membershipTypeToPlatform;

const membershipTypeMap = {
    '1': 'xbox',
    '2': 'ps'
};

function membershipTypeToPlatform(membershipType) {
    return membershipTypeMap[membershipType];
}