
import { Directory, Filesystem, Encoding } from "@capacitor/filesystem";
import { defineStore } from "pinia";

export type Bookmark = {
  uri: string; name: string;
  thumbnail: { uri: string };
  type: "image" | "comic" | "chapter";
  folder?: null | { uri: string, name: string };
};

export type State = {
  bookmarks: Bookmark[];
};

export const useState = defineStore("state", {
  state(): State {
    return { bookmarks: [] };
  },
  actions: {
    addBookmark(bookmark: Bookmark) {
      this.bookmarks = [...this.bookmarks, bookmark];
      this.save();
    },

    removeBookmark(bookmark: Bookmark) {
      this.bookmarks = this.bookmarks.filter(item => {
        return !(
          item.uri === bookmark.uri &&
          item.name === bookmark.name &&
          item.type === bookmark.type &&
          item.folder?.uri === bookmark.folder?.uri &&
          item.folder?.name === bookmark.folder?.name &&
          item.thumbnail.uri === bookmark.thumbnail.uri
        )
      });
      this.save();
    },

    bookmarkExists(bookmark: Bookmark) {
      return (this.bookmarks as Array<Bookmark>).findIndex(item => {
        return (
          item.uri === bookmark.uri &&
          item.name === bookmark.name &&
          item.type === bookmark.type &&
          item.folder?.uri === bookmark.folder?.uri &&
          item.folder?.name === bookmark.folder?.name &&
          item.thumbnail.uri === bookmark.thumbnail.uri
        )
      }) !== -1;
    },

    $load(saved: State): void {
      console.log(saved);
      this.bookmarks = [ ...saved.bookmarks ];
    },

    async load(): Promise<void> {
      try {
        let { data } = await Filesystem.readFile({
          path: "state.json",
          encoding: Encoding.UTF8,
          directory: Directory.Data
        });
        if (data instanceof Blob) {
          data = await data.text();
        } else { data = data.toString() }

        this.$load(JSON.parse(data));
      } catch { await this.save() }
    },

    async save(): Promise<void> {
      const state = {
        bookmarks: this.bookmarks
      };

      console.log(state);

      await Filesystem.writeFile({
        path: "state.json",
        encoding: Encoding.UTF8,
        directory: Directory.Data,
        data: JSON.stringify(state)
      });
    }
  }
});

