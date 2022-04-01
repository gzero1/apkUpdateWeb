export interface Apk {
  id: number;
  is_stable: boolean;
  uploaded_at: string;
  app_id: number;
  version: string;
}

type IApksResponse = Apk[];

export default IApksResponse;
