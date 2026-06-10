import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

/*
  PHYSICS FINAL BOSS
  CLEAN VISIBLE VERSION

  This version includes:
  - Visible Homework Problem Solver
  - Visible Tiny Animated Concept Clips
  - Deep chapter study guides
  - Formula map
  - Calc 3 toolkit
  - Guided solver
  - TBI-friendly Calm Mode
*/

const MODULES = [
  {
    title: "Module 1",
    dates: "6/08 - 6/24",
    focus: "Waves, charges, electric fields, and Gauss's Law",
    exam: "Module 1 Exam due 6/28",
    chapters: [16, 22, 23, 24],
  },
  {
    title: "Module 2",
    dates: "6/29 - 7/06",
    focus: "Voltage, capacitors, current, and circuits",
    exam: "Module 2 Exam on 7/06",
    chapters: [25, 26, 27, 28],
  },
  {
    title: "Module 3",
    dates: "7/08 - 7/20",
    focus: "Magnetism, induction, and electromagnetic waves",
    exam: "Module 3 Exam on 7/20",
    chapters: [29, 30, 31],
  },
  {
    title: "Module 4",
    dates: "7/22 - 8/02",
    focus: "Final topics and final review",
    exam: "Final Exam due 8/02",
    chapters: [33, 32],
  },
];

const FORMULAS = [
  ["Waves", "v = f × λ", "frequency, wavelength, period, wave speed"],
  ["Coulomb's Law", "F = k × q₁ × q₂ / r²", "charges, distance, electric force"],
  ["Electric Field", "E = F / q", "field, force, charge"],
  ["Electric Flux", "ΦE = E × A × cos(θ)", "flux, field, area, angle"],
  ["Gauss's Law", "ΦE = q_enc / ε₀", "closed surface, enclosed charge, symmetry"],
  ["Electric Potential", "V = U / q", "voltage, energy, charge"],
  ["Capacitance", "C = Q / ΔV", "capacitor, charge, voltage"],
  ["Ohm's Law", "V = I × R", "voltage, current, resistance"],
  ["Power", "P = I × V", "power, current, voltage"],
  ["Magnetic Force", "F = q × v × B × sin(θ)", "moving charge, magnetic field, angle"],
  ["Faraday's Law", "ε = -N × ΔΦB / Δt", "changing magnetic flux, coil, emf"],
];

const CALC3 = [
  ["Vectors", "A = ⟨Aₓ, Aᵧ, A_z⟩", "Fields and forces have direction. Treat them like arrows."],
  ["Magnitude", "|A| = √(Aₓ² + Aᵧ² + A_z²)", "Magnitude means how big a vector is."],
  ["Dot Product", "A · B = |A||B|cos(θ)", "Used for flux and work. It measures how much vectors line up."],
  ["Cross Product", "|A × B| = |A||B|sin(θ)", "Used for magnetic force. It measures perpendicular interaction."],
  ["Gradient", "E = -∇V", "Electric field points downhill from voltage."],
  ["Divergence", "∇ · E", "Used in Gauss's Law. It measures field spreading out."],
  ["Curl", "∇ × E", "Used in induction. It measures field swirl."],
  ["Surface Integral", "∬ E · dA", "Adds field through a surface. This is flux."],
  ["Line Integral", "∫ E · dr", "Adds field along a path. This connects to voltage and emf."],
];

const CHAPTERS = [
  {
    number: 16,
    title: "Traveling Waves",
    formula: "v = f × λ",
    objective: "Use wave speed, frequency, wavelength, period, amplitude, and Doppler ideas.",
    calm: "Waves carry energy. Frequency is how often. Wavelength is how long.",
    clues: ["wave", "frequency", "wavelength", "period", "amplitude", "sound", "light", "Doppler"],
    skills: [
      "Identify amplitude, wavelength, frequency, and period.",
      "Use v = f × λ.",
      "Use f = 1 / T.",
      "Understand Doppler shift.",
    ],
    traps: [
      "Amplitude is height, not wavelength.",
      "Frequency and period are opposites.",
      "Sound needs a medium; light does not.",
    ],
    example: ["Wave speed", "frequency and wavelength", "f = 10 Hz, λ = 2 m", "v", "v = f × λ", "v = 10 × 2", "20 m/s"],
    lessons: [
      ["🌊", "Wave Motion", "particle wiggles ↕", "energy travels →", "A wave carries energy forward."],
      ["📏", "Wavelength", "crest to crest", "one full cycle", "λ is cycle length, not height."],
      ["⏱️", "Frequency", "cycles per second", "Hz = 1/s", "Frequency is how often."],
      ["🧮", "Wave Formula", "v = f × λ", "speed = frequency × wavelength", "Use when f and λ appear."],
    ],
    cards: [
      ["What does a wave carry?", "Energy."],
      ["What is frequency?", "Cycles per second."],
      ["What is wavelength?", "Length of one full cycle."],
      ["What formula connects v, f, and λ?", "v = f × λ."],
    ],
    quiz: ["A wave has f and λ. What formula?", ["v = f × λ", "V = I × R", "C = Q / ΔV"], "v = f × λ"],
  },
  {
    number: 22,
    title: "Electric Charges and Forces",
    formula: "F = k × q₁ × q₂ / r²",
    objective: "Use charge behavior and Coulomb's Law to find electric force.",
    calm: "Same charges repel. Opposite charges attract. Distance matters a lot.",
    clues: ["charge", "q1", "q2", "distance", "force", "repel", "attract"],
    skills: [
      "Predict attraction or repulsion.",
      "Use Coulomb's Law.",
      "Square distance correctly.",
      "Use k = 9 × 10⁹.",
    ],
    traps: [
      "Always square r.",
      "Same signs repel.",
      "Opposite signs attract.",
    ],
    example: ["Electric force", "q₁, q₂, r", "q₁ = 2 C, q₂ = 3 C, r = 1 m", "F", "F = k × q₁ × q₂ / r²", "F = (9 × 10⁹)(2)(3) / 1²", "5.4 × 10¹⁰ N"],
    lessons: [
      ["➕➕", "Repulsion", "← q₁     q₂ →", "same signs push apart", "Same charges repel."],
      ["➕➖", "Attraction", "q₁ →   ← q₂", "opposite signs pull together", "Opposite charges attract."],
      ["📏", "Inverse Square", "r doubles", "force becomes 1/4", "Always square distance."],
      ["🧮", "Coulomb Force", "F = k × q₁ × q₂ / r²", "charge force", "Use q₁, q₂, and r."],
    ],
    cards: [
      ["Same charges do what?", "Repel."],
      ["Opposite charges do what?", "Attract."],
      ["What happens if r doubles?", "Force becomes 1/4 as big."],
      ["What is k?", "9 × 10⁹ N·m²/C²."],
    ],
    quiz: ["Two positive charges will...", ["Repel", "Attract", "Become neutral"], "Repel"],
  },
  {
    number: 23,
    title: "The Electric Field",
    formula: "E = F / q",
    objective: "Connect force, charge, and electric field.",
    calm: "Electric field is force per charge.",
    clues: ["electric field", "field", "force", "charge", "N/C"],
    skills: [
      "Use E = F / q.",
      "Use F = q × E.",
      "Know field direction uses a positive test charge.",
    ],
    traps: [
      "Field is not the same as force.",
      "Negative charges move opposite the field.",
    ],
    example: ["Electric field", "force and charge", "F = 12 N, q = 4 C", "E", "E = F / q", "E = 12 / 4", "3 N/C"],
    lessons: [
      ["👻", "Field Map", "charge creates arrows", "arrows show force direction", "Field is force per charge."],
      ["💪", "Force Per Charge", "E = F / q", "N/C", "Divide force by charge."],
      ["➕", "Direction", "positive follows field", "negative goes opposite", "Sign changes force direction."],
    ],
    cards: [
      ["What is electric field?", "Force per charge."],
      ["What is E = F / q used for?", "Finding electric field."],
      ["What charge defines field direction?", "Positive test charge."],
      ["What are units of E?", "N/C or V/m."],
    ],
    quiz: ["Electric field means...", ["Force per charge", "Energy per charge", "Power"], "Force per charge"],
  },
  {
    number: 24,
    title: "Gauss's Law",
    formula: "ΦE = E × A × cos(θ)",
    objective: "Understand electric flux and enclosed charge.",
    calm: "Flux means field through area. Symmetry makes it easier.",
    clues: ["flux", "area", "angle", "surface", "gauss", "enclosed", "symmetry"],
    skills: [
      "Use ΦE = E × A × cos(θ).",
      "Know cos(0°) = 1.",
      "Know cos(90°) = 0.",
      "Recognize enclosed charge.",
    ],
    traps: [
      "Flux is not field.",
      "Only perpendicular field counts.",
      "Gauss cares about enclosed charge.",
    ],
    example: ["Electric flux", "E, A, θ", "E = 10 N/C, A = 2 m², θ = 0°", "ΦE", "ΦE = E × A × cos(θ)", "ΦE = 10 × 2 × 1", "20 N·m²/C"],
    lessons: [
      ["➡️", "Flux", "field arrows", "through area", "Flux counts field through surface."],
      ["📐", "Angle", "straight = maximum", "sideways = zero", "Use cos(θ)."],
      ["🧊", "Gauss", "closed surface", "charge inside", "Enclosed charge controls flux."],
    ],
    cards: [
      ["What is flux?", "Field through area."],
      ["When is flux maximum?", "θ = 0°."],
      ["When is flux zero?", "θ = 90°."],
      ["Gauss's Law cares about what?", "Enclosed charge."],
    ],
    quiz: ["Flux measures...", ["Field through area", "Voltage", "Current"], "Field through area"],
  },
  {
    number: 25,
    title: "Electric Potential",
    formula: "V = U / q",
    objective: "Use voltage as energy per charge.",
    calm: "Voltage is energy per charge.",
    clues: ["potential", "voltage", "energy", "charge", "joule"],
    skills: ["Use V = U / q.", "Use U = q × V.", "Know potential is scalar."],
    traps: ["Potential is not electric field.", "Voltage is potential difference."],
    example: ["Electric potential", "energy and charge", "U = 10 J, q = 2 C", "V", "V = U / q", "V = 10 / 2", "5 V"],
    lessons: [
      ["🔋", "Voltage", "energy / charge", "V = U / q", "Voltage is energy per coulomb."],
      ["⛰️", "Potential", "energy hill", "scalar value", "Potential has no direction."],
    ],
    cards: [
      ["What is voltage?", "Energy per charge."],
      ["Is potential scalar or vector?", "Scalar."],
      ["What is U = q × V for?", "Energy."],
    ],
    quiz: ["Electric potential is...", ["Energy per charge", "Force per charge", "Current"], "Energy per charge"],
  },
  {
    number: 26,
    title: "Potential and Field",
    formula: "C = Q / ΔV",
    objective: "Understand capacitance and charge storage.",
    calm: "Capacitors store charge and energy.",
    clues: ["capacitor", "capacitance", "charge", "voltage", "dielectric"],
    skills: ["Use C = Q / ΔV.", "Use Q = C × ΔV.", "Know dielectrics increase capacitance."],
    traps: ["Capacitance is not charge.", "Use voltage difference ΔV."],
    example: ["Capacitance", "charge and voltage", "Q = 6 C, ΔV = 3 V", "C", "C = Q / ΔV", "C = 6 / 3", "2 F"],
    lessons: [
      ["🥫", "Capacitor", "+ plate   - plate", "stores charge", "Capacitors store charge and energy."],
      ["🔋", "Capacitance", "C = Q / ΔV", "charge per volt", "More C stores more charge."],
      ["🧈", "Dielectric", "material between plates", "C increases", "Dielectrics usually increase capacitance."],
    ],
    cards: [
      ["What does a capacitor store?", "Charge and energy."],
      ["What is capacitance?", "Charge per volt."],
      ["What does a dielectric do?", "Increases capacitance."],
    ],
    quiz: ["Capacitance means charge per...", ["Volt", "Newton", "Hertz"], "Volt"],
  },
  {
    number: 27,
    title: "Current and Resistance",
    formula: "V = I × R",
    objective: "Use Ohm's Law to connect voltage, current, and resistance.",
    calm: "Voltage pushes. Current flows. Resistance blocks.",
    clues: ["current", "resistance", "voltage", "ohm", "amp"],
    skills: ["Use V = I × R.", "Use I = V / R.", "Use R = V / I."],
    traps: ["Current is not voltage.", "More resistance means less current."],
    example: ["Current", "voltage and resistance", "V = 12 V, R = 4 Ω", "I", "I = V / R", "I = 12 / 4", "3 A"],
    lessons: [
      ["🔋", "Voltage", "battery push", "V", "Voltage pushes charge."],
      ["🚗", "Current", "charge traffic →", "I", "Current is charge per time."],
      ["🚧", "Resistance", "narrow road", "R", "Resistance blocks current."],
      ["🧮", "Ohm's Law", "V = I × R", "I = V / R", "Use when V, I, R appear."],
    ],
    cards: [
      ["What is current?", "Charge flow per time."],
      ["What is resistance?", "Opposition to current."],
      ["What is Ohm's Law?", "V = I × R."],
    ],
    quiz: ["A problem gives V and R. Find...", ["Current", "Wavelength", "Flux"], "Current"],
  },
  {
    number: 28,
    title: "Fundamentals of Circuits",
    formula: "P = I × V",
    objective: "Use resistor rules, power, and Kirchhoff's laws.",
    calm: "Kirchhoff's laws are circuit traffic rules.",
    clues: ["circuit", "series", "parallel", "junction", "loop", "power"],
    skills: ["Use P = I × V.", "Series resistors add.", "Parallel resistors use reciprocals."],
    traps: ["Series has same current.", "Parallel has same voltage."],
    example: ["Power", "current and voltage", "I = 3 A, V = 12 V", "P", "P = I × V", "P = 3 × 12", "36 W"],
    lessons: [
      ["🚦", "Junction Rule", "current in", "current out", "Current is conserved."],
      ["🔁", "Loop Rule", "voltage gains", "voltage drops", "Energy is conserved."],
      ["📏", "Series", "R_total = R₁ + R₂", "same current", "Series resistors add."],
      ["🌀", "Parallel", "1/R_total = 1/R₁ + 1/R₂", "same voltage", "Parallel uses reciprocals."],
    ],
    cards: [
      ["Junction rule conserves what?", "Current."],
      ["Loop rule conserves what?", "Energy."],
      ["What is same in series?", "Current."],
      ["What is same in parallel?", "Voltage."],
    ],
    quiz: ["Junction rule says...", ["Current in = current out", "Voltage is zero", "Resistance disappears"], "Current in = current out"],
  },
  {
    number: 29,
    title: "The Magnetic Field",
    formula: "F = q × v × B × sin(θ)",
    objective: "Find magnetic force on moving charges.",
    calm: "Magnetic fields push moving charges.",
    clues: ["magnetic", "B", "tesla", "moving charge", "velocity", "angle"],
    skills: ["Use F = q × v × B × sin(θ).", "Know θ = 90° is max.", "Know θ = 0° is zero."],
    traps: ["Stationary charge has no magnetic force.", "Only perpendicular motion counts."],
    example: ["Magnetic force", "q, v, B, θ", "q = 2 C, v = 3 m/s, B = 4 T, θ = 90°", "F", "F = q × v × B × sin(θ)", "F = 2 × 3 × 4 × 1", "24 N"],
    lessons: [
      ["🧍", "No Motion", "v = 0", "F = 0", "Stationary charge has no magnetic force."],
      ["🏃", "Moving Charge", "v through B", "force appears", "Magnetic force needs motion."],
      ["📐", "Angle", "90° max", "0° zero", "Use sin(θ)."],
      ["🧲", "Magnetic Force", "F = q × v × B × sin(θ)", "perpendicular motion", "Only perpendicular motion counts."],
    ],
    cards: [
      ["What does magnetic force require?", "Moving charge."],
      ["What angle gives max force?", "90°."],
      ["What angle gives zero force?", "0°."],
    ],
    quiz: ["Stationary charge in B field feels...", ["No magnetic force", "Maximum force", "Voltage"], "No magnetic force"],
  },
  {
    number: 30,
    title: "Electromagnetic Induction",
    formula: "ε = -N × ΔΦB / Δt",
    objective: "Use Faraday's Law and Lenz's Law.",
    calm: "Changing magnetic flux creates voltage.",
    clues: ["induction", "emf", "faraday", "lenz", "coil", "flux"],
    skills: ["Use |ε| = N × ΔΦB / Δt.", "Know Lenz's Law opposes change.", "Know changing flux is required."],
    traps: ["No changing flux means no emf.", "Negative sign is direction."],
    example: ["Induced emf", "turns, flux, time", "N = 10, ΔΦB = 0.20 Wb, Δt = 0.50 s", "ε", "|ε| = N × ΔΦB / Δt", "|ε| = 10 × 0.20 / 0.50", "4 V"],
    lessons: [
      ["🧲", "Move Magnet", "B changes", "coil reacts", "Changing magnetic field matters."],
      ["🌀", "Flux Change", "ΔΦB", "through coil", "Induction needs changing flux."],
      ["⚡", "Induced EMF", "ε = -N × ΔΦB / Δt", "voltage appears", "Faster change means bigger emf."],
      ["🙅", "Lenz's Law", "opposes change", "negative sign", "Induced current fights the change."],
    ],
    cards: [
      ["What causes induction?", "Changing magnetic flux."],
      ["What does Faraday's Law find?", "Induced emf."],
      ["What does Lenz's Law say?", "Opposes the change."],
    ],
    quiz: ["Changing magnetic flux creates...", ["emf", "mass", "gravity"], "emf"],
  },
  {
    number: 31,
    title: "Electromagnetic Waves",
    formula: "c = f × λ",
    objective: "Understand light as an electromagnetic wave.",
    calm: "Light is an electromagnetic wave.",
    clues: ["light", "EM wave", "frequency", "wavelength", "speed of light"],
    skills: ["Use c = f × λ.", "Use c = 3 × 10⁸ m/s.", "Solve for λ or f."],
    traps: ["Do not use sound speed for light.", "EM waves travel through vacuum."],
    example: ["Light wavelength", "frequency and speed of light", "f = 6 × 10¹⁴ Hz, c = 3 × 10⁸ m/s", "λ", "λ = c / f", "λ = 3 × 10⁸ / 6 × 10¹⁴", "5 × 10⁻⁷ m"],
    lessons: [
      ["⚡", "Electric Field", "E wiggles", "changing", "EM waves include electric fields."],
      ["🧲", "Magnetic Field", "B wiggles", "changing", "E and B travel together."],
      ["📡", "EM Wave", "E + B", "travels through vacuum", "Light is an EM wave."],
      ["💡", "Light Equation", "c = f × λ", "speed of light", "Use c for EM waves."],
    ],
    cards: [
      ["What is light?", "An electromagnetic wave."],
      ["Can EM waves travel in vacuum?", "Yes."],
      ["What is c?", "Speed of light."],
    ],
    quiz: ["Light is...", ["An EM wave", "Only sound", "A circuit"], "An EM wave"],
  },
  {
    number: 33,
    title: "Chapter 33 Final Topic",
    formula: "Clues → Givens → Unknown → Formula",
    objective: "Use the universal problem-solving method for the final topic.",
    calm: "Use Canvas to fill exact formulas.",
    clues: ["Canvas", "homework", "quiz", "final topic"],
    skills: ["Find clue words.", "List givens.", "Pick formula.", "Check units."],
    traps: ["Do not panic.", "Use the method."],
    example: ["Unknown topic", "clue words", "givens with units", "unknown", "formula from Canvas", "plug in", "answer with units"],
    lessons: [["🧠", "Universal Method", "clues", "formula", "Clue words choose the formula."]],
    cards: [["First move?", "Circle clue words."], ["Best source?", "Canvas and homework."]],
    quiz: ["First move?", ["Circle clues", "Panic", "Guess"], "Circle clues"],
  },
  {
    number: 32,
    title: "Chapter 32 Final Topic",
    formula: "Final Review Mode",
    objective: "Review all formulas by clue words.",
    calm: "This is the last new-content sprint.",
    clues: ["final", "review", "exam", "homework"],
    skills: ["Group formulas.", "Redo missed problems.", "Check units."],
    traps: ["Do not study randomly.", "Do not skip units."],
    example: ["Final review", "clue words", "givens", "unknown", "formula", "plug in", "check units"],
    lessons: [["🏆", "Final Review", "clues → formulas", "units → answer", "Same method every time."]],
    cards: [["Best final strategy?", "Match clue words to formulas."], ["What should every answer have?", "Units."]],
    quiz: ["Best final strategy?", ["Match clues to formulas", "Guess", "Ignore units"], "Match clues to formulas"],
  },
];

const SOLVER_LABELS = ["Problem Type", "Clue Words", "Knowns", "Unknown", "Formula", "Plug In", "Answer"];

const SMART_RULES = [
  {
    topic: "Waves",
    keywords: ["wave", "frequency", "wavelength", "lambda", "period", "speed", "hz", "hertz"],
    formula: "v = f × λ",
    steps: ["Find f, λ, v, or T.", "If T is given, use f = 1 / T.", "Use v = f × λ.", "Rearrange first.", "Check units."],
  },
  {
    topic: "Coulomb's Law",
    keywords: ["charge", "q1", "q2", "coulomb", "force", "distance", "repel", "attract"],
    formula: "F = k × q₁ × q₂ / r²",
    steps: ["Find q₁, q₂, and r.", "Use k = 9 × 10⁹.", "Square r.", "Plug into Coulomb's Law.", "Decide attract or repel."],
  },
  {
    topic: "Electric Field",
    keywords: ["electric field", "field", "force per charge", "n/c"],
    formula: "E = F / q",
    steps: ["Find F and q.", "Use E = F / q.", "Or use F = q × E.", "Check units N/C."],
  },
  {
    topic: "Flux / Gauss",
    keywords: ["flux", "gauss", "area", "surface", "angle", "enclosed", "symmetry"],
    formula: "ΦE = E × A × cos(θ)",
    steps: ["Find E, A, and θ.", "Use cos(θ).", "If closed surface appears, use Gauss's Law.", "Check flux units."],
  },
  {
    topic: "Voltage / Potential",
    keywords: ["voltage", "potential", "energy", "joule", "volt"],
    formula: "V = U / q",
    steps: ["Find U, q, and V.", "Use V = U / q.", "Or U = q × V.", "Potential is scalar."],
  },
  {
    topic: "Capacitance",
    keywords: ["capacitor", "capacitance", "farad", "charge stored", "dielectric"],
    formula: "C = Q / ΔV",
    steps: ["Find C, Q, and ΔV.", "Use C = Q / ΔV.", "Rearrange if needed.", "Check farads."],
  },
  {
    topic: "Ohm's Law",
    keywords: ["current", "resistance", "ohm", "voltage", "amp", "resistor"],
    formula: "V = I × R",
    steps: ["Find V, I, and R.", "Use V = I × R.", "For current, I = V / R.", "For resistance, R = V / I."],
  },
  {
    topic: "Circuits",
    keywords: ["circuit", "series", "parallel", "junction", "loop", "kirchhoff", "power"],
    formula: "P = I × V",
    steps: ["Decide series or parallel.", "Series resistors add.", "Parallel uses reciprocals.", "Use Kirchhoff rules if loops or junctions appear."],
  },
  {
    topic: "Magnetic Force",
    keywords: ["magnetic", "tesla", "moving charge", "velocity", "angle", "b field"],
    formula: "F = q × v × B × sin(θ)",
    steps: ["Find q, v, B, and θ.", "Use sin(θ).", "90° is max.", "0° is zero.", "Stationary charge has no magnetic force."],
  },
  {
    topic: "Induction",
    keywords: ["induction", "emf", "faraday", "lenz", "coil", "flux", "turns"],
    formula: "ε = -N × ΔΦB / Δt",
    steps: ["Find N, ΔΦB, and Δt.", "Use magnitude if direction is not asked.", "Negative sign is Lenz's Law.", "Changing flux is required."],
  },
  {
    topic: "EM Waves / Light",
    keywords: ["light", "em wave", "electromagnetic", "speed of light", "vacuum"],
    formula: "c = f × λ",
    steps: ["Use c = 3 × 10⁸ m/s.", "Use c = f × λ.", "Solve for f or λ.", "Do not use sound speed."],
  },
];

function getChapter(number) {
  return CHAPTERS.find((chapter) => chapter.number === number);
}

function analyzeProblem(textInput) {
  const lower = textInput.toLowerCase();

  if (!lower.trim()) {
    return {
      topic: "Paste a problem first.",
      formula: "No formula yet.",
      clues: [],
      givens: [],
      unknown: "No unknown yet.",
      steps: ["Paste the full question.", "Include numbers and units.", "Then read the solve path."],
    };
  }

  let best = SMART_RULES[0];
  let bestScore = -1;

  SMART_RULES.forEach((rule) => {
    let score = 0;
    rule.keywords.forEach((word) => {
      if (lower.includes(word)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  });

  const clues = best.keywords.filter((word) => lower.includes(word));
  const givens = textInput.match(/[-+]?\d*\.?\d+(?:\s?×\s?10\^?[-+]?\d+|e[-+]?\d+)?\s?(?:hz|m\/s|m|s|c|n|v|a|ohm|Ω|t|wb|j|f)?/gi) || [];

  let unknown = "Look for words like find, calculate, determine, or what is.";

  if (lower.includes("find the speed") || lower.includes("find speed")) unknown = "v";
  if (lower.includes("find the frequency") || lower.includes("find frequency")) unknown = "f";
  if (lower.includes("find the wavelength") || lower.includes("find wavelength")) unknown = "λ";
  if (lower.includes("find the force") || lower.includes("find force")) unknown = "F";
  if (lower.includes("find the current") || lower.includes("find current")) unknown = "I";
  if (lower.includes("find the voltage") || lower.includes("find voltage")) unknown = "V";
  if (lower.includes("find the resistance") || lower.includes("find resistance")) unknown = "R";
  if (lower.includes("find the capacitance") || lower.includes("find capacitance")) unknown = "C";
  if (lower.includes("find the emf") || lower.includes("find emf")) unknown = "ε";

  return {
    topic: bestScore <= 0 ? "Best guess: check clue words manually." : best.topic,
    formula: best.formula,
    clues,
    givens,
    unknown,
    steps: best.steps,
  };
}

function Screen({ children, calm }) {
  return (
    <ScrollView contentContainerStyle={calm ? styles.calmContainer : styles.container}>
      {children}
    </ScrollView>
  );
}

function Header({ title, subtitle }) {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </>
  );
}

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

function Button({ label, onPress, type = "primary" }) {
  return (
    <Pressable style={styles[type]} onPress={onPress}>
      <Text style={type === "secondary" || type === "gold" ? styles.secondaryText : styles.buttonText}>
        {label}
      </Text>
    </Pressable>
  );
}

function List({ items }) {
  return (
    <>
      {items.map((item, index) => (
        <Text key={`${item}-${index}`} style={styles.listItem}>
          {index + 1}. {item}
        </Text>
      ))}
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [formulaIndex, setFormulaIndex] = useState(0);
  const [calcIndex, setCalcIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [solverIndex, setSolverIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [calmMode, setCalmMode] = useState(true);
  const [problemInput, setProblemInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [lessonPlaying, setLessonPlaying] = useState(false);

  const motion = useRef(new Animated.Value(0)).current;

  const module = MODULES[moduleIndex];
  const chapter = CHAPTERS[chapterIndex];
  const formula = FORMULAS[formulaIndex];
  const calc = CALC3[calcIndex];
  const lesson = chapter.lessons[lessonIndex];
  const currentCard = chapter.cards[cardIndex];

  const solverSteps = useMemo(() => {
    return SOLVER_LABELS.map((label, index) => [label, chapter.example[index]]);
  }, [chapter]);

  const problemAnalysis = useMemo(() => analyzeProblem(problemInput), [problemInput]);

  const movingArrow = motion.interpolate({
    inputRange: [0, 1],
    outputRange: [-45, 45],
  });

  const pulseScale = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.13, 1],
  });

  useEffect(() => {
    if (screen !== "lesson" || !lessonPlaying) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(motion, { toValue: 0, duration: 850, useNativeDriver: true }),
      ])
    );

    loop.start();

    const timer = setTimeout(() => {
      if (lessonIndex + 1 < chapter.lessons.length) {
        setLessonIndex((old) => old + 1);
      } else {
        setLessonPlaying(false);
      }
    }, 3600);

    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [screen, lessonPlaying, lessonIndex, chapter.lessons.length, motion]);

  function openChapter(number) {
    const index = CHAPTERS.findIndex((item) => item.number === number);
    setChapterIndex(index);
    setLessonIndex(0);
    setSolverIndex(0);
    setCardIndex(0);
    setShowBack(false);
    setFeedback("");
    setLessonPlaying(false);
    setScreen("chapter");
  }

  function nextIndex(current, setter, length) {
    setter(current + 1 < length ? current + 1 : 0);
  }

  function checkAnswer(choice) {
    const correct = chapter.quiz[2];
    if (choice === correct) {
      setFeedback("Correct. You are learning the objective.");
      setScore((old) => old + 10);
    } else {
      setFeedback(`Not quite. Correct answer: ${correct}`);
    }
  }

  if (screen === "home") {
    return (
      <Screen calm={calmMode}>
        <Header title="Physics Final Boss" subtitle="Homework Solver + Animated Clips Edition" />

        <Card>
          <Text style={styles.bigText}>Start here. Everything is visible now.</Text>
          <Text style={styles.body}>
            Pick a module, paste a homework problem, or use animated concept clips.
          </Text>

          <View style={styles.scoreRow}>
            <Text style={styles.badge}>Score: {score}</Text>
            <Text style={styles.badge}>Calm Mode: {calmMode ? "ON" : "OFF"}</Text>
          </View>

          <Button label="Homework Problem Solver" type="purple" onPress={() => setScreen("smartSolver")} />
          <Button label="Choose a Module" type="orange" onPress={() => setScreen("modules")} />
          <Button label="Formula Map" onPress={() => setScreen("formulas")} />
          <Button label="Calc 3 Toolkit" type="gold" onPress={() => setScreen("calc3")} />
          <Button
            label={calmMode ? "Turn Calm Mode Off" : "Turn Calm Mode On"}
            type="secondary"
            onPress={() => setCalmMode(!calmMode)}
          />
        </Card>
      </Screen>
    );
  }

  if (screen === "smartSolver") {
    return (
      <Screen calm={calmMode}>
        <Header title="Homework Problem Solver" subtitle="Paste the question. The app finds the solve path." />

        <Card>
          <Text style={styles.bigText}>Paste one homework problem.</Text>

          <TextInput
            style={styles.problemInput}
            value={problemInput}
            onChangeText={setProblemInput}
            placeholder="Example: A wave has frequency 5 Hz and wavelength 3 m. Find the speed."
            placeholderTextColor="#64748b"
            multiline
          />

          <Text style={styles.miniHeader}>Likely Topic</Text>
          <Text style={styles.highlight}>{problemAnalysis.topic}</Text>

          <Text style={styles.miniHeader}>Formula to Try</Text>
          <Text style={styles.formula}>{problemAnalysis.formula}</Text>

          <Text style={styles.miniHeader}>Clue Words Found</Text>
          <Text style={styles.highlight}>
            {problemAnalysis.clues.length ? problemAnalysis.clues.join(" | ") : "No clear clue words yet."}
          </Text>

          <Text style={styles.miniHeader}>Numbers / Units Found</Text>
          <Text style={styles.highlight}>
            {problemAnalysis.givens.length ? problemAnalysis.givens.join(" | ") : "No numbers found yet."}
          </Text>

          <Text style={styles.miniHeader}>Likely Unknown</Text>
          <Text style={styles.highlight}>{problemAnalysis.unknown}</Text>

          <Text style={styles.miniHeader}>Solve It Like This</Text>
          <List items={problemAnalysis.steps} />

          <Button label="Clear Problem" type="gold" onPress={() => setProblemInput("")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "formulas") {
    return (
      <Screen calm={calmMode}>
        <Header title="Formula Map" subtitle={`${formulaIndex + 1} of ${FORMULAS.length}`} />

        <Card>
          <Text style={styles.step}>{formula[0]}</Text>
          <Text style={styles.formula}>{formula[1]}</Text>
          <Text style={styles.miniHeader}>Clue Words</Text>
          <Text style={styles.highlight}>{formula[2]}</Text>

          <Button
            label={formulaIndex + 1 < FORMULAS.length ? "Next Formula" : "Restart"}
            onPress={() => nextIndex(formulaIndex, setFormulaIndex, FORMULAS.length)}
          />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "calc3") {
    return (
      <Screen calm={calmMode}>
        <Header title="Calc 3 Toolkit" subtitle={`${calcIndex + 1} of ${CALC3.length}`} />

        <Card>
          <Text style={styles.step}>{calc[0]}</Text>
          <Text style={styles.formula}>{calc[1]}</Text>
          <Text style={styles.body}>{calc[2]}</Text>

          <Button
            label={calcIndex + 1 < CALC3.length ? "Next Calc 3 Tool" : "Restart"}
            onPress={() => nextIndex(calcIndex, setCalcIndex, CALC3.length)}
          />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "modules") {
    return (
      <Screen calm={calmMode}>
        <Header title="Choose One Module" subtitle="One chunk at a time." />

        {MODULES.map((item, index) => (
          <Pressable
            key={item.title}
            style={styles.moduleCard}
            onPress={() => {
              setModuleIndex(index);
              setScreen("module");
            }}
          >
            <Text style={styles.moduleTitle}>{item.title}</Text>
            <Text style={styles.moduleDates}>{item.dates}</Text>
            <Text style={styles.body}>{item.focus}</Text>
            <Text style={styles.exam}>{item.exam}</Text>
          </Pressable>
        ))}

        <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
      </Screen>
    );
  }

  if (screen === "module") {
    return (
      <Screen calm={calmMode}>
        <Header title={module.title} subtitle={module.focus} />

        <Card>
          <Text style={styles.miniHeader}>Pick One Chapter</Text>

          {module.chapters.map((number) => {
            const item = getChapter(number);
            return (
              <Pressable key={number} style={styles.chapterButton} onPress={() => openChapter(number)}>
                <Text style={styles.chapterTitle}>Chapter {item.number}: {item.title}</Text>
                <Text style={styles.chapterFormula}>{item.formula}</Text>
              </Pressable>
            );
          })}

          <Button label="Back to Modules" type="secondary" onPress={() => setScreen("modules")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "chapter") {
    return (
      <Screen calm={calmMode}>
        <Header title={`Chapter ${chapter.number}`} subtitle={chapter.title} />

        <Card>
          <Text style={styles.bigText}>{chapter.calm}</Text>

          <Text style={styles.miniHeader}>Learning Objective</Text>
          <Text style={styles.highlight}>{chapter.objective}</Text>

          <Text style={styles.miniHeader}>Formula</Text>
          <Text style={styles.formula}>{chapter.formula}</Text>

          <Text style={styles.miniHeader}>Clue Words</Text>
          <Text style={styles.highlight}>{chapter.clues.join(" | ")}</Text>

          <Button label="1. Deep Study Guide" onPress={() => setScreen("deepGuide")} />
          <Button
            label="2. Tiny Animated Concept Clip"
            type="purple"
            onPress={() => {
              setLessonIndex(0);
              setLessonPlaying(true);
              setScreen("lesson");
            }}
          />
          <Button label="3. Guided Example Solver" type="orange" onPress={() => setScreen("solver")} />
          <Button label="4. Paste Homework Problem" type="purple" onPress={() => setScreen("smartSolver")} />
          <Button label="5. Flashcards + Check" type="gold" onPress={() => setScreen("practice")} />
          <Button label="Back to Module" type="secondary" onPress={() => setScreen("module")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "deepGuide") {
    return (
      <Screen calm={calmMode}>
        <Header title="Deep Study Guide" subtitle={`Chapter ${chapter.number}`} />

        <Card>
          <Text style={styles.miniHeader}>Homework Skills</Text>
          <List items={chapter.skills} />

          <Text style={styles.miniHeader}>Common Traps</Text>
          <List items={chapter.traps} />

          <Button
            label="Next: Animated Concept Clip"
            onPress={() => {
              setLessonIndex(0);
              setLessonPlaying(true);
              setScreen("lesson");
            }}
          />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "lesson") {
    const progressWidth = `${((lessonIndex + 1) / chapter.lessons.length) * 100}%`;

    return (
      <Screen calm={calmMode}>
        <Header title="Tiny Animated Concept Clip" subtitle={`Chapter ${chapter.number}: ${chapter.title}`} />

        <Card>
          <View style={styles.videoTopRow}>
            <Text style={styles.videoPill}>Scene {lessonIndex + 1} of {chapter.lessons.length}</Text>
            <Text style={styles.videoPill}>{lessonPlaying ? "Playing" : "Paused"}</Text>
          </View>

          <View style={styles.conceptVideoFrame}>
            <Animated.Text style={[styles.lessonEmoji, { transform: [{ scale: pulseScale }] }]}>
              {lesson[0]}
            </Animated.Text>

            <Text style={styles.lessonTitle}>{lesson[1]}</Text>

            <View style={styles.animationBoard}>
              <Text style={styles.animationLine}>{lesson[2]}</Text>
              <Animated.Text style={[styles.movingArrow, { transform: [{ translateX: movingArrow }] }]}>
                ➜
              </Animated.Text>
              <Text style={styles.animationLine}>{lesson[3]}</Text>
            </View>

            <Text style={styles.takeaway}>Takeaway: {lesson[4]}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progressWidth }]} />
          </View>

          <View style={styles.videoControls}>
            <Pressable
              style={styles.controlButton}
              onPress={() => {
                if (lessonIndex > 0) {
                  setLessonIndex(lessonIndex - 1);
                  setLessonPlaying(false);
                }
              }}
            >
              <Text style={styles.controlText}>Back</Text>
            </Pressable>

            <Pressable style={styles.playButton} onPress={() => setLessonPlaying(!lessonPlaying)}>
              <Text style={styles.playText}>{lessonPlaying ? "Pause" : "Play"}</Text>
            </Pressable>

            <Pressable
              style={styles.controlButton}
              onPress={() => {
                if (lessonIndex + 1 < chapter.lessons.length) {
                  setLessonIndex(lessonIndex + 1);
                  setLessonPlaying(false);
                } else {
                  setScreen("solver");
                }
              }}
            >
              <Text style={styles.controlText}>{lessonIndex + 1 < chapter.lessons.length ? "Next" : "Solver"}</Text>
            </Pressable>
          </View>

          <Button label="Next: Guided Example Solver" type="orange" onPress={() => setScreen("solver")} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "solver") {
    const step = solverSteps[solverIndex];

    return (
      <Screen calm={calmMode}>
        <Header title="Guided Example Solver" subtitle={`${solverIndex + 1} of ${solverSteps.length}`} />

        <Card>
          <Text style={styles.step}>{step[0]}</Text>
          <Text style={styles.bigText}>{step[1]}</Text>

          <Button
            label={solverIndex + 1 < solverSteps.length ? "Next Solver Step" : "Practice"}
            onPress={() => {
              if (solverIndex + 1 < solverSteps.length) {
                setSolverIndex(solverIndex + 1);
              } else {
                setScreen("practice");
              }
            }}
          />
          <Button label="Paste My Own Homework Problem" type="purple" onPress={() => setScreen("smartSolver")} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "practice") {
    return (
      <Screen calm={calmMode}>
        <Header title="Flashcards + Check" subtitle={`Chapter ${chapter.number}`} />

        <Card>
          <Text style={styles.miniHeader}>Flashcard {cardIndex + 1} of {chapter.cards.length}</Text>
          <Text style={styles.bigText}>{showBack ? currentCard[1] : currentCard[0]}</Text>

          <Button label={showBack ? "Show Question" : "Show Answer"} onPress={() => setShowBack(!showBack)} />
          <Button
            label="Next Flashcard"
            type="purple"
            onPress={() => {
              setCardIndex(cardIndex + 1 < chapter.cards.length ? cardIndex + 1 : 0);
              setShowBack(false);
            }}
          />

          <Text style={styles.miniHeader}>Quick Check</Text>
          <Text style={styles.body}>{chapter.quiz[0]}</Text>

          {chapter.quiz[1].map((choice) => (
            <Pressable key={choice} style={styles.choice} onPress={() => checkAnswer(choice)}>
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  calmContainer: {
    flexGrow: 1,
    backgroundColor: "#10202b",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#f8fafc",
    fontSize: 31,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#fbbf24",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 18,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  bigText: {
    color: "#0f172a",
    fontSize: 23,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },
  body: {
    color: "#1f2937",
    fontSize: 18,
    lineHeight: 29,
    marginBottom: 10,
  },
  miniHeader: {
    color: "#7c3aed",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 8,
  },
  highlight: {
    color: "#0f172a",
    backgroundColor: "#e0f2fe",
    padding: 16,
    borderRadius: 18,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "800",
    marginBottom: 10,
  },
  formula: {
    color: "#f8fafc",
    backgroundColor: "#0f172a",
    borderColor: "#38bdf8",
    borderWidth: 2,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    fontSize: 25,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },
  listItem: {
    color: "#1f2937",
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 16,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 8,
  },
  primary: {
    backgroundColor: "#0f172a",
    padding: 17,
    borderRadius: 18,
    marginTop: 14,
    width: "100%",
  },
  purple: {
    backgroundColor: "#7c3aed",
    padding: 17,
    borderRadius: 18,
    marginTop: 14,
    width: "100%",
  },
  orange: {
    backgroundColor: "#f59e0b",
    padding: 17,
    borderRadius: 18,
    marginTop: 14,
    width: "100%",
  },
  gold: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 2,
    padding: 17,
    borderRadius: 18,
    marginTop: 14,
    width: "100%",
  },
  secondary: {
    backgroundColor: "#ffffff",
    borderColor: "#0f172a",
    borderWidth: 1,
    padding: 16,
    borderRadius: 18,
    marginTop: 12,
    width: "100%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  secondaryText: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  scoreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 4,
  },
  badge: {
    color: "#0f172a",
    backgroundColor: "#dcfce7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
  },
  moduleCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    borderLeftColor: "#7c3aed",
    borderLeftWidth: 8,
  },
  moduleTitle: {
    color: "#0f172a",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  moduleDates: {
    color: "#7c3aed",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 6,
  },
  exam: {
    color: "#b45309",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 6,
  },
  chapterButton: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    alignItems: "center",
  },
  chapterTitle: {
    color: "#0f172a",
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
  },
  chapterFormula: {
    color: "#4b5563",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 4,
  },
  step: {
    color: "#ffffff",
    backgroundColor: "#7c3aed",
    alignSelf: "center",
    overflow: "hidden",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 14,
  },
  problemInput: {
    width: "100%",
    minHeight: 150,
    backgroundColor: "#f8fafc",
    borderColor: "#38bdf8",
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    color: "#0f172a",
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
    textAlignVertical: "top",
    marginTop: 10,
    marginBottom: 12,
  },
  videoTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 14,
  },
  videoPill: {
    color: "#ffffff",
    backgroundColor: "#7c3aed",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 14,
    fontWeight: "900",
  },
  conceptVideoFrame: {
    backgroundColor: "#111827",
    borderColor: "#38bdf8",
    borderWidth: 2,
    borderRadius: 26,
    padding: 22,
    minHeight: 430,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  lessonEmoji: {
    fontSize: 82,
    textAlign: "center",
    marginBottom: 10,
  },
  lessonTitle: {
    color: "#fbbf24",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },
  animationBoard: {
    width: "100%",
    backgroundColor: "#0f172a",
    borderColor: "#475569",
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  animationLine: {
    color: "#e0f2fe",
    fontSize: 21,
    lineHeight: 30,
    fontWeight: "900",
    textAlign: "center",
  },
  movingArrow: {
    color: "#38bdf8",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 6,
  },
  takeaway: {
    color: "#0f172a",
    backgroundColor: "#dcfce7",
    padding: 15,
    borderRadius: 18,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },
  progressTrack: {
    height: 12,
    backgroundColor: "#cbd5e1",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 14,
  },
  progressFill: {
    height: 12,
    backgroundColor: "#38bdf8",
    borderRadius: 999,
  },
  videoControls: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginBottom: 4,
  },
  controlButton: {
    flex: 1,
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 16,
  },
  controlText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  playButton: {
    flex: 1,
    backgroundColor: "#f59e0b",
    padding: 14,
    borderRadius: 16,
  },
  playText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  choice: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    marginTop: 10,
  },
  choiceText: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  feedback: {
    color: "#0f172a",
    backgroundColor: "#dcfce7",
    padding: 16,
    borderRadius: 18,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "900",
    marginTop: 14,
    textAlign: "center",
  },
});
