// Get student name (replace with dynamic value if you connect backend)
const studentName = localStorage.getItem('studentName') || "Student";
document.getElementById('student-name').textContent = studentName;

// Subject selection logic
const subjectList = document.getElementById('subject-list');
const selectedList = document.getElementById('selected-list');
let selectedSubjects = [];

// Click on available subject to add
subjectList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const subject = e.target.textContent;
        if (selectedSubjects.length < 7) {
            if (!selectedSubjects.includes(subject)) {
                selectedSubjects.push(subject);
                updateSelectedList();
            } else {
                alert("Subject already selected!");
            }
        } else {
            alert("You can select maximum 7 subjects!");
        }
    }
});

// Remove subject
function removeSubject(subject) {
    selectedSubjects = selectedSubjects.filter(s => s !== subject);
    updateSelectedList();
}

// Update selected list in UI
function updateSelectedList() {
    selectedList.innerHTML = '';
    selectedSubjects.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = subject;
        const btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.onclick = () => removeSubject(subject);
        li.appendChild(btn);
        selectedList.appendChild(li);
    });
}

// Save as PDF
document.getElementById('save-pdf-btn').addEventListener('click', () => {
    if(selectedSubjects.length === 0){
        alert("No subjects selected!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Registered Subjects - ${studentName}`, 20, 20);
    doc.setFontSize(12);

    selectedSubjects.forEach((sub, index) => {
        doc.text(`${index + 1}. ${sub}`, 20, 30 + index * 10);
    });

    doc.save(`${studentName}_subjects.pdf`);
});

// Logout button
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('studentName'); // clear stored name
    window.location.href = 'login.html'; // redirect to login page
});
