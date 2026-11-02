# SifoSchool

Independent school management platform by Sifonet Technologies.

## Product modules
- Dashboard and school profile
- Admissions, students and guardians
- Academic years, terms, classes, streams and subjects
- Attendance and timetable
- Exams, grading and report cards
- Fees, invoices, receipts and balances
- Staff, roles and permissions
- Reports, audit history and configuration

## Run locally
Requires Node.js 20 or newer.

```bash
npm install
npm run dev
npm run build
```

## Current implementation status
The repository contains an interactive React + TypeScript + Vite frontend foundation. Module navigation, searchable registers and add/edit/delete demo workflows are implemented. Demo changes are held in browser memory and are lost on refresh. No authentication, database, live school records, payments, messaging or production integrations are connected yet.

## Planned production stages
1. Product requirements and Zambia school workflows
2. Dedicated Supabase project, schema, migrations and row-level security
3. Authentication, school tenancy, roles and audit trail
4. Persistent student, academic, attendance and fee workflows
5. Reports, notifications, imports, backups and offline strategy
6. Automated tests, security review and deployment

SifoSchool is independent from SifoBooks and SifoHotel. Never put production secrets in this repository.
