import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const COLORS = {
  bg: "#0f172a",
  card: "#111827",
  card2: "#1f2937",
  text: "#f9fafb",
  sub: "#cbd5e1",
  yellow: "#fbbf24",
  green: "#34d399",
  red: "#fb7185",
  blue: "#60a5fa",
  purple: "#c084fc",
  orange: "#fb923c",
};

function nice(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "?";
  const x = Number(n);
  if (Math.abs(x) >= 10000 || (Math.abs(x) > 0 && Math.abs(x) < 0.001)) {
    return x.toExponential(3);
  }
  return Number(x.toFixed(4)).toString();
}

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replaceAll("upper n divided by upper c", "n/c")
    .replaceAll("n divided by c", "n/c")
    .replaceAll("upper v divided by m", "v/m")
    .replaceAll("v divided by m", "v/m")
    .replaceAll("m divided by s", "m/s")
    .replaceAll("meters per second", "m/s")
    .replaceAll("meter per second", "m/s")
    .replaceAll("upper n", " n")
    .replaceAll("newtons", " n")
    .replaceAll("newton", " n")
    .replaceAll("nothingnc", "nc")
    .replaceAll("nothing nc", "nc")
    .replaceAll("mu upper c", "uc")
    .replaceAll("mu c", "uc")
    .replaceAll("micro c", "uc")
    .replaceAll("microc", "uc")
    .replaceAll("superscript negative", "superscript minus")
    .replaceAll("startroot", "sqrt")
    .replaceAll("endroot", "")
    .replaceAll("π", "pi")
    .replaceAll("μ", "mu");
}

function allNumbers(text) {
  return [...(text || "").matchAll(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map((m) => m[0]);
}

function allScientific(text) {
  const raw = text || "";
  const values = [];

  const re = /([-+]?\d*\.?\d+)\s*(?:times|\*|x)\s*10\s*superscript\s*(minus\s*)?([-+]?\d+)/gi;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const base = Number(m[1]);
    const exp = (m[2] ? -1 : 1) * Number(m[3]);
    values.push(base * Math.pow(10, exp));
  }

  const re2 = /([-+]?\d*\.?\d+)\s*(?:times|\*|x)\s*10\s*\^?\s*([-+]?\d+)/gi;
  while ((m = re2.exec(raw)) !== null) {
    const base = Number(m[1]);
    const exp = Number(m[2]);
    values.push(base * Math.pow(10, exp));
  }

  return values;
}

function numsBefore(text, unitPattern) {
  const lower = normalize(text);
  return [...lower.matchAll(new RegExp("([-+]?\\d*\\.?\\d+)\\s*" + unitPattern, "gi"))]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n));
}

function hasAny(lower, words) {
  return words.some((w) => lower.includes(w));
}

function makeResult({ topic, givens, unknown, formula, steps, answer, trap, memory }) {
  return { topic, givens, unknown, formula, steps, answer, trap, memory };
}

const CHAPTERS = {
  16: {
    id: 16,
    title: "Ch. 16 — Waves, Sound, Doppler",
    short: "Waves",
    color: COLORS.blue,
    formula: "v=fλ, v=√(T/μ), y=A sin(kx−ωt+φ)",
    goals: [
      "Transverse vs longitudinal waves",
      "String speed v=√(T/μ)",
      "Wave equation y(x,t)=A sin(kx−ωt+φ)",
      "Snapshot vs history graphs",
      "Sound intensity inverse square",
      "Doppler shifts",
    ],
  },
  22: {
    id: 22,
    title: "Ch. 22 — Charge and Coulomb Force",
    short: "Charge",
    color: COLORS.yellow,
    formula: "Q=Ne, F=kq₁q₂/r²",
    goals: [
      "Charge from electrons",
      "Attraction vs repulsion",
      "Coulomb force magnitude",
      "Force vectors in i, j, k",
      "Conductor vs insulator behavior",
    ],
  },
  23: {
    id: 23,
    title: "Ch. 23 — Electric Fields",
    short: "Fields",
    color: COLORS.green,
    formula: "E=F/q, E=k|q|/r²",
    goals: [
      "Electric field direction",
      "Point charge fields",
      "Field superposition",
      "Polarization",
      "Dipoles and field maps",
    ],
  },
  24: {
    id: 24,
    title: "Ch. 24 — Flux and Gauss's Law",
    short: "Flux",
    color: COLORS.purple,
    formula: "Φ=EAcosθ, Φ=qenc/ε₀",
    goals: [
      "Electric flux",
      "Gauss's Law",
      "Only enclosed charge counts",
      "Symmetry",
      "Rings, wires, and plates",
    ],
  },
  25: {
    id: 25,
    title: "Ch. 25 — Electric Potential",
    short: "Potential",
    color: COLORS.orange,
    formula: "V=U/q, ΔU=qΔV",
    goals: [
      "Voltage as energy per charge",
      "Potential energy",
      "Potential difference",
      "Scalar vs vector thinking",
    ],
  },
  26: {
    id: 26,
    title: "Ch. 26 — Capacitance",
    short: "Capacitors",
    color: COLORS.green,
    formula: "C=Q/ΔV, Q=ε₀AE",
    goals: [
      "Capacitance",
      "Parallel plates",
      "Charge storage",
      "Dielectrics",
    ],
  },
  27: {
    id: 27,
    title: "Ch. 27 — Current and Resistance",
    short: "Current",
    color: COLORS.red,
    formula: "I=ΔQ/Δt, V=IR, P=IV",
    goals: [
      "Current",
      "Resistance",
      "Ohm's Law",
      "Power",
    ],
  },
  28: {
    id: 28,
    title: "Ch. 28 — DC Circuits",
    short: "Circuits",
    color: COLORS.yellow,
    formula: "Series add, parallel reciprocals",
    goals: [
      "Series circuits",
      "Parallel circuits",
      "Equivalent resistance",
      "Kirchhoff thinking",
    ],
  },
  29: {
    id: 29,
    title: "Ch. 29 — Magnetic Fields",
    short: "Magnetism",
    color: COLORS.blue,
    formula: "F=qvBsinθ",
    goals: [
      "Magnetic force",
      "Right-hand rule",
      "Moving charges",
      "Circular motion in B fields",
    ],
  },
  30: {
    id: 30,
    title: "Ch. 30 — Electromagnetic Induction",
    short: "Induction",
    color: COLORS.purple,
    formula: "ε=−NΔΦB/Δt",
    goals: [
      "Changing magnetic flux",
      "Faraday's Law",
      "Lenz's Law",
      "Induced emf",
    ],
  },
  31: {
    id: 31,
    title: "Ch. 31 — Electromagnetic Waves",
    short: "EM Waves",
    color: COLORS.green,
    formula: "c=fλ, n=λvacuum/λmaterial",
    goals: [
      "Light frequency",
      "Wavelength conversion",
      "Index of refraction",
      "EM wave speed",
    ],
  },
  32: {
    id: 32,
    title: "Ch. 32 — Final Review / Mixed Practice",
    short: "Review",
    color: COLORS.orange,
    formula: "Identify model first",
    goals: [
      "Mixed problem recognition",
      "Formula sorting",
      "Exam strategy",
      "Avoiding unit traps",
    ],
  },
  33: {
    id: 33,
    title: "Ch. 33 — Final Boss Concepts",
    short: "Final Boss",
    color: COLORS.red,
    formula: "Givens → Unknown → Model → Formula",
    goals: [
      "Unknown problem survival",
      "Formula map fluency",
      "Cumulative review",
      "Confidence under pressure",
    ],
  },
};

const MODULES = [
  {
    id: 1,
    title: "Module 1",
    dates: "Waves + Electrostatics Foundation",
    chapters: [16, 22, 23, 24],
    mission: "Build the foundation: waves, charge, electric force, fields, flux, and Gauss's Law.",
    exam: "Module 1 Exam / Core Foundation",
  },
  {
    id: 2,
    title: "Module 2",
    dates: "Potential, Capacitors, Current, Circuits",
    chapters: [25, 26, 27, 28],
    mission: "Move from fields into energy, voltage, charge storage, and circuits.",
    exam: "Module 2 Exam / Circuits and Energy",
  },
  {
    id: 3,
    title: "Module 3",
    dates: "Magnetism, Induction, EM Waves",
    chapters: [29, 30, 31],
    mission: "Connect electricity and magnetism: forces, changing flux, and light.",
    exam: "Module 3 Exam / Magnetism and EM",
  },
  {
    id: 4,
    title: "Module 4",
    dates: "Final Review",
    chapters: [32, 33],
    mission: "Mixed review, final exam strategy, and problem recognition.",
    exam: "Final Exam / Formula Fluency",
  },
];

const MEMORY_CARDS = [
  { module: 1, chapter: 16, front: "Transverse wave?", back: "Medium moves perpendicular to wave direction." },
  { module: 1, chapter: 16, front: "Longitudinal wave?", back: "Medium moves parallel to wave direction." },
  { module: 1, chapter: 16, front: "String speed formula?", back: "v = √(T/μ)." },
  { module: 1, chapter: 16, front: "Wave number?", back: "k = 2π/λ." },
  { module: 1, chapter: 16, front: "Angular frequency?", back: "ω = 2πf." },
  { module: 1, chapter: 16, front: "Wave speed from k and ω?", back: "v = ω/k." },
  { module: 1, chapter: 16, front: "Snapshot graph?", back: "D vs x at one instant." },
  { module: 1, chapter: 16, front: "History graph?", back: "D vs t at one position." },
  { module: 1, chapter: 16, front: "Sound intensity vs distance?", back: "I ∝ 1/r²." },
  { module: 1, chapter: 16, front: "Doppler toward?", back: "Observed frequency increases." },

  { module: 1, chapter: 22, front: "Charge of one electron?", back: "-1.60 × 10⁻¹⁹ C." },
  { module: 1, chapter: 22, front: "Electrons added means?", back: "Object becomes negative." },
  { module: 1, chapter: 22, front: "Coulomb force?", back: "F = kq₁q₂/r²." },
  { module: 1, chapter: 22, front: "Like charges?", back: "Repel." },
  { module: 1, chapter: 22, front: "Opposite charges?", back: "Attract." },

  { module: 1, chapter: 23, front: "Point charge field?", back: "E = k|q|/r²." },
  { module: 1, chapter: 23, front: "Field from positive charge points?", back: "Away." },
  { module: 1, chapter: 23, front: "Field from negative charge points?", back: "Toward." },
  { module: 1, chapter: 23, front: "Conductor charge behavior?", back: "Spreads over the surface." },
  { module: 1, chapter: 23, front: "Insulator charge behavior?", back: "Stays local." },
  { module: 1, chapter: 23, front: "Neutral attraction cause?", back: "Polarization." },

  { module: 1, chapter: 24, front: "Flux through flat surface?", back: "Φ = EAcosθ." },
  { module: 1, chapter: 24, front: "Gauss's Law?", back: "Φ = qenc/ε₀." },
  { module: 1, chapter: 24, front: "Gauss trap?", back: "Only enclosed charge counts." },
  { module: 1, chapter: 24, front: "Ring field axis direction?", back: "Parallel to z-axis." },
  { module: 1, chapter: 24, front: "Finite wire field direction above midpoint?", back: "+j direction." },

  { module: 2, chapter: 25, front: "Voltage means?", back: "Energy per charge." },
  { module: 2, chapter: 25, front: "Potential formula?", back: "V = U/q." },
  { module: 2, chapter: 26, front: "Capacitance formula?", back: "C = Q/ΔV." },
  { module: 2, chapter: 26, front: "Parallel plate charge from E?", back: "Q = ε₀AE." },
  { module: 2, chapter: 27, front: "Ohm's Law?", back: "V = IR." },
  { module: 2, chapter: 27, front: "Power formula?", back: "P = IV." },
  { module: 2, chapter: 28, front: "Series resistors?", back: "Add directly." },
  { module: 2, chapter: 28, front: "Parallel resistors?", back: "Use reciprocals." },

  { module: 3, chapter: 29, front: "Magnetic force?", back: "F = qvBsinθ." },
  { module: 3, chapter: 29, front: "Stationary charge in B field?", back: "No magnetic force." },
  { module: 3, chapter: 30, front: "Faraday's Law?", back: "ε = −NΔΦB/Δt." },
  { module: 3, chapter: 30, front: "Lenz's Law?", back: "Induced effect opposes the change." },
  { module: 3, chapter: 31, front: "Light equation?", back: "c = fλ." },
  { module: 3, chapter: 31, front: "Index with wavelength?", back: "n = λvacuum/λmaterial." },

  { module: 4, chapter: 32, front: "First move on any problem?", back: "Circle clue words and list givens." },
  { module: 4, chapter: 33, front: "If confused?", back: "Givens → Unknown → Model → Formula." },
];

const BOSS_QUESTIONS = [
  {
    module: 1,
    q: "2.0 × 10¹⁰ electrons are added. What is Q?",
    choices: ["−3.2 × 10⁻⁹ C", "+3.2 × 10⁻⁹ C", "−3.2 × 10⁹ C", "0 C"],
    a: "−3.2 × 10⁻⁹ C",
    teach: "Q = N(-e) = (2.0e10)(-1.60e-19) = -3.2e-9 C.",
  },
  {
    module: 1,
    q: "For a string, increasing tension does what to wave speed?",
    choices: ["Increases it", "Decreases it", "No change", "Makes it zero"],
    a: "Increases it",
    teach: "v = √(T/μ). More tension means faster wave.",
  },
  {
    module: 1,
    q: "A negative point charge has field lines pointing:",
    choices: ["Toward it", "Away from it", "In circles", "Only upward"],
    a: "Toward it",
    teach: "Field direction is the direction a positive test charge would move.",
  },
  {
    module: 1,
    q: "Gauss's Law cares about:",
    choices: ["Enclosed charge", "Only outside charge", "Color", "Mass only"],
    a: "Enclosed charge",
    teach: "Net flux through a closed surface equals qenc/ε₀.",
  },
  {
    module: 2,
    q: "Voltage means:",
    choices: ["Energy per charge", "Charge per energy", "Resistance per meter", "Magnetic field"],
    a: "Energy per charge",
    teach: "V = U/q.",
  },
  {
    module: 2,
    q: "Series resistors:",
    choices: ["Add directly", "Use reciprocals", "Disappear", "All have same voltage always"],
    a: "Add directly",
    teach: "Series equivalent resistance is R1 + R2 + ...",
  },
  {
    module: 3,
    q: "A stationary charge in a magnetic field feels:",
    choices: ["No magnetic force", "Maximum force", "Infinite force", "Only electric force"],
    a: "No magnetic force",
    teach: "Magnetic force needs motion: F = qvBsinθ.",
  },
  {
    module: 3,
    q: "Faraday's Law is about:",
    choices: ["Changing magnetic flux", "Static voltage only", "Charge from electrons", "Sound intensity"],
    a: "Changing magnetic flux",
    teach: "Changing flux creates induced emf.",
  },
  {
    module: 4,
    q: "Best first move on any physics problem?",
    choices: ["Circle clue words", "Guess", "Ignore units", "Plug everything into F=ma"],
    a: "Circle clue words",
    teach: "Clue words tell you the model.",
  },
];

function solveHomework(text) {
  const lower = normalize(text);
  const sci = allScientific(text);
  const givens = [...sci.map((n) => n.toExponential(3)), ...allNumbers(text)];

  if (!text.trim()) {
    return makeResult({
      topic: "Paste Any Homework Question",
      givens: [],
      unknown: "Whatever the problem asks for",
      formula: "The app picks the formula from clue words.",
      steps: "Paste the full problem with units and answer choices.",
      answer: "Waiting for homework problem.",
      trap: "Do not paste only numbers.",
      memory: "Before pasting, guess the chapter.",
    });
  }

  const K = 8.99e9;
  const E_CHARGE = 1.60e-19;

  if (hasAny(lower, ["electrons are added", "excess electrons", "number of electrons"])) {
    const N = sci[0] || numsBefore(text, "electrons")[0];
    let answer = "Need number of electrons.";
    if (N) {
      const Q = -N * E_CHARGE;
      answer = `Q = N(-e)\nQ = (${N.toExponential(3)})(-1.60 × 10⁻¹⁹ C)\nQ = ${Q.toExponential(3)} C\n\nFinal Answer: ${Q.toExponential(2)} C`;
    }
    return makeResult({
      topic: "Module 1 / Ch. 22: Charge from Electrons",
      givens,
      unknown: "Net charge Q",
      formula: "Q = N(-e)",
      steps: "Electrons are negative. Multiply number of added electrons by −1.60 × 10⁻¹⁹ C.",
      answer,
      trap: "Added electrons make the object negative.",
      memory: "Electrons added = negative.",
    });
  }

  if (hasAny(lower, ["string", "tension"]) && hasAny(lower, ["speed", "wave speed", "m/s"])) {
    const speeds = numsBefore(text, "m\\s*/\\s*s");
    const tensions = numsBefore(text, "n\\b");
    const v1 = speeds[0];
    const v2 = speeds[1];
    const T1 = tensions[0];

    let answer = "Need v1, T1, and v2.";
    if (v1 && v2 && T1) {
      const T2 = T1 * Math.pow(v2 / v1, 2);
      answer = `T₂ = T₁(v₂/v₁)²\nT₂ = ${T1}(${v2}/${v1})²\nT₂ = ${nice(T2)} N\n\nFinal Answer: ${nice(T2)} N`;
    }

    return makeResult({
      topic: "Module 1 / Ch. 16: Wave Speed on a String",
      givens,
      unknown: "New tension T₂",
      formula: "v=√(T/μ), so T₂=T₁(v₂/v₁)²",
      steps: "Same string means μ is constant. Since v depends on √T, tension depends on speed squared.",
      answer,
      trap: "Square the speed ratio.",
      memory: "String tension problems use v squared.",
    });
  }

  if (hasAny(lower, ["transverse", "longitudinal"])) {
    return makeResult({
      topic: "Module 1 / Ch. 16: Wave Types",
      givens,
      unknown: "Wave type",
      formula: "Transverse = perpendicular; longitudinal = parallel",
      steps: "Ask how the medium moves compared to the wave direction.",
      answer: "Transverse: perpendicular. Longitudinal: parallel. Sound in air is longitudinal.",
      trap: "Do not confuse wave travel direction with particle motion.",
      memory: "Transverse turns sideways; longitudinal lines up.",
    });
  }

  if (hasAny(lower, ["y(x,t)", "kx", "omega", "phase", "sin"])) {
    return makeResult({
      topic: "Module 1 / Ch. 16: Sinusoidal Waves",
      givens,
      unknown: "A, k, ω, phase, speed, wavelength, or frequency",
      formula: "y(x,t)=A sin(kx−ωt+φ)",
      steps: "A=amplitude, k=2π/λ, ω=2πf, v=ω/k=fλ.",
      answer: "Use λ=2π/k, f=ω/(2π), and v=ω/k.",
      trap: "k is position; ω is time.",
      memory: "k = space. omega = time.",
    });
  }

  if (hasAny(lower, ["doppler", "ambulance", "siren", "blue shift", "red shift"])) {
    return makeResult({
      topic: "Module 1 / Ch. 16: Doppler Effect",
      givens,
      unknown: "Observed frequency",
      formula: "f′ = f(v ± vobs)/(v ∓ vsource)",
      steps: "Moving together raises frequency. Moving apart lowers frequency.",
      answer: "Toward = higher pitch/frequency. Away = lower pitch/frequency.",
      trap: "Do not memorize signs blindly. Predict up or down first.",
      memory: "Toward = tighter waves = higher frequency.",
    });
  }

  if (hasAny(lower, ["light", "wavelength", "nm", "index of refraction"])) {
    const nm = numsBefore(text, "nm\\b");
    let answer = "Use f=c/λ and convert nm to m.";
    if (lower.includes("450") && lower.includes("650")) {
      answer =
        `Blue: f=${(3e8 / 450e-9).toExponential(3)} Hz\n` +
        `Red: f=${(3e8 / 650e-9).toExponential(3)} Hz\n` +
        `Index: n=650/450=${nice(650 / 450)}`;
    } else if (nm[0]) {
      answer = `λ=${nm[0]} nm = ${nm[0]}×10⁻⁹ m\nf=c/λ=${(3e8 / (nm[0] * 1e-9)).toExponential(3)} Hz`;
    }

    return makeResult({
      topic: "Module 3 / Ch. 31: Light and Refraction",
      givens,
      unknown: "Frequency or index of refraction",
      formula: "c=fλ, n=λvacuum/λmaterial",
      steps: "Convert nm to meters. Frequency stays constant in a material.",
      answer,
      trap: "nm must become meters.",
      memory: "Refraction changes speed/wavelength, not frequency.",
    });
  }

  if (hasAny(lower, ["plastic balls", "copper ball", "test charge", "weakly attracted", "strongly attracted", "strongly repelled"])) {
    return makeResult({
      topic: "Module 1 / Ch. 23: Polarization",
      givens,
      unknown: "Attractive, repulsive, or neither",
      formula: "Like repel; opposites attract; neutral objects can polarize.",
      steps: "Strong repulsion from positive test charge means positive. Weak attraction usually means neutral insulator. Neutral conductor can strongly attract.",
      answer: "A negative plastic, B positive plastic, C neutral plastic, D neutral copper. A-B attractive, A-C weak attractive, A-D attractive, C-D neither.",
      trap: "Neutral can still attract by polarization.",
      memory: "Conductors polarize strongly; insulators weakly.",
    });
  }

  if (hasAny(lower, ["rod", "end a", "end b", "negative charge", "many contacts", "several contacts"])) {
    return makeResult({
      topic: "Module 1 / Ch. 23: Conductors vs Insulators",
      givens,
      unknown: "Charge arrangement or force",
      formula: "Conductor spreads charge; insulator traps charge.",
      steps: "First approach polarizes and attracts. After contact, electrons transfer. Conductor spreads; insulator localizes.",
      answer: "Plastic: negative charge stays near end A. Conductor: negative charge spreads across both ends. Negative ball later gets repelled by negative charged ends.",
      trap: "Identify conductor vs insulator first.",
      memory: "Conductor = charge cruises. Insulator = stuck.",
    });
  }

  if (hasAny(lower, ["particle 0", "q_0", "d_1"])) {
    if (hasAny(lower, ["particle 3", "q_3", "d_2, d_2"])) {
      return makeResult({
        topic: "Module 1 / Ch. 22: 3D Coulomb Vector",
        givens,
        unknown: "i, j, k components",
        formula: "F=kq₀q₃/r²",
        steps: "Particle 3 at (0,d₂,d₂), so r=√2 d₂. Repulsion points −j and −k equally.",
        answer: "i: 0\nj: −k*q_0*q_3/(2*sqrt(2)*d_2^2)\nk: −k*q_0*q_3/(2*sqrt(2)*d_2^2)",
        trap: "The component split adds √2.",
        memory: "Equal y and z means equal j and k.",
      });
    }

    if (hasAny(lower, ["ratio", "no net force", "balance", "d_1 divided by d_2"])) {
      return makeResult({
        topic: "Module 1 / Ch. 22: Balance Coulomb Forces",
        givens,
        unknown: "d₁/d₂",
        formula: "kq₀q₁/d₁² = kq₀q₂/d₂²",
        steps: "Set magnitudes equal. Cancel k and q₀. Take square root.",
        answer: "d₁/d₂ = sqrt(q₁/q₂)",
        trap: "k and q₀ cancel.",
        memory: "Balance = set forces equal.",
      });
    }

    if (hasAny(lower, ["particle 2", "q_2", "negative q 2", "third"])) {
      return makeResult({
        topic: "Module 1 / Ch. 22: Net Coulomb Force",
        givens,
        unknown: "i, j, k components",
        formula: "Superposition",
        steps: "Positive q1 above q0 repels downward. Negative q2 above q0 attracts upward.",
        answer: "i: 0\nj: −k*q_0*q_1/d_1^2 + k*q_0*q_2/d_2^2\nk: 0",
        trap: "Direction gives the sign.",
        memory: "Like repel away; opposites pull toward.",
      });
    }

    return makeResult({
      topic: "Module 1 / Ch. 22: Coulomb Vector",
      givens,
      unknown: "i, j, k components",
      formula: "F=kq₀q₁/r²",
      steps: "Positive q1 above positive q0 repels q0 downward.",
      answer: "i: 0\nj: −k*q_0*q_1/d_1^2\nk: 0",
      trap: "Direction matters.",
      memory: "Charge above pushes same-sign origin charge down.",
    });
  }

  if (hasAny(lower, ["electric field", "plastic bead", "charged to", "nc", "cm from"])) {
    const qNc = numsBefore(text, "nc")[0];
    const cm = numsBefore(text, "cm")[0];
    let answer = "Use E=k|q|/r².";
    if (qNc && cm) {
      const q = Math.abs(qNc) * 1e-9;
      const r = cm / 100;
      const E = K * q / (r * r);
      const direction = hasAny(lower, ["minus", "-"]) ? "toward the bead" : "away from the bead";
      answer = `E=${E.toExponential(3)} N/C\nDirection: ${direction}`;
    }
    return makeResult({
      topic: "Module 1 / Ch. 23: Electric Field of Point Charge",
      givens,
      unknown: "Field strength or direction",
      formula: "E=k|q|/r²",
      steps: "Convert nC to C and cm to m.",
      answer,
      trap: "Field points toward negative and away from positive.",
      memory: "Positive pushes out; negative pulls in.",
    });
  }

  if (hasAny(lower, ["finite charged wire", "wire of length", "linear charge density", "point p"])) {
    return makeResult({
      topic: "Module 1 / Ch. 24: Finite Charged Wire",
      givens,
      unknown: "Direction or magnitude of E",
      formula: "E=2kλL/(d√(d²+L²))",
      steps: "Symmetry cancels x-components. y-components add.",
      answer: "Direction: +j\nMagnitude: 2*k*lambda*L/(d*sqrt(d^2+L^2))",
      trap: "Do not include x components.",
      memory: "Symmetry kills sideways.",
    });
  }

  if (hasAny(lower, ["uniformly charged ring", "ring in the xy", "z axis", "radius a"])) {
    return makeResult({
      topic: "Module 1 / Ch. 24: Charged Ring Field",
      givens,
      unknown: "Field, direction, or SHM",
      formula: "E(z)=kqz/(z²+a²)^(3/2)",
      steps: "Symmetry cancels x/y. Only z survives. Use safe denominator if Mastering rejects fractional power.",
      answer: "Direction: parallel to z-axis\nE(z)=k*q*z/((z^2+a^2)*sqrt(z^2+a^2))\nω=sqrt(k*q*q_0/(m*a^3))",
      trap: "Mastering may reject ^(3/2).",
      memory: "Ring axis: only z lives.",
    });
  }

  if (hasAny(lower, ["parallel-plate capacitor", "diameter electrodes", "charge on each electrode"])) {
    return makeResult({
      topic: "Module 2 / Ch. 26: Parallel-Plate Charge",
      givens,
      unknown: "Charge Q",
      formula: "Q=ε₀AE",
      steps: "Find plate area A=πr². Use Q=ε₀AE.",
      answer: "For 6.0 cm diameter and E=6.0×10⁶ N/C: Q=150 nC.",
      trap: "Spacing is not needed if E is given.",
      memory: "Plate charge = epsilon area field.",
    });
  }

  if (hasAny(lower, ["proton", "oppositely charged parallel plates", "released from rest", "strikes"])) {
    return makeResult({
      topic: "Module 1 / Ch. 23/24: Proton Between Plates",
      givens,
      unknown: "Electric field or final speed",
      formula: "d=½at², E=ma/q, v=at",
      steps: "Use kinematics first to find acceleration. Then use electric force.",
      answer: "For d=1.50 cm and t=1.46×10⁻⁶ s: E=147 N/C, v=2.05×10⁴ m/s.",
      trap: "Watch powers of ten.",
      memory: "Motion first, field second.",
    });
  }

  if (hasAny(lower, ["flux", "gauss", "enclosed charge", "closed surface"])) {
    return makeResult({
      topic: "Module 1 / Ch. 24: Flux and Gauss's Law",
      givens,
      unknown: "Flux, field, or enclosed charge",
      formula: "Φ=EAcosθ and Φ=qenc/ε₀",
      steps: "Flat surface uses EAcosθ. Closed surface uses enclosed charge.",
      answer: "Only enclosed charge controls net flux.",
      trap: "Outside charges do not change net flux.",
      memory: "Gauss cares what is inside the bubble.",
    });
  }

  if (hasAny(lower, ["voltage", "potential", "potential energy", "volt"])) {
    return makeResult({
      topic: "Module 2 / Ch. 25: Electric Potential",
      givens,
      unknown: "V, U, or q",
      formula: "V=U/q, U=qV",
      steps: "Voltage is energy per charge.",
      answer: "Use V=U/q or U=qV.",
      trap: "Potential is scalar; field is vector.",
      memory: "Voltage = energy per charge.",
    });
  }

  if (hasAny(lower, ["capacitor", "capacitance", "farad"])) {
    return makeResult({
      topic: "Module 2 / Ch. 26: Capacitance",
      givens,
      unknown: "C, Q, or ΔV",
      formula: "C=Q/ΔV",
      steps: "Capacitance is charge stored per volt.",
      answer: "Use C=Q/ΔV, Q=CΔV, or ΔV=Q/C.",
      trap: "Capacitance is not charge.",
      memory: "Capacitor stores charge per volt.",
    });
  }

  if (hasAny(lower, ["current", "resistance", "resistor", "ohm", "circuit", "power", "series", "parallel"])) {
    return makeResult({
      topic: "Module 2 / Ch. 27/28: Circuits",
      givens,
      unknown: "V, I, R, P, or equivalent resistance",
      formula: "V=IR, P=IV, series add, parallel reciprocals",
      steps: "Identify series vs parallel first. Then use Ohm's Law.",
      answer: "Series: same current, resistors add. Parallel: same voltage, reciprocals.",
      trap: "Do not add parallel resistors directly.",
      memory: "Series same current. Parallel same voltage.",
    });
  }

  if (hasAny(lower, ["magnetic", "tesla", "moving charge", "b field"])) {
    return makeResult({
      topic: "Module 3 / Ch. 29: Magnetic Force",
      givens,
      unknown: "Magnetic force",
      formula: "F=qvBsinθ",
      steps: "Charge must be moving. Force is max at 90° and zero at 0°.",
      answer: "Use F=qvBsinθ.",
      trap: "Stationary charge has no magnetic force.",
      memory: "Magnetism needs motion.",
    });
  }

  if (hasAny(lower, ["induction", "emf", "faraday", "lenz", "magnetic flux"])) {
    return makeResult({
      topic: "Module 3 / Ch. 30: Induction",
      givens,
      unknown: "Induced emf",
      formula: "ε=−NΔΦB/Δt",
      steps: "Changing magnetic flux creates emf. Lenz gives direction.",
      answer: "Use |ε|=NΔΦB/Δt for magnitude.",
      trap: "No changing flux means no induced emf.",
      memory: "Change flux, get emf.",
    });
  }

  return makeResult({
    topic: "Universal Physics Breakdown",
    givens,
    unknown: "The thing the question asks for",
    formula: "Not confidently classified yet.",
    steps: "Circle clue words. List givens. Identify unknown. Pick chapter/model. Check units.",
    answer: "I will not invent an answer if the problem type is unclear. Paste answer choices too.",
    trap: "Full wording matters.",
    memory: "Givens → Unknown → Model → Formula.",
  });
}

function loadProgress() {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem("physicsMemoryProgressV2");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("physicsMemoryProgressV2", JSON.stringify(progress));
    }
  } catch {}
}

function Button({ title, onPress, color }) {
  return (
    <Pressable style={[styles.button, { backgroundColor: color || COLORS.blue }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

function Card({ children, color }) {
  return <View style={[styles.card, color ? { borderColor: color } : null]}>{children}</View>;
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedModule, setSelectedModule] = useState(MODULES[0]);
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[16]);
  const [problem, setProblem] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [bossIndex, setBossIndex] = useState(0);
  const [bossMessage, setBossMessage] = useState("");
  const [progress, setProgress] = useState(loadProgress);

  const solved = useMemo(() => solveHomework(problem), [problem]);

  const moduleCards = MEMORY_CARDS.filter((c) => c.module === selectedModule.id);
  const chapterCards = MEMORY_CARDS.filter((c) => c.chapter === selectedChapter.id);
  const activeCards = screen === "chapterMemory" ? chapterCards : moduleCards.length ? moduleCards : MEMORY_CARDS;
  const currentCard = activeCards[cardIndex % activeCards.length];

  const moduleBoss = BOSS_QUESTIONS.filter((q) => q.module === selectedModule.id);
  const activeBoss = moduleBoss.length ? moduleBoss : BOSS_QUESTIONS;
  const boss = activeBoss[bossIndex % activeBoss.length];

  function markMemory(level) {
    const key = `${currentCard.chapter}-${currentCard.front}`;
    const next = {
      ...progress,
      [key]: {
        level,
        lastSeen: Date.now(),
        misses: level === "again" ? ((progress[key]?.misses || 0) + 1) : (progress[key]?.misses || 0),
      },
    };
    setProgress(next);
    saveProgress(next);
    setShowAnswer(false);
    setCardIndex((i) => i + 1);
  }

  const missed = Object.entries(progress).filter(([, v]) => v.level === "again").length;
  const mastered = Object.entries(progress).filter(([, v]) => v.level === "easy").length;

  if (screen === "home") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Physics Final Boss</Text>
        <Text style={styles.subtitle}>
          Module-based memory app: paste homework, drill formulas, fight boss rounds, and keep the concepts in your brain.
        </Text>

        <Card color={COLORS.yellow}>
          <Text style={styles.sectionTitle}>Memory Stats</Text>
          <Text style={styles.body}>Mastered: {mastered}</Text>
          <Text style={styles.body}>Needs review: {missed}</Text>
          <Text style={styles.body}>Rule: missed cards keep coming back.</Text>
        </Card>

        <Button title="Paste Homework Solver" onPress={() => setScreen("solver")} color={COLORS.green} />
        <Button title="Full Formula Map" onPress={() => setScreen("formulas")} color={COLORS.purple} />
        <Button title="Exam Cram Plan" onPress={() => setScreen("cram")} color={COLORS.blue} />

        <Text style={styles.sectionTitle}>Pick a Module</Text>
        {MODULES.map((mod) => (
          <Pressable
            key={mod.id}
            style={styles.moduleButton}
            onPress={() => {
              setSelectedModule(mod);
              setCardIndex(0);
              setBossIndex(0);
              setScreen("module");
            }}
          >
            <Text style={styles.moduleTitle}>{mod.title}</Text>
            <Text style={styles.body}>{mod.dates}</Text>
            <Text style={styles.body}>{mod.mission}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  if (screen === "module") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{selectedModule.title}</Text>
        <Text style={styles.subtitle}>{selectedModule.mission}</Text>

        <Card color={COLORS.yellow}>
          <Text style={styles.sectionTitle}>Assessment Target</Text>
          <Text style={styles.body}>{selectedModule.exam}</Text>
        </Card>

        <Button title="Module Memory Cards" onPress={() => setScreen("moduleMemory")} color={COLORS.yellow} />
        <Button title="Module Boss Game" onPress={() => setScreen("moduleBoss")} color={COLORS.red} />
        <Button title="Paste Homework From This Module" onPress={() => setScreen("solver")} color={COLORS.green} />

        <Text style={styles.sectionTitle}>Chapters in this Module</Text>
        {selectedModule.chapters.map((id) => {
          const ch = CHAPTERS[id];
          return (
            <Pressable
              key={id}
              style={[styles.chapterButton, { borderColor: ch.color }]}
              onPress={() => {
                setSelectedChapter(ch);
                setCardIndex(0);
                setScreen("chapter");
              }}
            >
              <Text style={styles.chapterTitle}>{ch.title}</Text>
              <Text style={styles.answer}>{ch.formula}</Text>
            </Pressable>
          );
        })}

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "chapter") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{selectedChapter.title}</Text>

        <Card color={selectedChapter.color}>
          <Text style={styles.label}>Core Formula</Text>
          <Text style={styles.answer}>{selectedChapter.formula}</Text>

          <Text style={styles.label}>What you need to remember</Text>
          {selectedChapter.goals.map((g) => (
            <Text key={g} style={styles.body}>- {g}</Text>
          ))}
        </Card>

        <Button title="Chapter Memory Cards" onPress={() => setScreen("chapterMemory")} color={COLORS.yellow} />
        <Button title="Paste Homework From This Chapter" onPress={() => setScreen("solver")} color={COLORS.green} />
        <Button title="Back to Module" onPress={() => setScreen("module")} />
      </ScrollView>
    );
  }

  if (screen === "solver") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Paste Homework Solver</Text>
        <Text style={styles.subtitle}>Paste the full problem. If it recognizes the pattern, it solves it. If not, it gives a safe breakdown.</Text>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Paste homework question here..."
          placeholderTextColor="#94a3b8"
          value={problem}
          onChangeText={setProblem}
        />

        <Card color={COLORS.green}>
          <Text style={styles.sectionTitle}>{solved.topic}</Text>

          <Text style={styles.label}>Givens</Text>
          <Text style={styles.body}>{solved.givens.length ? solved.givens.join(" | ") : "No numbers detected yet."}</Text>

          <Text style={styles.label}>Unknown</Text>
          <Text style={styles.body}>{solved.unknown}</Text>

          <Text style={styles.label}>Formula</Text>
          <Text style={styles.body}>{solved.formula}</Text>

          <Text style={styles.label}>Steps</Text>
          <Text style={styles.body}>{solved.steps}</Text>

          <Text style={styles.label}>Answer / Strategy</Text>
          <Text style={styles.answer}>{solved.answer}</Text>

          <Text style={styles.label}>Trap Check</Text>
          <Text style={styles.trap}>{solved.trap}</Text>

          <Text style={styles.label}>Memory Hook</Text>
          <Text style={styles.memory}>{solved.memory}</Text>
        </Card>

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "moduleMemory" || screen === "chapterMemory") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{screen === "chapterMemory" ? selectedChapter.short : selectedModule.title} Memory Cards</Text>
        <Text style={styles.subtitle}>Say the answer out loud before pressing show. That is the memory rep.</Text>

        <Card color={COLORS.yellow}>
          <Text style={styles.label}>Ch. {currentCard.chapter}</Text>
          <Text style={styles.bigQuestion}>{currentCard.front}</Text>

          {showAnswer ? (
            <>
              <Text style={styles.answer}>{currentCard.back}</Text>
              <Button title="Again - I missed it" onPress={() => markMemory("again")} color={COLORS.red} />
              <Button title="Good - I got it" onPress={() => markMemory("good")} color={COLORS.blue} />
              <Button title="Easy - I own this" onPress={() => markMemory("easy")} color={COLORS.green} />
            </>
          ) : (
            <Button title="Show Answer" onPress={() => setShowAnswer(true)} color={COLORS.yellow} />
          )}
        </Card>

        <Button title="Back" onPress={() => setScreen(screen === "chapterMemory" ? "chapter" : "module")} />
      </ScrollView>
    );
  }

  if (screen === "moduleBoss") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{selectedModule.title} Boss Game</Text>
        <Text style={styles.subtitle}>Fast recall. Pick the answer, read the feedback, then keep moving.</Text>

        <Card color={COLORS.red}>
          <Text style={styles.label}>Round {bossIndex + 1}</Text>
          <Text style={styles.bigQuestion}>{boss.q}</Text>

          {boss.choices.map((choice) => (
            <Pressable
              key={choice}
              style={styles.choice}
              onPress={() => {
                if (choice === boss.a) {
                  setBossMessage("Correct. " + boss.teach);
                } else {
                  setBossMessage("Not yet. " + boss.teach);
                }
              }}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {bossMessage ? <Text style={styles.answer}>{bossMessage}</Text> : null}

          <Button
            title="Next Boss Round"
            onPress={() => {
              setBossMessage("");
              setBossIndex((i) => i + 1);
            }}
            color={COLORS.red}
          />
        </Card>

        <Button title="Back to Module" onPress={() => setScreen("module")} />
      </ScrollView>
    );
  }

  if (screen === "formulas") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Full Formula Map</Text>

        {MODULES.map((mod) => (
          <Card key={mod.id} color={COLORS.purple}>
            <Text style={styles.sectionTitle}>{mod.title}</Text>
            <Text style={styles.body}>{mod.mission}</Text>

            {mod.chapters.map((id) => {
              const ch = CHAPTERS[id];
              return (
                <View key={id} style={styles.formulaLine}>
                  <Text style={styles.chapterTitle}>{ch.title}</Text>
                  <Text style={styles.answer}>{ch.formula}</Text>
                </View>
              );
            })}
          </Card>
        ))}

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "cram") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Exam Cram Plan</Text>

        <Card color={COLORS.blue}>
          <Text style={styles.sectionTitle}>Daily Loop</Text>
          <Text style={styles.body}>1. Pick the current module.</Text>
          <Text style={styles.body}>2. Do 10 memory cards.</Text>
          <Text style={styles.body}>3. Paste 2 homework questions into Solver.</Text>
          <Text style={styles.body}>4. Do 5 Boss Game rounds.</Text>
          <Text style={styles.body}>5. Write missed formulas on your cheat sheet.</Text>
        </Card>

        <Card color={COLORS.yellow}>
          <Text style={styles.sectionTitle}>Cheat Sheet Format</Text>
          <Text style={styles.body}>Formula | clue words | units | trap | example</Text>
        </Card>

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen not found.</Text>
      <Button title="Back Home" onPress={() => setScreen("home")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 18,
    paddingBottom: 50,
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.sub,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.card2,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  body: {
    color: COLORS.sub,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
  },
  label: {
    color: COLORS.yellow,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  answer: {
    color: COLORS.green,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "800",
    marginBottom: 8,
  },
  trap: {
    color: COLORS.red,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "800",
  },
  memory: {
    color: COLORS.purple,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "800",
  },
  input: {
    backgroundColor: COLORS.card2,
    color: COLORS.text,
    minHeight: 150,
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
    textAlignVertical: "top",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  buttonText: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  moduleButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.blue,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  moduleTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },
  chapterButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  chapterTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 4,
  },
  bigQuestion: {
    color: COLORS.text,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "900",
    marginBottom: 14,
  },
  choice: {
    backgroundColor: COLORS.card2,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#475569",
  },
  choiceText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },
  formulaLine: {
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 10,
    marginTop: 10,
  },
});
