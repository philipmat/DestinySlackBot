import util from '../index';

export default aggregateMatchStatsToFields;

function aggregateMatchStatsToFields (heading, subHeading, matches, losses, kd) {
        let winPercent = util.Convert.toRoundedValue(100 * (matches - losses) / matches, 2),
        winCount = matches - losses;

    let fields = [
        {
            title: heading,
            value: subHeading,
            short: true
        },
        {
            title: `Record`,
            value: `W: ${winCount} - L: ${losses}`,
            short: true
        },
        {
            title: `Win Percent`,
            value: `${winPercent}%`,
            short: true
        },
        {
            title: `K/D`,
            value: kd,
            short: true
        }
    ];

    let fallback = `${heading} | W: ${winCount} - L: ${losses}`;

    return {
        fields,
        fallback
    }
}