"use client";

import { useState, useEffect } from "react";

export type Language = "ar" | "fr";

export interface Translations {
  // Brand & General
  portalTitle: string;
  portalSubtitle: string;
  direction: "rtl" | "ltr";
  langToggleLabel: string;
  themeToggleDark: string;
  themeToggleLight: string;
  soundEnabled: string;
  soundDisabled: string;
  loading: string;
  save: string;
  cancel: string;
  close: string;
  delete: string;
  edit: string;
  confirm: string;
  back: string;

  // Nav
  dashboard: string;
  classes: string;
  settings: string;
  logout: string;
  login: string;
  register: string;
  newClass: string;

  // Draw / Game Screen
  drawTitle: string;
  drawSubtitle: string;
  roundNumber: string;
  readyToDraw: string;
  spinning: string;
  selectedStudentLabel: string;
  recordedNotice: string;
  startDrawBtn: string;
  drawNextBtn: string;
  allCompletedBtn: string;
  speedFast: string;
  speedNormal: string;
  speedSlow: string;
  resetRoundBtn: string;
  fullscreenEnter: string;
  fullscreenExit: string;
  backToClass: string;
  progressRate: string;
  waitingCount: string;
  participatedCount: string;
  waitingListTitle: string;
  participatedListTitle: string;
  noStudentsWaiting: string;
  noStudentsParticipated: string;
  resetSuccessMessage: string;
  resetModalTitle: string;
  resetModalDesc: string;
  confirmResetBtn: string;
  roundCompletedTitle: string;
  roundCompletedDesc: string;
  startNextRoundBtn: string;
  studentsRegisteredLabel: string;
  drawErrorMessage: string;
  resetErrorMessage: string;

  // Dashboard
  welcomeTeacher: string;
  teacherSpaceDesc: string;
  statsClasses: string;
  statsStudents: string;
  statsRounds: string;
  statsClassesSubtitle: string;
  statsStudentsSubtitle: string;
  statsRoundsSubtitle: string;
  classesDirectoryTitle: string;
  classesDirectoryDesc: string;
  viewAll: string;
  noClassesYet: string;
  noClassesDesc: string;
  addClassNow: string;

  // Class Card & Detail
  classCardBadge: string;
  roundStatusActive: string;
  roundStatusCompleted: string;
  noRoundsYet: string;
  studentCountLabel: string;
  enterDrawSession: string;
  manageRoster: string;
  deleteClass: string;
  confirmDeleteClassTitle: string;
  confirmDeleteClassDesc: string;
  importExcelBtn: string;
  addStudentBtn: string;
  historyBtn: string;
  officialRosterTitle: string;
  rosterSubtitle: string;
  searchStudentPlaceholder: string;
  colIndex: string;
  colStudentName: string;
  colParticipationCount: string;
  colEnrollmentDate: string;
  colActions: string;
  timesCount: string;
  noStudentsFound: string;
  emptyRosterNotice: string;
  lastUpdatedLabel: string;
  editStudentNameTitle: string;
  deleteStudentConfirmTitle: string;
  deleteStudentConfirmPrompt: (name: string) => string;

  // Modals
  addClassModalTitle: string;
  addClassModalDesc: string;
  classNameLabel: string;
  classNamePlaceholder: string;
  classDescLabel: string;
  classDescPlaceholder: string;
  saveClassBtn: string;
  savingClassBtn: string;
  enterClassNameError: string;
  createClassError: string;

  addStudentModalTitle: string;
  addStudentModalDesc: string;
  studentNameLabel: string;
  studentNamePlaceholder: string;
  saveStudentBtn: string;
  savingStudentBtn: string;
  enterStudentNameError: string;
  addStudentError: string;

  importModalTitle: string;
  importModalDesc: (className: string) => string;
  importSelectFile: string;
  importSelectFileDesc: string;
  importSelectFileBtn: string;
  importAnalyzing: string;
  detectedColLabel: string;
  totalRowsLabel: string;
  validStudentsLabel: string;
  duplicatesNotice: (count: number) => string;
  previewRosterTitle: (count: number) => string;
  confirmImportBtn: (count: number) => string;
  confirmImportingBtn: string;
  chooseAnotherFile: string;
  currentSheetLabel: string;
  importParseError: string;
  importSaveError: string;

  // History Page
  historyTitle: string;
  historySubtitle: string;
  noHistoryYet: string;
  roundOrderCol: string;
  roundStudentCol: string;
  roundTimestampCol: string;
  showDetails: string;
  hideDetails: string;
  roundPrefix: (num: number) => string;
  selectedCountBadge: (count: number) => string;
  startedAtLabel: string;
  noSelectionsYetInRound: string;
  historyBreadcrumb: string;

  // Home / Landing Page
  homeBadge: string;
  homeHeroTitle: string;
  homeHeroDesc: string;
  homeEnterWorkspace: string;
  homeCreateAccount: string;
  homeStandardsTitle: string;
  standard1Badge: string;
  standard1Title: string;
  standard1Desc: string;
  standard2Badge: string;
  standard2Title: string;
  standard2Desc: string;
  standard3Badge: string;
  standard3Title: string;
  standard3Desc: string;
  standard4Badge: string;
  standard4Title: string;
  standard4Desc: string;
  homePrivacyLink: string;
  homeFooterText: string;

  // Login & Register & Forgot Password
  loginTitle: string;
  loginSubtitle: string;
  loginEmailLabel: string;
  loginPasswordLabel: string;
  forgotPasswordLink: string;
  loginSubmitBtn: string;
  loginChecking: string;
  noAccountText: string;
  createNewTeacherAccount: string;
  loginErrorDefault: string;

  registerTitle: string;
  registerSubtitle: string;
  registerNameLabel: string;
  registerNamePlaceholder: string;
  registerEmailLabel: string;
  registerPasswordLabel: string;
  registerConfirmPasswordLabel: string;
  registerSubmitBtn: string;
  registeringText: string;
  hasAccountText: string;
  passwordMismatchError: string;
  registerErrorDefault: string;

  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  forgotPasswordSubmitBtn: string;
  forgotPasswordSending: string;
  forgotPasswordSuccess: string;
  backToLoginBtn: string;

  // Settings Page
  settingsTitle: string;
  settingsSubtitle: string;
  settingsSec1Title: string;
  settingsThemeLabel: string;
  themeLightText: string;
  themeDarkText: string;
  themeSystemText: string;
  settingsSoundLabel: string;
  soundEnableBtn: string;
  soundMuteBtn: string;
  settingsSpeedLabel: string;
  speedFastOption: string;
  speedNormalOption: string;
  speedSlowOption: string;
  settingsSec2Title: string;
  settingsProfileSuccess: string;
  settingsNameLabel: string;
  settingsEmailLabel: string;
  settingsEmailSecurityNotice: string;
  settingsPasswordSectionLabel: string;
  settingsCurrentPasswordPlaceholder: string;
  settingsNewPasswordPlaceholder: string;
  settingsSaveBtn: string;
  settingsSavingBtn: string;
  settingsSec3Title: string;
  settingsDangerDesc: string;
  settingsDeletePrompt: string;
  settingsDeleteRequiredPhrase: string;
  settingsDeletePlaceholder: string;
  settingsDeleteBtn: string;
  settingsDeletingBtn: string;
  settingsDeleteMismatchError: string;

  // Game Page
  gameLoadingNotice: string;
  noStudentsGameTitle: string;
  noStudentsGameDesc: string;
  goToClassRosterBtn: string;
  backToDashboardBtn: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    portalTitle: "المنظومة الأكاديمية",
    portalSubtitle: "بوابة تقويم واختيار المتعلمين",
    direction: "rtl",
    langToggleLabel: "Français",
    themeToggleDark: "المظهر: ليلي",
    themeToggleLight: "المظهر: نهاري",
    soundEnabled: "الصوت: مفعّل",
    soundDisabled: "الصوت: معطّل",
    loading: "جارٍ التحميل...",
    save: "حفظ",
    cancel: "إلغاء",
    close: "إغلاق",
    delete: "حذف",
    edit: "تعديل",
    confirm: "تأكيد",
    back: "رجوع",

    dashboard: "لوحة المتابعة",
    classes: "سجل الفصول",
    settings: "إعدادات الحساب",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    register: "إنشاء حساب أستاذ",
    newClass: "إضافة فصل جديد",

    drawTitle: "منظومة السحب الأكاديمي والتقويم الصفي",
    drawSubtitle: "خوارزمية محايدة متوافقة مع المعايير البيداغوجية",
    roundNumber: "الجولة رقم",
    readyToDraw: "جاهز لإجراء السحب",
    spinning: "جارٍ تنفيذ عملية السحب العشوائي...",
    selectedStudentLabel: "المتعلم المحدد للمشاركة والتقويم",
    recordedNotice: "تم التوثيق في سجل الجولة الحالية بنجاح",
    startDrawBtn: "بدء السحب الأكاديمي",
    drawNextBtn: "سحب المتعلم التالي",
    allCompletedBtn: "اكتملت مشاركة جميع التلاميذ",
    speedFast: "سريع",
    speedNormal: "عادي",
    speedSlow: "متأنٍ",
    resetRoundBtn: "إعادة تعيين الجولة",
    fullscreenEnter: "وضع ملء الشاشة",
    fullscreenExit: "إنهاء ملء الشاشة",
    backToClass: "العودة للائحة الفصل",
    progressRate: "نسبة التقدم",
    waitingCount: "في الانتظار",
    participatedCount: "تمت مشاركتهم",
    waitingListTitle: "لائحة الانتظار في هذه الجولة",
    participatedListTitle: "المتعلمون الذين تمت مشاركتهم",
    noStudentsWaiting: "تمت مشاركة جميع متعلمي الفصل في هذه الجولة.",
    noStudentsParticipated: "لم يتم اختيار أي تلميذ في هذه الجولة بعد.",
    resetSuccessMessage: "تمت إعادة تعيين الجولة ومسح السجل بنجاح. جميع التلاميذ متاحون الآن للسحب.",
    resetModalTitle: "تأكيد إعادة تعيين الجولة ومسح السجل",
    resetModalDesc: "سيؤدي هذا الإجراء إلى مسح سجل اختيارات هذه الجولة فوراً وإعادة إتاحة جميع تلاميذ الفصل للسحب من جديد.",
    confirmResetBtn: "مسح السجل وإعادة التعيين فوراً",
    roundCompletedTitle: "اكتملت الجولة التقويمية",
    roundCompletedDesc: "شارك جميع تلاميذ الفصل بنجاح وبنسبة تكافؤ 100%. يمكنك الآن بدء جولة جديدة لإعادة فتح السحب.",
    startNextRoundBtn: "بدء الجولة التالية",
    studentsRegisteredLabel: "تلميذ مسجل في هذا الفصل",
    drawErrorMessage: "حدث خطأ أثناء السحب",
    resetErrorMessage: "تعذر إعادة تعيين الجولة",

    welcomeTeacher: "مرحباً",
    teacherSpaceDesc: "إدارة الفصول الدراسية وتدبير لوائح المتعلمين وحصص السحب والتقويم",
    statsClasses: "عدد الفصول المسجلة",
    statsStudents: "إجمالي التلاميذ المسجلين",
    statsRounds: "جولات السحب المنفذة",
    statsClassesSubtitle: "فصول وأفواج نشطة",
    statsStudentsSubtitle: "متعلم مدرج ضمن اللوائح",
    statsRoundsSubtitle: "جلسات تقويم موثقة بالسجل",
    classesDirectoryTitle: "سجل الفصول الدراسية",
    classesDirectoryDesc: "اختر فصلاً لبدء جلسة السحب أو تعديل لائحة الأسماء",
    viewAll: "عرض الكل",
    noClassesYet: "لا توجد فصول دراسية مسجلة حالياً",
    noClassesDesc: "ابدأ بإضافة أول فصل دراسي ثم استورد لائحة تلاميذه من ملف Excel.",
    addClassNow: "إضافة فصل دراسي الآن",

    classCardBadge: "فصل دراسي",
    roundStatusActive: "قيد التنفيذ",
    roundStatusCompleted: "مكتملة",
    noRoundsYet: "لم تبدأ جولات بعد",
    studentCountLabel: "تعداد التلاميذ",
    enterDrawSession: "دخول جلسة السحب",
    manageRoster: "إدارة اللائحة",
    deleteClass: "حذف الفوج",
    confirmDeleteClassTitle: "تأكيد حذف الفصل الدراسي",
    confirmDeleteClassDesc: "هل أنت متأكد من رغبتك في حذف هذا الفصل وكافة تلاميذه وسجلاته؟",
    importExcelBtn: "استيراد من Excel",
    addStudentBtn: "إضافة تلميذ",
    historyBtn: "سجل الجولات",
    officialRosterTitle: "لائحة المتعلمين الرسمية",
    rosterSubtitle: "الترتيب الزمني لإدراج التلاميذ في الفصل",
    searchStudentPlaceholder: "بحث عن تلميذ بالاسم...",
    colIndex: "#",
    colStudentName: "الاسم الكامل للمتعلم",
    colParticipationCount: "مرات الاختيار",
    colEnrollmentDate: "تاريخ الإدراج",
    colActions: "الإجراءات",
    timesCount: "مرات",
    noStudentsFound: "لا يوجد تلاميذ يطابقون عبارة البحث.",
    emptyRosterNotice: "اللائحة فارغة حالياً. يمكنك استيراد الأسماء من ملف Excel أو إضافة التلاميذ يدوياً.",
    lastUpdatedLabel: "آخر تحديث",
    editStudentNameTitle: "تعديل الاسم",
    deleteStudentConfirmTitle: "تأكيد حذف التلميذ",
    deleteStudentConfirmPrompt: (name: string) => `هل أنت متأكد من رغبتك في حذف التلميذ "${name}" من لائحة هذا الفصل؟`,

    addClassModalTitle: "إضافة فصل دراسي جديد",
    addClassModalDesc: "تسجيل فصل أو فوج تربوي لإدارة لائحته وإجراء السحب الصفي",
    classNameLabel: "اسم الفصل / الفوج",
    classNamePlaceholder: "مثال: الأولى إعدادي - الفوج 1",
    classDescLabel: "وصف أو ملاحظات (اختياري)",
    classDescPlaceholder: "المادة الدراسية، رقم القاعة، أو الشعبة...",
    saveClassBtn: "حفظ الفصل الدراسي",
    savingClassBtn: "جارٍ الحفظ...",
    enterClassNameError: "يرجى إدخال اسم الفصل الدراسي",
    createClassError: "حدث خطأ أثناء إنشاء الفصل",

    addStudentModalTitle: "إضافة تلميذ جديد للائحة",
    addStudentModalDesc: "إدراج اسم المتعلم يدوياً ضمن لائحة هذا الفصل",
    studentNameLabel: "الاسم الكامل للتلميذ",
    studentNamePlaceholder: "مثال: يوسف بنعلي",
    saveStudentBtn: "إضافة التلميذ",
    savingStudentBtn: "جارٍ الحفظ...",
    enterStudentNameError: "يرجى إدخال اسم المتعلم",
    addStudentError: "حدث خطأ أثناء إضافة التلميذ",

    importModalTitle: "استيراد لائحة التلاميذ من ملف Excel",
    importModalDesc: (className: string) => `فصل: ${className} — صيغ مقبولة (.xlsx, .xls) بالعربية والفرنسية`,
    importSelectFile: "اختر ملف لائحة الفصل الدراسي",
    importSelectFileDesc: "يتعرف النظام تلقائياً على أعمدة الأسماء بالعربية أو الفرنسية (Nom, Prénom, Élève, اسم التلميذ...)",
    importSelectFileBtn: "تحديد ملف من الجهاز",
    importAnalyzing: "جارٍ فحص وتحليل الملف...",
    detectedColLabel: "العمود المكتشف",
    totalRowsLabel: "إجمالي الصفوف",
    validStudentsLabel: "أسماء مؤكدة للإدراج",
    duplicatesNotice: (count: number) => `تم رصد ${count} اسماً متكرراً في الملف، وسيتم إدراج كل اسم مرة واحدة فقط تلقائياً.`,
    previewRosterTitle: (count: number) => `معاينة أسماء التلاميذ المستخرجة (${count} تلميذ)`,
    confirmImportBtn: (count: number) => `تأكيد استيراد ${count} تلميذ`,
    confirmImportingBtn: "جارٍ إدراج اللائحة...",
    chooseAnotherFile: "اختيار ملف آخر",
    currentSheetLabel: "ورقة العمل الحالية:",
    importParseError: "تعذر تحليل ملف Excel",
    importSaveError: "حدث خطأ أثناء حفظ الأسماء",

    historyTitle: "سجل جولات السحب والتقويم",
    historySubtitle: "محضر زمني موثق لترتيب اختيار التلاميذ لضمان النزاهة والشفافية التامة داخل القسم",
    noHistoryYet: "لم يتم إجراء أي جولات سحب في هذا الفصل بعد.",
    roundOrderCol: "الترتيب",
    roundStudentCol: "اسم المتعلم",
    roundTimestampCol: "التاريخ والتوقيت",
    showDetails: "[عرض التفاصيل]",
    hideDetails: "[إخفاء التفاصيل]",
    roundPrefix: (num: number) => `الجولة التقويمية رقم ${num}`,
    selectedCountBadge: (count: number) => `${count} متعلم مختار`,
    startedAtLabel: "تاريخ البدء",
    noSelectionsYetInRound: "لم يتم سحب أي تلميذ في هذه الجولة بعد.",
    historyBreadcrumb: "سجل الجولات الموثقة",

    homeBadge: "فضاء التدريس والتقويم الصفي المعتمد",
    homeHeroTitle: "إدارة لوائح الأقسام والسحب الأكاديمي المحايد",
    homeHeroDesc: "منظومة عمل متكاملة مخصصة للمدرسين والأطر التربوية لتدبير لوائح الفصول الدراسية، واستيراد لوائح التلاميذ المعتمدة من ملفات Excel، وتنظيم حصص المشاركة والتقويم الشفهي بواسطة آلية اختيار عادلة وشفافة تضمن تكافؤ الفرص التام بين جميع المتعلمين داخل القاعة الدراسية.",
    homeEnterWorkspace: "الدخول إلى فضاء العمل",
    homeCreateAccount: "فتح حساب أستاذ جديد",
    homeStandardsTitle: "المعايير والضوابط البيداغوجية للمنظومة",
    standard1Badge: "المعيار الأول",
    standard1Title: "استيراد مباشر للوائح الرسمية",
    standard1Desc: "معالجة مباشرة لملفات جداول البيانات بصيغ .xlsx مع استخراج آلي لأسماء التلاميذ بالعربية والفرنسية، والتحقق التلقائي من عدم وجود أسماء متكررة.",
    standard2Badge: "المعيار الثاني",
    standard2Title: "حياد وعدالة خوارزمية الاختيار",
    standard2Desc: "اعتماد خوارزمية سحب عشوائي غير منحازة على مستوى الخادم لضمان النزاهة المطلقة، دون أي تدخل يدوي أو تفضيل تلميذ على آخر.",
    standard3Badge: "المعيار الثالث",
    standard3Title: "توثيق فوري لمحاضر المشاركة",
    standard3Desc: "تسجيل كل عملية سحب بالثانية والتاريخ ضمن سجل الفصل لتمكين الأستاذ من مراجعة الحصص وتتبع التكافؤ التام بين المتعلمين.",
    standard4Badge: "المعيار الرابع",
    standard4Title: "حفظ خصوصية وسرية المعطيات",
    standard4Desc: "حماية تامة لمعطيات التلاميذ وأسمائهم مع عزل كامل لحسابات الأساتذة لضمان الخصوصية المهنية والأمان السيبراني.",
    homePrivacyLink: "ميثاق خصوصية وأمان بيانات المتعلمين",
    homeFooterText: "المنظومة الأكاديمية لاختيار وتقويم المتعلمين — البوابة المهنية للمدرسين",

    loginTitle: "تسجيل دخول الأستاذ",
    loginSubtitle: "الولوج إلى فضاء إدارة الفصول وجلسات السحب والتقويم",
    loginEmailLabel: "البريد الإلكتروني المهني",
    loginPasswordLabel: "كلمة المرور",
    forgotPasswordLink: "نسيت كلمة المرور؟",
    loginSubmitBtn: "تسجيل الدخول",
    loginChecking: "جارٍ التحقق من الهوية...",
    noAccountText: "لا تملك حساب أستاذ حتى الآن؟",
    createNewTeacherAccount: "إنشاء حساب أستاذ جديد",
    loginErrorDefault: "تعذر تسجيل الدخول",

    registerTitle: "إنشاء حساب أستاذ جديد",
    registerSubtitle: "تسجيل حساب مهني لإدارة الفصول وجلسات السحب والتقويم",
    registerNameLabel: "الاسم الكامل (الصفة والاسم)",
    registerNamePlaceholder: "مثال: ذ. عبد الله المنصوري",
    registerEmailLabel: "البريد الإلكتروني المهني",
    registerPasswordLabel: "كلمة المرور",
    registerConfirmPasswordLabel: "تأكيد كلمة المرور",
    registerSubmitBtn: "تأكيد تسجيل الحساب",
    registeringText: "جارٍ تسجيل الحساب...",
    hasAccountText: "لديك حساب أستاذ بالفعل؟",
    passwordMismatchError: "كلمتا المرور غير متطابقتين",
    registerErrorDefault: "تعذر إنشاء الحساب",

    forgotPasswordTitle: "استعادة كلمة المرور",
    forgotPasswordSubtitle: "أدخل بريدك الإلكتروني المهني لاستلام رابط إعادة التعيين",
    forgotPasswordSubmitBtn: "إرسال رابط الاستعادة",
    forgotPasswordSending: "جارٍ إرسال الطلب...",
    forgotPasswordSuccess: "تم تسجيل طلب استعادة كلمة المرور. إذا كان البريد الإلكتروني مسجلاً في المنظومة، ستصلك تعليمات إعادة التعيين.",
    backToLoginBtn: "العودة لصفحة تسجيل الدخول",

    settingsTitle: "إعدادات المنظومة والحساب",
    settingsSubtitle: "تخصيص سلوك السحب، المظهر الأكاديمي، وتحديث البيانات المهنية",
    settingsSec1Title: "1. تفضيلات العرض والسحب الصفي",
    settingsThemeLabel: "المظهر العام للواجهة",
    themeLightText: "نهاري (فاتح)",
    themeDarkText: "ليلي (داكن)",
    themeSystemText: "حسب النظام",
    settingsSoundLabel: "التنبيهات الصوتية المصاحبة للسحب",
    soundEnableBtn: "تفعيل التنبيهات",
    soundMuteBtn: "كتم التنبيهات",
    settingsSpeedLabel: "وتيرة وديناميكية السحب",
    speedFastOption: "سريع",
    speedNormalOption: "عادي (موصى به)",
    speedSlowOption: "متأنٍ",
    settingsSec2Title: "2. البيانات الشخصية للأستاذ",
    settingsProfileSuccess: "تم تحديث بيانات الحساب بنجاح",
    settingsNameLabel: "الاسم الكامل",
    settingsEmailLabel: "البريد الإلكتروني المهني",
    settingsEmailSecurityNotice: "البريد الإلكتروني لا يمكن تعديله لأسباب أمنية",
    settingsPasswordSectionLabel: "تغيير كلمة المرور (اختياري)",
    settingsCurrentPasswordPlaceholder: "كلمة المرور الحالية",
    settingsNewPasswordPlaceholder: "كلمة المرور الجديدة",
    settingsSaveBtn: "حفظ التعديلات",
    settingsSavingBtn: "جارٍ الحفظ...",
    settingsSec3Title: "3. منطقة الحذف النهائي للحساب",
    settingsDangerDesc: "حذف الحساب بشكل دائم مع مسح كافة الفصول واللوائح وسجلات الجولات",
    settingsDeletePrompt: "لتأكيد الحذف النهائي، يرجى كتابة العبارة التالية في الحقل أدناه:",
    settingsDeleteRequiredPhrase: "حذف حسابي نهائيا",
    settingsDeletePlaceholder: "اكتب العبارة للتأكيد...",
    settingsDeleteBtn: "تأكيد حذف الحساب وجميع البيانات",
    settingsDeletingBtn: "جارٍ حذف الحساب...",
    settingsDeleteMismatchError: "يرجى كتابة العبارة المطلوبة للتأكيد بدقة",

    gameLoadingNotice: "جارٍ تحضير جلسة السحب الأكاديمي...",
    noStudentsGameTitle: "لا يوجد تلاميذ مسجلون في هذا الفصل",
    noStudentsGameDesc: "يرجى إضافة تلاميذ أو استيراد اللائحة من ملف Excel لتتمكن من إجراء السحب الصفي.",
    goToClassRosterBtn: "الانتقال لصفحة إدارة لائحة الفصل",
    backToDashboardBtn: "العودة للوحة المتابعة",
  },
  fr: {
    portalTitle: "Plateforme Académique",
    portalSubtitle: "Évaluation & Tirage au Sort des Élèves",
    direction: "ltr",
    langToggleLabel: "العربية",
    themeToggleDark: "Thème : Sombre",
    themeToggleLight: "Thème : Clair",
    soundEnabled: "Son : Activé",
    soundDisabled: "Son : Désactivé",
    loading: "Chargement en cours...",
    save: "Enregistrer",
    cancel: "Annuler",
    close: "Fermer",
    delete: "Supprimer",
    edit: "Modifier",
    confirm: "Confirmer",
    back: "Retour",

    dashboard: "Tableau de bord",
    classes: "Mes Classes",
    settings: "Paramètres",
    logout: "Déconnexion",
    login: "Connexion",
    register: "Créer un compte enseignant",
    newClass: "Nouvelle classe",

    drawTitle: "Session de Tirage Académique & Évaluation",
    drawSubtitle: "Algorithme impartial conforme aux exigences pédagogiques",
    roundNumber: "Tour N°",
    readyToDraw: "Prêt pour le tirage",
    spinning: "Tirage au sort impartial en cours...",
    selectedStudentLabel: "Élève sélectionné(e) pour participer :",
    recordedNotice: "Enregistré avec succès dans l'historique du tour",
    startDrawBtn: "Lancer le tirage au sort",
    drawNextBtn: "Tirer l'élève suivant",
    allCompletedBtn: "Tous les élèves ont participé",
    speedFast: "Rapide",
    speedNormal: "Normal",
    speedSlow: "Posé",
    resetRoundBtn: "Réinitialiser le tour",
    fullscreenEnter: "Mode Plein écran",
    fullscreenExit: "Quitter Plein écran",
    backToClass: "Retour à la classe",
    progressRate: "Progression",
    waitingCount: "En attente",
    participatedCount: "Déjà passés",
    waitingListTitle: "Liste d'attente pour ce tour",
    participatedListTitle: "Élèves ayant déjà participé",
    noStudentsWaiting: "Tous les élèves de la classe ont participé à ce tour.",
    noStudentsParticipated: "Aucun élève n'a encore été tiré au sort dans ce tour.",
    resetSuccessMessage: "Le tour et l'historique ont été réinitialisés avec succès. Tous les élèves sont disponibles.",
    resetModalTitle: "Confirmation de réinitialisation du tour",
    resetModalDesc: "Cette action effacera immédiatement l'historique des sélections de ce tour et remettra tous les élèves de la classe en attente.",
    confirmResetBtn: "Effacer l'historique et réinitialiser immédiatement",
    roundCompletedTitle: "Tour d'évaluation terminé",
    roundCompletedDesc: "Tous les élèves ont participé avec équité (100%). Vous pouvez lancer un nouveau tour pour rouvrir les passages.",
    startNextRoundBtn: "Démarrer le tour suivant",
    studentsRegisteredLabel: "élèves enregistrés dans cette classe",
    drawErrorMessage: "Erreur lors du tirage au sort",
    resetErrorMessage: "Impossible de réinitialiser le tour",

    welcomeTeacher: "Bienvenue",
    teacherSpaceDesc: "Gestion des classes, des listes d'élèves et des séances d'évaluation",
    statsClasses: "Classes enregistrées",
    statsStudents: "Total des élèves",
    statsRounds: "Tours effectués",
    statsClassesSubtitle: "Classes et groupes actifs",
    statsStudentsSubtitle: "Élèves inscrits dans les listes",
    statsRoundsSubtitle: "Sessions consignées dans l'historique",
    classesDirectoryTitle: "Répertoire des classes",
    classesDirectoryDesc: "Sélectionnez une classe pour lancer le tirage ou gérer les élèves",
    viewAll: "Voir tout",
    noClassesYet: "Aucune classe enregistrée pour le moment",
    noClassesDesc: "Commencez par ajouter une classe puis importez votre liste d'élèves depuis Excel.",
    addClassNow: "Ajouter une classe maintenant",

    classCardBadge: "Classe",
    roundStatusActive: "En cours",
    roundStatusCompleted: "Terminé",
    noRoundsYet: "Aucun tour démarré",
    studentCountLabel: "Effectif",
    enterDrawSession: "Accéder au tirage",
    manageRoster: "Gérer la liste",
    deleteClass: "Supprimer la classe",
    confirmDeleteClassTitle: "Supprimer la classe",
    confirmDeleteClassDesc: "Êtes-vous sûr de vouloir supprimer cette classe ainsi que tous ses élèves et historiques ?",
    importExcelBtn: "Importer Excel",
    addStudentBtn: "Ajouter un élève",
    historyBtn: "Historique des tours",
    officialRosterTitle: "Liste officielle des élèves",
    rosterSubtitle: "Ordre d'enregistrement chronologique des élèves",
    searchStudentPlaceholder: "Rechercher un élève par nom...",
    colIndex: "N°",
    colStudentName: "Nom et Prénom de l'élève",
    colParticipationCount: "Passages",
    colEnrollmentDate: "Date d'ajout",
    colActions: "Actions",
    timesCount: "fois",
    noStudentsFound: "Aucun élève ne correspond à votre recherche.",
    emptyRosterNotice: "La liste est vide. Vous pouvez importer un fichier Excel ou ajouter les élèves manuellement.",
    lastUpdatedLabel: "Dernière mise à jour",
    editStudentNameTitle: "Modifier le nom",
    deleteStudentConfirmTitle: "Supprimer l'élève",
    deleteStudentConfirmPrompt: (name: string) => `Êtes-vous sûr de vouloir supprimer l'élève "${name}" de cette classe ?`,

    addClassModalTitle: "Ajouter une nouvelle classe",
    addClassModalDesc: "Enregistrer une classe ou un groupe d'élèves pour gérer le tirage",
    classNameLabel: "Nom de la classe / Groupe",
    classNamePlaceholder: "Ex: 3ème B - Groupe 1",
    classDescLabel: "Description ou notes (optionnel)",
    classDescPlaceholder: "Matière, salle de cours, niveau...",
    saveClassBtn: "Enregistrer la classe",
    savingClassBtn: "Enregistrement en cours...",
    enterClassNameError: "Veuillez saisir le nom de la classe",
    createClassError: "Une erreur est survenue lors de la création de la classe",

    addStudentModalTitle: "Ajouter un élève",
    addStudentModalDesc: "Inscrire manuellement un élève dans la liste de cette classe",
    studentNameLabel: "Nom et Prénom de l'élève",
    studentNamePlaceholder: "Ex: Martin Thomas",
    saveStudentBtn: "Ajouter l'élève",
    savingStudentBtn: "Enregistrement en cours...",
    enterStudentNameError: "Veuillez saisir le nom de l'élève",
    addStudentError: "Une erreur est survenue lors de l'ajout de l'élève",

    importModalTitle: "Importer les élèves depuis un fichier Excel",
    importModalDesc: (className: string) => `Classe : ${className} — Formats acceptés (.xlsx, .xls) en français ou arabe`,
    importSelectFile: "Sélectionnez le fichier de la classe",
    importSelectFileDesc: "Le système détecte automatiquement les colonnes en français ou arabe (Nom, Prénom, Élève, Nom complet...)",
    importSelectFileBtn: "Choisir un fichier sur l'appareil",
    importAnalyzing: "Analyse et traitement du fichier en cours...",
    detectedColLabel: "Colonne détectée",
    totalRowsLabel: "Total des lignes",
    validStudentsLabel: "Élèves validés",
    duplicatesNotice: (count: number) => `${count} doublon(s) détecté(s) et filtré(s) automatiquement dans le fichier.`,
    previewRosterTitle: (count: number) => `Aperçu des élèves extraits (${count} élèves)`,
    confirmImportBtn: (count: number) => `Confirmer l'importation de ${count} élève(s)`,
    confirmImportingBtn: "Enregistrement de la liste en cours...",
    chooseAnotherFile: "Changer de fichier",
    currentSheetLabel: "Feuille actuelle :",
    importParseError: "Impossible d'analyser le fichier Excel",
    importSaveError: "Une erreur est survenue lors de l'enregistrement des élèves",

    historyTitle: "Historique des tours et évaluations",
    historySubtitle: "Compte rendu officiel et horodaté des passages pour une transparence totale",
    noHistoryYet: "Aucun tour de tirage n'a encore été réalisé pour cette classe.",
    roundOrderCol: "Ordre",
    roundStudentCol: "Nom de l'élève",
    roundTimestampCol: "Date et Heure",
    showDetails: "[Afficher]",
    hideDetails: "[Masquer]",
    roundPrefix: (num: number) => `Tour d'évaluation N° ${num}`,
    selectedCountBadge: (count: number) => `${count} élève(s) sélectionné(s)`,
    startedAtLabel: "Date de début",
    noSelectionsYetInRound: "Aucun élève n'a été tiré dans ce tour pour le moment.",
    historyBreadcrumb: "Historique officiel des tours",

    homeBadge: "Espace d'enseignement et d'évaluation certifié",
    homeHeroTitle: "Gestion des listes de classe & Tirage académique équitable",
    homeHeroDesc: "Une plateforme professionnelle complète conçue pour les enseignants : gestion des listes de classe, importation directe depuis Excel, organisation des séances de participation et évaluation orale grâce à un tirage au sort transparent garantissant une équité totale entre tous les apprenants.",
    homeEnterWorkspace: "Accéder à l'espace enseignant",
    homeCreateAccount: "Créer un compte enseignant",
    homeStandardsTitle: "Normes et exigences pédagogiques du système",
    standard1Badge: "1er Standard",
    standard1Title: "Importation directe des listes officielles",
    standard1Desc: "Traitement instantané des tableurs .xlsx avec détection automatique des colonnes en français et arabe, et élimination automatique des doublons.",
    standard2Badge: "2ème Standard",
    standard2Title: "Algorithme impartial et équitable",
    standard2Desc: "Exécution côté serveur d'un algorithme de tirage au sort sans parti pris, sans intervention manuelle ni favoritisme.",
    standard3Badge: "3ème Standard",
    standard3Title: "Horodatage et historique certifié",
    standard3Desc: "Consignation à la seconde près de chaque tirage pour permettre à l'enseignant de justifier l'équité des passages en classe.",
    standard4Badge: "4ème Standard",
    standard4Title: "Confidentialité et protection des données",
    standard4Desc: "Protection rigoureuse des données des élèves avec isolation étanche des comptes enseignants et conformité de sécurité.",
    homePrivacyLink: "Charte de confidentialité et de protection des données scolaires",
    homeFooterText: "Plateforme Académique d'Évaluation des Élèves — Portail Professionnel des Enseignants",

    loginTitle: "Connexion Enseignant",
    loginSubtitle: "Accès à la gestion de vos classes et aux séances de tirage",
    loginEmailLabel: "Adresse e-mail professionnelle",
    loginPasswordLabel: "Mot de passe",
    forgotPasswordLink: "Mot de passe oublié ?",
    loginSubmitBtn: "Se connecter",
    loginChecking: "Vérification des identifiants...",
    noAccountText: "Vous n'avez pas encore de compte ?",
    createNewTeacherAccount: "Créer un compte enseignant",
    loginErrorDefault: "Impossible de se connecter",

    registerTitle: "Créer un compte enseignant",
    registerSubtitle: "Enregistrez votre compte pour gérer vos classes et vos tirages",
    registerNameLabel: "Nom complet (Titre et nom)",
    registerNamePlaceholder: "Ex: M. Jean Dupont",
    registerEmailLabel: "Adresse e-mail professionnelle",
    registerPasswordLabel: "Mot de passe",
    registerConfirmPasswordLabel: "Confirmer le mot de passe",
    registerSubmitBtn: "Créer mon compte",
    registeringText: "Création du compte en cours...",
    hasAccountText: "Vous possédez déjà un compte ?",
    passwordMismatchError: "Les mots de passe ne correspondent pas",
    registerErrorDefault: "Impossible de créer le compte",

    forgotPasswordTitle: "Récupération du mot de passe",
    forgotPasswordSubtitle: "Saisissez votre e-mail professionnel pour recevoir le lien de réinitialisation",
    forgotPasswordSubmitBtn: "Envoyer le lien de réinitialisation",
    forgotPasswordSending: "Envoi en cours...",
    forgotPasswordSuccess: "Si cette adresse e-mail correspond à un compte, les instructions de réinitialisation vous ont été transmises.",
    backToLoginBtn: "Retour à la page de connexion",

    settingsTitle: "Paramètres du système et du compte",
    settingsSubtitle: "Personnalisation du tirage, thème visuel et informations professionnelles",
    settingsSec1Title: "1. Préférences d'affichage et de tirage",
    settingsThemeLabel: "Thème de l'interface",
    themeLightText: "Clair (Jour)",
    themeDarkText: "Sombre (Nuit)",
    themeSystemText: "Système",
    settingsSoundLabel: "Effets sonores lors des tirages",
    soundEnableBtn: "Activer les sons",
    soundMuteBtn: "Couper les sons",
    settingsSpeedLabel: "Vitesse et rythme du tirage",
    speedFastOption: "Rapide",
    speedNormalOption: "Normal (Recommandé)",
    speedSlowOption: "Posé",
    settingsSec2Title: "2. Informations de l'enseignant",
    settingsProfileSuccess: "Informations mises à jour avec succès",
    settingsNameLabel: "Nom complet",
    settingsEmailLabel: "Adresse e-mail professionnelle",
    settingsEmailSecurityNotice: "L'adresse e-mail ne peut être modifiée pour des raisons de sécurité",
    settingsPasswordSectionLabel: "Modifier le mot de passe (optionnel)",
    settingsCurrentPasswordPlaceholder: "Mot de passe actuel",
    settingsNewPasswordPlaceholder: "Nouveau mot de passe",
    settingsSaveBtn: "Enregistrer les modifications",
    settingsSavingBtn: "Enregistrement...",
    settingsSec3Title: "3. Zone de suppression définitive du compte",
    settingsDangerDesc: "Suppression irréversible du compte enseignant ainsi que de toutes les classes, élèves et historiques associés",
    settingsDeletePrompt: "Pour confirmer la suppression définitive, veuillez saisir la phrase exacte suivante :",
    settingsDeleteRequiredPhrase: "supprimer mon compte définitivement",
    settingsDeletePlaceholder: "Saisissez la phrase de confirmation...",
    settingsDeleteBtn: "Confirmer la suppression du compte et des données",
    settingsDeletingBtn: "Suppression en cours...",
    settingsDeleteMismatchError: "Veuillez saisir exactement la phrase de confirmation demandée",

    gameLoadingNotice: "Préparation de la session de tirage...",
    noStudentsGameTitle: "Aucun élève enregistré dans cette classe",
    noStudentsGameDesc: "Veuillez ajouter des élèves ou importer un fichier Excel pour pouvoir effectuer le tirage au sort.",
    goToClassRosterBtn: "Accéder à la gestion de la classe",
    backToDashboardBtn: "Retour au tableau de bord",
  },
};

export function getInitialLanguage(): Language {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("app_lang") as Language;
    if (saved === "ar" || saved === "fr") {
      return saved;
    }
  }
  return "ar";
}

export function setStoredLanguage(lang: Language) {
  if (typeof window !== "undefined") {
    localStorage.setItem("app_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>("ar");

  useEffect(() => {
    const current = getInitialLanguage();
    setLang(current);
    document.documentElement.lang = current;
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr";

    const handler = () => {
      const updated = getInitialLanguage();
      setLang(updated);
      document.documentElement.lang = updated;
      document.documentElement.dir = updated === "ar" ? "rtl" : "ltr";
    };

    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, []);

  return { lang, t: translations[lang] };
}
