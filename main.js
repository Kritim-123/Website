const sidemenu = document.getElementById("navbar");

function openmenu() {
  if (!sidemenu) return;
  sidemenu.classList.remove("sidemenu-close");
  sidemenu.classList.add("sidemenu-open");
}

function closemenu() {
  if (!sidemenu) return;
  sidemenu.classList.remove("sidemenu-open");
  sidemenu.classList.add("sidemenu-close");
}

const scriptURL =
  "https://script.google.com/macros/s/AKfycbydvFuqmCPakaOx9S3xlj2pX9LsochPp8akf3RYjEtvcrU5d2twvJAvLwPrEvmM1hCF/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const loader = document.getElementById("loader");
    const submitText = document.getElementsByClassName("submit-txt")[0];
    loader.classList.add("block");
    submitText.classList.add("hidden");

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(() => {
        msg.classList.remove("hidden");
        msg.innerHTML = "Message sent successfully";
        setTimeout(() => {
          msg.innerHTML = "";
          msg.classList.add("hidden");
        }, 5000);

        form.reset();
        loader.classList.remove("block");
        submitText.classList.remove("hidden");
      })
      .catch((error) => {
        console.error("Error!", error.message);
        loader.classList.remove("block");
        submitText.classList.remove("hidden");
      });
  });
}
