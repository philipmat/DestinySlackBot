let privateProps = new WeakMap();
export default class BotAction {
    constructor(command, respondsTo, action, description, requiresGamerTag = false) {
        privateProps.set(this, {
            commands: command instanceof Array ? command : command.split(','),
            respondsTo: respondsTo instanceof Array ? respondsTo : respondsTo.split(','),
            action: typeof(action) === 'function' ? action : function() {},
            description,
            requiresGamerTag
        });
    }

    getCommands() {
        return privateProps.get(this).commands;
    }

    getRespondsTo() {
        return privateProps.get(this).respondsTo;
    }

    getAction() {
        return privateProps.get(this).action;
    }

    getDescription() {
        return privateProps.get(this).description;
    }

    requiresGamerTag() {
        return !!privateProps.get(this).requiresGamerTag;
    }
}