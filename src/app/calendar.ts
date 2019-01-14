export class Calendar {
  public serverAddress: string;
  public username: string;
  public password: string;
  public enableSvcAcct: boolean;
  public resourceAcct?: string;
  private folderId: string;

  constructor(serverAddress, username, password,
              enableSvcAcct, resourceAcct) {
    this.serverAddress = serverAddress;
    this.username = username;
    this.password = password;
    this.enableSvcAcct = enableSvcAcct;
    this.resourceAcct = resourceAcct;
  }

  setFolderId(folderId: string): void {
    this.folderId = folderId;
  }
}
