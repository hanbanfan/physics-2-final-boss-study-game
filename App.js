import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

/*
  PHYSICS FINAL BOSS
  Debug-friendly structure:
  1. Course data
  2. Reusable UI components
  3. Main App navigation
  4. Screens
  5. Styles
*/

const PROBLEM_METHOD = [
  {
    title: "1. Classify",
    short: "What chapter family is this?",
    detail:
      "Decide the topic before touching numbers: waves, charge, field, potential, capacitors, circuits, magnetism, or induction.",
  },
  {
    title: "2. Circle Clues",
    short: "The words reveal the formula.",
    detail:
      "Circle clue words like frequency, wavelength, charge, distance, field, voltage, resistance, flux, current, or magnetic field.",
  },
  {
    title: "3. List Knowns",
    short: "Write givens with units.",
    detail:
      "Make a clean list: V = 12 V, R = 4 Ω, I = ?. Units are breadcrumbs.",
  },
  {
    title: "4. Find Unknown",
    short: "What are they asking for?",
    detail:
      "Write the target variable before solving. If you do not know the unknown, your calculator becomes a chaos rectangle.",
  },
  {
    title: "5. Pick Formula",
    short: "Match clues to formula family.",
    detail:
      "Do not memorize every problem. Match words to formula families.",
  },
  {
    title: "6. Rearrange",
    short: "Solve symbolically first.",
    detail:
      "Move the equation around before numbers go in. This prevents plug-and-chug soup.",
  },
  {
    title: "7. Plug In",
    short: "Substitute slowly.",
    detail:
      "Plug in one line at a time. Watch squares, powers of ten, and trig.",
  },
  {
    title: "8. Check Units",
    short: "Units must match the unknown.",
    detail:
      "Force should be newtons. Current should be amps. Wavelength should be meters.",
  },
  {
    title: "9. Sanity Check",
    short: "Does the answer make sense?",
    detail:
      "If resistance goes up, current should go down. If distance doubles in r², force should drop a lot.",
  },
];

const MODULES = [
  {
    id: 1,
    title: "Module 1",
    dates: "6/08 - 6/24",
    focus: "Waves, Electric Charge, Electric Fields, Gauss’s Law",
    exam: "Module 1 Exam: Due 6/28 by 11:59 PM",
    chapters: [16, 22, 23, 24],
    schedule: [
      "6/08: Course intro, Canvas, syllabus, Mastering Physics setup",
      "6/10: Chapter 16 videos, reading, HW, quiz",
      "6/15: Chapters 22 & 23 videos, reading, HW, quiz",
      "6/17: Chapter 24 videos, reading, HW, at-home quiz",
      "6/28: Module 1 Exam due by 11:59 PM",
    ],
  },
  {
    id: 2,
    title: "Module 2",
    dates: "6/29 - 7/06",
    focus: "Electric Potential, Capacitors, Current, Circuits",
    exam: "Module 2 Exam: During class on 7/06",
    chapters: [25, 26, 27, 28],
    schedule: [
      "6/29: Chapters 25 & 26 videos, reading, HW, quiz",
      "6/31: Chapters 27 & 28 videos, reading, quiz",
      "7/01: Module 2 Exam Review",
      "7/06: Module 2 Exam during class",
    ],
  },
  {
    id: 3,
    title: "Module 3",
    dates: "7/08 - 7/20",
    focus: "Magnetism, Induction, Electromagnetic Waves",
    exam: "Module 3 Exam: During class on 7/20",
    chapters: [29, 30, 31],
    schedule: [
      "7/08: Chapters 29 & 30 videos, reading, HW, quiz",
      "7/13: Chapter 31 videos, reading, HW, quiz",
      "7/15: Module 3 Exam Review",
      "7/20: Module 3 Exam during class",
    ],
  },
  {
    id: 4,
    title: "Module 4",
    dates: "7/22 - 8/02",
    focus: "Final Topics and Final Exam Review",
    exam: "Final Exam: At home, due 8/02 by 11:59 PM",
    chapters: [33, 32],
    schedule: [
      "7/22: Chapter 33 videos, reading, HW, quiz",
      "7/27: Chapter 32 videos, reading, HW, quiz",
      "7/29: Final Exam Review",
      "8/02: Final Exam due by 11:59 PM",
    ],
  },
];

const FORMULA_FAMILIES = [
  {
    family: "Waves",
    clues: "wave, frequency, wavelength, period, sound, light, Doppler",
    formula: "v = fλ",
    use: "Use when speed, frequency, and wavelength are connected.",
  },
  {
    family: "Charge Force",
    clues: "charge, q1, q2, distance, force, repel, attract",
    formula: "F = k(q1q2)/r²",
    use: "Use for force between two point charges.",
  },
  {
    family: "Electric Field",
    clues: "electric field, force per charge, N/C",
    formula: "E = F/q",
    use: "Use when a charge feels force from an electric field.",
  },
  {
    family: "Flux and Gauss",
    clues: "flux, surface, area, angle, enclosed charge, symmetry",
    formula: "ΦE = EAcosθ",
    use: "Use for electric field passing through an area.",
  },
  {
    family: "Electric Potential",
    clues: "potential, voltage, energy per charge",
    formula: "V = U/q",
    use: "Use when energy and charge connect to voltage.",
  },
  {
    family: "Capacitors",
    clues: "capacitor, capacitance, charge stored, plates, dielectric",
    formula: "C = Q/ΔV",
    use: "Use for charge stored per voltage.",
  },
  {
    family: "Current and Resistance",
    clues: "current, resistance, voltage, ohm, amps",
    formula: "V = IR",
    use: "Use when voltage, current, and resistance appear.",
  },
  {
    family: "Circuits",
    clues: "power, series, parallel, loop, junction, resistor",
    formula: "P = IV",
    use: "Use for electrical power and combine with circuit rules.",
  },
  {
    family: "Magnetism",
    clues: "magnetic field, moving charge, B, tesla, angle",
    formula: "F = qvBsinθ",
    use: "Use for magnetic force on a moving charge.",
  },
  {
    family: "Induction",
    clues: "induced emf, changing flux, Faraday, Lenz, coil",
    formula: "emf = -NΔΦB/Δt",
    use: "Use when magnetic flux changes.",
  },
];

const CHAPTERS = [
  {
    number: 16,
    moduleId: 1,
    title: "Traveling Waves",
    emoji: "🌊",
    formula: "v = fλ",
    tagline: "Waves move energy. Frequency is how often. Wavelength is how long.",
    bigIdea:
      "A traveling wave is an organized disturbance that carries energy. The medium may move up/down or back/forth, but the wave travels forward.",
    clues: ["wave", "frequency", "wavelength", "period", "amplitude", "sound", "light", "decibel", "Doppler"],
    sections: [
      "Waves carry energy, not permanent matter.",
      "Transverse waves move the medium perpendicular to travel.",
      "Longitudinal waves move the medium parallel to travel.",
      "Sinusoidal waves use amplitude, wavelength, period, frequency, and phase.",
      "Sound is longitudinal. Light is electromagnetic.",
      "Doppler effect changes observed frequency when source or observer moves.",
    ],
    math: [
      "Use v = fλ.",
      "Use f = 1/T when given period.",
      "Use λ = v/f when asked for wavelength.",
      "For light, use c = fλ.",
      "Approaching source = higher observed frequency.",
      "Receding source = lower observed frequency.",
    ],
    video: [
      ["🏟️", "Stadium wave: people move up and down, but the wave travels around."],
      ["🌊", "Waves move energy, not permanent matter."],
      ["🪢", "Transverse wave: medium motion is perpendicular to wave travel."],
      ["🪱", "Longitudinal wave: medium motion is parallel to wave travel."],
      ["📏", "Frequency is cycles per second. Wavelength is one cycle length."],
      ["🚑", "Doppler effect: approaching sounds higher, leaving sounds lower."],
      ["🧠", "Exam move: see f and λ, use v = fλ."],
    ],
    cards: [
      ["Wave speed formula?", "v = fλ"],
      ["Frequency means?", "Cycles per second."],
      ["Wavelength means?", "Length of one full wave cycle."],
      ["Doppler effect?", "Observed frequency changes because of motion."],
    ],
    checks: [
      {
        q: "A problem gives frequency and wavelength. What formula do you use?",
        choices: ["v = fλ", "V = IR", "C = Q/ΔV"],
        correct: "v = fλ",
        why: "Frequency and wavelength are wave-speed clues.",
      },
      {
        q: "A source moving toward you sounds...",
        choices: ["Higher frequency", "Lower frequency", "No frequency"],
        correct: "Higher frequency",
        why: "Approaching Doppler shift increases observed frequency.",
      },
    ],
    methodExample: {
      problem: "A wave has frequency 10 Hz and wavelength 2 m. Find wave speed.",
      classify: "Waves",
      clues: "frequency, wavelength, speed",
      knowns: "f = 10 Hz, λ = 2 m",
      unknown: "v",
      formula: "v = fλ",
      rearrange: "Already solved for v.",
      plug: "v = 10 × 2",
      answer: "v = 20 m/s",
      check: "m/s is speed, so units match.",
    },
    boss: {
      q: "A traveling wave transfers...",
      choices: ["Energy", "Permanent matter", "Only voltage"],
      correct: "Energy",
      why: "A wave carries energy without permanently transporting matter.",
    },
  },
  {
    number: 22,
    moduleId: 1,
    title: "Electric Charges and Forces",
    emoji: "⚡",
    formula: "F = k(q1q2)/r²",
    tagline: "Same charges repel. Opposite charges attract.",
    bigIdea:
      "Charges create electric forces. Coulomb’s Law tells how strong the force is between two charges.",
    clues: ["charge", "q1", "q2", "distance", "force", "Coulomb", "conductor", "insulator"],
    sections: [
      "Charge can be positive, negative, or neutral.",
      "Same charges repel. Opposite charges attract.",
      "Charge is conserved.",
      "Conductors allow charge motion. Insulators resist it.",
      "Coulomb’s Law depends on q1, q2, and r².",
    ],
    math: [
      "Use F = k(q1q2)/r².",
      "k = 9 × 10⁹ N·m²/C².",
      "Square the distance before dividing.",
      "If r doubles, force becomes four times smaller.",
    ],
    video: [
      ["➕", "Two positive charges enter the room. Immediate beef."],
      ["➕➕", "Same charges repel. They are not emotionally available."],
      ["➕➖", "Opposite charges attract. Electric enemies-to-lovers arc."],
      ["📏", "Distance is squared, so moving apart humbles the force fast."],
      ["⚖️", "Formula goblin: F = k(q1q2)/r²."],
      ["🧠", "Exam move: see q1, q2, r? Use Coulomb’s Law."],
    ],
    cards: [
      ["Same charges?", "Repel."],
      ["Opposite charges?", "Attract."],
      ["Conductor?", "Lets charge move."],
      ["Coulomb’s Law?", "F = k(q1q2)/r²"],
    ],
    checks: [
      {
        q: "Two positive charges will...",
        choices: ["Repel", "Attract", "Turn into magnets"],
        correct: "Repel",
        why: "Same charges repel.",
      },
      {
        q: "A problem gives q1, q2, and r. Use...",
        choices: ["Coulomb’s Law", "Ohm’s Law", "Doppler effect"],
        correct: "Coulomb’s Law",
        why: "Those are Coulomb force variables.",
      },
    ],
    methodExample: {
      problem: "q1 = 2 C and q2 = 3 C are 1 m apart. Find force using k = 9 × 10⁹.",
      classify: "Electric charge force",
      clues: "q1, q2, distance, force",
      knowns: "q1 = 2 C, q2 = 3 C, r = 1 m, k = 9 × 10⁹",
      unknown: "F",
      formula: "F = k(q1q2)/r²",
      rearrange: "Already solved for F.",
      plug: "F = (9 × 10⁹)(2)(3)/(1²)",
      answer: "F = 5.4 × 10¹⁰ N",
      check: "Newtons are force units, so units match.",
    },
    boss: {
      q: "Coulomb’s Law finds...",
      choices: ["Force between charges", "Wave speed", "Capacitance"],
      correct: "Force between charges",
      why: "Coulomb’s Law is the electric force law.",
    },
  },
  {
    number: 23,
    moduleId: 1,
    title: "The Electric Field",
    emoji: "👁️",
    formula: "E = F/q",
    tagline: "Electric field is force per charge.",
    bigIdea:
      "Electric fields describe how charges affect the space around them. Put a charge in a field and it feels force.",
    clues: ["electric field", "E", "force", "charge", "point charge", "capacitor", "dipole"],
    sections: [
      "Fields model electric influence in space.",
      "Point charges create radial electric fields.",
      "Continuous charge distributions create fields too.",
      "Parallel plates create approximately uniform fields.",
      "Charged particles accelerate in electric fields.",
    ],
    math: [
      "Use E = F/q.",
      "Rearrange to F = qE.",
      "Units are N/C or V/m.",
      "Positive test charge gives field direction.",
    ],
    video: [
      ["👻", "Every charge has an invisible force aura."],
      ["➕", "A positive test charge walks in and shows field direction."],
      ["💪", "Electric field means force per charge."],
      ["📐", "Formula: E = F/q."],
      ["🧲", "Parallel plates make a uniform shove zone."],
      ["🧠", "Exam move: see force and charge? Divide to get E."],
    ],
    cards: [
      ["Electric field formula?", "E = F/q"],
      ["Electric field means?", "Force per charge."],
      ["Field direction uses?", "Positive test charge."],
      ["E units?", "N/C or V/m."],
    ],
    checks: [
      {
        q: "Electric field means...",
        choices: ["Force per charge", "Energy per charge", "Power per area"],
        correct: "Force per charge",
        why: "E = F/q.",
      },
      {
        q: "A charged particle in an electric field can...",
        choices: ["Accelerate", "Lose all mass", "Become a sound wave"],
        correct: "Accelerate",
        why: "Electric field creates electric force.",
      },
    ],
    methodExample: {
      problem: "A 4 C charge feels a 12 N force. Find E.",
      classify: "Electric field",
      clues: "charge, force, electric field",
      knowns: "q = 4 C, F = 12 N",
      unknown: "E",
      formula: "E = F/q",
      rearrange: "Already solved for E.",
      plug: "E = 12/4",
      answer: "E = 3 N/C",
      check: "N/C is electric field, so units match.",
    },
    boss: {
      q: "Electric field is...",
      choices: ["Force per charge", "Energy per charge", "Charge per volt"],
      correct: "Force per charge",
      why: "That is the definition of electric field.",
    },
  },
  {
    number: 24,
    moduleId: 1,
    title: "Gauss’s Law",
    emoji: "🧊",
    formula: "ΦE = EAcosθ",
    tagline: "Flux means field through area. Symmetry is the cheat code.",
    bigIdea:
      "Gauss’s Law relates electric flux through a closed surface to enclosed charge.",
    clues: ["Gauss", "flux", "area", "angle", "closed surface", "symmetry", "enclosed charge"],
    sections: [
      "Symmetry helps choose a Gaussian surface.",
      "Flux measures field passing through area.",
      "Uniform flux uses ΦE = EAcosθ.",
      "Closed-surface flux depends on enclosed charge.",
      "Conductors in equilibrium have zero field inside.",
    ],
    math: [
      "Use ΦE = EAcosθ.",
      "cos0° = 1 means maximum flux.",
      "cos90° = 0 means zero flux.",
      "For Gauss’s Law, focus on charge enclosed.",
    ],
    video: [
      ["➡️", "Electric field arrows are trying to walk through a surface."],
      ["🚪", "Flux is the bouncer counting how many arrows get through."],
      ["📐", "Angle matters. cosθ decides how much field counts."],
      ["🧊", "Closed surface? Gauss only cares about charge trapped inside."],
      ["👑", "Symmetry is the cheat code: sphere, cylinder, plane."],
      ["🧠", "Exam move: if it screams symmetry, try Gauss."],
    ],
    cards: [
      ["Flux means?", "Field through area."],
      ["Flux formula?", "ΦE = EAcosθ"],
      ["Gauss works best with?", "Symmetry."],
      ["Closed surface cares about?", "Enclosed charge."],
    ],
    checks: [
      {
        q: "Electric flux measures...",
        choices: ["Field through area", "Heat through mass", "Current through time"],
        correct: "Field through area",
        why: "Flux is field passing through a surface.",
      },
      {
        q: "Gauss’s Law is easiest with...",
        choices: ["Symmetry", "No units", "Random shapes"],
        correct: "Symmetry",
        why: "Symmetry lets you simplify the electric field.",
      },
    ],
    methodExample: {
      problem: "E = 10 N/C passes straight through A = 2 m². Find flux.",
      classify: "Electric flux",
      clues: "electric field, area, straight through, flux",
      knowns: "E = 10 N/C, A = 2 m², θ = 0°",
      unknown: "ΦE",
      formula: "ΦE = EAcosθ",
      rearrange: "Already solved for flux.",
      plug: "ΦE = 10 × 2 × cos0°",
      answer: "ΦE = 20 N·m²/C",
      check: "Flux units are N·m²/C, so units match.",
    },
    boss: {
      q: "Gauss’s Law connects flux to...",
      choices: ["Enclosed charge", "Resistance", "Frequency"],
      correct: "Enclosed charge",
      why: "Gauss’s Law relates closed-surface flux to enclosed charge.",
    },
  },
  {
    number: 25,
    moduleId: 2,
    title: "The Electric Potential",
    emoji: "🔋",
    formula: "V = U/q",
    tagline: "Voltage is energy per charge.",
    bigIdea:
      "Electric potential uses energy instead of force. It is a scalar, so it often makes charge problems easier.",
    clues: ["potential", "voltage", "energy", "charge", "scalar", "point charge"],
    sections: [
      "Charges can have electric potential energy.",
      "Potential energy depends on charge arrangement.",
      "Electric potential is energy per charge.",
      "Voltage is potential difference.",
      "Potentials from many charges add as scalars.",
    ],
    math: [
      "Use V = U/q.",
      "Rearrange to U = qV.",
      "Potential is scalar, so add values directly.",
      "Voltage means potential difference.",
    ],
    video: [
      ["🔋", "Voltage is the battery yelling: you have energy now, go."],
      ["⛰️", "Electric potential is like an energy hill for charges."],
      ["⚡", "V = U/q means energy per charge."],
      ["🧮", "Potential is scalar. No direction drama."],
      ["➕", "Many charges? Add potentials directly."],
      ["🧠", "Exam move: if it says voltage or potential, think energy per charge."],
    ],
    cards: [
      ["Electric potential means?", "Energy per charge."],
      ["Voltage is?", "Potential difference."],
      ["Scalar or vector?", "Scalar."],
      ["Formula?", "V = U/q"],
    ],
    checks: [
      {
        q: "Electric potential is...",
        choices: ["Energy per charge", "Force per charge", "Charge per volt"],
        correct: "Energy per charge",
        why: "V = U/q.",
      },
      {
        q: "Potential is a...",
        choices: ["Scalar", "Vector", "Magnetic field"],
        correct: "Scalar",
        why: "Potential has no direction.",
      },
    ],
    methodExample: {
      problem: "A 2 C charge has 10 J of electric potential energy. Find V.",
      classify: "Electric potential",
      clues: "charge, potential energy, potential",
      knowns: "q = 2 C, U = 10 J",
      unknown: "V",
      formula: "V = U/q",
      rearrange: "Already solved for V.",
      plug: "V = 10/2",
      answer: "V = 5 V",
      check: "Volts are electric potential units.",
    },
    boss: {
      q: "Voltage measures...",
      choices: ["Energy per charge", "Force per charge", "Current per resistance"],
      correct: "Energy per charge",
      why: "Voltage is electric potential difference.",
    },
  },
  {
    number: 26,
    moduleId: 2,
    title: "Potential and Field",
    emoji: "🪫",
    formula: "C = Q/ΔV",
    tagline: "Capacitors store charge and energy.",
    bigIdea:
      "This chapter connects potential to field and introduces capacitance, capacitors, stored energy, conductors, and dielectrics.",
    clues: ["capacitor", "capacitance", "dielectric", "stored energy", "potential", "field"],
    sections: [
      "Electric field points toward decreasing potential.",
      "Potential slope relates to electric field.",
      "Conductors have zero field inside at equilibrium.",
      "Capacitance is charge stored per volt.",
      "Dielectrics increase capacitance.",
    ],
    math: [
      "Use C = Q/ΔV.",
      "Rearrange to Q = CΔV.",
      "Capacitor energy often uses V².",
      "Dielectrics usually increase capacitance.",
    ],
    video: [
      ["🥫", "A capacitor is an electric snack pantry."],
      ["➕➖", "Two plates store opposite charges."],
      ["🔋", "Capacitance means charge stored per volt."],
      ["🧈", "Dielectric slides in like butter and increases capacitance."],
      ["⚡", "Capacitors store electric energy."],
      ["🧠", "Exam move: see Q and ΔV? Use C = Q/ΔV."],
    ],
    cards: [
      ["Capacitance formula?", "C = Q/ΔV"],
      ["Capacitors store?", "Charge and energy."],
      ["Dielectrics do what?", "Increase capacitance."],
      ["Field inside conductor?", "Zero at equilibrium."],
    ],
    checks: [
      {
        q: "Capacitance means charge per...",
        choices: ["Volt", "Newton", "Hertz"],
        correct: "Volt",
        why: "C = Q/ΔV.",
      },
      {
        q: "A capacitor stores...",
        choices: ["Charge and energy", "Only sound", "Only mass"],
        correct: "Charge and energy",
        why: "Capacitors store separated charge and electric energy.",
      },
    ],
    methodExample: {
      problem: "A capacitor stores 6 C at 3 V. Find capacitance.",
      classify: "Capacitance",
      clues: "capacitor, charge, voltage",
      knowns: "Q = 6 C, ΔV = 3 V",
      unknown: "C",
      formula: "C = Q/ΔV",
      rearrange: "Already solved for C.",
      plug: "C = 6/3",
      answer: "C = 2 F",
      check: "Farads are capacitance units.",
    },
    boss: {
      q: "A dielectric usually makes capacitance...",
      choices: ["Increase", "Disappear", "Turn into current"],
      correct: "Increase",
      why: "Dielectrics increase the capacitance of capacitors.",
    },
  },
  {
    number: 27,
    moduleId: 2,
    title: "Current and Resistance",
    emoji: "🔌",
    formula: "V = IR",
    tagline: "Voltage pushes. Current flows. Resistance blocks.",
    bigIdea:
      "Current is moving charge. Resistance opposes current. Ohm’s Law connects voltage, current, and resistance.",
    clues: ["current", "resistance", "voltage", "Ohm", "conductivity", "resistivity"],
    sections: [
      "Electron current describes electron motion.",
      "Potential difference creates current.",
      "Current measures charge flow per time.",
      "Resistance depends on material and geometry.",
      "Ohm’s Law is V = IR.",
    ],
    math: [
      "Use V = IR.",
      "Solve for I: I = V/R.",
      "Solve for R: R = V/I.",
      "Units: volts, amps, ohms.",
    ],
    video: [
      ["🚗", "Current is charge traffic."],
      ["🔋", "Voltage is the pushy friend yelling: move."],
      ["🚧", "Resistance is one tiny door at Red Rocks."],
      ["📐", "Ohm’s Law: V = IR."],
      ["🧮", "Need current? I = V/R."],
      ["🧠", "Exam move: volts, amps, ohms means Ohm’s Law."],
    ],
    cards: [
      ["Current is?", "Charge flow."],
      ["Resistance does what?", "Opposes current."],
      ["Ohm’s Law?", "V = IR"],
      ["Current unit?", "Ampere."],
    ],
    checks: [
      {
        q: "A problem gives voltage and resistance. What can you find?",
        choices: ["Current", "Temperature", "Wavelength"],
        correct: "Current",
        why: "Use I = V/R.",
      },
      {
        q: "Resistance is measured in...",
        choices: ["Ohms", "Hertz", "Teslas"],
        correct: "Ohms",
        why: "Ohm is the resistance unit.",
      },
    ],
    methodExample: {
      problem: "A resistor has 12 V across it and resistance 4 Ω. Find current.",
      classify: "Current and resistance",
      clues: "voltage, resistance, current",
      knowns: "V = 12 V, R = 4 Ω",
      unknown: "I",
      formula: "V = IR",
      rearrange: "I = V/R",
      plug: "I = 12/4",
      answer: "I = 3 A",
      check: "Amps are current units.",
    },
    boss: {
      q: "Current is measured in...",
      choices: ["Amps", "Volts", "Ohms"],
      correct: "Amps",
      why: "Current uses amperes.",
    },
  },
  {
    number: 28,
    moduleId: 2,
    title: "Fundamentals of Circuits",
    emoji: "🧩",
    formula: "P = IV",
    tagline: "Kirchhoff’s laws are circuit traffic rules.",
    bigIdea:
      "Circuits use conservation of charge and energy. Series, parallel, power, batteries, and RC circuits all build from that.",
    clues: ["Kirchhoff", "junction", "loop", "series", "parallel", "power", "RC"],
    sections: [
      "Circuit diagrams use standard symbols.",
      "Junction rule: current in equals current out.",
      "Loop rule: voltage gains and drops balance.",
      "Power is P = IV.",
      "Series resistors add directly.",
      "Parallel resistors use reciprocal addition.",
      "RC circuits charge and discharge over time.",
    ],
    math: [
      "Use P = IV.",
      "Series: Rtotal = R1 + R2 + R3.",
      "Parallel: 1/Rtotal = 1/R1 + 1/R2.",
      "Junction rule: current in equals current out.",
    ],
    video: [
      ["⚖️", "Kirchhoff is the judge and the circuit is on trial."],
      ["🚦", "Junction rule: current in equals current out."],
      ["🔁", "Loop rule: voltage gains and drops must balance."],
      ["📏", "Series resistors add like normal humans."],
      ["🌀", "Parallel resistors use reciprocal goblin math."],
      ["🧠", "Exam move: simplify the circuit before solving."],
    ],
    cards: [
      ["Junction rule conserves?", "Current."],
      ["Loop rule conserves?", "Energy."],
      ["Power formula?", "P = IV"],
      ["Series resistors?", "Add directly."],
    ],
    checks: [
      {
        q: "Kirchhoff’s junction rule says...",
        choices: ["Current in equals current out", "Heat equals work", "Waves cancel"],
        correct: "Current in equals current out",
        why: "Charge is conserved at a junction.",
      },
      {
        q: "Electrical power formula?",
        choices: ["P = IV", "v = fλ", "C = Q/ΔV"],
        correct: "P = IV",
        why: "Power equals current times voltage.",
      },
    ],
    methodExample: {
      problem: "A device uses 3 A at 12 V. Find power.",
      classify: "Circuit power",
      clues: "current, voltage, power",
      knowns: "I = 3 A, V = 12 V",
      unknown: "P",
      formula: "P = IV",
      rearrange: "Already solved for P.",
      plug: "P = 3 × 12",
      answer: "P = 36 W",
      check: "Watts are power units.",
    },
    boss: {
      q: "Kirchhoff’s loop rule is based on conservation of...",
      choices: ["Energy", "Mass", "Frequency"],
      correct: "Energy",
      why: "Voltage around a closed loop must balance.",
    },
  },
  {
    number: 29,
    moduleId: 3,
    title: "The Magnetic Field",
    emoji: "🧲",
    formula: "F = qvBsinθ",
    tagline: "Magnetic fields push moving charges.",
    bigIdea:
      "Magnetic fields come from moving charges and currents. They exert forces on moving charges and current-carrying wires.",
    clues: ["magnetic field", "B", "tesla", "moving charge", "current", "wire", "solenoid"],
    sections: [
      "Magnetism comes from moving charge.",
      "Currents create magnetic fields.",
      "Solenoids create strong magnetic fields.",
      "Moving charges feel magnetic force.",
      "Current-carrying wires feel magnetic force.",
      "Loops can experience torque.",
    ],
    math: [
      "Use F = qvBsinθ.",
      "sin90° = 1 gives maximum force.",
      "sin0° = 0 gives zero force.",
      "Tesla is the magnetic field unit.",
    ],
    video: [
      ["🧍", "A stationary charge walks into a magnetic field. Nothing happens."],
      ["🏃", "A moving charge enters. Now the magnetic field cares."],
      ["📐", "Angle matters. 90 degrees is maximum drama."],
      ["🧲", "Formula: F = qvBsinθ."],
      ["🔌", "Currents are moving charges, so wires can feel magnetic force too."],
      ["🧠", "Exam move: see q, v, B, angle? Use magnetic force."],
    ],
    cards: [
      ["Magnetic field symbol?", "B."],
      ["Unit of B?", "Tesla."],
      ["Stationary charge in B field?", "No magnetic force."],
      ["Strongest angle?", "90°."],
    ],
    checks: [
      {
        q: "A stationary charge in a magnetic field feels...",
        choices: ["No magnetic force", "Maximum force", "Voltage"],
        correct: "No magnetic force",
        why: "Magnetic force requires motion.",
      },
      {
        q: "Magnetic force is strongest when velocity is...",
        choices: ["Perpendicular to B", "Parallel to B", "Zero"],
        correct: "Perpendicular to B",
        why: "sin90° = 1.",
      },
    ],
    methodExample: {
      problem: "A 2 C charge moves at 3 m/s through a 4 T field at 90°. Find force.",
      classify: "Magnetic force",
      clues: "charge, speed, magnetic field, angle, force",
      knowns: "q = 2 C, v = 3 m/s, B = 4 T, θ = 90°",
      unknown: "F",
      formula: "F = qvBsinθ",
      rearrange: "Already solved for F.",
      plug: "F = 2 × 3 × 4 × sin90°",
      answer: "F = 24 N",
      check: "Newtons are force units.",
    },
    boss: {
      q: "Magnetic force on a charge requires...",
      choices: ["Motion", "Zero velocity", "Only mass"],
      correct: "Motion",
      why: "The v in F = qvBsinθ must be nonzero.",
    },
  },
  {
    number: 30,
    moduleId: 3,
    title: "Electromagnetic Induction",
    emoji: "🪄",
    formula: "emf = -NΔΦB/Δt",
    tagline: "Changing magnetic flux creates induced voltage.",
    bigIdea:
      "Electromagnetic induction explains how changing magnetic fields create electric effects.",
    clues: ["induction", "emf", "flux", "Lenz", "Faraday", "inductor", "changing magnetic field"],
    sections: [
      "Induced currents happen from changing magnetic conditions.",
      "Motional emf comes from moving conductors in magnetic fields.",
      "Magnetic flux measures B field through area.",
      "Lenz’s Law says induced effects oppose the change.",
      "Faraday’s Law connects changing flux to emf.",
      "Inductors resist changes in current.",
    ],
    math: [
      "Use emf magnitude = NΔΦ/Δt.",
      "Negative sign means Lenz’s Law direction.",
      "More turns means more emf.",
      "No changing flux means no induced emf.",
    ],
    video: [
      ["🧲", "A magnet moves toward a coil. The coil immediately develops anxiety."],
      ["🌀", "Changing magnetic flux is the trigger."],
      ["⚡", "Changing flux creates induced emf."],
      ["🙅", "Lenz’s Law says the induced effect opposes the change."],
      ["📐", "Formula: emf = -NΔΦ/Δt."],
      ["🧠", "Exam move: if flux changes, induction is happening."],
    ],
    cards: [
      ["Induction trigger?", "Changing magnetic flux."],
      ["Faraday connects flux change to?", "emf."],
      ["Lenz says induced effects?", "Oppose the change."],
      ["Inductors resist changes in?", "Current."],
    ],
    checks: [
      {
        q: "A magnet moves near a coil and current appears. This is...",
        choices: ["Electromagnetic induction", "Thermal expansion", "Beats"],
        correct: "Electromagnetic induction",
        why: "Changing magnetic flux induces emf and current.",
      },
      {
        q: "Lenz’s Law says induced current opposes...",
        choices: ["The change that created it", "All voltage forever", "Every wave"],
        correct: "The change that created it",
        why: "That is the negative sign in Faraday’s Law.",
      },
    ],
    methodExample: {
      problem: "A 10-turn coil has flux change 0.20 Wb in 0.50 s. Find emf magnitude.",
      classify: "Electromagnetic induction",
      clues: "turns, flux change, time, emf",
      knowns: "N = 10, ΔΦ = 0.20 Wb, Δt = 0.50 s",
      unknown: "emf",
      formula: "emf = NΔΦ/Δt for magnitude",
      rearrange: "Already solved for emf.",
      plug: "emf = 10(0.20)/0.50",
      answer: "emf = 4 V",
      check: "Volts are emf units.",
    },
    boss: {
      q: "Faraday’s Law is about...",
      choices: ["Changing magnetic flux creating emf", "Gas pressure", "Wave pitch only"],
      correct: "Changing magnetic flux creating emf",
      why: "That is electromagnetic induction.",
    },
  },
  {
    number: 31,
    moduleId: 3,
    title: "Electromagnetic Fields and Waves",
    emoji: "📡",
    formula: "c = fλ",
    tagline: "Light is an electromagnetic wave.",
    bigIdea:
      "Electromagnetic waves are electric and magnetic fields traveling together. They can travel through vacuum.",
    clues: ["electromagnetic wave", "light", "frequency", "wavelength", "speed of light", "field"],
    sections: [
      "Changing magnetic fields can create electric fields.",
      "Changing electric fields can create magnetic fields.",
      "Electromagnetic waves can travel through vacuum.",
      "Light is an electromagnetic wave.",
      "Use c = fλ for light waves.",
    ],
    math: [
      "Use c = fλ.",
      "c = 3 × 10⁸ m/s.",
      "Solve λ = c/f.",
      "Solve f = c/λ.",
    ],
    video: [
      ["⚡", "Electric field wiggles."],
      ["🧲", "Magnetic field wiggles back."],
      ["📡", "Together they become an electromagnetic wave."],
      ["🌌", "No air needed. EM waves can travel through vacuum."],
      ["💡", "Light is an electromagnetic wave."],
      ["🧠", "Exam move: for light, use c = fλ."],
    ],
    cards: [
      ["Light is?", "An electromagnetic wave."],
      ["Speed of light symbol?", "c."],
      ["EM wave formula?", "c = fλ"],
      ["Can EM waves travel in vacuum?", "Yes."],
    ],
    checks: [
      {
        q: "Light is...",
        choices: ["An electromagnetic wave", "Only sound", "A heat engine"],
        correct: "An electromagnetic wave",
        why: "Light is part of the electromagnetic spectrum.",
      },
      {
        q: "For light waves, speed is represented by...",
        choices: ["c", "R", "Q"],
        correct: "c",
        why: "c is the speed of light.",
      },
    ],
    methodExample: {
      problem: "Light has f = 6 × 10¹⁴ Hz. Find wavelength using c = 3 × 10⁸ m/s.",
      classify: "Electromagnetic wave",
      clues: "light, frequency, wavelength, speed of light",
      knowns: "f = 6 × 10¹⁴ Hz, c = 3 × 10⁸ m/s",
      unknown: "λ",
      formula: "c = fλ",
      rearrange: "λ = c/f",
      plug: "λ = (3 × 10⁸)/(6 × 10¹⁴)",
      answer: "λ = 5 × 10⁻⁷ m",
      check: "Meters are wavelength units.",
    },
    boss: {
      q: "EM waves are made of...",
      choices: ["Electric and magnetic fields", "Only heat", "Only pressure"],
      correct: "Electric and magnetic fields",
      why: "EM waves are coupled electric and magnetic field waves.",
    },
  },
  {
    number: 33,
    moduleId: 4,
    title: "Chapter 33 Final Topic",
    emoji: "🧠",
    formula: "Clues → Givens → Unknown → Formula",
    tagline: "Use Canvas to fill exact formulas.",
    bigIdea:
      "Your syllabus lists Chapter 33 first in Module 4. This is a flexible final-topic study slot until the exact Canvas topic is confirmed.",
    clues: ["Chapter 33", "Module 4", "quiz", "homework", "final topic"],
    sections: [
      "7/22: Chapter 33 videos and reading.",
      "Chapter 33 HW before class.",
      "Chapter 33 quiz during class.",
      "Add exact formulas from Canvas.",
      "Use Mastering Physics problems to build boss problems.",
    ],
    math: [
      "Circle clue words first.",
      "Write givens with units.",
      "Identify the unknown.",
      "Choose the formula containing the unknown.",
      "Check units before submitting.",
    ],
    video: [
      ["🕵️", "Chapter 33 is the syllabus mystery boss."],
      ["🖥️", "Open Canvas and steal the exact chapter title first."],
      ["📝", "Your homework reveals what the exam actually wants."],
      ["📌", "Add the formulas your teacher actually uses."],
      ["🧠", "Exam move: clue words before calculator chaos."],
    ],
    cards: [
      ["Chapter 33 assigned when?", "7/22."],
      ["What is due before class?", "Videos, reading, and HW."],
      ["Best first move?", "Find clue words."],
    ],
    checks: [
      {
        q: "For an unfamiliar problem, first...",
        choices: ["Circle clue words", "Panic", "Randomly multiply"],
        correct: "Circle clue words",
        why: "Clue words tell you the formula family.",
      },
      {
        q: "Best source for Chapter 33 details?",
        choices: ["Canvas and homework", "Random guessing", "Ignoring units"],
        correct: "Canvas and homework",
        why: "Those match your instructor’s expectations.",
      },
    ],
    methodExample: {
      problem: "How do you attack an unfamiliar Chapter 33 problem?",
      classify: "Unknown final topic",
      clues: "Use the chapter title and problem wording.",
      knowns: "Write every number with units.",
      unknown: "Write what the question asks for.",
      formula: "Pick formula by clue words.",
      rearrange: "Solve for the unknown before plugging in.",
      plug: "Substitute carefully.",
      answer: "Answer with units.",
      check: "Ask if the size and units make sense.",
    },
    boss: {
      q: "The best first step is...",
      choices: ["Circle clue words", "Guess", "Ignore units"],
      correct: "Circle clue words",
      why: "Formula choice starts with clue words.",
    },
  },
  {
    number: 32,
    moduleId: 4,
    title: "Chapter 32 Final Topic",
    emoji: "📘",
    formula: "Final Review Mode",
    tagline: "The last new-content sprint before the final.",
    bigIdea:
      "Your syllabus places Chapter 32 right before Final Exam Review, so this becomes your final new-content review block.",
    clues: ["Chapter 32", "final review", "quiz", "homework", "exam"],
    sections: [
      "7/27: Chapter 32 videos and reading.",
      "Chapter 32 HW before class.",
      "Chapter 32 quiz during class.",
      "7/29: Final Exam Review.",
      "8/02: Final Exam due by 11:59 PM.",
    ],
    math: [
      "Make a final formula map by module.",
      "Group equations by clue words.",
      "Practice rearranging before plugging in.",
      "Do unit checks on every answer.",
    ],
    video: [
      ["🚪", "Chapter 32 is the final content gate."],
      ["📅", "7/27: videos, reading, homework, quiz."],
      ["🧪", "After the quiz, steal the problem patterns."],
      ["🗺️", "Then organize everything by module."],
      ["🏆", "Final exam mode: clue words, formula family, units."],
    ],
    cards: [
      ["Chapter 32 assigned when?", "7/27."],
      ["What comes next?", "Final Exam Review."],
      ["Final due date?", "8/02 by 11:59 PM."],
    ],
    checks: [
      {
        q: "After Chapter 32, focus on...",
        choices: ["Final Exam Review", "Starting over", "Ignoring Module 1"],
        correct: "Final Exam Review",
        why: "The syllabus puts final review after Chapter 32.",
      },
      {
        q: "The final exam is...",
        choices: ["At home", "Never due", "Only Chapter 16"],
        correct: "At home",
        why: "Your syllabus says the final exam is at home.",
      },
    ],
    methodExample: {
      problem: "How do you decide which formula to use on the final?",
      classify: "Match problem to module.",
      clues: "Circle words that reveal the topic.",
      knowns: "Write all numbers with units.",
      unknown: "Write the target variable.",
      formula: "Pick the formula family.",
      rearrange: "Solve before plugging in.",
      plug: "Plug in carefully.",
      answer: "Answer with units.",
      check: "Check units and reasonableness.",
    },
    boss: {
      q: "Best final exam strategy?",
      choices: ["Match clue words to formulas", "Guess everything", "Ignore units"],
      correct: "Match clue words to formulas",
      why: "Physics finals reward recognizing problem type first.",
    },
  },
];

function getChapter(number) {
  return CHAPTERS.find((chapter) => chapter.number === number);
}

function buildSolverSteps(chapter) {
  const ex = chapter.methodExample;
  return [
    ["Problem", ex.problem],
    ["Classify", ex.classify],
    ["Circle Clues", ex.clues],
    ["Knowns", ex.knowns],
    ["Unknown", ex.unknown],
    ["Formula", ex.formula],
    ["Rearrange", ex.rearrange],
    ["Plug In", ex.plug],
    ["Answer", ex.answer],
    ["Check", ex.check],
  ];
}

function Screen({ children, video = false }) {
  return (
    <ScrollView contentContainerStyle={video ? styles.videoContainer : styles.container}>
      {children}
    </ScrollView>
  );
}

function Header({ title, subtitle }) {
  return (
    <>
      <Text style={styles.appTitle}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </>
  );
}

function Card({ children, elevated = false }) {
  return <View style={elevated ? styles.heroCard : styles.card}>{children}</View>;
}

function Section({ title, children }) {
  return (
    <>
      <Text style={styles.section}>{title}</Text>
      {children}
    </>
  );
}

function AppButton({ label, onPress, variant = "primary" }) {
  return (
    <Pressable style={styles[variant]} onPress={onPress}>
      <Text style={variant === "secondary" ? styles.secondaryText : styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function Pill({ children }) {
  return <Text style={styles.pill}>{children}</Text>;
}

function ListItems({ items }) {
  return (
    <>
      {items.map((item, index) => (
        <Text key={`${item}-${index}`} style={styles.concept}>
          • {item}
        </Text>
      ))}
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [methodIndex, setMethodIndex] = useState(0);
  const [formulaIndex, setFormulaIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);
  const [showCardBack, setShowCardBack] = useState(false);
  const [checkIndex, setCheckIndex] = useState(0);
  const [solverIndex, setSolverIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [tbiMode, setTbiMode] = useState(true);

  const module = MODULES[moduleIndex];
  const chapter = CHAPTERS[chapterIndex];
  const solverSteps = useMemo(() => buildSolverSteps(chapter), [chapter]);
  const currentCheck = chapter.checks[checkIndex];
  const currentCard = chapter.cards[flashIndex];
  const currentVideo = chapter.video[videoIndex];

  useEffect(() => {
    if (screen !== "video" || !videoPlaying) return;

    const timer = setTimeout(() => {
      if (videoIndex + 1 < chapter.video.length) {
        setVideoIndex(videoIndex + 1);
      } else {
        setVideoPlaying(false);
      }
    }, 2600);

    return () => clearTimeout(timer);
  }, [screen, videoPlaying, videoIndex, chapter.video.length]);

  function resetChapterState() {
    setFlashIndex(0);
    setShowCardBack(false);
    setCheckIndex(0);
    setSolverIndex(0);
    setVideoIndex(0);
    setVideoPlaying(true);
    setFeedback("");
  }

  function openModule(index) {
    setModuleIndex(index);
    setScreen("module");
    setFeedback("");
  }

  function openChapter(number) {
    const index = CHAPTERS.findIndex((item) => item.number === number);
    if (index === -1) return;

    setChapterIndex(index);
    resetChapterState();
    setScreen("chapter");
  }

  function openVideo() {
    setVideoIndex(0);
    setVideoPlaying(true);
    setScreen("video");
  }

  function goHome() {
    setScreen("home");
    setFeedback("");
  }

  function handleAnswer(choice, item) {
    if (choice === item.correct) {
      setFeedback(`✅ Correct. ${item.why}`);
      setScore((oldScore) => oldScore + 10);
    } else {
      setFeedback(`🧠 Not quite. ${item.why}`);
    }
  }

  function nextFlashcard() {
    if (flashIndex + 1 < chapter.cards.length) {
      setFlashIndex((oldIndex) => oldIndex + 1);
      setShowCardBack(false);
    } else {
      setScreen("check");
      setFeedback("");
    }
  }

  function nextCheck() {
    if (checkIndex + 1 < chapter.checks.length) {
      setCheckIndex((oldIndex) => oldIndex + 1);
      setFeedback("");
    } else {
      setSolverIndex(0);
      setFeedback("");
      setScreen("solver");
    }
  }

  function nextSolverStep() {
    if (solverIndex + 1 < solverSteps.length) {
      setSolverIndex((oldIndex) => oldIndex + 1);
    } else {
      setSolverIndex(0);
      setScreen("boss");
    }
  }

  if (screen === "home") {
    return (
      <Screen>
        <Header title="Physics Final Boss" subtitle="Professional Debug-Friendly Edition" />

        <Card elevated>
          <Text style={styles.heroTitle}>Built to Pass the Final</Text>
          <Text style={styles.text}>
            Use one method for every problem: classify, circle clue words, list givens,
            find the unknown, pick a formula, rearrange, plug in, check units, and sanity check.
          </Text>

          <View style={styles.statRow}>
            <Pill>Score: {score}</Pill>
            <Pill>Modules: {MODULES.length}</Pill>
            <Pill>Chapters: {CHAPTERS.length}</Pill>
          </View>

          <AppButton
            label={tbiMode ? "TBI Mode: ON 🧠" : "TBI Mode: OFF"}
            variant={tbiMode ? "gold" : "gray"}
            onPress={() => setTbiMode(!tbiMode)}
          />

          <AppButton label="Fool-Proof Method" onPress={() => setScreen("method")} />
          <AppButton label="Formula Family Map" variant="purple" onPress={() => setScreen("formulaMap")} />
        </Card>

        {MODULES.map((item, index) => (
          <Pressable key={item.id} style={styles.moduleButton} onPress={() => openModule(index)}>
            <Text style={styles.moduleTitle}>{item.title}</Text>
            <Text style={styles.moduleDates}>{item.dates}</Text>
            <Text style={styles.moduleFocus}>{item.focus}</Text>
            <Text style={styles.moduleExam}>{item.exam}</Text>
          </Pressable>
        ))}
      </Screen>
    );
  }

  if (screen === "method") {
    const step = PROBLEM_METHOD[methodIndex];

    return (
      <Screen>
        <Header title="Fool-Proof Method" subtitle={`${methodIndex + 1}/${PROBLEM_METHOD.length}`} />

        <Card>
          <Text style={styles.section}>{step.title}</Text>
          <Text style={styles.highlight}>{step.short}</Text>
          <Text style={styles.text}>{step.detail}</Text>

          <AppButton
            label={methodIndex + 1 < PROBLEM_METHOD.length ? "Next Step" : "Restart Method"}
            variant="orange"
            onPress={() =>
              setMethodIndex(methodIndex + 1 < PROBLEM_METHOD.length ? methodIndex + 1 : 0)
            }
          />
          <AppButton label="Back Home" variant="secondary" onPress={goHome} />
        </Card>
      </Screen>
    );
  }

  if (screen === "formulaMap") {
    const family = FORMULA_FAMILIES[formulaIndex];

    return (
      <Screen>
        <Header title="Formula Family Map" subtitle={`${formulaIndex + 1}/${FORMULA_FAMILIES.length}`} />

        <Card>
          <Text style={styles.section}>{family.family}</Text>
          <Text style={styles.formula}>{family.formula}</Text>

          <Section title="Clue Words">
            <Text style={styles.clues}>{family.clues}</Text>
          </Section>

          <Section title="When to Use It">
            <Text style={styles.text}>{family.use}</Text>
          </Section>

          <AppButton
            label={formulaIndex + 1 < FORMULA_FAMILIES.length ? "Next Formula Family" : "Restart Map"}
            variant="orange"
            onPress={() =>
              setFormulaIndex(formulaIndex + 1 < FORMULA_FAMILIES.length ? formulaIndex + 1 : 0)
            }
          />
          <AppButton label="Back Home" variant="secondary" onPress={goHome} />
        </Card>
      </Screen>
    );
  }

  if (screen === "module") {
    return (
      <Screen>
        <Header title={module.title} subtitle={module.dates} />

        <Card>
          <Section title="Module Focus">
            <Text style={styles.highlight}>{module.focus}</Text>
          </Section>

          <Section title="Schedule">
            <ListItems items={module.schedule} />
          </Section>

          <Section title="Exam Reminder">
            <Text style={styles.examBox}>{module.exam}</Text>
          </Section>

          <Section title="Practice Chapters">
            {module.chapters.map((number) => {
              const item = getChapter(number);
              if (!item) return null;

              return (
                <Pressable key={number} style={styles.chapterButton} onPress={() => openChapter(number)}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={styles.chapterTitle}>
                    Chapter {item.number}: {item.title}
                  </Text>
                  <Text style={styles.formulaSmall}>{item.formula}</Text>
                </Pressable>
              );
            })}
          </Section>

          <AppButton label="Back Home" variant="secondary" onPress={goHome} />
        </Card>
      </Screen>
    );
  }

  if (screen === "chapter") {
    return (
      <Screen>
        <Header title={`${chapter.emoji} Chapter ${chapter.number}`} subtitle={chapter.title} />

        <Card>
          <Section title="Big Idea">
            <Text style={styles.text}>{chapter.bigIdea}</Text>
          </Section>

          {tbiMode && (
            <Section title="Tiny Brain Version">
              <Text style={styles.highlight}>{chapter.tagline}</Text>
            </Section>
          )}

          <Section title="Main Formula">
            <Text style={styles.formula}>{chapter.formula}</Text>
          </Section>

          <Section title="Clue Words">
            <Text style={styles.clues}>{chapter.clues.join(" • ")}</Text>
          </Section>

          <Section title="Section Map">
            <ListItems items={chapter.sections} />
          </Section>

          <AppButton label="Play Animated Lesson" onPress={openVideo} />
          <AppButton label="Chapter Math Refresher" variant="purple" onPress={() => setScreen("chapterMath")} />
          <AppButton label="Fool-Proof Example Solver" variant="orange" onPress={() => setScreen("solver")} />
          <AppButton label="Start Flashcards" variant="gold" onPress={() => setScreen("flashcards")} />
          <AppButton label="Back to Module" variant="secondary" onPress={() => setScreen("module")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "video") {
    const progress = `${((videoIndex + 1) / chapter.video.length) * 100}%`;

    return (
      <Screen video>
        <Header title="Physics Tok" subtitle={`Chapter ${chapter.number}: ${chapter.title}`} />

        <View style={styles.phoneFrame}>
          <View style={styles.videoTopBar}>
            <Text style={styles.videoBadge}>Animated Lesson</Text>
            <Text style={styles.videoBadge}>
              {videoIndex + 1}/{chapter.video.length}
            </Text>
          </View>

          <View style={styles.videoStage}>
            <Text style={styles.videoEmoji}>{currentVideo[0]}</Text>
            <Text style={styles.videoLine}>{currentVideo[1]}</Text>
            <Text style={styles.videoStatus}>{videoPlaying ? "▶ Playing" : "⏸ Paused"}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progress }]} />
          </View>

          <View style={styles.videoControls}>
            <AppButton
              label="Back"
              variant="gray"
              onPress={() => {
                if (videoIndex > 0) {
                  setVideoIndex((oldIndex) => oldIndex - 1);
                  setVideoPlaying(false);
                }
              }}
            />
            <AppButton
              label={videoPlaying ? "Pause" : "Play"}
              variant="gold"
              onPress={() => setVideoPlaying(!videoPlaying)}
            />
            <AppButton
              label="Next"
              variant="gray"
              onPress={() => {
                if (videoIndex + 1 < chapter.video.length) {
                  setVideoIndex((oldIndex) => oldIndex + 1);
                  setVideoPlaying(false);
                }
              }}
            />
          </View>
        </View>

        <Card>
          <Text style={styles.highlight}>
            Now turn the joke into points: do the chapter math refresher, then the solver.
          </Text>
          <AppButton label="Chapter Math" onPress={() => setScreen("chapterMath")} />
          <AppButton label="Back to Chapter" variant="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "chapterMath") {
    return (
      <Screen>
        <Header title="Chapter Math" subtitle={`Chapter ${chapter.number}: ${chapter.title}`} />

        <Card>
          <Section title="Math Skills for This Chapter">
            <ListItems items={chapter.math} />
          </Section>

          <Section title="Universal Path">
            <Text style={styles.highlight}>
              Classify → circle clues → list givens → unknown → formula → rearrange → plug in → units → sanity check.
            </Text>
          </Section>

          <AppButton label="Go to Solver Example" onPress={() => setScreen("solver")} />
          <AppButton label="Back to Chapter" variant="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "flashcards") {
    return (
      <Screen>
        <Header title="Flashcards" subtitle={`Chapter ${chapter.number} • ${flashIndex + 1}/${chapter.cards.length}`} />

        <View style={styles.flashcard}>
          <Text style={styles.cardLabel}>{showCardBack ? "BACK" : "FRONT"}</Text>
          <Text style={styles.flashText}>{showCardBack ? currentCard[1] : currentCard[0]}</Text>
        </View>

        <AppButton
          label={showCardBack ? "Show Front" : "Flip Card"}
          onPress={() => setShowCardBack(!showCardBack)}
        />
        <AppButton
          label={flashIndex + 1 < chapter.cards.length ? "Next Card" : "Concept Check"}
          variant="orange"
          onPress={nextFlashcard}
        />
        <AppButton label="Back to Chapter" variant="secondary" onPress={() => setScreen("chapter")} />
      </Screen>
    );
  }

  if (screen === "check") {
    return (
      <Screen>
        <Header title="Concept Check" subtitle={`Chapter ${chapter.number} • ${checkIndex + 1}/${chapter.checks.length}`} />

        <Card>
          <Text style={styles.question}>{currentCheck.q}</Text>

          {currentCheck.choices.map((choice) => (
            <Pressable key={choice} style={styles.choice} onPress={() => handleAnswer(choice, currentCheck)}>
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <AppButton label="Next" variant="orange" onPress={nextCheck} />
          <AppButton label="Back to Chapter" variant="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "solver") {
    const [label, value] = solverSteps[solverIndex];

    return (
      <Screen>
        <Header title="Fool-Proof Solver" subtitle={`Chapter ${chapter.number}: ${chapter.title}`} />

        <Card>
          <Text style={styles.stepBadge}>Step {solverIndex + 1}/{solverSteps.length}</Text>
          <Text style={styles.section}>{label}</Text>
          <Text style={styles.solverStep}>{value}</Text>

          <AppButton
            label={solverIndex + 1 < solverSteps.length ? "Next Step" : "Fight Boss"}
            variant="orange"
            onPress={nextSolverStep}
          />
          <AppButton label="Back to Chapter" variant="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "boss") {
    return (
      <Screen>
        <Header title="Chapter Boss" subtitle={`Chapter ${chapter.number}: ${chapter.title}`} />

        <Card>
          <Text style={styles.boss}>THE BOSS ASKS:</Text>
          <Text style={styles.question}>{chapter.boss.q}</Text>

          {chapter.boss.choices.map((choice) => (
            <Pressable key={choice} style={styles.choice} onPress={() => handleAnswer(choice, chapter.boss)}>
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <AppButton label="Back to Module" onPress={() => setScreen("module")} />
          <AppButton label="Back Home" variant="secondary" onPress={goHome} />
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
  videoContainer: {
    flexGrow: 1,
    backgroundColor: "#020617",
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    color: "#f8fafc",
    fontSize: 31,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  subtitle: {
    color: "#f59e0b",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 18,
  },
  heroCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  heroTitle: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    color: "#1f2937",
    fontSize: 17,
    lineHeight: 26,
  },
  section: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 6,
  },
  highlight: {
    color: "#0f172a",
    backgroundColor: "#e0f2fe",
    padding: 15,
    borderRadius: 16,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "800",
  },
  formula: {
    color: "#0f172a",
    backgroundColor: "#f3f4f6",
    padding: 15,
    borderRadius: 16,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  clues: {
    color: "#0f172a",
    backgroundColor: "#dcfce7",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800",
  },
  concept: {
    color: "#1f2937",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  examBox: {
    color: "#0f172a",
    backgroundColor: "#fef3c7",
    padding: 15,
    borderRadius: 16,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 14,
  },
  pill: {
    color: "#0f172a",
    backgroundColor: "#dcfce7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
  },
  moduleButton: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    alignItems: "center",
    borderLeftColor: "#7c3aed",
    borderLeftWidth: 8,
  },
  moduleTitle: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  moduleDates: {
    color: "#7c3aed",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
  },
  moduleFocus: {
    color: "#1f2937",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 23,
  },
  moduleExam: {
    color: "#f59e0b",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },
  chapterButton: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    alignItems: "center",
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  chapterTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  formulaSmall: {
    color: "#4b5563",
    fontSize: 15,
    textAlign: "center",
    marginTop: 5,
  },
  flashcard: {
    width: "100%",
    minHeight: 275,
    backgroundColor: "white",
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  cardLabel: {
    color: "#f59e0b",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  flashText: {
    color: "#0f172a",
    fontSize: 25,
    lineHeight: 35,
    fontWeight: "900",
    textAlign: "center",
  },
  question: {
    color: "#111827",
    fontSize: 22,
    lineHeight: 31,
    fontWeight: "900",
    marginBottom: 12,
  },
  solverStep: {
    color: "#0f172a",
    backgroundColor: "#dcfce7",
    padding: 15,
    borderRadius: 16,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "900",
  },
  stepBadge: {
    color: "white",
    backgroundColor: "#7c3aed",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    overflow: "hidden",
    alignSelf: "flex-start",
    fontWeight: "900",
  },
  choice: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 16,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    marginTop: 10,
  },
  choiceText: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  feedback: {
    color: "#0f172a",
    backgroundColor: "#e0f2fe",
    padding: 15,
    borderRadius: 16,
    marginTop: 16,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "900",
  },
  boss: {
    color: "#f59e0b",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  primary: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    width: "100%",
  },
  purple: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    width: "100%",
  },
  orange: {
    backgroundColor: "#f59e0b",
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    width: "100%",
  },
  gold: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 2,
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    width: "100%",
  },
  gray: {
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    width: "100%",
  },
  secondary: {
    backgroundColor: "white",
    borderColor: "#0f172a",
    borderWidth: 1,
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  secondaryText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  phoneFrame: {
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 34,
    padding: 16,
    borderWidth: 3,
    borderColor: "#334155",
    marginBottom: 18,
  },
  videoTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  videoBadge: {
    color: "#f8fafc",
    backgroundColor: "#7c3aed",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
  },
  videoStage: {
    minHeight: 390,
    backgroundColor: "#0f172a",
    borderRadius: 26,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#f59e0b",
    borderWidth: 2,
  },
  videoEmoji: {
    fontSize: 86,
    marginBottom: 18,
  },
  videoLine: {
    color: "white",
    fontSize: 25,
    lineHeight: 35,
    fontWeight: "900",
    textAlign: "center",
  },
  videoStatus: {
    marginTop: 24,
    backgroundColor: "#f59e0b",
    color: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 15,
    fontWeight: "900",
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#334155",
    borderRadius: 999,
    marginTop: 14,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    backgroundColor: "#f59e0b",
    borderRadius: 999,
  },
  videoControls: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
});