import * as server from "./server";
import * as backup from "./backup";

export class Subscription {

    id: number;
    accountAlias: string;
    externalId: string;
    instanceType: string;
    engine: string;
    isReplicated: boolean;
    location: string;
    host: string;
    port: string;
    servers: Array<server.Server>;
    cpu: number;
    memory: number;
    storage: number;
    activeServerRole: string;
    backups: Array<backup.Backup>;
    backupIsEmpty: boolean;
    restartRequired: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.accountAlias = data.accountAlias;
        this.externalId = data.externalId;
        this.instanceType = data.instanceType;
        this.isReplicated = (this.instanceType.indexOf("REPLICATION") !== -1) ? true : false;
        this.engine = data.engine;
        this.location = data.location;
        this.host = data.host;
        this.port = data.port;
        this.servers = data.servers;

        let server = this.servers[0];
        this.cpu = server.cpu;
        this.memory = server.memory;
        this.storage = server.storage;

        this.servers.forEach(s => {
            if (s.attributes.hasOwnProperty('ACTIVE_CONNECTION')) {
                s.attributes.forEach(a => {
                    if (a.key == "REPLICATION_ROLE") this.activeServerRole = a.value;
                });
            }
        });

        this.backups = data.backups;
        this.backupIsEmpty = (this.backups.length == 0) ? true : false;
        this.restartRequired = data.restartRequired;
    }

    // TODO: Complete
    update() {

    }

}