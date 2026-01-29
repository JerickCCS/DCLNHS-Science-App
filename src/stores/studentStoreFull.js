// src/stores/studentStoreFull.js
import { LocalStorage } from 'quasar'

// Full flat list of all lessons and activities with unique IDs
const LESSONS_FLAT = [
    // UNIT I SCIENCE OF MATERIALS - CHAPTER 1
    { id: 1, title: "Lesson 1 Scientific Models" },
    { id: 2, title: "Lesson 2 Measurements and Data Organization in Science" },
    { id: 3, title: "Lesson 3 Common Laboratory Tools, Equipment, and Wares" },
    { id: 4, title: "Lesson 4 Doing Scientific Investigations" },
    { id: 5, title: "Technology in Focus" },
    { id: 6, title: "Chapter Review" },
    { id: 7, title: "Activity 1 Measurement of Some Physical Quantities" },
    { id: 8, title: "Chapter Test" },

    // CHAPTER 2
    { id: 9, title: "Lesson 1 The Particles of Matter" },
    { id: 10, title: "Lesson 2 The Particle Nature of the Three States of Matter" },
    { id: 11, title: "Technology in Focus" },
    { id: 12, title: "Chapter Review" },
    { id: 13, title: "Activity 2 The Particle Nature of Matter" },
    { id: 14, title: "Chapter Test" },
    { id: 15, title: "STEM Challenge" },

    // CHAPTER 3
    { id: 16, title: "Lesson 1 The Nature of Solutions" },
    { id: 17, title: "Lesson 2 Solubility and Saturation" },
    { id: 18, title: "Lesson 3 Factors That Affect Solubility" },
    { id: 19, title: "Lesson 4 Expressing Concentration of Solutions" },
    { id: 20, title: "Lesson 5 Practical Examples of Solutions: Acids, Bases, and Salt Solutions" },
    { id: 21, title: "Technology in Focus" },
    { id: 22, title: "Chapter Review" },
    { id: 23, title: "Activity 3 Some Factors Affecting Solubility" },
    { id: 24, title: "Activity 4 Percent by Mass of Salt in Aqueous Solutions" },
    { id: 25, title: "Activity 5 Chemistry of Acids and Bases" },
    { id: 26, title: "Chapter Test" },
    { id: 27, title: "STEM Challenge" },

    // UNIT II LIFE SCIENCE - CHAPTER 4
    { id: 28, title: "Lesson 1 The Microscope: Parts and Function" },
    { id: 29, title: "Lesson 2 The Cell: The Basic Unit of Life" },
    { id: 30, title: "Technology in Focus" },
    { id: 31, title: "Chapter Review" },
    { id: 32, title: "Activity 6 Parts of a Compound Microscope" },
    { id: 33, title: "Activity 7 Focusing Specimens under the Compound Microscope" },
    { id: 34, title: "Chapter Test" },
    { id: 35, title: "STEM Challenge" },

    // CHAPTER 5
    { id: 36, title: "Lesson 1 The Cellular Reproduction" },
    { id: 37, title: "Lesson 2 Perpetuation of Organisms" },
    { id: 38, title: "Technology in Focus" },
    { id: 39, title: "Chapter Review" },
    { id: 40, title: "Activity 8 Meiosis: Modeling Crossing-Over" },
    { id: 41, title: "Activity 9 Sexual Reproduction in Plants" },
    { id: 42, title: "Chapter Test" },

    // CHAPTER 6
    { id: 43, title: "Lesson 1 Levels of Biological Organization" },
    { id: 44, title: "Lesson 2 Energy Flow in an Ecosystem" },
    { id: 45, title: "Technology in Focus" },
    { id: 46, title: "Chapter Review" },
    { id: 47, title: "Activity 10 Creating a Mini-Pond Ecosystem" },
    { id: 48, title: "Chapter Test" },
    { id: 49, title: "STEM Challenge" },

    // UNIT III FORCE, MOTION, AND ENERGY - CHAPTER 7
    { id: 50, title: "Lesson 1 Force and Interaction" },
    { id: 51, title: "Lesson 2 Net Force" },
    { id: 52, title: "Technology in Focus" },
    { id: 53, title: "Chapter Review" },
    { id: 54, title: "Activity 11 Measuring Forces" },
    { id: 55, title: "Chapter Test" },

    // CHAPTER 8
    { id: 56, title: "Lesson 1 Basic Concepts of Motion" },
    { id: 57, title: "Lesson 2 Uniform Motion" },
    { id: 58, title: "Technology in Focus" },
    { id: 59, title: "Chapter Review" },
    { id: 60, title: "Activity 12 Factors Affecting Motion in Toy Cars" },
    { id: 61, title: "Chapter Test" },
    { id: 62, title: "STEM Challenge" },

    // CHAPTER 9
    { id: 63, title: "Lesson 1 Basic Concepts of Energy and Temperature" },
    { id: 64, title: "Lesson 2 Modes of Heat Transfer" },
    { id: 65, title: "Lesson 3 Saving Energy Efficiency" },
    { id: 66, title: "Technology in Focus" },
    { id: 67, title: "Chapter Review" },
    { id: 68, title: "Activity 13 Particles in Motion" },
    { id: 69, title: "Chapter Test" },
    { id: 70, title: "STEM Challenge" },

    // UNIT IV EARTH AND SPACE SCIENCE - CHAPTER 10
    { id: 71, title: "Lesson 1 Earthquakes along Faults" },
    { id: 72, title: "Lesson 2 Measuring Earthquakes" },
    { id: 73, title: "Lesson 3 Earthquake Preparedness" },
    { id: 74, title: "Technology in Focus" },
    { id: 75, title: "Chapter Review" },
    { id: 76, title: "Activity 14 Simulation of an Earthquake" },
    { id: 77, title: "Chapter Test" },
    { id: 78, title: "STEM Challenge" },

    // CHAPTER 11
    { id: 79, title: "Lesson 1 The Earth's Atmosphere" },
    { id: 80, title: "Lesson 2 Movement in the Atmosphere" },
    { id: 81, title: "Technology in Focus" },
    { id: 82, title: "Chapter Review" },
    { id: 83, title: "Activity 15 Uneven Heating of Earth's Surface" },
    { id: 84, title: "Activity 16 Amount of Water Vapor in the Air" },
    { id: 85, title: "Chapter Test" },
    { id: 86, title: "STEM Challenge" },

    // CHAPTER 12
    { id: 87, title: "Lesson 1 Earth's Motions" },
    { id: 88, title: "Lesson 2 Seasons in the Philippines" },
    { id: 89, title: "Technology in Focus" },
    { id: 90, title: "Chapter Review" },
    { id: 91, title: "Activity 17 Earth's Seasons" },
    { id: 92, title: "Chapter Test" }
]

// Clone lessons for new student
function cloneLessons() {
    const progress = {}
    LESSONS_FLAT.forEach(lesson => {
        progress[lesson.id] = { title: lesson.title, completed: false }
    })
    return progress
}

// Get last used student ID from localStorage and increment it
function getNextStudentId() {
    const students = LocalStorage.getItem('students') || []
    const lastStudent = students[students.length - 1]
    return lastStudent ? lastStudent.studentId + 1 : 1 // Start with 1 if no students exist
}

// Create a new student
export function createStudent(name, section) {
    const students = LocalStorage.getItem('students') || []

    if (students.find(s => s.name === name && s.section === section)) {
        return { error: 'Student already exists' }
    }

    const newStudent = {
        studentId: getNextStudentId(), // Get next available ID
        name,
        section,
        progress: cloneLessons()
    }

    students.push(newStudent)
    LocalStorage.set('students', students)
    return newStudent
}

// Get all students
export function getStudents() {
    return LocalStorage.getItem('students') || []
}

// Update lesson progress by ID
export function updateProgress(name, section, lessonId, status = true) {
    const students = LocalStorage.getItem('students') || []
    const student = students.find(s => s.name === name && s.section === section)
    if (!student) return { error: 'Student not found' }

    if (lessonId in student.progress) {
        student.progress[lessonId].completed = status
        LocalStorage.set('students', students)
        return { success: true }
    }

    return { error: 'Lesson ID not found' }
}
