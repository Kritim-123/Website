if (navigator.userAgent.match(/webOS/i)) {
  const overlays = document.getElementsByClassName("experience-card-overlay");
  for (overlay of overlays) {
    overlay.classList.add("top-0");
  }
}

// Handling navbar on small screen
var sidemenu = document.getElementById("navbar");

function openmenu() {
  sidemenu.classList.remove("sidemenu-close");
  sidemenu.classList.add("sidemenu-open");
}

function closemenu() {
  sidemenu.classList.remove("sidemenu-open");
  sidemenu.classList.add("sidemenu-close");
}

// Sending contact form data
const scriptURL =
  "https://script.google.com/macros/s/AKfycbydvFuqmCPakaOx9S3xlj2pX9LsochPp8akf3RYjEtvcrU5d2twvJAvLwPrEvmM1hCF/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const loader = document.getElementById("loader");
  const submit_text = document.getElementsByClassName("submit-txt")[0];
  loader.classList.add("block");
  submit_text.classList.add("hidden");
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        msg.classList.toggle('hidden')
        msg.innerHTML = "Message sent successfully";
        setTimeout(function () {
          msg.innerHTML = "";
        }, 5000);

        form.reset();
        loader.classList.toggle("block");
        submit_text.classList.toggle("hidden");
      })
      .catch((error) => console.error("Error!", error.message));
});

// Handling About Tabs
function opentab(event, tabname) {
  const newActiveTab = document.getElementById(tabname);
  const currentActiveTab = document.querySelector(".tab-links.active-link");
  const currentActiveContent = document.querySelector(
    ".tab-contents.active-tab"
  );

  currentActiveTab.classList.remove("active-link");
  currentActiveContent.classList.remove("active-tab");

  event.currentTarget.classList.add("active-link");
  newActiveTab.classList.add("active-tab");
}
