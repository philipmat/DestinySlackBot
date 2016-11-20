let privateProps = new WeakMap();
export default class BotAction {
    constructor(command, respondsTo, action, description, requiresGamerTag = false) {
        privateProps.set(this, {
            command: command instanceof Array ? command : command.split(','),
            respondsTo: respondsTo instanceof Array ? respondsTo : respondsTo.split(','),
            invoke: typeof(action) === 'function' ? action : function() {},
            description,
            requiresGamerTag
        });
    }

    getCommand() {
        return privateProps.get(this).command;
    }

    getRespondsTo() {
        return privateProps.get(this).respondsTo;
    }

    invoke() {
        return privateProps.get(this).invoke.apply(this, arguments);
    }

    getDescription() {
        return privateProps.get(this).description;
    }

    requiresGamerTag() {
        return !!privateProps.get(this).requiresGamerTag;
    }
}