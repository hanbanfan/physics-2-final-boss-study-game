import React, {useEffect, useMemo, useRef, useState} from "react";
import {Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";

/*
  PHYSICS FINAL BOSS - TBI-FRIENDLY HOMEWORK EDITION

  Built for:
  - One task at a time
  - Clear learning objectives
  - Homework-ready practice
  - Deep flashcards
  - Guided problem solving
  - Less overwhelm
*/

const MODULES = [
  {
    id: 1,
    title: "Module 1",
    dates: "6/08 - 6/24",
    focus: "Waves, charges, electric fields, and Gauss's Law",
    exam: "Module 1 Exam due 6/28 by 11:59 PM",
    chapters: [16, 22, 23, 24],
    schedule: [
      "Chapter 16: Traveling Waves",
      "Chapter 22: Electric Charges and Forces",
      "Chapter 23: Electric Field",
      "Chapter 24: Gauss's Law",
    ],
  },
  {
    id: 2,
    title: "Module 2",
    dates: "6/29 - 7/06",
    focus: "Electric potential, capacitors, current, and circuits",
    exam: "Module 2 Exam during class on 7/06",
    chapters: [25, 26, 27, 28],
    schedule: [
      "Chapter 25: Electric Potential",
      "Chapter 26: Potential and Field",
      "Chapter 27: Current and Resistance",
      "Chapter 28: Circuits",
    ],
  },
  {
    id: 3,
    title: "Module 3",
    dates: "7/08 - 7/20",
    focus: "Magnetism, induction, and electromagnetic waves",
    exam: "Module 3 Exam during class on 7/20",
    chapters: [29, 30, 31],
    schedule: [
      "Chapter 29: Magnetic Field",
      "Chapter 30: Electromagnetic Induction",
      "Chapter 31: Electromagnetic Waves",
    ],
  },
  {
    id: 4,
    title: "Module 4",
    dates: "7/22 - 8/02",
    focus: "Final topics and final exam review",
    exam: "Final Exam due 8/02 by 11:59 PM",
    chapters: [33, 32],
    schedule: [
      "Chapter 33: Final Topic",
      "Chapter 32: Final Topic",
      "Final Exam Review",
    ],
  },
];

const METHOD = [
  {
    title: "1. Name the topic",
    body: "Before doing math, decide what family the problem belongs to: waves, charge, electric field, flux, voltage, capacitors, circuits, magnetism, or induction.",
    example: "Frequency plus wavelength usually means waves.",
  },
  {
    title: "2. Circle clue words",
    body: "Circle words that reveal the formula: frequency, charge, distance, voltage, current, resistance, flux, angle, coil, magnetic field, or changing field.",
    example: "q₁ plus q₂ plus distance means Coulomb's Law.",
  },
  {
    title: "3. List knowns with units",
    body: "Write every number with its unit. Do not hold the numbers in your head.",
    example: "V = 12 V, R = 4 Ω, I = ?",
  },
  {
    title: "4. Write the unknown",
    body: "Write what the problem asks for. This keeps your brain from chasing every formula.",
    example: "Find current means unknown = I.",
  },
  {
    title: "5. Pick one formula",
    body: "Choose the formula that has your unknown and most of your known values.",
    example: "V, I, and R means use V = I × R.",
  },
  {
    title: "6. Rearrange first",
    body: "Solve the formula for the unknown before plugging in numbers.",
    example: "V = I × R becomes I = V / R.",
  },
  {
    title: "7. Plug in slowly",
    body: "Substitute one line at a time. Watch squares, powers of ten, and trig.",
    example: "I = 12 / 4 = 3 A.",
  },
  {
    title: "8. Check units",
    body: "The final unit must match what you solved for.",
    example: "Current should be amps. 3 A makes sense.",
  },
  {
    title: "9. Sanity check",
    body: "Ask if the answer behaves correctly.",
    example: "If resistance goes up, current should go down.",
  },
];

const FORMULA_MAP = [
  ["Waves", "v = f × λ", "frequency, wavelength, period, sound, light", "Connects wave speed, frequency, and wavelength."],
  ["Coulomb's Law", "F = k × q₁ × q₂ / r²", "q₁, q₂, distance, force", "Finds force between two charges."],
  ["Electric Field", "E = F / q", "force, charge, N/C", "Defines field as force per charge."],
  ["Electric Flux", "ΦE = E × A × cos(θ)", "flux, area, angle, surface", "Counts electric field through a surface."],
  ["Gauss's Law", "ΦE = q_enc / ε₀", "closed surface, symmetry, enclosed charge", "Connects closed-surface flux to enclosed charge."],
  ["Electric Potential", "V = U / q", "voltage, energy, charge", "Defines voltage as energy per charge."],
  ["Capacitance", "C = Q / ΔV", "capacitor, charge, voltage", "Charge stored per volt."],
  ["Ohm's Law", "V = I × R", "voltage, current, resistance", "Connects voltage, current, and resistance."],
  ["Power", "P = I × V", "power, current, voltage", "Electrical energy transfer per time."],
  ["Magnetic Force", "F = q × v × B × sin(θ)", "charge, velocity, B field, angle", "Force on a moving charge in a magnetic field."],
  ["Faraday's Law", "ε = -N × ΔΦ_B / Δt", "changing flux, coil, Faraday, Lenz", "Changing magnetic flux creates emf."],
];

const CALC3_TOOLS = [
  ["Vectors", "A = ⟨Aₓ, Aᵧ, A_z⟩", "Fields, forces, velocity, and displacement have direction. Treat them like arrows with components."],
  ["Magnitude", "|A| = √(Aₓ² + Aᵧ² + A_z²)", "Magnitude is vector size. Use it when the answer asks for strength of a field or force."],
  ["Dot product", "A dot B = A B cos(θ)", "Dot products measure how much vectors line up. Flux and work use this idea."],
  ["Cross product", "|A cross B| = A B sin(θ)", "Cross products measure perpendicular interaction. Magnetic force uses this idea."],
  ["Gradient", "E = -∇V", "Electric field points downhill from electric potential. Steeper voltage change means stronger field."],
  ["Divergence", "∇ · E", "Divergence measures field spreading outward. Gauss's Law is divergence thinking."],
  ["Curl", "∇ × E", "Curl measures field swirl. Induction uses curl thinking."],
  ["Surface integral", "∬ E · dA", "Flux adds up field through a surface."],
  ["Line integral", "∫ E · dr", "Voltage difference and emf add up fields along a path."],
];

const DERIVATIONS = [
  {
    title: "Wave speed",
    formula: "v = f × λ",
    simple: "One wave cycle travels one wavelength in one period.",
    steps: ["Speed = distance / time", "Distance for one cycle = lambda", "Time for one cycle = T", "v = lambda / T", "f = 1 / T", "Therefore v = f × λ"],
  },
  {
    title: "Electric field",
    formula: "E = F / q",
    simple: "Electric field is force per test charge.",
    steps: ["Place a small positive test charge q in the field", "Measure the electric force F", "Divide force by charge", "E = F / q"],
  },
  {
    title: "Coulomb's Law",
    formula: "F = k × q₁ × q₂ / r²",
    simple: "Charge makes force, and distance spreads the effect over a sphere.",
    steps: ["More charge means more force", "Force depends on q₁ q₂", "Field spreads in 3D", "Sphere area grows like r²", "Force drops like 1 / r²", "Add constant k"],
  },
  {
    title: "Flux",
    formula: "ΦE = E × A × cos(θ)",
    simple: "Flux counts field through area.",
    steps: ["Only perpendicular field counts", "Perpendicular part is E cos(θ)", "Multiply by area A", "ΦE = E × A × cos(θ)"],
  },
  {
    title: "Gauss's Law",
    formula: "ΦE = q_enc / ε₀",
    simple: "Closed-surface flux depends on charge inside.",
    steps: ["Put charge inside a sphere", "Field spreads evenly", "Flux = E times area", "Area = 4 pi r²", "r² cancels", "Result is q_enc/ε₀"],
  },
  {
    title: "Ohm's Law",
    formula: "V = I × R",
    simple: "Voltage pushes current through resistance.",
    steps: ["Voltage pushes charge", "Current is charge flow", "Resistance blocks flow", "More resistance needs more voltage", "V = I × R"],
  },
  {
    title: "Power",
    formula: "P = I × V",
    simple: "Power is energy per time.",
    steps: ["Voltage = energy / charge", "Current = charge / time", "Multiply I V", "Charge cancels", "Energy / time = power"],
  },
  {
    title: "Magnetic force",
    formula: "F = q × v × B × sin(θ)",
    simple: "Magnetic fields only push moving charges.",
    steps: ["More charge means more force", "More speed means more force", "More B means more force", "Only perpendicular motion counts", "That gives sin(θ)"],
  },
  {
    title: "Faraday's Law",
    formula: "ε = -N × ΔΦ_B / Δt",
    simple: "Changing magnetic flux creates voltage.",
    steps: ["Flux means magnetic field through area", "Changing flux creates emf", "Faster change creates bigger emf", "More coil turns creates bigger emf", "Negative sign is Lenz's Law"],
  },
];

const CHAPTERS = [
  {
    number: 16,
    moduleId: 1,
    title: "Traveling Waves",
    formula: "v = f × λ",
    calm: "Waves move energy. Frequency is how often. Wavelength is how long.",
    objective: "Identify wave quantities and use the relationship between speed, frequency, wavelength, and period.",
    homeworkSkills: [
      "Tell transverse and longitudinal waves apart.",
      "Read amplitude, wavelength, period, and frequency from a graph.",
      "Use v = f × λ to solve for speed, frequency, or wavelength.",
      "Use f = 1 / T to switch between frequency and period.",
      "Recognize Doppler effect as a change in observed frequency due to motion.",
    ],
    teacherTests: "Can you look at a wave problem and know whether it is asking for speed, frequency, wavelength, period, amplitude, or Doppler shift?",
    clues: ["wave", "frequency", "wavelength", "period", "amplitude", "sound", "light", "Doppler"],
    traps: [
      "Do not confuse amplitude with wavelength.",
      "Do not confuse period with frequency.",
      "Sound needs a medium; light can travel through vacuum.",
      "Approaching source means higher observed frequency.",
    ],
    math: ["v = f × λ", "f = 1 / T", "λ = v / f", "T = 1 / f"],
    lesson: [
      ["Wave", "A wave carries energy from one place to another."],
      ["Graph", "Amplitude is height. Wavelength is horizontal length of one cycle."],
      ["Formula", "Use v = f × λ when speed, frequency, and wavelength appear."],
      ["Doppler", "Motion changes observed frequency."],
    ],
    example: ["Wave speed", "frequency, wavelength", "f = 10 Hz, lambda = 2 m", "v", "v = f × λ", "v = 10 × 2", "20 m/s"],
    cards: [
      ["What does a wave transfer?", "Energy, not permanent matter."],
      ["What does frequency mean?", "Cycles per second, measured in Hz."],
      ["What does wavelength mean?", "Length of one full cycle."],
      ["How are f and T related?", "f = 1 / T and T = 1 / f."],
      ["When do you use v = f × λ?", "When speed, frequency, and wavelength are connected."],
      ["What is Doppler effect?", "Observed frequency changes because source or observer moves."],
    ],
    quiz: ["A wave has f = 5 Hz and lambda = 3 m. What formula solves speed?", ["v = f × λ", "V = I × R", "C = Q / ΔV"], "v = f × λ"],
  },
  {
    number: 22,
    moduleId: 1,
    title: "Electric Charges and Forces",
    formula: "F = k × q₁ × q₂ / r²",
    calm: "Same charges repel. Opposite charges attract. Distance matters a lot.",
    objective: "Explain electric charge and calculate electric force using Coulomb's Law.",
    homeworkSkills: [
      "Predict attraction or repulsion.",
      "Use Coulomb's Law for force magnitude.",
      "Handle r² correctly.",
      "Understand conductors versus insulators.",
      "Use scientific notation with k = 9 × 10⁹.",
    ],
    teacherTests: "Can you identify q₁, q₂, and r, then calculate force without forgetting that distance is squared?",
    clues: ["charge", "q₁", "q₂", "distance", "force", "repel", "attract"],
    traps: [
      "Same signs repel; opposite signs attract.",
      "Square r before dividing.",
      "If r doubles, force becomes four times smaller.",
      "Use direction separately from magnitude.",
    ],
    math: ["F = k × q₁ × q₂ / r²", "k = 9 × 10⁹", "r² means distance squared"],
    lesson: [
      ["Charge", "Charges can be positive or negative."],
      ["Behavior", "Same charges repel. Opposite charges attract."],
      ["Distance", "Force drops fast because r is squared."],
      ["Formula", "Use F = k × q₁ × q₂ / r²."],
    ],
    example: ["Electric force", "q₁, q₂, r", "q₁ = 2 C, q₂ = 3 C, r = 1 m", "F", "F = k × q₁ × q₂ / r²", "F = (9x10⁹)(2)(3)/(1^2)", "5.4 × 10^10 N"],
    cards: [
      ["What do same charges do?", "They repel."],
      ["What do opposite charges do?", "They attract."],
      ["What does a conductor do?", "Lets charge move freely."],
      ["What does an insulator do?", "Prevents charge from moving freely."],
      ["Why does r² matter?", "Force gets weaker very quickly as distance increases."],
      ["What are the Coulomb clues?", "q₁, q₂, r, force, attract, repel."],
    ],
    quiz: ["Two negative charges near each other will...", ["Repel", "Attract", "Turn neutral"], "Repel"],
  },
  {
    number: 23,
    moduleId: 1,
    title: "The Electric Field",
    formula: "E = F / q",
    calm: "Electric field is force per charge.",
    objective: "Describe electric fields and use them to connect force and charge.",
    homeworkSkills: [
      "Use E = F / q and F = q × E.",
      "Know field direction uses a positive test charge.",
      "Understand that positive and negative charges accelerate in opposite directions.",
      "Recognize N/C as electric field units.",
    ],
    teacherTests: "Can you tell the difference between electric force and electric field?",
    clues: ["electric field", "force", "charge", "N/C", "test charge"],
    traps: [
      "Field is not the same as force.",
      "Negative charges feel force opposite the field.",
      "Field direction is based on a positive test charge.",
    ],
    math: ["E = F / q", "F = q × E", "Units: N/C"],
    lesson: [
      ["Field", "An electric field is an invisible force map."],
      ["Definition", "Field strength means force per charge."],
      ["Direction", "A positive test charge shows field direction."],
      ["Formula", "Use E = F / q."],
    ],
    example: ["Electric field", "force, charge", "F = 12 N, q = 4 C", "E", "E = F / q", "E = 12 / 4", "3 N/C"],
    cards: [
      ["What is electric field?", "Force per charge."],
      ["What formula defines electric field?", "E = F / q."],
      ["What units can E use?", "N/C or V/m."],
      ["What charge defines field direction?", "A positive test charge."],
      ["How does a negative charge move in a field?", "Opposite the field direction."],
      ["When do you use F = q × E?", "When field and charge are known and force is unknown."],
    ],
    quiz: ["Electric field means...", ["Force per charge", "Energy per charge", "Charge per volt"], "Force per charge"],
  },
  {
    number: 24,
    moduleId: 1,
    title: "Gauss's Law",
    formula: "ΦE = E × A × cos(θ)",
    calm: "Flux means field through area. Symmetry makes it easier.",
    objective: "Understand electric flux and use Gauss's Law when symmetry is present.",
    homeworkSkills: [
      "Calculate simple electric flux.",
      "Use angle correctly in E A cos(θ).",
      "Know when flux is zero or maximum.",
      "Recognize enclosed charge as the key Gauss's Law idea.",
      "Use symmetry to simplify field problems.",
    ],
    teacherTests: "Can you decide whether a problem is simple flux or Gauss's Law?",
    clues: ["flux", "area", "angle", "surface", "closed surface", "symmetry", "enclosed charge"],
    traps: [
      "Flux is not the same as field.",
      "Only perpendicular field counts.",
      "cos(0°) = 1 and cos(90°) = 0.",
      "Gauss's Law cares about enclosed charge.",
    ],
    math: ["ΦE = E × A × cos(θ)", "Gauss: total flux = q_enc/ε₀", "cos(0°) = 1", "cos(90°) = 0"],
    lesson: [
      ["Flux", "Flux counts field going through a surface."],
      ["Angle", "Only the perpendicular part counts."],
      ["Gauss", "Closed-surface flux depends on charge inside."],
      ["Symmetry", "Sphere, cylinder, and plane shapes are your friends."],
    ],
    example: ["Electric flux", "E, area, angle", "E = 10 N/C, A = 2 m², θ = 0", "ΦE", "ΦE = E × A × cos(θ)", "ΦE = 10 × 2 × 1", "20 N m²/C"],
    cards: [
      ["What is flux?", "Field passing through area."],
      ["What formula gives simple flux?", "ΦE = E × A × cos(θ)."],
      ["When is flux maximum?", "θ = 0 degrees."],
      ["When is flux zero?", "θ = 90 degrees."],
      ["What does Gauss's Law depend on?", "Enclosed charge."],
      ["When is Gauss's Law easiest?", "When there is symmetry."],
    ],
    quiz: ["Flux measures...", ["Field through area", "Voltage through resistance", "Charge per volt"], "Field through area"],
  },
  {
    number: 25,
    moduleId: 2,
    title: "Electric Potential",
    formula: "V = U / q",
    calm: "Voltage is energy per charge.",
    objective: "Use electric potential and potential energy to solve charge-energy problems.",
    homeworkSkills: [
      "Use V = U / q and U = q × V.",
      "Know potential is scalar.",
      "Add potentials directly.",
      "Connect voltage to energy changes.",
    ],
    teacherTests: "Can you switch from force thinking to energy thinking?",
    clues: ["potential", "voltage", "energy", "charge", "scalar"],
    traps: [
      "Potential is not the same as electric field.",
      "Potential is scalar, not vector.",
      "Voltage means potential difference.",
    ],
    math: ["V = U / q", "U = q × V", "Potential values add as scalars"],
    lesson: [
      ["Voltage", "Voltage is energy per charge."],
      ["Energy", "A charge can gain or lose potential energy."],
      ["Scalar", "Potential has no direction."],
      ["Formula", "Use V = U / q."],
    ],
    example: ["Electric potential", "energy, charge", "U = 10 J, q = 2 C", "V", "V = U / q", "V = 10 / 2", "5 V"],
    cards: [
      ["What is voltage?", "Energy per charge."],
      ["What is electric potential?", "Potential energy per charge."],
      ["Is potential scalar or vector?", "Scalar."],
      ["What formula connects U, q, and V?", "V = U / q."],
      ["What does voltage difference mean?", "Energy change per charge."],
      ["How do potentials from multiple charges add?", "Directly, because they are scalars."],
    ],
    quiz: ["Electric potential is...", ["Energy per charge", "Force per charge", "Current per resistance"], "Energy per charge"],
  },
  {
    number: 26,
    moduleId: 2,
    title: "Potential and Field",
    formula: "C = Q / ΔV",
    calm: "Capacitors store charge and energy.",
    objective: "Connect potential, field, and capacitance in capacitor problems.",
    homeworkSkills: [
      "Use C = Q / ΔV.",
      "Find Q from C ΔV.",
      "Understand field inside conductors at equilibrium is zero.",
      "Know dielectrics increase capacitance.",
      "Recognize capacitor energy formulas if given.",
    ],
    teacherTests: "Can you identify charge storage per volt and connect capacitors to electric field and potential?",
    clues: ["capacitor", "capacitance", "charge", "voltage", "dielectric", "plates"],
    traps: [
      "Do not confuse capacitance with charge.",
      "Capacitance is charge per volt.",
      "Dielectrics usually increase capacitance.",
      "Use ΔV for voltage difference.",
    ],
    math: ["C = Q / ΔV", "Q = C ΔV", "ΔV = Q / C"],
    lesson: [
      ["Capacitor", "A capacitor stores separated charge."],
      ["Capacitance", "Capacitance means charge stored per volt."],
      ["Dielectric", "A dielectric increases capacitance."],
      ["Formula", "Use C = Q / ΔV."],
    ],
    example: ["Capacitance", "charge, voltage", "Q = 6 C, ΔV = 3 V", "C", "C = Q / ΔV", "C = 6 / 3", "2 F"],
    cards: [
      ["What does a capacitor store?", "Charge and energy."],
      ["What is capacitance?", "Charge stored per volt."],
      ["What formula defines capacitance?", "C = Q / ΔV."],
      ["What does a dielectric do?", "Usually increases capacitance."],
      ["What is field inside a conductor at equilibrium?", "Zero."],
      ["What unit is capacitance?", "Farad."],
    ],
    quiz: ["Capacitance means charge per...", ["Volt", "Newton", "Hertz"], "Volt"],
  },
  {
    number: 27,
    moduleId: 2,
    title: "Current and Resistance",
    formula: "V = I × R",
    calm: "Voltage pushes. Current flows. Resistance blocks.",
    objective: "Use current, resistance, resistivity, and Ohm's Law in electric flow problems.",
    homeworkSkills: [
      "Use V = I × R.",
      "Solve for current with I = V / R.",
      "Solve for resistance with R = V / I.",
      "Understand current as charge per time.",
      "Recognize Ω, amps, and volts.",
    ],
    teacherTests: "Can you identify which of V, I, and R is missing and rearrange Ohm's Law?",
    clues: ["current", "resistance", "voltage", "Ohm", "amps", "volts"],
    traps: [
      "Do not confuse voltage with current.",
      "Higher resistance means lower current for same voltage.",
      "Use amps for current and Ω for resistance.",
    ],
    math: ["V = I × R", "I = V / R", "R = V / I"],
    lesson: [
      ["Voltage", "Voltage pushes charge."],
      ["Current", "Current is charge flow."],
      ["Resistance", "Resistance opposes flow."],
      ["Formula", "Use V = I × R."],
    ],
    example: ["Current", "voltage, resistance", "V = 12 V, R = 4 Ω", "I", "I = V / R", "I = 12 / 4", "3 A"],
    cards: [
      ["What is current?", "Charge flow per time."],
      ["What is resistance?", "Opposition to current."],
      ["What is Ohm's Law?", "V = I × R."],
      ["How do you solve for current?", "I = V / R."],
      ["What unit is current?", "Ampere."],
      ["What unit is resistance?", "Ohm."],
    ],
    quiz: ["A problem gives V and R. Find...", ["Current", "Wavelength", "Flux"], "Current"],
  },
  {
    number: 28,
    moduleId: 2,
    title: "Fundamentals of Circuits",
    formula: "P = I × V",
    calm: "Kirchhoff's laws are circuit traffic rules.",
    objective: "Analyze simple circuits using current, voltage, power, and resistor rules.",
    homeworkSkills: [
      "Use Kirchhoff's junction rule.",
      "Use Kirchhoff's loop rule.",
      "Use P = I × V for power.",
      "Combine series resistors by adding.",
      "Combine parallel resistors using reciprocals.",
      "Reduce circuits step by step.",
    ],
    teacherTests: "Can you tell series from parallel and use conservation of current and energy?",
    clues: ["circuit", "junction", "loop", "series", "parallel", "power", "resistor"],
    traps: [
      "Series and parallel are not the same.",
      "In series, current is the same.",
      "In parallel, voltage is the same.",
      "Do not forget units: watts, amps, volts, Ω.",
    ],
    math: ["P = I × V", "Series: Rtotal = R1 + R2", "Parallel: 1 / Rtotal = 1 / R1 + 1 / R2"],
    lesson: [
      ["Junction", "Current in equals current out."],
      ["Loop", "Voltage gains and drops balance."],
      ["Series", "Series resistors add directly."],
      ["Parallel", "Parallel resistors use reciprocal math."],
    ],
    example: ["Power", "current, voltage", "I = 3 A, V = 12 V", "P", "P = I × V", "P = 3 × 12", "36 W"],
    cards: [
      ["What does the junction rule conserve?", "Current."],
      ["What does the loop rule conserve?", "Energy."],
      ["What is power formula?", "P = I × V."],
      ["How do series resistors combine?", "They add directly."],
      ["What is the same in series?", "Current."],
      ["What is the same in parallel?", "Voltage."],
    ],
    quiz: ["Kirchhoff's junction rule says...", ["Current in equals current out", "Voltage is always zero", "Resistance disappears"], "Current in equals current out"],
  },
  {
    number: 29,
    moduleId: 3,
    title: "The Magnetic Field",
    formula: "F = q × v × B × sin(θ)",
    calm: "Magnetic fields push moving charges.",
    objective: "Calculate magnetic force and understand how magnetic fields act on moving charges and currents.",
    homeworkSkills: [
      "Use F = q × v × B × sin(θ).",
      "Know magnetic force requires motion.",
      "Know force is zero when velocity is parallel to B.",
      "Know force is maximum when velocity is perpendicular to B.",
      "Recognize tesla as the unit of magnetic field.",
    ],
    teacherTests: "Can you identify q, v, B, and θ and know whether magnetic force exists?",
    clues: ["magnetic field", "B", "tesla", "moving charge", "velocity", "angle"],
    traps: [
      "A stationary charge feels no magnetic force.",
      "Parallel motion gives zero force.",
      "Perpendicular motion gives maximum force.",
      "sin θ controls the angle part.",
    ],
    math: ["F = q × v × B × sin(θ)", "sin(90°) = 1", "sin(0°) = 0"],
    lesson: [
      ["Motion", "Magnetic force needs moving charge."],
      ["Angle", "Perpendicular motion gives maximum force."],
      ["Zero", "Parallel motion gives zero force."],
      ["Formula", "Use F = q × v × B × sin(θ)."],
    ],
    example: ["Magnetic force", "q, v, B, angle", "q = 2 C, v = 3 m/s, B = 4 T, θ = 90", "F", "F = q × v × B × sin(θ)", "F = 2 × 3 × 4 × 1", "24 N"],
    cards: [
      ["What does magnetic force require?", "A moving charge."],
      ["What angle gives maximum magnetic force?", "90 degrees."],
      ["What angle gives zero magnetic force?", "0 degrees or 180 degrees."],
      ["What formula gives magnetic force magnitude?", "F = q × v × B × sin(θ)."],
      ["What unit is B?", "Tesla."],
      ["Why does current feel magnetic force?", "Current is moving charge."],
    ],
    quiz: ["A stationary charge in a magnetic field feels...", ["No magnetic force", "Maximum force", "Voltage"], "No magnetic force"],
  },
  {
    number: 30,
    moduleId: 3,
    title: "Electromagnetic Induction",
    formula: "ε = -N × ΔΦ_B / Δt",
    calm: "Changing magnetic flux creates voltage.",
    objective: "Use Faraday's Law and Lenz's Law to understand induced emf and current.",
    homeworkSkills: [
      "Recognize that induction requires changing flux.",
      "Use emf = N ΔΦ / Δt for magnitude.",
      "Explain the negative sign as Lenz's Law.",
      "Know more turns means more emf.",
      "Connect moving magnets or coils to induced current.",
    ],
    teacherTests: "Can you identify what is changing: B field, area, angle, or time?",
    clues: ["induction", "emf", "flux", "Faraday", "Lenz", "coil", "changing magnetic field"],
    traps: [
      "No changing flux means no induced emf.",
      "The negative sign is direction, not a negative voltage panic event.",
      "More coil turns increases emf.",
      "Flux can change by B, area, or angle changing.",
    ],
    math: ["|ε| = N × ΔΦ / Δt", "Negative sign = Lenz's Law", "More turns = more emf"],
    lesson: [
      ["Flux", "Magnetic flux is B field through area."],
      ["Change", "Changing flux creates emf."],
      ["Lenz", "The induced effect opposes the change."],
      ["Formula", "Use ε = -N × ΔΦ_B / Δt."],
    ],
    example: ["Induced emf", "turns, flux, time", "N = 10, ΔΦ = 0.20 Wb, Δt = 0.50 s", "emf", "emf = N ΔΦ / Δt", "emf = 10(0.20)/0.50", "4 V"],
    cards: [
      ["What causes induction?", "Changing magnetic flux."],
      ["What does Faraday's Law find?", "Induced emf."],
      ["What does Lenz's Law say?", "Induced effects oppose the change."],
      ["What increases emf?", "More turns or faster flux change."],
      ["Can constant flux induce emf?", "No."],
      ["What can change flux?", "B field, area, angle, or time."],
    ],
    quiz: ["Changing magnetic flux creates...", ["emf", "mass", "gravity"], "emf"],
  },
  {
    number: 31,
    moduleId: 3,
    title: "Electromagnetic Waves",
    formula: "c = f × λ",
    calm: "Light is an electromagnetic wave.",
    objective: "Connect electric and magnetic fields to electromagnetic waves and light.",
    homeworkSkills: [
      "Use c = f × λ for EM waves.",
      "Know c = 3 × 10⁸ m/s.",
      "Solve for wavelength or frequency.",
      "Understand EM waves do not need a medium.",
      "Recognize light as an EM wave.",
    ],
    teacherTests: "Can you use the same wave equation for light and EM waves?",
    clues: ["light", "EM wave", "frequency", "wavelength", "speed of light", "vacuum"],
    traps: [
      "Do not use sound speed for light.",
      "EM waves can travel through vacuum.",
      "Use c for light speed.",
      "Keep scientific notation clean.",
    ],
    math: ["c = f × λ", "c = 3 × 10⁸ m/s", "λ = c / f", "f = c / λ"],
    lesson: [
      ["Fields", "Electric and magnetic fields travel together."],
      ["Vacuum", "EM waves do not need air."],
      ["Light", "Light is an EM wave."],
      ["Formula", "Use c = f × λ."],
    ],
    example: ["Wavelength of light", "frequency, speed of light", "f = 6 × 10¹⁴ Hz, c = 3 × 10⁸ m/s", "lambda", "λ = c / f", "lambda = (3 × 10⁸)/(6 × 10¹⁴)", "5 × 10⁻⁷ m"],
    cards: [
      ["What is light?", "An electromagnetic wave."],
      ["Can EM waves travel in vacuum?", "Yes."],
      ["What is c?", "Speed of light."],
      ["What is the EM wave equation?", "c = f × λ."],
      ["How do you solve for wavelength?", "λ = c / f."],
      ["What fields make an EM wave?", "Electric and magnetic fields."],
    ],
    quiz: ["Light is...", ["An EM wave", "Only sound", "A circuit"], "An EM wave"],
  },
  {
    number: 33,
    moduleId: 4,
    title: "Chapter 33 Final Topic",
    formula: "Clues → Givens → Unknown → Formula",
    calm: "Use Canvas to fill exact formulas.",
    objective: "Use the universal method to learn the final topic once Canvas gives the exact chapter details.",
    homeworkSkills: [
      "Find the chapter title in Canvas.",
      "Copy formulas your teacher uses.",
      "Find clue words in Mastering Physics.",
      "Build one example problem from the homework.",
      "Add traps after seeing quiz mistakes.",
    ],
    teacherTests: "Can you transfer the same method to a new chapter?",
    clues: ["Canvas", "homework", "quiz", "final topic"],
    traps: [
      "Do not panic if the topic is unfamiliar.",
      "Start with clue words.",
      "Use units to choose formulas.",
      "Let homework show the test pattern.",
    ],
    math: ["Circle clues", "List givens", "Find unknown", "Pick formula", "Check units"],
    lesson: [
      ["Canvas", "Find the exact title first."],
      ["Homework", "Homework shows exam style."],
      ["Method", "Use the same solving path."],
      ["Update", "Add exact formulas after lecture."],
    ],
    example: ["Unknown topic", "chapter words", "write givens", "unknown", "formula from Canvas", "plug in", "answer with units"],
    cards: [
      ["First move on unknown chapter?", "Find clue words."],
      ["Best source for exact formulas?", "Canvas and homework."],
      ["What should you write first?", "Givens with units."],
      ["What do units help with?", "Choosing and checking formulas."],
    ],
    quiz: ["First move on unknown topic?", ["Circle clues", "Panic", "Guess"], "Circle clues"],
  },
  {
    number: 32,
    moduleId: 4,
    title: "Chapter 32 Final Topic",
    formula: "Final Review Mode",
    calm: "This is the last new-content sprint.",
    objective: "Turn all chapters into a final-review formula and clue-word map.",
    homeworkSkills: [
      "Group formulas by module.",
      "Match clue words to equations.",
      "Practice rearranging formulas.",
      "Check units every time.",
      "Use missed problems to build review cards.",
    ],
    teacherTests: "Can you recognize problem type quickly on the final?",
    clues: ["final review", "quiz", "homework", "exam"],
    traps: [
      "Do not study chapters randomly.",
      "Do not skip unit checks.",
      "Do not memorize without problem practice.",
      "Do not ignore old mistakes.",
    ],
    math: ["Group formulas by module", "Practice rearranging", "Check units", "Review missed problems"],
    lesson: [
      ["Organize", "Sort formulas by module."],
      ["Recognize", "Match clue words to formula families."],
      ["Practice", "Redo missed homework problems."],
      ["Final", "Use the same method every time."],
    ],
    example: ["Final review", "clue words", "givens", "unknown", "formula family", "plug in", "check units"],
    cards: [
      ["Best final strategy?", "Match clue words to formulas."],
      ["What should you redo?", "Missed homework and quiz problems."],
      ["What should every answer include?", "Units."],
      ["What prevents overwhelm?", "One module at a time."],
    ],
    quiz: ["After Chapter 32, focus on...", ["Final Review", "Starting over", "Ignoring units"], "Final Review"],
  },
];


const SMART_SOLVER_RULES = [
  {
    topic: "Waves",
    keywords: ["wave", "frequency", "wavelength", "lambda", "period", "speed", "sound", "light", "hz", "hertz"],
    formula: "v = f × λ",
    unknowns: { speed: "v", velocity: "v", frequency: "f", wavelength: "λ", period: "T" },
    steps: [
      "Circle f, λ, v, or T.",
      "If period T is given, convert with f = 1 / T.",
      "Use v = f × λ.",
      "Rearrange before plugging in.",
      "Check units: m/s, Hz, and meters.",
    ],
  },
  {
    topic: "Coulomb's Law / Electric Force",
    keywords: ["charge", "charges", "q1", "q2", "coulomb", "force", "repel", "attract", "distance", "apart"],
    formula: "F = k × q₁ × q₂ / r²",
    unknowns: { force: "F", charge: "q", distance: "r" },
    steps: [
      "Find q₁, q₂, and distance r.",
      "Use k = 9 × 10⁹ unless your teacher gives another value.",
      "Square r before dividing.",
      "Use F = k × q₁ × q₂ / r².",
      "Same charges repel. Opposite charges attract.",
    ],
  },
  {
    topic: "Electric Field",
    keywords: ["electric field", "field", "n/c", "force per charge", "test charge"],
    formula: "E = F / q",
    unknowns: { field: "E", force: "F", charge: "q" },
    steps: [
      "Find force F and charge q.",
      "Use E = F / q for electric field.",
      "Use F = q × E for force.",
      "Positive charge follows field direction.",
      "Negative charge feels force opposite the field.",
    ],
  },
  {
    topic: "Flux / Gauss's Law",
    keywords: ["flux", "gauss", "surface", "area", "angle", "enclosed", "symmetry", "sphere", "cylinder"],
    formula: "ΦE = E × A × cos(θ)",
    unknowns: { flux: "ΦE", field: "E", area: "A", angle: "θ", charge: "q_enc" },
    steps: [
      "If E, A, and θ appear, use ΦE = E × A × cos(θ).",
      "If closed surface or enclosed charge appears, think Gauss's Law.",
      "For Gauss's Law, total flux = q_enc / ε₀.",
      "cos(0°) = 1 and cos(90°) = 0.",
      "Use symmetry when possible.",
    ],
  },
  {
    topic: "Electric Potential / Voltage",
    keywords: ["potential", "voltage", "volt", "energy", "potential energy", "joule"],
    formula: "V = U / q",
    unknowns: { voltage: "V", potential: "V", energy: "U", charge: "q" },
    steps: [
      "Find energy U, charge q, and voltage V.",
      "Use V = U / q for voltage.",
      "Use U = q × V for energy.",
      "Potential is scalar.",
      "Voltage means energy per charge.",
    ],
  },
  {
    topic: "Capacitance",
    keywords: ["capacitor", "capacitance", "farad", "charge stored", "plates", "dielectric"],
    formula: "C = Q / ΔV",
    unknowns: { capacitance: "C", charge: "Q", voltage: "ΔV" },
    steps: [
      "Find C, Q, and ΔV.",
      "Use C = Q / ΔV.",
      "Rearrange: Q = C × ΔV or ΔV = Q / C.",
      "Dielectrics usually increase capacitance.",
      "Check units: farads.",
    ],
  },
  {
    topic: "Ohm's Law / Current and Resistance",
    keywords: ["current", "resistance", "resistor", "ohm", "ohms", "voltage", "amp", "amps", "battery"],
    formula: "V = I × R",
    unknowns: { current: "I", voltage: "V", resistance: "R" },
    steps: [
      "Find V, I, and R.",
      "Use V = I × R.",
      "For current: I = V / R.",
      "For resistance: R = V / I.",
      "Check units: volts, amps, ohms.",
    ],
  },
  {
    topic: "Circuits / Power / Kirchhoff",
    keywords: ["circuit", "series", "parallel", "junction", "loop", "kirchhoff", "power", "watts", "resistors"],
    formula: "P = I × V",
    unknowns: { power: "P", current: "I", voltage: "V", resistance: "R" },
    steps: [
      "Decide series or parallel first.",
      "Series: R_total = R₁ + R₂ + ...",
      "Parallel: 1 / R_total = 1 / R₁ + 1 / R₂ + ...",
      "Power: P = I × V.",
      "Junction rule: current in = current out.",
      "Loop rule: voltage gains and drops balance.",
    ],
  },
  {
    topic: "Magnetic Force",
    keywords: ["magnetic", "magnetic field", "tesla", "moving charge", "velocity", "angle", "b field"],
    formula: "F = q × v × B × sin(θ)",
    unknowns: { force: "F", charge: "q", velocity: "v", speed: "v", magnetic: "B", angle: "θ" },
    steps: [
      "Find q, v, B, and θ.",
      "Use F = q × v × B × sin(θ).",
      "θ = 90° gives maximum force.",
      "θ = 0° gives zero force.",
      "Stationary charge means no magnetic force.",
    ],
  },
  {
    topic: "Electromagnetic Induction",
    keywords: ["induction", "emf", "faraday", "lenz", "coil", "turns", "magnetic flux", "changing flux", "induced"],
    formula: "ε = -N × ΔΦ_B / Δt",
    unknowns: { emf: "ε", voltage: "ε", turns: "N", flux: "ΔΦ_B", time: "Δt" },
    steps: [
      "Find turns N, flux change ΔΦ_B, and time Δt.",
      "For magnitude: |ε| = N × ΔΦ_B / Δt.",
      "Negative sign is Lenz's Law.",
      "No changing flux means no induced emf.",
      "Faster change or more turns means bigger emf.",
    ],
  },
  {
    topic: "Electromagnetic Waves / Light",
    keywords: ["light", "electromagnetic", "em wave", "speed of light", "wavelength", "frequency", "vacuum"],
    formula: "c = f × λ",
    unknowns: { speed: "c", frequency: "f", wavelength: "λ" },
    steps: [
      "For light, use c = 3 × 10⁸ m/s.",
      "Use c = f × λ.",
      "For wavelength: λ = c / f.",
      "For frequency: f = c / λ.",
      "Do not use sound speed for light.",
    ],
  },
];

function analyzeHomeworkProblem(questionText) {
  const text = questionText.toLowerCase();

  if (!text.trim()) {
    return {
      topic: "Paste a homework problem first.",
      formula: "No formula yet.",
      clues: [],
      unknown: "No unknown yet.",
      givens: [],
      steps: [
        "Paste the full question.",
        "Include all numbers and units.",
        "Read the likely topic and formula.",
      ],
    };
  }

  let bestRule = SMART_SOLVER_RULES[0];
  let bestScore = -1;

  SMART_SOLVER_RULES.forEach((rule) => {
    let score = 0;
    rule.keywords.forEach((word) => {
      if (text.includes(word.toLowerCase())) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  });

  const clues = bestRule.keywords.filter((word) => text.includes(word.toLowerCase()));

  const numberPattern = /[-+]?\d*\.?\d+(?:\s?×\s?10\^?[-+]?\d+|e[-+]?\d+)?\s?(?:hz|hertz|m\/s|m\^2|m²|m|s|sec|seconds|c|n|v|volts|a|amps|ohm|ohms|Ω|t|tesla|wb|j|joules|f|farad|farads)?/gi;
  const givens = questionText.match(numberPattern) || [];

  let unknown = "Look for: find, calculate, determine, what is.";
  Object.keys(bestRule.unknowns).forEach((word) => {
    if (
      text.includes("find " + word) ||
      text.includes("calculate " + word) ||
      text.includes("determine " + word) ||
      text.includes("what is the " + word)
    ) {
      unknown = bestRule.unknowns[word];
    }
  });

  return {
    topic: bestScore <= 0 ? "Best guess: check clue words manually" : bestRule.topic,
    formula: bestRule.formula,
    clues,
    unknown,
    givens,
    steps: bestRule.steps,
  };
}

function getLessonVisual(chapterNumber, lessonIndex, lesson) {
  const label = lesson?.[0] || "Concept";
  const text = lesson?.[1] || "Read the concept slowly.";

  const visuals = {
    16: [
      ["🌊", "Wave Motion", "particle wiggle ↕", "energy travels →", "A wave carries energy forward."],
      ["📏", "Wavelength", "crest → crest", "one full cycle", "λ is cycle length, not height."],
      ["⏱️", "Frequency", "cycles per second", "Hz = 1/s", "Frequency is how often."],
      ["🧮", "Wave Equation", "v = f × λ", "speed = frequency × wavelength", "Use this when f and λ appear."],
    ],
    22: [
      ["➕➕", "Repulsion", "← q₁     q₂ →", "same signs push apart", "Same charges repel."],
      ["➕➖", "Attraction", "q₁ →   ← q₂", "opposite signs pull together", "Opposite charges attract."],
      ["📏", "Inverse Square", "r doubles", "force ÷ 4", "Always square r."],
      ["🧮", "Coulomb Force", "F = k × q₁ × q₂ / r²", "charge force", "Use q₁, q₂, and r."],
    ],
    23: [
      ["👻", "Field Map", "charge creates arrows", "arrows show force direction", "Field is force per charge."],
      ["💪", "Force Per Charge", "E = F / q", "N/C", "Divide force by charge."],
      ["➕", "Direction", "positive follows field", "negative goes opposite", "Sign changes force direction."],
    ],
    24: [
      ["➡️", "Flux", "field arrows", "through area", "Flux counts field through surface."],
      ["📐", "Angle", "straight = maximum", "sideways = zero", "Use cos(θ)."],
      ["🧊", "Gauss", "closed surface", "charge inside", "Enclosed charge controls flux."],
    ],
    25: [
      ["🔋", "Voltage", "energy / charge", "V = U / q", "Voltage is energy per coulomb."],
      ["⛰️", "Potential", "energy hill", "scalar value", "Potential has no direction."],
    ],
    26: [
      ["🥫", "Capacitor", "+ plate   - plate", "stores charge", "Capacitors store charge and energy."],
      ["🔋", "Capacitance", "C = Q / ΔV", "charge per volt", "More C stores more charge."],
      ["🧈", "Dielectric", "material between plates", "C increases", "Dielectrics usually increase capacitance."],
    ],
    27: [
      ["🔋", "Voltage", "battery push", "V", "Voltage pushes charge."],
      ["🚗", "Current", "charge traffic →", "I", "Current is charge per time."],
      ["🚧", "Resistance", "narrow road", "R", "Resistance blocks current."],
      ["🧮", "Ohm’s Law", "V = I × R", "I = V / R", "Use when V, I, R appear."],
    ],
    28: [
      ["🚦", "Junction Rule", "current in", "current out", "Current is conserved."],
      ["🔁", "Loop Rule", "voltage gains", "voltage drops", "Energy is conserved."],
      ["📏", "Series", "R_total = R₁ + R₂", "same current", "Series resistors add."],
      ["🌀", "Parallel", "1/R_total = 1/R₁ + 1/R₂", "same voltage", "Parallel uses reciprocals."],
    ],
    29: [
      ["🧍", "No Motion", "v = 0", "F = 0", "Stationary charge has no magnetic force."],
      ["🏃", "Moving Charge", "v through B", "force appears", "Magnetic force needs motion."],
      ["📐", "Angle", "90° max", "0° zero", "Use sin(θ)."],
      ["🧲", "Magnetic Force", "F = q × v × B × sin(θ)", "perpendicular motion", "Only perpendicular motion counts."],
    ],
    30: [
      ["🧲", "Move Magnet", "B changes", "coil reacts", "Changing magnetic field matters."],
      ["🌀", "Flux Change", "ΔΦ_B", "through coil", "Induction needs changing flux."],
      ["⚡", "Induced EMF", "ε = -N × ΔΦ_B / Δt", "voltage appears", "Faster change means bigger emf."],
      ["🙅", "Lenz’s Law", "opposes change", "negative sign", "Induced current fights the change."],
    ],
    31: [
      ["⚡", "Electric Field", "E wiggles", "changing", "EM waves include electric fields."],
      ["🧲", "Magnetic Field", "B wiggles", "changing", "E and B travel together."],
      ["📡", "EM Wave", "E + B", "travels through vacuum", "Light is an EM wave."],
      ["💡", "Light Equation", "c = f × λ", "speed of light", "Use c for EM waves."],
    ],
  };

  const chapterVisuals = visuals[chapterNumber] || [["🧠", label, text, "clues → formula", "Use clue words first."]];
  return chapterVisuals[lessonIndex] || [label, label, text, "concept → formula", "Use clue words first."];
}

const SOLVER_LABELS = ["Problem Type", "Clue Words", "Knowns", "Unknown", "Formula", "Plug In", "Answer"];

function getChapter(number) {
  return CHAPTERS.find((chapter) => chapter.number === number);
}

function Screen({ children, calmMode }) {
  return <ScrollView contentContainerStyle={calmMode ? styles.calmContainer : styles.container}>{children}</ScrollView>;
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
      <Text style={type === "secondary" || type === "gold" ? styles.secondaryText : styles.buttonText}>{label}</Text>
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
  const [methodIndex, setMethodIndex] = useState(0);
  const [formulaIndex, setFormulaIndex] = useState(0);
  const [calcIndex, setCalcIndex] = useState(0);
  const [derivationIndex, setDerivationIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [solverIndex, setSolverIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [problemInput, setProblemInput] = useState("");
  const [score, setScore] = useState(0);
  const [calmMode, setCalmMode] = useState(true);
  const [lessonPlaying, setLessonPlaying] = useState(false);

  const module = MODULES[moduleIndex];
  const chapter = CHAPTERS[chapterIndex];
  const method = METHOD[methodIndex];
  const formula = FORMULA_MAP[formulaIndex];
  const calc = CALC3_TOOLS[calcIndex];
  const derivation = DERIVATIONS[derivationIndex];
  const lesson = chapter.lesson[lessonIndex];
  const currentCard = chapter.cards[cardIndex] || ["Study this objective.", chapter.objective];

  const solverSteps = useMemo(() => {
    return SOLVER_LABELS.map((label, index) => [label, chapter.example[index]]);
  }, [chapter]);

  const problemAnalysis = useMemo(() => {
    return analyzeHomeworkProblem(problemInput);
  }, [problemInput]);

  const movingArrow = motion.interpolate({
    inputRange: [0, 1],
    outputRange: [-45, 45],
  });

  const pulseScale = motion.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.12, 1],
  });

  useEffect(() => {
    if (screen !== "lesson" || !lessonPlaying) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    const timer = setTimeout(() => {
      if (lessonIndex + 1 < chapter.lesson.length) {
        setLessonIndex((old) => old + 1);
      } else {
        setLessonPlaying(false);
      }
    }, 3600);

    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [screen, lessonPlaying, lessonIndex, chapter.lesson.length, motion]);

  useEffect(() => {
    if (screen !== "lesson" || !lessonPlaying) return;

    const timer = setTimeout(() => {
      if (lessonIndex + 1 < chapter.lesson.length) {
        setLessonIndex((oldIndex) => oldIndex + 1);
      } else {
        setLessonPlaying(false);
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [screen, lessonPlaying, lessonIndex, chapter.lesson.length]);

  function resetChapter() {
    setLessonIndex(0);
    setSolverIndex(0);
    setCardIndex(0);
    setShowBack(false);
    setFeedback("");
    setLessonPlaying(false);
  }

  function openChapter(number) {
    const index = CHAPTERS.findIndex((item) => item.number === number);
    if (index === -1) return;
    setChapterIndex(index);
    resetChapter();
    setScreen("chapter");
  }

  function nextIndex(current, setter, length) {
    setter(current + 1 < length ? current + 1 : 0);
  }

  function checkAnswer(choice) {
    const correct = chapter.quiz[2];
    if (choice === correct) {
      setFeedback("Correct. You identified the objective.");
      setScore((old) => old + 10);
    } else {
      setFeedback(`Not quite. Correct answer: ${correct}`);
    }
  }

  if (screen === "home") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Physics Final Boss" subtitle="Homework-Ready Objectives Edition" />
        <Card>
          <Text style={styles.bigText}>Goal: make homework problems feel predictable.</Text>
          <Text style={styles.body}>Each chapter teaches objectives, clue words, formulas, common traps, guided examples, and deeper flashcards.</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.badge}>Score: {score}</Text>
            <Text style={styles.badge}>Calm Mode: {calmMode ? "ON" : "OFF"}</Text>
          </View>
          <Button label="Start: What Do I Do First?" onPress={() => setScreen("next")} />
          <Button label="Choose a Module" type="orange" onPress={() => setScreen("modules")} />
          <Button label="Homework Problem Solver" type="purple" onPress={() => setScreen("smartSolver")} />
          <Button label="Fool-Proof Method" type="purple" onPress={() => setScreen("method")} />
          <Button label="Reset Brain" type="gold" onPress={() => setScreen("panic")} />
          <Button label={calmMode ? "Turn Calm Mode Off" : "Turn Calm Mode On"} type="secondary" onPress={() => setCalmMode(!calmMode)} />
        </Card>
      </Screen>
    );
  }

  if (screen === "next") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Do This First" subtitle="A simple study path" />
        <Card>
          <Text style={styles.bigText}>Follow this order.</Text>
          <Text style={styles.listItem}>1. Learn the fool-proof method.</Text>
          <Text style={styles.listItem}>2. Pick one module.</Text>
          <Text style={styles.listItem}>3. Pick one chapter.</Text>
          <Text style={styles.listItem}>4. Read objectives.</Text>
          <Text style={styles.listItem}>5. Do guided solver.</Text>
          <Text style={styles.listItem}>6. Do flashcards and quick check.</Text>
          <Button label="Start Method" onPress={() => setScreen("method")} />
          <Button label="Go to Modules" type="orange" onPress={() => setScreen("modules")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "panic") {
    return (
      <Screen calmMode={true}>
        <Header title="Reset Brain" subtitle="You are overloaded, not stupid." />
        <Card>
          <Text style={styles.bigText}>Do one chapter. Not all physics.</Text>
          <Text style={styles.body}>Your only job is to pick one chapter and follow the buttons in order. The app will hold the steps for you.</Text>
          <Button label="Take Me to Modules" onPress={() => setScreen("modules")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "method") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Fool-Proof Method" subtitle={`${methodIndex + 1} of ${METHOD.length}`} />
        <Card>
          <Text style={styles.step}>{method.title}</Text>
          <Text style={styles.bigText}>{method.body}</Text>
          <Text style={styles.highlight}>{method.example}</Text>
          <Button label={methodIndex + 1 < METHOD.length ? "Next Step" : "Restart Method"} onPress={() => nextIndex(methodIndex, setMethodIndex, METHOD.length)} />
          <Button label="Formula Map" type="purple" onPress={() => setScreen("formulas")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "formulas") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Formula Map" subtitle={`${formulaIndex + 1} of ${FORMULA_MAP.length}`} />
        <Card>
          <Text style={styles.step}>{formula[0]}</Text>
          <Text style={styles.formula}>{formula[1]}</Text>
          <Text style={styles.miniHeader}>Clue Words</Text>
          <Text style={styles.highlight}>{formula[2]}</Text>
          <Text style={styles.miniHeader}>Use It When</Text>
          <Text style={styles.body}>{formula[3]}</Text>
          <Button label={formulaIndex + 1 < FORMULA_MAP.length ? "Next Formula" : "Restart Formula Map"} onPress={() => nextIndex(formulaIndex, setFormulaIndex, FORMULA_MAP.length)} />
          <Button label="Calc 3 Toolkit" type="purple" onPress={() => setScreen("calc3")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "calc3") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Calc 3 Toolkit" subtitle={`${calcIndex + 1} of ${CALC3_TOOLS.length}`} />
        <Card>
          <Text style={styles.step}>{calc[0]}</Text>
          <Text style={styles.formula}>{calc[1]}</Text>
          <Text style={styles.body}>{calc[2]}</Text>
          <Button label={calcIndex + 1 < CALC3_TOOLS.length ? "Next Calc 3 Tool" : "Restart Calc 3"} onPress={() => nextIndex(calcIndex, setCalcIndex, CALC3_TOOLS.length)} />
          <Button label="Derive Equations" type="purple" onPress={() => setScreen("derivations")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "derivations") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Derive Equations" subtitle={`${derivationIndex + 1} of ${DERIVATIONS.length}`} />
        <Card>
          <Text style={styles.step}>{derivation.title}</Text>
          <Text style={styles.formula}>{derivation.formula}</Text>
          <Text style={styles.highlight}>{derivation.simple}</Text>
          <Text style={styles.miniHeader}>Steps</Text>
          <List items={derivation.steps} />
          <Button label={derivationIndex + 1 < DERIVATIONS.length ? "Next Derivation" : "Restart Derivations"} onPress={() => nextIndex(derivationIndex, setDerivationIndex, DERIVATIONS.length)} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "modules") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Pick One Module" subtitle="Only choose one." />
        {MODULES.map((item, index) => (
          <Pressable key={item.id} style={styles.moduleCard} onPress={() => { setModuleIndex(index); setScreen("module"); }}>
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
      <Screen calmMode={calmMode}>
        <Header title={module.title} subtitle={module.dates} />
        <Card>
          <Text style={styles.miniHeader}>Focus</Text>
          <Text style={styles.highlight}>{module.focus}</Text>
          <Text style={styles.miniHeader}>Schedule</Text>
          <List items={module.schedule} />
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
      <Screen calmMode={calmMode}>
        <Header title={`Chapter ${chapter.number}`} subtitle={chapter.title} />
        <Card>
          <Text style={styles.bigText}>{chapter.calm}</Text>
          <Text style={styles.miniHeader}>Learning Objective</Text>
          <Text style={styles.highlight}>{chapter.objective}</Text>
          <Text style={styles.miniHeader}>Main Formula</Text>
          <Text style={styles.formula}>{chapter.formula}</Text>
          <Text style={styles.miniHeader}>Clue Words</Text>
          <Text style={styles.highlight}>{chapter.clues.join(" | ")}</Text>
          <Button label="1. Deep Study Guide" onPress={() => setScreen("deepGuide")} />
          <Button label="2. Tiny Lesson Video" type="purple" onPress={() => { setLessonIndex(0); setLessonPlaying(true); setScreen("lesson"); }} />
          <Button label="3. Guided Solver" type="orange" onPress={() => setScreen("solver")} />
          <Button label="Paste a Homework Problem" type="purple" onPress={() => setScreen("smartSolver")} />
          <Button label="4. Flashcards and Check" type="gold" onPress={() => setScreen("practice")} />
          <Button label="Back to Module" type="secondary" onPress={() => setScreen("module")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "deepGuide") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Deep Study Guide" subtitle={`Chapter ${chapter.number}: ${chapter.title}`} />
        <Card>
          <Text style={styles.miniHeader}>What You Must Be Able To Do</Text>
          <List items={chapter.homeworkSkills} />
          <Text style={styles.miniHeader}>What Homework Is Testing</Text>
          <Text style={styles.highlight}>{chapter.teacherTests}</Text>
          <Text style={styles.miniHeader}>Common Traps</Text>
          <List items={chapter.traps} />
          <Text style={styles.miniHeader}>Math Tools</Text>
          <List items={chapter.math} />
          <Button label="Next: Tiny Concept Clip" onPress={() => { setLessonIndex(0); setLessonPlaying(true); setScreen("lesson"); }} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "lesson") {
    const visual = getLessonVisual(chapter.number, lessonIndex, lesson);
    const progressWidth = `${((lessonIndex + 1) / chapter.lesson.length) * 100}%`;

    return (
      <Screen calmMode={calmMode}>
        <Header title="Tiny Concept Clip" subtitle={`Chapter ${chapter.number}: ${chapter.title}`} />

        <Card>
          <View style={styles.videoTopRow}>
            <Text style={styles.videoPill}>Scene {lessonIndex + 1} of {chapter.lesson.length}</Text>
            <Text style={styles.videoPill}>{lessonPlaying ? "Playing" : "Paused"}</Text>
          </View>

          <View style={styles.conceptVideoFrame}>
            <Animated.Text style={[styles.lessonVideoEmoji, { transform: [{ scale: pulseScale }] }]}>
              {visual[0]}
            </Animated.Text>

            <Text style={styles.lessonVideoTitle}>{visual[1]}</Text>

            <View style={styles.animationBoard}>
              <Text style={styles.animationLine}>{visual[2]}</Text>

              <Animated.Text
                style={[
                  styles.movingArrow,
                  { transform: [{ translateX: movingArrow }] },
                ]}
              >
                ➜
              </Animated.Text>

              <Text style={styles.animationLine}>{visual[3]}</Text>
            </View>

            <Text style={styles.lessonVideoText}>{lesson[1]}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progressWidth }]} />
          </View>

          <Text style={styles.takeawayBox}>Takeaway: {visual[4]}</Text>

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

            <Pressable
              style={styles.playButton}
              onPress={() => setLessonPlaying(!lessonPlaying)}
            >
              <Text style={styles.playText}>{lessonPlaying ? "Pause" : "Play"}</Text>
            </Pressable>

            <Pressable
              style={styles.controlButton}
              onPress={() => {
                if (lessonIndex + 1 < chapter.lesson.length) {
                  setLessonIndex(lessonIndex + 1);
                  setLessonPlaying(false);
                } else {
                  setScreen("solver");
                }
              }}
            >
              <Text style={styles.controlText}>
                {lessonIndex + 1 < chapter.lesson.length ? "Next" : "Solver"}
              </Text>
            </Pressable>
          </View>

          <Button label="Next: Guided Solver" type="orange" onPress={() => setScreen("solver")} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "smartSolver") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Homework Problem Solver" subtitle="Paste the question. The app finds the path." />

        <Card>
          <Text style={styles.bigText}>Paste one homework question.</Text>
          <Text style={styles.body}>
            Include the full sentence, numbers, and units. The app will identify the likely topic, formula, givens, unknown, and solve path.
          </Text>

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
            {problemAnalysis.clues.length ? problemAnalysis.clues.join(" | ") : "No clear clue words yet. Paste the full problem."}
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
          <Button label="Formula Map" type="purple" onPress={() => setScreen("formulas")} />
          <Button label="Back Home" type="secondary" onPress={() => setScreen("home")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "solver") {
    const step = solverSteps[solverIndex];
    return (
      <Screen calmMode={calmMode}>
        <Header title="Guided Solver" subtitle={`${solverIndex + 1} of ${solverSteps.length}`} />
        <Card>
          <Text style={styles.step}>{step[0]}</Text>
          <Text style={styles.bigText}>{step[1]}</Text>
          <Button label={solverIndex + 1 < solverSteps.length ? "Next Solver Step" : "Next: Practice"} onPress={() => { if (solverIndex + 1 < solverSteps.length) setSolverIndex(solverIndex + 1); else setScreen("practice"); }} />
          <Button label="Back to Chapter" type="secondary" onPress={() => setScreen("chapter")} />
        </Card>
      </Screen>
    );
  }

  if (screen === "practice") {
    return (
      <Screen calmMode={calmMode}>
        <Header title="Flashcards and Check" subtitle={`Chapter ${chapter.number}`} />
        <Card>
          <Text style={styles.miniHeader}>Deep Flashcard {cardIndex + 1} of {chapter.cards.length}</Text>
          <Text style={styles.bigText}>{showBack ? currentCard[1] : currentCard[0]}</Text>
          <Button label={showBack ? "Show Question" : "Show Answer"} onPress={() => setShowBack(!showBack)} />
          <Button label="Next Flashcard" type="purple" onPress={() => { setCardIndex(cardIndex + 1 < chapter.cards.length ? cardIndex + 1 : 0); setShowBack(false); }} />
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
    fontSize: 32,
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
    fontSize: 26,
    lineHeight: 38,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.3,
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
  lessonVideoFrame: {
    backgroundColor: "#111827",
    borderColor: "#38bdf8",
    borderWidth: 2,
    borderRadius: 26,
    padding: 22,
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  lessonVideoEmoji: {
    fontSize: 88,
    textAlign: "center",
    marginBottom: 14,
  },
  lessonVideoTitle: {
    color: "#fbbf24",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },
  lessonVideoText: {
    color: "#f8fafc",
    fontSize: 25,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
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
  caption: {
    color: "#0f172a",
    backgroundColor: "#e0f2fe",
    padding: 14,
    borderRadius: 16,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
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
  lessonVideoEmoji: {
    fontSize: 82,
    textAlign: "center",
    marginBottom: 10,
  },
  lessonVideoTitle: {
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
  lessonVideoText: {
    color: "#f8fafc",
    fontSize: 21,
    lineHeight: 31,
    fontWeight: "800",
    textAlign: "center",
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
  takeawayBox: {
    color: "#0f172a",
    backgroundColor: "#dcfce7",
    padding: 15,
    borderRadius: 18,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 4,
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

});