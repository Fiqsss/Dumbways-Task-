document
  .querySelector(".project-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const fileInput = form.querySelector("#image-upload");
    const fileName = fileInput.files[0]
      ? fileInput.files[0].name
      : "No file uploaded";

    const technologies = Array.from(
      form.querySelectorAll('input[name="technologies"]:checked')
    )
      .map((checkbox) => checkbox.value)
      .join(", ");

    const subject = encodeURIComponent(
      `New Project Submission: ${data.projectname}`
    );
    const body = encodeURIComponent(
      `Project Name: ${data.projectname}\n` +
        `Start Date: ${data.startdate}\n` +
        `End Date: ${data.enddate}\n` +
        `Description: ${data.description}\n` +
        `Technologies: ${technologies}\n` +
        `Uploaded File: ${fileName}`
    );

    const mailtoLink = `mailto:sarofiqs@gmail.com?subject=${subject}&body=${body}`;

    const link = document.createElement("a");
    link.href = mailtoLink;
    link.click();
  });
function toggleMenu() {
  const menu = document.getElementById("navbarMenu");
  menu.classList.toggle("active");
}
