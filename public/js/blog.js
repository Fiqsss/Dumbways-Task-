function toggleMenu() {
  const navbarMenu = document.getElementById("navbarMenu");
  navbarMenu.classList.toggle("active");
}

let blogs = [];

function addBlog(e) {
  e.preventDefault();

  let title = document.querySelector("#title").value.trim();
  let content = document.querySelector("#content").value.trim();
  let imageInput = document.querySelector("#image-upload");

  if (title === "" || content === "" || imageInput.files.length === 0) {
    alert("All fields (title, content, and image) must be filled.");
    return;
  }

  let image = URL.createObjectURL(imageInput.files[0]);
  let now = new Date();

  let blog = {
    author: "Nur Muhammad Arofiq",
    title: title,
    content: content,
    image: image,
    posteDate: new Date().toLocaleString(),
    time: getRelativeTime(now),
  };

  blogs.push(blog);
  renderBlog();
}

function renderBlog() {
  console.log(blogs);

  let blogListElement = document.querySelector(".cart-wrapper");

  blogListElement.innerHTML = "";
  for (let i = 0; i < blogs.length; i++) {
    blogListElement.innerHTML += `
      <div style="width: 100%;" class="cart">
            <div class="cart-image">
                <img width="300" src="${blogs[i].image}" alt="">
            </div>
            <div class="cart-description">
              <div class="btn-blog">
                <button class="edit">Edit Post</button>
                <button class="post">Post Blog</button>
              </div>
              <div class="title-blog">
                  <h1>${blogs[i].title}</h1>
              </div>
              <div class="containt-blog">
                <p>${formatDate(new Date(blogs[i].posteDate))} | 3 Comments</p>
                <p>${blogs[i].content}</p>
              </div>
              <div class="posting">
                <p>${blogs[i].time}</p>
              </div>
            </div>
          </div>
    `;
  }
}

function firstBlogContent() {
  return `
<div class="cart">
            <div class="cart-image">
              <img width="300" src="../assets/img/markus-winkler-bOhKb8e0Iks-unsplash.jpg" alt="">
            </div>
            <div class="cart-description">
              <div class="btn-blog">
                <button class="edit">Edit Post</button>
                <button class="post">Post Blog</button>
              </div>
              <div class="title-blog">
                <h1>Blog Dumbways</h1>
              </div>
              <div class="containt-blog">
                <p>12 July 2024 22:00 | 3 Comments</p>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate voluptas sit fugiat cum maxime beatae sed error enim minus tenetur?</p>
              </div>
              <div class="posting">
                <p>2 Jam yang lalu</p>
              </div>
            </div>
          </div>
  `;
}

// function formatDate(date) {
//   const bulans = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
//   let day = date.getDate();
//   let month = bulans[date.getMonth()];
//   let year = date.getFullYear();
//   let hours = date.getHours().toString().padStart(2, "0");
//   let minutes = date.getMinutes().toString().padStart(2, "0");
//   let Priod = "AM";
//   if (hours > 12) {
//     Priod = "PM";
//     hours -= 12;
//   }

//   return `${day} ${month} ${year} ${hours}:${minutes} ${getRelativeTime}`;
// }
function formatDate(date) {
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function getRelativeTime(date) {
  let now = new Date();
  let diffInMinutes = Math.floor((now - date) / 1000 / 60);

  if (diffInMinutes < 1) {
    return "Just now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  let diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  let diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  let diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  let diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;

  return formatDate(date);
}
