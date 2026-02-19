require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Models
const User = require("../models/User.model");
const Ticket = require("../models/Ticket.model");
const Transaction = require("../models/Transaction.model");
const Issuance = require("../models/Issuance.model");
const OrgMember = require("../models/OrgMember.model");

const logger = require("../utils/logger");

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info("MongoDB Connected for seeding");
    } catch (error) {
        logger.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

// Mock Users
const users = [
    {
        name: "Admin User",
        email: "admin@unc.edu.ph",
        studentId: "ADMIN001",
        password: "password123",
        role: "SUPER_ADMIN",
        isActive: true,
    },
    {
        name: "Juan Dela Cruz",
        email: "juan.delacruz@unc.edu.ph",
        studentId: "2024-00001",
        password: "password123",
        role: "OFFICER",
        isActive: true,
    },
    {
        name: "Maria Santos",
        email: "maria.santos@unc.edu.ph",
        studentId: "2024-00002",
        password: "password123",
        role: "OFFICER",
        isActive: true,
    },
    {
        name: "Pedro Reyes",
        email: "pedro.reyes@unc.edu.ph",
        studentId: "2024-00003",
        password: "password123",
        role: "STUDENT",
        isActive: true,
    },
    {
        name: "Ana Garcia",
        email: "ana.garcia@unc.edu.ph",
        studentId: "2024-00004",
        password: "password123",
        role: "STUDENT",
        isActive: true,
    },
    {
        name: "Carlos Mendoza",
        email: "carlos.mendoza@unc.edu.ph",
        studentId: "2024-00005",
        password: "password123",
        role: "STUDENT",
        isActive: true,
    },
];

// Mock Tickets (Tinig Dinig)
const getTickets = (userIds) => [
    {
        title: "Request for Extended Library Hours",
        description:
            "Many students need to study late especially during finals week. We request that the library extend its operating hours until 10 PM on weekdays.",
        category: "REQUEST",
        status: "IN_PROGRESS",
        priority: "HIGH",
        submittedBy: userIds[3],
        assignedTo: userIds[1],
    },
    {
        title: "Broken AC in Room 301",
        description:
            "The air conditioning unit in Room 301 of the Science Building has been broken for two weeks. Classes are becoming unbearable in the afternoon heat.",
        category: "COMPLAINT",
        status: "PENDING",
        priority: "URGENT",
        submittedBy: userIds[4],
    },
    {
        title: "Suggestion: More Water Stations",
        description:
            "It would be great to have more water refilling stations around campus, especially near the gymnasium and outdoor courts.",
        category: "SUGGESTION",
        status: "APPROVED",
        priority: "MEDIUM",
        submittedBy: userIds[5],
        assignedTo: userIds[2],
    },
    {
        title: "Inquiry about Scholarship Programs",
        description:
            "Can USG provide information about available scholarship programs for academically deserving students from low-income families?",
        category: "INQUIRY",
        status: "COMPLETED",
        priority: "MEDIUM",
        submittedBy: userIds[3],
        assignedTo: userIds[1],
    },
    {
        title: "Feedback on Recent Campus Event",
        description:
            "The Foundation Day celebration was amazing! Great job to the USG team. However, the sound system could be improved for outdoor events.",
        category: "FEEDBACK",
        status: "COMPLETED",
        priority: "LOW",
        submittedBy: userIds[4],
    },
    {
        title: "Request for More Parking Space",
        description:
            "The current parking area is insufficient for the growing number of students with vehicles. Request to allocate additional parking space.",
        category: "REQUEST",
        status: "PENDING",
        priority: "MEDIUM",
        submittedBy: userIds[5],
    },
    {
        title: "WiFi Connection Issues in Cafeteria",
        description:
            "The WiFi signal in the cafeteria area is very weak. Students often need to work on assignments during lunch breaks.",
        category: "COMPLAINT",
        status: "IN_PROGRESS",
        priority: "HIGH",
        submittedBy: userIds[3],
        assignedTo: userIds[2],
    },
    {
        title: "Suggestion: Student Lounge Area",
        description:
            "A dedicated student lounge with comfortable seating and charging stations would greatly benefit students between classes.",
        category: "SUGGESTION",
        status: "PENDING",
        priority: "LOW",
        submittedBy: userIds[4],
    },
];

// Mock Transactions
const getTransactions = (userIds) => [
    {
        description: "Student Activity Fee Collection - First Semester",
        amount: 150000,
        type: "INCOME",
        category: "Student Fees",
        date: new Date("2025-08-15"),
        reference: "SAF-2025-001",
        createdBy: userIds[1],
        approvedBy: userIds[0],
        status: "APPROVED",
        notes: "Collection from 3000 students at ₱50 each",
    },
    {
        description: "Foundation Day Event Expenses",
        amount: 45000,
        type: "EXPENSE",
        category: "Events",
        date: new Date("2025-09-20"),
        reference: "EXP-2025-001",
        createdBy: userIds[2],
        approvedBy: userIds[0],
        status: "APPROVED",
        notes: "Sound system rental, decorations, and prizes",
    },
    {
        description: "Office Supplies Purchase",
        amount: 5500,
        type: "EXPENSE",
        category: "Office Supplies",
        date: new Date("2025-10-05"),
        reference: "EXP-2025-002",
        createdBy: userIds[1],
        approvedBy: userIds[0],
        status: "APPROVED",
    },
    {
        description: "Sportsfest Sponsorship - ABC Company",
        amount: 25000,
        type: "INCOME",
        category: "Sponsorship",
        date: new Date("2025-10-15"),
        reference: "SPON-2025-001",
        createdBy: userIds[2],
        status: "APPROVED",
        approvedBy: userIds[0],
    },
    {
        description: "Sportsfest Event Expenses",
        amount: 35000,
        type: "EXPENSE",
        category: "Events",
        date: new Date("2025-11-10"),
        reference: "EXP-2025-003",
        createdBy: userIds[1],
        status: "APPROVED",
        approvedBy: userIds[0],
        notes: "Trophies, medals, sports equipment rental",
    },
    {
        description: "Christmas Party Preparations",
        amount: 20000,
        type: "EXPENSE",
        category: "Events",
        date: new Date("2025-12-15"),
        reference: "EXP-2025-004",
        createdBy: userIds[2],
        status: "PENDING",
        notes: "Food, decorations, and exchange gift budget",
    },
    {
        description: "Donation from Alumni Association",
        amount: 50000,
        type: "INCOME",
        category: "Donations",
        date: new Date("2026-01-10"),
        reference: "DON-2026-001",
        createdBy: userIds[1],
        approvedBy: userIds[0],
        status: "APPROVED",
    },
    {
        description: "Leadership Training Seminar",
        amount: 15000,
        type: "EXPENSE",
        category: "Training",
        date: new Date("2026-01-25"),
        reference: "EXP-2026-001",
        createdBy: userIds[2],
        status: "PENDING",
        notes: "Venue rental and speaker honorarium",
    },
];

// Mock Issuances
const getIssuances = (userIds) => [
    {
        title: "Resolution No. 2025-001: Adoption of the USG Constitution",
        type: "RESOLUTION",
        category: "Administrative",
        department: "USG Legislative Assembly",
        description:
            "A resolution adopting the revised University Student Government Constitution for Academic Year 2025-2026.",
        documentUrl: "/documents/resolution-2025-001.pdf",
        issuedBy: "USG Legislative Assembly",
        issuedDate: new Date("2025-07-15"),
        status: "PUBLISHED",
        priority: "HIGH",
        createdBy: userIds[1],
        lastModifiedBy: userIds[1],
    },
    {
        title: "Resolution No. 2025-002: Allocation of Student Activity Funds",
        type: "RESOLUTION",
        category: "Financial",
        department: "USG Legislative Assembly",
        description:
            "A resolution allocating student activity funds for various campus organizations and events.",
        documentUrl: "/documents/resolution-2025-002.pdf",
        issuedBy: "USG Legislative Assembly",
        issuedDate: new Date("2025-08-20"),
        status: "PUBLISHED",
        priority: "HIGH",
        createdBy: userIds[1],
        lastModifiedBy: userIds[1],
    },
    {
        title: "Memorandum No. 2025-001: Guidelines for Campus Events",
        type: "MEMORANDUM",
        category: "Administrative",
        department: "USG Executive Department",
        description:
            "Guidelines and procedures for organizing campus events and activities.",
        documentUrl: "/documents/memo-2025-001.pdf",
        issuedBy: "USG Executive Department",
        issuedDate: new Date("2025-09-01"),
        status: "PUBLISHED",
        priority: "MEDIUM",
        createdBy: userIds[0],
        lastModifiedBy: userIds[0],
    },
    {
        title: "First Semester Financial Report 2025",
        type: "REPORT",
        category: "Financial",
        department: "USG Finance Committee",
        description:
            "Comprehensive financial report detailing income, expenses, and fund utilization for the first semester.",
        documentUrl: "/documents/financial-report-1st-sem-2025.pdf",
        issuedBy: "USG Finance Committee",
        issuedDate: new Date("2025-12-20"),
        status: "PUBLISHED",
        priority: "MEDIUM",
        createdBy: userIds[2],
        lastModifiedBy: userIds[2],
    },
    {
        title: "Circular No. 2026-001: Tinig Dinig System Launch",
        type: "CIRCULAR",
        category: "General",
        department: "USG Executive Department",
        description:
            "Announcing the launch of the Tinig Dinig digital feedback system for students.",
        documentUrl: "/documents/circular-2026-001.pdf",
        issuedBy: "USG Executive Department",
        issuedDate: new Date("2026-01-15"),
        status: "PUBLISHED",
        priority: "MEDIUM",
        createdBy: userIds[0],
        lastModifiedBy: userIds[0],
    },
    {
        title: "Resolution No. 2026-001: Support for Mental Health Initiatives",
        type: "RESOLUTION",
        category: "Academic",
        department: "USG Legislative Assembly",
        description:
            "A resolution expressing support for expanded mental health services and awareness programs on campus.",
        documentUrl: "/documents/resolution-2026-001.pdf",
        issuedBy: "USG Legislative Assembly",
        issuedDate: new Date("2026-02-01"),
        status: "PUBLISHED",
        priority: "HIGH",
        createdBy: userIds[1],
        lastModifiedBy: userIds[1],
    },
    {
        title: "Memorandum No. 2026-001: Updated Election Guidelines",
        type: "MEMORANDUM",
        category: "Administrative",
        department: "USG COMELEC",
        description:
            "Updated guidelines for the upcoming USG general elections.",
        documentUrl: "/documents/memo-2026-001.pdf",
        issuedBy: "USG COMELEC",
        issuedDate: new Date("2026-02-05"),
        status: "DRAFT",
        priority: "HIGH",
        createdBy: userIds[0],
        lastModifiedBy: userIds[0],
    },
    {
        title: "Memorandum No. 2025-002: Academic Integrity Policy Reminder",
        type: "MEMORANDUM",
        category: "Academic",
        department: "USG Executive Department",
        description:
            "A reminder to all students regarding the university's academic integrity policy and consequences of violations.",
        documentUrl: "/documents/memo-2025-002.pdf",
        issuedBy: "USG Executive Department",
        issuedDate: new Date("2025-10-10"),
        status: "PUBLISHED",
        priority: "MEDIUM",
        createdBy: userIds[0],
        lastModifiedBy: userIds[0],
    },
    {
        title: "Circular No. 2025-001: Midyear Budget Summary",
        type: "CIRCULAR",
        category: "Financial",
        department: "USG Finance Committee",
        description:
            "Summary of midyear budget utilization and remaining allocations for student organizations.",
        documentUrl: "/documents/circular-2025-001.pdf",
        issuedBy: "USG Finance Committee",
        issuedDate: new Date("2025-11-05"),
        status: "PUBLISHED",
        priority: "LOW",
        createdBy: userIds[2],
        lastModifiedBy: userIds[2],
    },
    {
        title: "Resolution No. 2025-003: Recognition of Outstanding Student Organizations",
        type: "RESOLUTION",
        category: "General",
        department: "USG Legislative Assembly",
        description:
            "A resolution recognizing student organizations that demonstrated exceptional service and leadership during AY 2025-2026.",
        documentUrl: "/documents/resolution-2025-003.pdf",
        issuedBy: "USG Legislative Assembly",
        issuedDate: new Date("2025-11-20"),
        status: "PUBLISHED",
        priority: "LOW",
        createdBy: userIds[1],
        lastModifiedBy: userIds[1],
    },
];

// Mock Organization Members
const getOrgMembers = (userIds) => [
    {
        user: userIds[1],
        position: "President",
        department: "Executive",
        term: {
            startDate: new Date("2025-07-01"),
            endDate: new Date("2026-06-30"),
        },
        isActive: true,
        responsibilities: [
            "Lead the student government",
            "Represent students in university matters",
            "Oversee all USG operations",
        ],
        contactInfo: {
            phone: "0917-123-4567",
            officeHours: "Mon-Fri 9:00 AM - 5:00 PM",
            location: "USG Office, Student Center Room 101",
        },
    },
    {
        user: userIds[2],
        position: "Vice President for Finance",
        department: "Finance",
        term: {
            startDate: new Date("2025-07-01"),
            endDate: new Date("2026-06-30"),
        },
        isActive: true,
        responsibilities: [
            "Manage USG finances",
            "Prepare financial reports",
            "Oversee budget allocation",
        ],
        contactInfo: {
            phone: "0918-234-5678",
            officeHours: "Mon-Fri 10:00 AM - 4:00 PM",
            location: "USG Office, Student Center Room 101",
        },
    },
];

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        logger.info("Clearing existing data...");
        await User.deleteMany({});
        await Ticket.deleteMany({});
        await Transaction.deleteMany({});
        await Issuance.deleteMany({});
        await OrgMember.deleteMany({});

        // Create users
        logger.info("Creating users...");
        const createdUsers = await User.create(users);
        const userIds = createdUsers.map((user) => user._id);
        logger.info(`Created ${createdUsers.length} users`);

        // Create tickets
        logger.info("Creating tickets...");
        const tickets = getTickets(userIds);
        const createdTickets = await Ticket.create(tickets);
        logger.info(`Created ${createdTickets.length} tickets`);

        // Create transactions
        logger.info("Creating transactions...");
        const transactions = getTransactions(userIds);
        const createdTransactions = await Transaction.create(transactions);
        logger.info(`Created ${createdTransactions.length} transactions`);

        // Create issuances
        logger.info("Creating issuances...");
        const issuances = getIssuances(userIds);
        const createdIssuances = await Issuance.create(issuances);
        logger.info(`Created ${createdIssuances.length} issuances`);

        // Create org members
        logger.info("Creating organization members...");
        const orgMembers = getOrgMembers(userIds);
        const createdOrgMembers = await OrgMember.create(orgMembers);
        logger.info(`Created ${createdOrgMembers.length} organization members`);

        logger.info("");
        logger.info("========================================");
        logger.info("Database seeded successfully!");
        logger.info("========================================");
        logger.info("");
        logger.info("Test Accounts:");
        logger.info("  Admin:   admin@unc.edu.ph / password123");
        logger.info("  Officer: juan.delacruz@unc.edu.ph / password123");
        logger.info("  Student: pedro.reyes@unc.edu.ph / password123");
        logger.info("");

        process.exit(0);
    } catch (error) {
        logger.error("Error seeding database:", error);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
