import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Song = {
    id : Nat;
    title : Text;
    artist : Text;
    audioBlobId : Text; // References blob id in persistent storage
    coverBlobId : Text; // References blob id in persistent storage
    likes : Nat;
    uploadedBy : Principal;
    createdAt : Int;
  };

  module Song {
    public func compareByCreatedAt(s1 : Song, s2 : Song) : Order.Order {
      Int.compare(s2.createdAt, s1.createdAt);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  var nextSongId = 0;
  let songs = Map.empty<Nat, Song>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadSong(title : Text, artist : Text, audioBlobId : Text, coverBlobId : Text) : async Song {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload songs");
    };

    let song : Song = {
      id = nextSongId;
      title;
      artist;
      audioBlobId;
      coverBlobId;
      likes = 0;
      uploadedBy = caller;
      createdAt = Time.now();
    };

    songs.add(nextSongId, song);
    nextSongId += 1;

    song;
  };

  public query ({ caller }) func getSongs() : async [Song] {
    songs.values().toArray().sort(Song.compareByCreatedAt);
  };

  public shared ({ caller }) func likeSong(songId : Nat) : async Song {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like songs");
    };

    switch (songs.get(songId)) {
      case (null) { Runtime.trap("Song not found") };
      case (?song) {
        let updatedSong : Song = {
          id = song.id;
          title = song.title;
          artist = song.artist;
          audioBlobId = song.audioBlobId;
          coverBlobId = song.coverBlobId;
          likes = song.likes + 1;
          uploadedBy = song.uploadedBy;
          createdAt = song.createdAt;
        };
        songs.add(songId, updatedSong);
        updatedSong;
      };
    };
  };

  public shared ({ caller }) func deleteSong(songId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete songs");
    };

    switch (songs.get(songId)) {
      case (null) { Runtime.trap("Song not found") };
      case (?song) {
        // Allow deletion if caller is the uploader OR an admin
        if (song.uploadedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the uploader or an admin can delete this song");
        };
        songs.remove(songId);
      };
    };
  };
};
