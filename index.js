function debounce(func, delay) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

// Функция для отправки запроса на API GitHub и получения данных о репозиториях
function getRepositories() {
  const searchQuery = document.getElementById('search-input').value;
  fetch(`https://api.github.com/search/repositories?q=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      const repositories = data.items;
      showAutocomplete(repositories);
    });
}

// Функция для отображения выпадающего меню автодополнения
function showAutocomplete(repositories) {
  document.getElementById('autocomplete').innerHTML = "";

  repositories.slice(0,5).forEach(repo => {
    const item = document.createElement('p');
    item.classList.add('autocomplete__item');
    item.textContent = repo.full_name;
    item.addEventListener('click', () => addRepository(repo));
    document.getElementById('autocomplete').appendChild(item);
  });
}

// Функция для добавления репозитория в список выбранных
function addRepository(repo) {
  document.getElementById('search-input').value = '';
  const listItem = document.createElement('li');
  listItem.classList.add('repo-list__item');
  listItem.insertAdjacentHTML("beforeend", 
    `
    <p>Name: ${repo.full_name}</p>
    <p>Owner: ${repo.owner.login}</p>
    <p>Stars: ${repo.stargazers_count}</p>
    <div class="delete-btn"><img src="delBtn.svg" alt="Delete Repository"></div>
    `);
  document.getElementById('repo-list').appendChild(listItem);
  listItem.querySelector('.delete-btn').addEventListener('click', () => {
    deleteRepository(listItem);
  });
}

// Функция для удаления репозитория из списка выбранных
function deleteRepository(listItem) {
  listItem.remove();
}

// Функция для инициализации приложения
function initApp() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', debounce(getRepositories, 500));
}

window.addEventListener('DOMContentLoaded', initApp);