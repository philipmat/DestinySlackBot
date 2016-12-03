export default class CommandParamRegex {
    constructor(pattern, required = true) {
        this.pattern = pattern;
        this.required = required;
    }
}