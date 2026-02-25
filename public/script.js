const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");

const API = "http://localhost:5000/api/students";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        studentId: document.getElementById("studentId").value,
        marks: document.getElementById("marks").value,
        attendance: document.getElementById("attendance").value
    };

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
    });

    form.reset();
    loadStudents();
});

async function loadStudents() {
    const res = await fetch(API);
    const students = await res.json();

    list.innerHTML = "";
    students.forEach(s => {
        list.innerHTML += `
            <li>
                ${s.name} | ID: ${s.studentId} | Marks: ${s.marks} | Attendance: ${s.attendance}%
                <button onclick="deleteStudent('${s._id}')">Delete</button>
            </li>
        `;
    });
}

async function deleteStudent(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadStudents();
}

loadStudents();