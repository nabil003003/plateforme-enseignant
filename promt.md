# Build a Complete Arabic RTL Teacher Random Student Picker

You are an expert full-stack developer, UI/UX designer, and software architect.

Build a complete production-quality web application for teachers that allows them to manage multiple classes, import Arabic student names from Excel files, and randomly select students using a fun animated roulette/random-draw experience.

The application must be beautiful, modern, responsive, easy to use, and optimized for classroom/projector use.

Do NOT create a basic CRUD dashboard with a generic table. The main experience should feel like a polished educational game.

---

# 1. CORE PURPOSE

The application is designed for teachers.

A teacher should be able to:

1. Create multiple classes.
2. Import students from Excel.
3. Store each class permanently.
4. Select a class.
5. Immediately see/load its students.
6. Start a random student draw.
7. Show a visually exciting roulette/random animation.
8. Select exactly one student.
9. Prevent the same student from being selected again during the current round.
10. Continue until every student has participated.
11. Start a new round when everyone has been selected.
12. Manage classes and students at any time.

The entire interface must support Arabic names and RTL correctly.

---

# 2. IMPORTANT UX PRINCIPLE

The application has TWO major experiences:

## A. Teacher Management

Used to:

* Create classes
* Import Excel files
* Manage students
* Rename classes
* Delete classes
* Add students manually
* Remove students
* View statistics

## B. Classroom Game

Used while teaching.

This should be extremely simple.

The teacher selects:

Class → Start Game → Roulette Animation → Student Selected

The selected student's Arabic name should be extremely large and clearly visible.

The classroom/game screen should work beautifully on:

* Desktop
* Laptop
* Tablet
* Phone
* Large classroom projector

---

# 3. TECHNOLOGY

Use a modern stable web stack.

Preferred stack:

Frontend:

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide icons
* Framer Motion for animations

Backend:

* Next.js server-side functionality OR a clean API architecture if needed.

Database:

* PostgreSQL

ORM:

* Prisma

Excel:

* SheetJS / xlsx

Validation:

* Zod

State:

* React state for local UI
* Zustand if global state becomes useful

Charts/statistics:

* Recharts only where genuinely useful

Do not introduce unnecessary technologies.

The application must be easy to run locally.

Provide:

* package.json
* environment example
* database schema
* migrations
* seed data
* README
* setup instructions

---

# 4. LANGUAGE

The primary interface language is Arabic.

The entire UI must be RTL.

Use:

dir="rtl"

and appropriate RTL CSS.

Arabic text must render naturally.

Use an Arabic-friendly font such as:

* Cairo
* Tajawal

Prefer Cairo unless there is a strong reason otherwise.

The interface should NOT feel like an English application translated into Arabic.

Design the UI naturally for Arabic users.

Example labels:

الرئيسية
الفصول
الطلاب
استيراد من Excel
إضافة طالب
بدء اللعبة
سحب عشوائي
الطالب المختار
الجولة الحالية
الطلاب المشاركون
الطلاب المتبقون
إعادة الجولة
إدارة الفصل
تعديل الفصل
حذف الفصل
عدد الطلاب
آخر اختيار
بدء السحب

---

# 5. OPTIONAL LANGUAGE ARCHITECTURE

Even though Arabic is the default language, structure the application so that adding:

* French
* English

later would be easy.

Do NOT hardcode the architecture in a way that makes internationalization impossible.

However, do not spend time implementing unnecessary languages unless needed.

Arabic is the priority.

---

# 6. DATABASE DESIGN

Create a clean relational PostgreSQL schema.

Main entities:

## Class

Fields:

* id
* name
* description optional
* createdAt
* updatedAt

Example:

Class:
"السنة الأولى إعدادي - المجموعة A"

## Student

Fields:

* id
* classId
* name
* createdAt
* updatedAt

A student belongs to exactly one class.

## GameSession / Round

Fields:

* id
* classId
* startedAt
* completedAt optional
* status

Possible status:

ACTIVE
COMPLETED

## Selection

Fields:

* id
* roundId
* studentId
* selectedAt
* selectionOrder

This allows the application to remember who was selected during each round.

Use proper foreign keys and indexes.

Add unique constraints where appropriate.

For example:

A student must not be selected twice in the same round.

Use:

unique(roundId, studentId)

---

# 7. CLASS MANAGEMENT

Create a dedicated Classes page.

Display beautiful class cards.

Example:

---

📚 السنة الأولى إعدادي

32 طالب

آخر نشاط:
اليوم

[دخول إلى اللعبة]

---

Each class card should contain:

* Class name
* Number of students
* Created date
* Quick start button
* Manage button
* Delete button

Add:

* إنشاء فصل جديد

When creating a class:

Fields:

اسم الفصل
وصف الفصل - optional

Example:

اسم الفصل:
"الثانية إعدادي - 2"

---

# 8. EXCEL IMPORT

This is one of the most important features.

The teacher must be able to import students from an Excel file.

Supported:

.xlsx
.xls if practical

The application must correctly handle Arabic Unicode.

Example Excel:

| اسم التلميذ     |
| --------------- |
| محمد العلوي     |
| سارة أحمد       |
| يوسف بنعلي      |
| مريم الإدريسي   |
| عبد الرحمن محمد |

The system should automatically detect the likely student-name column.

Support common column names such as:

اسم
اسم الطالب
اسم التلميذ
الطالب
التلميذ
name
student
student name

If automatic detection fails, show a column-selection interface.

---

# 9. EXCEL IMPORT UX

Do NOT immediately insert everything into the database.

Use this workflow:

STEP 1:
Upload Excel.

STEP 2:
Read file.

STEP 3:
Analyze columns.

STEP 4:
Display preview.

Example:

تم العثور على 32 طالبًا

Preview:

1. محمد العلوي
2. سارة أحمد
3. يوسف بنعلي
4. مريم الإدريسي

STEP 5:

Show possible problems:

* Empty names
* Duplicate names
* Invalid rows

Example:

⚠️ تم العثور على طالبين مكررين.

Allow:

[استيراد مع تجاهل التكرارات]

or

[إلغاء]

STEP 6:

Confirm import.

Then save students.

---

# 10. EXCEL MULTIPLE-SHEET SUPPORT

Ideally support Excel files containing multiple sheets.

Example:

students.xlsx

Sheet:
1A

Sheet:
1B

Sheet:
2A

When multiple sheets are detected:

Show:

اختر الأوراق التي تريد استيرادها

☑ 1A
☑ 1B
☐ 2A

Allow the teacher to map each sheet to:

* Existing class
  OR
* New class

If this feature significantly complicates the application, implement it cleanly without breaking the basic single-sheet import.

---

# 11. MANUAL STUDENT MANAGEMENT

Inside each class:

Show students.

Provide:

* إضافة طالب

The teacher enters:

اسم الطالب

Example:

"أحمد محمد"

Buttons:

إضافة
إلغاء

Allow:

* Edit student
* Delete student

Use confirmation before deletion.

Example:

هل أنت متأكد من حذف الطالب "أحمد محمد"؟

[إلغاء]
[حذف]

---

# 12. STUDENT LIST DESIGN

Do NOT create an ugly huge table.

The interface should remain clean.

Use cards or a compact list.

Example:

طلاب الفصل

32 طالبًا

01  محمد العلوي
02  سارة أحمد
03  يوسف بنعلي
04  مريم الإدريسي

Each item:

Name
Status if relevant
Actions

If the class contains many students, use pagination or virtualization.

---

# 13. MAIN DASHBOARD

Create a beautiful teacher dashboard.

Top:

مرحبا بك 👋

إدارة فصولك وابدأ نشاطًا تفاعليًا مع طلابك.

Statistics:

📚 عدد الفصول
👨‍🎓 عدد الطلاب
🎯 الاختيارات اليوم
🏆 الجولات المكتملة

Then:

فصولي

Display class cards.

Also provide:

* إنشاء فصل

and:

📥 استيراد الطلاب من Excel

---

# 14. GAME SCREEN

This is the most important screen.

When the teacher selects a class, open:

GAME MODE

Example header:

🎯
السنة الأولى إعدادي

32 طالبًا

الجولة 2

Main screen should be visually impressive.

Center:

🎰 RANDOM STUDENT PICKER

Show rapidly changing Arabic names.

For example:

محمد
↓
سارة
↓
يوسف
↓
مريم
↓
أحمد
↓
خالد
↓
...

Then stop dramatically.

Final:

🎉
مريم الإدريسي
🎉

Below:

حان دور مريم!

---

# 15. RANDOMIZATION ALGORITHM

Do NOT use fake randomness where the same student can repeatedly appear.

For each round:

availableStudents =
all students
minus students already selected in current round.

When the teacher presses:

سحب عشوائي

choose one uniformly random student from availableStudents.

After selection:

create Selection record.

Remove the student from availableStudents.

Continue.

When:

availableStudents.length === 0

the round is complete.

Show:

🎉 انتهت الجولة!

لقد شارك جميع الطلاب.

[بدء جولة جديدة]

---

# 16. IMPORTANT FAIRNESS REQUIREMENT

The random algorithm must be genuinely random.

Do not select based on:

* Name
* Alphabetical order
* Student ID
* Position in array

Use a proper random selection method.

The UI animation is only visual.

The final selected student must come from the actual randomized selection result.

Do not let the animation determine the result in an unreliable way.

---

# 17. ROULETTE ANIMATION

Make the animation fun.

When clicking:

🎲 سحب عشوائي

Start a fast name-changing animation.

For example:

300ms:
محمد

250ms:
سارة

200ms:
يوسف

...

Slow down gradually.

Then:

✨ FINAL STOP ✨

Show selected student.

Use Framer Motion.

Animation should include:

* Scale
* Fade
* Blur
* Slight vertical movement
* Glow
* Celebration

Do NOT make the animation too heavy or slow.

Target total animation:

approximately 2–4 seconds.

Allow the teacher to click again only after the current animation finishes.

---

# 18. NO REPEAT VISUALIZATION

The teacher should clearly know who has already participated.

On the side/bottom:

الطلاب

✅ محمد
✅ سارة
⬜ يوسف
⬜ مريم
⬜ أحمد

or:

تم اختيارهم: 12
متبقون: 20

Use visual states.

Selected students can appear slightly faded.

Remaining students should remain prominent.

---

# 19. GAME PROGRESS

Display:

الجولة الحالية

12 / 32

with a progress bar.

Example:

████████░░░░░░░░

12 طالبًا شاركوا
20 طالبًا متبقيًا

---

# 20. RESET ROUND

Button:

🔄 إعادة الجولة

Before reset:

هل تريد بدء جولة جديدة؟

سيتم السماح باختيار جميع الطلاب مرة أخرى.

[إلغاء]
[بدء جولة جديدة]

Do not delete historical data.

Simply create a new round.

---

# 21. HISTORY

Inside each class, allow the teacher to view previous rounds.

Example:

الجولات السابقة

الجولة 1
32 / 32
مكتملة
اليوم

الجولة 2
18 / 32
قيد التقدم

Clicking a completed round can show:

ترتيب الاختيار:

1. محمد العلوي
2. سارة أحمد
3. يوسف بنعلي
4. مريم الإدريسي

This is useful for transparency.

---

# 22. SOUND EFFECTS

Add optional classroom sounds.

Settings:

🔊 الصوت

ON/OFF

Possible sounds:

* Button click
* Roulette ticking
* Final selection
* Celebration

Do not make sounds mandatory.

Browser autoplay restrictions must be respected.

Only play sound after user interaction.

---

# 23. CONFETTI

When a student is selected:

show subtle celebration.

Use a lightweight confetti library or CSS/Canvas implementation.

Do not make the UI childish.

The design should be:

Fun + Professional + Educational.

---

# 24. VISUAL DESIGN

The application should look like a modern educational SaaS/game.

Avoid:

* Generic Bootstrap look
* Old-fashioned dashboards
* Excessive gradients
* Excessive rounded cards
* Too many colors
* Emoji everywhere
* Clutter

Use emojis/icons only where they improve the experience.

Design principles:

* Large typography
* Strong visual hierarchy
* Spacious layout
* Beautiful cards
* Smooth transitions
* Clear buttons
* Accessible contrast

Use a tasteful modern color system.

Possible visual direction:

Background:
very light neutral

Primary:
indigo / violet / blue

Success:
green

Warning:
amber

Danger:
red

Do not overuse colors.

---

# 25. DARK MODE

Support dark mode.

The game screen should look especially good in dark mode.

Persist the user's theme preference.

Provide:

☀️ / 🌙

toggle.

---

# 26. FULLSCREEN GAME MODE

Add:

⛶ وضع ملء الشاشة

The teacher should be able to display only the game.

When fullscreen:

* Hide unnecessary navigation
* Make student name extremely large
* Show class name
* Show progress
* Show next draw button

This is important for classroom projectors.

Use the browser Fullscreen API.

---

# 27. RESPONSIVE DESIGN

Desktop:

Sidebar + content.

Tablet:

Compact sidebar.

Mobile:

Bottom navigation or compact header.

Game mode:

Large centered student name.

Ensure Arabic text does not overflow.

Long names should wrap naturally.

Example:

عبد الرحمن بن محمد الإدريسي

must remain readable.

---

# 28. NAVIGATION

Main navigation:

الرئيسية
فصولي
الجولات
الإعدادات

Potential routes:

/
/classes
/classes/[id]
/classes/[id]/game
/classes/[id]/students
/classes/[id]/history
/settings

Keep routing logical.

---

# 29. SETTINGS

Settings page:

المظهر:

☀️ فاتح
🌙 داكن
💻 حسب النظام

الصوت:

تشغيل / إيقاف

اللغة:

العربية

Animation:

سريع
متوسط
هادئ

Default:

متوسط

---

# 30. EMPTY STATES

Every empty state should be designed.

No classes:

📚
لم تقم بإنشاء أي فصل بعد.

ابدأ بإنشاء فصل ثم أضف طلابك.

[إنشاء فصل]

No students:

👨‍🎓
لا يوجد طلاب في هذا الفصل.

[استيراد من Excel]
[إضافة طالب]

No remaining students:

🎉
شارك جميع الطلاب!

[بدء جولة جديدة]

---

# 31. ERROR HANDLING

Handle errors gracefully.

Excel errors:

❌ تعذر قراءة الملف.

❌ لم يتم العثور على أسماء طلاب.

❌ الملف فارغ.

❌ نوع الملف غير مدعوم.

Database errors:

Show user-friendly Arabic messages.

Never expose stack traces to the user.

Log technical errors for developers.

---

# 32. LOADING STATES

Never leave blank screens.

Use:

* Skeleton loaders
* Spinners
* Progress indicators

Examples:

جارٍ تحميل الفصول...

جارٍ استيراد الطلاب...

جارٍ حفظ البيانات...

---

# 33. ACCESSIBILITY

Follow accessibility best practices.

Requirements:

* Keyboard navigation
* Visible focus states
* Proper buttons
* ARIA labels where needed
* Good contrast
* Reduced-motion support

If user enables:

prefers-reduced-motion

reduce animations.

---

# 34. DATA VALIDATION

Validate:

Class name:
required
reasonable length

Student name:
required
trim whitespace
reasonable length

Normalize:

leading/trailing whitespace.

Do not accidentally modify Arabic characters.

Do not transliterate Arabic names.

Preserve names exactly as entered except whitespace normalization.

---

# 35. DUPLICATE STUDENTS

A class should normally not contain duplicate student names.

When importing:

محمد أحمد
محمد أحمد

detect it.

Show:

⚠️ يوجد اسم مكرر.

Give the teacher the option to:

* Ignore duplicates
* Cancel import

Do not silently destroy data.

---

# 36. SECURITY

Even though this is initially a teacher-focused application:

* Validate all API inputs
* Sanitize imported data
* Never trust client-side validation
* Use parameterized database queries through Prisma
* Protect destructive operations
* Avoid exposing database credentials
* Use environment variables
* Never commit secrets
* Validate uploaded file types
* Set reasonable file-size limits

---

# 37. PERFORMANCE

The application should work smoothly with at least:

* 50 classes
* 100 students per class
* potentially thousands of total students

Do not unnecessarily load all classes/students at once.

Use efficient database queries.

---

# 38. PERSISTENCE

IMPORTANT:

Refreshing the browser must NOT erase:

* Classes
* Students
* Current round
* Selection history

Persist all important data in PostgreSQL.

The teacher should be able to close the browser and return later.

---

# 39. GAME STATE RECOVERY

If the teacher starts a round and closes the browser after selecting 10 students:

When they return:

The active round should still exist.

Example:

الجولة الحالية

10 / 32

10 students already selected.

Continue from there.

---

# 40. DEMO DATA

Provide a seed script.

Create example classes:

"السنة الأولى إعدادي"
"السنة الثانية إعدادي"
"السنة الثالثة إعدادي"

Add Arabic student names.

Example:

محمد العلوي
سارة أحمد
يوسف بنعلي
مريم الإدريسي
عبد الرحمن محمد
فاطمة الزهراء
عمر حسن
آية خالد

This allows immediate testing.

---

# 41. PROJECT STRUCTURE

Create a clean architecture.

Example:

src/
app/
page.tsx
classes/
game/
settings/

components/
ui/
classes/
students/
game/
excel/

lib/
prisma.ts
excel.ts
random.ts
validation.ts

services/
classes/
students/
game/

hooks/

types/

prisma/
schema.prisma
seed.ts

public/
sounds/

Do not put everything inside one huge component.

---

# 42. COMPONENTS

Create reusable components such as:

ClassCard
ClassSelector
StudentList
StudentCard
ExcelUploader
ExcelPreview
ImportDialog
RandomPicker
RouletteAnimation
SelectedStudent
GameProgress
RoundHistory
ConfirmationDialog
FullscreenGame
SoundToggle
ThemeToggle

Keep components modular.

---

# 43. GAME COMPONENT ARCHITECTURE

The RandomPicker should receive:

students
selectedStudents
onSelection

The component should NOT own the database.

Separate:

UI state

from

database state.

Example conceptual flow:

Teacher clicks draw.

↓

Frontend requests/selects available student.

↓

Backend validates round.

↓

Backend selects a student.

↓

Backend records selection.

↓

Frontend starts/plays animation.

↓

Final student appears.

This prevents cheating or accidental duplicate selections.

---

# 44. SERVER-SIDE RANDOM SELECTION

Prefer server-side selection for persistent game sessions.

Pseudo-flow:

POST /api/rounds/:roundId/draw

Server:

1. Find round.
2. Find all students in class.
3. Find students already selected in round.
4. Calculate remaining students.
5. If zero:
   return ROUND_COMPLETED.
6. Randomly select one remaining student.
7. Create Selection.
8. Return selected student + progress.

Do not trust the frontend to tell the backend which student was selected.

---

# 45. API DESIGN

Create clean endpoints.

Examples:

GET /api/classes

POST /api/classes

GET /api/classes/:id

PATCH /api/classes/:id

DELETE /api/classes/:id

GET /api/classes/:id/students

POST /api/classes/:id/students

PATCH /api/students/:id

DELETE /api/students/:id

POST /api/classes/:id/import

GET /api/classes/:id/rounds

POST /api/classes/:id/rounds

GET /api/rounds/:id

POST /api/rounds/:id/draw

POST /api/rounds/:id/reset

Use proper HTTP status codes.

---

# 46. IMPORT API

Do not trust the uploaded file.

Server should:

1. Validate file type.
2. Validate file size.
3. Parse Excel.
4. Validate rows.
5. Normalize whitespace.
6. Detect duplicates.
7. Return preview.
8. Only save after confirmation.

If possible, separate:

POST /import/preview

and:

POST /import/confirm

This is safer and gives better UX.

---

# 47. GAME UX DETAILS

When no game is active:

Show:

اختر فصلًا للبدء

When class selected:

Show:

جاهز؟

السنة الأولى إعدادي

32 طالبًا

[🎲 ابدأ السحب]

During animation:

Disable button.

Show:

جارٍ الاختيار...

After selection:

🎉

مريم الإدريسي

حان دورك!

[🎲 الطالب التالي]

Also:

تم اختيار 1 من 32

---

# 48. PREVENT DOUBLE CLICKS

The draw button must be disabled while animation/API request is running.

Prevent:

* double click
* concurrent requests
* duplicate selection

Backend must also protect against concurrent requests.

---

# 49. RANDOM ANIMATION IMPLEMENTATION

Create a visual sequence from remaining students.

Do not expose the actual result before the animation ends.

For example:

The server returns the selected student.

The UI creates a temporary shuffled sequence using remaining names and animates through it.

At the end:

selected student

is displayed.

The visual animation is cosmetic.

The server result is authoritative.

---

# 50. CELEBRATION

When final student appears:

Use:

* scale-in
* glow
* confetti
* subtle sound

Example:

🎉🎉🎉

مريم الإدريسي

حان دورك!

Do not overload the screen.

---

# 51. CLASSROOM MODE

Add a dedicated classroom mode.

Button:

🎓 وضع القسم

In this mode:

* Hide management controls
* Show only class
* Progress
* Student picker
* Selected student
* Next button
* Fullscreen button

This is the mode the teacher will likely use with a projector.

---

# 52. IMPORTANT: DO NOT OVERENGINEER

Do NOT add:

* Chat
* AI chatbot
* Payments
* Social network
* Teacher marketplace
* Student accounts
* Complex authentication
* Notifications
* Unnecessary analytics

The application is specifically a:

Teacher → Class → Random Student Game

Keep it focused.

---

# 53. OPTIONAL FUTURE-READY ARCHITECTURE

Structure the code so future features could be added later:

* Teams
* Points
* Questions
* Rewards
* Multiple random modes
* Attendance
* More languages

But DO NOT implement these unless necessary.

---

# 54. RANDOM MODES

Implement the primary mode:

🎲 Random student

Optionally prepare architecture for future modes, but don't clutter the current UI.

---

# 55. README

Create a complete README containing:

1. Project description
2. Features
3. Tech stack
4. Requirements
5. Installation
6. Environment variables
7. Database setup
8. Prisma migration
9. Seed database
10. Start development server
11. Production build
12. Excel import format
13. Troubleshooting

Example commands:

npm install

npx prisma generate

npx prisma migrate dev

npm run seed

npm run dev

---

# 56. ENVIRONMENT VARIABLES

Create:

.env.example

Include only necessary variables.

Example:

DATABASE_URL="postgresql://..."

Never commit .env.

---

# 57. TESTING

Create tests for critical functionality.

Especially:

1. Creating class
2. Adding student
3. Importing Arabic Excel
4. Duplicate detection
5. Creating round
6. Random selection
7. No duplicate selection
8. Round completion
9. New round
10. Persistence

The random-selection logic must be tested thoroughly.

---

# 58. IMPORTANT EDGE CASES

Handle:

* Class with zero students
* Class with one student
* Two students with similar names
* Duplicate names
* Arabic names
* Very long Arabic names
* Empty Excel file
* Excel with wrong column
* Excel with empty rows
* User refreshing during game
* User opening game in multiple browser tabs
* Double-clicking draw
* Network failure during draw
* Database failure
* Completed round
* Deleted class
* Deleted student

If a student is deleted after participating in a historical round, preserve historical records safely or handle the relationship correctly.

---

# 59. MULTIPLE TABS

Try to avoid inconsistent game state if the same round is open in multiple tabs.

The backend must remain authoritative.

If a draw happens in another tab, the current tab should be able to refresh/synchronize its state.

Do not rely exclusively on localStorage.

---

# 60. LOCAL STORAGE

You may use localStorage for UI preferences such as:

* Theme
* Sound enabled
* Animation speed

Do NOT use localStorage as the primary database for:

* Classes
* Students
* Rounds
* Selections

Those belong in PostgreSQL.

---

# 61. FINAL UI QUALITY BAR

Before considering the project finished, verify:

✓ Arabic RTL works everywhere

✓ Arabic names render correctly

✓ Excel imports Arabic correctly

✓ Classes persist after refresh

✓ Students persist after refresh

✓ Random draw works

✓ Student cannot be selected twice in one round

✓ Progress is correct

✓ Round completion works

✓ New round works

✓ History works

✓ Fullscreen works

✓ Dark mode works

✓ Mobile layout works

✓ Projector layout works

✓ Animations are smooth

✓ No console errors

✓ No TypeScript errors

✓ No obvious UI bugs

✓ No unnecessary features

---

# 62. DEVELOPMENT PROCESS

Do not attempt to generate the entire project blindly in one step.

Work systematically:

PHASE 1:
Set up project and dependencies.

PHASE 2:
Create database schema and Prisma.

PHASE 3:
Implement class management.

PHASE 4:
Implement student management.

PHASE 5:
Implement Excel import and preview.

PHASE 6:
Implement rounds and random-selection backend.

PHASE 7:
Implement game UI.

PHASE 8:
Implement roulette animation.

PHASE 9:
Implement history.

PHASE 10:
Implement dark mode/fullscreen/sound.

PHASE 11:
Responsive and accessibility improvements.

PHASE 12:
Testing and bug fixing.

After each phase, verify that the existing functionality still works.

---

# 63. CODING RULES

Use TypeScript strictly.

Avoid:

any

unless absolutely necessary.

Use reusable components.

Use server-side validation.

Use Zod.

Use Prisma correctly.

Do not duplicate business logic between frontend and backend.

Keep API logic separate from UI.

Use meaningful variable names.

Use Arabic UI text.

Add comments only where they clarify non-obvious logic.

Do not create unnecessary abstractions.

---

# 64. DESIGN THE FIRST EXPERIENCE CAREFULLY

The teacher should be able to go from zero to playing in a few steps:

First visit:

مرحبا بك 👋

أنشئ فصلك أو استورد طلابك من Excel.

[+ إنشاء فصل]

[📥 استيراد Excel]

After creating/importing:

السنة الأولى إعدادي
32 طالبًا

[🎲 بدء اللعبة]

Then:

🎰

اضغط لبدء السحب

[🎲 سحب عشوائي]

Then:

🎉

مريم الإدريسي

حان دور مريم!

This flow should feel extremely simple.

---

# 65. FINAL REQUIREMENT

Build the application as if it will actually be used by a teacher in a real classroom.

Do not deliver a prototype that only looks good.

It must have:

* Real database persistence
* Real Excel import
* Real Arabic RTL
* Real random selection
* Real no-repeat protection
* Real round history
* Real error handling
* Real responsive UI
* Production-quality code

At the end:

1. Run the application.
2. Test all critical flows.
3. Fix errors.
4. Verify the database.
5. Verify Arabic Excel import.
6. Verify the random-selection logic.
7. Verify that no student is selected twice in a round.
8. Verify the UI on desktop and mobile.
9. Provide the final project structure.
10. Provide exact commands to run the project.

Do not stop after creating the UI.

The final result must be a fully functional application.
# ONLINE DEPLOYMENT, MULTI-USER ACCOUNTS, AND AUTHENTICATION

IMPORTANT: This application will be published online and used by multiple teachers.

Therefore, this is NOT a single local-user application.

The application must support secure teacher accounts.

Each teacher must have their own private account, classes, students, rounds, and selection history.

A teacher must NEVER be able to access another teacher's data.

---

# 1. AUTHENTICATION

Implement secure authentication.

Use:

* Next.js
* Auth.js
* Prisma
* PostgreSQL

Support:

## Email and Password

Pages:

/login
/register

Registration fields:

الاسم الكامل
البريد الإلكتروني
كلمة المرور
تأكيد كلمة المرور

Login fields:

البريد الإلكتروني
كلمة المرور

Buttons:

تسجيل الدخول
إنشاء حساب

Also provide:

نسيت كلمة المرور؟

Implement secure password hashing.

Never store plain-text passwords.

Use a strong password hashing solution such as Argon2 or bcrypt.

---

# 2. OPTIONAL SOCIAL LOGIN

Structure authentication so social login can easily be added.

Preferred future providers:

* Google
* Microsoft

If easy to implement cleanly, add Google login.

Example:

[ G متابعة باستخدام Google ]

However, email/password authentication must work independently.

Do not make Google authentication mandatory.

---

# 3. USER DATABASE MODEL

Add a User model.

Example:

User

* id
* name
* email
* passwordHash nullable when using OAuth
* emailVerified optional
* image optional
* createdAt
* updatedAt

Every class must belong to a user.

Update the Class model:

Class

* id
* userId
* name
* description optional
* createdAt
* updatedAt

Relationship:

User
↓
Many Classes
↓
Many Students

A teacher can only access classes where:

class.userId === authenticatedUser.id

This authorization rule must be enforced on the SERVER.

Do not rely only on hiding classes in the frontend.

---

# 4. UPDATED DATABASE RELATIONSHIPS

Use a structure similar to:

User
├── Class
│    ├── Student
│    └── Round
│         └── Selection
│
└── Account / Session
when required by the authentication provider

Every database query involving a class must verify ownership.

For example:

Before:

GET class by id

Instead:

GET class where:

id = requestedClassId
AND
userId = authenticatedUser.id

Apply this rule to:

* Read class
* Edit class
* Delete class
* Import students
* Read students
* Add student
* Edit student
* Delete student
* Start round
* Draw student
* Reset round
* View history

---

# 5. AUTHORIZATION

Implement route protection.

Protected routes:

/dashboard
/classes
/classes/[id]
/classes/[id]/students
/classes/[id]/game
/classes/[id]/history
/settings

If a user is not authenticated:

redirect to:

/login

If a user tries to access another teacher's class directly using a URL:

Example:

/classes/another-user-class-id

Return:

404

or:

ليس لديك صلاحية للوصول إلى هذا الفصل.

Do not leak sensitive information.

---

# 6. FIRST LOGIN EXPERIENCE

After registration, redirect the teacher to an onboarding/dashboard experience.

Show:

مرحبًا بك 👋

ابدأ بإنشاء أول فصل لك وإضافة طلابك.

[+ إنشاء فصل]

or:

[📥 استيراد من Excel]

The teacher should be able to start using the platform in less than two minutes.

Ideal flow:

إنشاء حساب

↓

تسجيل الدخول

↓

إنشاء فصل

↓

استيراد Excel

↓

مراجعة الطلاب

↓

بدء اللعبة

---

# 7. UPDATED DASHBOARD

The dashboard must show data belonging only to the authenticated teacher.

Example:

مرحبًا، أحمد 👋

إليك ملخص فصولك.

Statistics:

📚 4
عدد الفصول

👨‍🎓 128
إجمالي الطلاب

🎯 6
السحوبات اليوم

🏆 12
الجولات المكتملة

Then:

فصولي

Display only classes belonging to the current user.

---

# 8. EXCEL PRIVACY

Excel files may contain student names.

Treat this data as private.

Requirements:

* Process uploaded files securely.
* Validate file type.
* Validate file size.
* Do not make uploaded Excel files publicly accessible.
* Do not expose one teacher's imported data to another teacher.
* Do not store the original Excel file permanently unless explicitly needed.

Preferred workflow:

Upload Excel
↓
Parse securely
↓
Validate data
↓
Show preview
↓
Teacher confirms
↓
Store only student records in PostgreSQL
↓
Delete/discard temporary uploaded file

Do not create public URLs for student Excel files.

---

# 9. SECURITY REQUIREMENTS

This application stores teacher accounts and student names.

Therefore implement:

* Server-side authentication
* Server-side authorization
* Secure password hashing
* HTTP-only secure session cookies where applicable
* CSRF protection provided/configured appropriately by the authentication solution
* Input validation using Zod
* Rate limiting on sensitive authentication endpoints if supported by the deployment architecture
* Protection against brute-force login attempts
* Generic authentication error messages
* No plain-text passwords
* No secrets in frontend code
* No secrets committed to Git
* Environment variables for secrets
* Secure production cookies
* HTTPS in production

Validate every API request.

Never trust:

* userId sent from frontend
* classId without ownership validation
* student data from frontend
* Excel data
* selection result from frontend

The server is authoritative.

---

# 10. RANDOM DRAW SECURITY

The online application must preserve fair selection.

The frontend must NOT decide the final selected student.

Correct flow:

Teacher clicks:

سحب عشوائي

↓

Frontend sends request to server.

↓

Server gets authenticated user.

↓

Server verifies:

1. User owns the class.
2. Round belongs to the class.
3. Round is active.
4. No conflicting draw is currently being processed.

↓

Server finds remaining students.

↓

Server securely selects one random student.

↓

Server creates Selection record.

↓

Server returns selected student.

↓

Frontend plays roulette animation.

↓

Animation ends on the server-selected student.

The returned student is authoritative.

---

# 11. CONCURRENT REQUEST PROTECTION

Because the application is online, prevent race conditions.

Example problem:

Teacher opens the game in two tabs.

Both tabs click:

سحب عشوائي

at the same time.

The same student must NOT be selected twice.

Use a database transaction or appropriate concurrency-safe mechanism.

The database must enforce:

unique(roundId, studentId)

The backend should safely retry or return an appropriate error if a concurrent conflict occurs.

The database remains the source of truth.

---

# 12. USER SETTINGS

Each teacher should have their own preferences.

Create a UserSettings model or appropriate structure.

Store:

* theme
* soundEnabled
* animationSpeed
* preferredLanguage

Example:

UserSettings

* id
* userId unique
* theme
* soundEnabled
* animationSpeed
* locale
* updatedAt

Persist settings per user.

Do not share one teacher's preferences with another.

---

# 13. ACCOUNT PAGE

Create:

/settings/account

Show:

الحساب

الاسم
البريد الإلكتروني

[حفظ التغييرات]

Security section:

كلمة المرور

[تغيير كلمة المرور]

Danger zone:

حذف الحساب

Before deletion:

⚠️ حذف الحساب

سيتم حذف جميع فصولك وطلابك وسجل جولاتك نهائيًا.

Require strong confirmation.

For example:

Type:

حذف حسابي

before enabling final deletion.

Implement safe cascading deletion or a controlled transaction.

Do not accidentally leave orphan records.

---

# 14. PASSWORD RESET

Implement:

نسيت كلمة المرور؟

Flow:

Enter email.

↓

Generate a secure, time-limited reset token.

↓

Send reset email.

↓

Teacher clicks secure reset link.

↓

Create new password.

↓

Invalidate token.

Requirements:

* Tokens must expire.
* Tokens must be single-use.
* Never expose whether an email exists unnecessarily.
* Store reset tokens securely.

---

# 15. EMAIL

Create an abstraction for transactional emails.

Use an environment variable configuration.

Possible future provider:

* Resend
* another transactional email provider

Required emails:

* Password reset

Optional future emails:

* Welcome email
* Email verification

Do not hardcode a provider throughout the application.

Create a clean email service layer.

---

# 16. DEPLOYMENT ARCHITECTURE

Use:

Frontend + Application Server:
Next.js

Hosting:
Vercel

Database:
PostgreSQL

ORM:
Prisma

Authentication:
Auth.js

Deployment flow:

Developer
↓
GitHub Repository
↓
Push to main branch
↓
Vercel
↓
Automatic Build
↓
Production Deployment

Use environment variables in the deployment platform.

Never expose:

DATABASE_URL
AUTH_SECRET
OAuth secrets
Email API keys

to the client.

---

# 17. PRODUCTION ENVIRONMENT VARIABLES

Create a complete:

.env.example

Example variables:

DATABASE_URL=

AUTH_SECRET=

AUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

EMAIL_FROM=

EMAIL_API_KEY=

NEXT_PUBLIC_APP_URL=

Only expose variables prefixed with NEXT_PUBLIC_ when they are genuinely safe for browser exposure.

Document every variable in README.

---

# 18. PRISMA DEPLOYMENT

Configure production deployment correctly.

Ensure Prisma Client is generated during deployment.

Add an appropriate package script such as:

postinstall

to run Prisma generation.

Production database migrations must be documented and handled safely.

Development:

prisma migrate dev

Production:

prisma migrate deploy

Do not automatically use destructive database commands in production.

Never run commands that can silently erase production data.

---

# 19. VERCEL DEPLOYMENT

Prepare the project for Vercel deployment.

Requirements:

* Successful production build
* Correct environment variables
* Prisma Client generation
* Production database connection
* No local filesystem dependency for persistent data
* Uploaded Excel processing must work in serverless environment
* No reliance on SQLite or local files for production persistence

The application must be deployable directly from GitHub.

Include clear deployment instructions.

Expected deployment process:

1. Push project to GitHub.
2. Create Vercel project.
3. Connect GitHub repository.
4. Create/connect PostgreSQL database.
5. Add environment variables.
6. Run production migrations safely.
7. Deploy.
8. Test registration.
9. Test login.
10. Test class creation.
11. Test Arabic Excel import.
12. Test game.
13. Test logout.
14. Test another user account.
15. Verify users cannot access each other's classes.

---

# 20. CUSTOM DOMAIN READY

The application must support a future custom domain.

Do not hardcode:

localhost

or a specific Vercel URL throughout the application.

Use:

NEXT_PUBLIC_APP_URL

or request/URL-aware configuration where appropriate.

Authentication callbacks and reset links must work in both:

Development:
localhost

and:

Production:
custom domain

---

# 21. PRODUCTION DATABASE

Use managed PostgreSQL.

The database must persist independently from deployments.

A new deployment must NOT erase:

* Users
* Classes
* Students
* Rounds
* Selection history

Create indexes for important queries.

At minimum consider indexes on:

User.email

Class.userId

Student.classId

Round.classId

Selection.roundId

---

# 22. BACKUP AND DATA SAFETY

Document a backup strategy appropriate for the selected managed PostgreSQL provider.

Do not implement fake backup functionality.

Explain in README:

* Where production data is stored
* How backups are handled by the provider
* How to export data if needed

Provide an optional CSV/Excel export feature for a teacher's class roster.

---

# 23. PRIVACY

Because the application stores student names, privacy must be considered from the beginning.

Implement:

* Strict user data isolation
* Private database access
* No public student URLs
* No indexing of private class/student pages
* Proper authorization
* Account deletion capability
* Data export capability where practical

Add a basic privacy page.

Do not claim legal compliance unless the requirements have actually been implemented and reviewed.

---

# 24. ONLINE APPLICATION ROUTES

Public:

/
/login
/register
/forgot-password
/reset-password
/privacy

Protected:

/dashboard
/classes
/classes/[id]
/classes/[id]/students
/classes/[id]/game
/classes/[id]/history
/settings
/settings/account

Use middleware or the appropriate current Next.js authentication approach to protect routes.

Still verify authorization server-side inside data access and API operations.

Middleware alone is not sufficient for ownership checks.

---

# 25. LANDING PAGE

Because this application is public online, create a professional landing page.

Hero:

اختر طلابك بطريقة ممتعة وعادلة 🎯

أدر فصولك، استورد أسماء الطلاب من Excel، ودع السحب العشوائي يجعل المشاركة أكثر تفاعلًا.

Buttons:

ابدأ مجانًا

تسجيل الدخول

Features:

📊 استيراد من Excel

استورد أسماء طلابك بسهولة، حتى باللغة العربية.

🎲 سحب عشوائي

اختر طالبًا بطريقة عشوائية وممتعة.

🚫 بدون تكرار

لن يتم اختيار نفس الطالب مرتين في نفس الجولة.

📚 إدارة الفصول

احفظ جميع فصولك وطلابك في مكان واحد.

🖥️ مناسب للقسم

واجهة جميلة مناسبة للحاسوب والشاشة الكبيرة.

🔒 بياناتك خاصة

كل معلم يرى فقط فصوله وطلابه.

---

# 26. FUTURE BUSINESS MODEL

Do not implement payments now.

However, structure the application so a future plan system could be added.

Potential future plans:

Free:

* Limited number of classes

Pro:

* Unlimited classes
* Advanced statistics
* More game modes

Do not implement Stripe, subscriptions, or payments in version 1.

Focus on making the core application excellent.

---

# 27. UPDATED PROJECT STRUCTURE

Use a structure similar to:

src/
app/
(public)/
page.tsx
login/
register/
forgot-password/
reset-password/
privacy/

```
(dashboard)/
  dashboard/
  classes/
  settings/

api/
  auth/
  classes/
  students/
  rounds/
  import/
```

components/
auth/
landing/
dashboard/
classes/
students/
game/
excel/
settings/
ui/

lib/
prisma.ts
auth.ts
permissions.ts
validation.ts
random.ts
excel.ts

services/
auth/
classes/
students/
rounds/
email/

hooks/
types/

prisma/
schema.prisma
migrations/
seed.ts

Keep authorization logic reusable and centralized.

---

# 28. FINAL ONLINE PRODUCTION CHECKLIST

Before declaring the project finished, verify all of the following:

AUTHENTICATION:

✓ User can register.
✓ User can log in.
✓ Password is hashed.
✓ User can log out.
✓ Password reset works.
✓ Protected routes cannot be accessed anonymously.

DATA ISOLATION:

✓ User A creates a class.
✓ User B cannot see it.
✓ User B cannot access it by manually changing the URL.
✓ User B cannot access its students.
✓ User B cannot manipulate its rounds through an API request.

EXCEL:

✓ Arabic Excel imports correctly.
✓ Data remains private.
✓ Invalid files are rejected.
✓ Duplicate students are handled.
✓ Large reasonable files work.

GAME:

✓ Random draw works.
✓ Server chooses the student.
✓ Same student cannot be selected twice in a round.
✓ Concurrent requests do not create duplicate selections.
✓ Refresh does not lose the active round.
✓ All students can eventually be selected.
✓ New round works.

DEPLOYMENT:

✓ Production build succeeds.
✓ Database works online.
✓ Environment variables are configured.
✓ Prisma Client is generated.
✓ Production migrations are applied safely.
✓ Application works after a new deployment.
✓ No production secrets are exposed.

UI:

✓ Full Arabic RTL.
✓ Desktop responsive.
✓ Mobile responsive.
✓ Dark mode works.
✓ Projector/fullscreen mode works.
✓ No console errors.
✓ No TypeScript errors.

The final result must be a real deployable multi-user web application, not a local prototype.
