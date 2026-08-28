/* =========================================
   STUDYFLOW - SMART STUDY PLANNER
========================================= */


/* ================= DEFAULT DATA ================= */

const defaultSubjects = [
    {
        id: 1,
        name: "Web Development",
        icon: "💻",
        progress: 80
    },
    {
        id: 2,
        name: "JavaScript",
        icon: "⚡",
        progress: 65
    },
    {
        id: 3,
        name: "Database",
        icon: "🗄️",
        progress: 50
    }
];


const todayDate = new Date().toISOString().split("T")[0];


const defaultTasks = [
    {
        id: 101,
        name: "Complete JavaScript Functions",
        subject: "JavaScript",
        date: todayDate,
        priority: "High",
        completed: false
    },
    {
        id: 102,
        name: "Practice CSS Flexbox",
        subject: "Web Development",
        date: todayDate,
        priority: "Medium",
        completed: true
    }
];


const defaultSchedules = [
    {
        id: 201,
        time: "08:00",
        subject: "JavaScript",
        topic: "Functions & Arrays"
    },
    {
        id: 202,
        time: "15:00",
        subject: "Web Development",
        topic: "Responsive Design"
    }
];


const defaultNotes = [
    {
        id: 301,
        title: "JavaScript Important Notes",
        content: "Practice let, const, arrays, functions and DOM manipulation regularly.",
        createdAt: new Date().toLocaleDateString()
    }
];


/* ================= ACCOUNT DATA ================= */

let accounts = JSON.parse(
    localStorage.getItem("studyFlowAccounts")
) || [];


let currentUser = JSON.parse(
    localStorage.getItem("studyFlowCurrentUser")
) || null;


/* ================= STUDY DATA ================= */

let subjects = JSON.parse(
    localStorage.getItem("studySubjects")
) || [...defaultSubjects];


let tasks = JSON.parse(
    localStorage.getItem("studyTasks")
) || [...defaultTasks];


let schedules = JSON.parse(
    localStorage.getItem("studySchedules")
) || [...defaultSchedules];


let notes = JSON.parse(
    localStorage.getItem("studyNotes")
) || [...defaultNotes];


let currentTaskFilter = "all";

let studyChart = null;


/* ================= DOM ================= */

const navItems = document.querySelectorAll(".nav-item");

const sections = document.querySelectorAll(".page-section");

const pageTitle = document.getElementById("pageTitle");

const sidebar = document.getElementById("sidebar");

const menuToggle = document.getElementById("menuToggle");

const themeToggle = document.getElementById("themeToggle");

const accountCard = document.getElementById("accountCard");


/* ================= INITIALIZE ================= */

document.addEventListener("DOMContentLoaded", () => {

    updateDate();

    loadTheme();

    updateAccountUI();

    renderAll();

});


/* ================= NAVIGATION ================= */

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const sectionName = item.dataset.section;

        showSection(sectionName);

        sidebar.classList.remove("open");

    });

});


function showSection(sectionName) {

    sections.forEach(section => {

        section.classList.remove("active-section");

    });


    const target = document.getElementById(sectionName);

    if (target) {

        target.classList.add("active-section");

    }


    navItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.section === sectionName) {

            item.classList.add("active");

        }

    });


    const titles = {

        dashboard: "Dashboard",
        subjects: "Subjects",
        tasks: "Study Tasks",
        schedule: "Study Schedule",
        progress: "Study Progress",
        notes: "My Notes",
        settings: "Settings"

    };


    pageTitle.textContent =
        titles[sectionName] || "Dashboard";


    if (sectionName === "progress") {

        setTimeout(createChart, 100);

    }

}


/* ================= MOBILE MENU ================= */

menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


/* ================= DATE ================= */

function updateDate() {

    const date = new Date();

    const options = {

        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"

    };


    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-US", options);

}


/* =========================================
   ACCOUNT SYSTEM
========================================= */


/* ================= UPDATE ACCOUNT UI ================= */

function updateAccountUI() {

    const displayName = currentUser
        ? currentUser.name
        : "Guest User";

    const role = currentUser
        ? "Student Account"
        : "Guest Mode";

    const firstLetter = displayName
        .charAt(0)
        .toUpperCase();


    /* TOP PROFILE */

    document.getElementById("topAvatar").textContent =
        firstLetter;

    document.getElementById("topStudentName").textContent =
        displayName;

    document.getElementById("topStudentRole").textContent =
        role;


    /* WELCOME */

    document.getElementById("welcomeName").textContent =
        displayName;


    /* SETTINGS NAME */

    const nameInput =
        document.getElementById("studentNameInput");

    if (nameInput) {

        nameInput.value =
            currentUser
                ? currentUser.name
                : "Guest User";

    }


    /* SIDEBAR ACCOUNT */

    if (!currentUser) {

        accountCard.innerHTML = `

            <div class="account-user">

                <div class="account-avatar">
                    G
                </div>

                <div class="account-info">

                    <strong>Guest User</strong>

                    <span>Guest Mode</span>

                </div>

            </div>


            <div class="account-buttons">

                <button
                    class="login-btn"
                    onclick="openLoginModal()"
                >
                    Login
                </button>


                <button
                    class="signup-btn"
                    onclick="openSignupModal()"
                >
                    Sign Up
                </button>

            </div>

        `;

    } else {

        accountCard.innerHTML = `

            <div class="account-user">

                <div class="account-avatar">
                    ${escapeHTML(firstLetter)}
                </div>

                <div class="account-info">

                    <strong>
                        ${escapeHTML(currentUser.name)}
                    </strong>

                    <span>
                        Student Account
                    </span>

                </div>

            </div>


            <div class="account-buttons">

                <button
                    class="profile-btn"
                    onclick="openProfile()"
                >
                    Profile
                </button>


                <button
                    class="logout-btn"
                    onclick="logoutUser()"
                >
                    Logout
                </button>

            </div>

        `;

    }

}


/* ================= OPEN LOGIN ================= */

function openLoginModal() {

    closeModal("signupModal");

    document.getElementById("loginModal")
        .classList.add("show");

}


/* ================= OPEN SIGNUP ================= */

function openSignupModal() {

    closeModal("loginModal");

    document.getElementById("signupModal")
        .classList.add("show");

}


/* ================= SWITCH ================= */

function switchToSignup() {

    openSignupModal();

}


function switchToLogin() {

    openLoginModal();

}


/* ================= SIGN UP ================= */

document.getElementById("signupForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();


        const name =
            document.getElementById("signupName")
                .value
                .trim();


        const email =
            document.getElementById("signupEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document.getElementById("signupPassword")
                .value;


        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        if (password !== confirmPassword) {

            showToast("Passwords do not match");

            return;

        }


        const existingAccount =
            accounts.find(account =>
                account.email === email
            );


        if (existingAccount) {

            showToast("Account already exists. Please login.");

            return;

        }


        const newAccount = {

            id: Date.now(),

            name,

            email,

            password

        };


        accounts.push(newAccount);


        localStorage.setItem(
            "studyFlowAccounts",
            JSON.stringify(accounts)
        );


        currentUser = newAccount;


        localStorage.setItem(
            "studyFlowCurrentUser",
            JSON.stringify(currentUser)
        );


        updateAccountUI();

        closeModal("signupModal");

        this.reset();

        showToast("Account created successfully! 🎉");

    });


/* ================= LOGIN ================= */

document.getElementById("loginForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();


        const email =
            document.getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document.getElementById("loginPassword")
                .value;


        const account =
            accounts.find(account =>
                account.email === email &&
                account.password === password
            );


        if (!account) {

            showToast("Invalid email or password");

            return;

        }


        currentUser = account;


        localStorage.setItem(
            "studyFlowCurrentUser",
            JSON.stringify(currentUser)
        );


        updateAccountUI();

        closeModal("loginModal");

        this.reset();

        showToast(`Welcome back, ${currentUser.name}! 👋`);

    });


/* ================= LOGOUT ================= */

function logoutUser() {

    localStorage.removeItem("studyFlowCurrentUser");

    currentUser = null;

    updateAccountUI();

    closeModal("profileModal");

    showToast("Logged out successfully");

}


/* ================= TOP PROFILE CLICK ================= */

document.getElementById("topProfileBtn")
    .addEventListener("click", () => {

        if (currentUser) {

            openProfile();

        } else {

            openLoginModal();

        }

    });


/* ================= OPEN PROFILE ================= */

function openProfile() {

    if (!currentUser) {

        openLoginModal();

        return;

    }


    document.getElementById("profileAvatar")
        .textContent =
            currentUser.name
                .charAt(0)
                .toUpperCase();


    document.getElementById("profileName")
        .textContent =
            currentUser.name;


    document.getElementById("profileEmail")
        .textContent =
            currentUser.email;


    document.getElementById("profileType")
        .textContent =
            "Student Account";


    document.getElementById("profileSubjects")
        .textContent =
            subjects.length;


    document.getElementById("profileTasks")
        .textContent =
            tasks.length;


    document.getElementById("profileModal")
        .classList.add("show");

}


/* ================= SAVE PROFILE NAME ================= */

function saveStudentName() {

    const input =
        document.getElementById("studentNameInput");


    const newName =
        input.value.trim();


    if (!newName) {

        showToast("Please enter your name");

        return;

    }


    if (!currentUser) {

        showToast("Please login to change your profile name");

        return;

    }


    currentUser.name = newName;


    accounts = accounts.map(account => {

        if (account.id === currentUser.id) {

            return {
                ...account,
                name: newName
            };

        }

        return account;

    });


    localStorage.setItem(
        "studyFlowAccounts",
        JSON.stringify(accounts)
    );


    localStorage.setItem(
        "studyFlowCurrentUser",
        JSON.stringify(currentUser)
    );


    updateAccountUI();

    showToast("Profile name updated");

}


/* =========================================
   STUDY DATA STORAGE
========================================= */

function saveData() {

    localStorage.setItem(
        "studySubjects",
        JSON.stringify(subjects)
    );


    localStorage.setItem(
        "studyTasks",
        JSON.stringify(tasks)
    );


    localStorage.setItem(
        "studySchedules",
        JSON.stringify(schedules)
    );


    localStorage.setItem(
        "studyNotes",
        JSON.stringify(notes)
    );

}


/* ================= RENDER ALL ================= */

function renderAll() {

    renderSubjects();

    renderTasks();

    renderSchedules();

    renderNotes();

    updateDashboard();

}


/* =========================================
   SUBJECTS
========================================= */

function renderSubjects() {

    const container =
        document.getElementById("subjectsGrid");


    if (!subjects.length) {

        container.innerHTML = `
            <div class="content-card empty-state">
                No subjects added yet.
            </div>
        `;

        updateSubjectSelects();

        return;

    }


    container.innerHTML =
        subjects.map(subject => `

            <div class="subject-card">

                <div class="subject-card-top">

                    <div class="subject-icon">
                        ${escapeHTML(subject.icon)}
                    </div>


                    <button
                        class="delete-icon"
                        onclick="deleteSubject(${subject.id})"
                        title="Delete Subject"
                    >
                        🗑️
                    </button>

                </div>


                <h3>
                    ${escapeHTML(subject.name)}
                </h3>


                <div class="subject-progress-top">

                    <span>Progress</span>

                    <strong>
                        ${subject.progress}%
                    </strong>

                </div>


                <div class="progress-bar">

                    <div
                        style="width:${subject.progress}%"
                    ></div>

                </div>

            </div>

        `).join("");


    updateSubjectSelects();

}


function openSubjectModal() {

    document.getElementById("subjectModal")
        .classList.add("show");

}


document.getElementById("subjectForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();


        const name =
            document.getElementById("subjectName")
                .value
                .trim();


        const icon =
            document.getElementById("subjectIcon")
                .value
                .trim() || "📚";


        const progress =
            Number(
                document.getElementById("subjectProgress")
                    .value
            );


        subjects.push({

            id: Date.now(),

            name,

            icon,

            progress: Math.min(
                100,
                Math.max(0, progress)
            )

        });


        saveData();

        renderAll();

        closeModal("subjectModal");

        this.reset();

        showToast("Subject added successfully");

    });


function deleteSubject(id) {

    const subject =
        subjects.find(subject =>
            subject.id === id
        );


    if (!subject) return;


    const confirmed =
        confirm(
            `Delete "${subject.name}"?`
        );


    if (!confirmed) return;


    subjects =
        subjects.filter(subject =>
            subject.id !== id
        );


    saveData();

    renderAll();

    showToast("Subject deleted");

}


function updateSubjectSelects() {

    const taskSelect =
        document.getElementById("taskSubject");


    const scheduleSelect =
        document.getElementById("scheduleSubject");


    const options =
        subjects.map(subject => `

            <option value="${escapeHTML(subject.name)}">
                ${escapeHTML(subject.name)}
            </option>

        `).join("");


    const emptyOption =
        `<option value="">No subjects available</option>`;


    taskSelect.innerHTML =
        options || emptyOption;


    scheduleSelect.innerHTML =
        options || emptyOption;

}


/* =========================================
   TASKS
========================================= */

function openTaskModal() {

    if (!subjects.length) {

        showToast("Please add a subject first");

        return;

    }


    updateSubjectSelects();


    const dateInput =
        document.getElementById("taskDate");


    if (!dateInput.value) {

        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }


    document.getElementById("taskModal")
        .classList.add("show");

}


document.getElementById("taskForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();


        tasks.push({

            id: Date.now(),

            name:
                document.getElementById("taskName")
                    .value
                    .trim(),

            subject:
                document.getElementById("taskSubject")
                    .value,

            date:
                document.getElementById("taskDate")
                    .value,

            priority:
                document.getElementById("taskPriority")
                    .value,

            completed: false

        });


        saveData();

        renderAll();

        closeModal("taskModal");

        this.reset();

        showToast("Task added successfully");

    });


function renderTasks() {

    const container =
        document.getElementById("allTasks");


    let filteredTasks =
        [...tasks];


    if (currentTaskFilter === "pending") {

        filteredTasks =
            filteredTasks.filter(task =>
                !task.completed
            );

    }


    if (currentTaskFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(task =>
                task.completed
            );

    }


    const search =
        document.getElementById("taskSearch")
            .value
            .toLowerCase();


    if (search) {

        filteredTasks =
            filteredTasks.filter(task =>
                task.name
                    .toLowerCase()
                    .includes(search) ||

                task.subject
                    .toLowerCase()
                    .includes(search)
            );

    }


    if (!filteredTasks.length) {

        container.innerHTML = `
            <div class="empty-state">
                No tasks found.
            </div>
        `;

        return;

    }


    container.innerHTML =
        filteredTasks
            .map(task => taskHTML(task))
            .join("");

}


function taskHTML(task) {

    return `

        <div class="task-item ${task.completed ? "completed" : ""}">

            <input
                class="task-check"
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >


            <div class="task-info">

                <strong>
                    ${escapeHTML(task.name)}
                </strong>

                <span>
                    ${escapeHTML(task.subject)}
                    • Due ${formatDate(task.date)}
                </span>

            </div>


            <span class="priority ${task.priority}">
                ${task.priority}
            </span>


            <div class="task-actions">

                <button
                    class="small-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </div>

        </div>

    `;

}


function toggleTask(id) {

    const task =
        tasks.find(task =>
            task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveData();

    renderAll();


    showToast(
        task.completed
            ? "Task completed! 🎉"
            : "Task marked as pending"
    );

}


function deleteTask(id) {

    tasks =
        tasks.filter(task =>
            task.id !== id
        );


    saveData();

    renderAll();

    showToast("Task deleted");

}


/* TASK FILTER */

document.querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".filter-btn")
                .forEach(btn => {

                    btn.classList.remove("active");

                });


            button.classList.add("active");


            currentTaskFilter =
                button.dataset.filter;


            renderTasks();

        });

    });


document.getElementById("taskSearch")
    .addEventListener("input", renderTasks);


/* =========================================
   SCHEDULE
========================================= */

function openScheduleModal() {

    if (!subjects.length) {

        showToast("Please add a subject first");

        return;

    }


    updateSubjectSelects();


    document.getElementById("scheduleModal")
        .classList.add("show");

}


document.getElementById("scheduleForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();


        schedules.push({

            id: Date.now(),

            time:
                document.getElementById("scheduleTime")
                    .value,

            subject:
                document.getElementById("scheduleSubject")
                    .value,

            topic:
                document.getElementById("scheduleTopic")
                    .value
                    .trim()

        });


        schedules.sort((a, b) =>
            a.time.localeCompare(b.time)
        );


        saveData();

        renderAll();

        closeModal("scheduleModal");

        this.reset();

        showToast("Schedule added successfully");

    });


function renderSchedules() {

    const scheduleContainer =
        document.getElementById("scheduleContainer");


    const dashboardSchedule =
        document.getElementById("dashboardSchedule");


    if (!schedules.length) {

        scheduleContainer.innerHTML = `
            <div class="empty-state">
                No schedule added yet.
            </div>
        `;


        dashboardSchedule.innerHTML = `
            <div class="empty-state">
                No schedule added yet.
            </div>
        `;

        return;

    }


    scheduleContainer.innerHTML =
        schedules.map(schedule => `

            <div class="schedule-item">

                <div class="schedule-time">
                    ${formatTime(schedule.time)}
                </div>


                <div class="schedule-info">

                    <strong>
                        ${escapeHTML(schedule.subject)}
                    </strong>

                    <span>
                        ${escapeHTML(schedule.topic)}
                    </span>

                </div>


                <button
                    class="schedule-delete"
                    onclick="deleteSchedule(${schedule.id})"
                >
                    🗑️
                </button>

            </div>

        `).join("");


    dashboardSchedule.innerHTML =
        schedules
            .slice(0, 4)
            .map(schedule => `

                <div class="schedule-item">

                    <div class="schedule-time">
                        ${formatTime(schedule.time)}
                    </div>


                    <div class="schedule-info">

                        <strong>
                            ${escapeHTML(schedule.subject)}
                        </strong>

                        <span>
                            ${escapeHTML(schedule.topic)}
                        </span>

                    </div>

                </div>

            `).join("");

}


function deleteSchedule(id) {

    schedules =
        schedules.filter(schedule =>
            schedule.id !== id
        );


    saveData();

    renderAll();

    showToast("Schedule deleted");

}


/* =========================================
   NOTES
========================================= */

function openNoteModal() {

    document.getElementById("noteModal")
        .classList.add("show");

}


document.getElementById("noteForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();


        notes.unshift({

            id: Date.now(),

            title:
                document.getElementById("noteTitle")
                    .value
                    .trim(),

            content:
                document.getElementById("noteContent")
                    .value
                    .trim(),

            createdAt:
                new Date()
                    .toLocaleDateString()

        });


        saveData();

        renderNotes();

        updateDashboard();

        closeModal("noteModal");

        this.reset();

        showToast("Note saved successfully");

    });


function renderNotes() {

    const container =
        document.getElementById("notesGrid");


    if (!notes.length) {

        container.innerHTML = `
            <div class="content-card empty-state">
                No notes added yet.
            </div>
        `;

        return;

    }


    container.innerHTML =
        notes.map(note => `

            <div class="note-card">

                <div class="note-card-top">

                    <h3>
                        📝 ${escapeHTML(note.title)}
                    </h3>


                    <button
                        class="delete-icon"
                        onclick="deleteNote(${note.id})"
                    >
                        🗑️
                    </button>

                </div>


                <p>
                    ${escapeHTML(note.content)}
                </p>


                <span class="note-date">
                    Saved: ${escapeHTML(note.createdAt || "Today")}
                </span>

            </div>

        `).join("");

}


function deleteNote(id) {

    notes =
        notes.filter(note =>
            note.id !== id
        );


    saveData();

    renderNotes();

    showToast("Note deleted");

}


/* =========================================
   DASHBOARD + PROGRESS
========================================= */

function updateDashboard() {

    const totalSubjects =
        subjects.length;


    const completed =
        tasks.filter(task =>
            task.completed
        ).length;


    const pending =
        tasks.filter(task =>
            !task.completed
        ).length;


    const taskProgress =
        tasks.length
            ? Math.round(
                (completed / tasks.length) * 100
            )
            : 0;


    const subjectProgress =
        subjects.length
            ? Math.round(

                subjects.reduce(
                    (sum, subject) =>
                        sum + Number(subject.progress),
                    0
                ) / subjects.length

            )
            : 0;


    const overall =
        tasks.length
            ? Math.round(
                (taskProgress + subjectProgress) / 2
            )
            : subjectProgress;


    /* STAT CARDS */

    document.getElementById("totalSubjects")
        .textContent =
            totalSubjects;


    document.getElementById("completedTasks")
        .textContent =
            completed;


    document.getElementById("pendingTasks")
        .textContent =
            pending;


    document.getElementById("overallProgress")
        .textContent =
            `${overall}%`;


    /* CIRCLE */

    document.getElementById("circleProgress")
        .textContent =
            `${overall}%`;


    document.querySelector(".circle-progress")
        .style.background =
            `conic-gradient(
                var(--primary) ${overall}%,
                var(--border) ${overall}%
            )`;


    /* TODAY TASKS */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayTasks =
        tasks.filter(task =>
            task.date === today
        );


    const dashboardTasks =
        document.getElementById("dashboardTasks");


    if (!todayTasks.length) {

        dashboardTasks.innerHTML = `
            <div class="empty-state">
                🎉 No tasks for today.
            </div>
        `;

    } else {

        dashboardTasks.innerHTML =
            todayTasks
                .slice(0, 5)
                .map(task => taskHTML(task))
                .join("");

    }


    /* DASHBOARD SUBJECTS */

    const dashboardSubjects =
        document.getElementById("dashboardSubjects");


    if (!subjects.length) {

        dashboardSubjects.innerHTML = `
            <div class="empty-state">
                No subjects yet.
            </div>
        `;

    } else {

        dashboardSubjects.innerHTML =
            subjects
                .slice(0, 4)
                .map(subject => `

                    <div class="mini-subject">

                        <div class="mini-subject-top">

                            <span>
                                ${escapeHTML(subject.icon)}
                                ${escapeHTML(subject.name)}
                            </span>

                            <span>
                                ${subject.progress}%
                            </span>

                        </div>


                        <div class="progress-bar">

                            <div
                                style="width:${subject.progress}%"
                            ></div>

                        </div>

                    </div>

                `).join("");

    }


    /* PROGRESS PAGE */

    document.getElementById("bigProgress")
        .textContent =
            `${overall}%`;


    document.getElementById("bigProgressBar")
        .style.width =
            `${overall}%`;


    document.getElementById("progressCompleted")
        .textContent =
            completed;


    document.getElementById("progressPending")
        .textContent =
            pending;


    const progressSubjects =
        document.getElementById("progressSubjects");


    if (!subjects.length) {

        progressSubjects.innerHTML = `
            <div class="empty-state">
                No subject progress available.
            </div>
        `;

    } else {

        progressSubjects.innerHTML =
            subjects.map(subject => `

                <div
                    class="mini-subject"
                    style="margin-bottom:15px"
                >

                    <div class="mini-subject-top">

                        <span>
                            ${escapeHTML(subject.icon)}
                            ${escapeHTML(subject.name)}
                        </span>

                        <span>
                            ${subject.progress}%
                        </span>

                    </div>


                    <div class="progress-bar">

                        <div
                            style="width:${subject.progress}%"
                        ></div>

                    </div>

                </div>

            `).join("");

    }

}


/* =========================================
   CHART
========================================= */

function createChart() {

    const canvas =
        document.getElementById("studyChart");


    if (!canvas) return;


    if (studyChart) {

        studyChart.destroy();

    }


    const ctx =
        canvas.getContext("2d");


    studyChart =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels: [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ],

                datasets: [

                    {

                        label: "Study Hours",

                        data: [
                            2,
                            3,
                            1.5,
                            4,
                            2.5,
                            4.5,
                            2
                        ],

                        borderRadius: 6

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            stepSize: 1

                        }

                    }

                }

            }

        });

}


/* =========================================
   THEME
========================================= */

themeToggle.addEventListener(
    "click",
    toggleTheme
);


function loadTheme() {

    const savedTheme =
        localStorage.getItem("studyTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeToggle.textContent = "☀️";

    }

}


function toggleTheme() {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "studyTheme",
        isDark
            ? "dark"
            : "light"
    );


    themeToggle.textContent =
        isDark
            ? "☀️"
            : "🌙";

}


/* =========================================
   MODAL
========================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.classList.remove("show");

    }

}


document.querySelectorAll(".modal-overlay")
    .forEach(overlay => {

        overlay.addEventListener("click", function (e) {

            if (e.target === overlay) {

                overlay.classList.remove("show");

            }

        });

    });


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    document.getElementById("toastMessage")
        .textContent =
            message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

}


/* =========================================
   HELPERS
========================================= */

function formatDate(dateString) {

    if (!dateString) return "";


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {

            month: "short",

            day: "numeric"

        }
    );

}


function formatTime(time) {

    if (!time) return "";


    const [hours, minutes] =
        time.split(":");


    let hour =
        parseInt(hours);


    const ampm =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minutes} ${ampm}`;

}


function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   CLEAR STUDY DATA
========================================= */

function clearAllData() {

    const confirmed =
        confirm(
            "Are you sure? This will delete all study data."
        );


    if (!confirmed) return;


    localStorage.removeItem("studySubjects");

    localStorage.removeItem("studyTasks");

    localStorage.removeItem("studySchedules");

    localStorage.removeItem("studyNotes");


    subjects = [];

    tasks = [];

    schedules = [];

    notes = [];


    renderAll();

    showToast("All study data cleared");

}