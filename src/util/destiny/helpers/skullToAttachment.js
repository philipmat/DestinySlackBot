export default skullToAttachment;

function skullToAttachment(skull) {
    let skullAttachment = {
        mrkdwn_in: ['text', 'pretext', 'title']
    };
    skullAttachment.title = `${skull.displayName}`;
    skullAttachment.text = `_${skull.description}_`;
    skullAttachment.thumb_url = `http://bungie.net${skull.icon}`;

    return skullAttachment;
}