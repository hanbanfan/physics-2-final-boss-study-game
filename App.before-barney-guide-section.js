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
  bg: "#050816",
  card: "#111827",
  card2: "#1e293b",
  text: "#ffffff",
  sub: "#e5e7eb",
  yellow: "#facc15",
  green: "#4ade80",
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
    .replaceAll("pi", "pi")
    .replaceAll("mu", "mu");
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
    formula: "v=flambda, v = sqrt(T/mu), y=A sin(kx-omegat+φ)",
    goals: [
      "Transverse vs longitudinal waves",
      "Wave speed on strings",
      "Sinusoidal wave equations",
      "Snapshot vs history graphs",
      "Sound intensity",
      "Doppler effect",
    ],
  },
  22: {
    id: 22,
    title: "Ch. 22 — Charge and Coulomb Force",
    short: "Charge",
    color: COLORS.yellow,
    formula: "Q=Ne, F=kq_1q_2/r^2",
    goals: [
      "Charge from electrons",
      "Attraction vs repulsion",
      "Coulomb force",
      "Vector components",
      "Conductors and insulators",
    ],
  },
  23: {
    id: 23,
    title: "Ch. 23 — Electric Fields",
    short: "Fields",
    color: COLORS.green,
    formula: "E=F/q, E=k|q|/r^2",
    goals: [
      "Electric field direction",
      "Point charge fields",
      "Superposition",
      "Polarization",
      "Dipoles",
    ],
  },
  24: {
    id: 24,
    title: "Ch. 24 — Flux and Gauss's Law",
    short: "Flux",
    color: COLORS.purple,
    formula: "Phi=EAcostheta, Phi=qenc/epsilon_0",
    goals: [
      "Electric flux",
      "Gauss's Law",
      "Enclosed charge",
      "Symmetry",
      "Rings, wires, plates",
    ],
  },
  25: {
    id: 25,
    title: "Ch. 25 — Electric Potential",
    short: "Potential",
    color: COLORS.orange,
    formula: "V=U/q, ΔU=qΔV",
    goals: [
      "Voltage",
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
    formula: "C=Q/ΔV, Q=epsilon_0AE",
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
    formula: "I=ΔQ/Δt, V = I*R, P = I*V",
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
    formula: "F=qvBsintheta",
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
    formula: "ε=-NΔPhiB/Δt",
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
    formula: "c=flambda, n=lambdavacuum/lambdamaterial",
    goals: [
      "Light frequency",
      "Wavelength",
      "Index of refraction",
      "EM wave speed",
    ],
  },
  32: {
    id: 32,
    title: "Ch. 32 — Mixed Review",
    short: "Review",
    color: COLORS.orange,
    formula: "Identify model first",
    goals: [
      "Mixed problem recognition",
      "Formula sorting",
      "Exam strategy",
      "Unit traps",
    ],
  },
  33: {
    id: 33,
    title: "Ch. 33 — Final Boss Review",
    short: "Final Boss",
    color: COLORS.red,
    formula: "Givens → Unknown → Model → Formula",
    goals: [
      "Cumulative review",
      "Formula fluency",
      "Exam confidence",
      "Survival strategy",
    ],
  },
};



const WORK_ENERGY_ELECTRIC_NOTES = {
  title: "Class Notes — Work, Energy, and Electric Forces",
  bigIdea:
    "Work and energy connect mechanics and electricity. In mechanics, forces change kinetic and potential energy. In electricity, electric forces do the same thing for charges.",
  sections: [
    {
      heading: "1. Work",
      points: [
        "Work is force times displacement in the direction of the force.",
        "Formula: W = F*d*cos(theta).",
        "theta is the angle between force and displacement.",
        "Positive work helps the motion and increases kinetic energy.",
        "Negative work opposes motion and decreases kinetic energy.",
        "No work is done if force and displacement are perpendicular.",
        "If theta = 90 degrees, cos(theta) = 0, so W = 0."
      ]
    },
    {
      heading: "2. Kinetic and Potential Energy",
      points: [
        "Kinetic energy is energy of motion.",
        "Formula: KE = 1/2*m*v^2.",
        "Potential energy is stored energy due to position or configuration.",
        "Gravitational potential energy: PE_g = m*g*y.",
        "Spring potential energy: PE_s = 1/2*k*x^2."
      ]
    },
    {
      heading: "3. Work-Energy Theorem",
      points: [
        "Total work changes kinetic energy.",
        "Formula: W_total = Delta KE.",
        "If total work is positive, speed increases.",
        "If total work is negative, speed decreases.",
        "If total work is zero, kinetic energy does not change."
      ]
    },
    {
      heading: "4. Conservative and Non-Conservative Forces",
      points: [
        "Conservative forces store and return energy.",
        "Gravity, ideal springs, and electric forces are conservative.",
        "For conservative forces: W = -Delta PE.",
        "If there is no friction or air resistance, KE + PE = constant.",
        "Non-conservative forces like friction turn mechanical energy into heat.",
        "With friction or air resistance, mechanical energy decreases."
      ]
    },
    {
      heading: "5. Energy Method for Motion",
      points: [
        "Energy methods can replace long kinematics/Newton's Law setups.",
        "A falling object converts gravitational PE into KE.",
        "For a falling object: m*g*Delta y = 1/2*m*v^2.",
        "Speed from falling height: v = sqrt(2*g*Delta y).",
        "Mass cancels in many simple energy problems."
      ]
    },
    {
      heading: "6. Variable Forces and Springs",
      points: [
        "If force changes with position, work is area under the force vs displacement graph.",
        "Formula: W = integral(F dx).",
        "For springs, F = -kx.",
        "Spring energy comes from the triangular area under the force graph.",
        "Spring potential energy: PE_s = 1/2*k*x^2."
      ]
    },
    {
      heading: "7. Force from Potential Energy",
      points: [
        "Force can be found from potential energy.",
        "Formula idea: F = -gradient(U).",
        "In one dimension: F = -dU/dx.",
        "The negative sign means force points toward lower potential energy.",
        "This works for gravity, springs, and electric forces."
      ]
    },
    {
      heading: "8. Electric Forces and Fields",
      points: [
        "Electric force on a charge in an electric field is F = qE.",
        "Work done by an electric field is W = q*E*d when field and displacement line up.",
        "More generally: W = q*(E dot d).",
        "Electric fields are conservative.",
        "Electric work changes electric potential energy and kinetic energy."
      ]
    },
    {
      heading: "9. Electric Potential Energy",
      points: [
        "Electric potential energy between two point charges is U = k*q1*q2/r.",
        "Like charges have positive potential energy.",
        "Opposite charges have negative potential energy.",
        "Work to assemble charges equals total electric potential energy.",
        "For many charges, add every unique pair once."
      ]
    },
    {
      heading: "10. Gravity vs Electricity",
      points: [
        "Gravity is always attractive.",
        "Electric force can attract or repel.",
        "Gravity uses mass; electricity uses charge.",
        "Gravity field is g; electric field is E.",
        "Gravitational PE: U = mgy.",
        "Electric PE: U = qV or U = k*q1*q2/r.",
        "Both gravity and electric forces are conservative."
      ]
    }
  ],
  formulas: [
    "W = F*d*cos(theta)",
    "KE = 1/2*m*v^2",
    "PE_g = m*g*y",
    "PE_s = 1/2*k*x^2",
    "W_total = Delta KE",
    "W_conservative = -Delta PE",
    "KE + PE = constant when no non-conservative work",
    "v = sqrt(2*g*Delta y)",
    "W = integral(F dx)",
    "F = -dU/dx",
    "F = qE",
    "W_electric = q*E*d",
    "U = qV",
    "DeltaU = q*DeltaV",
    "U = k*q1*q2/r"
  ],
  testClues: [
    "force and displacement angle -> W = F*d*cos(theta)",
    "speed or motion energy -> KE = 1/2*m*v^2",
    "height -> PE_g = mgy",
    "spring or compression/stretch -> PE_s = 1/2*k*x^2",
    "total work -> Delta KE",
    "no friction -> KE + PE conserved",
    "electric field and charge -> F = qE",
    "electric field, charge, distance -> W = qEd",
    "voltage and charge -> U = qV or DeltaU = qDeltaV",
    "two point charges and distance -> U = k*q1*q2/r",
    "assemble charges -> add every pair once"
  ],
  traps: [
    "Work is not just F*d. Use the component of force in the direction of displacement.",
    "Perpendicular force does zero work.",
    "Do not confuse electric potential V with electric potential energy U.",
    "Potential belongs to the location. Potential energy belongs to the charge at that location.",
    "Do not use mass in electric potential energy unless kinetic energy is involved.",
    "For charge assembly, count every pair once.",
    "For electric energy problems, signs matter.",
    "Friction means mechanical energy is not conserved."
  ]
};

const MODULE_TEST_GUIDES = {
  1: {
    title: "Module 1 Test Study Guide — Waves, Charge, Fields, Flux, and Gauss",
    goal:
      "This module tests whether you can move from basic wave behavior into electric charge, Coulomb force, electric fields, electric flux, and Gauss's Law.",
    chapters: ["Ch. 16 Waves", "Ch. 22 Charge/Coulomb Force", "Ch. 23 Electric Fields", "Ch. 24 Flux/Gauss's Law"],
    bigIdeas: [
      "Waves carry energy through space or a medium.",
      "Charge comes in positive and negative types.",
      "Like charges repel; opposite charges attract.",
      "Coulomb's Law gives force between point charges.",
      "Electric field tells what force a positive test charge would feel.",
      "Electric flux measures field passing through a surface.",
      "Gauss's Law connects net flux through a closed surface to enclosed charge.",
      "Symmetry is the cheat code for many electric field and flux problems."
    ],
    formulaMap: [
      "Wave speed: v = f*lambda",
      "String wave speed: v = sqrt(T/mu)",
      "String tension ratio: T_2 = T_1*(v_2/v_1)^2",
      "Charge from electrons: Q = N*(-e)",
      "Coulomb force: F = k*|q_1*q_2|/r^2",
      "Electric field from force: E = F/q",
      "Point charge field: E = k*|q|/r^2",
      "Flux through flat surface: Phi = E*A*cos(theta)",
      "Component flux: Phi = A*(E dot n_hat)",
      "Gauss's Law: Phi = Q_inside/epsilon_0",
      "Inside conductor at equilibrium: E = 0",
      "Conductor surface: E = sigma/epsilon_0",
      "Infinite sheet: E = |sigma|/(2*epsilon_0)"
    ],
    clueMap: [
      "string + tension + wave speed -> v = sqrt(T/mu)",
      "frequency + wavelength -> v = f*lambda",
      "electrons added/removed -> Q = N*e",
      "two charges + distance -> Coulomb's Law",
      "electric field strength + point charge -> E = k|q|/r^2",
      "force on charge in field -> F = qE",
      "neutral object attracted -> polarization",
      "closed surface + enclosed charge -> Gauss's Law",
      "flat surface + angle -> flux formula",
      "xy-plane/xz-plane/yz-plane -> component flux",
      "conductor equilibrium -> E inside conductor is zero",
      "infinite sheet -> pillbox Gaussian surface"
    ],
    problemRecipes: [
      "For wave problems: identify whether the unknown is speed, frequency, wavelength, tension, or graph behavior.",
      "For charge problems: identify signs first, then decide attraction or repulsion.",
      "For Coulomb force vectors: draw charges, draw arrows, then write components.",
      "For electric fields: decide whether the problem asks for field from a charge or force on a charge.",
      "For polarization: remember neutral objects can still attract.",
      "For flux: ask whether the surface is open/flat or closed.",
      "For Gauss's Law: only enclosed charge controls net flux.",
      "For symmetry: cancel components before choosing the final formula."
    ],
    mustPractice: [
      "Charge from number of electrons.",
      "Coulomb force magnitude.",
      "Coulomb force direction and i/j/k components.",
      "Point charge electric field magnitude and direction.",
      "Field superposition at a midpoint.",
      "Polarization with conductors vs insulators.",
      "Flux sign rules.",
      "Flat surface component flux.",
      "Gauss's Law with enclosed charge.",
      "Conductors and cavities.",
      "Infinite sheets, spheres, rods, and Gaussian surface choices."
    ],
    commonMistakes: [
      "Using the angle with the surface instead of the normal vector.",
      "Forgetting nC and microC must become C.",
      "Forgetting cm must become m.",
      "Treating electric field like a scalar when direction matters.",
      "Adding vector magnitudes without checking direction.",
      "Including outside charges in Gauss's Law net flux.",
      "Forgetting entering flux is negative and exiting flux is positive.",
      "Using full sphere charge for a point inside a uniformly charged solid sphere.",
      "Confusing conductor surface field with infinite sheet field."
    ],
    testStrategy: [
      "Start every problem by naming the chapter.",
      "Write GIVEN and UNKNOWN before formulas.",
      "Draw charge diagrams for Ch. 22 and Ch. 23.",
      "Draw normal vectors for Ch. 24 flux problems.",
      "Circle words like enclosed, inside, conductor, normal, field lines, midpoint, and symmetry.",
      "Check units before calculating.",
      "For direction questions, explain the concept before doing math."
    ]
  },

  2: {
    title: "Module 2 Test Study Guide — Potential, Capacitors, Current, and Circuits",
    goal:
      "This module tests whether you understand electric energy, voltage, charge storage, current flow, resistance, and DC circuit behavior.",
    chapters: ["Ch. 25 Electric Potential", "Ch. 26 Capacitance", "Ch. 27 Current/Resistance", "Ch. 28 DC Circuits"],
    bigIdeas: [
      "Voltage is electric potential energy per charge.",
      "Electric potential is scalar; electric field is vector.",
      "Capacitors store separated charge.",
      "Capacitance tells how much charge is stored per volt.",
      "Current is moving charge.",
      "Voltage pushes current; resistance fights current.",
      "Series circuits share current.",
      "Parallel circuits share voltage.",
      "Kirchhoff rules are conservation laws for charge and energy."
    ],
    formulaMap: [
      "Electric potential: V = U/q",
      "Potential energy: U = qV",
      "Energy change: DeltaU = q*DeltaV",
      "Capacitance: C = Q/DeltaV",
      "Capacitor charge: Q = C*DeltaV",
      "Parallel plate capacitance: C = epsilon_0*A/d",
      "Parallel plate field relation: Q = epsilon_0*A*E",
      "Current: I = DeltaQ/DeltaT",
      "Ohm's Law: V = I*R",
      "Power: P = I*V",
      "Power: P = I^2*R",
      "Power: P = V^2/R",
      "Series resistance: R_eq = R_1 + R_2 + ...",
      "Parallel resistance: 1/R_eq = 1/R_1 + 1/R_2 + ..."
    ],
    clueMap: [
      "voltage + energy per charge -> V = U/q",
      "potential energy change -> DeltaU = q*DeltaV",
      "capacitor + charge + voltage -> C = Q/DeltaV",
      "parallel plate + area + spacing -> C = epsilon_0*A/d",
      "diameter plates -> convert diameter to radius, then A = pi*r^2",
      "charge per time -> current",
      "voltage + current + resistance -> V = IR",
      "watts or power -> P = IV or related power formulas",
      "series -> same current",
      "parallel -> same voltage",
      "junction -> current in equals current out",
      "loop -> voltage changes sum to zero"
    ],
    problemRecipes: [
      "For potential: decide if the problem asks for voltage or energy.",
      "For capacitors: identify whether Q, C, DeltaV, E, A, or d is given.",
      "For circular plates: convert diameter to radius before finding area.",
      "For current: look for charge per time.",
      "For resistance: use V = IR when V, I, and R appear.",
      "For power: choose the power formula that uses the variables given.",
      "For circuits: simplify series/parallel sections before solving.",
      "For Kirchhoff: use junction rule for current and loop rule for voltage."
    ],
    mustPractice: [
      "Voltage and potential energy changes.",
      "Capacitance from Q and DeltaV.",
      "Parallel plate capacitor area and spacing.",
      "Charge on plates from electric field.",
      "Current from charge and time.",
      "Ohm's Law plug-and-chug.",
      "Power in a resistor.",
      "Series equivalent resistance.",
      "Parallel equivalent resistance.",
      "Mixed series-parallel circuit simplification.",
      "Kirchhoff junction and loop reasoning."
    ],
    commonMistakes: [
      "Treating voltage like a vector.",
      "Confusing electric potential with electric potential energy.",
      "Using diameter instead of radius for circular capacitor plates.",
      "Forgetting to convert cm or mm to meters.",
      "Adding parallel resistors directly.",
      "Thinking series resistors all have the same voltage.",
      "Thinking parallel resistors all have the same current.",
      "Using the wrong power formula for the givens."
    ],
    testStrategy: [
      "Write whether the problem is energy, capacitor, current, resistance, or circuit.",
      "Circle units: V, C, F, A, ohms, W.",
      "For circuits, label series and parallel before calculating.",
      "Always find equivalent resistance before total current when possible.",
      "For power problems, pick the formula with one unknown.",
      "Check if answers make sense: parallel resistance should be smaller than the smallest branch."
    ]
  },

  3: {
    title: "Module 3 Test Study Guide — Magnetism, Induction, and EM Waves",
    goal:
      "This module tests whether you can connect moving charges, magnetic fields, changing magnetic flux, induced emf, and electromagnetic waves.",
    chapters: ["Ch. 29 Magnetic Fields", "Ch. 30 Electromagnetic Induction", "Ch. 31 Electromagnetic Waves"],
    bigIdeas: [
      "Magnetic force acts on moving charges.",
      "Magnetic force is perpendicular to velocity and magnetic field.",
      "Stationary charges feel no magnetic force.",
      "Changing magnetic flux induces emf.",
      "Lenz's Law says induction opposes the change.",
      "Light is an electromagnetic wave.",
      "For light, c = f*lambda.",
      "Frequency stays constant when light enters a material.",
      "Speed and wavelength change during refraction."
    ],
    formulaMap: [
      "Magnetic force: F = q*v*B*sin(theta)",
      "Circular path radius: r = m*v/(q*B)",
      "Magnetic period: T = 2*pi*m/(q*B)",
      "Magnetic flux: Phi_B = B*A*cos(theta)",
      "Faraday's Law: epsilon = -N*DeltaPhi_B/DeltaT",
      "Magnitude of emf: |epsilon| = N*DeltaPhi_B/DeltaT",
      "Light equation: c = f*lambda",
      "Frequency: f = c/lambda",
      "Index of refraction: n = c/v",
      "Wavelength index relation: n = lambda_vacuum/lambda_material"
    ],
    clueMap: [
      "moving charge + magnetic field -> F = qvBsin(theta)",
      "stationary charge in B field -> F = 0",
      "circular motion in magnetic field -> r = mv/(qB)",
      "changing magnetic field/area/angle -> induction",
      "coil + loops + changing flux -> Faraday's Law",
      "opposes change -> Lenz's Law",
      "wavelength + frequency + light -> c = f*lambda",
      "nm wavelength -> convert to meters",
      "material/refraction/index -> n"
    ],
    problemRecipes: [
      "For magnetic force: check if the charge is moving first.",
      "For magnetic direction: use right-hand rule, then reverse for negative charge.",
      "For circular magnetic motion: set magnetic force equal to centripetal force.",
      "For induction: identify what is changing: B, A, angle, or time.",
      "For Faraday's Law: calculate DeltaPhi first, then divide by DeltaT.",
      "For Lenz's Law: decide what change the induced current must oppose.",
      "For light: convert wavelength to meters before calculating frequency.",
      "For refraction: keep frequency constant."
    ],
    mustPractice: [
      "Magnetic force magnitude.",
      "Magnetic force direction with right-hand rule.",
      "Zero magnetic force cases.",
      "Charged particle circular motion in B field.",
      "Magnetic flux through a loop.",
      "Induced emf from changing flux.",
      "Lenz's Law direction questions.",
      "Frequency from wavelength.",
      "Index of refraction from wavelength or speed.",
      "Red vs blue light comparisons."
    ],
    commonMistakes: [
      "Forgetting magnetic force requires motion.",
      "Using cos(theta) instead of sin(theta) for magnetic force.",
      "Forgetting to reverse direction for negative charges.",
      "Forgetting no changing flux means no induced emf.",
      "Thinking Lenz's Law opposes the field instead of the change.",
      "Forgetting nm must become meters.",
      "Thinking frequency changes during refraction."
    ],
    testStrategy: [
      "For magnetism, ask: is the charge moving?",
      "For magnetic force, find the angle between v and B.",
      "For induction, write what changes before using Faraday's Law.",
      "For Lenz's Law, write 'opposes the change' in words.",
      "For light, convert nm to meters immediately.",
      "Check if your answer direction makes physical sense."
    ]
  },

  4: {
    title: "Module 4 Final Exam Study Guide — Mixed Review and Final Boss Method",
    goal:
      "This module is about recognizing problem types fast and surviving mixed final-exam questions without panicking.",
    chapters: ["Ch. 32 Mixed Review", "Ch. 33 Final Boss Review", "All Previous Chapters"],
    bigIdeas: [
      "The final is mostly formula recognition plus unit discipline.",
      "Clue words identify the chapter.",
      "Units identify the formula.",
      "Drawing diagrams prevents sign errors.",
      "Setup earns points even if arithmetic is hard.",
      "A formula sheet only helps if you know when to use each formula.",
      "The safest method is GIVEN -> UNKNOWN -> MODEL -> FORMULA -> UNITS -> CHECK."
    ],
    formulaMap: [
      "Waves: v = f*lambda",
      "String waves: v = sqrt(T/mu)",
      "Charge: Q = N*e",
      "Coulomb force: F = k*|q_1*q_2|/r^2",
      "Electric field: E = F/q",
      "Point charge field: E = k*|q|/r^2",
      "Flux: Phi = E*A*cos(theta)",
      "Gauss: Phi = Q_inside/epsilon_0",
      "Voltage: V = U/q",
      "Capacitance: C = Q/DeltaV",
      "Ohm's Law: V = I*R",
      "Power: P = I*V",
      "Magnetic force: F = q*v*B*sin(theta)",
      "Faraday: epsilon = -N*DeltaPhi_B/DeltaT",
      "Light: c = f*lambda"
    ],
    clueMap: [
      "frequency/wavelength -> waves or light",
      "tension/string -> string wave speed",
      "electrons added -> charge",
      "two charges separated -> Coulomb force",
      "N/C or V/m -> electric field",
      "closed surface/enclosed charge -> Gauss's Law",
      "normal vector/area/angle -> flux",
      "voltage/energy per charge -> potential",
      "capacitor/farad -> capacitance",
      "ohm/resistor/current -> circuits",
      "moving charge/Tesla -> magnetism",
      "changing flux/coil/emf -> induction",
      "nm/refraction/index -> light"
    ],
    problemRecipes: [
      "Step 1: Breathe and circle clue words.",
      "Step 2: Write GIVEN with units.",
      "Step 3: Write UNKNOWN.",
      "Step 4: Name the chapter/model.",
      "Step 5: Pick formula.",
      "Step 6: Convert units.",
      "Step 7: Plug in.",
      "Step 8: Check units and sign.",
      "Step 9: Ask if the answer is physically reasonable.",
      "Step 10: Move on if stuck and come back later."
    ],
    mustPractice: [
      "One problem from every chapter.",
      "Formula recognition drills.",
      "Unit conversion drills.",
      "Vector direction problems.",
      "Flux sign problems.",
      "Series/parallel circuit recognition.",
      "Magnetic force direction.",
      "Light wavelength/frequency conversion.",
      "Mixed problems where the formula is not obvious."
    ],
    commonMistakes: [
      "Starting with the calculator instead of clue words.",
      "Forgetting unit conversions.",
      "Using the wrong angle.",
      "Ignoring vector direction.",
      "Treating scalar quantities like vectors.",
      "Mixing up field, force, potential, and flux.",
      "Using Gauss's Law when symmetry is not helpful.",
      "Overthinking easy formula-recognition questions."
    ],
    testStrategy: [
      "Do all easy formula-recognition questions first.",
      "Mark hard vector problems and return after building confidence.",
      "Write setup even when unsure.",
      "Use units as clues.",
      "Use diagrams for charges, fields, circuits, and magnetic directions.",
      "Never leave a problem completely blank if you can write the model/formula.",
      "Every time panic hits, write: GIVEN -> UNKNOWN -> MODEL -> FORMULA."
    ]
  }
};

const MODULES = [
  {
    id: 1,
    title: "Module 1",
    subtitle: "Waves + Electrostatics Foundation",
    chapters: [16, 22, 23, 24],
    mission: "Learn waves, charge, electric force, electric fields, flux, and Gauss's Law.",
  },
  {
    id: 2,
    title: "Module 2",
    subtitle: "Potential, Capacitors, Current, Circuits",
    chapters: [25, 26, 27, 28],
    mission: "Learn voltage, electric potential energy, capacitance, current, resistance, and circuits.",
  },
  {
    id: 3,
    title: "Module 3",
    subtitle: "Magnetism, Induction, EM Waves",
    chapters: [29, 30, 31],
    mission: "Learn magnetic force, induction, Faraday's Law, Lenz's Law, and light.",
  },
  {
    id: 4,
    title: "Module 4",
    subtitle: "Final Review",
    chapters: [32, 33],
    mission: "Learn how to recognize problem types and survive mixed final-exam questions.",
  },
];

const LESSONS = {
  16: [
    {
      name: "Transverse vs Longitudinal Waves",
      explain:
        "A wave carries energy without permanently carrying matter with it. The key is the direction the medium wiggles compared to the direction the wave travels.",
      formula: "Transverse = perpendicular. Longitudinal = parallel.",
      clues: "transverse, longitudinal, perpendicular, parallel, sound, string",
      example:
        "A string wave traveling left/right while the string moves up/down is transverse. Sound in air is longitudinal because air compresses and expands along the direction of travel.",
      trap:
        "Do not confuse the motion of the wave with the motion of the particles in the medium.",
      memory: "Transverse turns sideways. Longitudinal lines up.",
      check: "If air molecules compress in the same direction sound travels, what type of wave is it?",
      checkAnswer: "Longitudinal.",
    },
    {
      name: "Wave Speed on a String",
      explain:
        "A wave on a string moves faster when the string is tighter and slower when the string is heavier per meter.",
      formula: "v = √(T/mu)",
      clues: "string, tension, linear density, mass per length, wave speed",
      example:
        "If the same string changes speed, use T_2 = T_1(v_2/v_1)² because speed depends on the square root of tension.",
      trap:
        "Do not forget to square the speed ratio when solving for new tension.",
      memory: "Tighter string = faster wave. Heavier string = slower wave.",
      check: "If tension increases and mu stays the same, does wave speed increase or decrease?",
      checkAnswer: "Increase.",
    },
    {
      name: "Sinusoidal Wave Equation",
      explain:
        "The wave equation tells you the displacement of the wave at any position x and time t.",
      formula: "y(x,t)=A sin(kx-omegat+φ)",
      clues: "amplitude, k, omega, phase, wavelength, frequency",
      example:
        "A is height, k is spatial frequency, omega is time frequency, and φ shifts the wave.",
      trap:
        "k belongs to position. omega belongs to time.",
      memory: "A = height. k = space. omega = time. phi = shift.",
      check: "What formula connects k and wavelength?",
      checkAnswer: "k = 2pi/lambda.",
    },
    {
      name: "Snapshot vs History Graphs",
      explain:
        "A snapshot graph freezes the wave in space. A history graph watches one point over time.",
      formula: "Snapshot: D vs x. History: D vs t.",
      clues: "snapshot, history graph, wave moving left, wave moving right",
      example:
        "If a wave feature is 5 m away and moves at 1 m/s, it reaches the observer in 5 s.",
      trap:
        "Do not copy the shape blindly. Direction of travel controls the time order.",
      memory: "Snapshot = where. History = when.",
      check: "A graph of displacement versus time at one location is what kind of graph?",
      checkAnswer: "History graph.",
    },
    {
      name: "Sound Intensity",
      explain:
        "Sound spreads through space. As it spreads, the same power is shared over a larger area.",
      formula: "I = P/(4pir^2)",
      clues: "intensity, power, distance, spherical, decibel",
      example:
        "Double distance means intensity becomes one-fourth.",
      trap:
        "Decibels are logarithmic. Two speakers do not mean twice the decibels.",
      memory: "Sound spreads like glitter on a growing balloon.",
      check: "If distance triples, intensity becomes what fraction?",
      checkAnswer: "1/9.",
    },
    {
      name: "Doppler Effect",
      explain:
        "The observed frequency changes when the source and observer move relative to each other.",
      formula: "Moving together → higher f. Moving apart → lower f.",
      clues: "Doppler, siren, ambulance, approaching, receding, red shift, blue shift",
      example:
        "An ambulance coming toward you sounds higher pitched. After it passes, pitch drops.",
      trap:
        "Do not memorize signs first. Predict whether frequency should go up or down.",
      memory: "Toward = tighter waves = higher pitch.",
      check: "If a source moves away from you, does observed frequency increase or decrease?",
      checkAnswer: "Decrease.",
    },
  ],

  22: [
    {
      name: "Electric Charge",
      explain:
        "Charge comes in positive and negative types. Electrons are negative. Protons are positive. Objects become charged when electrons move.",
      formula: "Q = N e",
      clues: "electrons added, electrons removed, charge on rod, plastic rubbed with wool",
      example:
        "If 2.0x10¹⁰ electrons are added, Q=(2.0x10¹⁰)(-1.60x10^-19 C)=-3.2x10^-9 C.",
      trap:
        "Added electrons means negative charge. Removed electrons means positive charge.",
      memory: "Electrons added = negative.",
      check: "If electrons are added to a rod, is the rod positive or negative?",
      checkAnswer: "Negative.",
    },
    {
      name: "Coulomb's Law",
      explain:
        "Electric charges push or pull on each other. The force gets weaker with distance squared.",
      formula: "F = k|q_1q_2|/r^2",
      clues: "two charges, separated by distance, electric force, magnitude",
      example:
        "Two + charges repel. A + and - charge attract.",
      trap:
        "Use absolute value for magnitude, then decide direction separately.",
      memory: "Like repel. Opposites attract.",
      check: "What happens to force if distance doubles?",
      checkAnswer: "It becomes one-fourth.",
    },
    {
      name: "Coulomb Vectors",
      explain:
        "Forces are vectors. You must decide the direction, then write components in i, j, k.",
      formula: "F_net = F_1 + F_2 + ...",
      clues: "i, j, k, particle at origin, q0, q1, components",
      example:
        "A positive charge above another positive charge pushes it downward, so the force is in the -j direction.",
      trap:
        "Do not make every force positive. Direction determines signs.",
      memory: "Draw arrows before writing equations.",
      check: "A positive charge above another positive charge pushes it in what y direction?",
      checkAnswer: "Negative y direction.",
    },
    {
      name: "Conductors and Insulators",
      explain:
        "Conductors allow charge to move freely. Insulators keep charge stuck near where it was placed.",
      formula: "Conductor = charge moves. Insulator = charge stuck.",
      clues: "plastic, copper, conductor, insulator, contact, rod",
      example:
        "A negative ball touching a plastic rod leaves negative charge near the contact point. On a conductor, charge spreads out.",
      trap:
        "The answer changes depending on whether the object is plastic or conducting.",
      memory: "Conductor = charge cruises. Insulator = charge is stuck.",
      check: "On a conductor, does excess charge stay local or spread out?",
      checkAnswer: "Spread out.",
    },
  ],

  23: [
    {
      name: "Electric Field Meaning",
      explain:
        "An electric field tells what force a positive test charge would feel at a point.",
      formula: "E = F/q",
      clues: "electric field, test charge, force per charge",
      example:
        "If E points right, a positive test charge would be pushed right.",
      trap:
        "Electric field direction is defined using a positive test charge.",
      memory: "Field points where a positive test charge would go.",
      check: "Does the electric field direction use a positive or negative test charge?",
      checkAnswer: "Positive.",
    },
    {
      name: "Point Charge Field",
      explain:
        "A point charge creates an electric field that weakens with distance squared.",
      formula: "E = k|q|/r^2",
      clues: "point charge, bead, distance from charge, N/C",
      example:
        "A negative bead has field lines pointing toward it.",
      trap:
        "Magnitude is positive. Direction depends on charge sign.",
      memory: "Positive pushes out. Negative pulls in.",
      check: "Field lines point toward what sign of charge?",
      checkAnswer: "Negative.",
    },
    {
      name: "Electric Field Superposition",
      explain:
        "Fields add as vectors. Add x-components with x-components and y-components with y-components.",
      formula: "E_net = E_1 + E_2 + ...",
      clues: "two charges, midpoint, net field, vector sum",
      example:
        "Between two equal positive charges, the midpoint field is zero because the fields oppose.",
      trap:
        "Do not add magnitudes when directions differ.",
      memory: "Fields are arrows. Add arrows.",
      check: "At the midpoint between two equal positive charges, what is the net field?",
      checkAnswer: "Zero.",
    },
    {
      name: "Polarization",
      explain:
        "A charged object can attract a neutral object by shifting its charges slightly.",
      formula: "Neutral object + nearby charge → induced separation",
      clues: "weakly attracted, neutral, conductor, insulator, polarization",
      example:
        "A neutral conductor is strongly attracted because charges move freely. A neutral insulator is weakly attracted.",
      trap:
        "Neutral does not always mean no electric force.",
      memory: "Neutral can still be pulled by polarization.",
      check: "Can a neutral object be attracted to a charged object?",
      checkAnswer: "Yes.",
    },
  ],

  24: [
    {
      name: "Electric Flux",
      explain:
        "Flux measures how much electric field passes through a surface.",
      formula: "Phi = EAcostheta",
      clues: "flux, area, angle, field through surface",
      example:
        "If the field is perpendicular to the surface, flux is maximum.",
      trap:
        "The angle matters. Parallel field through a surface can give zero flux.",
      memory: "Flux = field stabbing through area.",
      check: "What happens to flux when the field is parallel to the surface?",
      checkAnswer: "It is zero.",
    },
    {
      name: "Gauss's Law",
      explain:
        "Gauss's Law relates total flux through a closed surface to the charge inside.",
      formula: "Phi = qenc/epsilon_0",
      clues: "closed surface, enclosed charge, Gauss, total flux",
      example:
        "Charges outside a closed surface may affect local field, but not net flux.",
      trap:
        "Only enclosed charge counts for net flux.",
      memory: "Gauss cares what is inside the bubble.",
      check: "Do outside charges change net flux through a closed surface?",
      checkAnswer: "No.",
    },
    {
      name: "Symmetry",
      explain:
        "Symmetry lets you cancel components and find the direction of the field.",
      formula: "Opposite components cancel; matching components add.",
      clues: "ring, wire, sphere, symmetry, direction",
      example:
        "For a charged ring in the xy-plane, the field on the z-axis points only along z.",
      trap:
        "Do not keep components that symmetry cancels.",
      memory: "Symmetry kills sideways.",
      check: "For a ring on the xy-plane, what direction is field on the z-axis?",
      checkAnswer: "Along the z-axis.",
    },
  ],

  25: [
    {
      name: "Electric Potential",
      explain:
        "Electric potential is electric potential energy per charge. It is a scalar, not a vector.",
      formula: "V = U/q",
      clues: "voltage, potential, energy per charge",
      example:
        "A higher voltage means more energy per coulomb.",
      trap:
        "Electric field is vector. Electric potential is scalar.",
      memory: "Voltage = energy per charge.",
      check: "Is voltage a scalar or vector?",
      checkAnswer: "Scalar.",
    },
  ],

  26: [
    {
      name: "Capacitance",
      explain:
        "A capacitor stores charge. Capacitance tells how much charge it stores per volt.",
      formula: "C = Q/ΔV",
      clues: "capacitor, capacitance, charge, voltage, farad",
      example:
        "If C is large, the capacitor stores more charge for the same voltage.",
      trap:
        "Capacitance is not the same as charge.",
      memory: "Capacitor = charge bucket.",
      check: "What are the units of capacitance?",
      checkAnswer: "Farads.",
    },
  ],

  27: [
    {
      name: "Current and Resistance",
      explain:
        "Current is moving charge. Resistance is how much the material resists current.",
      formula: "I=ΔQ/Δt, V = I*R",
      clues: "current, resistance, ohm, voltage",
      example:
        "If voltage increases across the same resistor, current increases.",
      trap:
        "Current is not voltage. Voltage pushes; current flows.",
      memory: "Voltage pushes, current flows, resistance fights.",
      check: "What is Ohm's Law?",
      checkAnswer: "V = IR.",
    },
  ],

  28: [
    {
      name: "Series and Parallel Circuits",
      explain:
        "Series components share current. Parallel components share voltage.",
      formula: "Series: Req=R1+R2. Parallel: 1/Req=1/R1+1/R2",
      clues: "series, parallel, equivalent resistance",
      example:
        "Two 10 Ω resistors in series make 20 Ω. In parallel they make 5 Ω.",
      trap:
        "Do not add parallel resistors directly.",
      memory: "Series same current. Parallel same voltage.",
      check: "In parallel, what quantity is the same across each branch?",
      checkAnswer: "Voltage.",
    },
  ],

  29: [
    {
      name: "Magnetic Force",
      explain:
        "A magnetic field pushes moving charges sideways. A charge at rest feels no magnetic force.",
      formula: "F = qvBsintheta",
      clues: "magnetic field, moving charge, Tesla, right-hand rule",
      example:
        "Force is maximum when velocity is perpendicular to the magnetic field.",
      trap:
        "No motion means no magnetic force.",
      memory: "Magnetism needs motion.",
      check: "What is magnetic force when v=0?",
      checkAnswer: "Zero.",
    },
  ],

  30: [
    {
      name: "Faraday's Law and Lenz's Law",
      explain:
        "Changing magnetic flux creates induced emf. Lenz's Law gives the direction: the induced effect opposes the change.",
      formula: "ε = -NΔPhiB/Δt",
      clues: "induction, emf, changing flux, coil, Lenz",
      example:
        "Moving a magnet into a coil changes magnetic flux and induces current.",
      trap:
        "No changing flux means no induced emf.",
      memory: "Change flux, get current.",
      check: "What does the minus sign in Faraday's Law represent?",
      checkAnswer: "Lenz's Law: opposition to the change.",
    },
  ],

  31: [
    {
      name: "Electromagnetic Waves and Light",
      explain:
        "Light is an electromagnetic wave. In vacuum, it travels at c = 3.00x10^8 m/s.",
      formula: "c = flambda",
      clues: "light, frequency, wavelength, nm, speed of light",
      example:
        "Blue light has shorter wavelength and higher frequency than red light.",
      trap:
        "Convert nanometers to meters before calculating frequency.",
      memory: "Short wavelength means high frequency.",
      check: "What formula connects light speed, frequency, and wavelength?",
      checkAnswer: "c = flambda.",
    },
    {
      name: "Index of Refraction",
      explain:
        "Index of refraction tells how much light slows in a material.",
      formula: "n = lambdavacuum/lambdamaterial",
      clues: "index of refraction, material, wavelength in material",
      example:
        "If red light has 650 nm in vacuum and 450 nm in material, n = 650/450 = 1.44.",
      trap:
        "Frequency stays constant when light enters a new material.",
      memory: "Refraction changes speed and wavelength, not frequency.",
      check: "Does frequency change when light enters glass?",
      checkAnswer: "No.",
    },
  ],

  32: [
    {
      name: "Mixed Problem Recognition",
      explain:
        "Final exam problems are mostly about recognizing which model applies.",
      formula: "Clue words → chapter → formula",
      clues: "mixed review, final, which formula",
      example:
        "If you see 'enclosed charge,' think Gauss. If you see 'moving charge in B field,' think magnetic force.",
      trap:
        "Do not start by hunting for numbers. Start with clue words.",
      memory: "Clues choose formulas.",
      check: "What should you circle first?",
      checkAnswer: "Clue words.",
    },
  ],

  33: [
    {
      name: "Final Boss Problem Method",
      explain:
        "When you feel stuck, use the same pattern every time.",
      formula: "Givens → Unknown → Model → Formula → Units → Check",
      clues: "any hard problem, final exam, stuck",
      example:
        "Even if you do not know the full solution, you can earn points by identifying the model and formula.",
      trap:
        "Panic makes you skip the setup. The setup is where points live.",
      memory: "No panic. Follow the recipe.",
      check: "What comes before formula?",
      checkAnswer: "Givens, unknown, and model.",
    },
  ],
};



const PROBLEM_SOLVING_RECIPES = {
  universal: {
    title: "Universal Physics Problem System",
    steps: [
      "1. Circle clue words first. Do not touch the calculator yet.",
      "2. Decide the chapter/model: waves, charge, fields, flux, voltage, circuits, magnetism, induction, or light.",
      "3. Write GIVEN: list every number with units.",
      "4. Write UNKNOWN: what is the problem asking for?",
      "5. Pick the formula using clue words, not vibes.",
      "6. Convert units before plugging in: cm to m, mm to m, nC to C, muC to C, nm to m.",
      "7. Solve algebraically first if possible.",
      "8. Plug numbers in carefully.",
      "9. Check units.",
      "10. Reasonableness check: does the answer make physical sense?"
    ],
    panicButton: [
      "If stuck, write: GIVEN → UNKNOWN → MODEL → FORMULA.",
      "If still stuck, identify the chapter from units.",
      "N/C or V/m usually means electric field.",
      "C means charge.",
      "N means force.",
      "V means voltage/potential.",
      "Ω means resistance.",
      "T means magnetic field.",
      "Hz means frequency.",
      "m/s means speed."
    ]
  },

  16: {
    title: "Ch. 16 Problem System — Waves, Sound, Doppler",
    steps: [
      "Step 1: Decide what kind of wave problem it is.",
      "If it says string, tension, or linear density → use v = sqrt(T/mu).",
      "If it says wavelength, frequency, or speed → use v = f lambda.",
      "If it gives y(x,t), k, omega, phase, or sine → use y=A sin(kx - omega t + phi).",
      "If it says snapshot graph → think displacement vs position.",
      "If it says history graph → think displacement vs time.",
      "If it says intensity, sound power, or distance → use I = P/(4pi r^2).",
      "If it says siren, ambulance, moving source, moving observer → use Doppler reasoning.",
      "Step 2: Convert units if needed.",
      "Step 3: Solve for the missing wave variable.",
      "Step 4: Ask if the answer makes sense: higher tension should mean faster wave; farther sound should mean lower intensity."
    ],
    formulas: [
      "v = f lambda",
      "v = sqrt(T/mu)",
      "T2 = T1(v2/v1)^2",
      "k = 2pi/lambda",
      "omega = 2pi f",
      "v = omega/k",
      "I = P/(4pi r^2)"
    ],
    traps: [
      "For string tension ratio, square the speed ratio.",
      "Do not confuse snapshot graph with history graph.",
      "Doppler signs are confusing; first decide if frequency should go up or down.",
      "Decibels are logarithmic, not linear."
    ]
  },

  22: {
    title: "Ch. 22 Problem System — Charge and Coulomb Force",
    steps: [
      "Step 1: Identify charge signs.",
      "Electrons added → negative charge.",
      "Electrons removed → positive charge.",
      "Like charges repel; opposite charges attract.",
      "Step 2: If asked for total charge from electrons → use Q = N(-e).",
      "Step 3: If asked for electric force between charges → use F = k|q1q2|/r^2.",
      "Step 4: If it asks for direction/components → draw the charges first.",
      "Step 5: Decide attraction/repulsion before writing signs.",
      "Step 6: Write i, j, k components based on the arrow direction.",
      "Step 7: If forces balance, set magnitudes equal and solve ratios."
    ],
    formulas: [
      "Q = N e",
      "e = 1.60 x 10^-19 C",
      "F = k|q1q2|/r^2",
      "Fnet = F1 + F2 + ..."
    ],
    traps: [
      "Use C, not nC or muC, inside Coulomb's Law.",
      "Magnitude is positive; direction comes separately.",
      "Do not make every vector component positive.",
      "For balance problems, k and q0 often cancel."
    ]
  },

  23: {
    title: "Ch. 23 Problem System — Electric Fields",
    steps: [
      "Step 1: Decide if the problem asks for force or field.",
      "If it asks for field from a point charge → use E = k|q|/r^2.",
      "If it asks for force on a charge in a field → use F = qE.",
      "If it asks for field direction → positive charges point away, negative charges point toward.",
      "If there are multiple charges → draw each field arrow and add vectors.",
      "If it says neutral object attracted → think polarization.",
      "If it says conductor → charges move freely and polarization is strong.",
      "If it says insulator/plastic → charges stay local and polarization is weak.",
      "Step 2: Convert nC to C and cm to m.",
      "Step 3: Solve magnitude.",
      "Step 4: Add direction sentence."
    ],
    formulas: [
      "E = F/q",
      "F = qE",
      "E = k|q|/r^2",
      "Enet = E1 + E2 + ..."
    ],
    traps: [
      "Electric field direction is based on a positive test charge.",
      "Field magnitude is positive.",
      "Neutral objects can still attract because of polarization.",
      "Fields are vectors; add directions, not just numbers."
    ]
  },

  24: {
    title: "Ch. 24 Problem System — Flux and Gauss's Law",
    steps: [
      "Step 1: Ask: flat surface or closed surface?",
      "Flat surface with area and angle → use Phi = EA cos(theta).",
      "Closed surface with enclosed charge → use Phi = q_enclosed/epsilon_0.",
      "Step 2: If the problem says enclosed charge, ignore outside charges for net flux.",
      "Step 3: If the problem has symmetry, identify what cancels.",
      "Ring on z-axis → sideways components cancel; only z remains.",
      "Wire above midpoint → x-components cancel; y-components add.",
      "Parallel plates with E and area → use Q = epsilon0 A E.",
      "Step 4: Choose the formula after symmetry, not before."
    ],
    formulas: [
      "Phi = EA cos(theta)",
      "Phi = q_enclosed/epsilon_0",
      "Ewire = 2*k*lambda*L/(d*sqrt(d^2+L^2))",
      "Ering = k*q*z/((z^2+a^2)*sqrt(z^2+a^2))",
      "Q = epsilon0 A E"
    ],
    traps: [
      "Only enclosed charge controls total flux.",
      "Outside charges can affect local field but not net flux.",
      "Do not keep components that symmetry cancels.",
      "If Mastering rejects ^(3/2), use the sqrt denominator form."
    ]
  },

  25: {
    title: "Ch. 25 Problem System — Electric Potential",
    steps: [
      "Step 1: Decide if the problem asks for electric field or electric potential.",
      "Electric field is a vector.",
      "Electric potential/voltage is a scalar.",
      "Step 2: If it says energy per charge → use V = U/q.",
      "Step 3: If it asks energy change → use Delta U = q Delta V.",
      "Step 4: Watch the sign of the charge.",
      "Step 5: Check if the answer should be positive or negative based on charge movement."
    ],
    formulas: [
      "V = U/q",
      "U = qV",
      "Delta U = q Delta V"
    ],
    traps: [
      "Voltage is scalar, not vector.",
      "Positive and negative charges behave differently in potential energy problems.",
      "Do not confuse electric potential with electric potential energy."
    ]
  },

  26: {
    title: "Ch. 26 Problem System — Capacitance",
    steps: [
      "Step 1: Identify what is given: Q, C, Delta V, plate area, spacing, or electric field.",
      "If Q, C, and voltage are involved → use C = Q/Delta V.",
      "If parallel plates with area and spacing → use C = epsilon0 A/d.",
      "If electric field and plate area are given → use Q = epsilon0 A E.",
      "Step 2: Convert cm, mm, and nC.",
      "Step 3: If circular plates are given, convert diameter to radius first.",
      "Step 4: Solve for the missing capacitor variable."
    ],
    formulas: [
      "C = Q/Delta V",
      "Q = C Delta V",
      "Delta V = Q/C",
      "C = epsilon0 A/d",
      "Q = epsilon0 A E",
      "A = pi r^2"
    ],
    traps: [
      "Use radius, not diameter, in A = pi r^2.",
      "Convert mm to meters.",
      "Capacitance is not charge.",
      "Plate spacing is not needed if E and area are already given for Q."
    ]
  },

  27: {
    title: "Ch. 27 Problem System — Current and Resistance",
    steps: [
      "Step 1: Identify whether the problem asks for current, voltage, resistance, charge, time, or power.",
      "If charge per time → use I = Delta Q/Delta t.",
      "If voltage/current/resistance → use V = IR.",
      "If power → choose P = IV, P = I^2R, or P = V^2/R based on what is given.",
      "Step 2: Write known values.",
      "Step 3: Pick the formula with one unknown.",
      "Step 4: Solve and check units."
    ],
    formulas: [
      "I = Delta Q/Delta t",
      "V = IR",
      "P = IV",
      "P = I^2 R",
      "P = V^2/R"
    ],
    traps: [
      "Current is not voltage.",
      "Resistance is not power.",
      "Use the power formula that matches the variables you have.",
      "Watch units: amps, volts, ohms, watts."
    ]
  },

  28: {
    title: "Ch. 28 Problem System — DC Circuits",
    steps: [
      "Step 1: Identify series vs parallel.",
      "Series means same current.",
      "Parallel means same voltage.",
      "Step 2: Simplify equivalent resistance.",
      "For series, add resistors directly.",
      "For parallel, add reciprocals.",
      "Step 3: Find total current using V = IR.",
      "Step 4: Work backward to find branch currents or voltage drops.",
      "Step 5: Use Kirchhoff rules if the circuit cannot be simplified easily."
    ],
    formulas: [
      "Series: Req = R1 + R2 + ...",
      "Parallel: 1/Req = 1/R1 + 1/R2 + ...",
      "V = IR",
      "P = IV",
      "Junction rule: current in = current out",
      "Loop rule: voltage changes sum to zero"
    ],
    traps: [
      "Do not add parallel resistors directly.",
      "Parallel equivalent resistance is smaller than the smallest branch resistor.",
      "Series has same current, not same voltage.",
      "Parallel has same voltage, not same current."
    ]
  },

  29: {
    title: "Ch. 29 Problem System — Magnetic Fields",
    steps: [
      "Step 1: Ask if the charge is moving.",
      "If v = 0, magnetic force is zero.",
      "Step 2: Find angle between velocity and magnetic field.",
      "Step 3: Use F = qvB sin(theta).",
      "Step 4: Use the right-hand rule for direction.",
      "Step 5: If path is circular, magnetic force is centripetal force.",
      "Set qvB = mv^2/r when velocity is perpendicular to B."
    ],
    formulas: [
      "F = qvB sin(theta)",
      "r = mv/(qB)",
      "T = 2pi m/(qB)"
    ],
    traps: [
      "Stationary charges feel no magnetic force.",
      "Negative charges reverse the right-hand-rule direction.",
      "Magnetic force is perpendicular to motion, so it does no work.",
      "Use sin(theta), not cos(theta)."
    ]
  },

  30: {
    title: "Ch. 30 Problem System — Electromagnetic Induction",
    steps: [
      "Step 1: Identify what is changing: magnetic field, area, angle, or time.",
      "Step 2: Calculate magnetic flux: PhiB = BA cos(theta).",
      "Step 3: Find change in flux: Delta PhiB.",
      "Step 4: Use Faraday's Law: |epsilon| = N Delta PhiB / Delta t.",
      "Step 5: Use Lenz's Law for direction: induced current opposes the change."
    ],
    formulas: [
      "PhiB = BA cos(theta)",
      "epsilon = -N Delta PhiB / Delta t",
      "|epsilon| = N Delta PhiB / Delta t"
    ],
    traps: [
      "No changing flux means no induced emf.",
      "The minus sign is direction, not magnitude.",
      "Flux changes if B, A, or theta changes.",
      "Lenz's Law always opposes the change, not the field itself."
    ]
  },

  31: {
    title: "Ch. 31 Problem System — Electromagnetic Waves and Light",
    steps: [
      "Step 1: Identify whether the problem asks for frequency, wavelength, speed, or index of refraction.",
      "If wavelength and frequency are involved → use c = f lambda.",
      "If wavelength is in nm → convert to meters.",
      "If light enters a material → frequency stays constant.",
      "If asked for index from wavelengths → use n = lambda_vacuum/lambda_material.",
      "Step 2: Solve for the missing variable.",
      "Step 3: Check if answer makes sense: blue has higher frequency than red."
    ],
    formulas: [
      "c = f lambda",
      "f = c/lambda",
      "lambda = c/f",
      "n = c/v",
      "n = lambda_vacuum/lambda_material"
    ],
    traps: [
      "Convert nm to m.",
      "Frequency does not change in a material.",
      "Index of refraction has no units.",
      "Blue light has shorter wavelength and higher frequency than red light."
    ]
  },

  32: {
    title: "Ch. 32 Problem System — Mixed Review",
    steps: [
      "Step 1: Do not solve yet. Classify first.",
      "Step 2: Circle clue words.",
      "Step 3: Identify units.",
      "Step 4: Pick the chapter.",
      "Step 5: Pick the model.",
      "Step 6: Write the formula.",
      "Step 7: Convert units.",
      "Step 8: Solve.",
      "Step 9: Check reasonableness."
    ],
    formulas: [
      "Givens -> Unknown -> Model -> Formula -> Units -> Check"
    ],
    traps: [
      "Mixed problems are designed to make you pick the wrong chapter.",
      "Units are clues.",
      "Do not plug numbers until the model is chosen."
    ]
  },

  33: {
    title: "Ch. 33 Problem System — Final Boss Method",
    steps: [
      "Step 1: Breathe. Seriously.",
      "Step 2: Write GIVEN.",
      "Step 3: Write UNKNOWN.",
      "Step 4: Circle clue words.",
      "Step 5: Name the chapter.",
      "Step 6: Name the model.",
      "Step 7: Write the formula before plugging in.",
      "Step 8: Convert units.",
      "Step 9: Solve slowly.",
      "Step 10: Check if the answer is physically reasonable."
    ],
    formulas: [
      "Givens -> Unknown -> Model -> Formula -> Units -> Check"
    ],
    traps: [
      "Panic causes skipped steps.",
      "Skipping setup loses easy points.",
      "The formula sheet only helps if you know clue words."
    ]
  }
};

const STUDY_GUIDES = {
  16: {
    title: "Ch. 16 Study Guide — Waves, Sound, Doppler",
    bigIdea: "Waves carry energy. For this course, focus on wave type, wave speed, wave equations, graphs, sound intensity, and Doppler shifts.",
    mustKnow: [
      "Transverse waves: medium moves perpendicular to wave direction.",
      "Longitudinal waves: medium moves parallel to wave direction.",
      "String wave speed: v = sqrt(T/mu).",
      "Sinusoidal wave: y(x,t)=A sin(kx - omega t + phi).",
      "k = 2pi/lambda.",
      "omega = 2pi f.",
      "v = f lambda = omega/k.",
      "Snapshot graph = displacement vs position at one time.",
      "History graph = displacement vs time at one position.",
      "Sound intensity decreases as 1/r^2.",
      "Doppler toward = higher observed frequency.",
      "Doppler away = lower observed frequency.",
    ],
    formulas: [
      "v = f lambda",
      "v = sqrt(T/mu)",
      "T2 = T1(v2/v1)^2",
      "y(x,t)=A sin(kx - omega t + phi)",
      "k = 2pi/lambda",
      "omega = 2pi f",
      "v = omega/k",
      "I = P/(4pi r^2)",
    ],
    clueWords: [
      "string, tension, linear density -> v=sqrt(T/mu)",
      "snapshot graph -> displacement vs position",
      "history graph -> displacement vs time",
      "siren, ambulance, approaching, away -> Doppler",
      "intensity, sound power, distance -> inverse square",
    ],
    traps: [
      "For tension ratio problems, square the speed ratio.",
      "Do not confuse snapshot graphs with history graphs.",
      "Convert nm to meters for light problems.",
      "Do not memorize Doppler signs blindly; predict if frequency goes up or down first.",
      "Decibels are logarithmic, not linear.",
    ],
    examMoves: [
      "Circle wave type first.",
      "Write whether the problem is asking for speed, frequency, wavelength, tension, graph, or intensity.",
      "Check units before plugging in.",
      "Ask if the answer makes physical sense.",
    ],
  },

  22: {
    title: "Ch. 22 Study Guide — Charge and Coulomb Force",
    bigIdea: "Electric charge causes forces. Like charges repel, opposite charges attract, and Coulomb's Law gives the force magnitude.",
    mustKnow: [
      "Electrons are negative.",
      "Adding electrons makes an object negative.",
      "Removing electrons makes an object positive.",
      "Charge is quantized: Q = Ne.",
      "Like charges repel.",
      "Opposite charges attract.",
      "Coulomb force decreases as 1/r^2.",
      "For vectors, direction matters as much as magnitude.",
    ],
    formulas: [
      "Q = N e",
      "e = 1.60 x 10^-19 C",
      "F = k|q1 q2|/r^2",
      "k = 8.99 x 10^9 N m^2/C^2",
      "Fnet = F1 + F2 + ...",
    ],
    clueWords: [
      "electrons added -> Q=N(-e)",
      "two charges separated by distance -> Coulomb force",
      "positive and negative -> attraction",
      "same sign -> repulsion",
      "i, j, k components -> draw force directions first",
    ],
    traps: [
      "Use absolute value for force magnitude, then decide direction separately.",
      "Do not forget microcoulombs must become coulombs.",
      "Do not make every vector component positive.",
      "If q1 is above q0 and both are positive, q0 is pushed downward.",
    ],
    examMoves: [
      "Draw the charges.",
      "Label signs.",
      "Decide attract or repel.",
      "Draw the force arrow.",
      "Only then write i, j, k components.",
    ],
  },

  23: {
    title: "Ch. 23 Study Guide — Electric Fields",
    bigIdea: "Electric fields describe the force a positive test charge would feel. Fields are vectors and can add or cancel.",
    mustKnow: [
      "Electric field means force per charge.",
      "Electric field direction is defined by a positive test charge.",
      "Positive source charge: field points away.",
      "Negative source charge: field points toward.",
      "Point charge field decreases as 1/r^2.",
      "Fields add as vectors.",
      "Neutral objects can be attracted by polarization.",
      "Conductors polarize strongly; insulators weakly.",
    ],
    formulas: [
      "E = F/q",
      "F = qE",
      "E = k|q|/r^2",
      "Enet = E1 + E2 + ...",
    ],
    clueWords: [
      "electric field strength, N/C, V/m -> E",
      "point charge, distance from bead -> E=k|q|/r^2",
      "direction of field -> away from +, toward -",
      "weakly attracted -> neutral insulator polarization",
      "strongly attracted neutral conductor -> induced charge separation",
      "dipole -> vector addition and cancellation",
    ],
    traps: [
      "Field magnitude is positive; direction comes separately.",
      "A neutral object can still be attracted.",
      "Do not add field magnitudes if directions differ.",
      "For dipoles, fields can decrease faster than 1/r^2 far away.",
    ],
    examMoves: [
      "Identify source charge sign.",
      "Draw field arrows.",
      "Break into components if there is more than one charge.",
      "Use symmetry when possible.",
    ],
  },

  24: {
    title: "Ch. 24 Study Guide — Flux and Gauss's Law",
    bigIdea: "Flux measures electric field passing through a surface. Gauss's Law connects total flux through a closed surface to enclosed charge.",
    mustKnow: [
      "Flux through a flat surface: Phi = EA cos theta.",
      "Maximum flux when field is perpendicular to surface.",
      "Zero flux when field is parallel to surface.",
      "Gauss's Law: total closed-surface flux = qenc/epsilon0.",
      "Only enclosed charge affects net flux.",
      "Outside charges can affect local field but not net flux.",
      "Symmetry helps cancel components.",
      "For rings and wires, use symmetry before formulas.",
    ],
    formulas: [
      "Phi = EA cos(theta)",
      "Phi = q_enclosed/epsilon_0",
      "Ewire = 2*k*lambda*L/(d*sqrt(d^2+L^2))",
      "Ering = k*q*z/((z^2+a^2)*sqrt(z^2+a^2))",
      "Q = epsilon0*A*E",
    ],
    clueWords: [
      "flux, area, angle -> Phi = E*A*cos(theta)",
      "closed surface, enclosed charge -> Gauss's Law",
      "wire, midpoint, linear charge density -> finite wire field",
      "ring, z-axis, radius a -> charged ring field",
      "parallel plates and field given -> Q = epsilon_0*A*E",
    ],
    traps: [
      "Only enclosed charge counts for net flux.",
      "Do not include components symmetry cancels.",
      "Mastering may reject ^(3/2); use sqrt denominator form.",
      "Plate spacing is not needed if electric field is already given.",
    ],
    examMoves: [
      "Ask: flat surface or closed surface?",
      "If closed, identify enclosed charge.",
      "If symmetric, cancel components first.",
      "Use the simplest formula after symmetry.",
    ],
  },

  25: {
    title: "Ch. 25 Study Guide — Electric Potential",
    bigIdea: "Electric potential is energy per charge. Unlike electric field, voltage is a scalar.",
    mustKnow: [
      "Voltage means electric potential energy per charge.",
      "Potential is scalar.",
      "Electric field is vector.",
      "Charges move from high potential energy to low potential energy depending on sign.",
    ],
    formulas: [
      "V = U/q",
      "U = qV",
      "Delta U = q Delta V",
    ],
    clueWords: [
      "voltage, potential, electric potential -> V",
      "energy per charge -> V=U/q",
      "potential energy change -> Delta U=qDeltaV",
    ],
    traps: [
      "Do not treat voltage like a vector.",
      "Sign of charge matters for potential energy.",
    ],
    examMoves: [
      "Decide if the question asks for field or potential.",
      "Use scalar thinking for voltage.",
    ],
  },

  26: {
    title: "Ch. 26 Study Guide — Capacitance",
    bigIdea: "A capacitor stores separated charge. Capacitance tells how much charge is stored per volt.",
    mustKnow: [
      "Capacitance is charge stored per voltage.",
      "Parallel plates store charge on opposite plates.",
      "Bigger area increases capacitance.",
      "Bigger plate spacing decreases capacitance.",
      "Dielectrics increase capacitance.",
    ],
    formulas: [
      "C = Q/Delta V",
      "Q = C Delta V",
      "C = epsilon0 A/d",
      "Q = epsilon0 A E",
    ],
    clueWords: [
      "capacitor, capacitance, farad -> C",
      "parallel plate, area, spacing -> C=epsilon0A/d",
      "field inside plates and charge -> Q = epsilon_0*A*E",
    ],
    traps: [
      "Capacitance is not charge.",
      "Convert cm and mm to meters.",
      "Use radius, not diameter, for circular plate area.",
    ],
    examMoves: [
      "Identify whether the problem gives voltage, field, area, or spacing.",
      "Choose Q=CV or Q = epsilon_0*A*E accordingly.",
    ],
  },

  27: {
    title: "Ch. 27 Study Guide — Current and Resistance",
    bigIdea: "Current is moving charge. Voltage pushes current. Resistance fights current.",
    mustKnow: [
      "Current is charge per time.",
      "Ohm's Law connects voltage, current, and resistance.",
      "Power in circuits can be written several ways.",
      "Resistance depends on material and geometry.",
    ],
    formulas: [
      "I = Delta Q/Delta t",
      "V = IR",
      "P = IV",
      "P = I^2 R",
      "P = V^2/R",
    ],
    clueWords: [
      "current, charge per time -> I=DeltaQ/DeltaT",
      "ohm, resistance, voltage -> V = I*R",
      "power, watts -> P = I*V",
    ],
    traps: [
      "Current is not voltage.",
      "Use consistent units.",
      "Power formulas are interchangeable only after using Ohm's Law correctly.",
    ],
    examMoves: [
      "Write what you know: V, I, R, or P.",
      "Pick the formula with one unknown.",
    ],
  },

  28: {
    title: "Ch. 28 Study Guide — DC Circuits",
    bigIdea: "Series circuits share current. Parallel circuits share voltage.",
    mustKnow: [
      "Series resistors add directly.",
      "Parallel resistors add by reciprocals.",
      "Current is the same in series.",
      "Voltage is the same in parallel.",
      "Kirchhoff junction rule: current in equals current out.",
      "Kirchhoff loop rule: voltage changes around a loop sum to zero.",
    ],
    formulas: [
      "Series: Req = R1 + R2 + ...",
      "Parallel: 1/Req = 1/R1 + 1/R2 + ...",
      "V = IR",
      "P = IV",
    ],
    clueWords: [
      "series -> same current",
      "parallel -> same voltage",
      "junction -> current rule",
      "loop -> voltage rule",
    ],
    traps: [
      "Do not add parallel resistors directly.",
      "Equivalent resistance in parallel is smaller than the smallest branch resistor.",
      "Keep track of battery rises and resistor drops.",
    ],
    examMoves: [
      "Simplify the circuit step by step.",
      "Label series vs parallel.",
      "Use V = I*R after finding equivalent resistance.",
    ],
  },

  29: {
    title: "Ch. 29 Study Guide — Magnetic Fields",
    bigIdea: "Magnetic fields push moving charges sideways. No motion means no magnetic force.",
    mustKnow: [
      "Magnetic force requires moving charge.",
      "Force is perpendicular to velocity and magnetic field.",
      "Maximum force occurs at 90 degrees.",
      "Zero force occurs when motion is parallel to B.",
      "Right-hand rule gives direction for positive charges.",
    ],
    formulas: [
      "F = qvB sin(theta)",
      "r = mv/(qB)",
      "T = 2pi m/(qB)",
    ],
    clueWords: [
      "moving charge, magnetic field, Tesla -> F=qvBsin(theta)",
      "circular path in magnetic field -> r=mv/qB",
      "right-hand rule -> direction",
    ],
    traps: [
      "Stationary charge feels no magnetic force.",
      "Negative charges reverse right-hand-rule direction.",
      "Magnetic force does no work because it is perpendicular to motion.",
    ],
    examMoves: [
      "Check if charge is moving.",
      "Find angle between v and B.",
      "Use right-hand rule after magnitude.",
    ],
  },

  30: {
    title: "Ch. 30 Study Guide — Electromagnetic Induction",
    bigIdea: "Changing magnetic flux creates induced emf. Lenz's Law says the induced effect opposes the change.",
    mustKnow: [
      "Changing flux induces emf.",
      "Flux depends on B, area, and angle.",
      "Lenz's Law gives direction.",
      "Induced current opposes the change in flux.",
    ],
    formulas: [
      "PhiB = BA cos(theta)",
      "epsilon = -N Delta PhiB / Delta t",
      "|epsilon| = N Delta PhiB / Delta t",
    ],
    clueWords: [
      "changing magnetic field -> induction",
      "coil, loops, time change -> Faraday",
      "opposes change -> Lenz",
      "magnetic flux -> BAcos(theta)",
    ],
    traps: [
      "No changing flux means no induced emf.",
      "The minus sign is direction, not usually magnitude.",
      "Area, angle, or B can change flux.",
    ],
    examMoves: [
      "Identify what is changing: B, A, angle, or time.",
      "Find Delta Phi.",
      "Use Faraday for magnitude.",
      "Use Lenz for direction.",
    ],
  },

  31: {
    title: "Ch. 31 Study Guide — Electromagnetic Waves and Light",
    bigIdea: "Light is an electromagnetic wave. Its speed, frequency, wavelength, and refraction are connected.",
    mustKnow: [
      "In vacuum, light speed is c = 3.00 x 10^8 m/s.",
      "c = f lambda.",
      "Blue light has shorter wavelength and higher frequency.",
      "Red light has longer wavelength and lower frequency.",
      "Frequency stays constant during refraction.",
      "Speed and wavelength change in a material.",
    ],
    formulas: [
      "c = f lambda",
      "f = c/lambda",
      "n = c/v",
      "n = lambda_vacuum/lambda_material",
    ],
    clueWords: [
      "frequency of light, wavelength nm -> f=c/lambda",
      "index of refraction -> n",
      "wavelength in material -> n=lambdaVac/lambdaMat",
    ],
    traps: [
      "Convert nm to meters.",
      "Frequency does not change in the material.",
      "Index of refraction has no units.",
    ],
    examMoves: [
      "Convert wavelength first.",
      "Use c=flambda for vacuum.",
      "Use n ratio for material wavelength.",
    ],
  },

  32: {
    title: "Ch. 32 Study Guide — Mixed Review",
    bigIdea: "Mixed review is about recognizing the problem type before touching the calculator.",
    mustKnow: [
      "Clue words identify the chapter.",
      "Units identify the formula.",
      "Every problem has givens and an unknown.",
      "A formula sheet only helps if you know when to use each formula.",
    ],
    formulas: [
      "Givens -> Unknown -> Model -> Formula -> Units -> Check",
    ],
    clueWords: [
      "enclosed charge -> Gauss",
      "moving charge in B -> magnetic force",
      "resistance/current -> circuits",
      "wavelength/frequency -> waves or light",
    ],
    traps: [
      "Do not start by plugging numbers randomly.",
      "Do not ignore units.",
    ],
    examMoves: [
      "Circle clue words.",
      "Name the chapter.",
      "Write the formula.",
      "Plug in only after units are correct.",
    ],
  },

  33: {
    title: "Ch. 33 Study Guide — Final Boss Review",
    bigIdea: "Final boss mode is about staying calm and using the same process every time.",
    mustKnow: [
      "You can earn points with setup even if the final number is hard.",
      "Formula recognition matters most.",
      "Units can save you from wrong formulas.",
      "Reasonableness checks catch disasters.",
    ],
    formulas: [
      "Givens -> Unknown -> Model -> Formula -> Units -> Check",
    ],
    clueWords: [
      "any hard problem -> slow down and classify",
      "multiple chapters -> compare clue words",
    ],
    traps: [
      "Panic makes you skip the setup.",
      "Skipping units causes avoidable mistakes.",
    ],
    examMoves: [
      "Breathe.",
      "Write givens.",
      "Write unknown.",
      "Pick model.",
      "Use formula.",
      "Check units.",
    ],
  },
};


const ELECTRIC_CHARGE_LECTURE_LESSONS = {
  22: [
    {
      name: "Atomic Structure and Electric Charge",
      explain:
        "Matter is made of atoms. Atoms have a nucleus with protons and neutrons, and electrons around the outside. Protons are positive, electrons are negative, and neutrons are neutral.",
      formula: "net charge = positive charge - negative charge",
      clues: "protons, electrons, neutrons, atom, net charge, valence electrons",
      example:
        "A neutral atom has equal protons and electrons. If it gains electrons, it becomes negative. If it loses electrons, it becomes positive.",
      trap:
        "Neutrons do not affect electric charge. They stabilize the nucleus but do not count as positive or negative charge.",
      memory:
        "Protons plus. Electrons minus. Neutrons neutral. Electrons are what usually move.",
      check:
        "If an atom has more electrons than protons, is it positive, negative, or neutral?",
      checkAnswer: "Negative.",
    },
    {
      name: "Valence Electrons, Conductors, and Insulators",
      explain:
        "Valence electrons are outer-shell electrons. Materials with free-moving valence electrons conduct electricity well. Metals are good conductors. Rubber and plastic are insulators because their electrons are tightly bound.",
      formula: "more free electrons -> higher conductivity",
      clues: "valence electrons, conductor, insulator, metal, rubber, plastic, free electrons",
      example:
        "Gold conducts well because it has free electrons that can move. Rubber insulates because its electrons are not free to move.",
      trap:
        "More valence electrons alone does not automatically mean better conductivity in every material; what matters most is whether electrons are free to move.",
      memory:
        "Conductor = electrons can cruise. Insulator = electrons are stuck.",
      check:
        "Which conducts better: metal or rubber?",
      checkAnswer: "Metal.",
    },
    {
      name: "Charge Interaction and Static Electricity",
      explain:
        "Charges exert forces on each other. Like charges repel and opposite charges attract. Static electricity happens when charge transfers and builds up on an object.",
      formula: "like repel; opposites attract",
      clues: "static electricity, rubbing, charge transfer, attract, repel",
      example:
        "Rubbing plastic with wool can transfer electrons, leaving one object negatively charged and the other positively charged.",
      trap:
        "Static electricity is not magic; it is charge imbalance.",
      memory:
        "Same signs shove. Opposite signs snuggle.",
      check:
        "Do two negative charges attract or repel?",
      checkAnswer: "Repel.",
    },
    {
      name: "Coulomb's Law: Force Magnitude",
      explain:
        "Coulomb's Law tells how strong the electric force is between two point charges. The force grows when charges are larger and shrinks quickly as distance increases.",
      formula: "F = k|q1 q2|/r^2",
      clues: "two charges, separated by distance, electric force, Coulomb",
      example:
        "If distance doubles, force becomes one-fourth as large because r is squared.",
      trap:
        "Use charge in coulombs, not nC or microC. Convert before plugging in.",
      memory:
        "Big charges = big force. Big distance = much smaller force.",
      check:
        "If distance doubles, what happens to electric force?",
      checkAnswer: "It becomes one-fourth.",
    },
    {
      name: "Coulomb's Law: Direction",
      explain:
        "The sign of q1q2 tells the force direction. A positive product means same sign charges, so they repel. A negative product means opposite signs, so they attract.",
      formula: "q1q2 positive -> repel; q1q2 negative -> attract",
      clues: "direction, sign, positive product, negative product, unit vector",
      example:
        "Two positive charges repel. A positive and a negative charge attract.",
      trap:
        "Do not let the sign make the force magnitude negative. Magnitude is positive; direction is handled with arrows/components.",
      memory:
        "Magnitude is size. Sign decides push or pull.",
      check:
        "If q1q2 is negative, is the force attractive or repulsive?",
      checkAnswer: "Attractive.",
    },
    {
      name: "Newton's Third Law for Charges",
      explain:
        "The force from charge 1 on charge 2 and the force from charge 2 on charge 1 are equal in size and opposite in direction.",
      formula: "F12 = -F21",
      clues: "force on charge 1, force on charge 2, equal and opposite",
      example:
        "If q1 pushes q2 to the right, q2 pushes q1 to the left with equal magnitude.",
      trap:
        "The forces are equal even if the charges have different sizes. Acceleration can differ because masses may differ.",
      memory:
        "Forces match. Accelerations may not.",
      check:
        "Are Coulomb forces between two charges equal in magnitude?",
      checkAnswer: "Yes.",
    },
    {
      name: "Constants and Units",
      explain:
        "Electric charge is measured in coulombs. The elementary charge is 1.60 x 10^-19 C. Coulomb's constant k is 8.99 x 10^9 N m^2/C^2. k is related to epsilon0, the permittivity of free space.",
      formula: "k = 1/(4 pi epsilon0)",
      clues: "coulomb, elementary charge, k, epsilon0, permittivity",
      example:
        "epsilon0 = 8.85 x 10^-12 C^2/(N m^2), and k = 1/(4 pi epsilon0).",
      trap:
        "Your lecture notes may show 1.06 x 10^-19 C, but the standard elementary charge used in physics is 1.60 x 10^-19 C.",
      memory:
        "e = 1.60e-19 C. k = 8.99e9. epsilon0 = 8.85e-12.",
      check:
        "What is the charge magnitude of one electron?",
      checkAnswer: "1.60 x 10^-19 C.",
    },
    {
      name: "Vector Problem System for Electric Forces",
      explain:
        "For multi-dimensional Coulomb problems, draw the charges, decide attract/repel, draw force arrows, then break forces into x, y, z components.",
      formula: "Fnet = F1 + F2 + ...",
      clues: "components, i, j, k, vector, unit vector, x y z",
      example:
        "A positive charge above another positive charge repels it downward, giving a negative j component.",
      trap:
        "Do not skip the diagram. Most sign errors come from not drawing arrows.",
      memory:
        "Draw arrows before equations.",
      check:
        "What should you do before writing i, j, k components?",
      checkAnswer: "Draw the force directions.",
    },
  ],

  23: [
    {
      name: "Electric Field Concept",
      explain:
        "An electric field describes how a charge influences the space around it. It tells what force a positive test charge would feel at a point.",
      formula: "E = F/q",
      clues: "electric field, force per charge, test charge, N/C",
      example:
        "If the electric field points right, a positive test charge placed there would feel a force to the right.",
      trap:
        "Electric field is not the same thing as force. Field is force per unit charge.",
      memory:
        "Field = force instructions for a positive test charge.",
      check:
        "Electric field is force per what?",
      checkAnswer: "Per charge.",
    },
    {
      name: "Electric Field of a Point Charge",
      explain:
        "A point charge creates an electric field around it. The field gets weaker with distance squared.",
      formula: "E = k|Q|/r^2",
      clues: "point charge, distance, field strength, source charge",
      example:
        "A positive charge creates field lines outward. A negative charge creates field lines inward.",
      trap:
        "Use absolute value for field magnitude, then use charge sign for direction.",
      memory:
        "Positive pushes field out. Negative pulls field in.",
      check:
        "Do electric field lines point toward or away from a negative charge?",
      checkAnswer: "Toward.",
    },
    {
      name: "Electric Field Lines",
      explain:
        "Field lines show electric field direction. Lines start on positive charges and end on negative charges.",
      formula: "positive -> outward; negative -> inward",
      clues: "field lines, radiate, inward, outward, direction",
      example:
        "Around a single positive charge, field arrows point away in all directions.",
      trap:
        "Field lines are a model, not little physical strings in space.",
      memory:
        "Field lines leave plus and enter minus.",
      check:
        "Where do electric field lines begin?",
      checkAnswer: "On positive charges.",
    },
    {
      name: "Superposition of Electric Fields",
      explain:
        "If multiple charges create fields, the total electric field is the vector sum of all individual fields.",
      formula: "Enet = E1 + E2 + E3 + ...",
      clues: "multiple charges, net field, superposition, vector sum",
      example:
        "At the midpoint between equal positive charges, the fields cancel because they point in opposite directions.",
      trap:
        "Do not add magnitudes when field arrows point in different directions.",
      memory:
        "Fields are arrows. Add arrows.",
      check:
        "At the midpoint between two equal positive charges, what is the net field?",
      checkAnswer: "Zero.",
    },
    {
      name: "Polarization in Insulators",
      explain:
        "Insulators do not let charges travel freely, but charges inside them can shift slightly. This creates polarization and can cause attraction to charged objects.",
      formula: "external charge -> slight internal charge separation",
      clues: "polarization, insulator, neutral object, weak attraction",
      example:
        "A charged balloon can attract neutral bits of paper because their charges polarize.",
      trap:
        "Neutral does not mean unaffected.",
      memory:
        "Neutral can still nudge.",
      check:
        "Can a neutral insulator be attracted to a charged object?",
      checkAnswer: "Yes.",
    },
    {
      name: "Conductors and Charge Redistribution",
      explain:
        "Conductors have free electrons. When near a charged object, their charges move and redistribute strongly.",
      formula: "conductor -> free charge rearranges",
      clues: "conductor, copper, metal, free charge, redistribution",
      example:
        "A neutral copper ball can be strongly attracted to a charged object because its electrons shift.",
      trap:
        "A neutral conductor can feel strong attraction even though its net charge is zero.",
      memory:
        "Conductors let charge run around.",
      check:
        "Why do conductors polarize strongly?",
      checkAnswer: "They have free-moving charges.",
    },
    {
      name: "Dipoles",
      explain:
        "A dipole is two equal and opposite charges separated by a distance. Dipoles can rotate and align in external electric fields.",
      formula: "dipole = +q and -q separated",
      clues: "dipole, equal and opposite charges, torque, alignment",
      example:
        "In an external electric field, the positive side of a dipole feels force one way and the negative side feels force the other way, creating torque.",
      trap:
        "A dipole can have zero net charge but still interact strongly with fields.",
      memory:
        "Dipole = tiny plus-minus arrow.",
      check:
        "Can a dipole have zero net charge?",
      checkAnswer: "Yes.",
    },
  ],

  27: [
    {
      name: "Conductivity and Resistivity Analogy",
      explain:
        "Conductivity measures how easily charge flows. Resistivity measures how much a material resists charge flow. Think of current like water in a hose: more obstacles means more resistivity.",
      formula: "high conductivity -> easier current; high resistivity -> harder current",
      clues: "conductivity, resistivity, current flow, metal, rubber, obstacles",
      example:
        "Metals conduct because they have mobile electrons. Rubber resists current because its electrons are tightly bound.",
      trap:
        "Conductivity describes material behavior, not just whether an object has charge.",
      memory:
        "Conductivity opens the hose. Resistivity clogs the hose.",
      check:
        "Which has higher resistivity: metal or rubber?",
      checkAnswer: "Rubber.",
    },
  ],
};


Object.entries(ELECTRIC_CHARGE_LECTURE_LESSONS).forEach(([chapter, newLessons]) => {
  const id = Number(chapter);
  if (!LESSONS[id]) {
    LESSONS[id] = [];
  }

  newLessons.forEach((lesson) => {
    if (!LESSONS[id].some((existing) => existing.name === lesson.name)) {
      LESSONS[id].push(lesson);
    }
  });
});


function uniqueByKey(items, keyFn) {
  const seen = new Set();
  const out = [];

  items.forEach((item) => {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  });

  return out;
}

const BASE_MEMORY_CARDS = [
  // Ch. 16
  { chapter: 16, front: "Transverse wave?", back: "Medium moves perpendicular to wave direction." },
  { chapter: 16, front: "Longitudinal wave?", back: "Medium moves parallel to wave direction." },
  { chapter: 16, front: "String wave speed formula?", back: "v = sqrt(T/mu)." },
  { chapter: 16, front: "If tension increases, string wave speed does what?", back: "Increases." },
  { chapter: 16, front: "If linear density mu increases, wave speed does what?", back: "Decreases." },
  { chapter: 16, front: "Wave speed using frequency and wavelength?", back: "v = f*lambda." },
  { chapter: 16, front: "Wave number k?", back: "k = 2*pi/lambda." },
  { chapter: 16, front: "Angular frequency omega?", back: "omega = 2*pi*f." },
  { chapter: 16, front: "Wave speed from omega and k?", back: "v = omega/k." },
  { chapter: 16, front: "Snapshot graph?", back: "Displacement vs position at one instant." },
  { chapter: 16, front: "History graph?", back: "Displacement vs time at one position." },
  { chapter: 16, front: "Sound intensity vs distance?", back: "I is proportional to 1/r^2." },
  { chapter: 16, front: "Doppler moving toward?", back: "Observed frequency increases." },
  { chapter: 16, front: "Doppler moving away?", back: "Observed frequency decreases." },
  { chapter: 16, front: "Sonic boom condition?", back: "Source speed exceeds wave speed, Mach > 1." },

  // Ch. 22
  { chapter: 22, front: "Charge of one electron?", back: "-1.60 x 10^-19 C." },
  { chapter: 22, front: "Electrons added means object becomes?", back: "Negative." },
  { chapter: 22, front: "Electrons removed means object becomes?", back: "Positive." },
  { chapter: 22, front: "Coulomb force formula?", back: "F = k*|q_1*q_2|/r^2." },
  { chapter: 22, front: "Coulomb constant k?", back: "8.99 x 10^9 N*m^2/C^2." },
  { chapter: 22, front: "Like charges do what?", back: "Repel." },
  { chapter: 22, front: "Opposite charges do what?", back: "Attract." },
  { chapter: 22, front: "If distance doubles, Coulomb force becomes?", back: "One-fourth as large." },
  { chapter: 22, front: "For Coulomb force magnitude, should the answer be negative?", back: "No. Magnitude is positive; direction handles signs." },
  { chapter: 22, front: "First step for Coulomb vector problems?", back: "Draw charges and force arrows." },
  { chapter: 22, front: "q_1 above q_0, both positive: force on q_0 points?", back: "Down, negative j direction." },
  { chapter: 22, front: "Newton's Third Law for two charges?", back: "Forces are equal in size and opposite in direction." },

  // Ch. 23
  { chapter: 23, front: "Electric field meaning?", back: "Force per charge." },
  { chapter: 23, front: "Electric field formula from force?", back: "E = F/q." },
  { chapter: 23, front: "Point charge field formula?", back: "E = k*|q|/r^2." },
  { chapter: 23, front: "Field direction from positive charge?", back: "Away from the charge." },
  { chapter: 23, front: "Field direction from negative charge?", back: "Toward the charge." },
  { chapter: 23, front: "Fields from multiple charges combine by?", back: "Vector addition / superposition." },
  { chapter: 23, front: "Neutral object attracted by charge because of?", back: "Polarization." },
  { chapter: 23, front: "Conductor polarization is strong because?", back: "Charges move freely." },
  { chapter: 23, front: "Insulator charges mostly do what?", back: "Stay local / shift slightly." },
  { chapter: 23, front: "Dipole definition?", back: "Equal and opposite charges separated by distance." },
  { chapter: 23, front: "Can a dipole have zero net charge?", back: "Yes." },
  { chapter: 23, front: "Field at midpoint between equal positive charges?", back: "Zero." },

  // Ch. 24
  { chapter: 24, front: "Electric flux formula for flat surface?", back: "Phi = E*A*cos(theta)." },
  { chapter: 24, front: "Gauss's Law?", back: "Phi = q_enclosed/epsilon_0." },
  { chapter: 24, front: "Gauss's Law cares about what charge?", back: "Only enclosed charge." },
  { chapter: 24, front: "Outside charges change net flux?", back: "No." },
  { chapter: 24, front: "Maximum flux happens when field is?", back: "Perpendicular to surface." },
  { chapter: 24, front: "Zero flux happens when field is?", back: "Parallel to surface." },
  { chapter: 24, front: "Ring field on z-axis points where?", back: "Along the z-axis." },
  { chapter: 24, front: "Finite wire above midpoint: which components cancel?", back: "x-components cancel." },
  { chapter: 24, front: "Parallel plate charge from field?", back: "Q = epsilon_0*A*E." },
  { chapter: 24, front: "Best first move in symmetry problems?", back: "Cancel components before choosing formula." },

  // Ch. 25
  { chapter: 25, front: "Voltage means?", back: "Electric potential energy per charge." },
  { chapter: 25, front: "Potential formula?", back: "V = U/q." },
  { chapter: 25, front: "Potential energy from voltage?", back: "U = q*V." },
  { chapter: 25, front: "Electric potential is scalar or vector?", back: "Scalar." },
  { chapter: 25, front: "Electric field is scalar or vector?", back: "Vector." },

  // Ch. 26
  { chapter: 26, front: "Capacitance formula?", back: "C = Q/DeltaV." },
  { chapter: 26, front: "Charge on capacitor?", back: "Q = C*DeltaV." },
  { chapter: 26, front: "Parallel plate capacitance?", back: "C = epsilon_0*A/d." },
  { chapter: 26, front: "Circular plate area?", back: "A = pi*r^2." },
  { chapter: 26, front: "For circular plates, diameter must become?", back: "Radius." },
  { chapter: 26, front: "Dielectric usually does what to capacitance?", back: "Increases capacitance." },

  // Ch. 27
  { chapter: 27, front: "Current definition?", back: "I = DeltaQ/DeltaT." },
  { chapter: 27, front: "Ohm's Law?", back: "V = I*R." },
  { chapter: 27, front: "Power formula using current and voltage?", back: "P = I*V." },
  { chapter: 27, front: "Power formula using current and resistance?", back: "P = I^2*R." },
  { chapter: 27, front: "Voltage does what?", back: "Pushes current." },
  { chapter: 27, front: "Resistance does what?", back: "Fights current." },
  { chapter: 27, front: "High resistivity is like?", back: "A clogged hose." },

  // Ch. 28
  { chapter: 28, front: "Series resistors combine how?", back: "Add directly." },
  { chapter: 28, front: "Parallel resistors combine how?", back: "Add reciprocals." },
  { chapter: 28, front: "Same current happens in?", back: "Series." },
  { chapter: 28, front: "Same voltage happens in?", back: "Parallel." },
  { chapter: 28, front: "Parallel equivalent resistance is compared to smallest branch?", back: "Smaller than the smallest branch resistor." },
  { chapter: 28, front: "Kirchhoff junction rule?", back: "Current in = current out." },
  { chapter: 28, front: "Kirchhoff loop rule?", back: "Voltage changes around a loop sum to zero." },

  // Ch. 29
  { chapter: 29, front: "Magnetic force formula?", back: "F = q*v*B*sin(theta)." },
  { chapter: 29, front: "Magnetic force requires what?", back: "Moving charge." },
  { chapter: 29, front: "Stationary charge in magnetic field feels?", back: "No magnetic force." },
  { chapter: 29, front: "Magnetic force max angle?", back: "90 degrees." },
  { chapter: 29, front: "Magnetic force zero angle?", back: "0 degrees or 180 degrees." },
  { chapter: 29, front: "Negative charge and right-hand rule?", back: "Reverse the direction." },
  { chapter: 29, front: "Magnetic force does work?", back: "No, because it is perpendicular to motion." },

  // Ch. 30
  { chapter: 30, front: "Magnetic flux formula?", back: "Phi_B = B*A*cos(theta)." },
  { chapter: 30, front: "Faraday's Law?", back: "epsilon = -N*DeltaPhi_B/DeltaT." },
  { chapter: 30, front: "Lenz's Law says induced effect does what?", back: "Opposes the change." },
  { chapter: 30, front: "No changing flux means?", back: "No induced emf." },
  { chapter: 30, front: "Flux can change if what changes?", back: "B, area, angle, or time." },

  // Ch. 31
  { chapter: 31, front: "Light equation?", back: "c = f*lambda." },
  { chapter: 31, front: "Speed of light in vacuum?", back: "3.00 x 10^8 m/s." },
  { chapter: 31, front: "Frequency from wavelength?", back: "f = c/lambda." },
  { chapter: 31, front: "Index of refraction using wavelength?", back: "n = lambda_vacuum/lambda_material." },
  { chapter: 31, front: "Frequency during refraction does what?", back: "Stays constant." },
  { chapter: 31, front: "Blue light vs red light frequency?", back: "Blue has higher frequency." },
  { chapter: 31, front: "Nanometers must be converted to?", back: "Meters." },

  // Ch. 32 and 33
  { chapter: 32, front: "First move in mixed review?", back: "Circle clue words." },
  { chapter: 32, front: "Units help identify what?", back: "The formula/model." },
  { chapter: 32, front: "Before plugging numbers, pick the?", back: "Model." },
  { chapter: 33, front: "Final Boss method?", back: "Givens -> Unknown -> Model -> Formula -> Units -> Check." },
  { chapter: 33, front: "What comes before formula?", back: "Givens, unknown, and model." },
  { chapter: 33, front: "If stuck, what should you write first?", back: "GIVEN and UNKNOWN." },
];


const CH24_GAUSS_EXTRA_FLASHCARDS = [
  { chapter: 24, front: "Flux means what?", back: "How much electric field passes through a surface." },
  { chapter: 24, front: "Flux formula with angle?", back: "Phi = E*A*cos(theta)." },
  { chapter: 24, front: "Theta in flux formula is measured from what?", back: "The normal vector." },
  { chapter: 24, front: "Normal vector means?", back: "Arrow straight out of the surface." },
  { chapter: 24, front: "Field exiting closed surface gives what flux sign?", back: "Positive." },
  { chapter: 24, front: "Field entering closed surface gives what flux sign?", back: "Negative." },
  { chapter: 24, front: "Same amount in and out gives what net flux?", back: "Zero." },
  { chapter: 24, front: "Gauss's Law formula?", back: "Phi = Q_inside / epsilon_0." },
  { chapter: 24, front: "Positive net flux means what charge inside?", back: "Positive net charge." },
  { chapter: 24, front: "Negative net flux means what charge inside?", back: "Negative net charge." },
  { chapter: 24, front: "Zero net flux means what inside?", back: "Zero net enclosed charge." },
  { chapter: 24, front: "xy-plane surface uses which E component?", back: "E_z." },
  { chapter: 24, front: "xz-plane surface uses which E component?", back: "E_y." },
  { chapter: 24, front: "yz-plane surface uses which E component?", back: "E_x." },
  { chapter: 24, front: "E inside conductor at electrostatic equilibrium?", back: "Zero." },
  { chapter: 24, front: "Field just outside conductor surface?", back: "E = sigma / epsilon_0." },
  { chapter: 24, front: "One infinite charged sheet field?", back: "E = |sigma| / (2*epsilon_0)." },
  { chapter: 24, front: "Point charge Gaussian surface?", back: "Sphere." },
  { chapter: 24, front: "Infinite rod Gaussian surface?", back: "Cylinder." },
  { chapter: 24, front: "Infinite sheet Gaussian surface?", back: "Pillbox." },
  { chapter: 24, front: "Conductor surface Gaussian surface?", back: "Tiny pillbox." },
  { chapter: 24, front: "Charged solid sphere outside acts like what?", back: "A point charge." },
  { chapter: 24, front: "Uniform solid sphere field is maximum where?", back: "At the surface." },
];

if (typeof BASE_MEMORY_CARDS !== "undefined") {
  CH24_GAUSS_EXTRA_FLASHCARDS.forEach((card) => {
    if (!BASE_MEMORY_CARDS.some((existing) => existing.chapter === card.chapter && existing.front === card.front)) {
      BASE_MEMORY_CARDS.push(card);
    }
  });
}


const WORK_ENERGY_ELECTRIC_FLASHCARDS = [
  { chapter: 25, front: "Work formula?", back: "W = F*d*cos(theta)." },
  { chapter: 25, front: "When is work positive?", back: "When force helps the motion." },
  { chapter: 25, front: "When is work negative?", back: "When force opposes the motion." },
  { chapter: 25, front: "When is work zero?", back: "When force and displacement are perpendicular." },
  { chapter: 25, front: "Kinetic energy formula?", back: "KE = 1/2*m*v^2." },
  { chapter: 25, front: "Gravitational potential energy?", back: "PE_g = m*g*y." },
  { chapter: 25, front: "Spring potential energy?", back: "PE_s = 1/2*k*x^2." },
  { chapter: 25, front: "Work-energy theorem?", back: "W_total = Delta KE." },
  { chapter: 25, front: "Conservative force work equals?", back: "W = -Delta PE." },
  { chapter: 25, front: "Electric force in a field?", back: "F = qE." },
  { chapter: 25, front: "Electric work in uniform field?", back: "W = q*E*d when aligned." },
  { chapter: 25, front: "Electric potential energy from voltage?", back: "U = qV." },
  { chapter: 25, front: "Potential energy between two charges?", back: "U = k*q1*q2/r." },
  { chapter: 25, front: "Work to assemble charges?", back: "Add k*q_i*q_j/r_ij for every pair once." },
  { chapter: 25, front: "Potential belongs to what?", back: "The location." },
  { chapter: 25, front: "Potential energy belongs to what?", back: "The charge at that location." },
];

if (typeof BASE_MEMORY_CARDS !== "undefined") {
  WORK_ENERGY_ELECTRIC_FLASHCARDS.forEach((card) => {
    if (!BASE_MEMORY_CARDS.some((existing) => existing.chapter === card.chapter && existing.front === card.front)) {
      BASE_MEMORY_CARDS.push(card);
    }
  });
}

const LESSON_MEMORY_CARDS = Object.entries(LESSONS).flatMap(([chapter, lessons]) =>
  lessons.map((lesson) => ({
    chapter: Number(chapter),
    front: lesson.check,
    back: lesson.checkAnswer,
  }))
);


const CH24_GAUSS_EXTRA_LESSONS = [
  {
    name: "Electric Flux Meaning",
    explain:
      "Electric flux measures how much electric field passes through a surface. Think of field lines going through a window.",
    formula: "Phi = E*A*cos(theta)",
    clues: "flux, electric field through surface, area, angle, normal vector",
    example:
      "If the field goes straight through the surface, flux is maximum. If the field runs along the surface, flux is zero.",
    trap:
      "Theta is the angle between the electric field and the normal vector, not always the surface itself.",
    memory:
      "Flux asks: how much field goes through the surface?",
    check:
      "Flux uses the angle between the field and what vector?",
    checkAnswer: "The normal vector.",
  },
  {
    name: "Normal Vector",
    explain:
      "The normal vector is an imaginary arrow sticking straight out of the surface. Flux only cares about the field component in that normal direction.",
    formula: "Phi = A*(E dot n_hat)",
    clues: "normal vector, surface direction, dot product, component",
    example:
      "A surface in the xy-plane has a normal in the z-direction, so only E_z matters.",
    trap:
      "Do not use the component of E that lies inside the surface.",
    memory:
      "Normal means straight out of the surface.",
    check:
      "For a surface in the xy-plane, which field component matters?",
      checkAnswer: "E_z.",
  },
  {
    name: "Flux Sign Rules",
    explain:
      "For a closed surface, field lines leaving the surface create positive flux. Field lines entering create negative flux.",
    formula: "out = positive flux; in = negative flux",
    clues: "positive flux, negative flux, field points in, field points out, closed surface",
    example:
      "If more field exits than enters, net flux is positive. If the same amount enters and exits, net flux is zero.",
    trap:
      "Zero net flux does not always mean zero field everywhere.",
    memory:
      "Exiting is positive. Entering is negative.",
    check:
      "Field lines entering a closed surface give what sign of flux?",
      checkAnswer: "Negative flux.",
  },
  {
    name: "Gauss's Law",
    explain:
      "Gauss's Law says total electric flux through a closed surface depends only on the net charge inside that surface.",
    formula: "Phi = Q_inside / epsilon_0",
    clues: "Gauss, closed surface, enclosed charge, inside charge, net flux",
    example:
      "Charges outside the Gaussian surface can change the local electric field, but they do not change the net flux.",
    trap:
      "Do not include charges outside the closed surface when finding net flux.",
    memory:
      "Gauss asks: how much charge is inside the closed surface?",
    check:
      "Do outside charges affect net flux through a closed surface?",
      checkAnswer: "No.",
  },
  {
    name: "Net Flux Sign and Charge Inside",
    explain:
      "The sign of net flux tells you the sign of the net enclosed charge.",
    formula: "positive flux -> positive Q_inside; negative flux -> negative Q_inside; zero flux -> zero net Q_inside",
    clues: "net flux sign, positive flux, negative flux, zero flux, enclosed charge",
    example:
      "If the net flux is negative, the closed surface contains net negative charge.",
    trap:
      "Zero net flux means zero net enclosed charge, not necessarily zero charges total.",
    memory:
      "Flux sign reveals inside charge sign.",
      check: "Positive net flux means what kind of net charge inside?",
      checkAnswer: "Positive charge.",
  },
  {
    name: "Flat Surface Component Method",
    explain:
      "For a flat surface, only the component of electric field perpendicular to the surface matters.",
    formula: "Phi = A*(E dot n_hat)",
    clues: "xy-plane, xz-plane, yz-plane, component, E_x, E_y, E_z",
    example:
      "xy-plane -> normal is z-direction -> use E_z. xz-plane -> normal is y-direction -> use E_y. yz-plane -> normal is x-direction -> use E_x.",
    trap:
      "Do not use all components. Use only the component in the normal direction.",
    memory:
      "Surface plane tells you the missing axis. That missing axis is the normal.",
    check:
      "For a surface in the yz-plane, which field component matters?",
    checkAnswer: "E_x.",
  },
  {
    name: "Conductors in Electrostatic Equilibrium",
    explain:
      "Inside a conductor at electrostatic equilibrium, the electric field is zero. Extra charge sits on the surface.",
    formula: "E_inside_conductor = 0",
    clues: "conductor, electrostatic equilibrium, inside conductor, electric field inside",
    example:
      "If a Gaussian surface is fully inside the conducting material, the field there is zero.",
    trap:
      "This rule is for conductors in electrostatic equilibrium, not every material.",
    memory:
      "Inside a calm conductor, E is zero.",
    check:
      "What is E inside a conductor in electrostatic equilibrium?",
      checkAnswer: "Zero.",
  },
  {
    name: "Field Just Outside a Conductor",
    explain:
      "Just outside the surface of a conductor, the electric field depends on surface charge density.",
    formula: "E = sigma / epsilon_0",
    clues: "surface charge density, sigma, just outside conductor, conductor surface",
    example:
      "If you know E just outside the conductor, you can find sigma using sigma = epsilon_0*E.",
    trap:
      "Do not use the infinite sheet formula here. A conductor surface gives E = sigma/epsilon_0.",
    memory:
      "Conductor surface field is sigma over epsilon_0.",
    check:
      "What is sigma if E is known outside a conductor?",
      checkAnswer: "sigma = epsilon_0*E.",
  },
  {
    name: "Conductors with Cavities",
    explain:
      "If a charge is placed inside a hollow cavity in a conductor, the inner wall gets the opposite charge. The remaining charge goes to the outside surface.",
    formula: "Q_inner_wall = -Q_cavity",
    clues: "conductor with cavity, hollow conductor, charge inside cavity, inner wall, outer surface",
    example:
      "If the cavity contains +105 nC, then the inner wall has -105 nC.",
    trap:
      "Do not put all the charge on the outside surface if there is a charge inside the cavity.",
    memory:
      "Cavity wall cancels the charge inside.",
    check:
      "If the cavity contains +105 nC, what is on the inner wall?",
      checkAnswer: "-105 nC.",
  },
  {
    name: "Infinite Sheet of Charge",
    explain:
      "One infinite charged sheet creates a constant electric field on each side.",
    formula: "E_sheet = |sigma| / (2*epsilon_0)",
    clues: "infinite sheet, sheet of charge, sigma, surface charge density",
    example:
      "A positive sheet has field pointing away from the sheet. A negative sheet has field pointing toward the sheet.",
    trap:
      "One infinite sheet has 2*epsilon_0 in the denominator. A conductor surface uses epsilon_0 only.",
    memory:
      "Positive sheet pushes field away. Negative sheet pulls field in.",
    check:
      "A positive infinite sheet has field pointing toward or away?",
      checkAnswer: "Away from the sheet.",
  },
  {
    name: "Choosing a Gaussian Surface",
    explain:
      "Pick a Gaussian surface that matches the symmetry of the charge distribution.",
    formula: "point charge -> sphere; infinite rod -> cylinder; infinite sheet -> pillbox",
    clues: "choose Gaussian surface, symmetry, point charge, rod, cylinder, sheet, pillbox",
    example:
      "Use a sphere for a point charge or charged sphere. Use a cylinder for a long rod. Use a pillbox for an infinite sheet or conductor surface.",
    trap:
      "A bad Gaussian surface makes the math ugly or impossible.",
    memory:
      "Match the bubble to the shape.",
    check:
      "What Gaussian surface should you use for an infinite sheet?",
      checkAnswer: "A pillbox.",
  },
  {
    name: "Uniformly Charged Solid Sphere",
    explain:
      "For a uniformly charged solid sphere, the field starts at zero in the center, increases inside, and outside acts like a point charge.",
    formula: "inside: E = rho*r/(3*epsilon_0); outside: E = rho*r_b^3/(3*epsilon_0*r^2)",
    clues: "solid sphere, uniformly charged ball, inside sphere, outside sphere, charge density rho",
    example:
      "The maximum field happens at the surface of the charged sphere.",
    trap:
      "Inside the sphere, use the charge enclosed inside radius r, not the full charge of the ball.",
    memory:
      "Sphere: grows inside, falls outside.",
    check:
      "Where is the electric field maximum for a uniformly charged solid sphere?",
      checkAnswer: "At the surface.",
  },
  {
    name: "Uniformly Charged Cylinder or Rod",
    explain:
      "For an infinite uniformly charged cylinder, use a cylindrical Gaussian surface. Inside the cylinder, field increases with r.",
    formula: "inside: E = rho*r/(2*epsilon_0)",
    clues: "charged cylinder, infinite rod, radius r0, charge density rho, line charge density lambda",
    example:
      "For a long charged cylinder, symmetry says the field points radially outward or inward.",
    trap:
      "Use cylindrical symmetry, not spherical symmetry.",
    memory:
      "Rod or cylinder means cylinder Gaussian surface.",
    check:
      "What Gaussian surface matches an infinite rod?",
      checkAnswer: "A cylinder.",
  },
];


if (typeof LESSONS !== "undefined") {
  if (!LESSONS[24]) {
    LESSONS[24] = [];
  }

  CH24_GAUSS_EXTRA_LESSONS.forEach((lesson) => {
    if (!LESSONS[24].some((existing) => existing.name === lesson.name)) {
      LESSONS[24].push(lesson);
    }
  });
}

const MEMORY_CARDS = uniqueByKey(
  [...BASE_MEMORY_CARDS, ...LESSON_MEMORY_CARDS],
  (card) => `${card.chapter}-${card.front.trim().toLowerCase()}-${card.back.trim().toLowerCase()}`
);

const RAW_BOSS_QUESTIONS = [
  // Module 1
  {
    module: 1,
    chapter: 22,
    q: "2.0 x 10^10 electrons are added. What is Q?",
    choices: ["-3.2 x 10^-9 C", "+3.2 x 10^-9 C", "-3.2 x 10^9 C", "0 C"],
    a: "-3.2 x 10^-9 C",
    teach: "Q = N(-e). Added electrons make the charge negative.",
  },
  {
    module: 1,
    chapter: 22,
    q: "Two positive charges are near each other. What happens?",
    choices: ["They repel", "They attract", "They become neutral", "Nothing"],
    a: "They repel",
    teach: "Like charges repel.",
  },
  {
    module: 1,
    chapter: 22,
    q: "If distance between two charges doubles, force becomes:",
    choices: ["1/4 as large", "1/2 as large", "2 times larger", "4 times larger"],
    a: "1/4 as large",
    teach: "Coulomb force follows 1/r^2.",
  },
  {
    module: 1,
    chapter: 22,
    q: "For Coulomb force direction, what should you do first?",
    choices: ["Draw arrows", "Plug numbers", "Ignore signs", "Add masses"],
    a: "Draw arrows",
    teach: "Direction mistakes usually come from skipping the diagram.",
  },
  {
    module: 1,
    chapter: 23,
    q: "Electric field from a positive charge points:",
    choices: ["Away", "Toward", "In circles", "Nowhere"],
    a: "Away",
    teach: "Field direction is where a positive test charge would go.",
  },
  {
    module: 1,
    chapter: 23,
    q: "Electric field from a negative charge points:",
    choices: ["Toward", "Away", "Only up", "Only left"],
    a: "Toward",
    teach: "A positive test charge is attracted toward a negative source.",
  },
  {
    module: 1,
    chapter: 23,
    q: "A neutral conductor can be attracted to a charged object because of:",
    choices: ["Polarization", "Gravity only", "Magnetism only", "Friction only"],
    a: "Polarization",
    teach: "Charges redistribute inside the conductor.",
  },
  {
    module: 1,
    chapter: 24,
    q: "Gauss's Law net flux depends on:",
    choices: ["Enclosed charge", "Only outside charge", "Mass", "Speed"],
    a: "Enclosed charge",
    teach: "Phi = q_enclosed/epsilon_0.",
  },
  {
    module: 1,
    chapter: 24,
    q: "A charge outside a closed surface changes net flux?",
    choices: ["No", "Yes always", "Only if positive", "Only if negative"],
    a: "No",
    teach: "Outside charges can affect local field but not net flux.",
  },
  {
    module: 1,
    chapter: 16,
    q: "String wave speed uses:",
    choices: ["v = sqrt(T/mu)", "V = I*R", "E = kq/r^2", "Phi = EAcos(theta)"],
    a: "v = sqrt(T/mu)",
    teach: "String wave speed depends on tension and linear density.",
  },
  {
    module: 1,
    chapter: 16,
    q: "Doppler source moving toward observer means observed frequency:",
    choices: ["Increases", "Decreases", "Becomes zero", "Does not exist"],
    a: "Increases",
    teach: "Moving together compresses wavefronts.",
  },

  // Module 2
  {
    module: 2,
    chapter: 25,
    q: "Voltage means:",
    choices: ["Energy per charge", "Charge per second", "Force per meter", "Magnetic field"],
    a: "Energy per charge",
    teach: "V = U/q.",
  },
  {
    module: 2,
    chapter: 25,
    q: "Electric potential is:",
    choices: ["Scalar", "Vector", "Always zero", "A force"],
    a: "Scalar",
    teach: "Voltage has no direction.",
  },
  {
    module: 2,
    chapter: 26,
    q: "Capacitance formula:",
    choices: ["C = Q/DeltaV", "V = IR", "F = qvB", "c = f lambda"],
    a: "C = Q/DeltaV",
    teach: "Capacitance is charge stored per volt.",
  },
  {
    module: 2,
    chapter: 26,
    q: "Circular plate area uses:",
    choices: ["A = pi*r^2", "A = pi*d^2", "A = 2*pi*r", "A = r/d"],
    a: "A = pi*r^2",
    teach: "Convert diameter to radius first.",
  },
  {
    module: 2,
    chapter: 27,
    q: "Ohm's Law is:",
    choices: ["V = I*R", "F = ma", "Q = Ne", "Phi = q/epsilon"],
    a: "V = I*R",
    teach: "Voltage pushes current through resistance.",
  },
  {
    module: 2,
    chapter: 27,
    q: "Power using voltage and current:",
    choices: ["P = I*V", "P = I/V", "P = V/R only", "P = q/r"],
    a: "P = I*V",
    teach: "Circuit power can be P = IV.",
  },
  {
    module: 2,
    chapter: 28,
    q: "Series resistors combine by:",
    choices: ["Adding directly", "Adding reciprocals", "Multiplying only", "Canceling"],
    a: "Adding directly",
    teach: "Series equivalent resistance is R1 + R2 + ...",
  },
  {
    module: 2,
    chapter: 28,
    q: "Parallel branches have the same:",
    choices: ["Voltage", "Current", "Resistance", "Power always"],
    a: "Voltage",
    teach: "Parallel means same voltage across branches.",
  },

  // Module 3
  {
    module: 3,
    chapter: 29,
    q: "Magnetic force requires:",
    choices: ["Moving charge", "Stationary charge", "No field", "No velocity"],
    a: "Moving charge",
    teach: "F = qvBsin(theta).",
  },
  {
    module: 3,
    chapter: 29,
    q: "If v is parallel to B, magnetic force is:",
    choices: ["Zero", "Maximum", "Infinite", "Equal to qE"],
    a: "Zero",
    teach: "sin(0) = 0.",
  },
  {
    module: 3,
    chapter: 30,
    q: "Faraday's Law is about:",
    choices: ["Changing magnetic flux", "Static charge", "Sound intensity", "Friction"],
    a: "Changing magnetic flux",
    teach: "Changing flux induces emf.",
  },
  {
    module: 3,
    chapter: 30,
    q: "Lenz's Law says induced current:",
    choices: ["Opposes the change", "Helps the change", "Is always zero", "Ignores flux"],
    a: "Opposes the change",
    teach: "The minus sign in Faraday's Law is Lenz's Law.",
  },
  {
    module: 3,
    chapter: 31,
    q: "Light equation:",
    choices: ["c = f*lambda", "V = IR", "F = ma", "C = Q/V"],
    a: "c = f*lambda",
    teach: "Light speed equals frequency times wavelength.",
  },
  {
    module: 3,
    chapter: 31,
    q: "When light enters a material, frequency:",
    choices: ["Stays constant", "Always doubles", "Becomes zero", "Turns into voltage"],
    a: "Stays constant",
    teach: "Speed and wavelength change; frequency stays.",
  },

  // Module 4
  {
    module: 4,
    chapter: 32,
    q: "Best first move in a mixed problem:",
    choices: ["Circle clue words", "Guess", "Ignore units", "Start typing numbers"],
    a: "Circle clue words",
    teach: "Clue words identify the model.",
  },
  {
    module: 4,
    chapter: 32,
    q: "Units like N/C or V/m usually point to:",
    choices: ["Electric field", "Magnetic flux", "Resistance", "Sound only"],
    a: "Electric field",
    teach: "Units are formula clues.",
  },
  {
    module: 4,
    chapter: 33,
    q: "Final Boss method starts with:",
    choices: ["Givens and unknown", "Guessing", "Skipping units", "Panic"],
    a: "Givens and unknown",
    teach: "Setup gets points and prevents formula chaos.",
  },
  {
    module: 4,
    chapter: 33,
    q: "Formula sheet works best when it includes:",
    choices: ["Clue words and traps", "Only equations", "Only constants", "Nothing"],
    a: "Clue words and traps",
    teach: "The hard part is choosing the right formula.",
  },
];


if (typeof STUDY_GUIDES !== "undefined" && STUDY_GUIDES[24]) {
  STUDY_GUIDES[24] = {
    ...STUDY_GUIDES[24],
    title: "Ch. 24 Study Guide — Electric Flux and Gauss's Law",
    bigIdea:
      "Flux asks how much electric field goes through a surface. Gauss's Law asks how much net charge is inside a closed surface.",
    mustKnow: [
      "Electric flux measures how much electric field passes through a surface.",
      "Phi = E*A*cos(theta).",
      "Theta is the angle between E and the normal vector.",
      "The normal vector sticks straight out of the surface.",
      "For closed surfaces: field out is positive flux.",
      "For closed surfaces: field in is negative flux.",
      "Same amount in and out gives zero net flux.",
      "Gauss's Law: Phi = Q_inside / epsilon_0.",
      "Net flux depends only on charge inside the closed surface.",
      "Charges outside the surface do not affect net flux.",
      "Positive net flux means positive net charge inside.",
      "Negative net flux means negative net charge inside.",
      "Zero net flux means zero net enclosed charge.",
      "Inside a conductor in electrostatic equilibrium, E = 0.",
      "Just outside a conductor, E = sigma / epsilon_0.",
      "For one infinite sheet, E = |sigma|/(2*epsilon_0).",
      "Pick Gaussian surfaces by symmetry."
    ],
    formulas: [
      "Phi = E*A*cos(theta)",
      "Phi = E dot A",
      "Phi = A*(E dot n_hat)",
      "Phi = Q_inside / epsilon_0",
      "E_inside_conductor = 0",
      "E_conductor_surface = sigma / epsilon_0",
      "sigma = epsilon_0*E",
      "E_sheet = |sigma| / (2*epsilon_0)",
      "E_inside_sphere = rho*r / (3*epsilon_0)",
      "E_outside_sphere = rho*r_b^3 / (3*epsilon_0*r^2)",
      "E_inside_cylinder = rho*r / (2*epsilon_0)"
    ],
    clueWords: [
      "flux, area, angle -> Phi = E*A*cos(theta)",
      "normal vector -> use component of E straight out of surface",
      "closed surface, inside charge -> Gauss's Law",
      "field points out -> positive flux",
      "field points in -> negative flux",
      "xy-plane -> use E_z",
      "xz-plane -> use E_y",
      "yz-plane -> use E_x",
      "conductor equilibrium -> E inside conductor is zero",
      "cavity charge -> inner wall gets opposite charge",
      "infinite sheet -> pillbox and E = |sigma|/(2*epsilon_0)",
      "point charge or sphere -> spherical Gaussian surface",
      "infinite rod or cylinder -> cylindrical Gaussian surface",
      "conductor surface -> tiny pillbox"
    ],
    traps: [
      "Do not use the angle with the surface if the formula needs the angle with the normal.",
      "Do not include charges outside a closed Gaussian surface.",
      "Do not forget: 1 cm = 0.01 m.",
      "Do not forget: 1 nC = 10^-9 C.",
      "Entering flux is negative; exiting flux is positive.",
      "Zero net flux does not always mean zero electric field everywhere.",
      "Inside a conductor is E = 0 only in electrostatic equilibrium.",
      "For one infinite sheet use 2*epsilon_0; for conductor surface use epsilon_0.",
      "For a sphere inside field, only enclosed charge inside radius r counts."
    ],
    examMoves: [
      "Ask: is this a flat surface or closed surface?",
      "If flat, find the normal direction.",
      "If flat, use only the field component along the normal.",
      "If closed, identify Q_inside.",
      "Ignore outside charges for net flux.",
      "Use flux sign to infer charge sign.",
      "Pick the Gaussian surface from symmetry.",
      "Sphere for point charge or charged sphere.",
      "Cylinder for infinite rod/cylinder.",
      "Pillbox for infinite sheet or conductor surface.",
      "Check units before plugging in."
    ],
  };
}


const CH24_GAUSS_EXTRA_BOSS = [
  {
    module: 1,
    chapter: 24,
    q: "Flux formula uses theta between E and what?",
    choices: ["Normal vector", "Surface itself", "Charge direction", "Velocity"],
    a: "Normal vector",
    teach: "Flux uses the angle between electric field and the normal vector.",
  },
  {
    module: 1,
    chapter: 24,
    q: "Field lines entering a closed surface give:",
    choices: ["Negative flux", "Positive flux", "No charge ever", "Resistance"],
    a: "Negative flux",
    teach: "Entering flux is negative; exiting flux is positive.",
  },
  {
    module: 1,
    chapter: 24,
    q: "A surface in the xy-plane uses which E component for flux?",
    choices: ["E_z", "E_x", "E_y", "All components equally"],
    a: "E_z",
    teach: "The normal to the xy-plane is the z-direction.",
  },
  {
    module: 1,
    chapter: 24,
    q: "Inside a conductor in electrostatic equilibrium, E equals:",
    choices: ["0", "sigma/epsilon_0", "kq/r^2", "infinity"],
    a: "0",
    teach: "Charges rearrange until the field inside the conductor is zero.",
  },
  {
    module: 1,
    chapter: 24,
    q: "One infinite sheet of charge has field:",
    choices: ["|sigma|/(2*epsilon_0)", "sigma/epsilon_0", "Q_inside/epsilon_0", "0 always"],
    a: "|sigma|/(2*epsilon_0)",
    teach: "One infinite sheet uses E = |sigma|/(2*epsilon_0).",
  },
  {
    module: 1,
    chapter: 24,
    q: "Best Gaussian surface for an infinite rod?",
    choices: ["Cylinder", "Sphere", "Cube", "Triangle"],
    a: "Cylinder",
    teach: "Match the Gaussian surface to the symmetry.",
  },
];

if (typeof RAW_BOSS_QUESTIONS !== "undefined") {
  CH24_GAUSS_EXTRA_BOSS.forEach((question) => {
    if (!RAW_BOSS_QUESTIONS.some((existing) => existing.q === question.q)) {
      RAW_BOSS_QUESTIONS.push(question);
    }
  });
}

const BOSS_QUESTIONS = uniqueByKey(
  RAW_BOSS_QUESTIONS,
  (q) => `${q.module}-${q.chapter}-${q.q.trim().toLowerCase()}`
);

function solveHomework(text, testMode = false) {
  const raw = text || "";

  function cleanText(t) {
    return String(t)
      // Pearson/Mastering text cleanup
      .replace(/Upper\s+Delta\s+Upper\s+V/gi, "Delta V")
      .replace(/Upper\s+U\s+Subscript\s+Upper\s+E/gi, "U_E")
      .replace(/Upper\s+W/gi, "W")
      .replace(/Upper\s+L/gi, "L")
      .replace(/Upper\s+N/gi, "N")
      .replace(/Upper\s+C/gi, "C")
      .replace(/Upper\s+V/gi, "V")
      .replace(/Upper\s+E/gi, "E")
      .replace(/Baseline/gi, "")
      .replace(/StartFraction/gi, "(")
      .replace(/EndFraction/gi, ")")
      .replace(/Over/gi, "/")
      .replace(/left parenthesis/gi, "(")
      .replace(/right parenthesis/gi, ")")
      .replace(/left bracket/gi, "[")
      .replace(/right bracket/gi, "]")

      // Superscripts and signs
      .replace(/Superscript\s+negative\s+/gi, "e-")
      .replace(/Superscript\s+minus\s+/gi, "e-")
      .replace(/Superscript\s+positive\s+/gi, "e+")
      .replace(/Superscript\s+plus\s+/gi, "+")
      .replace(/Superscript\s*\+\s*/gi, "+")
      .replace(/Superscript\s*-\s*/gi, "e-")
      .replace(/Superscript\s*/gi, "e")

      // Words to symbols
      .replace(/negative\s+(\d*\.?\d+)/gi, "-$1")
      .replace(/positive\s+(\d*\.?\d+)/gi, "+$1")
      .replace(/charge\s+negative\s+2\s*e/gi, "charge -2e")
      .replace(/charge\s+plus\s+e/gi, "charge +e")
      .replace(/charge\s+positive\s+e/gi, "charge +e")
      .replace(/He\s*\+\s*ion/gi, "He+ ion")
      .replace(/He\s+plus\s+ion/gi, "He+ ion")
      .replace(/cmtimes/gi, " cm times ")
      .replace(/mmplus/gi, " mm plus ")
      .replace(/cmplus/gi, " cm plus ")
      .replace(/plus or minus/gi, "+/-")
      .replace(/plus\/minus/gi, "+/-")
      .replace(/plusminus/gi, "+/-")
      .replace(/plus/gi, "+")
      .replace(/minus/gi, "-")
      .replace(/times/gi, "*")
      .replace(/divided by/gi, "/")
      .replace(/squared/gi, "^2")
      .replace(/cubed/gi, "^3")
      .replace(/micro/gi, "u")
      .replace(/μ/gi, "u")
      .replace(/ϵ|ε/gi, "epsilon")
      .replace(/Φ/gi, "phi")
      .replace(/Delta/gi, "Delta")

      // Unit cleanup
      .replace(/m\s*\/\s*s/gi, "m/s")
      .replace(/n\s*\/\s*c/gi, "N/C")
      .replace(/n\s*m\^?2\s*\/\s*c/gi, "N*m^2/C")
      .replace(/\s+/g, " ")
      .trim();
  }

  const cleaned = cleanText(raw);
  const lower = cleaned.toLowerCase();

  const constants = {
    k: 8.99e9,
    e: 1.602e-19,
    eps0: 8.854e-12,
    c: 3.00e8,
    mp: 1.673e-27,
    me: 9.109e-31,
  };

  function has(words) {
    return words.some((w) => lower.includes(w.toLowerCase()));
  }

  function fmt(x, sig = 3) {
    if (!Number.isFinite(x)) return "not enough information";
    const ax = Math.abs(x);
    if (ax !== 0 && (ax >= 10000 || ax < 0.01)) return x.toExponential(sig);
    return Number(x.toPrecision(sig + 1)).toString();
  }

  function allNums() {
    const out = [];

    // Handles: 4.90 * 10 e4, 4.90*10e4, 4.90 x 10^4-ish pasted formats
    const sciPatterns = [
      /([-+]?\d*\.?\d+)\s*\*\s*10\s*e?\s*([-+]?\d+)/gi,
      /([-+]?\d*\.?\d+)\s*x\s*10\s*e?\s*([-+]?\d+)/gi,
      /([-+]?\d*\.?\d+)\s*[×]\s*10\s*e?\s*([-+]?\d+)/gi,
      /([-+]?\d*\.?\d+)\s*e\s*([-+]?\d+)/gi,
    ];

    sciPatterns.forEach((re) => {
      let m;
      while ((m = re.exec(cleaned)) !== null) {
        out.push(Number(m[1]) * Math.pow(10, Number(m[2])));
      }
    });

    const plain = cleaned.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
    plain.forEach((n) => {
      const val = Number(n);
      if (Number.isFinite(val)) out.push(val);
    });

    return [...new Set(out.filter((x) => Number.isFinite(x)))];
  }

  const numbers = allNums();

  function numbersBeforeUnit(unitRegex) {
    const re = new RegExp("([-+]?\\d*\\.?\\d+(?:\\s*(?:\\*|x|×)\\s*10\\s*e?\\s*[-+]?\\d+|e[-+]?\\d+)?)\\s*" + unitRegex, "gi");
    const vals = [];
    let m;

    while ((m = re.exec(cleaned)) !== null) {
      const part = m[1]
        .replace(/\s+/g, "")
        .replace(/x/gi, "*")
        .replace(/×/g, "*");

      const sci = part.match(/^([-+]?\\d*\\.?\\d+)\\*10e?([-+]?\\d+)$/i);
      if (sci) {
        vals.push(Number(sci[1]) * Math.pow(10, Number(sci[2])));
      } else {
        const val = Number(part);
        if (Number.isFinite(val)) vals.push(val);
      }
    }

    return vals;
  }

  function numberBeforeUnit(unitRegex) {
    const re = new RegExp("([-+]?\\d*\\.?\\d+(?:\\s*(?:\\*|x|×)\\s*10\\s*e?\\s*[-+]?\\d+|e[-+]?\\d+)?)\\s*" + unitRegex, "i");
    const m = cleaned.match(re);
    if (!m) return null;

    const part = m[1]
      .replace(/\s+/g, "")
      .replace(/x/gi, "*")
      .replace(/×/g, "*");

    const sci = part.match(/^([-+]?\d*\.?\d+)\*10e?([-+]?\d+)$/i);
    if (sci) return Number(sci[1]) * Math.pow(10, Number(sci[2]));

    const val = Number(part);
    return Number.isFinite(val) ? val : null;
  }

  function getFieldE() {
    return numberBeforeUnit("n\\s*/\\s*c") || numberBeforeUnit("v\\s*/\\s*m") || null;
  }

  function getSpeed() {
    return numberBeforeUnit("m\\s*/\\s*s") || numberBeforeUnit("m\\s*\\/\\s*s") || null;
  }

  function getDistanceMeters() {
    const mm = numberBeforeUnit("mm\\b");
    if (mm !== null) return mm * 1e-3;

    const cm = numberBeforeUnit("cm\\b");
    if (cm !== null) return cm * 1e-2;

    const nm = numberBeforeUnit("nm\\b");
    if (nm !== null) return nm * 1e-9;

    const m = numberBeforeUnit("m\\b");
    if (m !== null) return m;

    return null;
  }

  function getChargeCoulombs() {
    const nc = numberBeforeUnit("nc\\b");
    if (nc !== null) return nc * 1e-9;

    const uc = numberBeforeUnit("uc\\b");
    if (uc !== null) return uc * 1e-6;

    const c = numberBeforeUnit("c\\b");
    if (c !== null) return c;

    return null;
  }

  function answerBlock({
    topic,
    confidence = "high confidence",
    givens = [],
    unknown,
    formula,
    steps,
    answer,
    trap,
    memory,
  }) {
    return makeResult({
      topic: `${topic} — ${confidence}`,
      givens,
      unknown,
      formula,
      steps,
      answer,
      trap,
      memory,
    });
  }

  function notEnough(topic, formula, needs, trap) {
    return answerBlock({
      topic,
      confidence: "recognized but needs cleaner data",
      givens: numbers.map((n) => fmt(n)),
      unknown: needs,
      formula,
      steps:
        "I recognize the type of problem, but the pasted text is missing a number or unit I need. Paste the entire problem exactly, including units.",
      answer: "No final answer yet.",
      trap,
      memory: "GIVEN → UNKNOWN → MODEL → FORMULA → UNITS → CHECK",
    });
  }

  if (!raw.trim()) {
    return answerBlock({
      topic: "Smart Physics Solver",
      confidence: "waiting",
      givens: [],
      unknown: "Paste a full problem",
      formula: "The solver chooses the formula from clue words and units.",
      steps:
        "Paste the whole problem. Best results come from including units, answer choices, and exactly what it asks for.",
      answer: "Waiting for problem.",
      trap: "Numbers alone are not enough. The words pick the physics model.",
      memory: "Clue words choose formulas.",
    });
  }



  // ------------------------------------------------------------
  // CLASS NOTES: WORK, ENERGY, AND ELECTRIC FORCES
  // ------------------------------------------------------------

  if (
    has(["work"]) &&
    has(["force", "displacement"]) &&
    has(["angle", "theta", "perpendicular", "parallel"])
  ) {
    return answerBlock({
      topic: "Class Notes — Work From Force and Displacement",
      confidence: "concept/formula",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Work W",
      formula: "W = F*d*cos(theta)",
      steps:
        "Work uses only the part of the force in the direction of displacement.\\n" +
        "If force helps motion, work is positive.\\n" +
        "If force opposes motion, work is negative.\\n" +
        "If force is perpendicular to displacement, work is zero.",
      answer:
        "Use W = F*d*cos(theta).",
      trap:
        "Do not use W = F*d unless force and displacement point the same direction.",
      memory:
        "Work cares about direction.",
    });
  }

  if (
    has(["work-energy theorem", "work energy theorem", "total work", "delta ke", "change in kinetic energy"])
  ) {
    return answerBlock({
      topic: "Class Notes — Work-Energy Theorem",
      confidence: "concept/formula",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Change in kinetic energy or total work",
      formula: "W_total = Delta KE",
      steps:
        "Total work done on an object changes its kinetic energy.\\n" +
        "Positive total work increases speed.\\n" +
        "Negative total work decreases speed.",
      answer:
        "Use W_total = Delta KE.",
      trap:
        "This uses total/net work, not just one random force unless that is the only force doing work.",
      memory:
        "Work changes motion energy.",
    });
  }

  if (
    has(["conservation of energy", "mechanical energy", "kinetic", "potential"]) &&
    has(["no friction", "conservative", "constant"])
  ) {
    return answerBlock({
      topic: "Class Notes — Conservation of Mechanical Energy",
      confidence: "concept/formula",
      givens: numbers.map((n) => fmt(n)),
      unknown: "KE, PE, speed, height, or spring compression",
      formula: "KE_i + PE_i = KE_f + PE_f",
      steps:
        "If only conservative forces act, total mechanical energy stays constant.\\n" +
        "Energy can change form between kinetic and potential.\\n" +
        "Falling: gravitational PE turns into KE.\\n" +
        "Spring: spring PE turns into KE.",
      answer:
        "Use KE + PE = constant when there is no friction or air resistance.",
      trap:
        "If friction or air resistance is present, mechanical energy is not conserved.",
      memory:
        "No friction means energy trades forms.",
    });
  }

  if (
    has(["electric force", "electric field"]) &&
    has(["charge", "q"]) &&
    has(["work", "force", "displacement"])
  ) {
    return answerBlock({
      topic: "Class Notes — Electric Force and Electric Work",
      confidence: "concept/formula",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Electric force or work",
      formula: "F = qE and W = q*E*d",
      steps:
        "A charge in an electric field feels force F = qE.\\n" +
        "If it moves along the field direction, electric work is W = qEd.\\n" +
        "If the angle matters, use dot product logic.",
      answer:
        "Use F = qE for force. Use W = qEd for electric work when aligned.",
      trap:
        "For negative charges, the force direction is opposite the electric field.",
      memory:
        "Electric field pushes charges; work changes energy.",
    });
  }

  if (
    has(["potential energy between two point charges", "electric potential energy between charges", "two point charges"]) &&
    has(["separated", "distance", "r"])
  ) {
    return answerBlock({
      topic: "Class Notes — Electric Potential Energy Between Charges",
      confidence: "concept/formula",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Electric potential energy U",
      formula: "U = k*q1*q2/r",
      steps:
        "Use the product of the two charges.\\n" +
        "Like charges give positive U.\\n" +
        "Opposite charges give negative U.\\n" +
        "Distance r is in the denominator.",
      answer:
        "Use U = k*q1*q2/r.",
      trap:
        "Do not square one charge unless the two charges both have magnitude q.",
      memory:
        "Charge-pair energy is k q1 q2 over r.",
    });
  }


  // ------------------------------------------------------------
  // PEARSON PASTE MODE: common Mastering/Pearson problem patterns
  // ------------------------------------------------------------

  // He+ ion accelerated from rest to speed: find potential difference
  if (
    has(["he+ ion", "he + ion", "he ion", "helium ion"]) &&
    has(["potential difference", "delta v", "accelerate"]) &&
    has(["mass 4 u", "4 u", "4u"]) &&
    has(["from rest", "speed"])
  ) {
    const v =
      numberBeforeUnit("m\\s*/\\s*s") ||
      numbers.find((n) => n > 1e4 && n < 1e8);

    if (!v) {
      return notEnough(
        "Pearson Ch. 25 — He+ Ion Accelerated by Potential Difference",
        "q*DeltaV = 1/2*m*v^2",
        "final speed v",
        "Pearson text may have hidden the speed. Paste the whole line with m/s."
      );
    }

    const atomicMassUnit = 1.66e-27;
    const m = 4 * atomicMassUnit;
    const q = constants.e;
    const deltaV = (0.5 * m * v * v) / q;

    return answerBlock({
      topic: "Pearson Ch. 25 — He+ Ion Accelerated by Potential Difference",
      confidence: "high confidence",
      givens: [
        "He+ charge = +e = 1.60e-19 C",
        "mass = 4u = 6.64e-27 kg",
        `v = ${fmt(v)} m/s`,
        "starts from rest"
      ],
      unknown: "Potential difference Delta V",
      formula: "q*DeltaV = 1/2*m*v^2, so DeltaV = (1/2*m*v^2)/q",
      steps:
        "The ion starts from rest, so the electric potential energy becomes kinetic energy.\n" +
        "m = 4u = 4(1.66e-27 kg) = 6.64e-27 kg.\n" +
        `DeltaV = [1/2(6.64e-27)(${fmt(v)})^2] / (1.60e-19)`,
      answer:
        `Final Answer: DeltaV = ${fmt(deltaV)} V\n\n` +
        "For Pearson/Mastering, try: 4.7e4 V",
      trap:
        "Do not use electron mass or proton mass. He+ has mass 4u.",
      memory:
        "Voltage gives kinetic energy: qDeltaV = KE.",
    });
  }

  // Electron potential energy at negative terminal relative to positive terminal
  if (
    has(["electric potential energy", "potential energy"]) &&
    has(["electron"]) &&
    has(["negative terminal", "negative end"]) &&
    has(["positive terminal", "positive end"]) &&
    has(["-12 v", "negative 12 v", "12 v"]) &&
    has(["0 v", "zero v", "positive terminal is 0"])
  ) {
    const q = -constants.e;
    const V = -12;
    const U = q * V;

    return answerBlock({
      topic: "Pearson Ch. 25 — Electron Electric Potential Energy",
      confidence: "high confidence",
      givens: [
        "q_electron = -1.60e-19 C",
        "V_negative_terminal = -12 V",
        "V_positive_terminal = 0 V"
      ],
      unknown: "Electric potential energy U_E",
      formula: "U = q*V",
      steps:
        "Electric potential energy is charge times electric potential.\n" +
        "Use the electron's location: the negative terminal has V = -12 V.\n" +
        "U = (-1.60e-19)(-12).",
      answer:
        `Final Answer: U_E = ${fmt(U)} J\n\n` +
        "If Pearson wants fewer sig figs, use 1.9e-18 J.",
      trap:
        "Electron charge is negative and the terminal potential is negative, so U is positive.",
      memory:
        "Potential energy = charge times voltage.",
    });
  }

  // Work needed to move electron from positive to negative terminal
  if (
    has(["move an electron", "electron from the positive", "positive to the negative"]) &&
    has(["how much work", "work w", "work would you need"]) &&
    has(["battery", "terminal"])
  ) {
    const q = -constants.e;
    const Vi = 0;
    const Vf = -12;
    const deltaU = q * (Vf - Vi);

    return answerBlock({
      topic: "Pearson Ch. 25 — Work to Move Electron Across Battery",
      confidence: "high confidence",
      givens: [
        "electron charge = -1.60e-19 C",
        "V_initial = 0 V at positive terminal",
        "V_final = -12 V at negative terminal"
      ],
      unknown: "Work you must do on the electron",
      formula: "W_you = DeltaU = q*(V_f - V_i)",
      steps:
        "You are forcing the electron from positive to negative.\n" +
        "That is opposite the direction it naturally jumps, so you must add energy.\n" +
        "DeltaV = -12 - 0 = -12 V.\n" +
        "W = (-1.60e-19)(-12).",
      answer:
        `Final Answer: W = ${fmt(deltaU)} J\n\n` +
        "Try 1.92e-18 J. If Pearson wants 2 sig figs, try 1.9e-18 J.",
      trap:
        "The work you do is positive. The electric field would do negative work for this forced direction.",
      memory:
        "Forced opposite natural motion means you add energy.",
    });
  }

  // Concept: potential vs potential energy for -2e ion
  if (
    has(["electric potential", "potential energy"]) &&
    has(["negative ion", "-2e", "negative 2 e"]) &&
    has(["relative to the electron", "relative to an electron", "twice", "same"])
  ) {
    return answerBlock({
      topic: "Pearson Ch. 25 — Potential vs Potential Energy",
      confidence: "high confidence conceptual",
      givens: [
        "electron charge = -e",
        "negative ion charge = -2e",
        "same terminal/location"
      ],
      unknown: "How V and U compare",
      formula: "U = q*V",
      steps:
        "Electric potential V depends on location, not the particle.\n" +
        "Both particles are at the same terminal, so electric potential is the same.\n" +
        "Electric potential energy depends on charge.\n" +
        "The ion has twice the charge magnitude, so it has twice the potential energy.",
      answer:
        "Final Answer: The electric potential is the same and the electric potential energy is twice as much.",
      trap:
        "Do not use mass. Electric potential energy depends on charge and voltage.",
      memory:
        "Potential belongs to place. Potential energy belongs to charge.",
    });
  }

  // Concept: electric PE converts to kinetic energy
  if (
    has(["electron"]) &&
    has(["negative terminal", "negative end"]) &&
    has(["positive terminal", "positive end"]) &&
    has(["what happens to this energy", "jumps from the negative", "converted to kinetic", "kinetic energy"])
  ) {
    return answerBlock({
      topic: "Pearson Ch. 25 — Electric PE Converts to KE",
      confidence: "high confidence conceptual",
      givens: [
        "electron starts at negative terminal",
        "electron moves toward positive terminal"
      ],
      unknown: "What happens to electric potential energy",
      formula: "lost electric potential energy becomes kinetic energy",
      steps:
        "The electron is accelerated by the electric force.\n" +
        "As it moves, stored electric potential energy turns into motion.",
      answer:
        "Final Answer: It is converted to kinetic energy.",
      trap:
        "Energy does not disappear. It changes form.",
      memory:
        "Potential energy turns into speed.",
    });
  }



  // ------------------------------------------------------------
  // PEARSON PATTERN BANK: questions Hannah already solved
  // ------------------------------------------------------------

  // Charge configuration comparison: less work to assemble than intro square
  if (
    has(["requires less work to assemble", "configuration in the problem introduction"]) &&
    has(["figure a", "figure b", "figure c"]) &&
    has(["three positive charges", "one negative charge"])
  ) {
    return answerBlock({
      topic: "Pearson Ch. 25 — Compare Work to Assemble Charge Configurations",
      confidence: "high confidence conceptual",
      givens: [
        "Intro square with side L has three +q and one -q",
        "Intro configuration energy is 0 in units of kq^2/L",
        "Figure a: equilateral triangle, -q at center",
        "Figure b: four charges in a line",
        "Figure c: square with side 2L"
      ],
      unknown: "Which figure needs less work to assemble than the intro configuration",
      formula: "U_total = sum(k*q_i*q_j/r_ij) over every pair",
      steps:
        "Work to assemble equals total electric potential energy.\\n" +
        "Less work means lower total potential energy.\\n\\n" +
        "Intro square energy = 0.\\n\\n" +
        "Figure a has 3 positive-positive side pairs and 3 positive-negative center pairs.\\n" +
        "Its total is approximately -2.20(kq^2/L), which is less than 0.\\n\\n" +
        "Figure b is positive, about +0.67(kq^2/L).\\n" +
        "Figure c is 0 because it is the same pattern but scaled.",
      answer:
        "Final Answer: figure a",
      trap:
        "Do not only count signs. Count every pair and include distances.",
      memory:
        "Assembly work = total pair energy. More negative means less work.",
    });
  }

  // Electron spark direction between jumper cables
  if (
    has(["spark", "jumper cable", "jumper cables"]) &&
    has(["electrons traveling", "direction are the electrons", "movement of electrons"]) &&
    has(["positive terminal", "negative terminal"])
  ) {
    return answerBlock({
      topic: "Pearson Ch. 25 — Electron Direction During Spark",
      confidence: "high confidence conceptual",
      givens: [
        "electrons have negative charge",
        "negative terminal repels electrons",
        "positive terminal attracts electrons"
      ],
      unknown: "Direction electrons travel during spark",
      formula: "negative charges move toward higher electric potential / positive terminal",
      steps:
        "Electrons are negatively charged.\\n" +
        "They are repelled by the negative terminal.\\n" +
        "They are attracted to the positive terminal.\\n" +
        "So the actual electron motion is from negative to positive.",
      answer:
        "Final Answer: The electrons are traveling from the negative to the positive terminal.",
      trap:
        "Electron flow is opposite conventional current.",
      memory:
        "Electrons run from negative toward positive.",
    });
  }

  // Proton beam therapy: total charge needed from energy and voltage
  if (
    has(["proton-beam therapy", "proton beam therapy", "tumor", "protons"]) &&
    has(["deposit", "proton energy", "total charge"]) &&
    has(["potential difference", "kv"])
  ) {
    const energyJ = numberBeforeUnit("j\\b") || numbers.find((n) => n > 0 && n < 10);
    const kvVals = numbersBeforeUnit("kv\\b");
    const kv = kvVals.length ? kvVals[kvVals.length - 1] : null;

    if (!(energyJ && kv)) {
      return notEnough(
        "Pearson Ch. 25 — Proton Beam Therapy Total Charge",
        "q_total = E_total / DeltaV",
        "energy in J and potential difference in kV",
        "Convert kV to V before solving."
      );
    }

    const V = kv * 1000;
    const qTotal = energyJ / V;

    return answerBlock({
      topic: "Pearson Ch. 25 — Proton Beam Therapy Total Charge",
      confidence: "high confidence",
      givens: [
        `energy deposited = ${fmt(energyJ)} J`,
        `potential difference = ${fmt(kv)} kV = ${fmt(V)} V`
      ],
      unknown: "Total charge of protons",
      formula: "E_total = q_total*DeltaV, so q_total = E_total/DeltaV",
      steps:
        "Each coulomb accelerated through a voltage gains energy qDeltaV.\\n" +
        "For a whole beam, total energy = total charge times voltage.\\n" +
        `q_total = ${fmt(energyJ)} / ${fmt(V)}`,
      answer:
        `Final Answer: q = ${fmt(qTotal)} C`,
      trap:
        "The problem gives kV. Convert to volts by multiplying by 1000.",
      memory:
        "Beam energy = total charge times voltage.",
    });
  }


  // ------------------------------------------------------------
  // PEARSON FOLLOW-UP: same 2.20 cm x 2.20 cm capacitor, new spacing only
  // ------------------------------------------------------------
  if (
    has(["potential difference across the capacitor"]) &&
    has(["spacing between the plates"]) &&
    has(["1.40 mm", "1.4 mm"]) &&
    !has(["charged to", "0.712", "2.20 cm"])
  ) {
    const side = 2.20e-2;
    const A = side * side;
    const Q = 0.712e-9;
    const d = 1.40e-3;
    const Ccap = constants.eps0 * A / d;
    const V = Q / Ccap;

    return answerBlock({
      topic: "Pearson Ch. 26 — Capacitor Follow-Up With New Spacing",
      confidence: "high confidence for this Pearson set",
      givens: [
        "Using previous part's capacitor:",
        "plate size = 2.20 cm x 2.20 cm",
        "charge = +/-0.712 nC",
        "new spacing = 1.40 mm"
      ],
      unknown: "Potential difference DeltaV",
      formula: "C = epsilon_0*A/d and DeltaV = Q/C",
      steps:
        "This is the follow-up to the earlier capacitor problem.\\n" +
        "The plate size and charge stay the same.\\n" +
        "Only the spacing changes to 1.40 mm.\\n" +
        "Since d doubled from 0.700 mm to 1.40 mm, capacitance is cut in half.\\n" +
        "Because DeltaV = Q/C, the voltage doubles.\\n" +
        "Previous answer was about 116 V, so new voltage is about 232.6 V.",
      answer:
        `Final Answer: DeltaV = ${fmt(V)} V\\n\\n` +
        "Enter: 233 V",
      trap:
        "A short Pearson follow-up may omit the plate size and charge. It is using the same capacitor from Part A.",
      memory:
        "For a fixed charge capacitor, bigger spacing means bigger voltage.",
    });
  }

  // Parallel plate capacitor square plates: find voltage
  if (
    has(["parallel-plate capacitor", "parallel plate capacitor"]) &&
    has(["plates", "charged to", "spacing"]) &&
    has(["potential difference"])
  ) {
    const cmVals = numbersBeforeUnit("cm\\b");
    const mmVals = numbersBeforeUnit("mm\\b");
    const nCVals = numbersBeforeUnit("nc\\b");

    // Pearson often has "2.20 cm x 2.20 cm" and spacing 0.700 mm.
    const sideCm = cmVals[0];
    const spacingMm = mmVals.length ? mmVals[mmVals.length - 1] : null;
    const chargeNc = nCVals.length ? Math.abs(nCVals[0]) : null;

    if (sideCm && spacingMm && chargeNc) {
      const side = sideCm * 1e-2;
      const A = side * side;
      const d = spacingMm * 1e-3;
      const Q = chargeNc * 1e-9;
      const Ccap = constants.eps0 * A / d;
      const V = Q / Ccap;

      return answerBlock({
        topic: "Pearson Ch. 26 — Parallel Plate Capacitor Voltage",
        confidence: "high confidence",
        givens: [
          `plate side = ${sideCm} cm = ${fmt(side)} m`,
          `area = ${fmt(A)} m^2`,
          `charge = ${chargeNc} nC = ${fmt(Q)} C`,
          `spacing = ${spacingMm} mm = ${fmt(d)} m`
        ],
        unknown: "Potential difference DeltaV",
        formula: "C = epsilon_0*A/d and DeltaV = Q/C",
        steps:
          "Find plate area first.\\n" +
          "A = side^2.\\n" +
          "C = epsilon_0*A/d.\\n" +
          "DeltaV = Q/C.\\n" +
          `C = (8.854e-12)(${fmt(A)})/(${fmt(d)}) = ${fmt(Ccap)} F\\n` +
          `DeltaV = ${fmt(Q)}/${fmt(Ccap)}`,
        answer:
          `Final Answer: DeltaV = ${fmt(V)} V`,
        trap:
          "Convert cm to m, mm to m, and nC to C.",
        memory:
          "Capacitor voltage = charge divided by capacitance.",
      });
    }

    return notEnough(
      "Pearson Ch. 26 — Parallel Plate Capacitor Voltage",
      "C = epsilon_0*A/d and DeltaV = Q/C",
      "plate size, charge, and spacing",
      "Pearson may glue the text together. Make sure it includes cm, nC, and mm."
    );
  }

  // Point charge voltage inverse distance: 9 V at 1 m, find voltage at 2 m or 3 m
  if (
    has(["voltage meter", "1 m away", "9 v"]) &&
    has(["what is the voltage", "voltage 2 m", "voltage 3 m", "away from the charge"])
  ) {
    const targetM =
      lower.includes("3 m") ? 3 :
      lower.includes("2 m") ? 2 :
      null;

    if (targetM) {
      const V = 9 / targetM;

      return answerBlock({
        topic: "Pearson Ch. 25 — Point Charge Voltage vs Distance",
        confidence: "high confidence",
        givens: [
          "V = 9 V at r = 1 m",
          `target distance = ${targetM} m`
        ],
        unknown: "Voltage at new distance",
        formula: "V = kq/r, so V is proportional to 1/r",
        steps:
          "For a point charge, voltage decreases as 1/r.\\n" +
          `V_new = 9 V * (1 m / ${targetM} m).`,
        answer:
          `Final Answer: V = ${fmt(V)} V`,
        trap:
          "Electric potential goes like 1/r, not 1/r^2. Electric field goes like 1/r^2.",
        memory:
          "Voltage halves when distance doubles.",
      });
    }
  }

  // General point charge voltage ratio
  if (
    has(["electric potential", "voltage"]) &&
    has(["point charge", "positive charge"]) &&
    has(["1 m away"]) &&
    has(["2 m away", "3m away", "3 m away", "distance"])
  ) {
    const targetM =
      lower.includes("3 m") || lower.includes("3m") ? 3 :
      lower.includes("2 m") || lower.includes("2m") ? 2 :
      null;

    if (targetM) {
      const V = 9 / targetM;

      return answerBlock({
        topic: "Pearson Ch. 25 — Point Charge Potential",
        confidence: "high confidence",
        givens: [
          "V_1 = 9 V",
          "r_1 = 1 m",
          `r_2 = ${targetM} m`
        ],
        unknown: "V_2",
        formula: "V_2 = V_1*(r_1/r_2)",
        steps:
          `V_2 = 9*(1/${targetM})`,
        answer:
          `Final Answer: V = ${fmt(V)} V`,
        trap:
          "Use 1/r for voltage. Use 1/r^2 for electric field.",
        memory:
          "Potential is softer than field: 1/r instead of 1/r^2.",
      });
    }
  }

  // Equipotential lines and electric field direction
  if (
    has(["equipotential", "equipotential lines"]) &&
    has(["electric field", "e-field sensors"]) &&
    has(["perpendicular", "parallel", "lower voltages", "higher voltages"])
  ) {
    return answerBlock({
      topic: "Pearson Ch. 25 — Equipotential Lines and Electric Field",
      confidence: "high confidence conceptual",
      givens: [
        "equipotential line = same voltage everywhere on the line",
        "electric field points in direction of decreasing voltage"
      ],
      unknown: "Correct statement about E-field and equipotential lines",
      formula: "E-field is perpendicular to equipotential lines",
      steps:
        "Along an equipotential line, voltage does not change.\\n" +
        "The electric field points in the direction voltage changes fastest.\\n" +
        "Therefore it must be perpendicular to the equipotential line.\\n" +
        "For a positive charge, electric field points outward from higher voltage toward lower voltage.",
      answer:
        "Final Answer: At any point, the electric field is perpendicular to the equipotential line at that point, and it is directed toward lines of lower voltages.",
      trap:
        "The field is not parallel to equipotential lines.",
      memory:
        "E-field crosses contour lines at 90 degrees and goes downhill in voltage.",
    });
  }


  // ------------------------------------------------------------
  // FORMULA PICKER
  // ------------------------------------------------------------
  if (has(["what formula", "which formula", "what equation", "how do i solve"])) {
    return answerBlock({
      topic: "Formula Picker",
      confidence: "setup mode",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Best formula",
      formula:
        "Match clue words: charge force -> Coulomb; field -> E; flux/enclosed charge -> Gauss; voltage -> energy; capacitor -> C/Q/V; circuit -> V=IR; magnetism -> qvB; light -> c=f*lambda.",
      steps:
        "Charge from electrons: Q = N*(-e)\n" +
        "Force between charges: F = k*|q1*q2|/r^2\n" +
        "Point charge field: E = k*|q|/r^2\n" +
        "Force in field: F = qE\n" +
        "Particle across plates: qEd = 1/2*m*v^2\n" +
        "Flux: Phi = E*A*cos(theta)\n" +
        "Gauss: Phi = Q_inside/epsilon_0\n" +
        "Capacitor: C = Q/DeltaV\n" +
        "Ohm: V = IR\n" +
        "Magnetism: F = qvBsin(theta)\n" +
        "Light: c = f*lambda",
      answer: "Circle clue words first, then pick from this map.",
      trap: "Do not choose a formula from numbers alone.",
      memory: "Words pick formula. Units check formula.",
    });
  }

  // ------------------------------------------------------------
  // ELECTRONS ADDED / CHARGE
  // ------------------------------------------------------------
  if (has(["electrons are added", "electrons added", "excess electrons", "number of electrons"])) {
    const N = numbers.find((n) => n > 1000);
    if (!N) return notEnough("Charge From Electrons", "Q = N*(-e)", "number of electrons", "Added electrons make negative charge.");

    const Q = -N * constants.e;
    return answerBlock({
      topic: "Ch. 22 — Charge From Electrons",
      givens: [`N = ${fmt(N)} electrons`, "e = 1.602e-19 C"],
      unknown: "Charge Q",
      formula: "Q = N*(-e)",
      steps: `Q = (${fmt(N)})(-1.602e-19 C)`,
      answer: `Final Answer: Q = ${fmt(Q)} C`,
      trap: "Electrons added means negative.",
      memory: "Electrons added = minus.",
    });
  }

  // ------------------------------------------------------------
  // PROTON SPEED ACROSS CAPACITOR FROM FIELD + SPACING
  // ------------------------------------------------------------
  if (
    has(["proton"]) &&
    has(["released from rest"]) &&
    has(["parallel-plate", "parallel plate", "capacitor"]) &&
    has(["electric field", "field strength", "n/c"])
  ) {
    const E = getFieldE();
    const d = getDistanceMeters();

    if (!(E && d)) {
      return notEnough(
        "Proton Speed Across Parallel Plates",
        "v = sqrt(2*q*E*d/m)",
        "electric field E and plate spacing d",
        "Spacing must be converted to meters."
      );
    }

    const v = Math.sqrt((2 * constants.e * E * d) / constants.mp);

    return answerBlock({
      topic: "Ch. 23/25 — Proton Speed Across Parallel Plates",
      givens: [
        `E = ${fmt(E)} N/C`,
        `d = ${fmt(d)} m`,
        "q_proton = 1.602e-19 C",
        "m_proton = 1.673e-27 kg",
      ],
      unknown: "Final speed v",
      formula: "q*E*d = 1/2*m*v^2, so v = sqrt(2*q*E*d/m)",
      steps:
        "The proton starts from rest.\n" +
        "The electric field does work: W = qEd.\n" +
        "That work becomes kinetic energy: qEd = 1/2mv^2.\n" +
        `v = sqrt((2)(1.602e-19)(${fmt(E)})(${fmt(d)})/(1.673e-27))`,
      answer: `Final Answer: v = ${fmt(v)} m/s`,
      trap: "A positive exponent is expected. The particle should move fast, not 10^-5 m/s slow.",
      memory: "Released from rest across plates = electric work becomes kinetic energy.",
    });
  }

  // ------------------------------------------------------------
  // ELECTRON SPEED FROM PROTON SPEED IN SAME CAPACITOR
  // ------------------------------------------------------------
  if (
    has(["proton"]) &&
    has(["electron"]) &&
    has(["parallel-plate", "parallel plate", "capacitor"]) &&
    has(["released from rest"]) &&
    has(["speed", "final speed"])
  ) {
    const vp = getSpeed();
    if (!vp) {
      return notEnough(
        "Electron Speed From Proton Speed",
        "v_e = v_p*sqrt(m_p/m_e)",
        "proton speed",
        "Same voltage gives same kinetic energy, not same speed."
      );
    }

    const ve = vp * Math.sqrt(constants.mp / constants.me);

    return answerBlock({
      topic: "Ch. 23/25 — Electron Speed From Proton Speed",
      givens: [
        `v_proton = ${fmt(vp)} m/s`,
        "m_proton = 1.673e-27 kg",
        "m_electron = 9.109e-31 kg",
      ],
      unknown: "Electron final speed",
      formula: "v_e = v_p*sqrt(m_p/m_e)",
      steps:
        "Same capacitor means same voltage difference.\n" +
        "Proton and electron have the same charge magnitude.\n" +
        "So they gain the same kinetic energy.\n" +
        "1/2*m_p*v_p^2 = 1/2*m_e*v_e^2\n" +
        `v_e = ${fmt(vp)}*sqrt((1.673e-27)/(9.109e-31))`,
      answer: `Final Answer: v = ${fmt(ve)} m/s`,
      trap: "Do not give the electron the same speed. It is much lighter, so it moves faster.",
      memory: "Same energy, lighter particle, faster speed.",
    });
  }


  // ------------------------------------------------------------
  // WORK TO ASSEMBLE POINT CHARGES AT SQUARE CORNERS
  // ------------------------------------------------------------
  if (
    has(["work", "assemble", "configuration"]) &&
    has(["four point charges", "corners of a square", "side length"]) &&
    has(["+q", "-q", "kq"])
  ) {
    return answerBlock({
      topic: "Ch. 25 — Work to Assemble Charges at Square Corners",
      confidence: "high confidence",
      givens: [
        "A, B, C have charge +q",
        "D has charge -q",
        "square side length = L",
        "use k instead of 1/(4*pi*epsilon_0)"
      ],
      unknown: "Numeric multiplier of kq^2/L",
      formula: "W = sum of k*q_i*q_j/r_ij over every charge pair",
      steps:
        "There are 6 unique pairs of charges.\\n\\n" +
        "Positive-positive pairs:\\n" +
        "two side pairs: +1 +1\\n" +
        "one diagonal pair: +1/sqrt(2)\\n\\n" +
        "Positive-negative pairs:\\n" +
        "two side pairs: -1 -1\\n" +
        "one diagonal pair: -1/sqrt(2)\\n\\n" +
        "Total multiplier = 1 + 1 + 1/sqrt(2) - 1 - 1 - 1/sqrt(2)",
      answer:
        "Final Answer: W = 0 * (kq^2/L)\\n\\n" +
        "Enter: 0",
      trap:
        "Do not only count adjacent charges. You must count all 6 pairs: 4 sides and 2 diagonals.",
      memory:
        "Assembly work = add every pair once.",
    });
  }

  // ------------------------------------------------------------
  // POINT CHARGE ELECTRIC FIELD
  // ------------------------------------------------------------
  if (has(["electric field"]) && has(["point charge", "bead", "charge"]) && has(["cm", "mm", "m from", "distance"])) {
    const q = Math.abs(getChargeCoulombs() || 0);
    const r = getDistanceMeters();

    if (!(q && r)) {
      return notEnough("Point Charge Electric Field", "E = k*|q|/r^2", "charge q and distance r", "Convert nC/uC and cm/mm first.");
    }

    const E = constants.k * q / (r * r);
    const direction = has(["negative", "-"]) ? "toward the charge" : "away from the charge";

    return answerBlock({
      topic: "Ch. 23 — Electric Field of a Point Charge",
      givens: [`q = ${fmt(q)} C`, `r = ${fmt(r)} m`],
      unknown: "Electric field E",
      formula: "E = k*|q|/r^2",
      steps: `E = (8.99e9)(${fmt(q)})/(${fmt(r)})^2`,
      answer: `Final Answer: E = ${fmt(E)} N/C, direction ${direction}`,
      trap: "Magnitude is positive. Direction comes from charge sign.",
      memory: "Positive points away. Negative points toward.",
    });
  }

  // ------------------------------------------------------------
  // FORCE ON CHARGE IN ELECTRIC FIELD
  // ------------------------------------------------------------
  if (has(["force"]) && has(["electric field", "n/c"]) && has(["charge", "proton", "electron"])) {
    const E = getFieldE();
    let q = getChargeCoulombs();

    if (!q && has(["proton"])) q = constants.e;
    if (!q && has(["electron"])) q = constants.e;

    if (!(E && q)) {
      return notEnough("Force on Charge in Electric Field", "F = qE", "charge q and electric field E", "Use charge magnitude for force magnitude.");
    }

    const F = q * E;

    return answerBlock({
      topic: "Ch. 23 — Force on Charge in Electric Field",
      givens: [`q = ${fmt(q)} C`, `E = ${fmt(E)} N/C`],
      unknown: "Force F",
      formula: "F = qE",
      steps: `F = (${fmt(q)})(${fmt(E)})`,
      answer: `Final Answer: F = ${fmt(F)} N`,
      trap: "Electron force direction is opposite the electric field.",
      memory: "Field times charge gives force.",
    });
  }

  // ------------------------------------------------------------
  // GAUSS'S LAW / FLUX
  // ------------------------------------------------------------
  if (has(["gauss", "closed surface", "enclosed charge", "net flux", "flux through a closed"])) {
    const q = getChargeCoulombs();

    if (q) {
      const phi = q / constants.eps0;
      return answerBlock({
        topic: "Ch. 24 — Gauss's Law Net Flux",
        givens: [`Q_inside = ${fmt(q)} C`, "epsilon_0 = 8.854e-12"],
        unknown: "Net electric flux",
        formula: "Phi = Q_inside / epsilon_0",
        steps: `Phi = (${fmt(q)})/(8.854e-12)`,
        answer: `Final Answer: Phi = ${fmt(phi)} N*m^2/C`,
        trap: "Only enclosed charge counts. Outside charges do not affect net flux.",
        memory: "Gauss asks: how much charge is inside?",
      });
    }

    return answerBlock({
      topic: "Ch. 24 — Gauss's Law",
      confidence: "concept",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Flux or enclosed charge",
      formula: "Phi = Q_inside / epsilon_0",
      steps:
        "Add only the charges inside the closed surface.\n" +
        "Positive charges add positive flux.\n" +
        "Negative charges add negative flux.\n" +
        "Outside charges do not count.",
      answer: "Net flux depends only on Q_inside.",
      trap: "Do not include charges outside the Gaussian surface.",
      memory: "Closed surface = inside charge only.",
    });
  }

  if (has(["flux"]) && has(["area", "surface", "normal", "angle"])) {
    return answerBlock({
      topic: "Ch. 24 — Electric Flux Through Flat Surface",
      confidence: "formula/setup",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Electric flux",
      formula: "Phi = E*A*cos(theta)",
      steps:
        "Use the angle between the electric field and the normal vector.\n" +
        "If the problem gives angle with the surface, convert to angle with normal.",
      answer: "Use Phi = E*A*cos(theta).",
      trap: "Theta is with the normal, not always the surface.",
      memory: "Flux uses the normal.",
    });
  }



  // ------------------------------------------------------------
  // ELECTRIC POTENTIAL VS POTENTIAL ENERGY CONCEPT
  // ------------------------------------------------------------
  if (
    has(["electric potential", "potential energy"]) &&
    has(["negative ion", "charge negative 2 e", "-2e", "negative 2 e"]) &&
    has(["relative to the electron", "twice", "same"])
  ) {
    return answerBlock({
      topic: "Ch. 25 — Electric Potential vs Electric Potential Energy",
      confidence: "high confidence conceptual",
      givens: [
        "electron charge = -e",
        "negative ion charge = -2e",
        "same terminal/location"
      ],
      unknown: "How electric potential and electric potential energy compare",
      formula: "U = q*V",
      steps:
        "Electric potential V depends on the location, not the particle.\\n" +
        "The electron and the negative ion are at the same terminal, so electric potential is the same.\\n" +
        "Electric potential energy depends on charge: U = qV.\\n" +
        "The negative ion has twice the charge magnitude of an electron: -2e instead of -e.\\n" +
        "So its electric potential energy is twice as much.",
      answer:
        "Final Answer: The electric potential is the same and the electric potential energy is twice as much.",
      trap:
        "Do not use mass. Electric potential energy depends on charge and voltage, not the mass of the ion.",
      memory:
        "Potential belongs to the place. Potential energy belongs to the charge at that place.",
    });
  }

  // ------------------------------------------------------------
  // ELECTRIC POTENTIAL ENERGY CONCEPT
  // ------------------------------------------------------------
  if (
    has(["potential energy", "electrical potential energy"]) &&
    has(["potential difference", "voltage", " v "]) &&
    has(["electron", "charge", "positive and negative"])
  ) {
    return answerBlock({
      topic: "Ch. 25 — Electric Potential Energy",
      confidence: "high confidence conceptual",
      givens: numbers.map((n) => fmt(n)),
      unknown: "What electrical potential energy depends on",
      formula: "U = q*V and DeltaU = q*DeltaV",
      steps:
        "Electric potential energy depends on charge and electric potential.\\n" +
        "For a change in potential energy, use DeltaU = q*DeltaV.\\n" +
        "The electron has charge q = -e.\\n" +
        "The jumper cables create a potential difference of 12 V.\\n" +
        "So the energy depends on the electron's charge and the potential difference.",
      answer:
        "Final Answer: It depends on the charge of the particle and the potential difference between the two ends.\\n\\n" +
        "For an electron, the charge is fixed, so its potential energy depends on the 12 V potential difference.",
      trap:
        "It does not directly depend on the short distance between the cable ends or the path the electron takes.",
      memory:
        "Voltage is energy per charge. Potential energy = charge times voltage.",
    });
  }

  // ------------------------------------------------------------
  // CAPACITORS
  // ------------------------------------------------------------
  if (has(["capacitor", "capacitance", "farad"])) {
    if (has(["electric field"]) && has(["plate", "diameter", "area", "electrode"])) {
      return answerBlock({
        topic: "Ch. 26 — Parallel Plate Capacitor",
        confidence: "formula/setup",
        givens: numbers.map((n) => fmt(n)),
        unknown: "Q, C, E, A, or d",
        formula: "Q = epsilon_0*A*E and C = epsilon_0*A/d",
        steps:
          "For circular plates, convert diameter to radius first.\n" +
          "A = pi*r^2.\n" +
          "If E is given, Q = epsilon_0*A*E.",
        answer: "Use the capacitor formula matching the unknown.",
        trap: "Do not use diameter as radius.",
        memory: "Plate area matters.",
      });
    }

    return answerBlock({
      topic: "Ch. 26 — Capacitors",
      confidence: "formula/setup",
      givens: numbers.map((n) => fmt(n)),
      unknown: "C, Q, DeltaV, energy, or field",
      formula: "C = Q/DeltaV",
      steps:
        "Capacitance stores charge per volt.\n" +
        "Use Q = C*DeltaV if solving for charge.\n" +
        "Use DeltaV = Q/C if solving for voltage.",
      answer: "Pick the capacitor formula based on the unknown.",
      trap: "Capacitance is not charge.",
      memory: "Capacitor = charge storage per volt.",
    });
  }

  // ------------------------------------------------------------
  // CIRCUITS
  // ------------------------------------------------------------
  if (has(["resistor", "resistance", "ohm", "current", "circuit", "voltage", "power"])) {
    return answerBlock({
      topic: "Ch. 27/28 — Circuits",
      confidence: "formula/setup",
      givens: numbers.map((n) => fmt(n)),
      unknown: "V, I, R, P, or equivalent resistance",
      formula: "V = I*R; P = I*V; series add; parallel reciprocals",
      steps:
        "First decide series or parallel.\n" +
        "Series: same current, resistances add.\n" +
        "Parallel: same voltage, reciprocals add.\n" +
        "Then use Ohm's Law.",
      answer: "Use the circuit formula with one unknown.",
      trap: "Do not add parallel resistors directly.",
      memory: "Series same current. Parallel same voltage.",
    });
  }

  // ------------------------------------------------------------
  // WAVES / LIGHT
  // ------------------------------------------------------------
  if (has(["wavelength", "frequency", "hz", "nm", "light"])) {
    const nm = numberBeforeUnit("nm\\b");

    if (nm) {
      const f = constants.c / (nm * 1e-9);
      return answerBlock({
        topic: "Ch. 16/31 — Wave or Light Frequency",
        givens: [`lambda = ${nm} nm = ${fmt(nm * 1e-9)} m`],
        unknown: "Frequency f",
        formula: "c = f*lambda, so f = c/lambda",
        steps: `f = (3.00e8)/(${fmt(nm * 1e-9)})`,
        answer: `Final Answer: f = ${fmt(f)} Hz`,
        trap: "Convert nm to meters.",
        memory: "Light uses c = f lambda.",
      });
    }

    return answerBlock({
      topic: "Ch. 16/31 — Waves",
      confidence: "formula/setup",
      givens: numbers.map((n) => fmt(n)),
      unknown: "v, f, or lambda",
      formula: "v = f*lambda",
      steps: "Use the two known quantities to solve for the third.",
      answer: "Use v = f*lambda.",
      trap: "Do not mix up frequency and angular frequency.",
      memory: "Wave speed = frequency times wavelength.",
    });
  }

  // ------------------------------------------------------------
  // MAGNETISM
  // ------------------------------------------------------------
  if (has(["magnetic", "tesla", "b field", "moving charge"])) {
    return answerBlock({
      topic: "Ch. 29 — Magnetic Force",
      confidence: "formula/setup",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Magnetic force",
      formula: "F = q*v*B*sin(theta)",
      steps:
        "Magnetic force needs a moving charge.\n" +
        "Force is zero if velocity is parallel to B.\n" +
        "Force is maximum at 90 degrees.",
      answer: "Use F = qvBsin(theta).",
      trap: "Stationary charges feel no magnetic force.",
      memory: "Magnetism needs motion.",
    });
  }

  if (has(["induction", "emf", "faraday", "lenz", "magnetic flux"])) {
    return answerBlock({
      topic: "Ch. 30 — Induction",
      confidence: "formula/setup",
      givens: numbers.map((n) => fmt(n)),
      unknown: "Induced emf",
      formula: "epsilon = -N*DeltaPhi_B/DeltaT",
      steps:
        "Changing magnetic flux creates emf.\n" +
        "Use magnitude for numeric answer.\n" +
        "Use Lenz's Law for direction.",
      answer: "Use |epsilon| = N*DeltaPhi_B/DeltaT.",
      trap: "No changing flux means no induced emf.",
      memory: "Change flux, get emf.",
    });
  }

  // ------------------------------------------------------------
  // SAFE FALLBACK
  // ------------------------------------------------------------
  return answerBlock({
    topic: "Smart Physics Solver",
    confidence: "not safe to calculate yet",
    givens: numbers.map((n) => fmt(n)),
    unknown: "The requested quantity",
    formula: "Not confidently classified.",
    steps:
      "I do not want the app to fake an answer.\n\n" +
      "Use this setup:\n" +
      "1. GIVEN: list numbers with units.\n" +
      "2. UNKNOWN: what does it ask for?\n" +
      "3. MODEL: waves, charge, field, flux, capacitor, circuit, magnetism, or light?\n" +
      "4. FORMULA: pick from clue words.\n" +
      "5. UNITS: convert nC, uC, mm, cm, nm.\n" +
      "6. CHECK: does the size/direction make sense?",
    answer:
      "Paste the full problem with units and answer choices. I need more context to solve accurately.",
    trap:
      "A solver that guesses is worse than no solver. This one stops when confidence is low.",
    memory:
      "GIVEN → UNKNOWN → MODEL → FORMULA → UNITS → CHECK",
  });
}

function getModuleForChapter(chapterId) {
  return MODULES.find((m) => m.chapters.includes(chapterId)) || MODULES[0];
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
  const [lessonIndex, setLessonIndex] = useState(0);
  const [problem, setProblem] = useState("");
  const [testMode, setTestMode] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [bossIndex, setBossIndex] = useState(0);
  const [bossMessage, setBossMessage] = useState("");

  const solved = useMemo(() => solveHomework(problem, testMode), [problem, testMode]);

  const chapterLessons = LESSONS[selectedChapter.id] || [];
  const currentLesson = chapterLessons[lessonIndex % Math.max(chapterLessons.length, 1)];

  const moduleCards = MEMORY_CARDS.filter((c) => selectedModule.chapters.includes(c.chapter));
  const chapterCards = MEMORY_CARDS.filter((c) => c.chapter === selectedChapter.id);
  const activeCards = screen === "chapterMemory" ? chapterCards : moduleCards;
  const currentCard = activeCards[cardIndex % Math.max(activeCards.length, 1)];

  const moduleBoss = BOSS_QUESTIONS.filter((q) => q.module === selectedModule.id);
  const activeBoss = moduleBoss.length ? moduleBoss : BOSS_QUESTIONS;
  const boss = activeBoss[bossIndex % activeBoss.length];

  if (screen === "home") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Physics Final Boss</Text>
        <Text style={styles.subtitle}>
          A module-based tutor that teaches concepts first, then drills memory, then solves homework.
        </Text>

        <Card color={COLORS.green}>
          <Text style={styles.sectionTitle}>Best Study Flow</Text>
          <Text style={styles.body}>1. Pick the module you are on.</Text>
          <Text style={styles.body}>2. Open Learn This Module.</Text>
          <Text style={styles.body}>3. Read one concept card slowly.</Text>
          <Text style={styles.body}>4. Do that chapter's flashcards out loud.</Text>
          <Text style={styles.body}>5. Paste one homework problem into the solver.</Text>
          <Text style={styles.body}>6. Finish with the Boss Game.</Text>
          <Text style={styles.memory}>Rule: learn it, recall it, solve it, then boss fight it.</Text>
        </Card>

        <Card color={COLORS.red}>
          <Text style={styles.sectionTitle}>Panic Button</Text>
          <Text style={styles.body}>When stuck, write this first:</Text>
          <Text style={styles.formulaText}>GIVEN → UNKNOWN → MODEL → FORMULA → UNITS → CHECK</Text>
          <Text style={styles.trap}>Do not start with the calculator. Start with clue words.</Text>
        </Card>

        <Button title="Paste Homework Solver" onPress={() => setScreen("solver")} color={COLORS.green} />
        <Button title="Module Test Study Guides" onPress={() => setScreen("moduleTestGuidePicker")} color={COLORS.orange} />
        <Button title="Work + Energy Class Notes" onPress={() => setScreen("workEnergyNotes")} color={COLORS.purple} />
        <Button title="Filter Flashcards by Chapter" onPress={() => setScreen("flashcardFilter")} color={COLORS.yellow} />
        <Button title="Full Formula Map" onPress={() => setScreen("formulas")} color={COLORS.purple} />
        <Button title="Exam Cram Plan" onPress={() => setScreen("cram")} color={COLORS.blue} />

        <Text style={styles.sectionTitle}>Pick a Module</Text>
        {MODULES.map((mod) => (
          <Pressable
            key={mod.id}
            style={styles.moduleButton}
            onPress={() => {
              setSelectedModule(mod);
              setLessonIndex(0);
              setCardIndex(0);
              setBossIndex(0);
              setScreen("module");
            }}
          >
            <Text style={styles.moduleTitle}>{mod.title}</Text>
            <Text style={styles.body}>{mod.subtitle}</Text>
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

        <Button title="Learn This Module" onPress={() => setScreen("moduleLearn")} color={COLORS.green} />
        <Button title="Module Memory Cards" onPress={() => setScreen("moduleMemory")} color={COLORS.yellow} />
        <Button title="Module Boss Game" onPress={() => { setBossIndex(0); setBossMessage(""); setScreen("moduleBoss"); }} color={COLORS.red} />
        <Button title="Paste Homework From This Module" onPress={() => setScreen("solver")} color={COLORS.purple} />

        <Text style={styles.sectionTitle}>Chapters</Text>
        {selectedModule.chapters.map((id) => {
          const ch = CHAPTERS[id];
          return (
            <Pressable
              key={id}
              style={[styles.chapterButton, { borderColor: ch.color }]}
              onPress={() => {
                setSelectedChapter(ch);
                setLessonIndex(0);
                setCardIndex(0);
                setScreen("chapter");
              }}
            >
              <Text style={styles.chapterTitle}>{ch.title}</Text>
              <Text style={styles.formulaText}>{ch.formula}</Text>
            </Pressable>
          );
        })}

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "moduleLearn") {
    const allLessons = selectedModule.chapters.flatMap((id) =>
      (LESSONS[id] || []).map((lesson) => ({ ...lesson, chapter: id }))
    );
    const lesson = allLessons[lessonIndex % Math.max(allLessons.length, 1)];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{selectedModule.title} Learn Mode</Text>
        <Text style={styles.subtitle}>Concept {lessonIndex + 1} of {allLessons.length}</Text>

        <LessonCard lesson={lesson} chapter={CHAPTERS[lesson.chapter]} />

        <Button title="Next Concept" onPress={() => setLessonIndex((i) => i + 1)} color={COLORS.green} />
        <Button title="Back to Module" onPress={() => setScreen("module")} />
      </ScrollView>
    );
  }

  if (screen === "chapter") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{selectedChapter.title}</Text>

        <Card color={selectedChapter.color}>
          <Text style={styles.label}>Core Formula</Text>
          <Text style={styles.formulaText}>{selectedChapter.formula}</Text>

          <Text style={styles.label}>Chapter Checklist</Text>
          {selectedChapter.goals.map((g) => (
            <Text key={g} style={styles.checkItem}>□ {g}</Text>
          ))}

          <Text style={styles.memory}>Goal: do not move on until you can explain each box out loud.</Text>
        </Card>

        <Button title="Learn This Chapter" onPress={() => setScreen("chapterLearn")} color={COLORS.green} />
        <Button title="Chapter Study Guide" onPress={() => setScreen("chapterStudyGuide")} color={COLORS.blue} />
        <Button title="Chapter Flashcards" onPress={() => setScreen("chapterFlashcards")} color={COLORS.yellow} />
        <Button title="Chapter Memory Cards" onPress={() => setScreen("chapterMemory")} color={COLORS.orange} />
        <Button title="Paste Homework From This Chapter" onPress={() => setScreen("solver")} color={COLORS.purple} />
        <Button title="Back to Module" onPress={() => setScreen("module")} />
      </ScrollView>
    );
  }

  if (screen === "chapterLearn") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{selectedChapter.short} Learn Mode</Text>
        <Text style={styles.subtitle}>Concept {chapterLessons.length ? (lessonIndex % chapterLessons.length) + 1 : 0} of {chapterLessons.length}</Text>

        {currentLesson ? (
          <LessonCard lesson={currentLesson} chapter={selectedChapter} />
        ) : (
          <Card>
            <Text style={styles.body}>No lessons loaded for this chapter yet.</Text>
          </Card>
        )}

        <Button title="Next Concept" onPress={() => setLessonIndex((i) => i + 1)} color={COLORS.green} />
        <Button title="Back to Chapter" onPress={() => setScreen("chapter")} />
      </ScrollView>
    );
  }

  if (screen === "solver") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Paste Homework Solver</Text>
        <Text style={styles.subtitle}>Paste the full Pearson/Mastering problem exactly. The solver now cleans weird text like Upper, Baseline, Superscript, StartFraction, and divided by.</Text>

        <Pressable
          style={[styles.modeToggle, testMode ? styles.modeToggleOn : null]}
          onPress={() => setTestMode(!testMode)}
        >
          <Text style={styles.modeToggleText}>
            {testMode ? "TEST MODE ON: setup-first, no blind answer dumping" : "TEST MODE OFF: homework/practice solver"}
          </Text>
        </Pressable>

        <Card color={testMode ? COLORS.red : COLORS.green}>
          <Text style={styles.sectionTitle}>{testMode ? "Test Mode Rules" : "Practice Mode"}</Text>
          <Text style={styles.body}>
            {testMode
              ? "Use this to identify the model, formula, units, and setup. Only use during a real test if your instructor allows outside tools."
              : "Practice mode can calculate when it has enough clean numbers."}
          </Text>
        </Card>

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
          <Text style={styles.formulaText}>{solved.formula}</Text>

          <Text style={styles.label}>Test Setup System</Text>
          <Text style={styles.body}>GIVEN → UNKNOWN → MODEL → FORMULA → UNITS → CHECK</Text>

          <Text style={styles.label}>Steps</Text>
          <Text style={styles.body}>{solved.steps}</Text>

          <Text style={styles.label}>Answer / Strategy</Text>
          <Text style={styles.answer}>{solved.answer}</Text>

          <Text style={styles.label}>Trap Check</Text>
          <Text style={styles.trap}>{solved.trap}</Text>

          <Text style={styles.label}>6. Memory Hook</Text>
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
        <Text style={styles.subtitle}>Say the answer out loud before pressing show. If you hesitate, mark it Again.</Text>

        <Card color={COLORS.yellow}>
          <Text style={styles.label}>Ch. {currentCard?.chapter}</Text>
          <Text style={styles.bigQuestion}>{currentCard?.front}</Text>

          {showAnswer ? (
            <>
              <Text style={styles.answer}>{currentCard?.back}</Text>
              <Button title="Again" onPress={() => { setShowAnswer(false); setCardIndex((i) => i + 1); }} color={COLORS.red} />
              <Button title="Good" onPress={() => { setShowAnswer(false); setCardIndex((i) => i + 1); }} color={COLORS.blue} />
              <Button title="Easy" onPress={() => { setShowAnswer(false); setCardIndex((i) => i + 1); }} color={COLORS.green} />
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

        <Card color={COLORS.red}>
          <Text style={styles.label}>Round {(bossIndex % activeBoss.length) + 1} of {activeBoss.length}</Text>
          <Text style={styles.bigQuestion}>{boss.q}</Text>

          {boss.choices.map((choice) => (
            <Pressable
              key={choice}
              style={styles.choice}
              onPress={() => {
                setBossMessage(choice === boss.a ? "Correct. " + boss.teach : "Not yet. " + boss.teach);
              }}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {bossMessage ? <Text style={styles.answer}>{bossMessage}</Text> : null}

          <Button title="Next New Boss Round" onPress={() => { setBossMessage(""); setBossIndex((i) => i + 1); }} color={COLORS.red} />
        </Card>

        <Button title="Back to Module" onPress={() => setScreen("module")} />
      </ScrollView>
    );
  }


  if (screen === "flashcardFilter") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Filter Flashcards by Chapter</Text>
        <Text style={styles.subtitle}>Pick one chapter and drill only those cards. No junk drawer brain today.</Text>

        {Object.values(CHAPTERS).map((ch) => {
          const count = MEMORY_CARDS.filter((c) => c.chapter === ch.id).length;
          return (
            <Pressable
              key={ch.id}
              style={[styles.chapterButton, { borderColor: ch.color }]}
              onPress={() => {
                setSelectedChapter(ch);
                setCardIndex(0);
                setShowAnswer(false);
                setShowAnswer(false); setScreen("chapterFlashcards");
              }}
            >
              <Text style={styles.chapterTitle}>{ch.title}</Text>
              <Text style={styles.body}>{count} flashcards</Text>
              <Text style={styles.formulaText}>{ch.formula}</Text>
            </Pressable>
          );
        })}

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "chapterFlashcards") {
    const filteredCards = MEMORY_CARDS.filter((c) => c.chapter === selectedChapter.id);
    const card = filteredCards[cardIndex % Math.max(filteredCards.length, 1)];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{selectedChapter.short} Flashcards</Text>
        <Text style={styles.subtitle}>
          Ch. {selectedChapter.id} only. Say the answer out loud before pressing show. If you hesitate, mark it Again.
        </Text>

        <Card color={selectedChapter.color}>
          <Text style={styles.label}>Card {filteredCards.length ? (cardIndex % filteredCards.length) + 1 : 0} of {filteredCards.length}</Text>
          <Text style={styles.bigQuestion}>{card?.front || "No flashcards loaded for this chapter yet."}</Text>

          {showAnswer ? (
            <>
              <Text style={styles.answer}>{card?.back}</Text>
              <Button title="Again" onPress={() => { setShowAnswer(false); setCardIndex((i) => i + 1); }} color={COLORS.red} />
              <Button title="Good" onPress={() => { setShowAnswer(false); setCardIndex((i) => i + 1); }} color={COLORS.blue} />
              <Button title="Easy" onPress={() => { setShowAnswer(false); setCardIndex((i) => i + 1); }} color={COLORS.green} />
            </>
          ) : (
            <Button title="Show Answer" onPress={() => setShowAnswer(true)} color={COLORS.yellow} />
          )}
        </Card>

        <Button title="Open Chapter Study Guide" onPress={() => setScreen("chapterStudyGuide")} color={COLORS.blue} />
        <Button title="Back to Chapter" onPress={() => setScreen("chapter")} />
        <Button title="Pick Another Chapter" onPress={() => setScreen("flashcardFilter")} color={COLORS.purple} />
      </ScrollView>
    );
  }

  if (screen === "chapterStudyGuide") {
    const guide = STUDY_GUIDES[selectedChapter.id];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{guide?.title || selectedChapter.title + " Study Guide"}</Text>
        <Text style={styles.subtitle}>{guide?.bigIdea || "Study guide coming soon."}</Text>

        {guide ? (
          <>
            <LectureNoteSection chapterId={selectedChapter.id} />
            <ProblemSolvingRecipe chapterId={selectedChapter.id} />
            <StudyGuideSection title="Must Know" items={guide.mustKnow} color={selectedChapter.color} />
            <StudyGuideSection title="Formulas" items={guide.formulas} color={COLORS.green} />
            <StudyGuideSection title="Clue Words" items={guide.clueWords} color={COLORS.yellow} />
            <StudyGuideSection title="Common Traps" items={guide.traps} color={COLORS.red} />
            <StudyGuideSection title="Exam Moves" items={guide.examMoves} color={COLORS.purple} />
          </>
        ) : (
          <Card>
            <Text style={styles.body}>No study guide loaded for this chapter yet.</Text>
          </Card>
        )}

        <Button title="Chapter Flashcards" onPress={() => { setCardIndex(0); setShowAnswer(false); setShowAnswer(false); setScreen("chapterFlashcards"); }} color={COLORS.yellow} />
        <Button title="Learn This Chapter" onPress={() => setScreen("chapterLearn")} color={COLORS.green} />
        <Button title="Back to Chapter" onPress={() => setScreen("chapter")} />
      </ScrollView>
    );
  }



  if (screen === "workEnergyNotes") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{WORK_ENERGY_ELECTRIC_NOTES.title}</Text>
        <Text style={styles.subtitle}>{WORK_ENERGY_ELECTRIC_NOTES.bigIdea}</Text>

        {WORK_ENERGY_ELECTRIC_NOTES.sections.map((section) => (
          <Card key={section.heading} color={COLORS.blue}>
            <Text style={styles.sectionTitle}>{section.heading}</Text>
            {section.points.map((point) => (
              <Text key={point} style={styles.body}>- {point}</Text>
            ))}
          </Card>
        ))}

        <Card color={COLORS.green}>
          <Text style={styles.sectionTitle}>Most Important Formulas</Text>
          {WORK_ENERGY_ELECTRIC_NOTES.formulas.map((formula) => (
            <Text key={formula} style={styles.formulaText}>{formula}</Text>
          ))}
        </Card>

        <Card color={COLORS.yellow}>
          <Text style={styles.sectionTitle}>Pearson Clue Words</Text>
          {WORK_ENERGY_ELECTRIC_NOTES.testClues.map((clue) => (
            <Text key={clue} style={styles.body}>- {clue}</Text>
          ))}
        </Card>

        <Card color={COLORS.red}>
          <Text style={styles.sectionTitle}>Common Traps</Text>
          {WORK_ENERGY_ELECTRIC_NOTES.traps.map((trap) => (
            <Text key={trap} style={styles.trap}>- {trap}</Text>
          ))}
        </Card>

        <Button title="Open Solver" onPress={() => setScreen("solver")} color={COLORS.green} />
        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "moduleTestGuidePicker") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Module Test Study Guides</Text>
        <Text style={styles.subtitle}>
          Pick a module to see what the test is really checking, the formulas, clue words, common traps, and how to practice.
        </Text>

        {MODULES.map((mod) => {
          const guide = MODULE_TEST_GUIDES[mod.id];
          return (
            <Pressable
              key={mod.id}
              style={[styles.moduleButton, { borderColor: COLORS.orange }]}
              onPress={() => {
                setSelectedModule(mod);
                setScreen("moduleTestGuide");
              }}
            >
              <Text style={styles.moduleTitle}>{guide?.title || mod.title}</Text>
              <Text style={styles.body}>{guide?.goal || mod.mission}</Text>
            </Pressable>
          );
        })}

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "moduleTestGuide") {
    const guide = MODULE_TEST_GUIDES[selectedModule.id];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{guide?.title || selectedModule.title + " Test Guide"}</Text>
        <Text style={styles.subtitle}>{guide?.goal || selectedModule.mission}</Text>

        {guide ? (
          <>
            <ModuleGuideSection title="Chapters Covered" items={guide.chapters} color={COLORS.blue} />
            <ModuleGuideSection title="Big Ideas You Must Understand" items={guide.bigIdeas} color={COLORS.green} />
            <ModuleGuideSection title="Formula Map" items={guide.formulaMap} color={COLORS.purple} formula />
            <ModuleGuideSection title="Clue Words → Formula" items={guide.clueMap} color={COLORS.yellow} />
            <ModuleGuideSection title="How to Solve These Problems" items={guide.problemRecipes} color={COLORS.orange} />
            <ModuleGuideSection title="Problems You Must Practice" items={guide.mustPractice} color={COLORS.blue} />
            <ModuleGuideSection title="Common Mistakes" items={guide.commonMistakes} color={COLORS.red} />
            <ModuleGuideSection title="Test Strategy" items={guide.testStrategy} color={COLORS.green} />
          </>
        ) : (
          <Card>
            <Text style={styles.body}>No module guide loaded yet.</Text>
          </Card>
        )}

        <Button title="Learn This Module" onPress={() => setScreen("moduleLearn")} color={COLORS.green} />
        <Button title="Module Flashcards" onPress={() => setScreen("moduleMemory")} color={COLORS.yellow} />
        <Button title="Module Boss Game" onPress={() => { setBossIndex(0); setBossMessage(""); setScreen("moduleBoss"); }} color={COLORS.red} />
        <Button title="Back to Module" onPress={() => setScreen("module")} />
        <Button title="Pick Another Module Guide" onPress={() => setScreen("moduleTestGuidePicker")} color={COLORS.purple} />
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
                  <Text style={styles.formulaText}>{ch.formula}</Text>
                  {ch.goals.map((g) => <Text key={g} style={styles.body}>- {g}</Text>)}
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
          <Text style={styles.body}>1. Pick your current module.</Text>
          <Text style={styles.body}>2. Use Learn Mode for one chapter.</Text>
          <Text style={styles.body}>3. Do 10 memory cards out loud.</Text>
          <Text style={styles.body}>4. Paste 2 homework questions into Solver.</Text>
          <Text style={styles.body}>5. Do 5 Boss Game rounds.</Text>
        </Card>

        <Card color={COLORS.yellow}>
          <Text style={styles.sectionTitle}>Cheat Sheet Format</Text>
          <Text style={styles.body}>Formula | clue words | units | trap | example</Text>
        </Card>

        <Card color={COLORS.red}>
          <Text style={styles.sectionTitle}>Final Exam Survival Checklist</Text>
          <Text style={styles.checkItem}>□ I can identify the chapter from clue words.</Text>
          <Text style={styles.checkItem}>□ I can write givens and unknown before solving.</Text>
          <Text style={styles.checkItem}>□ I can convert nC, μC, cm, mm, and nm.</Text>
          <Text style={styles.checkItem}>□ I can tell scalar vs vector problems apart.</Text>
          <Text style={styles.checkItem}>□ I can explain the formula before plugging in.</Text>
          <Text style={styles.checkItem}>□ I can do a reasonableness check.</Text>
        </Card>

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tiny app hiccup — go home and keep studying.</Text>
      <Button title="Back Home" onPress={() => setScreen("home")} />
    </View>
  );
}

function LessonCard({ lesson, chapter }) {
  return (
    <Card color={chapter?.color || COLORS.green}>
      <Text style={styles.label}>{chapter?.title}</Text>
      <Text style={styles.sectionTitle}>{lesson.name}</Text>

      <Text style={styles.label}>1. Plain-English Meaning</Text>
      <Text style={styles.body}>{lesson.explain}</Text>

      <Text style={styles.label}>2. Formula / Rule</Text>
      <Text style={styles.formulaText}>{lesson.formula}</Text>

      <Text style={styles.label}>3. Clue Words That Trigger This</Text>
      <Text style={styles.body}>{lesson.clues}</Text>

      <Text style={styles.label}>4. Example Pattern</Text>
      <Text style={styles.body}>{lesson.example}</Text>

      <Text style={styles.label}>5. Common Trap</Text>
      <Text style={styles.trap}>{lesson.trap}</Text>

      <Text style={styles.label}>6. Memory Hook</Text>
      <Text style={styles.memory}>{lesson.memory}</Text>

      <Text style={styles.label}>7. Mini Check</Text>
      <Text style={styles.bigQuestion}>{lesson.check}</Text>
      <Text style={styles.answer}>{lesson.checkAnswer}</Text>
    </Card>
  );
}




function LectureNoteSection({ chapterId }) {
  const guide = LECTURE_NOTE_GUIDES[chapterId];

  if (!guide) {
    return null;
  }

  return (
    <Card color={COLORS.blue}>
      <Text style={styles.sectionTitle}>{guide.title}</Text>
      {guide.items.map((item) => (
        <Text key={item} style={styles.body}>- {item}</Text>
      ))}
    </Card>
  );
}

function ProblemSolvingRecipe({ chapterId }) {
  const universal = PROBLEM_SOLVING_RECIPES.universal;
  const recipe = PROBLEM_SOLVING_RECIPES[chapterId];

  if (!recipe) {
    return null;
  }

  return (
    <>
      <Card color={COLORS.orange}>
        <Text style={styles.sectionTitle}>Easy System for Every Physics Problem</Text>
        {universal.steps.map((step) => (
          <Text key={step} style={styles.body}>- {step}</Text>
        ))}

        <Text style={styles.label}>Panic Button</Text>
        {universal.panicButton.map((step) => (
          <Text key={step} style={styles.body}>- {step}</Text>
        ))}
      </Card>

      <Card color={COLORS.green}>
        <Text style={styles.sectionTitle}>{recipe.title}</Text>

        <Text style={styles.label}>Step-by-step recipe</Text>
        {recipe.steps.map((step) => (
          <Text key={step} style={styles.body}>- {step}</Text>
        ))}

        <Text style={styles.label}>Formula choices</Text>
        {recipe.formulas.map((formula) => (
          <Text key={formula} style={styles.answer}>- {formula}</Text>
        ))}

        <Text style={styles.label}>Traps</Text>
        {recipe.traps.map((trap) => (
          <Text key={trap} style={styles.trap}>- {trap}</Text>
        ))}
      </Card>
    </>
  );
}

function StudyGuideSection({ title, items, color }) {
  return (
    <Card color={color}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={styles.body}>- {item}</Text>
      ))}
    </Card>
  );
}


function ModuleGuideSection({ title, items, color, formula }) {
  return (
    <Card color={color}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={formula ? styles.formulaText : styles.body}>- {item}</Text>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 22,
    paddingBottom: 60,
    maxWidth: 920,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "900",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "#e5e7eb",
    fontSize: 20,
    lineHeight: 32,
    marginBottom: 22,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#111827",
    borderWidth: 2,
    borderColor: "#64748b",
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900",
    marginBottom: 14,
  },
  body: {
    color: "#f8fafc",
    fontSize: 20,
    lineHeight: 34,
    marginBottom: 10,
    fontWeight: "700",
  },
  label: {
    color: "#fde047",
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  answer: {
    color: "#bbf7d0",
    fontSize: 22,
    lineHeight: 36,
    fontWeight: "900",
    marginBottom: 12,
  },
  trap: {
    color: "#fecdd3",
    fontSize: 21,
    lineHeight: 35,
    fontWeight: "900",
    marginBottom: 10,
  },
  memory: {
    color: "#f5d0fe",
    fontSize: 21,
    lineHeight: 35,
    fontWeight: "900",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#020617",
    color: "#ffffff",
    minHeight: 180,
    borderRadius: 18,
    padding: 18,
    fontSize: 20,
    lineHeight: 33,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#64748b",
    textAlignVertical: "top",
  },
  button: {
    paddingVertical: 17,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 13,
  },
  buttonText: {
    color: "#020617",
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  moduleButton: {
    backgroundColor: "#111827",
    borderWidth: 2,
    borderColor: "#60a5fa",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },
  moduleTitle: {
    color: "#ffffff",
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    marginBottom: 9,
  },
  chapterButton: {
    backgroundColor: "#111827",
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  chapterTitle: {
    color: "#ffffff",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    marginBottom: 9,
  },
  bigQuestion: {
    color: "#ffffff",
    fontSize: 31,
    lineHeight: 43,
    fontWeight: "900",
    marginBottom: 20,
  },
  choice: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#64748b",
  },
  choiceText: {
    color: "#ffffff",
    fontSize: 21,
    lineHeight: 30,
    fontWeight: "900",
  },
  formulaLine: {
    borderTopWidth: 2,
    borderTopColor: "#475569",
    paddingTop: 16,
    marginTop: 16,
  },
});
