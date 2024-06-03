
function parse(source) {
  const parser = new DOMParser();
  return parser.parseFromString(source, "text/html", { mode: "cors" });
}

export default class Scraper {
  #root;
  #source;
  #config;
  #selector;

  constructor(config) {
    this.#config = {
      ...this.#default,
      ...(config || {}),
    };
  }

  get #default() {
    return {
      fetch,
      titleSelector: "title",
    };
  }

  get config() {
    return this.#config;
  }

  get title() {
    return this.select(this.#config.titleSelector)?.text || "";
  }

  get images() {
    return this.selectAll(this.#config.imageSelector).map((image) =>
      image.getAttribute(this.#config.imageAttribute)
    );
  }
  select(query) {
    if (!this.#root) throw new Error("You must call 'parse' first!");
    return this.#root.querySelector(query);
  }

  selectAll(query) {
    if (!this.#root) throw new Error("You must call 'parse' first!");
    return this.#root.querySelectorAll(query);
  }

  updateConfig(config) {
    this.#config = {
      ...this.#config,
      ...(config || {})
    }
  }

  async parse() {
    this.#source = await this.#config.fetch(
      this.#config.url
    );
    this.#root = parse(this.#source);
  }
}
