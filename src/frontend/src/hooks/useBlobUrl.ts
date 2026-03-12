import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

const urlCache = new Map<string, string>();

async function resolveBlobUrl(blobId: string): Promise<string> {
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  const client = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  return client.getDirectURL(blobId);
}

export function useBlobUrl(blobId: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(() =>
    blobId ? (urlCache.get(blobId) ?? null) : null,
  );

  useEffect(() => {
    if (!blobId) {
      setUrl(null);
      return;
    }
    const cached = urlCache.get(blobId);
    if (cached) {
      setUrl(cached);
      return;
    }
    let cancelled = false;
    resolveBlobUrl(blobId).then((resolved) => {
      if (!cancelled) {
        urlCache.set(blobId, resolved);
        setUrl(resolved);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [blobId]);

  return url;
}
