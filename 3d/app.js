const missions = {
  gradpath: {
    number: "01",
    title: "GradPath",
    category: "Research discovery / Collaboration",
    status: "In development",
    model: "Connection network",
    description:
      "We are building GradPath, a research discovery and collaboration prototype for the UNM/CNM App Contest. A place for students to find a direction, develop an idea, and connect with researchers.",
    features: [
      "Explore research ideas and real papers through OpenAlex.",
      "Discover researchers and potential student collaborators.",
      "Try browser-based research requests and conversations.",
    ],
    tags: ["OpenAlex", "Research planning", "Student + faculty"],
    actions: [
      { label: "Try GradPath", url: "https://kritim-123.github.io/gradpath/" },
      { label: "View source", url: "https://github.com/Kritim-123/gradpath" },
    ],
  },
  bvi: {
    number: "02",
    title: "BVI Navigation Belt",
    category: "Accessibility / Embedded systems",
    status: "Prototype",
    model: "Haptic sensing loop",
    description:
      "A wearable obstacle-detection belt for blind and visually impaired people. It turns a signal from the environment into directional feedback that can be felt, rather than seen.",
    features: [
      "Three Time-of-Flight sensors detect left, center, and right obstacles.",
      "Arduino logic maps distance to six vibration motors.",
      "Future work focuses on integration, comfort, and formal evaluation.",
    ],
    tags: ["Arduino", "Time-of-Flight", "Haptics", "Assistive design"],
    actions: [
      { label: "Explore case study", dialog: true },
      { label: "Discuss the project", url: "#contact" },
    ],
  },
  dogbridge: {
    number: "03",
    title: "DogBridge",
    category: "Speculative intelligence / Audio",
    status: "MVP",
    model: "Audio to context",
    description:
      "A human-animal communication prototype exploring intent estimation from dog audio, owner context, and feedback. An experiment in patterns and interpretation, with honest limits on what audio can tell us.",
    features: [
      "Connect audio signals with context from an owner.",
      "Use labels and feedback to investigate patterns.",
      "Explore intent estimation without claiming literal translation.",
    ],
    tags: ["Audio", "AI", "Owner feedback", "Intent estimation"],
    actions: [
      {
        label: "Explore the source",
        url: "https://github.com/Kritim-123/Human-Animal-Communication",
      },
      { label: "Discuss the project", url: "#contact" },
    ],
  },
  triage: {
    number: "04",
    title: "Support Triage",
    category: "AI agents / Workflow automation",
    status: "Prototype",
    model: "Route / reason / respond",
    description:
      "A practical support operations app that triages and responds to support issues through a multi-step agent workflow. A study in making a complex process understandable and actionable.",
    features: [
      "Organize incoming issues through a triage workflow.",
      "Route tasks through multiple agent steps.",
      "Connect workflow design with response automation.",
    ],
    tags: ["FastAPI", "React", "Agents", "Operations"],
    actions: [
      {
        label: "Explore the source",
        url: "https://github.com/Kritim-123/Support-Triage",
      },
      { label: "Discuss the project", url: "#contact" },
    ],
  },
  robotics: {
    number: "05",
    title: "Autonomous Systems",
    category: "Robotics / Physical AI",
    status: "Experiments",
    model: "Sense / plan / act",
    description:
      "Smart-vacuum and robotics experiments that connect software to the physical world. Part of a longer-term direction toward sensor-driven machines, humanoid robotics, and autonomous systems.",
    features: [
      "Explore sensing and interaction with physical environments.",
      "Build foundations for autonomous behavior.",
      "Investigate the path toward physical AI and space robotics.",
    ],
    tags: ["Robotics", "Autonomy", "Arduino", "Physical AI"],
    actions: [
      {
        label: "Smart vacuum source",
        url: "https://github.com/Kritim-123/smart-vacccum-cleaner",
      },
      { label: "Discuss the project", url: "#contact" },
    ],
  },
};

const $ = (selector) => document.querySelector(selector);
const tabs = [...document.querySelectorAll("[data-mission]")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let storedMotion = null;
try {
  storedMotion = localStorage.getItem("ragedlab-3d-motion");
} catch {
  /* Preferences are optional. */
}
let paused = reducedMotion.matches || storedMotion === "paused";
let currentMission = "gradpath";
let heroScene, projectScene;
const dialog = $("#mission-dialog");
let dialogTrigger;

function openDetails(event) {
  dialogTrigger = event.currentTarget;
  dialog.showModal();
}
$(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const box = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom)
  )
    dialog.close();
});
dialog.addEventListener("close", () => dialogTrigger?.focus());

function chooseMission(id, focus = false) {
  const mission = missions[id];
  if (!mission) return;
  currentMission = id;
  tabs.forEach((tab) => {
    const selected = tab.dataset.mission === id;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  $("#mission-panel").setAttribute("aria-labelledby", `tab-${id}`);
  for (const field of ["title", "category", "status", "description"])
    $(`#mission-${field}`).textContent = mission[field];
  $("#model-number").textContent = mission.number;
  $("#model-name").textContent = mission.model;
  $("#project-scene").setAttribute(
    "aria-label",
    `Interactive 3D concept visualization: ${mission.model}`,
  );
  $("#mission-features").replaceChildren(
    ...mission.features.map((feature) => {
      const li = document.createElement("li");
      li.textContent = feature;
      return li;
    }),
  );
  $("#mission-tags").replaceChildren(
    ...mission.tags.map((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      return span;
    }),
  );
  $("#mission-actions").replaceChildren(
    ...mission.actions.map((action, index) => {
      const element = document.createElement(action.dialog ? "button" : "a");
      element.className = index === 0 ? "button primary" : "text-link";
      element.append(document.createTextNode(action.label));
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = action.dialog ? "+" : "↗";
      element.append(arrow);
      if (action.dialog) {
        element.type = "button";
        element.addEventListener("click", openDetails);
      } else {
        element.href = action.url;
        if (action.url.startsWith("https:")) {
          element.target = "_blank";
          element.rel = "noopener noreferrer";
        }
      }
      return element;
    }),
  );
  projectScene?.setModel(id);
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => chooseMission(tab.dataset.mission));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    chooseMission(tabs[next].dataset.mission, true);
    tabs[next].scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: paused ? "instant" : "smooth",
    });
  });
});

const menu = $(".menu-toggle");
const navigation = $("#navigation");
function closeMenu(restoreFocus = false) {
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("open");
  if (restoreFocus) menu.focus();
}
menu.addEventListener("click", () => {
  const expanded = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(expanded));
  menu.setAttribute(
    "aria-label",
    expanded ? "Close navigation" : "Open navigation",
  );
  navigation.classList.toggle("open", expanded);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("open"))
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header")) closeMenu();
});
matchMedia("(min-width: 651px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const motionButton = $("#motion-toggle");
function applyMotion() {
  document.body.classList.toggle("motion-paused", paused);
  document.documentElement.style.scrollBehavior = paused ? "auto" : "";
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.replaceChildren(
    document.createTextNode(paused ? "Play motion " : "Pause motion "),
  );
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = paused ? "▶" : "Ⅱ";
  motionButton.append(icon);
  heroScene?.setPaused(paused);
  projectScene?.setPaused(paused);
  if (paused)
    document
      .querySelectorAll("[data-tilt]")
      .forEach((card) => card.style.removeProperty("transform"));
}
motionButton.addEventListener("click", () => {
  paused = !paused;
  applyMotion();
  storedMotion = paused ? "paused" : "running";
  try {
    localStorage.setItem("ragedlab-3d-motion", storedMotion);
  } catch {
    /* Browsing remains available without storage. */
  }
});
reducedMotion.addEventListener("change", (event) => {
  paused = event.matches || storedMotion === "paused";
  applyMotion();
});
$("#reset-scene").addEventListener("click", () => {
  heroScene?.reset();
  projectScene?.reset();
});
applyMotion();

function fallback(surface) {
  surface.classList.add("scene-unavailable");
  surface.classList.remove("webgl-ready");
  if (surface.id === "hero-scene")
    $(".scene-hint").textContent = "Static view · explore the lab below";
  else $(".model-caption").lastElementChild.textContent = "Static view";
}
import("./scene.js")
  .then(({ createScene }) => {
    try {
      heroScene = createScene($("#hero-scene"), "core", paused);
    } catch {
      fallback($("#hero-scene"));
    }
    try {
      projectScene = createScene($("#project-scene"), currentMission, paused);
    } catch {
      fallback($("#project-scene"));
    }
    if (!heroScene && !projectScene) {
      motionButton.disabled = true;
      motionButton.textContent = "Static view";
      $("#reset-scene").hidden = true;
    }
  })
  .catch(() => {
    fallback($("#hero-scene"));
    fallback($("#project-scene"));
    motionButton.disabled = true;
    motionButton.textContent = "Static view";
    $("#reset-scene").hidden = true;
  });
document.addEventListener("scene-unavailable", (event) =>
  fallback(event.target),
);
window.addEventListener("pagehide", (event) => {
  if (!event.persisted) {
    heroScene?.dispose();
    projectScene?.dispose();
  }
});

const finePointer = matchMedia("(pointer: fine)");
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (paused || !finePointer.matches) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `perspective(1200px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateY(-2px)`;
  });
  card.addEventListener("pointerleave", () =>
    card.style.removeProperty("transform"),
  );
});

const links = [...navigation.querySelectorAll("a")];
const sections = [...document.querySelectorAll("main > section[id]")];
let scrollFrame;
function updateScroll() {
  scrollFrame = null;
  const height = document.documentElement.scrollHeight - innerHeight;
  $(".reading-progress").style.transform =
    `scaleX(${height > 0 ? Math.min(1, scrollY / height) : 0})`;
  let active = "home";
  for (const section of sections)
    if (section.getBoundingClientRect().top <= innerHeight * 0.4)
      active = section.id;
  links.forEach((link) => {
    const selected = link.hash === `#${active}`;
    link.classList.toggle("active", selected);
    if (selected) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  },
  { passive: true },
);
addEventListener("resize", updateScroll);
updateScroll();

let copyTimer;
$("#copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("kbastola1@unm.edu");
    $("#copy-email").textContent = "Copied ✓";
    $("#copy-status").textContent = "Email address copied.";
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      $("#copy-email").textContent = "Copy email";
    }, 2500);
  } catch {
    $("#copy-status").textContent =
      "Select and copy kbastola1@unm.edu, or use the email link.";
    $("#copy-email").textContent = "Use the email link";
  }
});
