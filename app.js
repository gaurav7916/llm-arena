const STORAGE_KEY = "applypilot-state-v1";
const MAX_ACTIVITY = 12;
const DEFAULT_STATE = {
  profile: {
    resumeText: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    linkedin: "",
    portfolio: "",
    yearsExperience: "",
    workAuthorization: "",
    sponsorship: "",
    currentCompany: "",
    education: "",
    summary: "",
    skills: "",
  },
  jobs: [],
  activity: [],
};

let state = loadState();

const elements = {
  totalJobs: document.querySelector("#total-jobs"),
  readyJobs: document.querySelector("#ready-jobs"),
  submittedJobs: document.querySelector("#submitted-jobs"),
  interviewJobs: document.querySelector("#interview-jobs"),
  activityList: document.querySelector("#activity-list"),
  jobList: document.querySelector("#job-list"),
  bookmarkletLink: document.querySelector("#bookmarklet-link"),
  bookmarkletCode: document.querySelector("#bookmarklet-code"),
  jobSearch: document.querySelector("#job-search"),
  jobFilter: document.querySelector("#job-filter"),
  importDataInput: document.querySelector("#import-data-input"),
  jobForm: document.querySelector("#job-form"),
  jobTemplate: document.querySelector("#job-card-template"),
};

const profileFields = {
  resumeText: document.querySelector("#resume-text"),
  firstName: document.querySelector("#first-name"),
  lastName: document.querySelector("#last-name"),
  email: document.querySelector("#email"),
  phone: document.querySelector("#phone"),
  location: document.querySelector("#location"),
  jobTitle: document.querySelector("#job-title"),
  linkedin: document.querySelector("#linkedin"),
  portfolio: document.querySelector("#portfolio"),
  yearsExperience: document.querySelector("#years-experience"),
  workAuthorization: document.querySelector("#work-authorization"),
  sponsorship: document.querySelector("#sponsorship"),
  currentCompany: document.querySelector("#current-company"),
  education: document.querySelector("#education"),
  summary: document.querySelector("#summary"),
  skills: document.querySelector("#skills"),
};

const jobFields = {
  id: document.querySelector("#job-id"),
  title: document.querySelector("#job-title-input"),
  company: document.querySelector("#job-company-input"),
  location: document.querySelector("#job-location-input"),
  type: document.querySelector("#job-type-input"),
  status: document.querySelector("#job-status-input"),
  url: document.querySelector("#job-url-input"),
  portal: document.querySelector("#job-portal-input"),
  compensation: document.querySelector("#job-comp-input"),
  targetDate: document.querySelector("#job-target-date-input"),
  notes: document.querySelector("#job-notes-input"),
};

hydrateProfileForm();
renderAll();
wireEvents();

function wireEvents() {
  document.querySelector("#save-profile-btn").addEventListener("click", saveProfile);
  document.querySelector("#reset-profile-btn").addEventListener("click", resetProfile);
  document.querySelector("#parse-resume-btn").addEventListener("click", parseResumeTextIntoProfile);
  document.querySelector("#copy-bookmarklet-btn").addEventListener("click", copyBookmarkletCode);
  document.querySelector("#export-data-btn").addEventListener("click", exportState);
  document.querySelector("#clear-job-form-btn").addEventListener("click", clearJobForm);

  elements.importDataInput.addEventListener("change", importState);
  elements.jobSearch.addEventListener("input", renderJobs);
  elements.jobFilter.addEventListener("change", renderJobs);

  elements.jobForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveJob();
  });
}

function loadState() {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return structuredClone(DEFAULT_STATE);
    }

    const parsed = JSON.parse(rawState);
    return {
      profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    };
  } catch (error) {
    console.warn("Unable to load saved state:", error);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrateProfileForm() {
  Object.entries(profileFields).forEach(([key, field]) => {
    field.value = state.profile[key] || "";
  });
}

function collectProfile() {
  const profile = {};

  Object.entries(profileFields).forEach(([key, field]) => {
    profile[key] = field.value.trim();
  });

  return profile;
}

function saveProfile() {
  state.profile = collectProfile();
  addActivity("Saved profile details for autofill.");
  saveState();
  renderAll();
}

function resetProfile() {
  const confirmed = window.confirm("Clear your saved profile and resume text?");
  if (!confirmed) {
    return;
  }

  state.profile = structuredClone(DEFAULT_STATE.profile);
  hydrateProfileForm();
  addActivity("Reset the saved profile.");
  saveState();
  renderAll();
}

function parseResumeTextIntoProfile() {
  const resumeText = profileFields.resumeText.value.trim();

  if (!resumeText) {
    window.alert("Paste your resume text first, then click Parse resume text.");
    return;
  }

  const lines = resumeText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const guessedName = guessName(lines);
  const email = matchFirst(resumeText, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phone = matchFirst(
    resumeText,
    /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/
  );
  const linkedin = matchFirst(resumeText, /https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i);
  const github = matchFirst(
    resumeText,
    /https?:\/\/(?:www\.)?(?:github\.com|gitlab\.com|portfolio\.)[^\s)]+/i
  );
  const yearsExperience = matchFirst(
    resumeText,
    /(\d+\+?\s*(?:years|yrs)[^\n.,]*)/i
  );
  const skillsSection = extractSection(resumeText, ["skills", "technical skills", "core skills"], [
    "experience",
    "education",
    "projects",
    "summary",
  ]);
  const summary = extractSummary(lines);
  const education = extractSection(resumeText, ["education"], ["experience", "skills", "projects"]);
  const jobTitle = guessJobTitle(lines);
  const currentCompany = guessCurrentCompany(resumeText);

  if (guessedName.first && !profileFields.firstName.value) {
    profileFields.firstName.value = guessedName.first;
  }
  if (guessedName.last && !profileFields.lastName.value) {
    profileFields.lastName.value = guessedName.last;
  }

  setIfEmpty(profileFields.email, email);
  setIfEmpty(profileFields.phone, phone);
  setIfEmpty(profileFields.linkedin, linkedin);
  setIfEmpty(profileFields.portfolio, github);
  setIfEmpty(profileFields.yearsExperience, yearsExperience);
  setIfEmpty(profileFields.summary, summary);
  setIfEmpty(profileFields.skills, skillsSection);
  setIfEmpty(profileFields.education, education);
  setIfEmpty(profileFields.jobTitle, jobTitle);
  setIfEmpty(profileFields.currentCompany, currentCompany);
  setIfEmpty(profileFields.workAuthorization, "Authorized to work in the USA");
  if (!profileFields.sponsorship.value) {
    profileFields.sponsorship.value = "No";
  }

  state.profile = collectProfile();
  addActivity("Parsed resume text and updated the profile.");
  saveState();
  renderAll();
}

function setIfEmpty(field, value) {
  if (!value || field.value.trim()) {
    return;
  }

  field.value = value.trim();
}

function guessName(lines) {
  const nameLine = lines.find(
    (line) =>
      !/[0-9@/]|linkedin|github|portfolio|software engineer|experience|education/i.test(line) &&
      line.split(" ").length >= 2 &&
      line.length < 40
  );

  if (!nameLine) {
    return { first: "", last: "" };
  }

  const parts = nameLine.split(/\s+/);
  return {
    first: parts[0] || "",
    last: parts.slice(1).join(" "),
  };
}

function extractSummary(lines) {
  const summaryLines = lines.filter(
    (line) =>
      line.length > 40 &&
      !/(linkedin|github|portfolio|skills|education|experience)/i.test(line)
  );

  return summaryLines.slice(0, 2).join(" ").slice(0, 450);
}

function guessJobTitle(lines) {
  return (
    lines.find((line) =>
      /(software|frontend|backend|full stack|product|data|engineer|developer|analyst|manager)/i.test(
        line
      )
    ) || ""
  );
}

function guessCurrentCompany(text) {
  const match = text.match(/(?:present|current)\s*[|,-]?\s*([A-Z][A-Za-z0-9&.\-\s]{2,40})/i);
  return match ? match[1].trim() : "";
}

function extractSection(text, startHeadings, endHeadings) {
  const normalized = text.replace(/\r/g, "");
  const start = findHeadingIndex(normalized, startHeadings);

  if (start === -1) {
    return "";
  }

  const afterStart = normalized.slice(start);
  const bodyStart = afterStart.indexOf("\n");
  const body = bodyStart === -1 ? "" : afterStart.slice(bodyStart + 1);
  let endIndex = body.length;

  endHeadings.forEach((heading) => {
    const regex = new RegExp(`\\n\\s*${escapeRegExp(heading)}\\s*\\n`, "i");
    const match = body.match(regex);
    if (match && typeof match.index === "number") {
      endIndex = Math.min(endIndex, match.index);
    }
  });

  return body
    .slice(0, endIndex)
    .replace(/\n+/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 300);
}

function findHeadingIndex(text, headings) {
  for (const heading of headings) {
    const regex = new RegExp(`(^|\\n)\\s*${escapeRegExp(heading)}\\s*\\n`, "i");
    const match = text.match(regex);
    if (match && typeof match.index === "number") {
      return match.index;
    }
  }

  return -1;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchFirst(text, pattern) {
  const match = text.match(pattern);
  return match ? match[0].trim() : "";
}

function clearJobForm() {
  elements.jobForm.reset();
  jobFields.id.value = "";
  jobFields.type.value = "Full-time";
  jobFields.status.value = "Saved";
}

function saveJob() {
  const job = {
    id: jobFields.id.value || crypto.randomUUID(),
    title: jobFields.title.value.trim(),
    company: jobFields.company.value.trim(),
    location: jobFields.location.value.trim(),
    type: jobFields.type.value,
    status: jobFields.status.value,
    url: jobFields.url.value.trim(),
    portal: jobFields.portal.value.trim(),
    compensation: jobFields.compensation.value.trim(),
    targetDate: jobFields.targetDate.value,
    notes: jobFields.notes.value.trim(),
    updatedAt: new Date().toISOString(),
    createdAt: jobFields.id.value
      ? state.jobs.find((item) => item.id === jobFields.id.value)?.createdAt || new Date().toISOString()
      : new Date().toISOString(),
  };

  const existingIndex = state.jobs.findIndex((item) => item.id === job.id);
  const isEdit = existingIndex !== -1;

  if (isEdit) {
    state.jobs[existingIndex] = job;
    addActivity(`Updated ${job.title} at ${job.company}.`);
  } else {
    state.jobs.unshift(job);
    addActivity(`Added ${job.title} at ${job.company}.`);
  }

  saveState();
  clearJobForm();
  renderAll();
}

function renderAll() {
  renderStats();
  renderActivity();
  renderJobs();
  renderBookmarklet();
}

function renderStats() {
  elements.totalJobs.textContent = String(state.jobs.length);
  elements.readyJobs.textContent = String(
    state.jobs.filter((job) => job.status === "Ready to submit").length
  );
  elements.submittedJobs.textContent = String(
    state.jobs.filter((job) => job.status === "Submitted").length
  );
  elements.interviewJobs.textContent = String(
    state.jobs.filter((job) => job.status === "Interviewing").length
  );
}

function renderActivity() {
  elements.activityList.innerHTML = "";

  if (!state.activity.length) {
    elements.activityList.innerHTML = '<div class="empty-state">No activity yet.</div>';
    return;
  }

  state.activity.slice(0, MAX_ACTIVITY).forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "activity-item";

    const text = document.createElement("p");
    text.textContent = item.text;

    const time = document.createElement("time");
    time.dateTime = item.timestamp;
    time.textContent = formatDateTime(item.timestamp);

    wrapper.append(text, time);
    elements.activityList.append(wrapper);
  });
}

function renderJobs() {
  const searchTerm = elements.jobSearch.value.trim().toLowerCase();
  const statusFilter = elements.jobFilter.value;

  const filteredJobs = state.jobs.filter((job) => {
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    const haystack = [
      job.title,
      job.company,
      job.location,
      job.portal,
      job.notes,
      job.compensation,
    ]
      .join(" ")
      .toLowerCase();

    return matchesStatus && (!searchTerm || haystack.includes(searchTerm));
  });

  elements.jobList.innerHTML = "";

  if (!filteredJobs.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No jobs match the current filters yet.";
    elements.jobList.append(empty);
    return;
  }

  filteredJobs.forEach((job) => {
    const card = elements.jobTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".job-title").textContent = job.title;
    card.querySelector(".job-company").textContent = job.company;
    card.querySelector(".job-status").textContent = job.status;

    const metaLine = [
      job.location || "Location not set",
      job.type || "Type not set",
      job.portal || "Portal not set",
      job.targetDate ? `Target: ${formatDate(job.targetDate)}` : null,
      job.compensation || null,
    ]
      .filter(Boolean)
      .join(" • ");

    card.querySelector(".job-meta").textContent = metaLine;
    card.querySelector(".job-notes").textContent = job.notes || "No notes added.";

    const link = card.querySelector(".job-link");
    if (job.url) {
      link.href = job.url;
      link.textContent = "Open application";
    } else {
      link.removeAttribute("href");
      link.textContent = "Add an application URL";
      link.style.pointerEvents = "none";
      link.style.opacity = "0.6";
    }

    card.querySelector(".edit-job-btn").addEventListener("click", () => populateJobForm(job));
    card.querySelector(".advance-job-btn").addEventListener("click", () => advanceJobStatus(job.id));

    elements.jobList.append(card);
  });
}

function populateJobForm(job) {
  jobFields.id.value = job.id;
  jobFields.title.value = job.title;
  jobFields.company.value = job.company;
  jobFields.location.value = job.location;
  jobFields.type.value = job.type;
  jobFields.status.value = job.status;
  jobFields.url.value = job.url;
  jobFields.portal.value = job.portal;
  jobFields.compensation.value = job.compensation;
  jobFields.targetDate.value = job.targetDate || "";
  jobFields.notes.value = job.notes;
  window.scrollTo({ top: document.querySelector("#tracker-section").offsetTop - 24, behavior: "smooth" });
}

function advanceJobStatus(jobId) {
  const nextStatusMap = {
    Saved: "Ready to submit",
    "Ready to submit": "Submitted",
    Submitted: "Interviewing",
    Interviewing: "Offer",
    Offer: "Offer",
    Rejected: "Rejected",
  };
  const job = state.jobs.find((item) => item.id === jobId);

  if (!job) {
    return;
  }

  const nextStatus = nextStatusMap[job.status] || job.status;
  job.status = nextStatus;
  job.updatedAt = new Date().toISOString();
  addActivity(`Moved ${job.title} at ${job.company} to ${nextStatus}.`);
  saveState();
  renderAll();
}

function addActivity(text) {
  state.activity.unshift({
    id: crypto.randomUUID(),
    text,
    timestamp: new Date().toISOString(),
  });
  state.activity = state.activity.slice(0, MAX_ACTIVITY);
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `applypilot-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function importState(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result));
      state = {
        profile: { ...DEFAULT_STATE.profile, ...(imported.profile || {}) },
        jobs: Array.isArray(imported.jobs) ? imported.jobs : [],
        activity: Array.isArray(imported.activity) ? imported.activity : [],
      };
      saveState();
      hydrateProfileForm();
      addActivity("Imported tracker data from JSON backup.");
      saveState();
      renderAll();
      clearJobForm();
    } catch (error) {
      window.alert("That file could not be imported. Please choose a valid ApplyPilot JSON export.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function copyBookmarkletCode() {
  const code = elements.bookmarkletCode.value;
  if (!code) {
    window.alert("Save your profile first so the bookmarklet can be generated.");
    return;
  }

  navigator.clipboard
    .writeText(code)
    .then(() => window.alert("Bookmarklet code copied."))
    .catch(() => window.alert("Copy failed. You can still copy it manually from the text box."));
}

function renderBookmarklet() {
  const profile = sanitizeProfileForAutofill(state.profile);
  const hasMinimumProfile = Boolean(profile.firstName && profile.lastName && profile.email);

  if (!hasMinimumProfile) {
    elements.bookmarkletLink.href = "#";
    elements.bookmarkletCode.value = "";
    elements.bookmarkletLink.textContent = "Save at least name and email to generate the bookmarklet";
    return;
  }

  const bookmarkletCode = buildBookmarklet(profile);
  elements.bookmarkletCode.value = bookmarkletCode;
  elements.bookmarkletLink.href = bookmarkletCode;
  elements.bookmarkletLink.textContent = "Drag this to your bookmarks bar";
}

function sanitizeProfileForAutofill(profile) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
  return {
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    fullName,
    email: profile.email || "",
    phone: profile.phone || "",
    location: profile.location || "",
    city: (profile.location || "").split(",")[0]?.trim() || "",
    linkedin: profile.linkedin || "",
    portfolio: profile.portfolio || "",
    currentCompany: profile.currentCompany || "",
    education: profile.education || "",
    workAuthorization: profile.workAuthorization || "Authorized to work in the USA",
    sponsorship: profile.sponsorship || "",
    yearsExperience: profile.yearsExperience || "",
    jobTitle: profile.jobTitle || "",
    summary: profile.summary || "",
    skills: profile.skills || "",
  };
}

function buildBookmarklet(profile) {
  const encodedProfile = JSON.stringify(profile);
  const script = `
(() => {
  const profile = ${encodedProfile};
  const qsa = (selector) => Array.from(document.querySelectorAll(selector));
  const normalize = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const profileText = {
    first_name: profile.firstName,
    last_name: profile.lastName,
    full_name: profile.fullName,
    name: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    city: profile.city,
    linkedin: profile.linkedin,
    website: profile.portfolio,
    portfolio: profile.portfolio,
    github: profile.portfolio,
    company: profile.currentCompany,
    current_company: profile.currentCompany,
    school: profile.education,
    education: profile.education,
    summary: profile.summary,
    cover_letter: profile.summary,
    experience: profile.yearsExperience,
    years_experience: profile.yearsExperience,
    title: profile.jobTitle,
    role: profile.jobTitle,
    skills: profile.skills,
    authorized: /^authorized|citizen|green card/i.test(profile.workAuthorization) ? "Yes" : profile.workAuthorization,
    sponsorship: profile.sponsorship
  };
  const patterns = [
    [/first\\s*name|given\\s*name/, "first_name"],
    [/last\\s*name|family\\s*name|surname/, "last_name"],
    [/full\\s*name|your\\s*name|applicant\\s*name|candidate\\s*name/, "full_name"],
    [/email/, "email"],
    [/phone|mobile|cell/, "phone"],
    [/city/, "city"],
    [/location|address/, "location"],
    [/linkedin/, "linkedin"],
    [/github|portfolio|website|personal\\s*site/, "portfolio"],
    [/current\\s*company|employer|company/, "current_company"],
    [/school|university|college|degree|education/, "education"],
    [/summary|about\\s*you|about\\s*me|professional\\s*summary|cover\\s*letter/, "summary"],
    [/years\\s*of\\s*experience|experience/, "years_experience"],
    [/job\\s*title|current\\s*title|headline|role/, "title"],
    [/skills|technologies|stack/, "skills"],
    [/authorized\\s*to\\s*work|work\\s*authorization|legally\\s*authorized/, "authorized"],
    [/sponsorship|visa/, "sponsorship"]
  ];
  const getLabelText = (el) => {
    const parts = [
      el.name,
      el.id,
      el.placeholder,
      el.getAttribute("aria-label"),
      el.getAttribute("autocomplete"),
      el.dataset.automationId
    ].filter(Boolean);
    if (el.id) {
      const label = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
      if (label) parts.push(label.innerText);
    }
    const wrapperLabel = el.closest("label");
    if (wrapperLabel) parts.push(wrapperLabel.innerText);
    return normalize(parts.join(" "));
  };
  const resolveValueKey = (text) => {
    for (const [pattern, key] of patterns) {
      if (pattern.test(text)) return key;
    }
    return "";
  };
  const dispatch = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
  const chooseSelectOption = (el, value) => {
    const target = normalize(value);
    const options = Array.from(el.options || []);
    const match = options.find((option) => {
      const optionText = normalize(option.textContent + " " + option.value);
      if (!target) return false;
      if (target === "yes") return /yes|authorized|citizen|not require/i.test(optionText);
      if (target === "no") return /no|not authorized|require/i.test(optionText);
      return optionText.includes(target) || target.includes(optionText);
    });
    if (match) {
      el.value = match.value;
      dispatch(el, "input");
      dispatch(el, "change");
      return true;
    }
    return false;
  };
  const chooseRadio = (radio, value) => {
    const group = qsa('input[type="radio"][name="' + CSS.escape(radio.name) + '"]');
    const target = normalize(value);
    const match = group.find((option) => {
      const label = option.id ? document.querySelector('label[for="' + CSS.escape(option.id) + '"]') : null;
      const text = normalize((label ? label.innerText : "") + " " + option.value);
      if (target === "yes") return /yes|authorized|citizen|not require/i.test(text);
      if (target === "no") return /no|require|need/i.test(text);
      return text.includes(target);
    });
    if (match) {
      match.checked = true;
      dispatch(match, "click");
      dispatch(match, "change");
      return true;
    }
    return false;
  };
  const fillable = qsa('input:not([type="hidden"]):not([type="file"]):not([type="submit"]):not([type="button"]), textarea, select');
  let filled = 0;
  fillable.forEach((el) => {
    const kind = (el.type || el.tagName).toLowerCase();
    const labelText = getLabelText(el);
    const key = resolveValueKey(labelText);
    const value = profileText[key];
    if (!key || !value) return;
    if (kind === "radio") {
      if (chooseRadio(el, value)) filled += 1;
      return;
    }
    if (kind === "checkbox") return;
    if (el.tagName === "SELECT") {
      if (chooseSelectOption(el, value)) filled += 1;
      return;
    }
    if (kind === "email" || kind === "tel" || kind === "text" || kind === "url" || el.tagName === "TEXTAREA") {
      if (!el.value) {
        el.focus();
        el.value = value;
        dispatch(el, "input");
        dispatch(el, "change");
        el.style.outline = "2px solid rgba(16, 185, 129, 0.75)";
        filled += 1;
      }
    }
  });
  window.alert('ApplyPilot filled ' + filled + ' field(s). Review everything carefully before you click submit.');
})();
  `.trim();

  return `javascript:${script.replace(/\s+/g, " ")}`;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}

function formatDateTime(dateValue) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));
}
