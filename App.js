import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

const chapters = [
  {
    chapter: 16,
    part: "Part IV: Oscillations and Waves",
    title: "Traveling Waves",
    emoji: "🌊",
    formula: "v = fλ",
    tiny:
      "A traveling wave carries energy from one place to another. Frequency is how often. Wavelength is how long. Speed is v = fλ.",
    bigIdea:
      "Traveling waves move energy through space or matter without permanently moving the material itself. This chapter builds the language of waves: amplitude, wavelength, frequency, period, speed, intensity, decibels, and Doppler shift.",
    sections: [
      "16.1 An Introduction to Waves: A wave is a traveling disturbance that carries energy.",
      "16.2 One-Dimensional Waves: Waves on strings and ropes move along one direction.",
      "16.3 Sinusoidal Waves: Smooth repeating waves can be described with amplitude, wavelength, frequency, and period.",
      "16.4 Advanced: The Wave Equation on a String connects wave speed to tension and mass density.",
      "16.5 Sound and Light: Sound needs a medium. Light can travel through vacuum.",
      "16.6 Advanced: The Wave Equation in a Fluid describes sound waves in fluids.",
      "16.7 Waves in Two and Three Dimensions: Waves can spread across surfaces or through space.",
      "16.8 Power, Intensity, and Decibels: Intensity is power per area. Decibels measure sound level.",
      "16.9 The Doppler Effect: Motion changes the observed frequency.",
    ],
    clues: ["wave", "frequency", "wavelength", "period", "amplitude", "speed", "decibel", "Doppler"],
    cards: [
      ["Wave speed formula?", "v = fλ."],
      ["Frequency means?", "How many cycles happen per second."],
      ["Wavelength means?", "Length of one wave cycle."],
      ["Period means?", "Time for one cycle."],
    ],
    checks: [
      {
        q: "A problem gives frequency and wavelength. What formula do you use?",
        choices: ["v = fλ", "V = IR", "Q = mcΔT"],
        correct: "v = fλ",
        why: "Frequency and wavelength are wave-speed clues.",
      },
      {
        q: "The Doppler effect happens when...",
        choices: ["Source or observer moves", "Temperature is zero", "Resistance disappears"],
        correct: "Source or observer moves",
        why: "Relative motion changes the observed frequency.",
      },
    ],
    solver: {
      problem: "A wave has frequency 10 Hz and wavelength 2 m. What is the wave speed?",
      steps: [
        "Circle clues: frequency, wavelength, wave speed.",
        "Pick formula: v = fλ.",
        "List givens: f = 10 Hz and λ = 2 m.",
        "Plug in: v = 10 × 2.",
        "Final answer: v = 20 m/s.",
      ],
    },
    boss: {
      q: "Boss: A wave carries...",
      choices: ["Energy", "Permanent matter displacement", "Only charge"],
      correct: "Energy",
      why: "Waves transfer energy without permanently transporting the medium.",
    },
  },

  {
    chapter: 17,
    part: "Part IV: Oscillations and Waves",
    title: "Superposition",
    emoji: "🎸",
    formula: "Resultant wave = wave 1 + wave 2",
    tiny:
      "When waves overlap, they add. If they line up, bigger wave. If they cancel, smaller wave.",
    bigIdea:
      "Superposition explains what happens when waves meet. This leads to standing waves, interference, beats, and musical acoustics.",
    sections: [
      "17.1 The Principle of Superposition: Overlapping waves add together.",
      "17.2 Standing Waves: A standing wave appears fixed because waves traveling opposite directions interfere.",
      "17.3 Standing Waves on a String: Strings have nodes, antinodes, harmonics, and resonant frequencies.",
      "17.4 Standing Sound Waves and Musical Acoustics: Air columns can resonate like strings.",
      "17.5 Interference in One Dimension: Waves can add constructively or destructively.",
      "17.6 The Mathematics of Interference: Path difference controls whether waves reinforce or cancel.",
      "17.7 Interference in Two and Three Dimensions: Interference patterns can spread across space.",
      "17.8 Beats: Beats happen when two close frequencies interfere.",
    ],
    clues: ["superposition", "standing wave", "node", "antinode", "interference", "beats", "harmonic"],
    cards: [
      ["Superposition means?", "Overlapping waves add together."],
      ["Constructive interference?", "Waves add and get bigger."],
      ["Destructive interference?", "Waves cancel or get smaller."],
      ["Beats happen when?", "Two close frequencies interfere."],
    ],
    checks: [
      {
        q: "Two waves overlap crest-to-crest. What happens?",
        choices: ["Constructive interference", "Destructive interference", "Ohm’s Law"],
        correct: "Constructive interference",
        why: "Crest plus crest makes a larger wave.",
      },
      {
        q: "A point on a standing wave that does not move is called a...",
        choices: ["Node", "Volt", "Mole"],
        correct: "Node",
        why: "Nodes are fixed points on standing waves.",
      },
    ],
    solver: {
      problem: "Two sounds have frequencies 440 Hz and 444 Hz. What beat frequency is heard?",
      steps: [
        "Circle clues: two close frequencies, beats.",
        "Pick formula: fbeat = |f2 - f1|.",
        "List givens: f1 = 440 Hz and f2 = 444 Hz.",
        "Subtract: 444 - 440 = 4.",
        "Final answer: 4 Hz.",
      ],
    },
    boss: {
      q: "Boss: Superposition means waves...",
      choices: ["Add when they overlap", "Stop existing", "Become heat engines"],
      correct: "Add when they overlap",
      why: "That is the principle of superposition.",
    },
  },

  {
    chapter: 18,
    part: "Part V: Thermodynamics",
    title: "A Macroscopic Description of Matter",
    emoji: "🌡️",
    formula: "PV = nRT",
    tiny:
      "Thermo starts big-picture: solids, liquids, gases, temperature, moles, phase changes, and ideal gases.",
    bigIdea:
      "This chapter describes matter using large-scale measurable properties like pressure, volume, temperature, amount of substance, and phase.",
    sections: [
      "18.1 Solids, Liquids, and Gases: Matter can be described by phase.",
      "18.2 Atoms and Moles: A mole counts particles using Avogadro’s number.",
      "18.3 Temperature: Temperature measures thermal state, not total energy.",
      "18.4 Thermal Expansion: Materials expand when heated.",
      "18.5 Phase Changes: Energy can change phase without changing temperature.",
      "18.6 Ideal Gases: Ideal gases follow PV = nRT.",
      "18.7 Ideal-Gas Processes: Gas processes can hold pressure, volume, temperature, or heat constant.",
    ],
    clues: ["temperature", "mole", "ideal gas", "pressure", "volume", "thermal expansion", "phase change"],
    cards: [
      ["Ideal gas law?", "PV = nRT."],
      ["A mole counts...", "Particles."],
      ["Temperature measures...", "Thermal state."],
      ["Phase change means...", "Matter changes state."],
    ],
    checks: [
      {
        q: "A problem gives pressure, volume, moles, and temperature. What formula?",
        choices: ["PV = nRT", "F = qvBsinθ", "v = fλ"],
        correct: "PV = nRT",
        why: "Pressure, volume, moles, and temperature are ideal-gas clues.",
      },
      {
        q: "During a phase change, added heat often changes...",
        choices: ["Phase", "Charge", "Focal length"],
        correct: "Phase",
        why: "Phase changes use energy to change state.",
      },
    ],
    solver: {
      problem: "A gas has n = 2 mol, T = 300 K, and V = 0.05 m³. Find pressure. Use R = 8.31.",
      steps: [
        "Circle clues: gas, moles, temperature, volume, pressure.",
        "Pick formula: PV = nRT.",
        "Solve for pressure: P = nRT/V.",
        "Plug in: P = (2)(8.31)(300)/0.05.",
        "Top equals 4986.",
        "Divide by 0.05.",
        "Final answer: P = 99,720 Pa.",
      ],
    },
    boss: {
      q: "Boss: The ideal gas law connects...",
      choices: ["Pressure, volume, moles, temperature", "Voltage, current, resistance", "Frequency, wavelength, speed"],
      correct: "Pressure, volume, moles, temperature",
      why: "PV = nRT is the ideal-gas relationship.",
    },
  },

  {
    chapter: 19,
    part: "Part V: Thermodynamics",
    title: "Work, Heat, and the First Law of Thermodynamics",
    emoji: "🔥",
    formula: "ΔEth = W + Q",
    tiny:
      "Thermal energy changes when work is done and heat is transferred.",
    bigIdea:
      "The First Law of Thermodynamics is conservation of energy for thermal systems. Energy can enter or leave by heat and work.",
    sections: [
      "19.1 It’s All About Energy: Thermodynamics tracks energy transfers.",
      "19.2 Work in Ideal-Gas Processes: Gas work depends on pressure and volume change.",
      "19.3 Heat: Heat is energy transferred because of temperature difference.",
      "19.4 The First Law of Thermodynamics: ΔEth = W + Q using this textbook’s sign convention.",
      "19.5 Thermal Properties of Matter: Materials store and transfer heat differently.",
      "19.6 Calorimetry: Use heat equations to solve temperature-change and mixing problems.",
      "19.7 The Specific Heats of Gases: Gases can have different specific heats.",
      "19.8 Heat-Transfer Mechanisms: Conduction, convection, and radiation transfer heat.",
    ],
    clues: ["heat", "work", "first law", "thermal energy", "calorimetry", "specific heat", "conduction"],
    cards: [
      ["Heat is...", "Energy transferred due to temperature difference."],
      ["First Law idea?", "Energy is conserved."],
      ["Calorimetry formula?", "Q = mcΔT."],
      ["Three heat transfer methods?", "Conduction, convection, radiation."],
    ],
    checks: [
      {
        q: "A problem gives mass, specific heat, and temperature change. What formula?",
        choices: ["Q = mcΔT", "V = IR", "F = kq1q2/r²"],
        correct: "Q = mcΔT",
        why: "Mass, specific heat, and temperature change are calorimetry clues.",
      },
      {
        q: "Heat flows naturally from...",
        choices: ["Hot to cold", "Cold to hot", "Low mass to high mass"],
        correct: "Hot to cold",
        why: "Heat transfer occurs because of temperature difference.",
      },
    ],
    solver: {
      problem: "How much heat is needed to warm 2 kg of water by 5°C? Use c = 4186 J/kg°C.",
      steps: [
        "Circle clues: heat, mass, water, temperature change.",
        "Pick formula: Q = mcΔT.",
        "List givens: m = 2 kg, c = 4186, ΔT = 5°C.",
        "Plug in: Q = (2)(4186)(5).",
        "Multiply: 2 × 4186 × 5 = 41,860.",
        "Final answer: Q = 41,860 J.",
      ],
    },
    boss: {
      q: "Boss: The First Law of Thermodynamics is mainly about...",
      choices: ["Conservation of energy", "Wave interference", "Electric charge only"],
      correct: "Conservation of energy",
      why: "The First Law tracks heat, work, and thermal energy.",
    },
  },

  {
    chapter: 20,
    part: "Part V: Thermodynamics",
    title: "The Micro/Macro Connection",
    emoji: "🧬",
    formula: "Eth = (3/2)nRT",
    tiny:
      "Tiny particle motion explains big things like pressure, temperature, and thermal energy.",
    bigIdea:
      "This chapter connects microscopic molecular motion to macroscopic measurements such as pressure, temperature, specific heat, entropy, and equilibrium.",
    sections: [
      "20.1 Connecting the Microscopic and Macroscopic: Particle motion explains large-scale behavior.",
      "20.2 Molecular Speeds and Collisions: Gas molecules move randomly and collide.",
      "20.3 Pressure in a Gas: Pressure comes from molecule-wall collisions.",
      "20.4 Temperature: Temperature connects to average molecular kinetic energy.",
      "20.5 Thermal Energy and Specific Heat: Thermal energy depends on microscopic motion.",
      "20.6 Heat Transfer and Thermal Equilibrium: Systems exchange energy until equilibrium.",
      "20.7 Irreversible Processes and the Second Law: Natural processes tend to go one way.",
      "20.8 Microstates, Multiplicity, and Entropy: Entropy counts how spread out energy can be.",
      "20.9 Using Entropy: Entropy helps predict what processes happen naturally.",
    ],
    clues: ["molecules", "kinetic energy", "temperature", "pressure", "entropy", "microstates", "thermal equilibrium"],
    cards: [
      ["Gas pressure comes from...", "Molecules colliding with walls."],
      ["Temperature relates to...", "Average kinetic energy."],
      ["Entropy measures...", "Energy spreading / number of microstates."],
      ["Thermal equilibrium means...", "Same temperature, no net heat flow."],
    ],
    checks: [
      {
        q: "Gas pressure is caused by...",
        choices: ["Molecules hitting container walls", "Only gravity", "Only voltage"],
        correct: "Molecules hitting container walls",
        why: "Microscopic collisions create macroscopic pressure.",
      },
      {
        q: "Temperature is related to average molecular...",
        choices: ["Kinetic energy", "Charge sign", "Focal length"],
        correct: "Kinetic energy",
        why: "Hotter particles move faster on average.",
      },
    ],
    solver: {
      problem: "A 1 mol monatomic ideal gas is at 300 K. Estimate thermal energy using Eth = (3/2)nRT.",
      steps: [
        "Circle clues: monatomic ideal gas, moles, temperature, thermal energy.",
        "Pick formula: Eth = (3/2)nRT.",
        "List givens: n = 1 mol, R = 8.31, T = 300 K.",
        "Plug in: Eth = 1.5 × 1 × 8.31 × 300.",
        "Multiply: 1.5 × 2493 = 3739.5.",
        "Final answer: about 3.74 × 10³ J.",
      ],
    },
    boss: {
      q: "Boss: Entropy is connected to...",
      choices: ["Number of possible microstates", "Only voltage", "Only wave speed"],
      correct: "Number of possible microstates",
      why: "More microstates usually means higher entropy.",
    },
  },

  {
    chapter: 21,
    part: "Part V: Thermodynamics",
    title: "Heat Engines and Refrigerators",
    emoji: "🚗",
    formula: "e = Wout / Qin",
    tiny:
      "Heat engines turn heat into work. Refrigerators use work to move heat from cold to hot.",
    bigIdea:
      "Heat engines, refrigerators, and Carnot cycles show the limits of converting thermal energy into useful work.",
    sections: [
      "21.1 Turning Heat into Work: Engines convert thermal energy into mechanical work.",
      "21.2 Heat Engines and Refrigerators: Engines output work; refrigerators require work input.",
      "21.3 Ideal-Gas Heat Engines: Gas cycles can model engines.",
      "21.4 Ideal-Gas Refrigerators: Refrigerators move heat opposite the natural direction.",
      "21.5 The Limits of Efficiency: No heat engine is 100% efficient.",
      "21.6 The Carnot Cycle: Carnot efficiency gives the ideal maximum efficiency.",
    ],
    clues: ["heat engine", "refrigerator", "efficiency", "Carnot", "work output", "heat input", "cold reservoir"],
    cards: [
      ["Heat engine does what?", "Turns heat into work."],
      ["Refrigerator does what?", "Uses work to move heat from cold to hot."],
      ["Efficiency formula?", "e = Wout / Qin."],
      ["Can engines be 100% efficient?", "No."],
    ],
    checks: [
      {
        q: "A heat engine’s efficiency compares...",
        choices: ["Work output to heat input", "Voltage to current", "Frequency to wavelength"],
        correct: "Work output to heat input",
        why: "Efficiency tells what fraction of input heat becomes useful work.",
      },
      {
        q: "A refrigerator requires...",
        choices: ["Work input", "Zero energy", "Only standing waves"],
        correct: "Work input",
        why: "Refrigerators move heat against its natural direction.",
      },
    ],
    solver: {
      problem: "A heat engine takes in 500 J of heat and outputs 150 J of work. What is efficiency?",
      steps: [
        "Circle clues: heat engine, heat input, work output, efficiency.",
        "Pick formula: e = Wout/Qin.",
        "List givens: Wout = 150 J, Qin = 500 J.",
        "Plug in: e = 150/500.",
        "Calculate: e = 0.30.",
        "Final answer: 30% efficiency.",
      ],
    },
    boss: {
      q: "Boss: A heat engine converts heat into...",
      choices: ["Work", "Charge", "Wavelength"],
      correct: "Work",
      why: "Heat engines use thermal energy to do mechanical work.",
    },
  },

  {
    chapter: 22,
    part: "Part VI: Electricity and Magnetism",
    title: "Electric Charges and Forces",
    emoji: "⚡",
    formula: "F = k(q1q2) / r²",
    tiny:
      "Same charges repel. Opposite charges attract. Coulomb’s Law gives the force.",
    bigIdea:
      "This chapter introduces charge, conductors, insulators, Coulomb’s Law, and the electric field.",
    sections: [
      "22.1 The Charge Model: Matter can have positive or negative charge.",
      "22.2 Charge: Charge is measured in coulombs and is conserved.",
      "22.3 Insulators and Conductors: Conductors allow charge to move; insulators do not.",
      "22.4 Coulomb’s Law: Electric force depends on charges and distance.",
      "22.5 The Electric Field: Electric fields describe force per charge.",
    ],
    clues: ["charge", "Coulomb", "force", "insulator", "conductor", "electric field", "q1", "q2", "r"],
    cards: [
      ["Same charges?", "Repel."],
      ["Opposite charges?", "Attract."],
      ["Conductors allow...", "Charge to move."],
      ["Coulomb’s Law?", "F = k(q1q2)/r²."],
    ],
    checks: [
      {
        q: "A material lets charge move freely. It is a...",
        choices: ["Conductor", "Insulator", "Heat engine"],
        correct: "Conductor",
        why: "Conductors allow charge to move.",
      },
      {
        q: "Two positive charges...",
        choices: ["Repel", "Attract", "Become cold"],
        correct: "Repel",
        why: "Same charges repel.",
      },
    ],
    solver: {
      problem: "Two charges q1 = 2 C and q2 = 3 C are 1 m apart. Find force using k = 9 × 10⁹.",
      steps: [
        "Circle clues: two charges, distance, force.",
        "Pick formula: F = k(q1q2)/r².",
        "List givens: q1 = 2 C, q2 = 3 C, r = 1 m.",
        "Plug in: F = (9 × 10⁹)(2)(3)/(1²).",
        "Multiply: 9 × 10⁹ × 6.",
        "Final answer: 5.4 × 10¹⁰ N.",
      ],
    },
    boss: {
      q: "Boss: Coulomb’s Law is used for...",
      choices: ["Force between charges", "Gas pressure", "Beat frequency"],
      correct: "Force between charges",
      why: "Coulomb’s Law measures electric force.",
    },
  },

  {
    chapter: 23,
    part: "Part VI: Electricity and Magnetism",
    title: "The Electric Field",
    emoji: "👁️",
    formula: "E = F / q",
    tiny:
      "Electric field is force per charge. It is the force map around charges.",
    bigIdea:
      "This chapter expands electric field models, point-charge fields, continuous charge distributions, capacitors, charged-particle motion, and dipoles.",
    sections: [
      "23.1 Electric Field Models: Fields describe how charges influence space.",
      "23.2 Point Charges: A point charge creates a radial electric field.",
      "23.3 Continuous Charge Distribution: Extended objects create fields too.",
      "23.4 Common Charge Distributions: Symmetry helps simplify fields.",
      "23.5 Parallel-Plate Capacitor: Plates create an approximately uniform electric field.",
      "23.6 Motion of a Charged Particle: Electric fields can accelerate charges.",
      "23.7 Motion of a Dipole: Dipoles rotate or move in electric fields.",
    ],
    clues: ["electric field", "point charge", "capacitor", "dipole", "charged particle", "uniform field"],
    cards: [
      ["Electric field formula?", "E = F/q."],
      ["Field direction uses...", "Positive test charge."],
      ["Point charge field shape?", "Radial."],
      ["Parallel plates create...", "Nearly uniform field."],
    ],
    checks: [
      {
        q: "Electric field means...",
        choices: ["Force per charge", "Heat per mole", "Resistance per current"],
        correct: "Force per charge",
        why: "E = F/q.",
      },
      {
        q: "A charged particle in an electric field can...",
        choices: ["Accelerate", "Stop physics", "Only make sound"],
        correct: "Accelerate",
        why: "Electric force can accelerate charged particles.",
      },
    ],
    solver: {
      problem: "A 4 C charge feels an electric force of 12 N. What is the electric field?",
      steps: [
        "Circle clues: charge, force, electric field.",
        "Pick formula: E = F/q.",
        "List givens: F = 12 N, q = 4 C.",
        "Plug in: E = 12/4.",
        "Final answer: E = 3 N/C.",
      ],
    },
    boss: {
      q: "Boss: A parallel-plate capacitor creates an electric field that is approximately...",
      choices: ["Uniform", "Zero everywhere", "Only magnetic"],
      correct: "Uniform",
      why: "Between large parallel plates, the field is nearly constant.",
    },
  },

  {
    chapter: 24,
    part: "Part VI: Electricity and Magnetism",
    title: "Gauss’s Law",
    emoji: "🧊",
    formula: "ΦE = EA cosθ",
    tiny:
      "Flux means how much field passes through a surface. Gauss’s Law uses symmetry to find electric fields.",
    bigIdea:
      "Gauss’s Law relates electric flux through a closed surface to the charge enclosed inside that surface.",
    sections: [
      "24.1 Symmetry: Symmetry helps choose useful Gaussian surfaces.",
      "24.2 The Concept of Flux: Flux measures field passing through area.",
      "24.3 Calculating Electric Flux: Use ΦE = EA cosθ for uniform fields.",
      "24.4 Gauss’s Law: Total electric flux depends on enclosed charge.",
      "24.5 Using Gauss’s Law: Use symmetry for spheres, cylinders, and planes.",
      "24.6 Conductors in Electrostatic Equilibrium: Excess charge lies on conductor surfaces.",
    ],
    clues: ["Gauss", "flux", "closed surface", "symmetry", "enclosed charge", "conductor equilibrium"],
    cards: [
      ["Flux means?", "Field passing through area."],
      ["Flux formula for uniform field?", "ΦE = EA cosθ."],
      ["Gauss’s Law depends on...", "Enclosed charge."],
      ["Good Gauss problems have...", "Symmetry."],
    ],
    checks: [
      {
        q: "Gauss’s Law is most useful when there is...",
        choices: ["Symmetry", "No math", "Only sound"],
        correct: "Symmetry",
        why: "Symmetry makes the electric field easier to find.",
      },
      {
        q: "Electric flux measures...",
        choices: ["Field through area", "Heat through time", "Current through resistor"],
        correct: "Field through area",
        why: "Flux is field passing through a surface.",
      },
    ],
    solver: {
      problem: "A uniform electric field of 10 N/C passes perpendicular through area 2 m². Find flux.",
      steps: [
        "Circle clues: electric field, area, perpendicular, flux.",
        "Pick formula: ΦE = EA cosθ.",
        "Perpendicular to the surface means θ = 0° relative to area vector.",
        "cos0° = 1.",
        "Plug in: ΦE = (10)(2)(1).",
        "Final answer: ΦE = 20 N·m²/C.",
      ],
    },
    boss: {
      q: "Boss: Gauss’s Law relates electric flux to...",
      choices: ["Enclosed charge", "Beat frequency", "Specific heat"],
      correct: "Enclosed charge",
      why: "Closed-surface flux depends on charge inside.",
    },
  },

  {
    chapter: 25,
    part: "Part VI: Electricity and Magnetism",
    title: "The Electric Potential",
    emoji: "🔋",
    formula: "V = U / q",
    tiny:
      "Electric potential is energy per charge. Voltage is potential difference.",
    bigIdea:
      "Electric potential describes electric potential energy per unit charge and connects energy ideas to electric fields.",
    sections: [
      "25.1 Electric Potential Energy: Charges can store energy due to position.",
      "25.2 Potential Energy of Point Charges: Charge interactions create potential energy.",
      "25.3 Potential Energy of a Dipole: Dipoles have energy in electric fields.",
      "25.4 Electric Potential: Potential is energy per charge.",
      "25.5 Potential Inside a Parallel-Plate Capacitor: Uniform fields create simple potential changes.",
      "25.6 Potential of a Point Charge: Point charges create electric potential.",
      "25.7 Potential of Many Charges: Potentials add as scalars.",
    ],
    clues: ["potential", "voltage", "potential energy", "point charge", "capacitor", "dipole"],
    cards: [
      ["Electric potential means?", "Energy per charge."],
      ["Voltage is...", "Potential difference."],
      ["Potential is scalar or vector?", "Scalar."],
      ["Potential from many charges...", "Adds directly as scalars."],
    ],
    checks: [
      {
        q: "Electric potential is...",
        choices: ["Energy per charge", "Force per charge", "Heat per mass"],
        correct: "Energy per charge",
        why: "V = U/q.",
      },
      {
        q: "Electric potential is a...",
        choices: ["Scalar", "Vector", "Musical note"],
        correct: "Scalar",
        why: "Potential adds as a scalar quantity.",
      },
    ],
    solver: {
      problem: "A 2 C charge has 10 J of electric potential energy. What is electric potential?",
      steps: [
        "Circle clues: charge, potential energy, potential.",
        "Pick formula: V = U/q.",
        "List givens: U = 10 J, q = 2 C.",
        "Plug in: V = 10/2.",
        "Final answer: V = 5 V.",
      ],
    },
    boss: {
      q: "Boss: Voltage measures...",
      choices: ["Energy per charge", "Force per mass", "Wave length per time"],
      correct: "Energy per charge",
      why: "Voltage is electric potential difference.",
    },
  },

  {
    chapter: 26,
    part: "Part VI: Electricity and Magnetism",
    title: "Potential and Field",
    emoji: "🪫",
    formula: "C = Q / ΔV",
    tiny:
      "Potential and electric field are connected. Capacitors store charge and energy.",
    bigIdea:
      "This chapter connects electric potential to electric field and introduces capacitance, capacitor energy, conductors, and dielectrics.",
    sections: [
      "26.1 Connecting Potential and Field: Electric field points toward decreasing potential.",
      "26.2 Finding Electric Field from Potential: Field is related to the slope of potential.",
      "26.3 Conductors in Electrostatic Equilibrium: Electric field inside a conductor is zero.",
      "26.4 Sources of Electric Potential: Batteries and charge distributions create potential differences.",
      "26.5 Capacitance and Capacitors: Capacitors store charge with C = Q/ΔV.",
      "26.6 Energy Stored in a Capacitor: Capacitors store electric energy.",
      "26.7 Dielectrics: Dielectrics increase capacitance by reducing effective field.",
    ],
    clues: ["potential", "field", "capacitor", "capacitance", "dielectric", "stored energy", "conductor"],
    cards: [
      ["Capacitance formula?", "C = Q/ΔV."],
      ["Field inside conductor at equilibrium?", "Zero."],
      ["Capacitors store...", "Charge and energy."],
      ["Dielectrics usually increase...", "Capacitance."],
    ],
    checks: [
      {
        q: "A capacitor stores...",
        choices: ["Charge and energy", "Only sound", "Only entropy"],
        correct: "Charge and energy",
        why: "Capacitors store separated charge and electric energy.",
      },
      {
        q: "Inside a conductor in electrostatic equilibrium, E is...",
        choices: ["Zero", "Infinite", "Always 9.8"],
        correct: "Zero",
        why: "Charges rearrange until the internal electric field is zero.",
      },
    ],
    solver: {
      problem: "A capacitor stores Q = 6 C with ΔV = 3 V. What is capacitance?",
      steps: [
        "Circle clues: capacitor, charge, voltage, capacitance.",
        "Pick formula: C = Q/ΔV.",
        "List givens: Q = 6 C, ΔV = 3 V.",
        "Plug in: C = 6/3.",
        "Final answer: C = 2 F.",
      ],
    },
    boss: {
      q: "Boss: Capacitance tells how much charge is stored per...",
      choices: ["Volt", "Newton", "Hertz"],
      correct: "Volt",
      why: "C = Q/ΔV means charge per voltage.",
    },
  },

  {
    chapter: 27,
    part: "Part VI: Electricity and Magnetism",
    title: "Current and Resistance",
    emoji: "🔌",
    formula: "V = IR",
    tiny:
      "Current is moving charge. Resistance fights current. Ohm’s Law connects V, I, and R.",
    bigIdea:
      "This chapter introduces electron current, conventional current, current density, conductivity, resistivity, resistance, and Ohm’s Law.",
    sections: [
      "27.1 Electron Current: Electrons move through conductors.",
      "27.2 Creating a Current: A potential difference can drive current.",
      "27.3 Current and Current Density: Current measures charge flow per time.",
      "27.4 Conductivity and Resistivity: Materials differ in how easily charge moves.",
      "27.5 Resistance and Ohm’s Law: V = IR connects voltage, current, and resistance.",
    ],
    clues: ["current", "electron current", "current density", "conductivity", "resistivity", "resistance", "Ohm"],
    cards: [
      ["Current is...", "Charge flow per time."],
      ["Resistance does what?", "Opposes current."],
      ["Ohm’s Law?", "V = IR."],
      ["Unit of current?", "Ampere."],
    ],
    checks: [
      {
        q: "A problem gives voltage and resistance. What can you find with I = V/R?",
        choices: ["Current", "Temperature", "Entropy"],
        correct: "Current",
        why: "Ohm’s Law gives current from voltage and resistance.",
      },
      {
        q: "Resistance is measured in...",
        choices: ["Ohms", "Hertz", "Moles"],
        correct: "Ohms",
        why: "The unit of resistance is the ohm.",
      },
    ],
    solver: {
      problem: "A resistor has 12 V across it and resistance 4 Ω. Find current.",
      steps: [
        "Circle clues: voltage, resistance, current.",
        "Pick formula: V = IR.",
        "Solve for current: I = V/R.",
        "Plug in: I = 12/4.",
        "Final answer: I = 3 A.",
      ],
    },
    boss: {
      q: "Boss: Current is measured in...",
      choices: ["Amps", "Volts", "Joules per kg"],
      correct: "Amps",
      why: "Current uses amperes.",
    },
  },

  {
    chapter: 28,
    part: "Part VI: Electricity and Magnetism",
    title: "Fundamentals of Circuits",
    emoji: "🧩",
    formula: "ΣIin = ΣIout",
    tiny:
      "Kirchhoff’s laws are circuit traffic rules: current is conserved and voltage loops balance.",
    bigIdea:
      "This chapter covers circuit diagrams, Kirchhoff’s laws, energy and power, series and parallel resistors, real batteries, grounding, and RC circuits.",
    sections: [
      "28.1 Circuit Elements and Diagrams: Learn symbols for resistors, batteries, wires, and switches.",
      "28.2 Kirchhoff’s Laws: Junction rule conserves current; loop rule conserves energy.",
      "28.3 Energy and Power: P = IV describes electrical power.",
      "28.4 Series Resistors: Series resistors add.",
      "28.5 Real Batteries: Real batteries have internal resistance.",
      "28.6 Parallel Resistors: Parallel resistors combine by reciprocal rule.",
      "28.7 Resistor Circuits: Reduce circuits step by step.",
      "28.8 Getting Grounded: Ground means reference potential.",
      "28.9 RC Circuits: Capacitors charge and discharge over time.",
    ],
    clues: ["Kirchhoff", "junction", "loop", "series", "parallel", "power", "RC circuit", "ground"],
    cards: [
      ["Junction rule conserves...", "Current."],
      ["Loop rule conserves...", "Energy / voltage."],
      ["Power formula?", "P = IV."],
      ["Series resistors...", "Add directly."],
    ],
    checks: [
      {
        q: "Kirchhoff’s junction rule says...",
        choices: ["Current in equals current out", "Heat equals work", "Waves always cancel"],
        correct: "Current in equals current out",
        why: "Charge is conserved at a junction.",
      },
      {
        q: "Electrical power can be found with...",
        choices: ["P = IV", "v = fλ", "PV = nRT"],
        correct: "P = IV",
        why: "Power in circuits equals current times voltage.",
      },
    ],
    solver: {
      problem: "A device uses 3 A at 12 V. What power does it use?",
      steps: [
        "Circle clues: current, voltage, power.",
        "Pick formula: P = IV.",
        "List givens: I = 3 A, V = 12 V.",
        "Plug in: P = 3 × 12.",
        "Final answer: P = 36 W.",
      ],
    },
    boss: {
      q: "Boss: Kirchhoff’s loop rule is based on conservation of...",
      choices: ["Energy", "Moles", "Wavelength"],
      correct: "Energy",
      why: "Voltage changes around a closed loop must balance.",
    },
  },

  {
    chapter: 29,
    part: "Part VI: Electricity and Magnetism",
    title: "The Magnetic Field",
    emoji: "🧲",
    formula: "F = qvB sinθ",
    tiny:
      "Magnetic fields push moving charges and current-carrying wires.",
    bigIdea:
      "This chapter covers magnetic fields, sources of magnetic fields, forces on moving charges and wires, magnetic dipoles, solenoids, and magnetic materials.",
    sections: [
      "29.1 Magnetism: Magnetic effects come from moving charges.",
      "29.2 Discovery of Magnetic Field: Magnetic fields explain magnetic forces.",
      "29.3 Source of Magnetic Field: Moving charges create magnetic fields.",
      "29.4 Magnetic Field of a Current: Currents create circular magnetic fields.",
      "29.5 Magnetic Dipoles: Loops and magnets act like dipoles.",
      "29.6 Ampère’s Law and Solenoids: Symmetry helps find magnetic fields.",
      "29.7 Magnetic Force on Moving Charge: F = qvB sinθ.",
      "29.8 Magnetic Forces on Wires: Current-carrying wires feel magnetic force.",
      "29.9 Forces and Torques on Current Loops: Loops can rotate in magnetic fields.",
      "29.10 Magnetic Properties of Matter: Materials respond differently to magnetic fields.",
    ],
    clues: ["magnetic field", "B", "tesla", "moving charge", "current", "wire", "solenoid", "Ampere"],
    cards: [
      ["Magnetic field symbol?", "B."],
      ["Unit of magnetic field?", "Tesla."],
      ["Magnetic force needs charge to be...", "Moving."],
      ["Strongest magnetic force angle?", "90°."],
    ],
    checks: [
      {
        q: "A stationary charge in a magnetic field feels...",
        choices: ["No magnetic force", "Maximum magnetic force", "Heat only"],
        correct: "No magnetic force",
        why: "Magnetic force on a charge requires velocity.",
      },
      {
        q: "Moving charges create...",
        choices: ["Magnetic fields", "Only phase changes", "Only beats"],
        correct: "Magnetic fields",
        why: "Magnetism comes from moving charge.",
      },
    ],
    solver: {
      problem: "A 2 C charge moves at 3 m/s through a 4 T magnetic field at 90°. Find magnetic force.",
      steps: [
        "Circle clues: q, v, B, angle, force.",
        "Pick formula: F = qvB sinθ.",
        "List givens: q = 2 C, v = 3 m/s, B = 4 T, θ = 90°.",
        "Use sin90° = 1.",
        "Plug in: F = (2)(3)(4)(1).",
        "Final answer: F = 24 N.",
      ],
    },
    boss: {
      q: "Boss: Magnetic force on a moving charge is strongest when velocity is...",
      choices: ["Perpendicular to B", "Parallel to B", "Zero"],
      correct: "Perpendicular to B",
      why: "sin90° = 1, so force is maximum.",
    },
  },

  {
    chapter: 30,
    part: "Part VI: Electricity and Magnetism",
    title: "Electromagnetic Induction",
    emoji: "🪄",
    formula: "emf = -N ΔΦB / Δt",
    tiny:
      "Changing magnetic flux creates induced voltage and current.",
    bigIdea:
      "Electromagnetic induction explains how changing magnetic fields create electric effects. This chapter covers induced currents, motional emf, magnetic flux, Lenz’s Law, Faraday’s Law, inductors, LC circuits, and LR circuits.",
    sections: [
      "30.1 Induced Currents: Changing magnetic conditions can create current.",
      "30.2 Motional emf: Moving conductors in magnetic fields can create voltage.",
      "30.3 Magnetic Flux: Flux measures magnetic field through an area.",
      "30.4 Lenz’s Law: Induced effects oppose the change that created them.",
      "30.5 Faraday’s Law: Changing magnetic flux creates emf.",
      "30.6 Induced Fields: Changing magnetic fields can create electric fields.",
      "30.7 Applications: Induction appears in generators, transformers, and brakes.",
      "30.8 Inductors: Inductors resist changes in current.",
      "30.9 LC Circuits: Energy oscillates between capacitor and inductor.",
      "30.10 LR Circuits: Current changes over time in circuits with inductors and resistors.",
    ],
    clues: ["induction", "emf", "flux", "Lenz", "Faraday", "inductor", "LC", "LR", "changing magnetic field"],
    cards: [
      ["Induction trigger?", "Changing magnetic flux."],
      ["Lenz’s Law says induced effects...", "Oppose the change."],
      ["Faraday’s Law connects flux change to...", "emf."],
      ["Inductors resist changes in...", "Current."],
    ],
    checks: [
      {
        q: "A magnet moves near a coil and current appears. What is this?",
        choices: ["Electromagnetic induction", "Thermal expansion", "Beats"],
        correct: "Electromagnetic induction",
        why: "Changing magnetic flux through a coil induces emf and current.",
      },
      {
        q: "Lenz’s Law says induced current opposes...",
        choices: ["The change that created it", "All voltage forever", "Every wave"],
        correct: "The change that created it",
        why: "The negative sign in Faraday’s Law represents Lenz’s Law.",
      },
    ],
    solver: {
      problem: "A coil has 10 turns and magnetic flux changes by 0.20 Wb in 0.50 s. Find average induced emf magnitude.",
      steps: [
        "Circle clues: turns, flux change, time, induced emf.",
        "Pick formula magnitude: emf = NΔΦ/Δt.",
        "List givens: N = 10, ΔΦ = 0.20 Wb, Δt = 0.50 s.",
        "Plug in: emf = 10(0.20)/0.50.",
        "Calculate: 2.0/0.50 = 4.0.",
        "Final answer: emf = 4 V.",
      ],
    },
    boss: {
      q: "Boss: Faraday’s Law is about...",
      choices: ["Changing magnetic flux creating emf", "Gas pressure creating heat", "Frequency creating moles"],
      correct: "Changing magnetic flux creating emf",
      why: "That is the heart of electromagnetic induction.",
    },
  },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [checkIndex, setCheckIndex] = useState(0);
  const [solverStep, setSolverStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [tbiMode, setTbiMode] = useState(true);

  const chapter = chapters[chapterIndex];
  const card = chapter.cards[flashIndex];
  const check = chapter.checks[checkIndex];

  function openChapter(index) {
    setChapterIndex(index);
    setFlashIndex(0);
    setShowBack(false);
    setCheckIndex(0);
    setSolverStep(0);
    setFeedback("");
    setScreen("chapter");
  }

  function goHome() {
    setScreen("home");
    setFeedback("");
    setShowBack(false);
  }

  function answer(choice, item) {
    if (choice === item.correct) {
      setFeedback("Correct. " + item.why);
      setScore(score + 10);
    } else {
      setFeedback("Not quite. " + item.why);
    }
  }

  function nextCard() {
    if (flashIndex + 1 < chapter.cards.length) {
      setFlashIndex(flashIndex + 1);
      setShowBack(false);
    } else {
      setScreen("check");
      setFeedback("");
    }
  }

  function nextCheck() {
    if (checkIndex + 1 < chapter.checks.length) {
      setCheckIndex(checkIndex + 1);
      setFeedback("");
    } else {
      setScreen("solver");
      setFeedback("");
      setSolverStep(0);
    }
  }

  function nextSolver() {
    if (solverStep + 1 < chapter.solver.steps.length) {
      setSolverStep(solverStep + 1);
    } else {
      setScreen("boss");
      setSolverStep(0);
    }
  }

  function nextChapter() {
    if (chapterIndex + 1 < chapters.length) {
      openChapter(chapterIndex + 1);
    } else {
      setScreen("victory");
    }
  }

  if (screen === "home") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Physics Final Boss</Text>
        <Text style={styles.subtitle}>Chapters 16-30 • All Unlocked</Text>

        <View style={styles.card}>
          <Text style={styles.bigText}>Updated to your actual textbook chapters.</Text>
          <Text style={styles.text}>
            This version covers Waves, Thermodynamics, and Electricity & Magnetism.
            Pick any chapter. Each has section notes, clue words, flashcards,
            concept checks, a guided solver, and a boss question.
          </Text>

          <Pressable
            style={tbiMode ? styles.tbiOn : styles.tbiOff}
            onPress={() => setTbiMode(!tbiMode)}
          >
            <Text style={styles.darkButton}>
              {tbiMode ? "TBI Mode: ON" : "TBI Mode: OFF"}
            </Text>
          </Pressable>

          <Text style={styles.score}>Score: {score}</Text>
        </View>

        {chapters.map((ch, index) => (
          <Pressable
            key={ch.chapter}
            style={styles.chapterButton}
            onPress={() => openChapter(index)}
          >
            <Text style={styles.emoji}>{ch.emoji}</Text>
            <Text style={styles.partText}>{ch.part}</Text>
            <Text style={styles.chapterTitle}>
              Chapter {ch.chapter}: {ch.title}
            </Text>
            <Text style={styles.formulaSmall}>{ch.formula}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  if (screen === "chapter") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {chapter.emoji} Chapter {chapter.chapter}
        </Text>
        <Text style={styles.subtitle}>{chapter.title}</Text>

        <View style={styles.card}>
          <Text style={styles.partText}>{chapter.part}</Text>

          <Text style={styles.section}>Big Idea</Text>
          <Text style={styles.text}>{chapter.bigIdea}</Text>

          {tbiMode && (
            <>
              <Text style={styles.section}>Tiny Brain Version</Text>
              <Text style={styles.highlight}>{chapter.tiny}</Text>
            </>
          )}

          <Text style={styles.section}>Main Formula / Rule</Text>
          <Text style={styles.formula}>{chapter.formula}</Text>

          <Text style={styles.section}>Clue Words</Text>
          <Text style={styles.clues}>{chapter.clues.join(" • ")}</Text>

          <Text style={styles.section}>Textbook Section Map</Text>
          {chapter.sections.map((section, index) => (
            <Text key={index} style={styles.concept}>
              • {section}
            </Text>
          ))}

          <Pressable
            style={styles.primary}
            onPress={() => setScreen("flashcards")}
          >
            <Text style={styles.buttonText}>Start Flashcards</Text>
          </Pressable>

          <Pressable
            style={styles.purple}
            onPress={() => setScreen("solver")}
          >
            <Text style={styles.buttonText}>Jump to Problem Solver</Text>
          </Pressable>

          <Pressable style={styles.secondary} onPress={goHome}>
            <Text style={styles.secondaryText}>Back to Chapter Map</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (screen === "flashcards") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Flashcards</Text>
        <Text style={styles.subtitle}>
          Chapter {chapter.chapter} • {flashIndex + 1}/{chapter.cards.length}
        </Text>

        <View style={styles.flashcard}>
          <Text style={styles.cardLabel}>{showBack ? "BACK" : "FRONT"}</Text>
          <Text style={styles.flashText}>
            {showBack ? card[1] : card[0]}
          </Text>
        </View>

        <Pressable
          style={styles.primary}
          onPress={() => setShowBack(!showBack)}
        >
          <Text style={styles.buttonText}>
            {showBack ? "Show Front" : "Flip Card"}
          </Text>
        </Pressable>

        <Pressable style={styles.orange} onPress={nextCard}>
          <Text style={styles.buttonText}>
            {flashIndex + 1 < chapter.cards.length
              ? "Next Card"
              : "Concept Check"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondary}
          onPress={() => setScreen("chapter")}
        >
          <Text style={styles.secondaryText}>Review Chapter</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (screen === "check") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Concept Check</Text>
        <Text style={styles.subtitle}>
          Chapter {chapter.chapter} • {checkIndex + 1}/{chapter.checks.length}
        </Text>

        <View style={styles.card}>
          <Text style={styles.question}>{check.q}</Text>

          {check.choices.map((choice) => (
            <Pressable
              key={choice}
              style={styles.choice}
              onPress={() => answer(choice, check)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <Pressable style={styles.orange} onPress={nextCheck}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>

          <Pressable
            style={styles.secondary}
            onPress={() => setScreen("chapter")}
          >
            <Text style={styles.secondaryText}>Review Chapter</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (screen === "solver") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Problem Solver</Text>
        <Text style={styles.subtitle}>
          Chapter {chapter.chapter}: {chapter.title}
        </Text>

        <View style={styles.card}>
          <Text style={styles.section}>Problem</Text>
          <Text style={styles.question}>{chapter.solver.problem}</Text>

          <Text style={styles.section}>One Step at a Time</Text>
          <Text style={styles.solverStep}>
            Step {solverStep + 1}: {chapter.solver.steps[solverStep]}
          </Text>

          <Pressable style={styles.orange} onPress={nextSolver}>
            <Text style={styles.buttonText}>
              {solverStep + 1 < chapter.solver.steps.length
                ? "Next Step"
                : "Fight Boss"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondary}
            onPress={() => setScreen("chapter")}
          >
            <Text style={styles.secondaryText}>Review Chapter</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (screen === "boss") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Chapter Boss</Text>
        <Text style={styles.subtitle}>
          Chapter {chapter.chapter}: {chapter.title}
        </Text>

        <View style={styles.card}>
          <Text style={styles.boss}>THE BOSS ASKS:</Text>
          <Text style={styles.question}>{chapter.boss.q}</Text>

          {chapter.boss.choices.map((choice) => (
            <Pressable
              key={choice}
              style={styles.choice}
              onPress={() => answer(choice, chapter.boss)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <Pressable style={styles.primary} onPress={nextChapter}>
            <Text style={styles.buttonText}>Next Chapter</Text>
          </Pressable>

          <Pressable style={styles.secondary} onPress={goHome}>
            <Text style={styles.secondaryText}>Back to Chapter Map</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (screen === "victory") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Physics Run Complete</Text>
        <Text style={styles.subtitle}>Chapters 16-30 Reviewed</Text>

        <View style={styles.card}>
          <Text style={styles.victory}>🏆🧠⚡</Text>
          <Text style={styles.question}>Final Score: {score}</Text>
          <Text style={styles.text}>
            You reviewed Traveling Waves, Superposition, Thermodynamics,
            Electric Fields, Circuits, Magnetism, and Induction.
          </Text>

          <Pressable
            style={styles.primary}
            onPress={() => {
              setScore(0);
              setChapterIndex(0);
              setScreen("home");
              setFeedback("");
            }}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#101820",
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: "#f2aa4c",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  bigText: {
    color: "#101820",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    color: "#222",
    fontSize: 17,
    lineHeight: 26,
  },
  partText: {
    color: "#7b2cbf",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  section: {
    color: "#101820",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: 6,
  },
  highlight: {
    color: "#101820",
    backgroundColor: "#eef7ff",
    padding: 15,
    borderRadius: 16,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "bold",
  },
  formula: {
    color: "#101820",
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 16,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  clues: {
    color: "#101820",
    backgroundColor: "#e9ffe9",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold",
  },
  concept: {
    color: "#222",
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  tbiOn: {
    backgroundColor: "#fff1d6",
    padding: 14,
    borderRadius: 16,
    marginTop: 16,
    borderColor: "#f2aa4c",
    borderWidth: 2,
  },
  tbiOff: {
    backgroundColor: "#eeeeee",
    padding: 14,
    borderRadius: 16,
    marginTop: 16,
  },
  darkButton: {
    color: "#101820",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  score: {
    marginTop: 14,
    color: "#101820",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  chapterButton: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  chapterTitle: {
    color: "#101820",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  formulaSmall: {
    color: "#555",
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
    color: "#f2aa4c",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  flashText: {
    color: "#101820",
    fontSize: 25,
    lineHeight: 35,
    fontWeight: "bold",
    textAlign: "center",
  },
  question: {
    color: "#222",
    fontSize: 22,
    lineHeight: 31,
    fontWeight: "bold",
    marginBottom: 12,
  },
  solverStep: {
    color: "#101820",
    backgroundColor: "#e9ffe9",
    padding: 15,
    borderRadius: 16,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "bold",
  },
  choice: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    marginTop: 10,
  },
  choiceText: {
    color: "#101820",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  feedback: {
    color: "#101820",
    backgroundColor: "#eef7ff",
    padding: 15,
    borderRadius: 16,
    marginTop: 16,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "bold",
  },
  boss: {
    color: "#f2aa4c",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  victory: {
    fontSize: 54,
    textAlign: "center",
    marginBottom: 12,
  },
  primary: {
    backgroundColor: "#101820",
    padding: 16,
    borderRadius: 16,
    marginTop: 18,
    width: "100%",
  },
  purple: {
    backgroundColor: "#7b2cbf",
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    width: "100%",
  },
  orange: {
    backgroundColor: "#f2aa4c",
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    width: "100%",
  },
  secondary: {
    backgroundColor: "white",
    borderColor: "#101820",
    borderWidth: 1,
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryText: {
    color: "#101820",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});