import {Server} from "./server";
import {Backup} from "./backup";
import {SubscriptionResponse} from "../api/SubscriptionAPI";

export class Subscription {

    id: number;
    accountAlias: string;
    location: string;
    instanceType: string;
    engine: string;
    externalId: string;
    host: string;
    port: number;
    status: string;
    servers: Array<Server>;
    backups: Array<Backup>;
    restartRequired: boolean;

    isReplicated: boolean;
    cpu: number;
    memory: number;
    storage: number;
    activeServerRole: string;
    backupIsEmpty: boolean;

    constructor(data: SubscriptionResponse) {
        this.id = data.id;
        this.accountAlias = data.accountAlias;
        this.externalId = data.externalId;
        this.instanceType = data.instanceType;
        this.isReplicated = (data.instanceType.indexOf("REPLICATION") !== -1) ? true : false;
        this.engine = data.engine;
        this.location = data.location;
        this.host = data.host;
        this.port = data.port;
        this.status = data.status;
        this.servers = data.servers;

        let server = this.servers[0];
        this.cpu = server.cpu;
        this.memory = server.memory;
        this.storage = server.storage;

        this.activeServerRole = getActiveServerRole(data.servers);

        this.backups = data.backups;
        this.backupIsEmpty = (data.backups.length == 0) ? true : false;
        this.restartRequired = data.restartRequired;
    }

    // TODO: Complete
    update() {

    }

}

function getActiveServerRole(servers: Array<Server>): string {
    let activeServerRole: string = "UNKNOWN";
    servers.forEach(s => {
        if (s.attributes.hasOwnProperty('ACTIVE_CONNECTION')) {
            s.attributes.forEach(a => {
                if (a.key == "REPLICATION_ROLE") {
                    activeServerRole = a.value;
                }
            });
        }
    });
    return activeServerRole;
}