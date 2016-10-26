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
        this.backupType = data.backupType;
        this.backupTime = data.backupTime;

        this.status = data.status;
        this.size = data.size;
    }

}