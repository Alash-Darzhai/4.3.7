const searchWrapper = document.querySelector('.search-input');
const inputBox = searchWrapper.querySelector('.input');
const searchBox = searchWrapper.querySelector('.search-list');
const searchItemRepo = searchWrapper.querySelector('.list-item');
const repoList = document.querySelector('.repo-list');
const repoItem = repoList.querySelectorAll('.repo-item');

function debounce(fn, debounceTime) {
  let timeout;
  return function debounced(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
}

function createElement(tag, classElement) {
  const element = document.createElement(tag);
  if (classElement) element.classList.add(classElement);
  return element;
}

async function searchRepositories(e) {
  if (e.target.value) {
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${e.target.value}&per_page=5`
      );
      const data = await response.json();
      searchBox.innerHTML = '';
      data.items.forEach((repositories) => {
        const listTag = createElement('li', 'list-item');
        listTag.innerHTML = repositories.name;
        searchBox.appendChild(listTag);
        listTag.addEventListener('click', () => {
          const listTagAdd = createElement('li', 'repo-item');
          listTagAdd.innerHTML = `Name: ${repositories.name}<br>Owner: ${repositories.owner.login}<br>Stars: ${repositories.stargazers_count}`;
          repoList.appendChild(listTagAdd);

          const listTagListRemove = createElement('span', 'repo-remove');
          listTagAdd.appendChild(listTagListRemove);
          listTagListRemove.addEventListener('click', () => {
            listTagAdd.remove();
          });
          inputBox.value = '';
          searchBox.innerHTML = '';
        });
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    repositoriesData = '';
    searchBox.innerHTML = '';
  }
}

searchWrapper.addEventListener('keyup', debounce(searchRepositories, 1000));