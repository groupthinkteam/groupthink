import { summary } from "./scripts/summary"


class action {
    constructor({ string: name, string: description, function: run }) {
        this.name = name;
        this.description = description;
        this.run = run;
    }
}

export default function directory(actionName) {
    
}


