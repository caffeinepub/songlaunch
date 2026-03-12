import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Song {
    id: bigint;
    title: string;
    createdAt: bigint;
    coverBlobId: string;
    likes: bigint;
    audioBlobId: string;
    artist: string;
    uploadedBy: Principal;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSong(songId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSongs(): Promise<Array<Song>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likeSong(songId: bigint): Promise<Song>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadSong(title: string, artist: string, audioBlobId: string, coverBlobId: string): Promise<Song>;
}
