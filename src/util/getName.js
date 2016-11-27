export default getName;

function getName(message) {
    let name;

    if (message && message.text) {
        name = message.text.replace(message.match[0], '').trim();
    }

    return name;
}