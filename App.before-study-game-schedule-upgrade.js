import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";



const STUDY_CHAPTERS = [
  {
    number: 16,
    title: "Traveling Waves",
    formula: "v = fλ, f = 1/T, v = √(T/μ), Δφ = (2π/λ)Δr",
    objective: "Be able to identify wave variables, solve wave-speed problems, solve string-tension wave problems, and handle phase-position questions.",
    guide: [
      "QUIZ CLUES: wave, frequency, wavelength, period, speed, string, tension, phase, spherical wave, r position.",
      "If the problem gives frequency and wavelength, use v = fλ.",
      "If the problem gives period, use f = 1/T.",
      "If the problem says string and tension, use v = √(T/μ). For the same string, μ is constant, so T₂ = T₁(v₂/v₁)².",
      "If the problem asks phase at a different position, use k = 2π/λ and phase change with distance.",
      "For a spherical wave, do not automatically use speed. If it gives wavelength and position, it is probably a phase problem.",
      "Teacher is testing whether you can identify which wave formula matches the wording.",
      "Homework move: write GIVEN → UNKNOWN → FORMULA → REARRANGE → SUBSTITUTE → SOLUTION.",
    ],
    traps: [
      "Amplitude is vertical height. Wavelength is horizontal cycle length.",
      "Frequency and period are reciprocals.",
      "Tension problems use speed squared, not direct speed ratio.",
      "Phase answers are in radians.",
      "Wave speed on a string depends on tension and linear density, not amplitude.",
    ],
    clips: [
      ["🌊", "Wave Motion", "String particles wiggle up/down.", "Energy travels forward.", "Waves carry energy, not matter across the room."],
      ["📏", "Wavelength", "Crest to crest is one full cycle.", "That distance is λ.", "λ is horizontal length."],
      ["⏱️", "Frequency", "More cycles each second.", "Higher f.", "Frequency is cycles per second."],
      ["🪢", "String Tension", "Tighter string.", "Faster wave.", "Same string means T ∝ v²."],
      ["🌀", "Phase", "Where are you in the cycle?", "Position changes phase.", "Use Δφ = (2π/λ)Δr."],
    ],
    cards: [
      ["What formula connects wave speed, frequency, and wavelength?", "v = fλ"],
      ["What is frequency?", "Cycles per second."],
      ["What is period?", "Time for one cycle."],
      ["How are frequency and period related?", "f = 1/T and T = 1/f."],
      ["What is wavelength?", "Distance for one full cycle, usually crest to crest."],
      ["What does amplitude measure?", "Maximum displacement from equilibrium."],
      ["Wave speed on a string formula?", "v = √(T/μ)."],
      ["For the same string, what stays constant?", "μ, the linear mass density."],
      ["For the same string, how does tension relate to speed?", "T ∝ v²."],
      ["String tension shortcut?", "T₂ = T₁(v₂/v₁)²."],
      ["What is phase measured in?", "Radians."],
      ["What is wave number k?", "k = 2π/λ."],
      ["Phase-position clue words?", "phase, wavelength, r equals, radians."],
      ["Big trap in phase problems?", "Using v = fλ when the problem is actually asking about phase."],
      ["Given f = 5 Hz and λ = 3 m, what is v?", "v = 15 m/s."],
    ],
  },
  {
    number: 22,
    title: "Electric Charges and Coulomb's Law",
    formula: "F = kq₁q₂/r²",
    objective: "Predict attraction/repulsion and calculate electric force between point charges.",
    guide: [
      "QUIZ CLUES: charge, q, coulomb, repel, attract, distance, separated, electric force.",
      "Same signs repel. Opposite signs attract.",
      "Use F = kq₁q₂/r² for force between two point charges.",
      "Use k = 9.0 × 10⁹ N·m²/C² unless your teacher gives another value.",
      "Distance r is measured between the charges and must be squared.",
      "If the problem asks direction, solve magnitude first, then decide attract/repel.",
      "Teacher is testing inverse-square thinking: double r means force becomes one-fourth.",
    ],
    traps: [
      "Forgetting to square r.",
      "Confusing charge sign with force magnitude.",
      "Using diameter/radius incorrectly if a diagram appears.",
      "Forgetting that microcoulombs must convert to C if used.",
    ],
    clips: [
      ["➕➕", "Repulsion", "Same signs face each other.", "Forces point apart.", "Same charges repel."],
      ["➕➖", "Attraction", "Opposite signs face each other.", "Forces point together.", "Opposite charges attract."],
      ["📏", "Inverse Square", "Increase distance.", "Force shrinks fast.", "F depends on 1/r²."],
      ["🧮", "Coulomb Law", "Use q₁, q₂, and r.", "Square r.", "F = kq₁q₂/r²."],
    ],
    cards: [
      ["Same charges do what?", "Repel."],
      ["Opposite charges do what?", "Attract."],
      ["Coulomb's Law formula?", "F = kq₁q₂/r²."],
      ["What is k?", "9.0 × 10⁹ N·m²/C²."],
      ["If distance doubles, force becomes what?", "One-fourth as large."],
      ["If distance triples, force becomes what?", "One-ninth as large."],
      ["If one charge doubles, force does what?", "Doubles."],
      ["What unit is charge measured in?", "Coulombs, C."],
      ["What unit is electric force measured in?", "Newtons, N."],
      ["Do signs affect attraction/repulsion or magnitude?", "Signs affect direction; magnitude uses absolute values."],
      ["What does r mean?", "Distance between charges."],
      ["Quiz clue for Coulomb problem?", "Two charges separated by a distance."],
    ],
  },
  {
    number: 23,
    title: "Electric Field",
    formula: "E = F/q and F = qE",
    objective: "Understand electric field as force per charge and solve for E, F, or q.",
    guide: [
      "QUIZ CLUES: electric field, field strength, force per charge, test charge, N/C.",
      "Electric field tells what force a positive test charge would feel.",
      "Use E = F/q when force and charge are given.",
      "Use F = qE when charge and field are given.",
      "Positive charges feel force in the direction of E.",
      "Negative charges feel force opposite the direction of E.",
      "Teacher is testing whether you can separate field from force.",
    ],
    traps: [
      "Electric field is not the same as electric force.",
      "Direction flips for negative charges.",
      "Units can be N/C or V/m.",
    ],
    clips: [
      ["👻", "Field Map", "A source charge creates arrows.", "A test charge follows the arrows.", "Field means force per charge."],
      ["💪", "Force Per Charge", "Same field, bigger charge.", "Bigger force.", "F = qE."],
      ["➕➖", "Direction", "Positive follows E.", "Negative goes opposite.", "Charge sign matters."],
    ],
    cards: [
      ["What is electric field?", "Force per charge."],
      ["Electric field formula?", "E = F/q."],
      ["Force from field formula?", "F = qE."],
      ["Units of electric field?", "N/C or V/m."],
      ["Which charge defines field direction?", "Positive test charge."],
      ["A negative charge in an electric field moves which way?", "Opposite the field direction."],
      ["If F = 12 N and q = 4 C, what is E?", "3 N/C."],
      ["If E doubles and q stays same, F does what?", "Doubles."],
      ["Quiz clue for electric field?", "Force per charge or N/C."],
      ["Big trap?", "Mixing up E and F."],
    ],
  },
  {
    number: 24,
    title: "Electric Flux and Gauss's Law",
    formula: "ΦE = EAcosθ and ΦE = q_enc/ε₀",
    objective: "Calculate electric flux and understand how enclosed charge controls total flux through a closed surface.",
    guide: [
      "QUIZ CLUES: flux, surface, area, angle, enclosed charge, closed surface, Gaussian surface.",
      "Flux means electric field passing through an area.",
      "Use ΦE = EAcosθ when E, A, and angle are given.",
      "Use Gauss's Law when it says closed surface or enclosed charge.",
      "cos(0°)=1 means maximum flux.",
      "cos(90°)=0 means no flux through the surface.",
      "For closed surfaces, charge outside does not affect total flux.",
      "Teacher is testing whether you understand perpendicular field through area.",
    ],
    traps: [
      "Using sinθ instead of cosθ.",
      "Counting charge outside the Gaussian surface.",
      "Forgetting that flux can be positive, negative, or zero.",
      "Confusing electric field with electric flux.",
    ],
    clips: [
      ["➡️", "Flux", "Field arrows pass through surface.", "More arrows = more flux.", "Flux is field through area."],
      ["📐", "Angle", "Field straight through surface.", "Maximum flux.", "Use cosθ."],
      ["🧊", "Gauss Surface", "Closed imaginary bubble.", "Only enclosed charge matters.", "ΦE = q_enc/ε₀."],
    ],
    cards: [
      ["What does flux measure?", "Electric field through an area."],
      ["Flux formula with area?", "ΦE = EAcosθ."],
      ["Gauss's Law?", "ΦE = q_enc/ε₀."],
      ["When is flux maximum?", "θ = 0°."],
      ["When is flux zero?", "θ = 90°."],
      ["What charge matters for total closed-surface flux?", "Enclosed charge."],
      ["Does outside charge affect total flux through a closed surface?", "No."],
      ["Flux units?", "N·m²/C."],
      ["Quiz clue for Gauss's Law?", "Closed surface or enclosed charge."],
      ["Big trap?", "Forgetting cosθ."],
    ],
  },
  {
    number: 25,
    title: "Electric Potential",
    formula: "V = U/q, ΔU = qΔV",
    objective: "Understand voltage as energy per charge and solve electric potential problems.",
    guide: [
      "QUIZ CLUES: voltage, potential, volts, potential energy, energy per charge.",
      "Voltage means electric potential energy per charge.",
      "Use V = U/q.",
      "Use U = qV when solving for energy.",
      "Electric potential is scalar, not vector.",
      "Electric field points from high potential to low potential for positive charges.",
      "Teacher is testing whether you know voltage is not the same as field.",
    ],
    traps: [
      "Confusing voltage with electric field.",
      "Forgetting q when converting between U and V.",
      "Thinking potential has direction. It does not.",
    ],
    clips: [
      ["🔋", "Voltage", "Charge has energy.", "Energy divided by charge.", "Voltage = energy per charge."],
      ["⛰️", "Potential Hill", "Higher voltage = higher electric hill.", "Charge gains or loses energy.", "ΔU = qΔV."],
    ],
    cards: [
      ["What is voltage?", "Energy per charge."],
      ["Electric potential formula?", "V = U/q."],
      ["Energy from voltage formula?", "U = qV."],
      ["Potential is scalar or vector?", "Scalar."],
      ["Voltage unit?", "Volt, V."],
      ["Energy unit?", "Joule, J."],
      ["Charge unit?", "Coulomb, C."],
      ["If q doubles at same V, U does what?", "Doubles."],
      ["Quiz clue for potential?", "Volts or energy per charge."],
      ["Big trap?", "Confusing V with E."],
    ],
  },
  {
    number: 26,
    title: "Capacitance",
    formula: "C = Q/ΔV, Q = CΔV",
    objective: "Understand capacitors, charge storage, voltage difference, and dielectric effects.",
    guide: [
      "QUIZ CLUES: capacitor, capacitance, charge stored, plates, voltage difference, dielectric, farad.",
      "Capacitance means charge stored per volt.",
      "Use C = Q/ΔV.",
      "Rearrange to Q = CΔV or ΔV = Q/C.",
      "A dielectric usually increases capacitance.",
      "Parallel plates store opposite charges on each plate.",
      "Teacher is testing whether you can distinguish C, Q, and ΔV.",
    ],
    traps: [
      "Capacitance is not the same thing as charge.",
      "Use ΔV, not random V unless it means voltage difference.",
      "Farad is a huge unit; microfarads may need conversion.",
    ],
    clips: [
      ["🥫", "Capacitor Plates", "Positive plate and negative plate.", "Charge is stored between them.", "Capacitors store charge and energy."],
      ["🔋", "Charge Per Volt", "More voltage stores more charge.", "More capacitance stores more charge.", "Q = CΔV."],
      ["🧈", "Dielectric", "Material placed between plates.", "Capacitance increases.", "Dielectrics help store charge."],
    ],
    cards: [
      ["Capacitance formula?", "C = Q/ΔV."],
      ["Charge stored formula?", "Q = CΔV."],
      ["Voltage formula from capacitance?", "ΔV = Q/C."],
      ["Unit of capacitance?", "Farad, F."],
      ["What does a capacitor store?", "Charge and energy."],
      ["What does dielectric usually do?", "Increases capacitance."],
      ["What is Q measured in?", "Coulombs."],
      ["What is ΔV measured in?", "Volts."],
      ["Quiz clue for capacitance?", "Capacitor, plates, farad, dielectric."],
      ["Big trap?", "Mixing up charge Q and capacitance C."],
    ],
  },
  {
    number: 27,
    title: "Current and Resistance",
    formula: "V = IR, I = V/R, R = V/I",
    objective: "Use Ohm's Law and understand current, voltage, and resistance.",
    guide: [
      "QUIZ CLUES: current, voltage, resistance, resistor, ohm, amps, battery.",
      "Voltage pushes charge through a circuit.",
      "Current is charge flow per time.",
      "Resistance opposes current.",
      "Use V = IR.",
      "If solving current, use I = V/R.",
      "If solving resistance, use R = V/I.",
      "Teacher is testing whether you can rearrange Ohm's Law.",
    ],
    traps: [
      "Current is not voltage.",
      "Resistance does not create current; voltage drives current.",
      "More resistance means less current if voltage stays same.",
    ],
    clips: [
      ["🔋", "Voltage Push", "Battery creates electric push.", "Charges start moving.", "Voltage drives current."],
      ["🚗", "Current Flow", "Charges move like traffic.", "More flow = more current.", "Current is amps."],
      ["🚧", "Resistance", "Narrow road slows traffic.", "Higher R lowers I.", "Ohm's Law: V = IR."],
    ],
    cards: [
      ["Ohm's Law?", "V = IR."],
      ["Current formula from Ohm's Law?", "I = V/R."],
      ["Resistance formula?", "R = V/I."],
      ["Voltage unit?", "Volt."],
      ["Current unit?", "Ampere."],
      ["Resistance unit?", "Ohm, Ω."],
      ["If V = 12 V and R = 4 Ω, what is I?", "3 A."],
      ["If resistance increases and voltage stays same, current does what?", "Decreases."],
      ["Quiz clue for Ohm's Law?", "Voltage, current, resistance."],
      ["Big trap?", "Not rearranging before plugging in."],
    ],
  },
  {
    number: 28,
    title: "Circuits and Electrical Power",
    formula: "P = IV, series: R_total = R₁+R₂, parallel: 1/R_total = 1/R₁+1/R₂",
    objective: "Analyze basic circuits using series/parallel rules, Kirchhoff ideas, and power formulas.",
    guide: [
      "QUIZ CLUES: series, parallel, circuit, resistor, junction, loop, power, watts.",
      "Series circuit: one path, same current, resistors add directly.",
      "Parallel circuit: multiple paths, same voltage, reciprocal resistance rule.",
      "Junction rule: current entering equals current leaving.",
      "Loop rule: voltage gains and drops add to zero.",
      "Power formula: P = IV.",
      "Also useful: P = I²R and P = V²/R when combining with Ohm's Law.",
      "Teacher is testing whether you can identify series vs parallel from wording/diagram.",
    ],
    traps: [
      "Series has same current, not same voltage.",
      "Parallel has same voltage, not same current.",
      "Parallel equivalent resistance is smaller than the smallest branch resistance.",
      "Do not add parallel resistors directly.",
    ],
    clips: [
      ["📏", "Series", "One path for current.", "Current same everywhere.", "R_total adds directly."],
      ["🌀", "Parallel", "Multiple current paths.", "Voltage same across branches.", "Use reciprocal rule."],
      ["🚦", "Junction", "Current enters a split.", "Current leaves through branches.", "Current in = current out."],
      ["⚡", "Power", "Circuit uses energy over time.", "P = IV.", "Power is watts."],
    ],
    cards: [
      ["Series resistance rule?", "R_total = R₁ + R₂ + ..."],
      ["Parallel resistance rule?", "1/R_total = 1/R₁ + 1/R₂ + ..."],
      ["What is same in series?", "Current."],
      ["What is same in parallel?", "Voltage."],
      ["Power formula?", "P = IV."],
      ["Another power formula?", "P = I²R or P = V²/R."],
      ["Junction rule?", "Current in = current out."],
      ["Loop rule?", "Voltage gains and drops sum to zero."],
      ["Parallel equivalent resistance compared to smallest branch?", "Smaller than the smallest branch."],
      ["Quiz clue for series?", "One path."],
      ["Quiz clue for parallel?", "Multiple branches."],
      ["Big trap?", "Adding parallel resistors directly."],
    ],
  },
  {
    number: 29,
    title: "Magnetic Fields and Magnetic Force",
    formula: "F = qvBsinθ",
    objective: "Solve magnetic force problems and understand when a moving charge feels magnetic force.",
    guide: [
      "QUIZ CLUES: magnetic field, tesla, moving charge, velocity, angle, qvBsinθ.",
      "Magnetic force requires a moving charge.",
      "Use F = qvBsinθ.",
      "θ is the angle between velocity and magnetic field.",
      "Maximum force occurs at 90°.",
      "Zero force occurs at 0° or 180°.",
      "Direction usually uses right-hand rule.",
      "Teacher is testing perpendicular motion.",
    ],
    traps: [
      "Stationary charge has no magnetic force.",
      "Forgetting sinθ.",
      "Using cosθ instead of sinθ.",
      "Ignoring angle between v and B.",
    ],
    clips: [
      ["🏃", "Moving Charge", "Charge moves through B field.", "Magnetic force appears.", "Motion is required."],
      ["📐", "Angle", "90° is perpendicular.", "Force is maximum.", "Use sinθ."],
      ["🧲", "Sideways Force", "Force is perpendicular to motion.", "Path can curve.", "Magnetic force bends charges."],
    ],
    cards: [
      ["Magnetic force formula?", "F = qvBsinθ."],
      ["What unit is B measured in?", "Tesla, T."],
      ["What angle gives max magnetic force?", "90°."],
      ["What angle gives zero magnetic force?", "0° or 180°."],
      ["What if the charge is stationary?", "No magnetic force."],
      ["What does θ measure?", "Angle between velocity and magnetic field."],
      ["Does magnetic force act parallel or perpendicular?", "Perpendicular to motion and field."],
      ["Quiz clue for magnetic force?", "Moving charge in magnetic field."],
      ["Big trap?", "Forgetting sinθ."],
      ["If q doubles, F does what?", "Doubles."],
    ],
  },
  {
    number: 30,
    title: "Electromagnetic Induction",
    formula: "ε = -NΔΦB/Δt",
    objective: "Understand how changing magnetic flux creates induced emf and apply Faraday's Law.",
    guide: [
      "QUIZ CLUES: induction, emf, Faraday, Lenz, changing flux, coil, turns, magnetic flux.",
      "Induced emf happens when magnetic flux changes.",
      "Use |ε| = NΔΦB/Δt for magnitude.",
      "More turns means larger emf.",
      "Faster flux change means larger emf.",
      "The negative sign is Lenz's Law: the induced effect opposes the change.",
      "Teacher is testing whether you recognize changing flux, not just magnetic field existing.",
    ],
    traps: [
      "No changing flux means no induced emf.",
      "The negative sign is direction, not usually magnitude.",
      "Flux can change by changing B, area, angle, or motion.",
    ],
    clips: [
      ["🧲", "Moving Magnet", "Magnet moves near coil.", "Flux changes.", "Changing flux creates voltage."],
      ["🌀", "Flux Change", "B, area, or angle changes.", "ΔΦB is not zero.", "Induction happens."],
      ["🙅", "Lenz's Law", "Induced current fights change.", "Negative sign shows opposition.", "Nature resists the change."],
    ],
    cards: [
      ["Faraday's Law?", "ε = -NΔΦB/Δt."],
      ["What causes induced emf?", "Changing magnetic flux."],
      ["What does N mean?", "Number of turns in the coil."],
      ["If N increases, emf does what?", "Increases."],
      ["If flux changes faster, emf does what?", "Increases."],
      ["What does Lenz's Law say?", "Induced effect opposes the change."],
      ["No changing flux means what?", "No induced emf."],
      ["What unit is emf?", "Volt."],
      ["Quiz clue for induction?", "Changing flux, coil, emf, Faraday, Lenz."],
      ["Big trap?", "Thinking a constant magnetic field alone creates emf."],
    ],
  },
  {
    number: 31,
    title: "Electromagnetic Waves",
    formula: "c = fλ",
    objective: "Understand light as an electromagnetic wave and solve frequency/wavelength problems.",
    guide: [
      "QUIZ CLUES: light, electromagnetic wave, speed of light, vacuum, frequency, wavelength.",
      "Light is an electromagnetic wave.",
      "EM waves have oscillating electric and magnetic fields.",
      "Use c = fλ.",
      "Use c = 3.00 × 10⁸ m/s in vacuum.",
      "Solve for λ using λ = c/f.",
      "Solve for f using f = c/λ.",
      "Teacher is testing whether you use c, not sound speed.",
    ],
    traps: [
      "Do not use 343 m/s. That is sound in air.",
      "EM waves can travel through vacuum.",
      "High frequency means short wavelength.",
    ],
    clips: [
      ["⚡", "Electric Field", "E field oscillates.", "It changes with time.", "Part of light."],
      ["🧲", "Magnetic Field", "B field oscillates too.", "E and B travel together.", "That is an EM wave."],
      ["💡", "Light Speed", "In vacuum, c is constant.", "c = 3.00 × 10⁸ m/s.", "Use c = fλ."],
    ],
    cards: [
      ["What is light?", "An electromagnetic wave."],
      ["Speed of light in vacuum?", "3.00 × 10⁸ m/s."],
      ["EM wave formula?", "c = fλ."],
      ["Solve for wavelength?", "λ = c/f."],
      ["Solve for frequency?", "f = c/λ."],
      ["Can EM waves travel through vacuum?", "Yes."],
      ["High frequency means what kind of wavelength?", "Short wavelength."],
      ["What speed should you not use for light?", "343 m/s, sound speed."],
      ["Quiz clue for EM waves?", "Light, vacuum, EM wave."],
      ["Big trap?", "Using sound speed instead of c."],
    ],
  },
  {
    number: "LOG",
    title: "Math Primer: Logs and Exponents",
    formula: "b = aˣ ↔ logₐ(b)=x",
    objective: "Use logarithms to solve equations where variables appear in exponents or inside logs.",
    guide: [
      "QUIZ CLUES: log, ln, common log, natural log, exponent, solve for variable.",
      "Plain log means base 10.",
      "ln means base e.",
      "Logs undo exponents.",
      "If log(A)=B, rewrite as A=10ᴮ.",
      "If ln(A)=B, rewrite as A=eᴮ.",
      "If aˣ=b, take log of both sides: x=log(b)/log(a).",
      "Use the power rule: log(aˣ)=xlog(a).",
    ],
    traps: [
      "Do not divide a variable out of an exponent.",
      "Do not confuse log and ln.",
      "Remember to isolate the log before converting to exponential form.",
      "If y² is inside a log, solving may technically involve ± unless the domain assumes y>0.",
    ],
    clips: [
      ["🔓", "Logs Unlock Exponents", "Variable is trapped upstairs.", "Log brings it down.", "Logs undo exponents."],
      ["🔟", "Common Log", "log means base 10.", "10^x undoes log.", "Use for common log."],
      ["🌿", "Natural Log", "ln means base e.", "e^x undoes ln.", "Use for natural growth/decay."],
    ],
    cards: [
      ["What base is log?", "10."],
      ["What base is ln?", "e."],
      ["What do logs undo?", "Exponents."],
      ["If log(A)=B, what is A?", "A = 10ᴮ."],
      ["If ln(A)=B, what is A?", "A = eᴮ."],
      ["Power rule for logs?", "log(aˣ)=xlog(a)."],
      ["If aˣ=b, how do you solve for x?", "x = log(b)/log(a)."],
      ["Common log means what?", "Base 10 logarithm."],
      ["Natural log means what?", "Base e logarithm."],
      ["Solve x = 3log(y²) for positive y.", "y = 10^(x/6)."],
      ["Big trap?", "Trying to divide a variable out of an exponent instead of using logs."],
    ],
  },
];

function nice(value) {
  if (!Number.isFinite(value)) return "";
  if (Math.abs(value) >= 100000 || Math.abs(value) < 0.001) {
    return value.toExponential(3);
  }
  return Number(value.toFixed(4)).toString();
}

function allNumbers(text) {
  return (
    text.match(
      /[-+]?\d*\.?\d+(?:\s?×\s?10\^?[-+]?\d+|e[-+]?\d+)?\s?(?:hz|hertz|m\/s|m|s|sec|seconds|c|n|newtons|v|volts|a|amps|ohm|ohms|Ω|t|tesla|wb|j|joules|w|watts|f|farad|farads|rad|radians)?/gi
    ) || []
  );
}

function numsByRegex(text, regex) {
  return [...text.matchAll(regex)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n));
}

function firstUnit(text, unitRegex) {
  const m = text.match(
    new RegExp("([-+]?\\d*\\.?\\d+)\\s*" + unitRegex, "i")
  );
  return m ? Number(m[1]) : null;
}

function contextNumber(text, words) {
  const lower = text.toLowerCase();

  for (const word of words) {
    const after = lower.match(
      new RegExp(word + "[^0-9-+]*([-+]?\\d*\\.?\\d+)", "i")
    );
    if (after) return Number(after[1]);

    const before = lower.match(
      new RegExp("([-+]?\\d*\\.?\\d+)\\s*(?:\\w+\\s*){0,5}" + word, "i")
    );
    if (before) return Number(before[1]);
  }

  return null;
}

function has(lower, words) {
  return words.some((word) => lower.includes(word));
}


function variableTranslator(text) {
  const lower = text.toLowerCase();
  const lines = [];

  function add(symbol, value, meaning) {
    if (value !== null && value !== undefined && value !== "") {
      lines.push(`${symbol} = ${value}   →   ${meaning}`);
    }
  }

  const speeds = numsByRegex(text, /([-+]?\d*\.?\d+)\s*m\s*\/\s*s/gi);
  const tensions = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:n|newton|newtons|upper n)\b/gi);
  const charges = numsByRegex(text, /([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\s*c\b/gi);
  const voltages = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:v|volts)\b/gi);
  const currents = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:a|amps)\b/gi);
  const resistances = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:ohm|ohms|Ω)\b/gi);
  const frequencies = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:hz|hertz)\b/gi);
  const powers = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:w|watts)\b/gi);
  const magneticFields = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:t|tesla)\b/gi);
  const times = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:s|sec|seconds)\b/gi);
  const rValues = numsByRegex(text, /r\s*(?:=|equals)\s*([-+]?\d*\.?\d+)/gi);

  const wavelength =
    contextNumber(text, ["wavelength", "lambda"]) ||
    null;

  const period =
    contextNumber(text, ["period"]) ||
    null;

  const area =
    contextNumber(text, ["area"]) ||
    null;

  const angle =
    contextNumber(text, ["angle", "theta", "θ"]) ||
    null;

  const capacitance =
    contextNumber(text, ["capacitance"]) ||
    null;

  const turns =
    contextNumber(text, ["turns", "turn", "coils", "coil"]) ||
    null;

  const flux =
    contextNumber(text, ["flux"]) ||
    null;

  // Wave speed on a string
  if (has(lower, ["string"]) && has(lower, ["tension"]) && has(lower, ["speed"])) {
    add("v₁", speeds[0] ? `${speeds[0]} m/s` : "", "original wave speed");
    add("T₁", tensions[0] ? `${tensions[0]} N` : "", "original tension");
    add("v₂", speeds[1] ? `${speeds[1]} m/s` : "", "new wave speed");
    add("T₂", "?", "new tension we are solving for");
    add("μ", "constant", "same string means linear mass density does not change");
    return lines.join("\n");
  }

  // Spherical wave phase
  if (has(lower, ["phase"]) && has(lower, ["wavelength", "spherical wave", "r equals", "r ="])) {
    add("λ", wavelength ? `${wavelength} m` : "", "wavelength");
    add("r₁", rValues[0] !== undefined ? `${rValues[0]} m` : "", "starting radius");
    add("φ₁", has(lower, ["pi rad", "π rad", "is pi", "= pi"]) ? "π rad" : "", "starting phase");
    add("r₂", rValues[1] !== undefined ? `${rValues[1]} m` : "", "new radius");
    add("φ₂", "?", "new phase we are solving for");
    add("k", "2π / λ", "wave number");
    return lines.join("\n");
  }

  // Logs
  if (has(lower, ["log", "ln", "logarithm", "exponent"])) {
    if (lower.includes("x")) add("x", "given expression variable", "the expression already in the equation");
    if (lower.includes("y")) add("y", "?", "variable being solved for");
    add("log", "base 10", "common logarithm");
    add("ln", "base e", "natural logarithm");
    return lines.join("\n");
  }

  // Regular waves
  if (has(lower, ["wave", "frequency", "wavelength", "period", "hz", "hertz"])) {
    add("f", frequencies[0] ? `${frequencies[0]} Hz` : "", "frequency");
    add("λ", wavelength ? `${wavelength} m` : "", "wavelength");
    add("v", speeds[0] ? `${speeds[0]} m/s` : "?", "wave speed");
    add("T", period ? `${period} s` : "", "period");
    return lines.join("\n");
  }

  // Coulomb
  if (has(lower, ["charge", "coulomb", "repel", "attract", "electric force"])) {
    add("q₁", charges[0] ? `${charges[0]} C` : "", "first charge");
    add("q₂", charges[1] ? `${charges[1]} C` : "", "second charge");
    add("r", contextNumber(text, ["distance", "apart", "separated"]) ? `${contextNumber(text, ["distance", "apart", "separated"])} m` : "", "distance between charges");
    add("F", "?", "electric force");
    add("k", "9 × 10⁹", "Coulomb constant");
    return lines.join("\n");
  }

  // Electric field
  if (has(lower, ["electric field", "field", "n/c", "force per charge"])) {
    add("F", firstUnit(text, "n\\b") ? `${firstUnit(text, "n\\b")} N` : "", "force");
    add("q", charges[0] ? `${charges[0]} C` : "", "charge");
    add("E", firstUnit(text, "n\\/c") ? `${firstUnit(text, "n\\/c")} N/C` : "?", "electric field");
    return lines.join("\n");
  }

  // Flux / Gauss
  if (has(lower, ["flux", "gauss", "surface", "area", "enclosed"])) {
    add("ΦE", "?", "electric flux");
    add("E", firstUnit(text, "n\\/c") ? `${firstUnit(text, "n\\/c")} N/C` : "", "electric field");
    add("A", area ? `${area} m²` : "", "area");
    add("θ", angle ? `${angle}°` : "", "angle between field and area vector");
    add("q_enc", charges[0] ? `${charges[0]} C` : "", "enclosed charge");
    return lines.join("\n");
  }

  // Voltage / potential
  if (has(lower, ["voltage", "potential", "potential energy", "volt"])) {
    add("V", voltages[0] ? `${voltages[0]} V` : "?", "voltage / electric potential");
    add("U", contextNumber(text, ["energy", "potential energy"]) ? `${contextNumber(text, ["energy", "potential energy"])} J` : "", "electric potential energy");
    add("q", charges[0] ? `${charges[0]} C` : "", "charge");
    return lines.join("\n");
  }

  // Capacitance
  if (has(lower, ["capacitor", "capacitance", "farad", "dielectric"])) {
    add("C", capacitance ? `${capacitance} F` : "?", "capacitance");
    add("Q", charges[0] ? `${charges[0]} C` : "", "stored charge");
    add("ΔV", voltages[0] ? `${voltages[0]} V` : "", "voltage difference");
    return lines.join("\n");
  }

  // Circuits
  if (has(lower, ["current", "resistance", "resistor", "ohm", "ohms", "amp", "battery", "circuit", "power", "watts"])) {
    add("V", voltages[0] ? `${voltages[0]} V` : "", "voltage");
    add("I", currents[0] ? `${currents[0]} A` : "", "current");
    add("R", resistances[0] ? `${resistances[0]} Ω` : "", "resistance");
    add("P", powers[0] ? `${powers[0]} W` : "", "power");
    return lines.join("\n");
  }

  // Magnetic force
  if (has(lower, ["magnetic", "tesla", "moving charge", "b field"])) {
    add("q", charges[0] ? `${charges[0]} C` : "", "charge");
    add("v", speeds[0] ? `${speeds[0]} m/s` : "", "speed of moving charge");
    add("B", magneticFields[0] ? `${magneticFields[0]} T` : "", "magnetic field");
    add("θ", angle ? `${angle}°` : "", "angle between velocity and magnetic field");
    add("F", "?", "magnetic force");
    return lines.join("\n");
  }

  // Induction
  if (has(lower, ["induction", "emf", "faraday", "lenz", "flux", "coil", "turns"])) {
    add("ε", "?", "induced emf");
    add("N", turns ? `${turns}` : "", "number of turns");
    add("ΔΦB", flux ? `${flux} Wb` : "", "change in magnetic flux");
    add("Δt", times[0] ? `${times[0]} s` : "", "time interval");
    return lines.join("\n");
  }

  // EM waves
  if (has(lower, ["light", "electromagnetic", "em wave", "speed of light"])) {
    add("c", "3.00 × 10⁸ m/s", "speed of light");
    add("f", frequencies[0] ? `${frequencies[0]} Hz` : "", "frequency");
    add("λ", wavelength ? `${wavelength} m` : "", "wavelength");
    return lines.join("\n");
  }

  return "I found the numbers, but I need more clue words to label them. Look for words like speed, tension, wavelength, charge, voltage, current, resistance, magnetic field, or phase.";
}


function makeResult({ topic, givens, unknown, formula, math, solution, trap, variableMap = "" }) {
  return {
    topic,
    given:
      `Problem Type: ${topic}\n\n` +
      `Variable Translator:\n${variableMap || "Paste a problem and I will label the variables."}\n\n` +
      `Givens:\n${givens.length ? givens.join(" | ") : "No numbers found yet."}\n\n` +
      `Unknown:\n${unknown}`,
    math,
    solution,
    steps: [
      ["GIVEN", givens.length ? givens.join(" | ") : "Write all numbers and units."],
      ["UNKNOWN", unknown],
      ["FORMULA", formula],
      ["MATH", math],
      ["SOLUTION", solution],
      ["CHECK", trap],
    ],
  };
}

function solveProblem(text) {
  const lower = text.toLowerCase();
  const givens = allNumbers(text);

  if (!text.trim()) {
    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Paste a problem first",
      givens: [],
      unknown: "The variable the problem asks for",
      formula: "Formula appears here.",
      math: "Paste the full homework question with numbers and units.",
      solution: "Answer appears here.",
      trap: "Do not paste only part of the problem.",
    });
  }

  // CHAPTER 16: String tension
  if (has(lower, ["string"]) && has(lower, ["tension"]) && has(lower, ["speed"])) {
    const speeds = numsByRegex(text, /([-+]?\d*\.?\d+)\s*m\s*\/\s*s/gi);
    const tensions = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:n|newton|newtons|upper n)\b/gi);

    const v1 = speeds[0];
    const v2 = speeds[1];
    const T1 = tensions[0];

    let math =
      "v = √(T / μ)\n" +
      "Same string means μ stays constant.\n" +
      "So tension is proportional to speed squared:\n" +
      "T₂ = T₁ × (v₂ / v₁)²";

    let solution = "Need v₁, T₁, and v₂.";

    if (v1 && v2 && T1) {
      const T2 = T1 * Math.pow(v2 / v1, 2);
      solution =
        `T₂ = ${T1} × (${v2} / ${v1})²\n` +
        `T₂ = ${nice(T2)} N\n\n` +
        `Answer: ${nice(T2)} N`;
    }

    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 16: Wave Speed on a String",
      givens,
      unknown: "New tension T₂",
      formula: "v = √(T / μ)",
      math,
      solution,
      trap: "Do not use a direct ratio. Because v has a square root, tension uses speed squared.",
    });
  }

  // CHAPTER 16: Spherical wave phase
  if (has(lower, ["phase"]) && has(lower, ["wavelength", "spherical wave", "r equals", "r ="])) {
    const wavelength = contextNumber(text, ["wavelength"]) || firstUnit(text, "m\\b");
    const rValues = numsByRegex(text, /r\s*(?:=|equals)\s*([-+]?\d*\.?\d+)/gi);
    const r1 = rValues[0];
    const r2 = rValues[1];
    const phaseIsPi = has(lower, ["pi rad", "π rad", "is pi", "= pi"]);

    let math =
      "Phase changes with position.\n" +
      "k = 2π / λ\n" +
      "For this homework style, use:\n" +
      "φ₂ = φ₁ - k(r₁ - r₂)";

    let solution = "Need wavelength, starting phase, starting r, and new r.";

    if (wavelength && r1 !== undefined && r2 !== undefined && phaseIsPi) {
      const phi2 = Math.PI - ((2 * Math.PI) / wavelength) * (r1 - r2);
      solution =
        `λ = ${wavelength} m\n` +
        `φ₁ = π rad at r₁ = ${r1} m\n` +
        `r₂ = ${r2} m\n` +
        `k = 2π / ${wavelength}\n` +
        `φ₂ = π - (2π / ${wavelength})(${r1} - ${r2})\n` +
        `φ₂ = ${nice(phi2)} rad\n\n` +
        `Answer: ${nice(phi2)} rad`;
    }

    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 16: Spherical Wave Phase",
      givens,
      unknown: "Phase φ₂",
      formula: "Δφ = (2π / λ)Δr",
      math,
      solution,
      trap: "This is not a wave speed problem. Use phase change, not v = fλ.",
    });
  }

  // LOGS
  if (has(lower, ["log", "ln", "logarithm", "exponent"])) {
    const exact =
      lower.includes("x") &&
      lower.includes("3") &&
      lower.includes("log") &&
      lower.includes("y") &&
      (lower.includes("squared") || lower.includes("y²") || lower.includes("y^2"));

    if (exact) {
      return makeResult({
      variableMap: variableTranslator(text),
        topic: "Math Primer: Logarithms",
        givens: ["x = 3 log(y²)", "log means base 10"],
        unknown: "y",
        formula: "If log(A) = B, then A = 10^B.",
        math:
          "x = 3 log(y²)\n" +
          "x / 3 = log(y²)\n" +
          "10^(x / 3) = y²\n" +
          "y = √(10^(x / 3))\n" +
          "y = 10^(x / 6)",
        solution: "Answer: y = 10^(x / 6)",
        trap: "Plain log is base 10. ln is base e.",
      });
    }

    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Math Primer: Logs / Exponents",
      givens,
      unknown: "Variable inside a log or exponent",
      formula: "b = aˣ  ↔  logₐ(b) = x",
      math:
        "If variable is in an exponent, take log or ln of both sides.\n" +
        "If variable is inside a log, rewrite as an exponential equation.\n" +
        "Use log(a^x) = x log(a).",
      solution: "Use the exact equation to isolate the variable.",
      trap: "Do not divide a variable out of an exponent. Use logs.",
    });
  }

  // BASIC WAVE SPEED
  if (has(lower, ["wave", "frequency", "wavelength", "period", "hz", "hertz"])) {
    const f = firstUnit(text, "(hz|hertz)");
    const wavelength = contextNumber(text, ["wavelength", "lambda"]) || firstUnit(text, "m\\b");
    const speed = firstUnit(text, "m\\/s");
    const period = contextNumber(text, ["period"]);

    let unknown = "wave variable";
    let math = "v = fλ\nf = 1/T";
    let solution = "Need enough values to solve.";

    if (has(lower, ["speed", "velocity"]) && f && wavelength) {
      const v = f * wavelength;
      unknown = "v";
      solution = `v = fλ\nv = ${f} × ${wavelength}\nv = ${nice(v)} m/s\n\nAnswer: ${nice(v)} m/s`;
    } else if (has(lower, ["frequency"]) && speed && wavelength) {
      const ans = speed / wavelength;
      unknown = "f";
      math = "v = fλ\nf = v / λ";
      solution = `f = ${speed} / ${wavelength}\nf = ${nice(ans)} Hz\n\nAnswer: ${nice(ans)} Hz`;
    } else if (has(lower, ["wavelength"]) && speed && f) {
      const ans = speed / f;
      unknown = "λ";
      math = "v = fλ\nλ = v / f";
      solution = `λ = ${speed} / ${f}\nλ = ${nice(ans)} m\n\nAnswer: ${nice(ans)} m`;
    } else if (has(lower, ["period"]) && f) {
      const ans = 1 / f;
      unknown = "T";
      math = "T = 1 / f";
      solution = `T = 1 / ${f}\nT = ${nice(ans)} s\n\nAnswer: ${nice(ans)} s`;
    } else if (has(lower, ["frequency"]) && period) {
      const ans = 1 / period;
      unknown = "f";
      math = "f = 1 / T";
      solution = `f = 1 / ${period}\nf = ${nice(ans)} Hz\n\nAnswer: ${nice(ans)} Hz`;
    }

    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 16: Waves",
      givens,
      unknown,
      formula: "v = fλ and f = 1/T",
      math,
      solution,
      trap: "Amplitude is not wavelength. Frequency and period are opposites.",
    });
  }

  // COULOMB
  if (has(lower, ["charge", "coulomb", "repel", "attract", "electric force"])) {
    const charges = numsByRegex(text, /([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\s*c\b/gi);
    const q1 = charges[0];
    const q2 = charges[1];
    const r = contextNumber(text, ["distance", "apart", "separated"]) || firstUnit(text, "m\\b");

    let solution = "Need q₁, q₂, and r.";

    if (q1 && q2 && r) {
      const F = (9e9 * Math.abs(q1) * Math.abs(q2)) / (r * r);
      solution =
        `F = kq₁q₂/r²\n` +
        `F = (9 × 10⁹ × ${q1} × ${q2}) / ${r}²\n` +
        `F = ${nice(F)} N\n\n` +
        `Answer: ${nice(F)} N`;
    }

    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 22: Coulomb's Law",
      givens,
      unknown: "Electric force F",
      formula: "F = kq₁q₂/r²",
      math: "Use k = 9 × 10⁹. Square the distance r.",
      solution,
      trap: "Same charges repel. Opposite charges attract. Always square r.",
    });
  }

  // ELECTRIC FIELD
  if (has(lower, ["electric field", "field", "n/c", "force per charge"])) {
    const F = firstUnit(text, "n\\b");
    const q = firstUnit(text, "c\\b");
    const E = firstUnit(text, "n\\/c");

    let unknown = "E, F, or q";
    let math = "E = F/q";
    let solution = "Need two of E, F, and q.";

    if (F && q && has(lower, ["field"])) {
      const ans = F / q;
      unknown = "E";
      solution = `E = F/q\nE = ${F}/${q}\nE = ${nice(ans)} N/C\n\nAnswer: ${nice(ans)} N/C`;
    } else if (q && E && has(lower, ["force"])) {
      const ans = q * E;
      unknown = "F";
      math = "F = qE";
      solution = `F = qE\nF = ${q} × ${E}\nF = ${nice(ans)} N\n\nAnswer: ${nice(ans)} N`;
    }

    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 23: Electric Field",
      givens,
      unknown,
      formula: "E = F/q",
      math,
      solution,
      trap: "Electric field is force per charge, not force itself.",
    });
  }

  // FLUX / GAUSS
  if (has(lower, ["flux", "gauss", "surface", "area", "enclosed"])) {
    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 24: Flux / Gauss's Law",
      givens,
      unknown: "Flux, field, or enclosed charge",
      formula: "ΦE = EAcosθ or ΦE = q_enc/ε₀",
      math:
        "If E, A, and θ are given: ΦE = EAcosθ.\n" +
        "If closed surface/enclosed charge is given: ΦE = q_enc/ε₀.",
      solution: "Plug the givens into the matching flux formula.",
      trap: "Use cosθ. Only field through the surface counts.",
    });
  }

  // VOLTAGE / POTENTIAL
  if (has(lower, ["voltage", "potential", "potential energy", "volt"])) {
    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 25: Electric Potential",
      givens,
      unknown: "V, U, or q",
      formula: "V = U/q",
      math: "V = U/q\nU = qV\nq = U/V",
      solution: "Use the version that solves for the unknown.",
      trap: "Voltage means energy per charge.",
    });
  }

  // CAPACITANCE
  if (has(lower, ["capacitor", "capacitance", "farad", "dielectric"])) {
    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 26: Capacitance",
      givens,
      unknown: "C, Q, or ΔV",
      formula: "C = Q/ΔV",
      math: "C = Q/ΔV\nQ = CΔV\nΔV = Q/C",
      solution: "Use the version that solves for the unknown.",
      trap: "Capacitance is charge per volt, not charge itself.",
    });
  }

  // CIRCUITS
  if (has(lower, ["current", "resistance", "resistor", "ohm", "ohms", "amp", "battery", "circuit", "power", "watts"])) {
    const V = firstUnit(text, "(v|volts)");
    const I = firstUnit(text, "(a|amps)");
    const R = firstUnit(text, "(ohm|ohms|Ω)");
    const P = firstUnit(text, "(w|watts)");

    let formula = has(lower, ["power", "watts"]) ? "P = IV" : "V = IR";
    let math = "V = IR\nP = IV";
    let solution = "Need two matching values.";

    if (V && R && has(lower, ["current"])) {
      const ans = V / R;
      solution = `I = V/R\nI = ${V}/${R}\nI = ${nice(ans)} A\n\nAnswer: ${nice(ans)} A`;
    } else if (I && R && has(lower, ["voltage"])) {
      const ans = I * R;
      solution = `V = IR\nV = ${I} × ${R}\nV = ${nice(ans)} V\n\nAnswer: ${nice(ans)} V`;
    } else if (V && I && has(lower, ["resistance"])) {
      const ans = V / I;
      solution = `R = V/I\nR = ${V}/${I}\nR = ${nice(ans)} Ω\n\nAnswer: ${nice(ans)} Ω`;
    } else if (V && I && has(lower, ["power", "watts"])) {
      const ans = V * I;
      solution = `P = IV\nP = ${I} × ${V}\nP = ${nice(ans)} W\n\nAnswer: ${nice(ans)} W`;
    } else if (P && V && has(lower, ["current"])) {
      const ans = P / V;
      solution = `I = P/V\nI = ${P}/${V}\nI = ${nice(ans)} A\n\nAnswer: ${nice(ans)} A`;
    }

    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 27/28: Circuits",
      givens,
      unknown: "V, I, R, or P",
      formula,
      math,
      solution,
      trap: "Series has same current. Parallel has same voltage.",
    });
  }

  // MAGNETISM
  if (has(lower, ["magnetic", "tesla", "moving charge", "b field"])) {
    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 29: Magnetic Force",
      givens,
      unknown: "Magnetic force F",
      formula: "F = qvBsinθ",
      math: "Use q, v, B, and angle θ. sin90° = 1. sin0° = 0.",
      solution: "Plug into F = qvBsinθ.",
      trap: "A stationary charge has no magnetic force.",
    });
  }

  // INDUCTION
  if (has(lower, ["induction", "emf", "faraday", "lenz", "flux", "coil", "turns"])) {
    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 30: Electromagnetic Induction",
      givens,
      unknown: "Induced emf ε",
      formula: "ε = -NΔΦB/Δt",
      math: "For magnitude: |ε| = NΔΦB/Δt.",
      solution: "Plug in turns, flux change, and time.",
      trap: "No changing flux means no induced emf.",
    });
  }

  // EM WAVES
  if (has(lower, ["light", "electromagnetic", "em wave", "speed of light"])) {
    return makeResult({
      variableMap: variableTranslator(text),
      topic: "Chapter 31: Electromagnetic Waves",
      givens,
      unknown: "c, f, or λ",
      formula: "c = fλ",
      math: "Use c = 3.00 × 10⁸ m/s. Rearrange as f = c/λ or λ = c/f.",
      solution: "Plug into c = fλ.",
      trap: "Do not use sound speed for light.",
    });
  }

  return makeResult({
      variableMap: variableTranslator(text),
    topic: "Universal Physics Problem",
    givens,
    unknown: "Whatever the question asks for",
    formula: "Use clue words to pick the formula.",
    math:
      "GIVEN → UNKNOWN → FORMULA → REARRANGE → SUBSTITUTE → SOLVE.\n\n" +
      "If this did not classify the problem, paste a little more of the problem wording.",
    solution: "Use the formula map and keep units attached.",
    trap: "Do not skip the unknown or the units.",
  });
}

function Button({ label, onPress, type = "primary" }) {
  return (
    <Pressable style={[styles.button, styles[type]]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function Box({ title, children, green = false }) {
  return (
    <View style={green ? styles.solutionBox : styles.box}>
      <Text style={green ? styles.solutionTitle : styles.boxTitle}>{title}</Text>
      <Text style={green ? styles.solutionText : styles.boxText}>{children}</Text>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [problem, setProblem] = useState("");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [clipIndex, setClipIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [playing, setPlaying] = useState(false);

  const motion = useRef(new Animated.Value(0)).current;

  const solved = solveProblem(problem);
  const chapter = STUDY_CHAPTERS[chapterIndex];
  const clip = chapter.clips[clipIndex];
  const card = chapter.cards[flashIndex];

  const movingArrow = motion.interpolate({
    inputRange: [0, 1],
    outputRange: [-45, 45],
  });

  const pulseScale = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.13, 1],
  });

  useEffect(() => {
    if (screen !== "clips" || !playing) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    const timer = setTimeout(() => {
      if (clipIndex + 1 < chapter.clips.length) {
        setClipIndex((old) => old + 1);
      } else {
        setPlaying(false);
      }
    }, 3600);

    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [screen, playing, clipIndex, chapter.clips.length, motion]);

  if (screen === "home") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Physics Final Boss</Text>
        <Text style={styles.subtitle}>Clean Homework Solver Version</Text>

        <View style={styles.card}>
          <Text style={styles.big}>No more blank solver screen.</Text>
          <Text style={styles.body}>
            Paste a homework problem and the app will organize it into GIVEN, MATH, and SOLUTION.
          </Text>

          <Button label="Homework Problem Solver" onPress={() => setScreen("solver")} />
          <Button label="Study Guide" type="purple" onPress={() => setScreen("study")} />
          <Button label="Tiny Animated Clips" type="gold" onPress={() => { setClipIndex(0); setPlaying(true); setScreen("clips"); }} />
          <Button label="Flashcards" type="secondary" onPress={() => { setFlashIndex(0); setShowAnswer(false); setScreen("flashcards"); }} />
          <Button label="Formula Map" type="purple" onPress={() => setScreen("formulas")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "solver") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Homework Problem Solver</Text>
        <Text style={styles.subtitle}>GIVEN → MATH → SOLUTION</Text>

        <View style={styles.card}>
          <Text style={styles.big}>Paste the full problem.</Text>

          <TextInput
            style={styles.input}
            value={problem}
            onChangeText={setProblem}
            placeholder="Paste your homework problem here..."
            placeholderTextColor="#64748b"
            multiline
          />

          <Box title="GIVEN">{solved.given}</Box>
          <Box title="MATH">{solved.math}</Box>
          <Box title="SOLUTION" green>{solved.solution}</Box>

          <Text style={styles.sectionTitle}>Step-by-step walkthrough</Text>

          {solved.steps.map((step, index) => (
            <View key={`${step[0]}-${index}`} style={styles.stepBox}>
              <Text style={styles.stepTitle}>{index + 1}. {step[0]}</Text>
              <Text style={styles.stepText}>{step[1]}</Text>
            </View>
          ))}

          <Button label="Clear Problem" type="gold" onPress={() => setProblem("")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </View>
      </ScrollView>
    );
  }


  if (screen === "study") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Study Guide</Text>
        <Text style={styles.subtitle}>Pick a chapter. Read the objective, math, and traps.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Choose Chapter</Text>

          <View style={styles.chapterGrid}>
            {STUDY_CHAPTERS.map((item, index) => (
              <Pressable
                key={`${item.number}-${item.title}`}
                style={[
                  styles.chapterPill,
                  index === chapterIndex ? styles.chapterPillActive : null,
                ]}
                onPress={() => {
                  setChapterIndex(index);
                  setClipIndex(0);
                  setFlashIndex(0);
                  setShowAnswer(false);
                }}
              >
                <Text style={styles.chapterPillText}>{item.number}</Text>
              </Pressable>
            ))}
          </View>

          <Box title={`Chapter ${chapter.number}: ${chapter.title}`}>
            {`Objective:\n${chapter.objective}\n\nMain Formula:\n${chapter.formula}`}
          </Box>

          <Box title="How to Solve These">
            {chapter.guide.map((item, index) => `${index + 1}. ${item}`).join("\n")}
          </Box>

          <Box title="Common Traps">
            {chapter.traps.map((item, index) => `${index + 1}. ${item}`).join("\n")}
          </Box>

          <Button label="Watch Tiny Clips for This Chapter" type="gold" onPress={() => { setClipIndex(0); setPlaying(true); setScreen("clips"); }} />
          <Button label="Practice Flashcards" type="purple" onPress={() => { setFlashIndex(0); setShowAnswer(false); setScreen("flashcards"); }} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "clips") {
    const progress = `${((clipIndex + 1) / chapter.clips.length) * 100}%`;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tiny Animated Clips</Text>
        <Text style={styles.subtitle}>Chapter {chapter.number}: {chapter.title}</Text>

        <View style={styles.card}>
          <View style={styles.videoTopRow}>
            <Text style={styles.videoPill}>Scene {clipIndex + 1} of {chapter.clips.length}</Text>
            <Text style={styles.videoPill}>{playing ? "Playing" : "Paused"}</Text>
          </View>

          <View style={styles.clipFrame}>
            <Animated.Text style={[styles.clipEmoji, { transform: [{ scale: pulseScale }] }]}>
              {clip[0]}
            </Animated.Text>

            <Text style={styles.clipTitle}>{clip[1]}</Text>

            <View style={styles.animationBoard}>
              <Text style={styles.animationLine}>{clip[2]}</Text>
              <Animated.Text style={[styles.movingArrow, { transform: [{ translateX: movingArrow }] }]}>
                ➜
              </Animated.Text>
              <Text style={styles.animationLine}>{clip[3]}</Text>
            </View>

            <Text style={styles.takeaway}>Takeaway: {clip[4]}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progress }]} />
          </View>

          <View style={styles.controlRow}>
            <Pressable
              style={styles.smallButton}
              onPress={() => {
                if (clipIndex > 0) {
                  setClipIndex(clipIndex - 1);
                  setPlaying(false);
                }
              }}
            >
              <Text style={styles.smallButtonText}>Back</Text>
            </Pressable>

            <Pressable
              style={styles.smallButtonGold}
              onPress={() => setPlaying(!playing)}
            >
              <Text style={styles.smallButtonDarkText}>{playing ? "Pause" : "Play"}</Text>
            </Pressable>

            <Pressable
              style={styles.smallButton}
              onPress={() => {
                if (clipIndex + 1 < chapter.clips.length) {
                  setClipIndex(clipIndex + 1);
                  setPlaying(false);
                }
              }}
            >
              <Text style={styles.smallButtonText}>Next</Text>
            </Pressable>
          </View>

          <Button label="Change Chapter" type="purple" onPress={() => setScreen("study")} />
          <Button label="Flashcards for This Chapter" type="gold" onPress={() => { setFlashIndex(0); setShowAnswer(false); setScreen("flashcards"); }} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "flashcards") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Flashcards</Text>
        <Text style={styles.subtitle}>Chapter {chapter.number}: {chapter.title}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Card {flashIndex + 1} of {chapter.cards.length}
          </Text>

          <View style={styles.flashcard}>
            <Text style={styles.flashLabel}>{showAnswer ? "ANSWER" : "QUESTION"}</Text>
            <Text style={styles.flashText}>{showAnswer ? card[1] : card[0]}</Text>
          </View>

          <Button
            label={showAnswer ? "Show Question" : "Show Answer"}
            onPress={() => setShowAnswer(!showAnswer)}
          />

          <Button
            label="Next Card"
            type="purple"
            onPress={() => {
              setFlashIndex(flashIndex + 1 < chapter.cards.length ? flashIndex + 1 : 0);
              setShowAnswer(false);
            }}
          />

          <Button label="Change Chapter" type="gold" onPress={() => setScreen("study")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </View>
      </ScrollView>
    );
  }


  if (screen === "formulas") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Formula Map</Text>
        <Text style={styles.subtitle}>Use clue words to pick the formula.</Text>

        <View style={styles.card}>
          {[
            ["Waves", "v = fλ"],
            ["String Tension", "T₂ = T₁(v₂/v₁)²"],
            ["Wave Phase", "Δφ = (2π/λ)Δr"],
            ["Coulomb", "F = kq₁q₂/r²"],
            ["Electric Field", "E = F/q"],
            ["Flux", "ΦE = EAcosθ"],
            ["Potential", "V = U/q"],
            ["Capacitance", "C = Q/ΔV"],
            ["Ohm's Law", "V = IR"],
            ["Power", "P = IV"],
            ["Magnetic Force", "F = qvBsinθ"],
            ["Induction", "ε = -NΔΦB/Δt"],
            ["Light", "c = fλ"],
            ["Logs", "b = aˣ ↔ logₐ(b)=x"],
          ].map((item) => (
            <View key={item[0]} style={styles.formulaRow}>
              <Text style={styles.formulaName}>{item[0]}</Text>
              <Text style={styles.formula}>{item[1]}</Text>
            </View>
          ))}

          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </View>
      </ScrollView>
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
  },
  title: {
    color: "#f8fafc",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 30,
  },
  subtitle: {
    color: "#fbbf24",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 22,
    marginBottom: 30,
  },
  big: {
    color: "#0f172a",
    fontSize: 23,
    lineHeight: 33,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  body: {
    color: "#1f2937",
    fontSize: 18,
    lineHeight: 29,
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    minHeight: 170,
    backgroundColor: "#f8fafc",
    borderColor: "#38bdf8",
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    color: "#0f172a",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    textAlignVertical: "top",
    marginTop: 12,
    marginBottom: 14,
  },
  box: {
    backgroundColor: "#f8fafc",
    borderColor: "#7c3aed",
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
  },
  boxTitle: {
    color: "#7c3aed",
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  boxText: {
    color: "#0f172a",
    fontSize: 18,
    lineHeight: 29,
    fontWeight: "800",
  },
  solutionBox: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
  },
  solutionTitle: {
    color: "#166534",
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  solutionText: {
    color: "#0f172a",
    fontSize: 19,
    lineHeight: 30,
    fontWeight: "900",
  },
  sectionTitle: {
    color: "#7c3aed",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 8,
  },
  stepBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },
  stepTitle: {
    color: "#7c3aed",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  stepText: {
    color: "#0f172a",
    fontSize: 17,
    lineHeight: 27,
    fontWeight: "700",
  },
  button: {
    padding: 17,
    borderRadius: 18,
    marginTop: 14,
    width: "100%",
  },
  primary: {
    backgroundColor: "#0f172a",
  },
  purple: {
    backgroundColor: "#7c3aed",
  },
  gold: {
    backgroundColor: "#f59e0b",
  },
  secondary: {
    backgroundColor: "#334155",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  formulaRow: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },
  formulaName: {
    color: "#7c3aed",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  formula: {
    color: "#0f172a",
    fontSize: 22,
    lineHeight: 32,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
  },
  chapterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 14,
  },
  chapterPill: {
    backgroundColor: "#e2e8f0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 54,
  },
  chapterPillActive: {
    backgroundColor: "#7c3aed",
  },
  chapterPillText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
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
  clipFrame: {
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
  clipEmoji: {
    fontSize: 82,
    textAlign: "center",
    marginBottom: 10,
  },
  clipTitle: {
    color: "#fbbf24",
    fontSize: 25,
    lineHeight: 33,
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
  controlRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginBottom: 4,
  },
  smallButton: {
    flex: 1,
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 16,
  },
  smallButtonGold: {
    flex: 1,
    backgroundColor: "#f59e0b",
    padding: 14,
    borderRadius: 16,
  },
  smallButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  smallButtonDarkText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  flashcard: {
    backgroundColor: "#111827",
    borderColor: "#38bdf8",
    borderWidth: 2,
    borderRadius: 24,
    padding: 26,
    minHeight: 260,
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  flashLabel: {
    color: "#fbbf24",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: 1,
  },
  flashText: {
    color: "#f8fafc",
    fontSize: 26,
    lineHeight: 38,
    fontWeight: "900",
    textAlign: "center",
  },

});
