export default formatAttachment;

function formatAttachment(attachment = {}) {
    if(!attachment.mrkdwn_in) {
        attachment.mrkdwn_in = ["text", "pretext", "title", "fields"]
    }

    return attachment;
}