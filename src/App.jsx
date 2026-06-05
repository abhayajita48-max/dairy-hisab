import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Users, FileText, User, Search, Filter, Phone, MapPin, 
  Trash2, Edit, Award, Share2, Download, Check, AlertCircle, Sparkles, 
  CreditCard, ChevronRight, CheckCircle2, Moon, Sun, Monitor, Languages, 
  Calendar, Clock, RefreshCw, Smartphone, TrendingUp, ChevronLeft, ArrowRightLeft,
  DollarSign, Activity, FileSpreadsheet, ShieldCheck, Database, Sliders, Play
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, collection, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const TRANSLATIONS = {
  en: {
    appName: "Dairy Hisab",
    tagline: "Smart Dairy Management",
    totalFarmers: "Total Farmers",
    activeFarmers: "Active Farmers",
    totalMilkToday: "Total Milk Today",
    cowMilk: "Cow Milk",
    buffaloMilk: "Buffalo Milk",
    todayRevenue: "Today's Revenue",
    todayPayments: "Today's Payments",
    todayPending: "Today's Pending",
    addFarmer: "Add Farmer",
    addMilkEntry: "Milk Entry",
    addPayment: "Record Payment",
    generateReport: "Reports",
    analytics: "Collection Analytics",
    farmersList: "Farmers List",
    searchPlaceholder: "Search by Name or Phone...",
    noFarmers: "No Farmers Added Yet",
    addFirstFarmer: "Add First Farmer",
    milkType: "Milk Type",
    village: "Village",
    phone: "Phone",
    todayMilk: "Today's Milk",
    pendingAmt: "Pending Amount",
    ratePerLiter: "Rate / Ltr",
    save: "Save Details",
    cancel: "Cancel",
    farmerName: "Farmer Name",
    openingBalance: "Opening Balance (₹)",
    aadhaar: "Aadhaar Number",
    address: "Full Address",
    shift: "Shift",
    morning: "Morning",
    evening: "Evening",
    milkInLiters: "Milk (Ltrs)",
    fat: "FAT %",
    snf: "SNF %",
    calculatedRate: "Calculated Rate",
    totalAmount: "Total Amount (₹)",
    paymentAmount: "Payment Amount (₹)",
    paymentDate: "Payment Date",
    paymentMethod: "Payment Method",
    notes: "Notes / Comments",
    dailyCollection: "Daily Collection",
    weeklyCollection: "Weekly Collection",
    monthlyCollection: "Monthly Collection",
    yearlyCollection: "Yearly Collection",
    financialSummary: "Financial Summary",
    totalEarnings: "Total Earnings",
    totalPaid: "Total Paid",
    transactionHistory: "Transaction History",
    premiumFeature: "Premium Feature Required",
    upgradeToPremium: "Upgrade to Premium for ₹250/mo to unlock unlimited exports, multi-language support, and dark theme.",
    upgradeNow: "Unlock Premium",
    freePlanActive: "Free Tier Active (Max 20 Farmers)",
    premiumPlanActive: "Premium Tier Active (Unlimited access)",
    ownerName: "Owner Name",
    dairyName: "Dairy Name",
    settings: "Settings",
    backupData: "Cloud Backup Active",
    restoreData: "Restore Data",
    helpSupport: "Help & Support",
    toastSuccess: "Action performed successfully!",
    allRightsReserved: "All Rights Reserved."
  },
  hi: {
    appName: "डेयरी हिसाब",
    tagline: "स्मार्ट डेयरी प्रबंधन",
    totalFarmers: "कुल किसान",
    activeFarmers: "सक्रिय किसान",
    totalMilkToday: "आज का कुल दूध",
    cowMilk: "गाय का दूध",
    buffaloMilk: "भैंस का दूध",
    todayRevenue: "आज की कमाई",
    todayPayments: "आज का भुगतान",
    todayPending: "आज का बकाया",
    addFarmer: "किसान जोड़ें",
    addMilkEntry: "दूध एंट्री",
    addPayment: "भुगतान दर्ज करें",
    generateReport: "रिपोर्ट",
    analytics: "संकलन विश्लेषण",
    farmersList: "किसानों की सूची",
    searchPlaceholder: "नाम या फ़ोन से खोजें...",
    noFarmers: "अभी तक कोई किसान नहीं जोड़ा गया",
    addFirstFarmer: "पहला किसान जोड़ें",
    milkType: "दूध का प्रकार",
    village: "गाँव",
    phone: "फ़ोन",
    todayMilk: "आज का दूध",
    pendingAmt: "बकाया राशि",
    ratePerLiter: "दर प्रति लीटर",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    farmerName: "किसान का नाम",
    openingBalance: "प्रारंभिक शेष (₹)",
    aadhaar: "आधार संख्या",
    address: "पूरा पता",
    shift: "शिफ्ट",
    morning: "सुबह",
    evening: "शाम",
    milkInLiters: "दूध (लीटर)",
    fat: "फैट %",
    snf: "एसएनएफ %",
    calculatedRate: "परिकलित दर",
    totalAmount: "कुल राशि (₹)",
    paymentAmount: "भुगतान राशि (₹)",
    paymentDate: "भुगतान की तारीख",
    paymentMethod: "भुगतान का प्रकार",
    notes: "टिप्पणी",
    dailyCollection: "दैनिक संकलन",
    weeklyCollection: "साप्ताहिक संकलन",
    monthlyCollection: "मासिक संकलन",
    yearlyCollection: "वार्षिक संकलन",
    financialSummary: "वित्तीय सारांश",
    totalEarnings: "कुल कमाई",
    totalPaid: "कुल भुगतान",
    transactionHistory: "लेनदेन इतिहास",
    premiumFeature: "प्रीमियम सुविधा की आवश्यकता",
    upgradeToPremium: "असीमित एक्सपोर्ट, बहु-भाषा समर्थन और डार्क थीम अनलॉक करने के लिए ₹250/माह पर प्रीमियम में अपग्रेड करें।",
    upgradeNow: "प्रीमियम अनलॉक करें",
    freePlanActive: "मुफ़्त योजना सक्रिय (अधिकतम 20 किसान)",
    premiumPlanActive: "प्रीमियम योजना सक्रिय (असीमित पहुंच)",
    ownerName: "मालिक का नाम",
    dairyName: "डेयरी का नाम",
    settings: "सेटिंग्स",
    backupData: "क्लाउड बैकअप सक्रिय",
    restoreData: "डेटा रीस्टोर",
    helpSupport: "सहायता और समर्थन",
    toastSuccess: "कार्य सफलतापूर्वक संपन्न हुआ!",
    allRightsReserved: "सर्वाधिकार सुरक्षित।"
  },
  pa: {
    appName: "ਡੇਅਰੀ ਹਿਸਾਬ",
    tagline: "ਸਮਾਰਟ ਡੇਅਰੀ ਪ੍ਰਬੰਧਨ",
    totalFarmers: "ਕੁੱਲ ਕਿਸਾਨ",
    activeFarmers: "ਸਰਗਰਮ ਕਿਸਾਨ",
    totalMilkToday: "ਅੱਜ ਦਾ ਕੁੱਲ ਦੁੱਧ",
    cowMilk: "ਗਾਂ ਦਾ ਦੁੱਧ",
    buffaloMilk: "ਮੱਝ ਦਾ ਦੁੱਧ",
    todayRevenue: "ਅੱਜ ਦੀ ਕਮਾਈ",
    todayPayments: "ਅੱਜ ਦਾ ਭੁਗਤਾਨ",
    todayPending: "ਅੱਜ ਦਾ ਬਕਾਇਆ",
    addFarmer: "ਕਿਸਾਨ ਜੋੜੋ",
    addMilkEntry: "ਦੁੱਧ ਐਂਟਰੀ",
    addPayment: "ਭੁਗਤਾਨ ਦਰਜ ਕਰੋ",
    generateReport: "ਰਿਪੋਰਟਾਂ",
    analytics: "ਸੰਗ੍ਰਹਿ ਵਿਸ਼ਲੇਸ਼ਣ",
    farmersList: "ਕਿਸਾਨਾਂ ਦੀ ਸੂਚੀ",
    searchPlaceholder: "ਨਾਮ ਜਾਂ ਫ਼ੋਨ ਨਾਲ ਖੋਜੋ...",
    noFarmers: "ਅਜੇ ਤੱਕ ਕੋਈ ਕਿਸਾਨ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ",
    addFirstFarmer: "ਪਹਿਲਾ ਕਿਸਾਨ ਜੋੜੋ",
    milkType: "ਦੁੱਧ ਦੀ ਕਿਸਮ",
    village: "ਪਿੰਡ",
    phone: "ਫ਼ੋਨ",
    todayMilk: "ਅੱਜ ਦਾ ਦੁੱਧ",
    pendingAmt: "ਬਕਾਇਆ ਰਕਮ",
    ratePerLiter: "ਦਰ ਪ੍ਰਤੀ ਲੀਟਰ",
    save: "ਸੁਰੱਖਿਅਤ ਕਰੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    farmerName: "ਕਿਸਾਨ ਦਾ ਨਾਮ",
    openingBalance: "ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ (₹)",
    aadhaar: "ਆਧਾਰ ਨੰਬਰ",
    address: "ਪੂਰਾ ਪਤਾ",
    shift: "ਸ਼ਿਫਟ",
    morning: "ਸਵੇਰ",
    evening: "ਸ਼ਾਮ",
    milkInLiters: "ਦੁੱਧ (ਲੀਟਰ)",
    fat: "ਫੈਟ %",
    snf: "ਐਸ.ਐਨ.ਐਫ %",
    calculatedRate: "ਗਣਨਾ ਕੀਤੀ ਦਰ",
    totalAmount: "ਕੁੱਲ ਰਕਮ (₹)",
    paymentAmount: "ਭੁਗਤਾਨ ਰਕਮ (₹)",
    paymentDate: "ਭੁਗਤਾਨ ਦੀ ਮਿਤੀ",
    paymentMethod: "ਭੁਗਤਾਨ ਦਾ ਤਰੀਕਾ",
    notes: "ਨੋਟਸ",
    dailyCollection: "ਰੋਜ਼ਾਨਾ ਸੰਗ੍ਰਹਿ",
    weeklyCollection: "ਹਫਤਾਵਾਰੀ ਸੰਗ੍ਰਹਿ",
    monthlyCollection: "ਮਾਸਿਕ ਸੰਗ੍ਰਹਿ",
    yearlyCollection: "ਸਾਲਾਨਾ ਸੰਗ੍ਰਹਿ",
    financialSummary: "ਵਿੱਤੀ ਸਾਰਾਂਸ਼",
    totalEarnings: "ਕੁੱਲ ਕਮਾਈ",
    totalPaid: "ਕੁੱਲ ਭੁਗਤਾਨ",
    transactionHistory: "ਲੈਣ-ਦੇਣ ਦਾ ਇਤਿਹਾਸ",
    premiumFeature: "ਪ੍ਰੀਮੀਅਮ ਫੀਚਰ ਦੀ ਲੋੜ",
    upgradeToPremium: "ਅਸੀਮਤ ਨਿਰਯਾਤ, ਬਹੁ-ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਅਤੇ ਡਾਰਕ ਥੀਮ ਨੂੰ ਅਨਲੌਕ ਕਰਨ ਲਈ ₹250/ਮਹੀਨੇ ਤੇ ਪ੍ਰੀਮੀਅਮ ਵਿੱਚ ਅਪਗ੍ਰੇਡ ਕਰੋ।",
    upgradeNow: "ਪ੍ਰੀਮੀਅਮ ਅਨਲਾਕ ਕਰੋ",
    freePlanActive: "ਮੁਫਤ ਯੋਜਨਾ ਸਰਗਰਮ (ਵੱਧ ਤੋਂ ਵੱਧ 20 ਕਿਸਾਨ)",
    premiumPlanActive: "ਪ੍ਰੀਮੀਅਮ ਯੋਜਨਾ ਸਰਗਰਮ",
    ownerName: "ਮਾਲਕ ਦਾ ਨਾਮ",
    dairyName: "ਡੇਅਰੀ ਦਾ ਨਾਮ",
    settings: "ਸੈਟਿੰਗਾਂ",
    backupData: "ਕਲਾਉਡ ਬੈਕਅਪ ਸਰਗਰਮ",
    restoreData: "ਡਾਟਾ ਰੀਸਟੋਰ",
    helpSupport: "ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ",
    toastSuccess: "ਕਾਰਵਾਈ ਸਫਲਤਾਪੂਰਵਕ ਕੀਤੀ ਗਈ!",
    allRightsReserved: "ਸਭ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।"
  },
  bn: {
    appName: "ডেইরি হিসাব",
    tagline: "স্মার্ট ডেইরি ম্যানেজমেন্ট",
    totalFarmers: "মোট খামারী",
    activeFarmers: "সক্রিয় খামারী",
    totalMilkToday: "আজকের মোট দুধ",
    cowMilk: "গরুর দুধ",
    buffaloMilk: "মহিষের দুধ",
    todayRevenue: "আজকের আয়",
    todayPayments: "আজকের পেমেন্ট",
    todayPending: "আজকের বকেয়া",
    addFarmer: "খামারী যোগ করুন",
    addMilkEntry: "দুধের এন্ট্রি",
    addPayment: "পেমেন্ট রেকর্ড",
    generateReport: "রিপোর্ট",
    analytics: "সংগ্রহ অ্যানালিটিক্স",
    farmersList: "খামারী তালিকা",
    searchPlaceholder: "নাম বা ফোন দিয়ে খুঁজুন...",
    noFarmers: "এখনও কোনো খামারী যোগ করা হয়নি",
    addFirstFarmer: "প্রথম খামারী যোগ করুন",
    milkType: "দুধের ধরণ",
    village: "গ্রাম",
    phone: "মোবাইল",
    todayMilk: "আজকের দুধ",
    pendingAmt: "বকেয়া টাকা",
    ratePerLiter: "লিটার প্রতি রেট",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল",
    farmerName: "খামারীর নাম",
    openingBalance: "প্রারম্ভিক ব্যালেন্স (₹)",
    aadhaar: "আধার কার্ড নম্বর",
    address: "ঠিকানা",
    shift: "শিফ্ট",
    morning: "সকাল",
    evening: "সন্ধ্যা",
    milkInLiters: "দুধ (লিটার)",
    fat: "ফ্যাট %",
    snf: "এসএনএফ %",
    calculatedRate: "হিসাবকৃত রেট",
    totalAmount: "মোট পরিমাণ (₹)",
    paymentAmount: "পেমেন্টের পরিমাণ (₹)",
    paymentDate: "পেমেন্টের তারিখ",
    paymentMethod: "পেমেন্ট মাধ্যম",
    notes: "মন্তব্য",
    dailyCollection: "দৈনিক সংগ্রহ",
    weeklyCollection: "সাপ্তাহিক সংগ্রহ",
    monthlyCollection: "মাসিক সংগ্রহ",
    yearlyCollection: "বার্ষিক সংগ্রহ",
    financialSummary: "আর্থিক সারসংক্ষেপ",
    totalEarnings: "মোট উপার্জন",
    totalPaid: "মোট পরিশোধিত",
    transactionHistory: "লেনদেনের ইতিহাস",
    premiumFeature: "প্রিমিয়াম ফিচার প্রয়োজন",
    upgradeToPremium: "আনলিমিটেড এক্সপোর্ট, বহু-ভাষা এবং ডার্ক থিম পেতে ₹২৫০/মাস মূল্যে প্রিমিয়ামে আপগ্রেড করুন।",
    upgradeNow: "প্রিমিয়াম আনলক করুন",
    freePlanActive: "ফ্রি প্ল্যান সক্রিয় (সর্বোচ্চ ২০ জন খামারী)",
    premiumPlanActive: "প্রিমিয়াম প্ল্যান সক্রিয়",
    ownerName: "মালিকের নাম",
    dairyName: "ডেইরির নাম",
    settings: "সেটিংস",
    backupData: "ক্লাউড备份 সক্রিয়",
    restoreData: "ডাটা রিস্টোর",
    helpSupport: "সাহায্য ও সহযোগিতা",
    toastSuccess: "সফলভাবে সম্পন্ন হয়েছে!",
    allRightsReserved: "সর্বস্বত্ব সংরক্ষিত।"
  },
  te: {
    appName: "డైరీ హిసాబ్",
    tagline: "స్మార్ట్ డైరీ మేనేజ్మెంట్",
    totalFarmers: "మొత్తం రైతులు",
    activeFarmers: "క్రియాశీల రైతులు",
    totalMilkToday: "ఈరోజు మొత్తం పాలు",
    cowMilk: "ఆవు పాలు",
    buffaloMilk: "గేదె పాలు",
    todayRevenue: "ఈరోజు రాబడి",
    todayPayments: "ఈరోజు చెల్లింపులు",
    todayPending: "ఈరోజు బకాయిలు",
    addFarmer: "రైతును జోడించు",
    addMilkEntry: "పాలు నమోదు",
    addPayment: "చెల్లింపు నమోదు",
    generateReport: "నివేదికలు",
    analytics: "సేకరణ విశ్లేషణ",
    farmersList: "రైతుల జాబితా",
    searchPlaceholder: "పేరు లేదా ఫోన్‌తో శోధించండి...",
    noFarmers: "ఇంకా ఏ రైతును జోడించలేదు",
    addFirstFarmer: "మొదటి రైతును జోడించు",
    milkType: "పాలు రకం",
    village: "గ్రామం",
    phone: "ఫోన్",
    todayMilk: "ఈరోజు పాలు",
    pendingAmt: "బకాయి మొత్తం",
    ratePerLiter: "లీటరు ధర",
    save: "సేవ్ చేయి",
    cancel: "రద్దు చేయి",
    farmerName: "రైతు పేరు",
    openingBalance: "ప్రారంభ బ్యాలెన్స్ (₹)",
    aadhaar: "ఆధార్ నంబర్",
    address: "పూర్తి చిరునామా",
    shift: "షిఫ్ట్",
    morning: "ఉదయం",
    evening: "సాయంత్రం",
    milkInLiters: "పాలు (లీటర్లు)",
    fat: "ఫ్యాట్ %",
    snf: "ఎస్.ఎన్.ఎఫ్ %",
    calculatedRate: "లెక్కించిన ధర",
    totalAmount: "మొత్తం విలువ (₹)",
    paymentAmount: "చెల్లింపు మొత్తం (₹)",
    paymentDate: "చెల్లింపు తేదీ",
    paymentMethod: "చెల్లింపు పద్ధతి",
    notes: "గమనికలు",
    dailyCollection: "రోజువారీ సేకరణ",
    weeklyCollection: "వారపు సేకరణ",
    monthlyCollection: "నెలవారీ సేకరణ",
    yearlyCollection: "సంవత్సరపు సేకరణ",
    financialSummary: "ఆర్థిక సారాంశం",
    totalEarnings: "మొత్తం ఆదాయం",
    totalPaid: "మొత్తం చెల్లించినది",
    transactionHistory: "లావాదేవీల చరిత్ర",
    premiumFeature: "ప్రీమియం ఫీచర్ అవసరం",
    upgradeToPremium: "అపరిమిత ఎగుమతులు, బహుళ భాషా మద్దతు మరియు డార్క్ థీమ్‌ను అన్‌లాక్ చేయడానికి నెలకు ₹250 తో ప్రీమియం పొందండి.",
    upgradeNow: "ప్రీమియం అన్‌లాక్ చేయండి",
    freePlanActive: "ఉచిత ప్లాన్ యాక్టివ్ (గరిష్టంగా 20 మంది రైతులు)",
    premiumPlanActive: "ప్రీమియం ప్లాన్ యాక్టివ్",
    ownerName: "యజమాని పేరు",
    dairyName: "డైరీ పేరు",
    settings: "సెట్టింగులు",
    backupData: "క్లౌడ్ బ్యాకప్ యాక్టివ్",
    restoreData: "డేటా పునరుద్ధరణ",
    helpSupport: "సహాయం & మద్దతు",
    toastSuccess: "చర్య విజయవంతంగా పూర్తయింది!",
    allRightsReserved: "అన్ని హక్కులూ ప్రత్యేకించబడినవి."
  },
  ta: {
    appName: "டைரி ஹிசாப்",
    tagline: "ஸ்மார்ட் டைரி மேலாண்மை",
    totalFarmers: "மொத்த விவசாயிகள்",
    activeFarmers: "செயலில் உள்ளவர்கள்",
    totalMilkToday: "இன்றைய மொத்த பால்",
    cowMilk: "பசு பால்",
    buffaloMilk: "எருமை பால்",
    todayRevenue: "இன்றைய வருவாய்",
    todayPayments: "இன்றைய கொடுப்பனவு",
    todayPending: "இன்றைய நிலுவை",
    addFarmer: "விவசாயி சேர்",
    addMilkEntry: "பால் பதிவு",
    addPayment: "பணம் செலுத்துதல்",
    generateReport: "அறிக்கைகள்",
    analytics: "சேகரிப்பு பகுப்பாய்வு",
    farmersList: "விவசாயிகள் பட்டியல்",
    searchPlaceholder: "பெயர் அல்லது போன் மூலம் தேடுக...",
    noFarmers: "இதுவரை விவசாயிகள் யாரும் சேர்க்கப்படவில்லை",
    addFirstFarmer: "முதல் விவசாயியை சேர்க்க",
    milkType: "பால் வகை",
    village: "கிராமம்",
    phone: "தொலைபேசி",
    todayMilk: "இன்றைய பால்",
    pendingAmt: "நிலυவைத் தொகை",
    ratePerLiter: "லிட்டர் விலை",
    save: "சேமி",
    cancel: "ரத்து செய்",
    farmerName: "விவசாயி பெயர்",
    openingBalance: "ஆரம்ப இருப்பு (₹)",
    aadhaar: "ஆதார் எண்",
    address: "முழு முகவரி",
    shift: "ஷிப்ட்",
    morning: "காலை",
    evening: "மாலை",
    milkInLiters: "பால் (லிட்டர்)",
    fat: "கொழுப்பு % (FAT)",
    snf: "எஸ்.என்.எஃப் % (SNF)",
    calculatedRate: "கணக்கிடப்பட்ட விலை",
    totalAmount: "மொத்த தொகை (₹)",
    paymentAmount: "செலுத்தப்பட்ட தொகை (₹)",
    paymentDate: "செலுத்தப்பட்ட தேதி",
    paymentMethod: "பணம் செலுத்தும் முறை",
    notes: "குறிப்புகள்",
    dailyCollection: "தினசரி சேகரிப்பு",
    weeklyCollection: "வாராந்திர சேகரிப்பு",
    monthlyCollection: "மாதாந்திர சேகரிப்பு",
    yearlyCollection: "ஆண்டின் சேகరిப்பு",
    financialSummary: "நிதி சுருக்கம்",
    totalEarnings: "மொத்த வருவாய்",
    totalPaid: "மொத்த பட்டுவாடா",
    transactionHistory: "பரிவர்த்தனை வரலாறு",
    premiumFeature: "பிரீமியம் அம்சம் தேவை",
    upgradeToPremium: "வரம்பற்ற ஏற்றுமதிகள், பல மொழி ஆதரவு மற்றும் டார்க் தீம் பெற மாதத்திற்கு ₹250 செலுத்தி பிரீமியம் பெறுக.",
    upgradeNow: "பிரீமியம் அன்லாக் செய்",
    freePlanActive: "இலவச திட்டம் செயலில் உள்ளது (அதிகபட்சம் 20 விவசாயிகள்)",
    premiumPlanActive: "பிரீமியம் திட்டம் செயலில் உள்ளது",
    ownerName: "உரிமையாளர் பெயர்",
    dairyName: "டைரி பெயர்",
    settings: "அமைப்புகள்",
    backupData: "கிளவுட் காப்புப் பிரதி",
    restoreData: "தரவை மீட்டெடு",
    helpSupport: "உதவி & ஆதரவு",
    toastSuccess: "செயல்பாடுகள் வெற்றிகரமாக முடிந்தது!",
    allRightsReserved: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
  }
};

const DEFAULT_FARMERS = [
  { id: 'f1', name: 'Rajesh Kumar', phone: '9876543210', village: 'Rampur', milkType: 'Cow', openingBalance: 500, address: 'Near Temple, Rampur', aadhaar: '[Aadhaar Redacted]', photo: '🐄' },
  { id: 'f2', name: 'Harpreet Singh', phone: '9412345678', village: 'Gill Pind', milkType: 'Buffalo', openingBalance: 1200, address: 'Farmhouse 4, Gill Road', aadhaar: '[Aadhaar Redacted]', photo: '🥛' },
  { id: 'f3', name: 'Satyajit Ray', phone: '9123456789', village: 'Sonarpur', milkType: 'Cow', openingBalance: 0, address: 'Subhas Pally, Ward 5', aadhaar: '[Aadhaar Redacted]', photo: '🌾' },
  { id: 'f4', name: 'Anjali Devi', phone: '9988776655', village: 'Anakapalle', milkType: 'Buffalo', openingBalance: 2500, address: 'Main Street, Anakapalle', aadhaar: '[Aadhaar Redacted]', photo: '🌺' }
];

const DEFAULT_MILK_ENTRIES = [
  { id: 'm1', farmerId: 'f1', date: '2026-06-05', shift: 'Morning', milkType: 'Cow', milkInLiters: 12.5, fat: 4.2, snf: 8.7, rate: 45.5, amount: 568.75 },
  { id: 'm2', farmerId: 'f1', date: '2026-06-05', shift: 'Evening', milkType: 'Cow', milkInLiters: 10.0, fat: 4.0, snf: 8.5, rate: 44.0, amount: 440.00 },
  { id: 'm3', farmerId: 'f2', date: '2026-06-05', shift: 'Morning', milkType: 'Buffalo', milkInLiters: 15.0, fat: 7.2, snf: 9.1, rate: 68.0, amount: 1020.00 }
];

const DEFAULT_PAYMENTS = [
  { id: 'p1', farmerId: 'f1', amount: 800, date: '2026-06-05', method: 'UPI', notes: 'Weekly milk payout' }
];

export default function App() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [appId, setAppId] = useState('default-app-id');

  const [currentTab, setCurrentTab] = useState('hisab'); 
  const [currentLanguage, setCurrentLanguage] = useState('en'); 
  const [themeMode, setThemeMode] = useState('light'); 
  const [isPremium, setIsPremium] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [profile, setProfile] = useState({
    dairyName: "Krishna Dairy Cooperative",
    ownerName: "Gopal Yadav",
    phone: "9876543210",
    address: "NH-8 Near Amul Hub, Anand, Gujarat"
  });

  const [modalActive, setModalActive] = useState(null); 
  const [activeLedgerFarmerId, setActiveLedgerFarmerId] = useState(null);

  const [farmers, setFarmers] = useState(DEFAULT_FARMERS);
  const [milkEntries, setMilkEntries] = useState(DEFAULT_MILK_ENTRIES);
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);

  const [farmerForm, setFarmerForm] = useState({
    name: '', phone: '', village: '', address: '', aadhaar: '', milkType: 'Cow', openingBalance: '0', photo: '🐄'
  });

  const [milkForm, setMilkForm] = useState({
    farmerId: '', date: new Date().toISOString().split('T')[0], shift: 'Morning', milkType: 'Cow', milkInLiters: '', fat: '4.0', snf: '8.5'
  });

  const [paymentForm, setPaymentForm] = useState({
    farmerId: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'UPI', notes: ''
  });
  
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerFilter, setFarmerFilter] = useState('All'); 
  const [reportSubTab, setReportSubTab] = useState('daily'); 

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const calculatedAppId = typeof __app_id !== 'undefined' ? __app_id : 'dairy-hisab-default';
    setAppId(calculatedAppId);

    if (typeof __firebase_config !== 'undefined' && __firebase_config) {
      try {
        const firebaseConfig = JSON.parse(__firebase_config);
        const app = initializeApp(firebaseConfig);
        const firebaseAuth = getAuth(app);
        const firestoreDb = getFirestore(app);
        
        setDb(firestoreDb);
        setAuth(firebaseAuth);

        const initAuth = async () => {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        };
        initAuth();

        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
          setUser(currentUser);
          showToast("Cloud connection established safely.");
        });

        return () => unsubscribe();
      } catch (e) {
        console.error("Firebase Init Error", e);
      }
    }
  }, []);

  const calculatedRateAndAmount = useMemo(() => {
    const liters = parseFloat(milkForm.milkInLiters) || 0;
    const fatVal = parseFloat(milkForm.fat) || 0;
    const snfVal = parseFloat(milkForm.snf) || 0;
    
    let baseRate = milkForm.milkType === 'Cow' ? 40 : 60;
    let finalRate = baseRate + (fatVal - 4.0) * 3 + (snfVal - 8.5) * 2;
    if (finalRate < 20) finalRate = 20; 

    return {
      rate: parseFloat(finalRate.toFixed(2)),
      amount: parseFloat((liters * finalRate).toFixed(2))
    };
  }, [milkForm.milkInLiters, milkForm.milkType, milkForm.fat, milkForm.snf]);

  const handl
