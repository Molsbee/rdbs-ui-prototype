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
    // cpu: number;
    // memory: number;
    // storage: number;
    // activeServerRole: string;
    backups: Array<backup.Backup>;
    backupIsEmpty: boolean;
    // restartRequired: boolean;

    constructor(id: number, accountAlias: string, externalId: string,
                instanceType: string, engine: string, location: string,
                host: string, port: string, servers: Array<server.Server>,
                backups: Array<backup.Backup>) {
        this.id = id;
        this.accountAlias = accountAlias;
        this.externalId = externalId;
        this.instanceType = instanceType;
        this.isReplicated = (instanceType.indexOf("REPLICATION") !== -1) ? true : false;
        this.engine = engine;
        this.location = location;
        this.host = host;
        this.port = port;
        this.servers = servers;

        this.backups = backups;
        this.backupIsEmpty = (backups.length == 0) ? true : false;
    }

}