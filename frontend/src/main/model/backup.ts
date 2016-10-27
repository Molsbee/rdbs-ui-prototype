import * as moment from "moment";

export class Backup {

    id: number;
    fileName: string;
    backupType: string;
    backupTime: string;
    // TODO: Should this just be a method
    // formattedBackupTime: string;
    status: string;
    size: string;

    constructor(data: any) {
        this.id = data.id;
        this.fileName = data.fileName;
        this.backupType = data.backupType;
        this.backupTime = data.backupTime;
        // this.formattedBackupTime = moment.utc(data.backupTime).format("MMMM DD, YYYY HH:mm:ss z");
        this.status = data.status;
        this.size = data.size;
    }

    getFormattedBackupTime() : string {
        return moment.utc(this.backupTime).format("MMMM DD, YYYY HH:mm:ss z");
    }

}