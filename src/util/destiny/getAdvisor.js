import destiny from 'mrdandandan-destiny-api-module';
import {ADVISOR} from '../../constants';

export default getAdvisor;

function getAdvisor(advisorName) {
    return destiny.advisors.getPublicAdvisors()
        .then(advisors => {
            let advisor = advisors[advisorName],
                result = {
                    advisorName
                };

            switch (advisorName) {
                case ADVISOR.ARMS_DAY:
                    result.orders = advisor.orders;
                    result.testWeapon = advisor.testWeapons.reduce((output, current) => {
                        output.push({
                            itemHash: current.item.itemHash,
                            objectiveHash: current.item.objectives[0].objectiveHash
                        }, []);
                        return output;
                    });
                    break;
                case ADVISOR.AVAILABLE_BOUNTIES:
                    result.bounties = advisor['1527174714'].saleItems;
                    break;
                case ADVISOR.WEEKLY_CRUCIBLE:
                    result.activityHash = advisor[0].activityBundleHash;
                    break;
                case ADVISOR.NIGHTFALL:
                    result.specificActivityHash = advisor.specificActivityHash;
                case ADVISOR.HEROIC_STRIKE:
                    result.skulls = advisor.tiers[0].skullIndexes;
                case ADVISOR.DAILY_CHAPTER:
                case ADVISOR.DAILY_CRUCIBLE:
                    result.activityHash = advisor.activityBundleHash;
                    break;
            }

            return result;
        });
}