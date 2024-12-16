//document
//  .querySelector(".project-form")
//  .addEventListener("submit", function (e) {
//    e.preventDefault();//

//    const form = e.target;
//    const formData = new FormData(form);
//    const data = Object.fromEntries(formData.entries());//

//    const fileInput = form.querySelector("#image-upload");
//    const fileName = fileInput.files[0]
//      ? fileInput.files[0].name
//      : "No file uploaded";//

//    const technologies = Array.from(
//      form.querySelectorAll('input[name="technologies"]:checked')
//    )
//      .map((checkbox) => checkbox.value)
//      .join(", ");//

//    const subject = encodeURIComponent(
//      `New Project Submission: ${data.projectname}`
//    );
//    const body = encodeURIComponent(
//      `Project Name: ${data.projectname}\n` +
//        `Start Date: ${data.startdate}\n` +
//        `End Date: ${data.enddate}\n` +
//        `Description: ${data.description}\n` +
//        `Technologies: ${technologies}\n` +
//        `Uploaded File: ${fileName}`
//    );//

//    const mailtoLink = `mailto:sarofiqs@gmail.com?subject=${subject}&body=${body}`;//

//    const link = document.createElement("a");
//    link.href = mailtoLink;
//    link.click();
//  });
function toggleMenu() {
  const navbarMenu = document.getElementById("navbarMenu");
  navbarMenu.classList.toggle("active");
}



let projects = [];
function addProject(e) {
  e.preventDefault();

  let projectName = document.querySelector("#projectname").value.trim();
  let startDate = document.querySelector("#startdate").value.trim();
  let endDate = document.querySelector("#enddate").value.trim();
  let description = document.querySelector("#description").value.trim();
  let imageInput = document.querySelector("#image-upload");
  const selectedTechnologies = getSelectedCheckboxes();


  if (
    projectName === "" ||
    startDate === "" ||
    endDate === "" ||
    description === "" ||
    imageInput.files.length === 0
  ) {
    alert("All fields (title, content, and image) must be filled.");
    return;
  }

  let image = URL.createObjectURL(imageInput.files[0]);

  let project = {
    author: "Nur Muhammad Arofiq",
    projectName: projectName,
    startDate: startDate,
    endDate: endDate,
    description: description,
    image: image,
    technologies: selectedTechnologies,
    posteDate: new Date().toLocaleString(),
  };

  projects.push(project);
  renderProject();
}

function getSelectedCheckboxes() {
  const checkboxes = document.querySelectorAll("input[name='technologies']:checked");
  return Array.from(checkboxes).map((checkbox) => checkbox.value);
}

function renderProject() {
  console.log(projects);

  let ProjectListElement = document.querySelector(".cart-wrapper");

  ProjectListElement.innerHTML = "";
  for (let i = 0; i < projects.length; i++) {
    let startDate = new Date(projects[i].startDate);
    let endDate = new Date(projects[i].endDate);
    let durationMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    if (durationMonths <= 0) {
      durationMonths = 1; 
    }
    let technologiesList = projects[i].technologies.join(", ");
    ProjectListElement.innerHTML += `
      <div  style="width: 19rem;" class="card-wrap col-4 my-3 mx-3 shadow p-0">
              <div class="card" >
                <img
            width="100%"
            height="200px"
            src="${projects[i].image}"
            alt=""
          />
                <div class="card-body">
                  <h5 class="card-title">${projects[i].projectName}</h5>
                  <p style="margin: 0;" class="card-text">durasi : ${durationMonths} bulan</p>
                  <p style="margin: 0;" class="card-text my-2">${projects[i].description}</p>
                  <p style="margin: 15px 10px 15px 0;">Tech: ${technologiesList}</p>
                  <div class="icon my-3">
                    <img width="30px" src="/img/svg/playstore-svgrepo-com.svg" alt=""/>
                    <img width="30px" src="/img/svg/android-svgrepo-com.svg" alt="" />
                    <img width="30px" src="/img/svg/java-svgrepo-com.svg" alt="" />
                  </div>
                  <div class="btn-cart">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>
              </div>
            </div>
    `;
  }
}


function firstProjectContent() {
  return `
  <div class="cart">
              <div class="cart-body">
                <img
                  width="100%"
                  height="200px"
                  src="../assets/img/markus-winkler-bOhKb8e0Iks-unsplash.jpg"
                  alt=""
                />
                <div class="cart-desc">
                  <h4>Dumbways Mobile App - 2024</h4>
                  <p>durasi: 3 bulan</p>
                  <p class="deskripsi">
                    App That used for dumbways student , it was deployed and can
                    downloaded on playstore. Happy download
                  </p>
                  <p  style="margin: 15px 10px 15px 0;" >Tech : Node.js, React.js</p>
                </div>
                <div class="icon">
                  <img
                    src="../assets/img/svg/playstore-svgrepo-com.svg"
                    alt=""
                  />
                  <img src="../assets/img/svg/android-svgrepo-com.svg" alt="" />
                  <img src="../assets/img/svg/java-svgrepo-com.svg" alt="" />
                </div>
                <div class="btn-cart">
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              </div>
            </div>
  `;
}

