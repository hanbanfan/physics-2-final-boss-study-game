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

const LESSON_MEMORY_CARDS = Object.entries(LESSONS).flatMap(([chapter, lessons]) =>
  lessons.map((lesson) => ({
    chapter: Number(chapter),
    front: lesson.check,
    back: lesson.checkAnswer,
  }))
);

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

const BOSS_QUESTIONS = uniqueByKey(
  RAW_BOSS_QUESTIONS,
  (q) => `${q.module}-${q.chapter}-${q.q.trim().toLowerCase()}`
);

function solveHomework(text) {
  const lower = normalize(text);
  const sci = allScientific(text);
  const givens = [...sci.map((n) => n.toExponential(3)), ...allNumbers(text)];

  if (!text.trim()) {
    return makeResult({
      topic: "Paste Any Homework Question",
      givens: [],
      unknown: "Whatever the question asks for",
      formula: "The app chooses from clue words.",
      steps: "Paste the full problem with units and answer choices.",
      answer: "Waiting for homework.",
      trap: "Do not paste only numbers. The words identify the model.",
      memory: "Before solving, guess the chapter.",
    });
  }

  const K = 8.99e9;
  const E_CHARGE = 1.60e-19;

  if (hasAny(lower, ["atomic structure", "protons", "electrons", "neutrons", "valence electrons"])) {
    return makeResult({
      topic: "Ch. 22 — Atomic Structure and Electric Charge",
      givens,
      unknown: "Charge concept or net charge",
      formula: "net charge = positive charge - negative charge",
      steps: "Protons are positive, electrons are negative, neutrons are neutral. If electrons outnumber protons, the object is negative. If protons outnumber electrons, it is positive.",
      answer: "Atoms are neutral when protons and electrons balance. Charge changes mainly because electrons move.",
      trap: "Neutrons do not count toward electric charge.",
      memory: "Protons plus, electrons minus, neutrons neutral.",
    });
  }

  if (hasAny(lower, ["conductivity", "resistivity", "valence", "free electrons", "rubber", "gold", "metal conductor"])) {
    return makeResult({
      topic: "Ch. 22/27 — Conductivity and Resistivity",
      givens,
      unknown: "Whether material conducts or resists current",
      formula: "more free electrons -> higher conductivity",
      steps: "Check whether electrons are free to move. Metals usually conduct well. Rubber/plastic usually insulate. Resistivity is like a clog that makes current harder.",
      answer: "Conductors have mobile electrons. Insulators have tightly bound electrons. Higher resistivity means less current flow.",
      trap: "Do not assume valence electron count alone decides everything; mobility matters most.",
      memory: "Conductor = charge cruises. Resistivity = clogged hose.",
    });
  }

  if (hasAny(lower, ["dipole", "dipole moment", "torque", "alignment"])) {
    return makeResult({
      topic: "Ch. 23 — Dipoles and Polarization",
      givens,
      unknown: "Dipole behavior in an electric field",
      formula: "dipole = equal and opposite charges separated by distance",
      steps: "A dipole has a positive end and a negative end. In an external electric field, the two ends feel forces in opposite directions, creating torque and alignment.",
      answer: "Dipoles tend to align with external electric fields.",
      trap: "A dipole can have zero net charge but still interact with fields.",
      memory: "Dipole = tiny plus-minus arrow.",
    });
  }


  if (hasAny(lower, ["electrons are added", "excess electrons", "number of electrons"])) {
    const N = sci[0] || numsBefore(text, "electrons")[0];
    let answer = "Need number of electrons.";
    if (N) {
      const Q = -N * E_CHARGE;
      answer = `Q=N(-e)\nQ=(${N.toExponential(3)})(-1.60x10^-19 C)\nQ=${Q.toExponential(3)} C\n\nFinal Answer: ${Q.toExponential(2)} C`;
    }
    return makeResult({
      topic: "Ch. 22 — Charge from Electrons",
      givens,
      unknown: "Net charge Q",
      formula: "Q=N(-e)",
      steps: "Electrons are negative. Multiply number of added electrons by -1.60x10^-19 C.",
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
      answer = `T_2=T_1(v_2/v_1)²\nT_2=${T1}(${v2}/${v1})²\nT_2=${nice(T2)} N\n\nFinal Answer: ${nice(T2)} N`;
    }

    return makeResult({
      topic: "Ch. 16 — String Wave Speed",
      givens,
      unknown: "New tension T_2",
      formula: "v = sqrt(T/mu), so T_2=T_1(v_2/v_1)²",
      steps: "Same string means mu is constant. Since v depends on √T, tension depends on speed squared.",
      answer,
      trap: "Square the speed ratio.",
      memory: "String tension problems use v squared.",
    });
  }

  if (hasAny(lower, ["transverse", "longitudinal"])) {
    return makeResult({
      topic: "Ch. 16 — Wave Types",
      givens,
      unknown: "Wave type",
      formula: "Transverse=perpendicular, longitudinal=parallel",
      steps: "Ask how the medium moves compared with the wave direction.",
      answer: "Transverse: perpendicular. Longitudinal: parallel. Sound in air is longitudinal.",
      trap: "Do not confuse wave direction with particle motion.",
      memory: "Transverse turns sideways; longitudinal lines up.",
    });
  }

  if (hasAny(lower, ["doppler", "ambulance", "siren", "blue shift", "red shift"])) {
    return makeResult({
      topic: "Ch. 16 — Doppler Effect",
      givens,
      unknown: "Observed frequency",
      formula: "Moving together → higher f. Moving apart → lower f.",
      steps: "Predict whether the observed frequency should go up or down before choosing signs.",
      answer: "Toward = higher pitch/frequency. Away = lower pitch/frequency.",
      trap: "Do not memorize signs blindly.",
      memory: "Toward = tighter waves = higher frequency.",
    });
  }

  if (hasAny(lower, ["light", "wavelength", "nm", "index of refraction"])) {
    const nm = numsBefore(text, "nm\\b");
    let answer = "Use f=c/lambda and convert nm to m.";

    if (lower.includes("450") && lower.includes("650")) {
      answer =
        `Blue: f=${(3e8 / 450e-9).toExponential(3)} Hz\n` +
        `Red: f=${(3e8 / 650e-9).toExponential(3)} Hz\n` +
        `Index: n=650/450=${nice(650 / 450)}`;
    } else if (nm[0]) {
      answer = `lambda=${nm[0]} nm = ${nm[0]}x10^-9 m\nf=c/lambda=${(3e8 / (nm[0] * 1e-9)).toExponential(3)} Hz`;
    }

    return makeResult({
      topic: "Ch. 31 — Light and Refraction",
      givens,
      unknown: "Frequency or index",
      formula: "c=flambda, n=lambdavacuum/lambdamaterial",
      steps: "Convert nm to m. Frequency stays constant when light enters a material.",
      answer,
      trap: "Nanometers must become meters.",
      memory: "Refraction changes speed and wavelength, not frequency.",
    });
  }

  if (hasAny(lower, ["plastic balls", "copper ball", "test charge", "weakly attracted", "strongly attracted", "strongly repelled"])) {
    return makeResult({
      topic: "Ch. 23 — Polarization",
      givens,
      unknown: "Attraction, repulsion, or neither",
      formula: "Like repel, opposites attract, neutral objects polarize.",
      steps: "Use the positive test charge to infer signs. Weak attraction usually means neutral insulator. Strong neutral attraction usually means conductor.",
      answer: "A negative plastic, B positive plastic, C neutral plastic, D neutral copper. A-B attractive, A-C weak attractive, A-D attractive, C-D neither.",
      trap: "Neutral can still attract.",
      memory: "Conductors polarize strongly; insulators weakly.",
    });
  }

  if (hasAny(lower, ["rod", "end a", "end b", "negative charge", "many contacts", "several contacts"])) {
    return makeResult({
      topic: "Ch. 23 — Conductors vs Insulators",
      givens,
      unknown: "Charge distribution or force",
      formula: "Conductor spreads charge; insulator traps charge.",
      steps: "First approach polarizes. Contact transfers electrons. Conductors spread charge. Insulators keep it local.",
      answer: "Plastic: negative charge stays near end A. Conductor: negative charge spreads across both ends. Negative ball later gets repelled by negative charged ends.",
      trap: "Identify conductor vs insulator first.",
      memory: "Conductor = charge cruises. Insulator = charge stuck.",
    });
  }

  if (hasAny(lower, ["particle 0", "q_0", "d_1"])) {
    if (hasAny(lower, ["particle 3", "q_3", "d_2, d_2"])) {
      return makeResult({
        topic: "Ch. 22 — 3D Coulomb Vector",
        givens,
        unknown: "i, j, k components",
        formula: "F=kq_0q_3/r^2",
        steps: "Particle 3 at (0,d_2,d_2), so r=√2d_2. Repulsion points -j and -k equally.",
        answer: "i: 0\nj: -k*q_0*q_3/(2*sqrt(2)*d_2^2)\nk: -k*q_0*q_3/(2*sqrt(2)*d_2^2)",
        trap: "The component split adds √2.",
        memory: "Equal y and z means equal j and k.",
      });
    }

    if (hasAny(lower, ["ratio", "no net force", "balance", "d_1 divided by d_2"])) {
      return makeResult({
        topic: "Ch. 22 — Balance Coulomb Forces",
        givens,
        unknown: "d_1/d_2",
        formula: "kq_0q_1/d_1² = kq_0q_2/d_2²",
        steps: "Set magnitudes equal. Cancel k and q_0. Take square root.",
        answer: "d_1/d_2 = sqrt(q_1/q_2)",
        trap: "k and q_0 cancel.",
        memory: "Balance = set forces equal.",
      });
    }

    if (hasAny(lower, ["particle 2", "q_2", "negative q 2", "third"])) {
      return makeResult({
        topic: "Ch. 22 — Net Coulomb Force",
        givens,
        unknown: "i, j, k components",
        formula: "Superposition",
        steps: "Positive q1 above q0 repels downward. Negative q2 above q0 attracts upward.",
        answer: "i: 0\nj: -k*q_0*q_1/d_1^2 + k*q_0*q_2/d_2^2\nk: 0",
        trap: "Direction gives the sign.",
        memory: "Like repel away; opposites pull toward.",
      });
    }

    return makeResult({
      topic: "Ch. 22 — Coulomb Vector",
      givens,
      unknown: "i, j, k components",
      formula: "F=kq_0q_1/r^2",
      steps: "Positive q1 above positive q0 repels q0 downward.",
      answer: "i: 0\nj: -k*q_0*q_1/d_1^2\nk: 0",
      trap: "Direction matters.",
      memory: "Charge above pushes same-sign origin charge down.",
    });
  }

  if (hasAny(lower, ["electric field", "plastic bead", "charged to", "nc", "cm from"])) {
    const qNc = numsBefore(text, "nc")[0];
    const cm = numsBefore(text, "cm")[0];
    let answer = "Use E=k|q|/r^2.";
    if (qNc && cm) {
      const q = Math.abs(qNc) * 1e-9;
      const r = cm / 100;
      const E = K * q / (r * r);
      const direction = hasAny(lower, ["minus", "-"]) ? "toward the bead" : "away from the bead";
      answer = `E=${E.toExponential(3)} N/C\nDirection: ${direction}`;
    }
    return makeResult({
      topic: "Ch. 23 — Electric Field of Point Charge",
      givens,
      unknown: "Field strength or direction",
      formula: "E=k|q|/r^2",
      steps: "Convert nC to C and cm to m.",
      answer,
      trap: "Field points toward negative and away from positive.",
      memory: "Positive pushes out; negative pulls in.",
    });
  }

  if (hasAny(lower, ["finite charged wire", "wire of length", "linear charge density", "point p"])) {
    return makeResult({
      topic: "Ch. 24 — Finite Charged Wire",
      givens,
      unknown: "Direction or magnitude",
      formula: "E=2klambdaL/(d√(d^2+L²))",
      steps: "Symmetry cancels x-components. y-components add.",
      answer: "Direction: +j\nMagnitude: 2*k*lambda*L/(d*sqrt(d^2+L^2))",
      trap: "Do not include x-components.",
      memory: "Symmetry kills sideways.",
    });
  }

  if (hasAny(lower, ["uniformly charged ring", "ring in the xy", "z axis", "radius a"])) {
    return makeResult({
      topic: "Ch. 24 — Charged Ring Field",
      givens,
      unknown: "Field, direction, or SHM",
      formula: "E(z)=kqz/(z^2+a²)^(3/2)",
      steps: "Symmetry cancels x/y. Only z survives. Use safe denominator if Mastering rejects fractional power.",
      answer: "Direction: parallel to z-axis\nE(z)=k*q*z/((z^2+a^2)*sqrt(z^2+a^2))\nomega=sqrt(k*q*q_0/(m*a^3))",
      trap: "Mastering may reject ^(3/2).",
      memory: "Ring axis: only z lives.",
    });
  }

  if (hasAny(lower, ["parallel-plate capacitor", "diameter electrodes", "charge on each electrode"])) {
    return makeResult({
      topic: "Ch. 26 — Parallel-Plate Charge",
      givens,
      unknown: "Charge Q",
      formula: "Q=epsilon_0AE",
      steps: "Find plate area A=pir^2. Use Q=epsilon_0AE.",
      answer: "For 6.0 cm diameter and E=6.0x10⁶ N/C: Q=150 nC.",
      trap: "Spacing is not needed if E is given.",
      memory: "Plate charge = epsilon area field.",
    });
  }

  if (hasAny(lower, ["proton", "oppositely charged parallel plates", "released from rest", "strikes"])) {
    return makeResult({
      topic: "Ch. 23/24 — Proton Between Plates",
      givens,
      unknown: "Electric field or final speed",
      formula: "d=½at², E=ma/q, v=at",
      steps: "Use kinematics first to find acceleration. Then use electric force.",
      answer: "For d=1.50 cm and t=1.46x10⁻⁶ s: E=147 N/C, v=2.05x10⁴ m/s.",
      trap: "Watch powers of ten.",
      memory: "Motion first, field second.",
    });
  }

  if (hasAny(lower, ["flux", "gauss", "enclosed charge", "closed surface"])) {
    return makeResult({
      topic: "Ch. 24 — Flux and Gauss's Law",
      givens,
      unknown: "Flux, field, or enclosed charge",
      formula: "Phi=EAcostheta and Phi=qenc/epsilon_0",
      steps: "Flat surface uses EAcostheta. Closed surface uses enclosed charge.",
      answer: "Only enclosed charge controls net flux.",
      trap: "Outside charges do not change net flux.",
      memory: "Gauss cares what is inside the bubble.",
    });
  }

  if (hasAny(lower, ["voltage", "potential", "potential energy", "volt"])) {
    return makeResult({
      topic: "Ch. 25 — Electric Potential",
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
      topic: "Ch. 26 — Capacitance",
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
      topic: "Ch. 27/28 — Circuits",
      givens,
      unknown: "V, I, R, P, or equivalent resistance",
      formula: "V = I*R, P = I*V, series add, parallel reciprocals",
      steps: "Identify series vs parallel first. Then use Ohm's Law.",
      answer: "Series: same current, resistors add. Parallel: same voltage, reciprocals.",
      trap: "Do not add parallel resistors directly.",
      memory: "Series same current. Parallel same voltage.",
    });
  }

  if (hasAny(lower, ["magnetic", "tesla", "moving charge", "b field"])) {
    return makeResult({
      topic: "Ch. 29 — Magnetic Force",
      givens,
      unknown: "Magnetic force",
      formula: "F=qvBsintheta",
      steps: "Charge must be moving. Force is max at 90° and zero at 0°.",
      answer: "Use F=qvBsintheta.",
      trap: "Stationary charge has no magnetic force.",
      memory: "Magnetism needs motion.",
    });
  }

  if (hasAny(lower, ["induction", "emf", "faraday", "lenz", "magnetic flux"])) {
    return makeResult({
      topic: "Ch. 30 — Induction",
      givens,
      unknown: "Induced emf",
      formula: "ε=-NΔPhiB/Δt",
      steps: "Changing magnetic flux creates emf. Lenz gives direction.",
      answer: "Use |ε|=NΔPhiB/Δt for magnitude.",
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
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [bossIndex, setBossIndex] = useState(0);
  const [bossMessage, setBossMessage] = useState("");

  const solved = useMemo(() => solveHomework(problem), [problem]);

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

        <Button title="Paste Homework Solver" onPress={() => setScreen("solver")} color={COLORS.green} />
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
              <Text style={styles.answer}>{ch.formula}</Text>
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
          <Text style={styles.answer}>{selectedChapter.formula}</Text>

          <Text style={styles.label}>You need to know</Text>
          {selectedChapter.goals.map((g) => (
            <Text key={g} style={styles.body}>- {g}</Text>
          ))}
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
        <Text style={styles.subtitle}>Paste the full problem. The solver explains the model, formula, trap, and memory hook.</Text>

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
        <Text style={styles.subtitle}>Say the answer out loud before pressing show.</Text>

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
              <Text style={styles.answer}>{ch.formula}</Text>
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
          Ch. {selectedChapter.id} only. Say the answer out loud before pressing show.
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

function LessonCard({ lesson, chapter }) {
  return (
    <Card color={chapter?.color || COLORS.green}>
      <Text style={styles.label}>{chapter?.title}</Text>
      <Text style={styles.sectionTitle}>{lesson.name}</Text>

      <Text style={styles.label}>Plain-English Meaning</Text>
      <Text style={styles.body}>{lesson.explain}</Text>

      <Text style={styles.label}>Formula / Rule</Text>
      <Text style={styles.answer}>{lesson.formula}</Text>

      <Text style={styles.label}>Clue Words</Text>
      <Text style={styles.body}>{lesson.clues}</Text>

      <Text style={styles.label}>Example</Text>
      <Text style={styles.body}>{lesson.example}</Text>

      <Text style={styles.label}>Common Trap</Text>
      <Text style={styles.trap}>{lesson.trap}</Text>

      <Text style={styles.label}>Memory Hook</Text>
      <Text style={styles.memory}>{lesson.memory}</Text>

      <Text style={styles.label}>Mini Check</Text>
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
    fontSize: 24,
    lineHeight: 32,
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
