export default interface IAppInfoResponse {
  appInfo: {
    name: string;
    repository_link: string;
    latest_version: string;
  };
  message: string;
}
