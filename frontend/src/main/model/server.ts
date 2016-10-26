export class Server {

    alias: string;
    location: string;
    cpu: number;
    memory: number;
    storage: number;
    attributes: Array<{key: string, value: string}>;

    constructor(data: any) {
        this.alias = data.alias;
        this.location = data.location;
        this.cpu = data.cpu;
        this.memory = data.memory;
        this.storage = data.storage;
        this.attributes = data.attributes;
    }
}