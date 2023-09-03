const BASE_URL = 'https://user-list.alphacamp.io'
const USER_URL = BASE_URL + '/api/v1/users/'
const searchForm = document.querySelector('.d-flex')
const searchInput = document.querySelector('.form-control')
const users = JSON.parse(localStorage.getItem('favoriteUser'))
const userList = document.querySelector('.user-list')

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
                              <h5 class="modal-title">${userId}.     ${data.name}-${data.surname}</h5>
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


function showUsers(users) {
  let rawHTML
  users.forEach((user) => {

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
                        <span class="card-text">${user.name}-${user.surname} <button class="btn btn-primary remove-btn " data-id="${user.id}">x</button></span>
                    </div>
                </div>`
    }
  })
  rawHTML = rawHTML.substr(9) //delete undefined from head
  userList.innerHTML = rawHTML
}

showUsers(users)

userList.addEventListener('click', event => {
  let userId = event.target.dataset.id
  if (event.target.matches('.card-img-top')) {
    showModal(userId)
  } else if (event.target.matches('.remove-btn')){
    const num = users.findIndex( user => user.id === userId)
    users.splice(num, 1)
    localStorage.setItem('favoriteUser', JSON.stringify(users))
    showUsers(users)
  }
})
