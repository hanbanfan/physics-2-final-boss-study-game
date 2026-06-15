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

/*
  PHYSICS FINAL BOSS
  Syllabus-based Physics II study app.

  Structure:
  Home → Module → Chapter → Study Guide / Clips / Flashcards / Formula Map / Knight-Style Game / Solver

  Built around the course chapter schedule for:
  Physics for Scientists and Engineers: A Strategic Approach with Modern Physics
  Knight, 5th ed., Pearson Mastering
*/

const MODULES = [
  {
    id: 1,
    title: "Module 1",
    dates: "6/08 – 6/24",
    focus: "Waves, charge, electric field, and Gauss’s Law",
    chapters: [16, 22, 23, 24],
    exam: "Module 1 Exam due 6/28 at 11:59 PM",
  },
  {
    id: 2,
    title: "Module 2",
    dates: "6/29 – 7/06",
    focus: "Electric potential, capacitance, current, resistance, and circuits",
    chapters: [25, 26, 27, 28],
    exam: "Module 2 Exam on 7/06",
  },
  {
    id: 3,
    title: "Module 3",
    dates: "7/08 – 7/20",
    focus: "Magnetism, induction, and electromagnetic waves",
    chapters: [29, 30, 31],
    exam: "Module 3 Exam on 7/20",
  },
  {
    id: 4,
    title: "Module 4",
    dates: "7/22 – 8/02",
    focus: "Final review, remaining final topics, and exam prep",
    chapters: [33, 32],
    exam: "Final Exam due 8/02 at 11:59 PM",
  },
];

const CHAPTERS = [
  {
    number: 16,
    title: "Traveling Waves",
    formula: "v = fλ, f = 1/T, v = √(T/μ), k = 2π/λ",
    objective: "Identify wave variables and solve wave speed, string tension, period/frequency, and phase-position problems.",
    clues: ["wave", "frequency", "wavelength", "period", "string", "tension", "phase", "spherical wave"],
    guide: [
      "If the problem gives frequency and wavelength, use v = fλ.",
      "If the problem gives period, use f = 1/T.",
      "If the problem says wave speed on a string and tension, use v = √(T/μ).",
      "For the same string, μ is constant, so T₂ = T₁(v₂/v₁)².",
      "If the problem gives wavelength, phase, and radius/position, use phase change: Δφ = (2π/λ)Δr.",
      "Label every number before solving: v, f, λ, T, tension, r, phase, or k.",
      "For Ch. 16 quiz proof questions, check dimensions: time must be distance/speed, so dt = dy/v.",
      "For hanging rope questions, tension at height y supports the rope below that point: T = μyg.",
      "For snapshot/history graph questions, track which part of the wave reaches the observer first.",
      "For light questions, use c = fλ and convert nm to m before calculating.",
      "For refraction questions, frequency stays the same but speed and wavelength change.",
    ],
    traps: [
      "Amplitude is height. Wavelength is horizontal cycle length.",
      "Frequency and period are reciprocals.",
      "Tension problems use speed squared.",
      "Phase answers are in radians.",
      "For hanging rope proofs, do not select options with μ² or v dy.",
      "For time integrals, use dt = dy/v, never v dy.",
      "For light, 450 nm means 450 × 10⁻⁹ m.",
      "For refraction, n = λ₀/λ_material.",
    ],
    clips: [
      ["🌊", "Wave Motion", "String particles wiggle.", "Energy travels forward.", "Waves carry energy, not matter."],
      ["📏", "Wavelength", "Crest to crest.", "One full cycle.", "λ is horizontal length."],
      ["🪢", "String Tension", "Tighter string.", "Faster wave.", "Same string means T ∝ v²."],
      ["🌀", "Phase", "Where are you in the cycle?", "Position changes phase.", "Use k = 2π/λ."],
    ],
    flashcards: [
      ["When do I use v = fλ?", "When speed, frequency, or wavelength is involved."],
      ["What is frequency?", "Cycles per second, measured in Hz."],
      ["What is period?", "Time for one cycle."],
      ["How are f and T related?", "f = 1/T."],
      ["What is wavelength?", "Distance for one full cycle."],
      ["Wave speed on a string formula?", "v = √(T/μ)."],
      ["Same string tension shortcut?", "T₂ = T₁(v₂/v₁)²."],
      ["Why speed squared for tension?", "Because v depends on √T, so T depends on v²."],
      ["What is k?", "Wave number, k = 2π/λ."],
      ["Phase is measured in what?", "Radians."],
      ["Big phase-problem clue?", "Phase at r equals something, wavelength given."],
      ["Big string-problem clue?", "Wave speed on a string and tension."],
      ["Hanging rope tension at height y?", "T = μyg."],
      ["Hanging rope wave speed?", "v = √(gy)."],
      ["Pulse travel time down/up hanging rope?", "Δt = 2√(L/g)."],
      ["Correct tiny time step?", "dt = dy/v."],
      ["Snapshot graph means?", "D versus x at one instant."],
      ["History graph means?", "D versus t at one position."],
      ["For light, frequency formula?", "f = c/λ."],
      ["Convert 450 nm to meters.", "450 × 10⁻⁹ m."],
      ["What stays same in refraction?", "Frequency."],
      ["Index using wavelengths?", "n = λ₀/λ_material."],
    ],
    brainrot: [
      {
        q: "A string problem says the same string goes from 151 m/s to 179 m/s. What stays constant?",
        choices: ["μ", "T", "v", "phase"],
        a: "μ",
        why: "Same string means same linear density μ. Tension changes, speed changes, μ stays put like a stubborn raccoon.",
      },
      {
        q: "Which formula is the boss move for same-string tension changes?",
        choices: ["T₂ = T₁(v₂/v₁)²", "v = IR", "F = qE", "P = IV"],
        a: "T₂ = T₁(v₂/v₁)²",
        why: "Wave speed depends on square root of tension, so tension depends on speed squared.",
      },
      {
        q: "A problem gives wavelength and phase at r = 8.0 m. What is it probably asking?",
        choices: ["Phase change", "Ohm’s Law", "Coulomb force", "Capacitance"],
        a: "Phase change",
        why: "Wavelength + phase + position = use k = 2π/λ and track phase by distance.",
      },
    ],
  },
  {
    number: 22,
    title: "Electric Charges and Forces",
    formula: "F = kq₁q₂/r²",
    objective: "Predict attraction/repulsion and calculate electric force between charges.",
    clues: ["charge", "q1", "q2", "distance", "attract", "repel", "electric force"],
    guide: [
      "Same signs repel. Opposite signs attract.",
      "Use Coulomb’s Law: F = kq₁q₂/r².",
      "Use k = 9.0 × 10⁹ N·m²/C² unless given otherwise.",
      "Distance r must be squared.",
      "Find magnitude first, then handle direction.",
    ],
    traps: [
      "Forgetting to square r.",
      "Forgetting unit conversions like μC to C.",
      "Thinking negative force means negative magnitude. Magnitude is positive.",
    ],
    clips: [
      ["➕➕", "Same Charges", "Two positives face off.", "They push apart.", "Same charges repel."],
      ["➕➖", "Opposite Charges", "Positive and negative.", "They pull together.", "Opposites attract."],
      ["📏", "Inverse Square", "Distance doubles.", "Force becomes 1/4.", "Always square r."],
    ],
    flashcards: [
      ["Same charges do what?", "Repel."],
      ["Opposite charges do what?", "Attract."],
      ["Coulomb’s Law?", "F = kq₁q₂/r²."],
      ["What is k?", "9.0 × 10⁹ N·m²/C²."],
      ["If distance doubles, force becomes what?", "One-fourth."],
      ["If one charge doubles, force does what?", "Doubles."],
      ["What is r?", "Distance between charges."],
      ["Electric force unit?", "Newtons."],
      ["Charge unit?", "Coulombs."],
      ["Quiz clue?", "Two charges separated by a distance."],
    ],
    brainrot: [
      {
        q: "Two positive charges see each other across the room. What happens?",
        choices: ["Repel", "Attract", "Become a capacitor", "Start a podcast"],
        a: "Repel",
        why: "Same signs repel. They are not emotionally available.",
      },
      {
        q: "What part of Coulomb’s Law gets squared?",
        choices: ["r", "q₁", "q₂", "k"],
        a: "r",
        why: "The distance r is squared. This is the classic quiz trap.",
      },
    ],
  },
  {
    number: 23,
    title: "Electric Field",
    formula: "E = F/q, F = qE",
    objective: "Connect electric field, force, and charge.",
    clues: ["electric field", "field", "force per charge", "test charge", "N/C"],
    guide: [
      "Electric field means force per charge.",
      "Use E = F/q when solving for field.",
      "Use F = qE when solving for force.",
      "Field direction is defined by a positive test charge.",
      "Negative charges feel force opposite the field.",
    ],
    traps: [
      "Electric field is not the same as force.",
      "Direction flips for negative charges.",
      "Units can be N/C or V/m.",
    ],
    clips: [
      ["👻", "Field Map", "Charge creates arrows.", "Test charge feels force.", "Field = force per charge."],
      ["💪", "Force", "Charge enters field.", "Force happens.", "F = qE."],
    ],
    flashcards: [
      ["Electric field means what?", "Force per charge."],
      ["Formula for E?", "E = F/q."],
      ["Formula for F?", "F = qE."],
      ["Units of E?", "N/C or V/m."],
      ["Direction uses what kind of test charge?", "Positive."],
      ["Negative charge moves which way?", "Opposite the field."],
      ["If F = 12 N and q = 4 C, E = ?", "3 N/C."],
      ["Quiz clue?", "Force per charge or N/C."],
    ],
    brainrot: [
      {
        q: "Electric field is basically:",
        choices: ["Force per charge", "Energy per charge", "Charge per volt", "Voltage per meme"],
        a: "Force per charge",
        why: "E = F/q. Electric field tells how much force each coulomb gets.",
      },
    ],
  },
  {
    number: 24,
    title: "Electric Flux and Gauss’s Law",
    formula: "ΦE = EAcosθ, ΦE = q_enc/ε₀",
    objective: "Calculate flux and understand total flux through closed surfaces.",
    clues: ["flux", "surface", "area", "angle", "Gaussian surface", "enclosed charge"],
    guide: [
      "Flux means electric field passing through an area.",
      "Use ΦE = EAcosθ when E, A, and θ are given.",
      "Use ΦE = q_enc/ε₀ when enclosed charge or closed surface appears.",
      "cos(0°)=1 gives maximum flux.",
      "cos(90°)=0 gives zero flux.",
    ],
    traps: [
      "Using sin instead of cos.",
      "Counting charge outside the closed surface.",
      "Confusing flux with field.",
    ],
    clips: [
      ["➡️", "Flux", "Field arrows hit a surface.", "More arrows = more flux.", "Flux is field through area."],
      ["📐", "Angle", "Straight through is max.", "Sideways is zero.", "Use cosθ."],
      ["🧊", "Gauss Bubble", "Closed surface.", "Only inside charge counts.", "Φ = q_enc/ε₀."],
    ],
    flashcards: [
      ["Flux formula?", "ΦE = EAcosθ."],
      ["Gauss’s Law?", "ΦE = q_enc/ε₀."],
      ["Flux unit?", "N·m²/C."],
      ["θ = 0° means?", "Maximum flux."],
      ["θ = 90° means?", "Zero flux."],
      ["What charge matters in Gauss’s Law?", "Enclosed charge."],
      ["Does outside charge affect total closed-surface flux?", "No."],
      ["Quiz clue?", "Closed surface or enclosed charge."],
    ],
    brainrot: [
      {
        q: "Gauss’s Law only cares about charge that is:",
        choices: ["Enclosed", "Outside", "Nearby", "Vibing"],
        a: "Enclosed",
        why: "Total flux through a closed surface depends on enclosed charge.",
      },
    ],
  },
  {
    number: 25,
    title: "Electric Potential",
    formula: "V = U/q, U = qV",
    objective: "Understand voltage as energy per charge.",
    clues: ["voltage", "potential", "potential energy", "energy per charge", "volt"],
    guide: [
      "Voltage means energy per charge.",
      "Use V = U/q.",
      "Use U = qV when solving for energy.",
      "Potential is scalar, not vector.",
      "Do not confuse voltage with electric field.",
    ],
    traps: [
      "Mixing up V and E.",
      "Forgetting charge q.",
      "Thinking potential has direction.",
    ],
    clips: [
      ["🔋", "Voltage", "Charge has energy.", "Divide by charge.", "Voltage = energy per charge."],
      ["⛰️", "Potential Hill", "Electric hill.", "Charge moves through energy change.", "U = qV."],
    ],
    flashcards: [
      ["Voltage means what?", "Energy per charge."],
      ["Formula for V?", "V = U/q."],
      ["Formula for U?", "U = qV."],
      ["Potential is scalar or vector?", "Scalar."],
      ["Voltage unit?", "Volt."],
      ["Energy unit?", "Joule."],
      ["Quiz clue?", "Energy per charge."],
    ],
    brainrot: [
      {
        q: "Voltage is:",
        choices: ["Energy per charge", "Force per charge", "Charge per volt", "Resistance cosplay"],
        a: "Energy per charge",
        why: "V = U/q. Voltage is how much energy each coulomb gets.",
      },
    ],
  },
  {
    number: 26,
    title: "Capacitance",
    formula: "C = Q/ΔV, Q = CΔV",
    objective: "Understand charge storage, voltage difference, and dielectrics.",
    clues: ["capacitor", "capacitance", "charge stored", "plates", "dielectric", "farad"],
    guide: [
      "Capacitance means charge stored per volt.",
      "Use C = Q/ΔV.",
      "Use Q = CΔV when solving for charge.",
      "Use ΔV = Q/C when solving for voltage.",
      "Dielectrics usually increase capacitance.",
    ],
    traps: [
      "Capacitance is not charge.",
      "Use voltage difference ΔV.",
      "Farads may appear as microfarads.",
    ],
    clips: [
      ["🥫", "Capacitor", "Two plates.", "Opposite charges stored.", "Capacitors store charge."],
      ["🧈", "Dielectric", "Material between plates.", "Capacitance increases.", "More charge per volt."],
    ],
    flashcards: [
      ["Capacitance formula?", "C = Q/ΔV."],
      ["Charge formula?", "Q = CΔV."],
      ["Voltage formula?", "ΔV = Q/C."],
      ["Capacitance unit?", "Farad."],
      ["What does a capacitor store?", "Charge and energy."],
      ["What does dielectric usually do?", "Increases capacitance."],
      ["Quiz clue?", "Capacitor, plates, farad."],
    ],
    brainrot: [
      {
        q: "Capacitance is charge stored per:",
        choices: ["Volt", "Newton", "Hertz", "Drama"],
        a: "Volt",
        why: "C = Q/ΔV. Capacitance is charge per voltage difference.",
      },
    ],
  },
  {
    number: 27,
    title: "Current and Resistance",
    formula: "V = IR",
    objective: "Use Ohm’s Law to solve current, voltage, and resistance problems.",
    clues: ["current", "voltage", "resistance", "resistor", "ohm", "amp", "battery"],
    guide: [
      "Voltage pushes charge.",
      "Current is charge flow.",
      "Resistance opposes current.",
      "Use V = IR.",
      "Solve for current with I = V/R.",
      "Solve for resistance with R = V/I.",
    ],
    traps: [
      "Not rearranging before plugging in.",
      "Confusing voltage and current.",
      "Forgetting resistance lowers current.",
    ],
    clips: [
      ["🔋", "Voltage", "Battery pushes.", "Charge moves.", "Voltage drives current."],
      ["🚧", "Resistance", "Circuit traffic jam.", "Current slows.", "Higher R means lower I."],
    ],
    flashcards: [
      ["Ohm’s Law?", "V = IR."],
      ["Current formula?", "I = V/R."],
      ["Resistance formula?", "R = V/I."],
      ["Current unit?", "Ampere."],
      ["Resistance unit?", "Ohm."],
      ["Voltage unit?", "Volt."],
      ["If V = 12 V and R = 4 Ω, I = ?", "3 A."],
      ["Quiz clue?", "Voltage, current, resistance."],
    ],
    brainrot: [
      {
        q: "If voltage stays the same and resistance increases, current:",
        choices: ["Decreases", "Increases", "Becomes flux", "Joins a band"],
        a: "Decreases",
        why: "I = V/R. Bigger denominator = smaller current.",
      },
    ],
  },
  {
    number: 28,
    title: "Circuits",
    formula: "P = IV, series R = R₁+R₂, parallel 1/R = 1/R₁+1/R₂",
    objective: "Use series/parallel rules, Kirchhoff’s laws, and power formulas.",
    clues: ["series", "parallel", "junction", "loop", "power", "watts", "resistors"],
    guide: [
      "Series circuit: one path, same current.",
      "Parallel circuit: multiple paths, same voltage.",
      "Series resistors add directly.",
      "Parallel resistors use reciprocals.",
      "Junction rule: current in = current out.",
      "Loop rule: voltage gains and drops balance.",
      "Power: P = IV.",
    ],
    traps: [
      "Adding parallel resistors directly.",
      "Mixing up same current/same voltage.",
      "Forgetting power units are watts.",
    ],
    clips: [
      ["📏", "Series", "One path.", "Same current.", "Resistors add."],
      ["🌀", "Parallel", "Branches.", "Same voltage.", "Reciprocal resistance."],
      ["⚡", "Power", "Energy per time.", "P = IV.", "Watts."],
    ],
    flashcards: [
      ["Same in series?", "Current."],
      ["Same in parallel?", "Voltage."],
      ["Series resistance rule?", "Add directly."],
      ["Parallel resistance rule?", "Use reciprocals."],
      ["Power formula?", "P = IV."],
      ["Junction rule?", "Current in = current out."],
      ["Loop rule?", "Voltage gains and drops sum to zero."],
      ["Quiz clue for parallel?", "Branches."],
    ],
    brainrot: [
      {
        q: "Parallel resistors are NOT added directly because:",
        choices: ["They use reciprocals", "They are shy", "Voltage disappears", "Current is illegal"],
        a: "They use reciprocals",
        why: "Parallel: 1/R_total = 1/R₁ + 1/R₂ + ...",
      },
    ],
  },
  {
    number: 29,
    title: "Magnetic Field",
    formula: "F = qvBsinθ",
    objective: "Solve magnetic force on moving charge problems.",
    clues: ["magnetic field", "tesla", "moving charge", "velocity", "angle"],
    guide: [
      "Magnetic force requires moving charge.",
      "Use F = qvBsinθ.",
      "θ is between velocity and magnetic field.",
      "θ = 90° gives maximum force.",
      "θ = 0° gives zero force.",
    ],
    traps: [
      "Using cos instead of sin.",
      "Forgetting stationary charge has no magnetic force.",
      "Ignoring the angle.",
    ],
    clips: [
      ["🏃", "Moving Charge", "Charge moves.", "B field acts.", "Magnetic force appears."],
      ["📐", "Angle", "90° max.", "0° zero.", "Use sinθ."],
    ],
    flashcards: [
      ["Magnetic force formula?", "F = qvBsinθ."],
      ["Unit of B?", "Tesla."],
      ["Max force angle?", "90°."],
      ["Zero force angle?", "0° or 180°."],
      ["Stationary charge?", "No magnetic force."],
      ["Quiz clue?", "Moving charge in magnetic field."],
    ],
    brainrot: [
      {
        q: "A charge sitting still in a magnetic field feels:",
        choices: ["No magnetic force", "Max force", "Voltage", "A vibe shift"],
        a: "No magnetic force",
        why: "Magnetic force requires velocity: F = qvBsinθ.",
      },
    ],
  },
  {
    number: 30,
    title: "Electromagnetic Induction",
    formula: "ε = -NΔΦB/Δt",
    objective: "Understand induced emf from changing magnetic flux.",
    clues: ["induction", "emf", "Faraday", "Lenz", "coil", "turns", "changing flux"],
    guide: [
      "Changing magnetic flux creates induced emf.",
      "Use |ε| = NΔΦB/Δt for magnitude.",
      "More turns means larger emf.",
      "Faster flux change means larger emf.",
      "Negative sign means Lenz’s Law: oppose the change.",
    ],
    traps: [
      "No changing flux means no emf.",
      "The negative sign is direction.",
      "Flux can change by B, area, angle, or motion.",
    ],
    clips: [
      ["🧲", "Moving Magnet", "Magnet moves.", "Flux changes.", "Voltage appears."],
      ["🙅", "Lenz", "Induced current fights back.", "Opposes change.", "Negative sign."],
    ],
    flashcards: [
      ["Faraday’s Law?", "ε = -NΔΦB/Δt."],
      ["What creates induced emf?", "Changing magnetic flux."],
      ["What does N mean?", "Number of turns."],
      ["More turns means?", "More emf."],
      ["Lenz’s Law?", "Induced effect opposes the change."],
      ["Quiz clue?", "Changing flux, emf, coil."],
    ],
    brainrot: [
      {
        q: "No changing magnetic flux means:",
        choices: ["No induced emf", "Infinite voltage", "Capacitance", "The coil gets promoted"],
        a: "No induced emf",
        why: "Induction needs change. No change = no induced voltage.",
      },
    ],
  },
  {
    number: 31,
    title: "Electromagnetic Waves",
    formula: "c = fλ",
    objective: "Use light-wave relationships and understand EM waves.",
    clues: ["light", "electromagnetic wave", "vacuum", "frequency", "wavelength", "speed of light"],
    guide: [
      "Light is an electromagnetic wave.",
      "Use c = fλ.",
      "Use c = 3.00 × 10⁸ m/s in vacuum.",
      "Solve for wavelength with λ = c/f.",
      "Solve for frequency with f = c/λ.",
    ],
    traps: [
      "Do not use sound speed for light.",
      "High frequency means short wavelength.",
      "EM waves can travel in vacuum.",
    ],
    clips: [
      ["⚡", "Electric Field", "E field wiggles.", "Part of light.", "EM wave."],
      ["🧲", "Magnetic Field", "B field wiggles.", "Travels with E.", "Light is E + B."],
      ["💡", "Light Speed", "c = 3e8.", "c = fλ.", "Use c for light."],
    ],
    flashcards: [
      ["What is light?", "An electromagnetic wave."],
      ["Speed of light?", "3.00 × 10⁸ m/s."],
      ["Light formula?", "c = fλ."],
      ["Solve for wavelength?", "λ = c/f."],
      ["Solve for frequency?", "f = c/λ."],
      ["Can EM waves travel in vacuum?", "Yes."],
      ["High frequency means?", "Short wavelength."],
    ],
    brainrot: [
      {
        q: "For light problems, the speed is:",
        choices: ["3.00 × 10⁸ m/s", "343 m/s", "9.8 m/s²", "whatever Mercury is in"],
        a: "3.00 × 10⁸ m/s",
        why: "343 m/s is sound in air. Light uses c.",
      },
    ],
  },
  {
    number: 32,
    title: "Final Review",
    formula: "Clue words → variables → formula → units",
    objective: "Review all problem types and practice formula selection.",
    clues: ["final", "review", "mixed problem", "formula selection"],
    guide: [
      "Do not start with random formulas.",
      "Circle clue words.",
      "Label variables.",
      "Write unknown.",
      "Pick formula.",
      "Rearrange before substituting.",
      "Check units.",
    ],
    traps: [
      "Skipping units.",
      "Not identifying unknown.",
      "Using the wrong chapter formula because two problems share similar words.",
    ],
    clips: [
      ["🧠", "Final Mode", "Clue words first.", "Formula second.", "Units last."],
      ["🏆", "Exam Strategy", "Slow is smooth.", "Smooth is fast.", "GIVEN → MATH → SOLUTION."],
    ],
    flashcards: [
      ["First move on any problem?", "Circle clue words."],
      ["Second move?", "List givens and units."],
      ["Third move?", "Write unknown."],
      ["Before plugging in?", "Rearrange formula."],
      ["Last move?", "Check units and box answer."],
    ],
    brainrot: [
      {
        q: "The final boss strategy is:",
        choices: ["Clues → variables → formula → units", "Panic → vibes → guess", "Only memorize one formula", "Cry in radians"],
        a: "Clues → variables → formula → units",
        why: "This works across the entire syllabus.",
      },
    ],
  },
  {
    number: 33,
    title: "Remaining Final Topic",
    formula: "Use chapter clues and formula map",
    objective: "Apply the same structured method to remaining final content.",
    clues: ["remaining topic", "final", "review"],
    guide: [
      "Use the same universal method.",
      "Find clue words.",
      "Label variables.",
      "Use the formula map.",
      "Check units.",
    ],
    traps: [
      "Assuming a formula without reading the wording.",
      "Skipping the variable labels.",
    ],
    clips: [
      ["🧩", "Unknown Topic", "Break it into clues.", "Match formula.", "Solve one step at a time."],
    ],
    flashcards: [
      ["Universal method?", "GIVEN → MATH → SOLUTION."],
      ["How do you pick formula?", "Use clue words."],
      ["What should every answer have?", "Units."],
    ],
    brainrot: [
      {
        q: "When the chapter feels unfamiliar, what do you do first?",
        choices: ["Find clue words", "Guess", "Scroll TikTok", "Use every formula at once"],
        a: "Find clue words",
        why: "Clue words are the formula GPS.",
      },
    ],
  },
];



const CH16_OPTIMIZED_GAME_ROUNDS = [
  {
    skill: "Traveling Wave Equation",
    prompt: "You are given a wave function D(x,t). What is the test for whether it can represent a traveling wave?",
    choices: [
      "Check whether ∂²D/∂x² = (1/v²)∂²D/∂t²",
      "Check whether V = IR",
      "Check whether F = qE",
      "Check whether C = Q/ΔV"
    ],
    answer: "Check whether ∂²D/∂x² = (1/v²)∂²D/∂t²",
    teach: "This is the wave-equation test. If the function satisfies it, the disturbance can travel with speed v.",
  },
  {
    skill: "Partial Derivatives",
    prompt: "When taking ∂²D/∂x², what variable do you treat like a constant?",
    choices: ["t", "x", "D", "v"],
    answer: "t",
    teach: "For x-derivatives, time t is frozen. You only look at how the wave changes across position.",
  },
  {
    skill: "Partial Derivatives",
    prompt: "When taking ∂²D/∂t², what variable do you treat like a constant?",
    choices: ["x", "t", "λ", "f"],
    answer: "x",
    teach: "For time-derivatives, position x is frozen. You only look at how one location changes over time.",
  },
  {
    skill: "Wave Speed From Function",
    prompt: "If D = cx² + dt², then ∂²D/∂x² = 2c and ∂²D/∂t² = 2d. What speed comes from the wave equation?",
    choices: ["v = √(d/c)", "v = √(c/d)", "v = d/c", "v = c/d"],
    answer: "v = √(d/c)",
    teach: "Plug into 2c = (1/v²)(2d). Then v² = d/c, so v = √(d/c).",
  },
  {
    skill: "Wave Equation Trap",
    prompt: "A student takes only first derivatives to test a traveling wave. What is wrong?",
    choices: [
      "The wave equation uses second derivatives",
      "The wave equation uses Ohm’s Law",
      "The wave equation only works for light",
      "Nothing is wrong"
    ],
    answer: "The wave equation uses second derivatives",
    teach: "Mastering-style proof questions often test whether you know it is ∂²/∂x² and ∂²/∂t², not first derivatives.",
  },
  {
    skill: "String Wave Speed",
    prompt: "A transverse wave travels on a string. Which quantities control the wave speed?",
    choices: [
      "Tension T and linear density μ",
      "Frequency and color",
      "Voltage and resistance",
      "Charge and distance"
    ],
    answer: "Tension T and linear density μ",
    teach: "For a string, v = √(T/μ). More tension makes waves faster; more linear density makes waves slower.",
  },
  {
    skill: "String Tension Ratio",
    prompt: "Same string: speed changes from v₁ to v₂. Why does tension use a squared ratio?",
    choices: [
      "Because v = √(T/μ)",
      "Because v = fλ",
      "Because c = fλ",
      "Because frequency stays constant"
    ],
    answer: "Because v = √(T/μ)",
    teach: "If v depends on √T, then T depends on v². That is why T₂ = T₁(v₂/v₁)².",
  },
  {
    skill: "String Tension Ratio",
    prompt: "Same string: v₁ = 148 m/s, T₁ = 73.0 N, v₂ = 179 m/s. Which setup is correct?",
    choices: [
      "T₂ = 73.0(179/148)²",
      "T₂ = 73.0(148/179)²",
      "T₂ = 73.0(179/148)",
      "T₂ = 148(179/73.0)²"
    ],
    answer: "T₂ = 73.0(179/148)²",
    teach: "Use T₂ = T₁(v₂/v₁)². New speed over old speed, then square.",
  },
  {
    skill: "String Tension Ratio",
    prompt: "Same string: speed increases from 148 m/s to 179 m/s. What should happen to tension?",
    choices: [
      "It increases by more than the speed ratio",
      "It increases by exactly the speed ratio",
      "It decreases",
      "It stays the same"
    ],
    answer: "It increases by more than the speed ratio",
    teach: "Because the speed ratio gets squared. A moderate speed increase needs a bigger tension increase.",
  },
  {
    skill: "Hanging Rope Model",
    prompt: "A rope hangs from the ceiling. At height y above the bottom, what creates the tension there?",
    choices: [
      "The weight of the rope below that point",
      "The weight of the rope above that point",
      "The wave speed only",
      "The full ceiling force only"
    ],
    answer: "The weight of the rope below that point",
    teach: "At height y from the bottom, the lower segment has mass μy, so T = μyg.",
  },
  {
    skill: "Hanging Rope Model",
    prompt: "For a hanging rope, T(y) = μyg. Put that into v = √(T/μ). What do you get?",
    choices: ["v = √(gy)", "v = μgy", "v = √(μgy)", "v = gy/μ"],
    answer: "v = √(gy)",
    teach: "The μ cancels: v = √(μyg/μ) = √(gy).",
  },
  {
    skill: "Hanging Rope Proof Trap",
    prompt: "Which proof choice is automatically suspicious?",
    choices: [
      "One that uses μ² or v dy",
      "One that uses T = μyg",
      "One that uses v = √(T/μ)",
      "One that uses dt = dy/v"
    ],
    answer: "One that uses μ² or v dy",
    teach: "The correct proof uses T = μyg, v = √(T/μ), and dt = dy/v. μ² and v dy are trap moves.",
  },
  {
    skill: "Hanging Rope Integration",
    prompt: "If v(y)=√(gy), what is the correct tiny time step?",
    choices: ["dt = dy/√(gy)", "dt = √(gy)dy", "dt = dy/(2√gy)", "dt = ½√(gy)dy"],
    answer: "dt = dy/√(gy)",
    teach: "Time = distance/speed. Since speed changes with y, use dt = dy/v(y).",
  },
  {
    skill: "Hanging Rope Integration",
    prompt: "The travel time integral ∫₀ᴸ dy/√(gy) becomes:",
    choices: ["2√(L/g)", "√(Lg)", "L/g", "2L/g"],
    answer: "2√(L/g)",
    teach: "Pull out 1/√g and integrate y^-1/2. You get 2√(L/g).",
  },
  {
    skill: "Snapshot vs History Graph",
    prompt: "A graph of displacement D versus position x at one instant is a:",
    choices: ["Snapshot graph", "History graph", "Circuit graph", "Flux graph"],
    answer: "Snapshot graph",
    teach: "Snapshot graph = what the whole wave looks like in space at one frozen time.",
  },
  {
    skill: "Snapshot vs History Graph",
    prompt: "A graph of displacement D versus time t at one fixed position is a:",
    choices: ["History graph", "Snapshot graph", "Voltage graph", "Refraction graph"],
    answer: "History graph",
    teach: "History graph = what one point does as the wave passes by.",
  },
  {
    skill: "Left-Moving Wave Graphs",
    prompt: "A wave pulse is moving left toward x = 0. Which feature reaches x = 0 first?",
    choices: [
      "The feature closest to x = 0 on the left side",
      "The feature farthest right",
      "The highest point always",
      "The lowest point always"
    ],
    answer: "The feature closest to x = 0 on the left side",
    teach: "For left-moving waves heading toward x = 0, features with smaller x arrive first.",
  },
  {
    skill: "Left-Moving Wave Graphs",
    prompt: "A sharp vertical edge in a snapshot graph passes a fixed point. What can the history graph show?",
    choices: [
      "An instant jump",
      "Only a smooth sine wave",
      "Only a negative displacement",
      "No motion"
    ],
    answer: "An instant jump",
    teach: "Sharp spatial edges can become sudden time jumps when they pass the observer.",
  },
  {
    skill: "Arrival Time",
    prompt: "A wave feature at x = 5 m travels left to x = 0 at 1.0 m/s. When does it arrive?",
    choices: ["5 s", "1 s", "0.2 s", "10 s"],
    answer: "5 s",
    teach: "Use t = distance/speed = 5 m / 1.0 m/s = 5 s.",
  },
  {
    skill: "Spherical Wave Number",
    prompt: "For spherical wave phase problems, what should you calculate first from wavelength?",
    choices: ["k = 2π/λ", "f = 1/T", "P = IV", "R = V/I"],
    answer: "k = 2π/λ",
    teach: "Wave number k tells how fast phase changes with distance.",
  },
  {
    skill: "Spherical Phase",
    prompt: "You know phase φ_ref at r_ref and need phase at r. What is the main structure?",
    choices: [
      "φ(r) = φ_ref ± k(r - r_ref)",
      "φ = EAcosθ",
      "φ = IR",
      "φ = qV"
    ],
    answer: "φ(r) = φ_ref ± k(r - r_ref)",
    teach: "Phase changes with position. The sign depends on the wave convention and coordinate direction.",
  },
  {
    skill: "Phase Modulo Trap",
    prompt: "Your phase answer is 1.75π, but the system wants (-π,π]. What equivalent answer should you try?",
    choices: ["-0.25π", "0.25π", "3.75π", "1.75π²"],
    answer: "-0.25π",
    teach: "Subtract 2π: 1.75π - 2π = -0.25π. Same physical phase, different allowed range.",
  },
  {
    skill: "Light Wave Equation",
    prompt: "Blue light has wavelength 450 nm. What equation finds its frequency?",
    choices: ["f = c/λ", "f = λ/c", "n = λ_material/λ_vacuum", "V = IR"],
    answer: "f = c/λ",
    teach: "For light in vacuum/air, c = fλ, so f = c/λ.",
  },
  {
    skill: "Unit Conversion",
    prompt: "Before using 450 nm in c = fλ, convert it to:",
    choices: ["450 × 10⁻⁹ m", "450 × 10⁹ m", "450 m", "450 s"],
    answer: "450 × 10⁻⁹ m",
    teach: "Nanometers must become meters. This is a huge Mastering-style unit trap.",
  },
  {
    skill: "Light Frequency",
    prompt: "450 nm blue light has frequency closest to:",
    choices: ["6.67 × 10¹⁴ Hz", "4.62 × 10¹⁴ Hz", "1.44 Hz", "450 Hz"],
    answer: "6.67 × 10¹⁴ Hz",
    teach: "f = (3.00×10⁸)/(450×10⁻⁹) = 6.67×10¹⁴ Hz.",
  },
  {
    skill: "Light Frequency",
    prompt: "650 nm red light has frequency closest to:",
    choices: ["4.62 × 10¹⁴ Hz", "6.67 × 10¹⁴ Hz", "1.44 × 10¹⁴ Hz", "650 Hz"],
    answer: "4.62 × 10¹⁴ Hz",
    teach: "f = (3.00×10⁸)/(650×10⁻⁹) = 4.62×10¹⁴ Hz.",
  },
  {
    skill: "Refraction",
    prompt: "When light enters a material, what stays the same?",
    choices: ["Frequency", "Wavelength", "Speed", "Index of refraction"],
    answer: "Frequency",
    teach: "Frequency is set by the source. Speed and wavelength change inside the material.",
  },
  {
    skill: "Index of Refraction",
    prompt: "Red light has λ_vacuum = 650 nm and λ_material = 450 nm. What formula gives n?",
    choices: [
      "n = λ_vacuum/λ_material",
      "n = λ_material/λ_vacuum",
      "n = fλ",
      "n = λf/c"
    ],
    answer: "n = λ_vacuum/λ_material",
    teach: "Index measures wavelength shrinkage: n = 650/450 = 1.44.",
  },
  {
    skill: "Index of Refraction",
    prompt: "If wavelength gets shorter inside a material, the index of refraction is:",
    choices: ["Greater than 1", "Less than 1", "Always 0", "Measured in Hz"],
    answer: "Greater than 1",
    teach: "Normal materials have n > 1. Shorter wavelength means slower light in the material.",
  },
  {
    skill: "Problem-Solving Strategy",
    prompt: "What is the first move when a problem mixes nm, m/s, cm, or ms?",
    choices: [
      "Convert to SI units",
      "Round immediately",
      "Ignore units",
      "Use the longest formula"
    ],
    answer: "Convert to SI units",
    teach: "Convert nm → m, ms → s, cm → m. Most wrong answers come from unit powers of ten.",
  },
  {
    skill: "Problem-Solving Strategy",
    prompt: "If a phase answer looks right but is marked wrong, what should you check?",
    choices: [
      "Sign convention and modulo range",
      "Only significant figures",
      "Only tension",
      "Only graph labels"
    ],
    answer: "Sign convention and modulo range",
    teach: "Phase answers can be equivalent modulo 2π. Also check whether the system expects phase to increase or decrease with r.",
  }
];


const TEACHING_GAMES = {
  "16": {
    name: "Knight Mode: Wave Model Lab",
    mission: "Model the wave first: identify what is oscillating, what travels, and which wave equation fits.",
    rounds: [
      {
        prompt: "MODEL CHECK: A student says, “The string moves across the room with the wave.” What is actually traveling?",
        choices: ["Energy and pattern", "The entire string", "Only tension", "Only frequency"],
        answer: "Energy and pattern",
        teach: "In Knight-style wave thinking, the medium oscillates locally while the disturbance/energy travels. The string particles wiggle; the wave moves.",
      },
      {
        prompt: "VARIABLE SORT: Problem gives f = 12 Hz and λ = 0.80 m. What model equation is screaming at you?",
        choices: ["v = fλ", "f = 1/T only", "F = qvBsinθ", "C = Q/ΔV"],
        answer: "v = fλ",
        teach: "Frequency plus wavelength plus speed belongs to the traveling-wave model: v = fλ.",
      },
      {
        prompt: "REPRESENTATION: A graph shows displacement vs position at one instant. What kind of graph is that?",
        choices: ["Snapshot graph", "History graph", "Circuit diagram", "Flux map"],
        answer: "Snapshot graph",
        teach: "Knight separates snapshot graphs from history graphs. Snapshot = shape of the wave in space at one instant.",
      },
      {
        prompt: "REPRESENTATION: A graph shows displacement vs time at one point. What kind of graph is that?",
        choices: ["History graph", "Snapshot graph", "Gauss surface", "Potential map"],
        answer: "History graph",
        teach: "History graph = what one point does as time passes.",
      },
      {
        prompt: "MODEL CHECK: Same string, old speed v₁, old tension T₁, new speed v₂. Which shortcut is valid?",
        choices: ["T₂ = T₁(v₂/v₁)²", "T₂ = T₁(v₂/v₁)", "T₂ = T₁(v₁/v₂)", "T₂ = T₁ + v₂"],
        answer: "T₂ = T₁(v₂/v₁)²",
        teach: "Because v = √(T/μ). For the same string, μ is constant, so tension scales with speed squared.",
      },
      {
        prompt: "PHASE MODEL: A problem gives λ and asks phase at a different r position. What should you find first?",
        choices: ["k = 2π/λ", "P = IV", "R_total", "q_enc"],
        answer: "k = 2π/λ",
        teach: "Phase changes with position through the wave number k. First find k, then use distance change.",
      }
    ],
  },

  "22": {
    name: "Knight Mode: Charge Interaction Arena",
    mission: "Build the charge model: signs tell direction, Coulomb’s Law gives magnitude.",
    rounds: [
      {
        prompt: "MODEL CHECK: Two positive charges are placed near each other. What is the interaction?",
        choices: ["Repulsive", "Attractive", "No force", "Magnetic only"],
        answer: "Repulsive",
        teach: "Same signs repel. That is the qualitative model before doing any math.",
      },
      {
        prompt: "MODEL CHECK: A positive and negative charge are placed near each other. What is the interaction?",
        choices: ["Attractive", "Repulsive", "No force", "Only voltage"],
        answer: "Attractive",
        teach: "Opposite signs attract. Direction comes from sign before number-crunching.",
      },
      {
        prompt: "EQUATION PICK: Two point charges separated by distance r. Which model equation?",
        choices: ["F = k|q₁q₂|/r²", "E = F/q", "V = IR", "ε = -NΔΦ/Δt"],
        answer: "F = k|q₁q₂|/r²",
        teach: "Point charges separated by distance means Coulomb’s Law.",
      },
      {
        prompt: "PROPORTIONAL REASONING: Distance doubles. What happens to electric force?",
        choices: ["Becomes 1/4 as large", "Becomes 1/2 as large", "Doubles", "Stays same"],
        answer: "Becomes 1/4 as large",
        teach: "Coulomb force is inverse-square. Double r means divide force by 2² = 4.",
      },
      {
        prompt: "MASTERING TRAP: A charge is given in μC. Before using Coulomb’s Law, what must you do?",
        choices: ["Convert μC to C", "Square the charge", "Change it to volts", "Ignore the prefix"],
        answer: "Convert μC to C",
        teach: "Mastering problems love unit prefixes. μC = 10⁻⁶ C.",
      }
    ],
  },

  "23": {
    name: "Knight Mode: Electric Field Mapper",
    mission: "Think field first: a source creates a field; a test charge feels force.",
    rounds: [
      {
        prompt: "MODEL CHECK: Electric field means:",
        choices: ["Force per charge", "Energy per charge", "Charge per volt", "Current per resistance"],
        answer: "Force per charge",
        teach: "Electric field is defined as E = F/q. It tells force per coulomb.",
      },
      {
        prompt: "REPRESENTATION: Field arrows around a positive source charge point:",
        choices: ["Away from the charge", "Toward the charge", "In circles", "Randomly"],
        answer: "Away from the charge",
        teach: "Field direction is the direction a positive test charge would be pushed.",
      },
      {
        prompt: "REPRESENTATION: Field arrows around a negative source charge point:",
        choices: ["Toward the charge", "Away from the charge", "Clockwise", "Nowhere"],
        answer: "Toward the charge",
        teach: "A positive test charge is attracted toward a negative source, so field points inward.",
      },
      {
        prompt: "EQUATION PICK: You know q and E and need force.",
        choices: ["F = qE", "E = q/F", "V = U/q", "P = IV"],
        answer: "F = qE",
        teach: "Start from E = F/q and rearrange to F = qE.",
      },
      {
        prompt: "SIGN CHECK: A negative charge in an electric field feels force:",
        choices: ["Opposite the field direction", "With the field direction", "Always upward", "No force"],
        answer: "Opposite the field direction",
        teach: "Field direction is based on positive charge. Negative charges feel force opposite E.",
      }
    ],
  },

  "24": {
    name: "Knight Mode: Flux Door Simulator",
    mission: "Visualize field lines going through surfaces, then choose flux or Gauss’s Law.",
    rounds: [
      {
        prompt: "CONCEPT MODEL: Electric flux means:",
        choices: ["Field passing through an area", "Force per charge", "Energy per charge", "Current in a resistor"],
        answer: "Field passing through an area",
        teach: "Flux is about how much field pierces a surface.",
      },
      {
        prompt: "ANGLE CHECK: Field is perpendicular to the surface area vector, θ = 90°. Flux is:",
        choices: ["Zero", "Maximum", "Always negative", "Infinite"],
        answer: "Zero",
        teach: "Φ = EAcosθ. cos90° = 0, so flux is zero.",
      },
      {
        prompt: "ANGLE CHECK: Field is parallel to the area vector, θ = 0°. Flux is:",
        choices: ["Maximum", "Zero", "Half", "Impossible"],
        answer: "Maximum",
        teach: "cos0° = 1, so the full field contributes to flux.",
      },
      {
        prompt: "EQUATION PICK: Problem says closed surface and enclosed charge. Use:",
        choices: ["Φ = q_enc/ε₀", "Φ = EA only every time", "P = IV", "v = fλ"],
        answer: "Φ = q_enc/ε₀",
        teach: "Closed surface + enclosed charge is Gauss’s Law.",
      },
      {
        prompt: "GAUSS TRAP: A charge sits outside the closed surface. It contributes how much to total flux?",
        choices: ["Zero net flux contribution", "All the flux", "Half the flux", "Only if positive"],
        answer: "Zero net flux contribution",
        teach: "External charges can affect local field, but total flux through a closed surface depends only on enclosed charge.",
      }
    ],
  },

  "25": {
    name: "Knight Mode: Potential Energy Elevator",
    mission: "Separate electric potential from electric field using energy reasoning.",
    rounds: [
      {
        prompt: "MODEL CHECK: Electric potential/voltage means:",
        choices: ["Energy per charge", "Force per charge", "Charge per time", "Resistance per current"],
        answer: "Energy per charge",
        teach: "Voltage is V = U/q. It is energy per coulomb.",
      },
      {
        prompt: "EQUATION PICK: You know q and ΔV and need change in potential energy.",
        choices: ["ΔU = qΔV", "F = qE", "P = IV", "C = Q/ΔV"],
        answer: "ΔU = qΔV",
        teach: "Potential energy change is charge times potential difference.",
      },
      {
        prompt: "CONCEPT CHECK: Electric potential is:",
        choices: ["Scalar", "Vector", "Always negative", "Measured in tesla"],
        answer: "Scalar",
        teach: "Potential has value but no direction. Electric field is vector.",
      },
      {
        prompt: "REPRESENTATION: Equipotential lines are lines where:",
        choices: ["Voltage is the same", "Electric field is zero", "Current is maximum", "Charge disappears"],
        answer: "Voltage is the same",
        teach: "Equipotential means same potential everywhere along the line.",
      },
      {
        prompt: "TRAP CHECK: Voltage and electric field are:",
        choices: ["Related but not the same", "Exactly the same", "Both measured in amps", "Only for circuits"],
        answer: "Related but not the same",
        teach: "Voltage is energy per charge. Electric field is force per charge.",
      }
    ],
  },

  "26": {
    name: "Knight Mode: Capacitor Plate Builder",
    mission: "Track C, Q, ΔV, plate geometry, and dielectrics.",
    rounds: [
      {
        prompt: "MODEL CHECK: A capacitor primarily stores:",
        choices: ["Separated charge and electric energy", "Magnetic poles", "Frequency", "Resistance"],
        answer: "Separated charge and electric energy",
        teach: "Capacitors store charge on plates and energy in the electric field.",
      },
      {
        prompt: "EQUATION PICK: Capacitance definition:",
        choices: ["C = Q/ΔV", "V = IR", "F = qvBsinθ", "v = fλ"],
        answer: "C = Q/ΔV",
        teach: "Capacitance is charge stored per voltage difference.",
      },
      {
        prompt: "REARRANGE: You know C and ΔV. Find Q.",
        choices: ["Q = CΔV", "Q = C/ΔV", "Q = ΔV/C", "Q = IR"],
        answer: "Q = CΔV",
        teach: "Multiply both sides of C = Q/ΔV by ΔV.",
      },
      {
        prompt: "DIELECTRIC CHECK: Adding a dielectric generally:",
        choices: ["Increases capacitance", "Makes capacitance zero", "Turns charge into current", "Removes voltage forever"],
        answer: "Increases capacitance",
        teach: "A dielectric reduces the effective field for the same free charge, allowing more charge per volt.",
      },
      {
        prompt: "PLATE MODEL: Increasing plate area usually makes capacitance:",
        choices: ["Increase", "Decrease", "Stay zero", "Become magnetic"],
        answer: "Increase",
        teach: "Larger plates can store more charge, so capacitance increases.",
      }
    ],
  },

  "27": {
    name: "Knight Mode: Current-Resistance Traffic Lab",
    mission: "Use the circuit model: voltage pushes, resistance opposes, current flows.",
    rounds: [
      {
        prompt: "MODEL CHECK: Current is:",
        choices: ["Charge flow per time", "Energy per charge", "Force per charge", "Magnetic flux"],
        answer: "Charge flow per time",
        teach: "Current is rate of charge flow.",
      },
      {
        prompt: "MODEL CHECK: Voltage acts like:",
        choices: ["A push for charge", "A roadblock", "A magnetic field", "A wave crest"],
        answer: "A push for charge",
        teach: "Voltage provides the energy difference that drives current.",
      },
      {
        prompt: "MODEL CHECK: Resistance acts like:",
        choices: ["Opposition to current", "Extra charge", "A battery", "Frequency"],
        answer: "Opposition to current",
        teach: "Resistance limits current for a given voltage.",
      },
      {
        prompt: "EQUATION PICK: Ohm’s Law:",
        choices: ["V = IR", "P = IV only", "F = kq/r²", "ε = -NΔΦ/Δt"],
        answer: "V = IR",
        teach: "Voltage, current, and resistance belong to Ohm’s Law.",
      },
      {
        prompt: "PROPORTIONAL REASONING: Same voltage, bigger resistance. Current:",
        choices: ["Decreases", "Increases", "Stays infinite", "Turns into voltage"],
        answer: "Decreases",
        teach: "I = V/R. Larger R means smaller I.",
      }
    ],
  },

  "28": {
    name: "Knight Mode: Circuit Strategy Board",
    mission: "Identify series/parallel structure before calculating.",
    rounds: [
      {
        prompt: "REPRESENTATION: One path for current. This is:",
        choices: ["Series", "Parallel", "Gauss surface", "Induction"],
        answer: "Series",
        teach: "Series circuit means one path; same current through all elements.",
      },
      {
        prompt: "REPRESENTATION: Multiple branches between the same two nodes. This is:",
        choices: ["Parallel", "Series", "Coulomb interaction", "Wave phase"],
        answer: "Parallel",
        teach: "Parallel branches share the same voltage.",
      },
      {
        prompt: "SERIES RULE: In series, what is the same?",
        choices: ["Current", "Voltage across each resistor", "Resistance", "Power"],
        answer: "Current",
        teach: "There is only one path, so the same current passes through each element.",
      },
      {
        prompt: "PARALLEL RULE: In parallel, what is the same?",
        choices: ["Voltage", "Current in every branch", "Resistance of every branch", "Power"],
        answer: "Voltage",
        teach: "Parallel branches connect across the same two points, so they share voltage.",
      },
      {
        prompt: "POWER MODEL: Electrical power formula:",
        choices: ["P = IV", "P = fλ", "P = q/r²", "P = CΔV"],
        answer: "P = IV",
        teach: "Power is energy transfer rate in a circuit.",
      },
      {
        prompt: "MASTERING TRAP: Parallel resistors combine using:",
        choices: ["Reciprocals", "Direct addition", "Sine", "Logarithms"],
        answer: "Reciprocals",
        teach: "For parallel: 1/R_total = 1/R₁ + 1/R₂ + ...",
      }
    ],
  },

  "29": {
    name: "Knight Mode: Magnetic Force Direction Lab",
    mission: "Check motion, angle, and field before using magnetic force.",
    rounds: [
      {
        prompt: "MODEL CHECK: A stationary charge in a magnetic field feels:",
        choices: ["No magnetic force", "Maximum magnetic force", "Electric potential only", "Infinite force"],
        answer: "No magnetic force",
        teach: "Magnetic force needs motion. If v = 0, F = qvBsinθ = 0.",
      },
      {
        prompt: "ANGLE CHECK: v is perpendicular to B. Force is:",
        choices: ["Maximum", "Zero", "Half", "Only negative"],
        answer: "Maximum",
        teach: "sin90° = 1, so magnetic force is maximum.",
      },
      {
        prompt: "ANGLE CHECK: v is parallel to B. Force is:",
        choices: ["Zero", "Maximum", "Equal to qE", "Voltage"],
        answer: "Zero",
        teach: "sin0° = 0, so magnetic force is zero.",
      },
      {
        prompt: "EQUATION PICK: Moving charge in magnetic field:",
        choices: ["F = qvBsinθ", "F = kq₁q₂/r²", "E = F/q", "V = IR"],
        answer: "F = qvBsinθ",
        teach: "Magnetic force on a moving charge depends on q, v, B, and the angle.",
      },
      {
        prompt: "DIRECTION MODEL: Magnetic force is generally:",
        choices: ["Perpendicular to velocity and field", "Always with velocity", "Always with field", "Always downward"],
        answer: "Perpendicular to velocity and field",
        teach: "Magnetic force direction uses the right-hand rule and is perpendicular to v and B.",
      }
    ],
  },

  "30": {
    name: "Knight Mode: Faraday Flux Change Lab",
    mission: "Identify what changes flux: B, area, angle, or time.",
    rounds: [
      {
        prompt: "MODEL CHECK: Induced emf requires:",
        choices: ["Changing magnetic flux", "Constant magnetic flux", "Only a resistor", "Only a charge sitting still"],
        answer: "Changing magnetic flux",
        teach: "Faraday’s Law is about change. No flux change means no induced emf.",
      },
      {
        prompt: "EQUATION PICK: Faraday’s Law magnitude:",
        choices: ["|ε| = NΔΦB/Δt", "V = IR", "C = Q/ΔV", "c = fλ"],
        answer: "|ε| = NΔΦB/Δt",
        teach: "Induced emf grows with turns and rate of flux change.",
      },
      {
        prompt: "PROPORTIONAL REASONING: More coil turns N means:",
        choices: ["Larger induced emf", "Smaller induced emf always", "Zero emf", "No relationship"],
        answer: "Larger induced emf",
        teach: "|ε| is proportional to N.",
      },
      {
        prompt: "PROPORTIONAL REASONING: Same flux change in less time means:",
        choices: ["Larger emf", "Smaller emf", "No emf", "Same emf always"],
        answer: "Larger emf",
        teach: "A faster change means bigger ΔΦ/Δt.",
      },
      {
        prompt: "LENZ MODEL: Lenz’s Law says the induced effect:",
        choices: ["Opposes the change", "Helps the change", "Ignores the change", "Cancels resistance only"],
        answer: "Opposes the change",
        teach: "The negative sign in Faraday’s Law represents opposition to the change.",
      }
    ],
  },

  "31": {
    name: "Knight Mode: Electromagnetic Wave Trap Lab",
    mission: "Use c = fλ and avoid confusing light with sound.",
    rounds: [
      {
        prompt: "MODEL CHECK: An electromagnetic wave can travel:",
        choices: ["Through vacuum", "Only through air", "Only through string", "Only through circuits"],
        answer: "Through vacuum",
        teach: "EM waves do not need a material medium.",
      },
      {
        prompt: "EQUATION PICK: Light wave relationship:",
        choices: ["c = fλ", "v = IR", "F = qE", "Φ = EAcosθ"],
        answer: "c = fλ",
        teach: "For light/EM waves in vacuum, speed is c.",
      },
      {
        prompt: "CONSTANT CHECK: Speed of light in vacuum:",
        choices: ["3.00 × 10⁸ m/s", "343 m/s", "9.8 m/s²", "1.60 × 10⁻¹⁹ C"],
        answer: "3.00 × 10⁸ m/s",
        teach: "343 m/s is sound in air. Light uses c = 3.00 × 10⁸ m/s.",
      },
      {
        prompt: "PROPORTIONAL REASONING: If frequency increases while c stays fixed, wavelength:",
        choices: ["Decreases", "Increases", "Stays infinite", "Turns into current"],
        answer: "Decreases",
        teach: "c = fλ. If f goes up, λ goes down.",
      },
      {
        prompt: "REPRESENTATION: EM waves contain oscillating:",
        choices: ["Electric and magnetic fields", "Only sound pressure", "Only charges moving in a wire", "Only voltage drops"],
        answer: "Electric and magnetic fields",
        teach: "Electromagnetic waves are coupled electric and magnetic field oscillations.",
      }
    ],
  },

  "32": {
    name: "Knight Mode: Final Formula Sorting Boss",
    mission: "Use clue words to choose the model before math.",
    rounds: [
      {
        prompt: "Clues: frequency, wavelength, wave speed. Choose model.",
        choices: ["Traveling wave", "Ohm’s Law", "Gauss’s Law", "Capacitor"],
        answer: "Traveling wave",
        teach: "Frequency + wavelength + speed = wave model, usually v = fλ.",
      },
      {
        prompt: "Clues: voltage, current, resistance. Choose model.",
        choices: ["Circuit/Ohm model", "Wave phase model", "Magnetic force model", "Coulomb model"],
        answer: "Circuit/Ohm model",
        teach: "Voltage/current/resistance = V = IR.",
      },
      {
        prompt: "Clues: moving charge, magnetic field, angle. Choose model.",
        choices: ["Magnetic force model", "Capacitance model", "Electric potential model", "Flux through area"],
        answer: "Magnetic force model",
        teach: "Moving charge through B field = F = qvBsinθ.",
      },
      {
        prompt: "Clues: closed surface, enclosed charge. Choose model.",
        choices: ["Gauss’s Law", "Ohm’s Law", "EM wave", "Log rule"],
        answer: "Gauss’s Law",
        teach: "Closed surface and enclosed charge point to Φ = q_enc/ε₀.",
      }
    ],
  },

  "33": {
    name: "Knight Mode: Unknown Problem Survival",
    mission: "Use the Strategic Approach when the problem looks cursed.",
    rounds: [
      {
        prompt: "First move on a scary physics problem:",
        choices: ["Identify the model/clue words", "Plug numbers randomly", "Ignore units", "Use every formula"],
        answer: "Identify the model/clue words",
        teach: "Knight-style solving starts with modeling the situation, not random algebra.",
      },
      {
        prompt: "Before substituting numbers, you should:",
        choices: ["Solve symbolically for the unknown", "Round everything", "Delete signs", "Skip the diagram"],
        answer: "Solve symbolically for the unknown",
        teach: "Rearrange first, then plug in. This prevents calculator chaos.",
      },
      {
        prompt: "A good final physics answer includes:",
        choices: ["Number, unit, and reasonableness check", "Only a number", "Only a formula", "Only vibes"],
        answer: "Number, unit, and reasonableness check",
        teach: "The final step is not just math. Check units and whether the answer makes sense.",
      },
      {
        prompt: "If two formulas seem possible, what helps decide?",
        choices: ["Clue words and variables", "Whichever looks cooler", "The longest equation", "Random guessing"],
        answer: "Clue words and variables",
        teach: "Match the givens and unknown to the model. That is the whole game.",
      }
    ],
  },
};

function getTeachingGame(chapter) {
  if (String(chapter.number) === "16") {
    return {
      name: "Ch. 16 Mastering Physics Boss Game",
      mission: "Train every Ch. 16 homework skill: wave equation, derivatives, string tension, hanging rope proofs, graphs, spherical phase, light, refraction, and unit traps.",
      rounds: CH16_OPTIMIZED_GAME_ROUNDS,
    };
  }

  const base = TEACHING_GAMES[String(chapter.number)] || TEACHING_GAMES["33"];
  const extras = typeof MASTERING_STYLE_EXTRA_ROUNDS !== "undefined"
    ? MASTERING_STYLE_EXTRA_ROUNDS[String(chapter.number)]
    : null;

  if (!extras) return base;

  return {
    ...base,
    name: `${base.name}: Mastering-Style Practice`,
    mission: `${base.mission} Also trains homework-style proof, graph, ratio, and unit traps.`,
    rounds: [...base.rounds, ...extras.rounds],
  };
}



const MODULE_CONCEPTS = {
  1: [
    {
      chapter: 16,
      title: "Traveling Waves",
      mustKnow: [
        "What a wave is: a traveling disturbance that carries energy",
        "Medium vs disturbance",
        "Transverse waves vs longitudinal waves",
        "Amplitude A",
        "Wavelength λ",
        "Period T",
        "Frequency f",
        "Wave speed v",
        "Relationship v = fλ",
        "Relationship f = 1/T",
        "Snapshot graph: displacement vs position",
        "History graph: displacement vs time",
        "Sinusoidal wave model",
        "Wave number k = 2π/λ",
        "Angular frequency ω = 2πf",
        "Phase and phase difference",
        "Wave speed on a string: v = √(T/μ)",
        "Same-string tension shortcut: T₂ = T₁(v₂/v₁)²",
        "Sound waves as longitudinal pressure waves",
        "Sound speed vs light speed",
        "Intensity and power spread over area",
        "Decibel level as a logarithmic scale",
        "Doppler effect basics",
      ],
      problemSkills: [
        "Given f and λ, solve v",
        "Given T, solve f",
        "Given string tension change, solve new speed or new tension",
        "Given λ and positions, solve phase change",
        "Read wave graphs without mixing up x-axis and y-axis",
        "Recognize when a problem is asking about sound, light, or a string wave",
      ],
      traps: [
        "Amplitude is not wavelength",
        "Frequency is not period",
        "Tension scales with speed squared",
        "Phase uses radians",
        "Sound speed is not light speed",
      ],
    },
    {
      chapter: 22,
      title: "Electric Charge and Electric Force",
      mustKnow: [
        "Electric charge basics",
        "Positive and negative charge",
        "Like charges repel",
        "Opposite charges attract",
        "Charge conservation",
        "Conductors vs insulators",
        "Charging by contact",
        "Charging by induction",
        "Coulomb’s Law: F = kq₁q₂/r²",
        "Coulomb constant k",
        "Point charge model",
        "Inverse-square dependence",
        "Force direction from sign",
        "Net electric force from multiple charges",
        "Vector addition of electric forces",
        "Unit conversion: μC, nC, mC to C",
      ],
      problemSkills: [
        "Identify q₁, q₂, and r",
        "Convert charge units before solving",
        "Square the distance",
        "Find magnitude first, then direction",
        "Add multiple force vectors when more than two charges appear",
      ],
      traps: [
        "Forgetting r²",
        "Using centimeters without converting to meters",
        "Letting negative signs confuse force magnitude",
        "Ignoring vector direction",
      ],
    },
    {
      chapter: 23,
      title: "Electric Field",
      mustKnow: [
        "Electric field definition: E = F/q",
        "Electric field as force per charge",
        "Source charge vs test charge",
        "Field direction uses a positive test charge",
        "Field of a point charge",
        "Electric field lines",
        "Field line spacing shows strength",
        "Superposition of electric fields",
        "Uniform electric field",
        "Force on a charge in a field: F = qE",
        "Negative charges feel force opposite E",
        "Motion of charges in uniform fields",
      ],
      problemSkills: [
        "Given F and q, solve E",
        "Given E and q, solve F",
        "Determine force direction for positive and negative charges",
        "Combine fields from multiple charges",
        "Interpret electric field diagrams",
      ],
      traps: [
        "Confusing electric field with electric force",
        "Forgetting negative charge flips force direction",
        "Not treating field as a vector",
      ],
    },
    {
      chapter: 24,
      title: "Gauss’s Law and Electric Flux",
      mustKnow: [
        "Electric flux concept",
        "Area vector",
        "Flux formula ΦE = EAcosθ",
        "Angle dependence of flux",
        "Closed surfaces",
        "Gaussian surfaces",
        "Enclosed charge q_enc",
        "Gauss’s Law: ΦE = q_enc/ε₀",
        "Permittivity of free space ε₀",
        "Symmetry arguments",
        "Spherical symmetry",
        "Cylindrical symmetry",
        "Planar symmetry",
        "Electric field of conductors in electrostatic equilibrium",
        "Charge resides on conductor surfaces",
      ],
      problemSkills: [
        "Decide between Φ = EAcosθ and Φ = q_enc/ε₀",
        "Find flux through flat surfaces",
        "Use θ = 0°, 90°, 180° correctly",
        "Identify enclosed charge",
        "Choose a Gaussian surface based on symmetry",
      ],
      traps: [
        "Using sin instead of cos",
        "Counting outside charges for total closed-surface flux",
        "Forgetting flux can be positive, negative, or zero",
        "Using Gauss’s Law without symmetry when solving for E",
      ],
    },
  ],

  2: [
    {
      chapter: 25,
      title: "Electric Potential",
      mustKnow: [
        "Electric potential energy U",
        "Electric potential V",
        "Voltage as energy per charge: V = U/q",
        "Potential difference ΔV",
        "Energy change ΔU = qΔV",
        "Potential is scalar",
        "Electric field is vector",
        "Potential from a point charge",
        "Equipotential lines/surfaces",
        "Relationship between E and V conceptually",
        "High potential vs low potential",
        "Electron behavior vs positive charge behavior",
      ],
      problemSkills: [
        "Given U and q, solve V",
        "Given q and ΔV, solve ΔU",
        "Use potential energy conservation",
        "Interpret equipotential diagrams",
        "Know when sign matters for charge",
      ],
      traps: [
        "Confusing voltage with electric field",
        "Forgetting potential is scalar",
        "Forgetting ΔU depends on q",
      ],
    },
    {
      chapter: 26,
      title: "Capacitance and Dielectrics",
      mustKnow: [
        "Capacitor purpose: stores charge and energy",
        "Capacitance definition: C = Q/ΔV",
        "Charge relationship Q = CΔV",
        "Parallel-plate capacitor model",
        "Plate area effect",
        "Plate separation effect",
        "Dielectric materials",
        "Dielectrics increase capacitance",
        "Energy stored in a capacitor",
        "Capacitors in series",
        "Capacitors in parallel",
        "Voltage and charge rules for capacitor combinations",
      ],
      problemSkills: [
        "Solve for C, Q, or ΔV",
        "Use units F, μF, C, V",
        "Know whether charge or voltage is same in series/parallel",
        "Find equivalent capacitance",
        "Predict dielectric effects",
      ],
      traps: [
        "Mixing up capacitance and charge",
        "Using V instead of ΔV without thinking",
        "Confusing capacitor series rules with resistor series rules",
      ],
    },
    {
      chapter: 27,
      title: "Current and Resistance",
      mustKnow: [
        "Current as charge flow per time",
        "Conventional current direction",
        "Electron flow direction",
        "Resistance",
        "Resistivity",
        "Ohm’s Law: V = IR",
        "Current density concept",
        "Conductors vs resistors",
        "Electrical power",
        "Power formulas P = IV, P = I²R, P = V²/R",
        "Energy used by a circuit",
      ],
      problemSkills: [
        "Solve V, I, or R using Ohm’s Law",
        "Use P = IV",
        "Choose correct power formula",
        "Convert units like mA to A",
        "Reason about what happens when R changes",
      ],
      traps: [
        "Current is not voltage",
        "Resistance opposes current",
        "More resistance means less current if voltage is constant",
        "Forgetting power units are watts",
      ],
    },
    {
      chapter: 28,
      title: "DC Circuits",
      mustKnow: [
        "Circuit diagrams",
        "Batteries as voltage sources",
        "Resistors in series",
        "Resistors in parallel",
        "Equivalent resistance",
        "Series rule: same current",
        "Parallel rule: same voltage",
        "Kirchhoff’s junction rule",
        "Kirchhoff’s loop rule",
        "Power in circuits",
        "Multi-loop circuits",
        "RC circuit basics if included by instructor",
        "Charging and discharging capacitors if included by instructor",
      ],
      problemSkills: [
        "Identify series vs parallel",
        "Find equivalent resistance",
        "Use Kirchhoff’s rules",
        "Find current through branches",
        "Find voltage drops",
        "Calculate power dissipated",
      ],
      traps: [
        "Adding parallel resistors directly",
        "Thinking series has same voltage",
        "Thinking parallel has same current",
        "Not checking current conservation at junctions",
      ],
    },
  ],

  3: [
    {
      chapter: 29,
      title: "Magnetic Fields and Magnetic Force",
      mustKnow: [
        "Magnetic field B",
        "Tesla unit",
        "Magnetic force on moving charge: F = qvBsinθ",
        "Angle between v and B",
        "Right-hand rule",
        "Circular motion of charged particles in magnetic fields",
        "Magnetic force on a current-carrying wire",
        "Force between currents if included",
        "Mass spectrometer / velocity selector style reasoning if included",
      ],
      problemSkills: [
        "Determine if magnetic force is zero or maximum",
        "Use sinθ correctly",
        "Solve F = qvBsinθ",
        "Use right-hand rule for direction",
        "Connect magnetic force to circular motion",
      ],
      traps: [
        "Stationary charge has no magnetic force",
        "Using cos instead of sin",
        "Forgetting direction is perpendicular",
        "Ignoring the sign of charge for direction",
      ],
    },
    {
      chapter: 30,
      title: "Electromagnetic Induction",
      mustKnow: [
        "Magnetic flux ΦB",
        "Flux depends on B, area, and angle",
        "Faraday’s Law: ε = -NΔΦB/Δt",
        "Induced emf",
        "Lenz’s Law",
        "Changing flux creates emf",
        "Changing B",
        "Changing area",
        "Changing angle",
        "Moving conductor/motional emf if included",
        "Generators and induced current conceptually",
        "Inductance basics if included",
      ],
      problemSkills: [
        "Identify what is changing",
        "Calculate flux change",
        "Use |ε| = NΔΦB/Δt",
        "Use Lenz’s Law for direction",
        "Recognize zero-emf situations",
      ],
      traps: [
        "No changing flux means no induced emf",
        "Negative sign is direction, not magnitude panic",
        "Forgetting number of turns N",
        "Confusing electric flux with magnetic flux",
      ],
    },
    {
      chapter: 31,
      title: "Electromagnetic Waves",
      mustKnow: [
        "EM waves are oscillating electric and magnetic fields",
        "EM waves can travel through vacuum",
        "Speed of light c = 3.00 × 10⁸ m/s",
        "Relationship c = fλ",
        "Wavelength and frequency relationship",
        "Electromagnetic spectrum",
        "Intensity of EM waves if included",
        "Radiation pressure if included",
        "Polarization if included",
      ],
      problemSkills: [
        "Given f, solve λ",
        "Given λ, solve f",
        "Use c instead of sound speed",
        "Reason that high frequency means short wavelength",
        "Identify EM spectrum order conceptually",
      ],
      traps: [
        "Using 343 m/s for light",
        "Forgetting EM waves do not need a medium",
        "Mixing up frequency and wavelength trends",
      ],
    },
  ],

  4: [
    {
      chapter: 33,
      title: "Remaining Final Topic / Modern or Optics Topic",
      mustKnow: [
        "Use instructor slides and homework objective for this chapter",
        "Identify chapter-specific clue words",
        "Add formulas from the assigned lecture",
        "Practice the Mastering-style problems assigned for this chapter",
        "Connect the topic back to waves/electricity/magnetism where possible",
      ],
      problemSkills: [
        "Use the same Knight strategy: model, visualize, solve, assess",
        "Write givens and unknown",
        "Choose formulas from the lecture",
        "Check units",
      ],
      traps: [
        "Assuming the formula before reading the wording",
        "Skipping diagrams or representations",
        "Not connecting the chapter to previous modules",
      ],
    },
    {
      chapter: 32,
      title: "Final Review / Mixed Problems",
      mustKnow: [
        "Formula selection by clue words",
        "Dimensional analysis",
        "Unit conversions",
        "Vector vs scalar quantities",
        "Graph interpretation",
        "Energy reasoning",
        "Field reasoning",
        "Circuit reasoning",
        "Wave reasoning",
        "Magnetic-force reasoning",
        "Induction reasoning",
      ],
      problemSkills: [
        "Recognize the chapter from the wording",
        "Label variables before solving",
        "Rearrange before substitution",
        "Check whether answer units match unknown",
        "Explain why a formula applies",
      ],
      traps: [
        "Plugging numbers before identifying the model",
        "Using the wrong speed constant",
        "Mixing up field, force, voltage, and flux",
        "Not reviewing old modules before the final",
      ],
    },
  ],
};

function findConceptSet(chapterNumber) {
  for (const moduleId of Object.keys(MODULE_CONCEPTS)) {
    const found = MODULE_CONCEPTS[moduleId].find((item) => item.chapter === chapterNumber);
    if (found) return found;
  }
  return null;
}

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
  const rValues = numsByRegex(text, /r\s*(?:=|equals)\s*([-+]?\d*\.?\d+)/gi);
  const wavelength = contextNumber(text, ["wavelength", "lambda"]);

  if (has(lower, ["string"]) && has(lower, ["tension"]) && has(lower, ["speed"])) {
    add("v₁", speeds[0] ? `${speeds[0]} m/s` : "", "original wave speed");
    add("T₁", tensions[0] ? `${tensions[0]} N` : "", "original tension");
    add("v₂", speeds[1] ? `${speeds[1]} m/s` : "", "new wave speed");
    add("T₂", "?", "new tension");
    add("μ", "constant", "same string");
    return lines.join("\n");
  }

  if (has(lower, ["phase"]) && has(lower, ["wavelength", "spherical wave", "r equals", "r ="])) {
    add("λ", wavelength ? `${wavelength} m` : "", "wavelength");
    add("r₁", rValues[0] !== undefined ? `${rValues[0]} m` : "", "starting radius");
    add("φ₁", has(lower, ["pi rad", "π rad", "is pi", "= pi"]) ? "π rad" : "", "starting phase");
    add("r₂", rValues[1] !== undefined ? `${rValues[1]} m` : "", "new radius");
    add("φ₂", "?", "new phase");
    add("k", "2π/λ", "wave number");
    return lines.join("\n");
  }

  if (has(lower, ["log", "ln", "logarithm", "exponent"])) {
    if (lower.includes("x")) add("x", "given expression variable", "already in equation");
    if (lower.includes("y")) add("y", "?", "variable being solved");
    add("log", "base 10", "common logarithm");
    add("ln", "base e", "natural logarithm");
    return lines.join("\n");
  }

  if (has(lower, ["wave", "frequency", "wavelength", "period", "hz", "hertz"])) {
    add("f", frequencies[0] ? `${frequencies[0]} Hz` : "", "frequency");
    add("λ", wavelength ? `${wavelength} m` : "", "wavelength");
    add("v", speeds[0] ? `${speeds[0]} m/s` : "?", "wave speed");
    return lines.join("\n");
  }

  if (has(lower, ["charge", "coulomb", "repel", "attract", "electric force"])) {
    add("q₁", charges[0] ? `${charges[0]} C` : "", "first charge");
    add("q₂", charges[1] ? `${charges[1]} C` : "", "second charge");
    add("F", "?", "electric force");
    add("k", "9 × 10⁹", "Coulomb constant");
    return lines.join("\n");
  }

  if (has(lower, ["current", "resistance", "resistor", "ohm", "ohms", "amp", "battery", "circuit", "power", "watts"])) {
    add("V", voltages[0] ? `${voltages[0]} V` : "", "voltage");
    add("I", currents[0] ? `${currents[0]} A` : "", "current");
    add("R", resistances[0] ? `${resistances[0]} Ω` : "", "resistance");
    add("P", powers[0] ? `${powers[0]} W` : "", "power");
    return lines.join("\n");
  }

  if (has(lower, ["magnetic", "tesla", "moving charge", "b field"])) {
    add("q", charges[0] ? `${charges[0]} C` : "", "charge");
    add("v", speeds[0] ? `${speeds[0]} m/s` : "", "speed");
    add("B", magneticFields[0] ? `${magneticFields[0]} T` : "", "magnetic field");
    add("F", "?", "magnetic force");
    return lines.join("\n");
  }

  return "I found numbers, but I need more clue words to label them.";
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
      ["VARIABLES", variableMap || "Label what each number means."],
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
  const variableMap = variableTranslator(text);

  if (!text.trim()) {
    return makeResult({
      topic: "Paste a problem first",
      givens: [],
      unknown: "The variable the problem asks for",
      formula: "Formula appears here.",
      math: "Paste the full homework question with numbers and units.",
      solution: "Answer appears here.",
      trap: "Paste the entire question.",
      variableMap,
    });
  }

  if (has(lower, ["string"]) && has(lower, ["tension"]) && has(lower, ["speed"])) {
    const speeds = numsByRegex(text, /([-+]?\d*\.?\d+)\s*m\s*\/\s*s/gi);
    const tensions = numsByRegex(text, /([-+]?\d*\.?\d+)\s*(?:n|newton|newtons|upper n)\b/gi);
    const v1 = speeds[0];
    const v2 = speeds[1];
    const T1 = tensions[0];

    let math =
      "v = √(T/μ)\n" +
      "same string → μ constant\n" +
      "T ∝ v²\n" +
      "T₂ = T₁(v₂/v₁)²";

    let solution = "Need v₁, T₁, and v₂.";

    if (v1 && v2 && T1) {
      const T2 = T1 * Math.pow(v2 / v1, 2);
      solution =
        `T₂ = ${T1}(${v2}/${v1})²\n` +
        `T₂ = ${nice(T2)} N\n\n` +
        `Answer: ${nice(T2)} N`;
    }

    return makeResult({
      topic: "Chapter 16: Wave Speed on a String",
      givens,
      unknown: "T₂",
      formula: "v = √(T/μ)",
      math,
      solution,
      trap: "Tension uses speed squared, not direct speed ratio.",
      variableMap,
    });
  }

  if (has(lower, ["phase"]) && has(lower, ["wavelength", "spherical wave", "r equals", "r ="])) {
    const wavelength = contextNumber(text, ["wavelength"]) || firstUnit(text, "m\\b");
    const rValues = numsByRegex(text, /r\s*(?:=|equals)\s*([-+]?\d*\.?\d+)/gi);
    const r1 = rValues[0];
    const r2 = rValues[1];
    const phaseIsPi = has(lower, ["pi rad", "π rad", "is pi", "= pi"]);

    let math = "k = 2π/λ\nφ₂ = φ₁ - k(r₁ - r₂)";
    let solution = "Need wavelength, starting phase, starting r, and new r.";

    if (wavelength && r1 !== undefined && r2 !== undefined && phaseIsPi) {
      const phi2 = Math.PI - ((2 * Math.PI) / wavelength) * (r1 - r2);
      solution =
        `λ = ${wavelength} m\n` +
        `φ₁ = π rad at r₁ = ${r1} m\n` +
        `r₂ = ${r2} m\n` +
        `φ₂ = π - (2π/${wavelength})(${r1} - ${r2})\n` +
        `φ₂ = ${nice(phi2)} rad\n\n` +
        `Answer: ${nice(phi2)} rad`;
    }

    return makeResult({
      topic: "Chapter 16: Spherical Wave Phase",
      givens,
      unknown: "φ₂",
      formula: "Δφ = (2π/λ)Δr",
      math,
      solution,
      trap: "This is phase, not wave speed.",
      variableMap,
    });
  }

  if (has(lower, ["log", "ln", "logarithm", "exponent"])) {
    const exact =
      lower.includes("x") &&
      lower.includes("3") &&
      lower.includes("log") &&
      lower.includes("y") &&
      (lower.includes("squared") || lower.includes("y²") || lower.includes("y^2"));

    if (exact) {
      return makeResult({
        topic: "Math Primer: Logarithms",
        givens: ["x = 3 log(y²)", "log means base 10"],
        unknown: "y",
        formula: "log(A)=B → A=10ᴮ",
        math:
          "x = 3log(y²)\n" +
          "x/3 = log(y²)\n" +
          "10^(x/3) = y²\n" +
          "y = √(10^(x/3))\n" +
          "y = 10^(x/6)",
        solution: "Answer: y = 10^(x/6)",
        trap: "Plain log is base 10. ln is base e.",
        variableMap,
      });
    }

    return makeResult({
      topic: "Math Primer: Logs and Exponents",
      givens,
      unknown: "Variable inside log or exponent",
      formula: "b = aˣ ↔ logₐ(b)=x",
      math: "Isolate the log/exponential part, then rewrite or take logs.",
      solution: "Use the exact equation to isolate the variable.",
      trap: "Logs undo exponents.",
      variableMap,
    });
  }

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
      math = "f = v/λ";
      solution = `f = ${speed}/${wavelength}\nf = ${nice(ans)} Hz\n\nAnswer: ${nice(ans)} Hz`;
    } else if (has(lower, ["wavelength"]) && speed && f) {
      const ans = speed / f;
      unknown = "λ";
      math = "λ = v/f";
      solution = `λ = ${speed}/${f}\nλ = ${nice(ans)} m\n\nAnswer: ${nice(ans)} m`;
    } else if (has(lower, ["period"]) && f) {
      const ans = 1 / f;
      unknown = "T";
      math = "T = 1/f";
      solution = `T = 1/${f}\nT = ${nice(ans)} s\n\nAnswer: ${nice(ans)} s`;
    } else if (has(lower, ["frequency"]) && period) {
      const ans = 1 / period;
      unknown = "f";
      math = "f = 1/T";
      solution = `f = 1/${period}\nf = ${nice(ans)} Hz\n\nAnswer: ${nice(ans)} Hz`;
    }

    return makeResult({
      topic: "Chapter 16: Waves",
      givens,
      unknown,
      formula: "v = fλ and f = 1/T",
      math,
      solution,
      trap: "Amplitude is not wavelength.",
      variableMap,
    });
  }

  if (has(lower, ["charge", "coulomb", "repel", "attract", "electric force"])) {
    const charges = numsByRegex(text, /([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\s*c\b/gi);
    const q1 = charges[0];
    const q2 = charges[1];
    const r = contextNumber(text, ["distance", "apart", "separated"]) || firstUnit(text, "m\\b");
    let solution = "Need q₁, q₂, and r.";

    if (q1 && q2 && r) {
      const F = (9e9 * Math.abs(q1) * Math.abs(q2)) / (r * r);
      solution = `F = kq₁q₂/r²\nF = ${nice(F)} N\n\nAnswer: ${nice(F)} N`;
    }

    return makeResult({
      topic: "Chapter 22: Coulomb’s Law",
      givens,
      unknown: "F",
      formula: "F = kq₁q₂/r²",
      math: "Use k = 9 × 10⁹ and square r.",
      solution,
      trap: "Same repel, opposite attract.",
      variableMap,
    });
  }

  if (has(lower, ["electric field", "field", "n/c", "force per charge"])) {
    return makeResult({
      topic: "Chapter 23: Electric Field",
      givens,
      unknown: "E, F, or q",
      formula: "E = F/q",
      math: "Use E = F/q or F = qE.",
      solution: "Plug in two known values to find the third.",
      trap: "Field is force per charge.",
      variableMap,
    });
  }

  if (has(lower, ["flux", "gauss", "surface", "area", "enclosed"])) {
    return makeResult({
      topic: "Chapter 24: Flux and Gauss’s Law",
      givens,
      unknown: "Flux, field, or enclosed charge",
      formula: "Φ = EAcosθ or Φ = q_enc/ε₀",
      math: "Use area/angle formula or Gauss formula depending on wording.",
      solution: "Plug into the matching formula.",
      trap: "Only enclosed charge matters for closed-surface total flux.",
      variableMap,
    });
  }

  if (has(lower, ["voltage", "potential", "potential energy", "volt"])) {
    return makeResult({
      topic: "Chapter 25: Electric Potential",
      givens,
      unknown: "V, U, or q",
      formula: "V = U/q",
      math: "Use V = U/q, U = qV, or q = U/V.",
      solution: "Voltage is energy per charge.",
      trap: "Voltage is not electric field.",
      variableMap,
    });
  }

  if (has(lower, ["capacitor", "capacitance", "farad", "dielectric"])) {
    return makeResult({
      topic: "Chapter 26: Capacitance",
      givens,
      unknown: "C, Q, or ΔV",
      formula: "C = Q/ΔV",
      math: "Use C = Q/ΔV, Q = CΔV, or ΔV = Q/C.",
      solution: "Capacitance is charge per volt.",
      trap: "Capacitance is not the same as charge.",
      variableMap,
    });
  }

  if (has(lower, ["current", "resistance", "resistor", "ohm", "ohms", "amp", "battery", "circuit", "power", "watts"])) {
    return makeResult({
      topic: "Chapter 27/28: Circuits",
      givens,
      unknown: "V, I, R, or P",
      formula: "V = IR and P = IV",
      math: "Use Ohm’s Law, power formulas, and series/parallel rules.",
      solution: "Label circuit type first: series or parallel.",
      trap: "Series: same current. Parallel: same voltage.",
      variableMap,
    });
  }

  if (has(lower, ["magnetic", "tesla", "moving charge", "b field"])) {
    return makeResult({
      topic: "Chapter 29: Magnetic Force",
      givens,
      unknown: "F",
      formula: "F = qvBsinθ",
      math: "Use q, v, B, and angle.",
      solution: "Plug into F = qvBsinθ.",
      trap: "Stationary charge has no magnetic force.",
      variableMap,
    });
  }

  if (has(lower, ["induction", "emf", "faraday", "lenz", "flux", "coil", "turns"])) {
    return makeResult({
      topic: "Chapter 30: Induction",
      givens,
      unknown: "ε",
      formula: "ε = -NΔΦB/Δt",
      math: "Use magnitude |ε| = NΔΦB/Δt.",
      solution: "Changing flux creates emf.",
      trap: "No changing flux = no induced emf.",
      variableMap,
    });
  }

  if (has(lower, ["light", "electromagnetic", "em wave", "speed of light"])) {
    return makeResult({
      topic: "Chapter 31: Electromagnetic Waves",
      givens,
      unknown: "c, f, or λ",
      formula: "c = fλ",
      math: "Use c = 3.00 × 10⁸ m/s.",
      solution: "Use λ = c/f or f = c/λ.",
      trap: "Do not use sound speed for light.",
      variableMap,
    });
  }

  return makeResult({
    topic: "Universal Physics Problem",
    givens,
    unknown: "Whatever the question asks for",
    formula: "Use clue words to pick the formula.",
    math: "GIVEN → VARIABLES → UNKNOWN → FORMULA → MATH → SOLUTION.",
    solution: "Paste more wording if the solver cannot classify it.",
    trap: "Do not skip units.",
    variableMap,
  });
}

function getChapter(number) {
  return CHAPTERS.find((chapter) => chapter.number === number);
}

function getModuleChapters(module) {
  return module.chapters.map((number) => getChapter(number)).filter(Boolean);
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
  const [moduleIndex, setModuleIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [clipIndex, setClipIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameMessage, setGameMessage] = useState("");
  const [playing, setPlaying] = useState(false);

  const motion = useRef(new Animated.Value(0)).current;

  const solved = solveProblem(problem);
  const module = MODULES[moduleIndex];
  const chapter = CHAPTERS[chapterIndex];
  const moduleChapters = getModuleChapters(module);
  const clip = chapter.clips[clipIndex % chapter.clips.length];
  const card = chapter.flashcards[flashIndex % chapter.flashcards.length];
  const teachingGame = getTeachingGame(chapter);
  const gameCard = teachingGame.rounds[gameIndex % teachingGame.rounds.length];

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
        Animated.timing(motion, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(motion, { toValue: 0, duration: 850, useNativeDriver: true }),
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

  function openChapterFromModule(chapterNumber) {
    const index = CHAPTERS.findIndex((item) => item.number === chapterNumber);
    setChapterIndex(index);
    setClipIndex(0);
    setFlashIndex(0);
    setShowAnswer(false);
    setGameIndex(0);
    setGameScore(0);
    setGameMessage("");
    setPlaying(false);
    setScreen("chapter");
  }

  function gameChoices() {
    return gameCard.choices;
  }

  if (screen === "home") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Physics Final Boss</Text>
        <Text style={styles.subtitle}>Pick a module. Beat the chapter. Pass the quiz.</Text>

        <View style={styles.card}>
          <Text style={styles.big}>Course Map</Text>
          <Text style={styles.body}>
            Built around your Physics II syllabus: modules, chapters, homework solver, study guides, flashcards, clips, and brainrot games.
          </Text>

          <Button label="Start: Pick a Module" onPress={() => setScreen("modules")} />
          <Button label="Homework Problem Solver" type="purple" onPress={() => setScreen("solver")} />
          <Button label="Full Schedule" type="gold" onPress={() => setScreen("schedule")} />
          <Button label="All Formula Map" type="secondary" onPress={() => setScreen("formulas")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "schedule") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Course Schedule</Text>
        <Text style={styles.subtitle}>Your quiz and exam battle map.</Text>

        <View style={styles.card}>
          {MODULES.map((item, index) => (
            <Pressable
              key={item.id}
              style={styles.scheduleCard}
              onPress={() => {
                setModuleIndex(index);
                setScreen("module");
              }}
            >
              <Text style={styles.scheduleModule}>{item.title}</Text>
              <Text style={styles.scheduleDates}>{item.dates}</Text>
              <Text style={styles.scheduleText}>Chapters: {item.chapters.join(", ")}</Text>
              <Text style={styles.scheduleText}>{item.focus}</Text>
              <Text style={styles.scheduleExam}>{item.exam}</Text>
            </Pressable>
          ))}

          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "modules") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pick a Module</Text>
        <Text style={styles.subtitle}>Module → Chapter → Tools</Text>

        <View style={styles.card}>
          {MODULES.map((item, index) => (
            <Pressable
              key={item.id}
              style={styles.moduleCard}
              onPress={() => {
                setModuleIndex(index);
                setScreen("module");
              }}
            >
              <Text style={styles.moduleTitle}>{item.title}</Text>
              <Text style={styles.moduleDates}>{item.dates}</Text>
              <Text style={styles.moduleFocus}>{item.focus}</Text>
              <Text style={styles.moduleExam}>{item.exam}</Text>
            </Pressable>
          ))}

          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "module") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{module.title}</Text>
        <Text style={styles.subtitle}>{module.focus}</Text>

        <View style={styles.card}>
          <Box title="Module Mission">
            {`${module.dates}\n${module.exam}\n\nPick a chapter below, then choose Study Guide, Flashcards, Clips, Formula Map, Knight-Style Game, or Solver.`}
          </Box>

          <Text style={styles.sectionTitle}>Chapters</Text>
          {moduleChapters.map((item) => (
            <Pressable key={item.number} style={styles.chapterCard} onPress={() => openChapterFromModule(item.number)}>
              <Text style={styles.chapterTitle}>Chapter {item.number}: {item.title}</Text>
              <Text style={styles.chapterFormula}>{item.formula}</Text>
            </Pressable>
          ))}

          <Button label="Module Concept Checklist" type="gold" onPress={() => setScreen("moduleConcepts")} />
          <Button label="Module Formula Map" type="purple" onPress={() => setScreen("moduleFormulas")} />
          <Button label="Back to Modules" type="secondary" onPress={() => setScreen("modules")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "moduleFormulas") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{module.title}</Text>
        <Text style={styles.subtitle}>Formula Map</Text>

        <View style={styles.card}>
          {moduleChapters.map((item) => (
            <View key={item.number} style={styles.formulaRow}>
              <Text style={styles.formulaName}>Ch. {item.number}: {item.title}</Text>
              <Text style={styles.formula}>{item.formula}</Text>
            </View>
          ))}

          <Button label="Back to Module" type="secondary" onPress={() => setScreen("module")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "chapter") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Chapter {chapter.number}</Text>
        <Text style={styles.subtitle}>{chapter.title}</Text>

        <View style={styles.card}>
          <Box title="Chapter Objective">
            {chapter.objective}
          </Box>

          <Box title="Main Formula">
            {chapter.formula}
          </Box>

          <Box title="Clue Words">
            {chapter.clues.join(" | ")}
          </Box>

          <Button label="Study Guide" onPress={() => setScreen("study")} />
          <Button label="Concept Checklist" type="gold" onPress={() => setScreen("conceptChecklist")} />
          <Button label="Tiny Animated Clips" type="gold" onPress={() => { setClipIndex(0); setPlaying(true); setScreen("clips"); }} />
          <Button label="Flashcards" type="purple" onPress={() => { setFlashIndex(0); setShowAnswer(false); setScreen("flashcards"); }} />
          <Button label="Knight-Style Knight-Style Game" type="gold" onPress={() => { setGameIndex(0); setGameScore(0); setGameMessage(""); setScreen("game"); }} />
          <Button label="Chapter Formula Map" type="secondary" onPress={() => setScreen("chapterFormula")} />
          <Button label="Homework Solver" type="purple" onPress={() => setScreen("solver")} />
          <Button label="Back to Module" type="secondary" onPress={() => setScreen("module")} />
        </View>
      </ScrollView>
    );
  }


  if (screen === "moduleConcepts") {
    const moduleConcepts = MODULE_CONCEPTS[module.id] || [];

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{module.title}</Text>
        <Text style={styles.subtitle}>Complete Concept Checklist</Text>

        <View style={styles.card}>
          <Box title="Module Coverage Goal">
            {`This checks whether you have every big concept for ${module.title}: ${module.focus}.`}
          </Box>

          {moduleConcepts.map((item) => (
            <View key={item.chapter} style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Chapter {item.chapter}: {item.title}</Text>

              <Text style={styles.conceptHeader}>Must Know</Text>
              {item.mustKnow.map((concept, index) => (
                <Text key={`m-${index}`} style={styles.conceptItem}>□ {concept}</Text>
              ))}

              <Text style={styles.conceptHeader}>Problem Skills</Text>
              {item.problemSkills.map((skill, index) => (
                <Text key={`s-${index}`} style={styles.conceptItem}>□ {skill}</Text>
              ))}

              <Text style={styles.conceptHeader}>Traps to Avoid</Text>
              {item.traps.map((trap, index) => (
                <Text key={`t-${index}`} style={styles.trapItem}>⚠ {trap}</Text>
              ))}
            </View>
          ))}

          <Button label="Back to Module" type="secondary" onPress={() => setScreen("module")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "conceptChecklist") {
    const conceptSet = findConceptSet(chapter.number);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Concept Checklist</Text>
        <Text style={styles.subtitle}>Chapter {chapter.number}: {chapter.title}</Text>

        <View style={styles.card}>
          {conceptSet ? (
            <>
              <Box title="How to Use This">
                {"Check these off mentally before a quiz. If any box feels fuzzy, go to Study Guide, Flashcards, then the Knight-Style Game."}
              </Box>

              <View style={styles.conceptCard}>
                <Text style={styles.conceptHeader}>Must Know</Text>
                {conceptSet.mustKnow.map((concept, index) => (
                  <Text key={`cm-${index}`} style={styles.conceptItem}>□ {concept}</Text>
                ))}

                <Text style={styles.conceptHeader}>Problem Skills</Text>
                {conceptSet.problemSkills.map((skill, index) => (
                  <Text key={`cs-${index}`} style={styles.conceptItem}>□ {skill}</Text>
                ))}

                <Text style={styles.conceptHeader}>Traps to Avoid</Text>
                {conceptSet.traps.map((trap, index) => (
                  <Text key={`ct-${index}`} style={styles.trapItem}>⚠ {trap}</Text>
                ))}
              </View>
            </>
          ) : (
            <Box title="No checklist found">
              {"Use the module checklist or formula map for this chapter."}
            </Box>
          )}

          <Button label="Study Guide" onPress={() => setScreen("study")} />
          <Button label="Flashcards" type="purple" onPress={() => { setFlashIndex(0); setShowAnswer(false); setScreen("flashcards"); }} />
          <Button label="Knight-Style Game" type="gold" onPress={() => { setGameIndex(0); setGameScore(0); setGameMessage(""); setScreen("game"); }} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </View>
      </ScrollView>
    );
  }


  if (screen === "study") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Study Guide</Text>
        <Text style={styles.subtitle}>Chapter {chapter.number}: {chapter.title}</Text>

        <View style={styles.card}>
          <Box title="What the Quiz Is Testing">
            {chapter.objective}
          </Box>

          <Box title="How to Solve These">
            {chapter.guide.map((item, index) => `${index + 1}. ${item}`).join("\n")}
          </Box>

          <Box title="Common Traps">
            {chapter.traps.map((item, index) => `${index + 1}. ${item}`).join("\n")}
          </Box>

          <Box title="Clue Words">
            {chapter.clues.join(" | ")}
          </Box>

          <Button label="Flashcards" type="purple" onPress={() => { setFlashIndex(0); setShowAnswer(false); setScreen("flashcards"); }} />
          <Button label="Knight-Style Game" type="gold" onPress={() => { setGameIndex(0); setGameScore(0); setGameMessage(""); setScreen("game"); }} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
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
            <Pressable style={styles.smallButton} onPress={() => clipIndex > 0 && setClipIndex(clipIndex - 1)}>
              <Text style={styles.smallButtonText}>Back</Text>
            </Pressable>
            <Pressable style={styles.smallButtonGold} onPress={() => setPlaying(!playing)}>
              <Text style={styles.smallButtonDarkText}>{playing ? "Pause" : "Play"}</Text>
            </Pressable>
            <Pressable style={styles.smallButton} onPress={() => setClipIndex(clipIndex + 1 < chapter.clips.length ? clipIndex + 1 : 0)}>
              <Text style={styles.smallButtonText}>Next</Text>
            </Pressable>
          </View>

          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
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
          <Text style={styles.sectionTitle}>Card {flashIndex + 1} of {chapter.flashcards.length}</Text>

          <View style={styles.flashcard}>
            <Text style={styles.flashLabel}>{showAnswer ? "ANSWER" : "QUESTION"}</Text>
            <Text style={styles.flashText}>{showAnswer ? card[1] : card[0]}</Text>
          </View>

          <Button label={showAnswer ? "Show Question" : "Show Answer"} onPress={() => setShowAnswer(!showAnswer)} />
          <Button label="Next Card" type="purple" onPress={() => { setFlashIndex(flashIndex + 1 < chapter.flashcards.length ? flashIndex + 1 : 0); setShowAnswer(false); }} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "game") {
    const choices = gameChoices();

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{teachingGame.name}</Text>
        <Text style={styles.subtitle}>Chapter {chapter.number}: {chapter.title}</Text>

        <View style={styles.card}>
          <Text style={styles.gameScore}>Score: {gameScore}</Text>

          <View style={styles.gameQuestionBox}>
            <Text style={styles.gameLabel}>ROUND {gameIndex + 1} of {teachingGame.rounds.length}</Text>
            {gameCard.skill ? <Text style={styles.skillBadge}>{gameCard.skill}</Text> : null}
            <Text style={styles.gameQuestion}>{gameCard.prompt}</Text>
          </View>

          {choices.map((choice) => (
            <Pressable
              key={choice}
              style={styles.gameChoice}
              onPress={() => {
                if (choice === gameCard.answer) {
                  setGameScore((old) => old + 10);
                  setGameMessage(`Correct. ${gameCard.teach}`);
                } else {
                  setGameMessage(`Not quite. Correct: ${gameCard.answer}. ${gameCard.teach}`);
                }
              }}
            >
              <Text style={styles.gameChoiceText}>{choice}</Text>
            </Pressable>
          ))}

          {gameMessage ? (
            <Text style={gameMessage.startsWith("Correct") ? styles.gameCorrect : styles.gameWrong}>
              {gameMessage}
            </Text>
          ) : null}

          <Button label="Next Question" type="gold" onPress={() => { setGameIndex(gameIndex + 1 < teachingGame.rounds.length ? gameIndex + 1 : 0); setGameMessage(""); }} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "chapterFormula") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Formula Map</Text>
        <Text style={styles.subtitle}>Chapter {chapter.number}: {chapter.title}</Text>

        <View style={styles.card}>
          <Box title="Formula">
            {chapter.formula}
          </Box>
          <Box title="When to Use It">
            {chapter.clues.join(" | ")}
          </Box>
          <Box title="Trap Check">
            {chapter.traps.join("\n")}
          </Box>
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </View>
      </ScrollView>
    );
  }

  if (screen === "solver") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Homework Problem Solver</Text>
        <Text style={styles.subtitle}>GIVEN → VARIABLES → MATH → SOLUTION</Text>

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

  if (screen === "formulas") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>All Formula Map</Text>
        <Text style={styles.subtitle}>Every chapter formula in one place.</Text>

        <View style={styles.card}>
          {CHAPTERS.map((item) => (
            <View key={item.number} style={styles.formulaRow}>
              <Text style={styles.formulaName}>Ch. {item.number}: {item.title}</Text>
              <Text style={styles.formula}>{item.formula}</Text>
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
  moduleCard: {
    backgroundColor: "#f8fafc",
    borderColor: "#7c3aed",
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
  },
  moduleTitle: {
    color: "#7c3aed",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  moduleDates: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
  },
  moduleFocus: {
    color: "#1f2937",
    fontSize: 17,
    lineHeight: 27,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
  },
  moduleExam: {
    color: "#b45309",
    fontSize: 17,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },
  scheduleCard: {
    backgroundColor: "#f8fafc",
    borderColor: "#7c3aed",
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
  },
  scheduleModule: {
    color: "#7c3aed",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  scheduleDates: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
  },
  scheduleText: {
    color: "#1f2937",
    fontSize: 17,
    lineHeight: 27,
    fontWeight: "800",
    marginTop: 6,
  },
  scheduleExam: {
    color: "#b45309",
    fontSize: 17,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },
  chapterCard: {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
  chapterTitle: {
    color: "#0f172a",
    fontSize: 20,
    lineHeight: 29,
    fontWeight: "900",
    textAlign: "center",
  },
  chapterFormula: {
    color: "#7c3aed",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 6,
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
  gameScore: {
    color: "#166534",
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },
  gameQuestionBox: {
    backgroundColor: "#111827",
    borderColor: "#38bdf8",
    borderWidth: 2,
    borderRadius: 24,
    padding: 22,
    marginBottom: 14,
  },
  gameLabel: {
    color: "#fbbf24",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
  },
  gameQuestion: {
    color: "#f8fafc",
    fontSize: 23,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  gameChoice: {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    borderWidth: 2,
    borderRadius: 18,
    padding: 15,
    marginTop: 10,
  },
  gameChoiceText: {
    color: "#0f172a",
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  gameCorrect: {
    color: "#166534",
    backgroundColor: "#dcfce7",
    borderRadius: 18,
    padding: 14,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 14,
  },
  gameWrong: {
    color: "#7f1d1d",
    backgroundColor: "#fee2e2",
    borderRadius: 18,
    padding: 14,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 14,
  },
  conceptCard: {
    backgroundColor: "#f8fafc",
    borderColor: "#38bdf8",
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
  },
  conceptTitle: {
    color: "#0f172a",
    fontSize: 22,
    lineHeight: 31,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  conceptHeader: {
    color: "#7c3aed",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 6,
  },
  conceptItem: {
    color: "#0f172a",
    fontSize: 17,
    lineHeight: 27,
    fontWeight: "800",
    marginTop: 4,
  },
  trapItem: {
    color: "#7f1d1d",
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 9,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "900",
    marginTop: 6,
  },

  skillBadge: {
    color: "#111827",
    backgroundColor: "#fbbf24",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    overflow: "hidden",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },

});
