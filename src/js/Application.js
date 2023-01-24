import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  _loading = document.querySelector(".progress");
  _startLoading() {
    this._loading.style.visibility = "visible";
  }
  _stopLoading() {
    this._loading.style.visibility = "hidden";
  }

  constructor() {
    super();

    this._load();
    this.emit(Application.events.READY);
  }

  async _load() {
    this._startLoading();
    let pageNumber = 1;

    // Fetch planets
    let planets = [];
    let response;
    let data;
    do {
      response = await fetch("https://swapi.boom.dev/api/planets?page=" + pageNumber);
      data = await response.json();
      planets = planets.concat(data.results);
      pageNumber++;
    } while (data.next);

    // Render planets
    planets.forEach((planet) => {
      this._create(planet);
    });

    this._stopLoading();
  }

  _create(planet) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render(planet);

    document.body.querySelector(".main").appendChild(box);
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }
 }