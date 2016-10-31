import * as moment from "moment";
import {RestorePointResponse} from "../api/BackupAPI";
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
    formattedBackupTime: string;
    status: string;
    size: string;

    constructor(data: any) {
        this.id = data.id;
        this.fileName = data.fileName;
        this.backupTime = data.backupTime;
        this.backupType = data.backupType;
        this.formattedBackupTime = moment.utc(data.backupTime).format("MMMM DD, YYYY HH:mm:ss z");
        this.status = data.status;
        this.size = data.size;
    }

}