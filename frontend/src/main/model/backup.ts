import * as moment from "moment";
import {RestorePointResponse, BackupResponse} from "../api/BackupAPI";
import Moment = moment.Moment;

export class RestorePoint {

    startPosition: Moment;
    formattedStartPosition: string;

    endPosition: Moment;
    formattedEndPosition: string;

    constructor(point: RestorePointResponse) {
        this.startPosition = moment.utc(point.startPosition);
        this.formattedStartPosition = this.startPosition.format("MMMM DD, YYYY HH:mm z");

        this.endPosition = moment.utc(point.endPosition);
        this.formattedEndPosition = this.endPosition.format("MMMM DD, YYYY HH:mm z");
    }
}

export class Backup {

    id: number;
    fileName: string;
    backupType: string;
    backupTime: string;
    status: string;
    size: number;

    constructor(data: BackupResponse) {
        this.id = data.id;
        this.fileName = data.fileName;
        this.backupTime = data.backupTime;
        this.backupType = data.backupType;
        this.status = data.status;
        this.size = data.size;
    }

    formattedBackupTime = (): string => {
        return moment.utc(this.backupTime).format("MMMM DD, YYYY HH:mm:ss z");
    }

}