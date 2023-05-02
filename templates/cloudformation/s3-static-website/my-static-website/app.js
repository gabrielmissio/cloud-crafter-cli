const container = document.querySelector('.container')

function loadProfiles () {
  container.innerHTML = ''

  // Hardcoded data, replace with API call
  const users = [
    { name: 'John', email: 'john@mail.com' },
    { name: 'Carl', email: 'carl@mail.com' },
    { name: 'Anna', email: 'anna@mail.com' }
  ]

  // Create some HTML elements to display the user information
  const profiles = users.map(user => makeProfileComponent(user))
  profiles.forEach(profile => container.appendChild(profile))
}

function makeProfileComponent (user) {
  const profile = document.createElement('div')
  profile.className = 'profile'

  const profileInfo = document.createElement('div')
  profileInfo.className = 'profile-info'

  const name = document.createElement('h2')
  name.textContent = user.name

  const email = document.createElement('p')
  email.textContent = user.email

  const profileImage = document.createElement('img')
  profileImage.className = 'profile-image'
  profileImage.src = user.profileUrl || 'media/default.png'

  profileInfo.appendChild(name)
  profileInfo.appendChild(email)

  profile.appendChild(profileImage)
  profile.appendChild(profileInfo)

  return profile
}

setTimeout(loadProfiles, 250) // Delay for demo purposes
