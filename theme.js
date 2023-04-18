const checkbox = document.getElementById("themeCheckbox");

function onLoad() {
  //  Getting theme from local storage
  const themeFromLocalStorage = localStorage.getItem("theme");
  if (themeFromLocalStorage === null) {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      checkbox.checked = true;
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      checkbox.checked = false;
    }
  } else if (
    themeFromLocalStorage === "light" ||
    themeFromLocalStorage === "dark"
  ) {
    console.log(themeFromLocalStorage);
    console.log(checkbox);
    if (themeFromLocalStorage === "light") {
      checkbox.checked = false;
    } else if (themeFromLocalStorage === "dark") {
      checkbox.checked = true;
    }
    document.body.setAttribute("data-theme", themeFromLocalStorage);
  }

  //   Checking on theme change
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      const temp = event.matches ? "dark" : "light";
      if (temp === "light") {
        checkbox.checked = false;
      } else if (temp === "dark") {
        checkbox.checked = true;
      }
      document.body.setAttribute("data-theme", temp);
      localStorage.setItem("theme", temp);
    });
}

function toggleTheme() {
  const theme = document.body.getAttribute("data-theme");
  if (theme === "light") {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    checkbox.checked = true;
  } else {
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    checkbox.checked = false;
  }
}
