const BASE_URL = 'https://user-list.alphacamp.io'
const USER_URL = BASE_URL + '/api/v1/users/'
const searchForm = document.querySelector('.d-flex')
const searchInput = document.querySelector('.form-control')
const userList = document.querySelector('.user-list')
const pagination = document.querySelector('.pagination')
const users = []
let filterUser = []
const userPerPage = 12
let pageNow = 1


function showModal(userId) {
  axios.get(USER_URL + userId).then(response => {
    data = response.data
    const modalContainer = document.querySelector('#modal-row')
    let img = data.avatar
    if (img !== null) {
      let imgEnd = img.indexOf('?')
      img = img.slice(0, imgEnd)
      let rawHTML = `                    <div class="modal-img col-sm-5">
                          <img src="${img}" alt="user image">
                      </div>
                      <div class="card-text col-sm-7" style="background-color:#eee;">
                          <div class="modal-header">
                              <h1 class="modal-title">${userId}.     ${data.name}-${data.surname}</h1>
                          </div>
                          <div class="modal-body">
                              <ul>
                                <li>email: ${data.email}</li>
                                <li>gender: ${data.gender}</li>
                                <li>age: ${data.age}</li>
                                <li>region: ${data.region}</li>
                                <li>birthday: ${data.birthday}</li>
                              </ul>
                          </div>
                      </div>`
      modalContainer.innerHTML = rawHTML
    }
  })
}

function showUsers(users, pageNow) {
  const tempUsers = users.slice(12 * (pageNow - 1), 12 * pageNow)
  let rawHTML
  tempUsers.forEach((user) => {

    let img = user.avatar
    if (img !== null) {
      let imgEnd = img.indexOf('?')
      img = img.slice(0, imgEnd)
      rawHTML += `<div class="card one-user" style="width: 12rem; border:0;">
                    <div class="user-avatar">
                      <button class="user-modal" data-bs-toggle="modal" data-bs-target="#user-modal">
                        <img src="${img}" class="card-img-top" alt="user-avatar" data-id='${user.id}'>
                      </button>
                    </div>
                    <div class="card-body">
                        <span class="card-text">${user.name}-${user.surname} <button class="btn btn-primary " data-id="${user.id}">+</button></span>
                    </div>
                </div>`
    }
  })
  rawHTML = rawHTML.substr(9) //delete undefined from head
  userList.innerHTML = rawHTML
}

function addToFavorite(userId) {
  const favoriteUsers = JSON.parse(localStorage.getItem('favoriteUser')) || []
  const user = users.find(item => item.id === Number(userId))
  if (favoriteUsers.some(item => item.id === user.id)) {
    alert('this person is already in your favorite!')
  } else {
    favoriteUsers.push(user)
    localStorage.setItem('favoriteUser', JSON.stringify(favoriteUsers))
  }
}

function showPagination(userPerPage, users) {

  const pageNum = Math.ceil(users.length / userPerPage)
  let rawHTML = ''
  for (let i = 1; i <= pageNum; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
  }
  pagination.innerHTML = rawHTML
}
//load in all users & show pagination
axios.get(USER_URL).then(response => {
  const data = response.data.results
  users.push(...data)
  showUsers(users, pageNow)
  showPagination(userPerPage, users)
})

//click & show modal or add to favorite
userList.addEventListener('click', event => {
  let userId = event.target.dataset.id
  if (event.target.matches('.card-img-top')) {
    showModal(userId)
  } else if (event.target.tagName === 'BUTTON') {
    addToFavorite(userId)
  }
})

//search keyword & filter users
searchForm.addEventListener('submit', function submitSearchForm(event) {
  event.preventDefault()
  const keyword = searchInput.value.toLowerCase().trim()
  if (!keyword) {
    alert('please enter valid word')
  }
  filterUser = users.filter(user => {
    const fullName = user.name + user.surname
    return fullName.toLowerCase().includes(keyword)
  })
  if (filterUser.length) {
    showUsers(filterUser, 1)
    showPagination(userPerPage, filterUser)
  } else {
    alert('no matched result')
  }
})

//click different page button & change avatars
pagination.addEventListener('click', event => {
  const data = filterUser.length ? filterUser : users
  console.log(data.length)
  if (event.target.tagName === 'A') {
    pageNow = Number(event.target.innerText)
    showUsers(data, pageNow)
  }

})