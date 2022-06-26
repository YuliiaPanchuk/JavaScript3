'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        //createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
        const header = createAndAppend("header", root, { class: "header" })
        const headerText = createAndAppend("h1", header, { class: "headerText", text: "FooCoding Repositories" })
        const select = createAndAppend("select", header, { class: "select" });

        select.addEventListener("change", (e) => {
          let dataVar = document.getElementsByClassName("dataDiv")

          for (let x = 0; x < dataVar.length; x++) {
            const element = dataVar[x];
            element.style.display = "none";
          }

          document.getElementById(e.target.value).style.display = "block"
          //console.log(e.target.value);
        })
        const container = createAndAppend("div", root, { class: "container" })

        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          const name = element.name;
          const option = createAndAppend("option", select, { text: name, value: i })

          const dataDiv = createAndAppend("div", container, { class: name, class: "dataDiv", id: i })
          dataDiv.style.display = "none";

          const repository = element.svn_url;
          const repo = createAndAppend("a", dataDiv, { class: "repository", text: name, href: repository })

          const descriptions = element.description;
          const description = createAndAppend("p", dataDiv, { class: "describtion", text: descriptions }) // if(description === null) return display: none

          const forks = element.forks_count;
          const fork = createAndAppend("p", dataDiv, { class: "fork", text: forks })

          const updated = element.updated_at;
          const update = createAndAppend("p", dataDiv, { class: "updated", text: updated })

          fetchJSON(element.contributors_url, (error, contributors) => {
            if (error) {

            } else {
              const contibutorDiv = createAndAppend("div", dataDiv, { class: "contributors" })


              for (let j = 0; j < contributors.length; j++) {
                const el = contributors[j];

                const avatars = el.avatar_url;
                const avatar = createAndAppend("img", contibutorDiv, { src: avatars, class: "avatarImg" })
              }
            }
          })
        }
      }
    });
  }

  const REPOS_URL = 'https://api.github.com/orgs/foocoding/repos?per_page=100';

  window.onload = () => main(REPOS_URL);
}
