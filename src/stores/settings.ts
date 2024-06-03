import { Directory, Filesystem, Encoding } from "@capacitor/filesystem";
import { defineStore } from "pinia";

export type ScraperConfig = {
  imageAttribute: string;
  imageSelector: string;
  titleSelector: string;
};

export type UIPositions = {
  sidebar: "left" | "right" | "bottom";
};

export type AppSettings = {
  directory: string;
  theme: "light" | "dark" | "system";
  positions: UIPositions;
  configs: { [key: string]: ScraperConfig };
};

export const useSettings = defineStore("settings", {
  state(): AppSettings {
    return {
      theme: "system", directory: "Manga",
      positions: { sidebar: "left" },
      configs: {
        "*": {
          imageAttribute: "",
          imageSelector: "src",
          titleSelector: ""
        },
        "https://theeminenceinshadowmanga.com": {
          imageAttribute: "src",
          titleSelector: "h1.entry-title",
          imageSelector: "#main .entry-content img"
        },
        "https://theeminenceinshadow.online": {
          imageAttribute: "src",
          titleSelector: "h1.entry-title",
          imageSelector: "#main .entry-content img"
        },
        "http://127.0.0.1:9000": {
          imageAttribute: "src",
          titleSelector: "h1.entry-title",
          imageSelector: "#main .entry-content img"
        },
        "https://readcomiconline.li": {
          imageAttribute: "src",
          titleSelector: "body > div.shifter-page > div.main > div > div.content.space-top > div.content_top.red > div > a > h3",
          imageSelector: "#divImage > p > img"
        },
      }
    };
  },
  actions: {
    $loadConfig(savedConfig: AppSettings): void {
      this.configs = { ...savedConfig.configs };
      this.theme = savedConfig.theme || this.theme;
      this.directory = savedConfig.directory || this.directory;
      this.positions = savedConfig.positions || this.positions;
    },

    setTheme(theme: AppSettings["theme"]) {
      this.theme = theme;
    },

    setSidebarPosition(position: AppSettings["positions"]["sidebar"]) {
      this.positions.sidebar = position;
    },

    async loadConfig(): Promise<void> {
      try {
        let { data } = await Filesystem.readFile({
          path: "settings.json",
          encoding: Encoding.UTF8,
          directory: Directory.Data
        });
        if (data instanceof Blob) {
          data = await data.text();
        } else {
          data = data.toString();
        }
        this.$loadConfig(JSON.parse(data));
      } catch {
        await this.saveConfig();
      }
    },

    async saveConfig(): Promise<void> {
      const state = {
        theme: this.theme,
        directory: this.directory,
        configs: { ...this.configs }
      };

      await Filesystem.writeFile({
        path: "settings.json",
        encoding: Encoding.UTF8,
        directory: Directory.Data,
        data: JSON.stringify(state)
      });
    }
  }
});
