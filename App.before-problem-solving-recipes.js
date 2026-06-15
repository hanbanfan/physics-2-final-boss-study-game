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
    formula: "Q=Ne, F=kq₁q₂/r²",
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
    formula: "E=F/q, E=k|q|/r²",
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
    formula: "Φ=EAcosθ, Φ=qenc/ε₀",
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
      formula: "v = √(T/μ)",
      clues: "string, tension, linear density, mass per length, wave speed",
      example:
        "If the same string changes speed, use T₂ = T₁(v₂/v₁)² because speed depends on the square root of tension.",
      trap:
        "Do not forget to square the speed ratio when solving for new tension.",
      memory: "Tighter string = faster wave. Heavier string = slower wave.",
      check: "If tension increases and μ stays the same, does wave speed increase or decrease?",
      checkAnswer: "Increase.",
    },
    {
      name: "Sinusoidal Wave Equation",
      explain:
        "The wave equation tells you the displacement of the wave at any position x and time t.",
      formula: "y(x,t)=A sin(kx−ωt+φ)",
      clues: "amplitude, k, omega, phase, wavelength, frequency",
      example:
        "A is height, k is spatial frequency, ω is time frequency, and φ shifts the wave.",
      trap:
        "k belongs to position. ω belongs to time.",
      memory: "A = height. k = space. omega = time. phi = shift.",
      check: "What formula connects k and wavelength?",
      checkAnswer: "k = 2π/λ.",
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
      formula: "I = P/(4πr²)",
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
        "If 2.0×10¹⁰ electrons are added, Q=(2.0×10¹⁰)(−1.60×10⁻¹⁹ C)=−3.2×10⁻⁹ C.",
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
      formula: "F = k|q₁q₂|/r²",
      clues: "two charges, separated by distance, electric force, magnitude",
      example:
        "Two + charges repel. A + and − charge attract.",
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
      formula: "F⃗net = F⃗1 + F⃗2 + ...",
      clues: "i, j, k, particle at origin, q0, q1, components",
      example:
        "A positive charge above another positive charge pushes it downward, so the force is in the −j direction.",
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
      formula: "E = k|q|/r²",
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
      formula: "E⃗net = E⃗1 + E⃗2 + ...",
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
      formula: "Φ = EAcosθ",
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
      formula: "Φ = qenc/ε₀",
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
      formula: "I=ΔQ/Δt, V=IR",
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
      formula: "F = qvBsinθ",
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
      formula: "ε = −NΔΦB/Δt",
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
        "Light is an electromagnetic wave. In vacuum, it travels at c = 3.00×10⁸ m/s.",
      formula: "c = fλ",
      clues: "light, frequency, wavelength, nm, speed of light",
      example:
        "Blue light has shorter wavelength and higher frequency than red light.",
      trap:
        "Convert nanometers to meters before calculating frequency.",
      memory: "Short wavelength means high frequency.",
      check: "What formula connects light speed, frequency, and wavelength?",
      checkAnswer: "c = fλ.",
    },
    {
      name: "Index of Refraction",
      explain:
        "Index of refraction tells how much light slows in a material.",
      formula: "n = λvacuum/λmaterial",
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
      "Phi = qenc/epsilon0",
      "Ewire = 2*k*lambda*L/(d*sqrt(d^2+L^2))",
      "Ering = k*q*z/((z^2+a^2)*sqrt(z^2+a^2))",
      "Q = epsilon0*A*E",
    ],
    clueWords: [
      "flux, area, angle -> Phi=EAcos(theta)",
      "closed surface, enclosed charge -> Gauss's Law",
      "wire, midpoint, linear charge density -> finite wire field",
      "ring, z-axis, radius a -> charged ring field",
      "parallel plates and field given -> Q=epsilon0AE",
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
      "field inside plates and charge -> Q=epsilon0AE",
    ],
    traps: [
      "Capacitance is not charge.",
      "Convert cm and mm to meters.",
      "Use radius, not diameter, for circular plate area.",
    ],
    examMoves: [
      "Identify whether the problem gives voltage, field, area, or spacing.",
      "Choose Q=CV or Q=epsilon0AE accordingly.",
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
      "ohm, resistance, voltage -> V=IR",
      "power, watts -> P=IV",
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
      "Use V=IR after finding equivalent resistance.",
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

const MEMORY_CARDS = Object.entries(LESSONS).flatMap(([chapter, lessons]) =>
  lessons.map((lesson) => ({
    chapter: Number(chapter),
    front: lesson.check,
    back: lesson.checkAnswer,
  }))
);

const BOSS_QUESTIONS = [
  {
    module: 1,
    q: "2.0×10¹⁰ electrons are added. What is Q?",
    choices: ["−3.2×10⁻⁹ C", "+3.2×10⁻⁹ C", "−3.2×10⁹ C", "0 C"],
    a: "−3.2×10⁻⁹ C",
    teach: "Q=N(-e). Added electrons make the charge negative.",
  },
  {
    module: 1,
    q: "String wave speed uses:",
    choices: ["v=√(T/μ)", "V=IR", "E=kq/r²", "Φ=EAcosθ"],
    a: "v=√(T/μ)",
    teach: "String wave speed depends on tension and linear density.",
  },
  {
    module: 1,
    q: "Electric field from a negative charge points:",
    choices: ["Toward it", "Away from it", "In circles", "Nowhere"],
    a: "Toward it",
    teach: "Field direction is where a positive test charge would go.",
  },
  {
    module: 1,
    q: "Gauss's Law cares about:",
    choices: ["Enclosed charge", "Outside charge only", "Mass", "Color"],
    a: "Enclosed charge",
    teach: "Net flux through a closed surface equals qenc/ε₀.",
  },
  {
    module: 2,
    q: "Voltage means:",
    choices: ["Energy per charge", "Charge per second", "Force per meter", "Magnetic field"],
    a: "Energy per charge",
    teach: "V=U/q.",
  },
  {
    module: 2,
    q: "Ohm's Law is:",
    choices: ["V=IR", "F=ma", "c=fλ", "Q=Ne"],
    a: "V=IR",
    teach: "Voltage, current, and resistance are connected by V=IR.",
  },
  {
    module: 3,
    q: "Magnetic force requires:",
    choices: ["Moving charge", "Stationary charge", "No field", "No velocity"],
    a: "Moving charge",
    teach: "F=qvBsinθ, so v matters.",
  },
  {
    module: 3,
    q: "Faraday's Law is about:",
    choices: ["Changing magnetic flux", "Static charge", "Sound", "Friction"],
    a: "Changing magnetic flux",
    teach: "Changing flux induces emf.",
  },
  {
    module: 4,
    q: "First move on a hard problem:",
    choices: ["Circle clue words", "Guess", "Ignore units", "Panic"],
    a: "Circle clue words",
    teach: "Clue words identify the model.",
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

  if (hasAny(lower, ["electrons are added", "excess electrons", "number of electrons"])) {
    const N = sci[0] || numsBefore(text, "electrons")[0];
    let answer = "Need number of electrons.";
    if (N) {
      const Q = -N * E_CHARGE;
      answer = `Q=N(-e)\nQ=(${N.toExponential(3)})(−1.60×10⁻¹⁹ C)\nQ=${Q.toExponential(3)} C\n\nFinal Answer: ${Q.toExponential(2)} C`;
    }
    return makeResult({
      topic: "Ch. 22 — Charge from Electrons",
      givens,
      unknown: "Net charge Q",
      formula: "Q=N(-e)",
      steps: "Electrons are negative. Multiply number of added electrons by −1.60×10⁻¹⁹ C.",
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
      answer = `T₂=T₁(v₂/v₁)²\nT₂=${T1}(${v2}/${v1})²\nT₂=${nice(T2)} N\n\nFinal Answer: ${nice(T2)} N`;
    }

    return makeResult({
      topic: "Ch. 16 — String Wave Speed",
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
      topic: "Ch. 31 — Light and Refraction",
      givens,
      unknown: "Frequency or index",
      formula: "c=fλ, n=λvacuum/λmaterial",
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
        formula: "F=kq₀q₃/r²",
        steps: "Particle 3 at (0,d₂,d₂), so r=√2d₂. Repulsion points −j and −k equally.",
        answer: "i: 0\nj: −k*q_0*q_3/(2*sqrt(2)*d_2^2)\nk: −k*q_0*q_3/(2*sqrt(2)*d_2^2)",
        trap: "The component split adds √2.",
        memory: "Equal y and z means equal j and k.",
      });
    }

    if (hasAny(lower, ["ratio", "no net force", "balance", "d_1 divided by d_2"])) {
      return makeResult({
        topic: "Ch. 22 — Balance Coulomb Forces",
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
        topic: "Ch. 22 — Net Coulomb Force",
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
      topic: "Ch. 22 — Coulomb Vector",
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
      topic: "Ch. 23 — Electric Field of Point Charge",
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
      topic: "Ch. 24 — Finite Charged Wire",
      givens,
      unknown: "Direction or magnitude",
      formula: "E=2kλL/(d√(d²+L²))",
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
      formula: "E(z)=kqz/(z²+a²)^(3/2)",
      steps: "Symmetry cancels x/y. Only z survives. Use safe denominator if Mastering rejects fractional power.",
      answer: "Direction: parallel to z-axis\nE(z)=k*q*z/((z^2+a^2)*sqrt(z^2+a^2))\nω=sqrt(k*q*q_0/(m*a^3))",
      trap: "Mastering may reject ^(3/2).",
      memory: "Ring axis: only z lives.",
    });
  }

  if (hasAny(lower, ["parallel-plate capacitor", "diameter electrodes", "charge on each electrode"])) {
    return makeResult({
      topic: "Ch. 26 — Parallel-Plate Charge",
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
      topic: "Ch. 23/24 — Proton Between Plates",
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
      topic: "Ch. 24 — Flux and Gauss's Law",
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
      formula: "V=IR, P=IV, series add, parallel reciprocals",
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
      formula: "F=qvBsinθ",
      steps: "Charge must be moving. Force is max at 90° and zero at 0°.",
      answer: "Use F=qvBsinθ.",
      trap: "Stationary charge has no magnetic force.",
      memory: "Magnetism needs motion.",
    });
  }

  if (hasAny(lower, ["induction", "emf", "faraday", "lenz", "magnetic flux"])) {
    return makeResult({
      topic: "Ch. 30 — Induction",
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
        <Button title="Module Boss Game" onPress={() => setScreen("moduleBoss")} color={COLORS.red} />
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
          <Text style={styles.label}>Round {bossIndex + 1}</Text>
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

          <Button title="Next Boss Round" onPress={() => { setBossMessage(""); setBossIndex((i) => i + 1); }} color={COLORS.red} />
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
                setScreen("chapterFlashcards");
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

        <Button title="Chapter Flashcards" onPress={() => { setCardIndex(0); setShowAnswer(false); setScreen("chapterFlashcards"); }} color={COLORS.yellow} />
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
