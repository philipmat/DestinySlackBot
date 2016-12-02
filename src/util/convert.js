import Enumeration from './enumeration';

const membershipType = new Enumeration({
    xbox: 1,
    ps: 2
});

export default class Convert {
    static toInt(value) {
        return +value.toString().replace(/,/g, '');
    }
    static toRoundedValue(value, places) {
        return +(Math.round(`${value}e+${places}`) + `e-${places}`);
    }
    static membershipTypeToPlatform(membershipTypeId) {
        return membershipType.toString(membershipTypeId);
    }
    static platformToMembershipType(platform) {
        return membershipType[platform];
    }
}