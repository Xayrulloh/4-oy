let whichUser
let currentFriend

setInterval(() => {
  if (currentFriend) {
    chat(currentFriend)
  }
  
  if (searchText.value) {
    userFriends(searchText.value)
  } else {
    userFriends()
  }

  clear()
}, 1000); 

// userFriends()

searchText.onkeyup = (e) => {
  userFriends(searchText.value)
}

composeText.onkeyup = async(e) => {
  let users = await(await fetch('http://192.168.42.212:5000/users')).json()
  allUsersShow.innerHTML = null
  
  for (let user of users) {
    if (user.userId != whichUser.userId && user.username.toLowerCase().includes(composeText.value.toLowerCase())) {
      allUsersShow.innerHTML += `<div class="row sideBar-body" onclick=chat(this)>
      <div class="col-sm-3 col-xs-3 sideBar-avatar">
      <div class="avatar-icon">
      <img src="${user.image}">
      </div>
      </div>
      <div class="col-sm-9 col-xs-9 sideBar-main">
      <div class="row">
      <div class="col-sm-8 col-xs-8 sideBar-name">
      <span class="name-meta" id="${user.userId}">${user.username}
      </span>
      </div>
      <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
      <span class="time-meta pull-right">${user.time}
      </span>
      </div>
      </div>
      </div>
      </div>`
    }
  }
}

async function userProfile() {
  let check = false
  if (!whichUser) {
    check = true
    let users = await(await fetch('http://192.168.42.212:5000/users')).json()
    let user = JSON.parse(window.localStorage.getItem('user'))
    whichUser = users.filter(el => el.userId == user.userId)[0]
  }
  
  if (whichUser && check) {
    username.textContent = whichUser.username
    userImage.innerHTML = `<img src="${whichUser.image}">`
  } else if (!whichUser) {
    alert('Deeng')
    window.location = 'http://192.168.42.212:5000/'
  }
}

async function allUser() {
  let users = await(await fetch('http://192.168.42.212:5000/users')).json()
  
  allUsersShow.innerHTML = null
  users.map(el => {if (el.userId != whichUser.userId) {
    allUsersShow.innerHTML += `<div class="row sideBar-body" onclick=chat(this)>
    <div class="col-sm-3 col-xs-3 sideBar-avatar">
    <div class="avatar-icon">
    <img src="${el.image}">
    </div>
    </div>
    <div class="col-sm-9 col-xs-9 sideBar-main">
    <div class="row">
    <div class="col-sm-8 col-xs-8 sideBar-name">
    <span class="name-meta" id="${el.userId}">${el.username}
    </span>
    </div>
    <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
    <span class="time-meta pull-right">${el.time}</span>
    </div>
    </div>
    </div>
    </div>`
  }})
}

async function userFriends(search = '') {
  await userProfile()

  let allChats = await(await fetch('http://192.168.42.212:5000/chats')).json()
  
  let ids = []
  for (let chat of allChats) {
    if (chat.who.split('-')[0] == whichUser.userId || chat.who.split('-')[1] == whichUser.userId) {
      ids.push(chat.who.split('-')[0] != whichUser.userId ? chat.who.split('-')[0] : chat.who.split('-')[1])
    }
  }
  
  if (ids) {
    let users = await(await fetch('http://192.168.42.212:5000/users')).json()
    friends.innerHTML = null
    
    if (search) {
      for (let user of users) {
        if (ids.includes(user.userId.toString()) && user.username.toLowerCase().includes(search.toLowerCase())) {
          friends.innerHTML += `<div class="row sideBar-body" onclick=chat(this)>
          <div class="col-sm-3 col-xs-3 sideBar-avatar">
          <div class="avatar-icon">
          <img src="${user.image}">
          </div>
          </div>
          <div class="col-sm-9 col-xs-9 sideBar-main">
          <div class="row">
          <div class="col-sm-8 col-xs-8 sideBar-name">
          <span class="name-meta" id="${user.userId}">${user.username}
          </span>
          </div>
          <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
          <span class="time-meta pull-right">${user.time}
          </span>
          </div>
          </div>
          </div>
          </div>`
        }
      }
    } else {
      for (let user of users) {
        if (ids.includes(user.userId.toString())) {
          
          friends.innerHTML += `<div class="row sideBar-body" onclick=chat(this)>
          <div class="col-sm-3 col-xs-3 sideBar-avatar">
          <div class="avatar-icon">
          <img src="${user.image}">
          </div>
          </div>
          <div class="col-sm-9 col-xs-9 sideBar-main">
          <div class="row">
          <div class="col-sm-8 col-xs-8 sideBar-name">
          <span class="name-meta" id="${user.userId}">${user.username}
          </span>
          </div>
          <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
          <span class="time-meta pull-right">${user.time}
          </span>
          </div>
          </div>
          </div>
          </div>`
        }
      }
    }
  }
}

async function deleteUser() {
  try {
    const test = await fetch('http://192.168.42.212:5000/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId":whichUser.userId
    })
  })
  const data = await test.json()
  
  if (data.status >= 400 && data.status <= 499) {throw new Error('Deeng')}
  
  window.location = 'http://192.168.42.212:5000/'
  
  }catch (error) {
    alert('Invalid input')
  }
}

async function chat(user) {
  currentFriend = user
  let id = user.childNodes[3].childNodes[1].childNodes[1].childNodes[1].id

  friendProfile.innerHTML = `<div id=${id} class="col-sm-2 col-md-1 col-xs-3 heading-avatar">
  <div class="heading-avatar-icon">
    <img src="${user.childNodes[1].childNodes[1].childNodes[1].src}">
  </div>
  </div>
  <div class="col-sm-8 col-xs-7 heading-name">
    <p class="heading-name-meta">${user.childNodes[3].childNodes[1].childNodes[1].childNodes[1].textContent}</p>
  </div>
  <div class="col-sm-1 col-xs-1  heading-dot pull-right">
  <i onclick="deleteChat()" class="fa fa-trash pull-right" aria-hidden="true"></i>
  </div>`

  let allChats = await(await fetch('http://192.168.42.212:5000/chats')).json()
  
  allChats = allChats.filter(chat => chat.who.split('-')[0] == id && chat.who.split('-')[1] == whichUser.userId || chat.who.split('-')[0] == whichUser.userId && chat.who.split('-')[1] == id)

  if (allChats.length) {
    conversation.innerHTML = null
    for (let chat of allChats[0].allChats) {
      if (chat.id == id) {
        conversation.innerHTML += `<div class="row message-body">
        <div class="col-sm-12 message-main-receiver">
        <div class="receiver">
        <div class="message-text">
        ${chat.message}
            </div>
            <span class="message-time pull-right">
            ${chat.time}  
            </span>
            </div>
        </div>
      </div>`
        
      } else if (chat.id == whichUser.userId) {
        conversation.innerHTML += `<div class="row message-body">
        <div class="col-sm-12 message-main-sender">
        <div class="sender">
            <div class="message-text">
              ${chat.message}
            </div>
            <span class="message-time pull-right">
              ${chat.time}
            </span>
          </div>
        </div>
        </div>`
      }
    }
  } else {
    conversation.innerHTML = null
  }
}

async function deleteChat() {
  if (conversation.innerHTML) {
    currentFriend = null

    try {
      const test = await fetch('http://192.168.42.212:5000/chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "userId":whichUser.userId,
          "friendId":friendProfile.childNodes[0].id
        })
    })
    const data = await test.json()
    
    if (data.status >= 400 && data.status <= 499) {throw new Error('Deeng')}
    
    conversation.innerHTML = null

    let allChats = data.message
    let ids = []

    for (let chat of allChats) {
      if (chat.who.split('-')[0] == whichUser.userId || chat.who.split('-')[1] == whichUser.userId) {
        ids.push(chat.who.split('-')[0] != whichUser.userId ? chat.who.split('-')[0] : chat.who.split('-')[1])
      }
    }
    
    if (ids) {
      let users = await(await fetch('http://192.168.42.212:5000/users')).json()
      friends.innerHTML = null
      
      for (let user of users) {
        if (ids.includes(user.userId.toString())) {
          
          friends.innerHTML += `<div class="row sideBar-body" onclick=chat(this)>
          <div class="col-sm-3 col-xs-3 sideBar-avatar">
          <div class="avatar-icon">
          <img src="${user.image}">
          </div>
          </div>
          <div class="col-sm-9 col-xs-9 sideBar-main">
          <div class="row">
          <div class="col-sm-8 col-xs-8 sideBar-name">
          <span class="name-meta" id="${user.userId}">${user.username}
          </span>
          </div>
          <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
          <span class="time-meta pull-right">${user.time}
          </span>
          </div>
          </div>
          </div>
          </div>`
        }
      }
    }
  }catch (error) {
    alert('Something went wrong sorry')
  }

  } else {
    alert('You haven\'t messages yet')
  }

  window.localStorage.setItem('delete', JSON.stringify({'userId':friendProfile.childNodes[0]?.id, 'friend': whichUser.userId}))
  friendProfile.innerHTML = null
  
}

async function send() {
  if (friendProfile.innerHTML && comment.value) {
    try {
      const test = await fetch('http://192.168.42.212:5000/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "userId": whichUser.userId,
          "friendId": friendProfile.childNodes[0].id,
          "message": comment.value
      })
    })
    const data = await test.json()
    
    if (data.status >= 400 && data.status <= 499) {throw new Error('Deeng')}
    comment.value = null
    
  }catch (error) {
    alert('Something went wrong')
  }
  } else {
    comment.value = null
    alert('Invalid input')
  }
}

async function clear() {
  let users = await(await fetch('http://192.168.42.212:5000/users')).json()
  let check = false
  
  if (friendProfile) {
    for (let user of users) {
      if (user.userId == friendProfile.childNodes[0]?.id) check = true
    }
    
    if (!check) {friendProfile.innerHTML = null; currentFriend = null}
  }

  let {userId, friend} = JSON.parse(window.localStorage.getItem('delete'))

  if (userId && friend) {
    if (whichUser.userId == userId && friendProfile.childNodes[0]?.id == friend) {
      friendProfile.innerHTML = null
      conversation.innerHTML = null
      currentFriend = null

      setTimeout(() => {
        window.localStorage.setItem('delete', JSON.stringify({'userId':"", 'friend': ""}))
      }, 3000);
    }
  }
}

function voice() {
  console.log('voice');
  
}

function emoji() {
  console.log('emoji');
}







