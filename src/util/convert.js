const membershipTypeMap = {
    '1': 'xbox',
    '2': 'ps'
};

export default class Convert {
    static toInt(value) {
        return +value.toString().replace(/,/g, '');
    }
    static toRoundedValue(value, places) {
        return +(Math.round(`${value}e+${places}`) + `e-${places}`);
    }
    static membershipTypeToPlatform(membershipType) {
        return membershipTypeMap[membershipType];
    }
}