const testSchedule = [
  { range: [6, 8], name: "Early Dating Scan" },
  { range: [11, 14], name: "NT Scan + Dual Marker" },
  { range: [18, 22], name: "Anomaly Scan" },
  { range: [24, 28], name: "Glucose Tolerance Test (GTT)" },
  { range: [28, 32], name: "Anti-D if Rh-negative" },
  { range: [32, 36], name: "Growth Scan" },
  { range: [36, 40], name: "Position Scan / GBS Test" }
];

const congratulations = [
  { range: [4, 8], msg: "Your journey just began. Take care and rest well. 🌼" },
  { range: [9, 13], msg: "First trimester almost complete! 🎉 Time for an NT scan maybe?" },
  { range: [14, 26], msg: "Halfway there! Your baby is growing strong 💪" },
  { range: [27, 35], msg: "You're in the third trimester now. 🍼 Preparing for parenthood!" },
  { range: [36, 40], msg: "Almost time to meet your little one! Pack your hospital bag 👶" }
];
const defaultMessage = "You're doing amazing, mama! 💖 Keep glowing!";

const trimesters = [
  {
    range: [0, 13],
    label: `
      <strong>First Trimester (Week 1–13)</strong><br>
      Your body is adjusting to pregnancy. It's common to feel <em>fatigue, nausea (morning sickness), breast tenderness</em>, and emotional ups and downs.<br>
      <strong class="text-danger">⚠️ If vomiting prevents you from keeping fluids down, consult a doctor.</strong>
    `
  },
  {
    range: [14, 27],
    label: `
      <strong>Second Trimester (Week 14–27)</strong><br>
      Energy usually improves. You may experience <em>backaches, leg cramps, stretch marks, mild swelling</em>, and feel the baby move.<br>
      <strong class="text-danger">⚠️ Sudden swelling, headaches, or blurred vision? Contact a doctor immediately.</strong>
    `
  },
  {
    range: [28, 40],
    label: `
      <strong>Third Trimester (Week 28–40)</strong><br>
      Expect <em>frequent urination, insomnia, shortness of breath, Braxton Hicks contractions</em> as baby grows.<br>
      <strong class="text-danger">⚠️ If you experience fluid leakage, bleeding, or painful regular contractions — seek care now.</strong>
    `
  }
];  

const nutritionAdvice = [
  "Eat iron-rich foods like lentils, spinach, and fish.",
  "Include calcium from milk, yogurt, or small fish with bones.",
  "Take folic acid supplements if not already advised.",
  "Stay hydrated and eat small, frequent meals.",
  "Avoid street food and raw fish/meat. Cook well."
];

const dearMomNotes = [
  { range: [4, 8], msg: "Dear Parent, each flutter of change is your body preparing to nurture. 💞" },
  { range: [9, 13], msg: "You're nearing the end of your first trimester. You've done wonderfully! 🌱" },
  { range: [14, 24], msg: "Halfway there! Your strength and love shape the journey ahead. 💪" },
  { range: [25, 35], msg: "As baby kicks grow stronger, so does your bond. You're amazing. 🤱" },
  { range: [36, 42], msg: "You're almost there! Breathe, rest, and know you're ready. ❤️" }
];
const defaultDearNote = "Every week is a beautiful step forward. Keep going! 🌸";
