import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Song } from "../backend.d";
import { useActor } from "./useActor";

export function useGetSongs() {
  const { actor, isFetching } = useActor();
  return useQuery<Song[]>({
    queryKey: ["songs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSongs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLikeSong() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (songId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.likeSong(songId);
    },
    onSuccess: (updatedSong) => {
      queryClient.setQueryData<Song[]>(
        ["songs"],
        (old) =>
          old?.map((s) => (s.id === updatedSong.id ? updatedSong : s)) ?? [],
      );
    },
  });
}

export function useUploadSong() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      artist: string;
      audioBlobId: string;
      coverBlobId: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.uploadSong(
        params.title,
        params.artist,
        params.audioBlobId,
        params.coverBlobId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
}

export function useDeleteSong() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (songId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSong(songId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
}
