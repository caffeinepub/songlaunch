import { HttpAgent } from "@icp-sdk/core/agent";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

export function useBlobStorage() {
  const { identity } = useInternetIdentity();

  const getClient = async (): Promise<StorageClient> => {
    const config = await loadConfig();
    const agent = new HttpAgent({
      identity: identity ?? undefined,
      host: config.backend_host,
    });
    if (config.backend_host?.includes("localhost")) {
      await agent.fetchRootKey();
    }
    return new StorageClient(
      config.bucket_name,
      config.storage_gateway_url,
      config.backend_canister_id,
      config.project_id,
      agent,
    );
  };

  const uploadBlob = async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<string> => {
    const client = await getClient();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await client.putFile(bytes, onProgress);
    return hash;
  };

  const getBlobUrl = async (blobId: string): Promise<string> => {
    if (!blobId) return "";
    const client = await getClient();
    return client.getDirectURL(blobId);
  };

  return { uploadBlob, getBlobUrl };
}
