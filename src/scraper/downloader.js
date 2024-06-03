import JSSoup from "jssoup";

class ComicDownloader {
  #name;
  #soup;

  constructor(scraper, { name, source }) {
    this.#soup = new JSSoup(source);
  }

}
