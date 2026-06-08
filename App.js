import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

const chapters = [
  {
    chapter: 16,
    title: "Electric Charge & Coulomb’s Law",
    emoji: "⚡",
    formula: "F = k(q1q2) / r²",
    tiny: "Same charges repel. Opposite charges attract. Bigger charges make bigger force. Bigger distance makes weaker force.",
    bigIdea:
      "Electric charge creates electric force. Coulomb’s Law tells you how strong the force is between two charges based on charge size and distance.",
    concepts: [
      "Charge is measured in coulombs, written as C.",
      "Same signs repel: positive-positive or negative-negative push away.",
      "Opposite signs attract: positive-negative pull together.",
      "Distance is squared, so moving charges farther apart weakens force fast.",
    ],
    clues: ["charge", "q1", "q2", "distance", "r", "coulomb", "repel", "attract"],
    cards: [
      ["Same charges do what?", "They repel."],
      ["Opposite charges do what?", "They attract."],
      ["What does q mean?", "Charge."],
      ["What does r mean?", "Distance between charges."],
    ],
    checks: [
      {
        q: "A problem gives q1, q2, and r. What formula do you need?",
        choices: ["F = k(q1q2)/r²", "V = IR", "v = fλ"],
        correct: "F = k(q1q2)/r²",
        why: "q1, q2, and r are Coulomb’s Law clues.",
      },
      {
        q: "Two negative charges are near each other. What happens?",
        choices: ["They repel", "They attract", "They become voltage"],
        correct: "They repel",
        why: "Same charges repel, even when both are negative.",
      },
    ],
    solver: {
      problem:
        "Two charges are 2 m apart. q1 = 3 C and q2 = 4 C. Find electric force. Use k = 9 × 10⁹.",
      steps: [
        "Circle clues: q1, q2, distance, electric force.",
        "Pick formula: F = k(q1q2)/r².",
        "List givens: q1 = 3 C, q2 = 4 C, r = 2 m, k = 9 × 10⁹.",
        "Plug in: F = (9 × 10⁹)(3)(4)/(2²).",
        "Square distance: 2² = 4.",
        "Multiply top: (9 × 10⁹)(12) = 108 × 10⁹.",
        "Divide by 4.",
        "Final answer: 2.7 × 10¹⁰ N.",
      ],
    },
    boss: {
      q: "Boss: Two positive charges are close together. What happens?",
      choices: ["They repel", "They attract", "They become neutral"],
      correct: "They repel",
      why: "Same charges repel.",
    },
  },
  {
    chapter: 17,
    title: "Electric Fields",
    emoji: "👁️",
    formula: "E = F / q",
    tiny: "Electric field = force per charge. It is an invisible force map.",
    bigIdea:
      "An electric field tells how much electric force a charge would feel at a location.",
    concepts: [
      "A charge creates an electric field around itself.",
      "Another charge placed in that field feels a force.",
      "Field direction is the way a positive test charge would move.",
      "Electric field units are N/C.",
    ],
    clues: ["electric field", "E", "force", "charge", "test charge", "N/C"],
    cards: [
      ["Electric field means?", "Force per charge."],
      ["Formula for electric field?", "E = F/q."],
      ["Units for electric field?", "N/C."],
      ["Field direction is based on what?", "A positive test charge."],
    ],
    checks: [
      {
        q: "Electric field means...",
        choices: ["Force per charge", "Mass per volume", "Distance per time"],
        correct: "Force per charge",
        why: "That is what E = F/q means.",
      },
      {
        q: "If a small charge feels a big force, the field is...",
        choices: ["Strong", "Weak", "Gone"],
        correct: "Strong",
        why: "A strong field creates a strong force on a charge.",
      },
    ],
    solver: {
      problem: "A 5 C charge feels a force of 20 N. What is the electric field?",
      steps: [
        "Circle clues: charge, force, electric field.",
        "Pick formula: E = F/q.",
        "List givens: F = 20 N, q = 5 C.",
        "Plug in: E = 20/5.",
        "Final answer: E = 4 N/C.",
      ],
    },
    boss: {
      q: "Boss: A problem gives force and charge and asks for field. What formula?",
      choices: ["E = F/q", "V = IR", "F = qvBsinθ"],
      correct: "E = F/q",
      why: "Electric field is force per charge.",
    },
  },
  {
    chapter: 18,
    title: "Electric Potential & Voltage",
    emoji: "🔋",
    formula: "V = W / q",
    tiny: "Voltage = energy per charge.",
    bigIdea:
      "Voltage tells how much energy each charge has. It is electric potential difference.",
    concepts: [
      "Voltage is not the same as current.",
      "Voltage is the energy available per unit of charge.",
      "A battery creates a voltage difference.",
      "Higher voltage means more energy per charge.",
    ],
    clues: ["voltage", "potential", "work", "energy", "charge", "volt", "joule"],
    cards: [
      ["Voltage means?", "Energy per charge."],
      ["Formula for voltage?", "V = W/q."],
      ["Unit of voltage?", "Volt."],
      ["Higher voltage means?", "More energy per charge."],
    ],
    checks: [
      {
        q: "A problem gives energy and charge. What are you probably finding?",
        choices: ["Voltage", "Magnetism", "Wavelength"],
        correct: "Voltage",
        why: "Energy divided by charge is voltage.",
      },
      {
        q: "A 12 V battery gives charges...",
        choices: ["More energy than 1.5 V", "Less energy", "No energy"],
        correct: "More energy than 1.5 V",
        why: "Higher voltage means more energy per charge.",
      },
    ],
    solver: {
      problem: "A charge of 3 C gains 12 J of energy. What is the voltage?",
      steps: [
        "Circle clues: charge, energy, voltage.",
        "Pick formula: V = W/q.",
        "List givens: W = 12 J, q = 3 C.",
        "Plug in: V = 12/3.",
        "Final answer: V = 4 V.",
      ],
    },
    boss: {
      q: "Boss: Voltage is...",
      choices: ["Energy per charge", "Force per mass", "Mass per volume"],
      correct: "Energy per charge",
      why: "That is the meaning of V = W/q.",
    },
  },
  {
    chapter: 19,
    title: "Current, Resistance & Ohm’s Law",
    emoji: "🔌",
    formula: "V = IR",
    tiny: "Voltage pushes. Current flows. Resistance blocks.",
    bigIdea:
      "Ohm’s Law connects voltage, current, and resistance in a circuit.",
    concepts: [
      "Current is the flow of charge, measured in amps.",
      "Resistance opposes current, measured in ohms.",
      "Voltage is the electric push.",
      "If you need current, rearrange V = IR into I = V/R.",
    ],
    clues: ["current", "voltage", "resistance", "ohm", "amp", "circuit", "V", "I", "R"],
    cards: [
      ["Current is...", "Flow of charge."],
      ["Resistance is...", "Opposition to current."],
      ["Ohm’s Law?", "V = IR."],
      ["Solve for current.", "I = V/R."],
    ],
    checks: [
      {
        q: "Voltage does what in a circuit?",
        choices: ["Pushes current", "Blocks current", "Measures light"],
        correct: "Pushes current",
        why: "Voltage is the electric push.",
      },
      {
        q: "If V = 12 V and R = 4 Ω, how do you find current?",
        choices: ["I = V/R", "I = VR", "I = R/V"],
        correct: "I = V/R",
        why: "Divide both sides of V = IR by R.",
      },
    ],
    solver: {
      problem: "A circuit has 12 V and 4 Ω of resistance. What is the current?",
      steps: [
        "Circle clues: voltage, resistance, current, circuit.",
        "Pick formula: V = IR.",
        "Solve for current: I = V/R.",
        "List givens: V = 12 V, R = 4 Ω.",
        "Plug in: I = 12/4.",
        "Final answer: I = 3 A.",
      ],
    },
    boss: {
      q: "Boss: A problem gives volts and ohms. What topic?",
      choices: ["Ohm’s Law", "Coulomb’s Law", "Optics"],
      correct: "Ohm’s Law",
      why: "Volts, amps, and ohms are circuit clues.",
    },
  },
  {
    chapter: 20,
    title: "DC Circuits",
    emoji: "🧩",
    formula: "Series: Rₜ = R1 + R2 | Parallel: 1/Rₜ = 1/R1 + 1/R2",
    tiny: "Series = one path. Parallel = branches.",
    bigIdea:
      "DC circuit problems ask you to track voltage, current, and resistance through series and parallel paths.",
    concepts: [
      "Series circuits have one path for current.",
      "In series, total resistance adds directly.",
      "Parallel circuits have multiple branches.",
      "In parallel, voltage is the same across each branch.",
    ],
    clues: ["series", "parallel", "branch", "resistor", "equivalent resistance", "power"],
    cards: [
      ["Series circuit?", "One path."],
      ["Parallel circuit?", "Branches."],
      ["Series resistance?", "Adds directly."],
      ["Parallel voltage?", "Same across branches."],
    ],
    checks: [
      {
        q: "A circuit has one path. What is it?",
        choices: ["Series", "Parallel", "Diffraction"],
        correct: "Series",
        why: "One path means series.",
      },
      {
        q: "A circuit has branches. What is it?",
        choices: ["Parallel", "Series", "Coulomb"],
        correct: "Parallel",
        why: "Branches mean parallel.",
      },
    ],
    solver: {
      problem: "Three resistors are in series: 2 Ω, 3 Ω, and 5 Ω. Find total resistance.",
      steps: [
        "Circle clues: series, resistors, total resistance.",
        "Pick formula: Rtotal = R1 + R2 + R3.",
        "List givens: R1 = 2 Ω, R2 = 3 Ω, R3 = 5 Ω.",
        "Plug in: Rtotal = 2 + 3 + 5.",
        "Final answer: Rtotal = 10 Ω.",
      ],
    },
    boss: {
      q: "Boss: Three resistors are all on one path. What kind of circuit?",
      choices: ["Series", "Parallel", "Magnetic"],
      correct: "Series",
      why: "One path means series.",
    },
  },
  {
    chapter: 21,
    title: "Magnetism",
    emoji: "🧲",
    formula: "F = qvB sinθ",
    tiny: "Moving charge + magnetic field = magnetic force. No motion = no force.",
    bigIdea:
      "Magnetic fields exert force on moving charges and current-carrying wires.",
    concepts: [
      "Magnetic field is represented by B.",
      "Magnetic field is measured in tesla.",
      "A charge must be moving to feel magnetic force.",
      "Magnetic force is strongest at 90 degrees.",
    ],
    clues: ["magnetic field", "B", "tesla", "moving charge", "velocity", "angle", "theta"],
    cards: [
      ["What does B mean?", "Magnetic field."],
      ["Unit for magnetic field?", "Tesla."],
      ["Still charge in magnetic field?", "No magnetic force."],
      ["Strongest angle?", "90 degrees."],
    ],
    checks: [
      {
        q: "A charge is sitting still in a magnetic field. Force is...",
        choices: ["Zero", "Maximum", "Infinite"],
        correct: "Zero",
        why: "Magnetic force needs motion.",
      },
      {
        q: "Magnetic force is strongest when θ is...",
        choices: ["90°", "0°", "180°"],
        correct: "90°",
        why: "sin(90°) = 1, so force is maximum.",
      },
    ],
    solver: {
      problem:
        "A 2 C charge moves at 3 m/s through a 4 T magnetic field at 90°. Find magnetic force.",
      steps: [
        "Circle clues: charge, moving, magnetic field, angle, force.",
        "Pick formula: F = qvB sinθ.",
        "List givens: q = 2 C, v = 3 m/s, B = 4 T, θ = 90°.",
        "Use sin(90°) = 1.",
        "Plug in: F = (2)(3)(4)(1).",
        "Final answer: F = 24 N.",
      ],
    },
    boss: {
      q: "Boss: A problem gives q, v, B, and θ. What formula?",
      choices: ["F = qvB sinθ", "V = IR", "v = fλ"],
      correct: "F = qvB sinθ",
      why: "Those are magnetic force variables.",
    },
  },
  {
    chapter: 22,
    title: "Electromagnetic Induction",
    emoji: "🪄",
    formula: "Changing magnetic flux creates emf",
    tiny: "Changing magnet stuff makes electric stuff happen.",
    bigIdea:
      "A changing magnetic field or changing magnetic flux can induce voltage and current.",
    concepts: [
      "Magnetic flux depends on magnetic field, area, and angle.",
      "Changing flux can create induced emf.",
      "emf means induced voltage.",
      "Generators use motion and magnetic fields to create electrical energy.",
    ],
    clues: ["induction", "flux", "emf", "generator", "changing magnetic field", "coil"],
    cards: [
      ["What causes induction?", "Changing magnetic flux."],
      ["What is emf?", "Induced voltage."],
      ["Generator does what?", "Turns motion into electrical energy."],
      ["Key word for induction?", "Changing."],
    ],
    checks: [
      {
        q: "Induction happens when magnetic flux...",
        choices: ["Changes", "Stays still", "Becomes mass"],
        correct: "Changes",
        why: "Changing flux creates induced emf.",
      },
      {
        q: "A magnet moves near a coil and current appears. What is happening?",
        choices: ["Induction", "Refraction", "Coulomb repulsion"],
        correct: "Induction",
        why: "Moving magnet plus coil plus current means induction.",
      },
    ],
    solver: {
      problem: "A magnet moves near a coil and current appears. What effect is happening?",
      steps: [
        "Circle clues: magnet, coil, current appears, moving.",
        "Pick topic: electromagnetic induction.",
        "Main rule: changing magnetic flux creates emf.",
        "The moving magnet changes the magnetic field through the coil.",
        "Changing flux induces voltage.",
        "If the circuit is closed, current flows.",
        "Final answer: electromagnetic induction.",
      ],
    },
    boss: {
      q: "Boss: In induction problems, what word should you hunt for?",
      choices: ["Changing", "Still", "Mass"],
      correct: "Changing",
      why: "Changing magnetic flux is the trigger.",
    },
  },
  {
    chapter: 23,
    title: "Electromagnetic Waves",
    emoji: "🌊",
    formula: "v = fλ",
    tiny: "Frequency = how often. Wavelength = how long. Speed = fλ.",
    bigIdea:
      "Electromagnetic waves carry energy and include radio, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays.",
    concepts: [
      "Frequency means how many waves pass per second.",
      "Frequency is measured in hertz.",
      "Wavelength is the length of one wave.",
      "Visible light is an electromagnetic wave.",
    ],
    clues: ["wave", "frequency", "wavelength", "Hz", "lambda", "speed of light"],
    cards: [
      ["Frequency means?", "How often waves happen."],
      ["Wavelength means?", "Length of one wave."],
      ["Wave speed formula?", "v = fλ."],
      ["Visible light is...", "An electromagnetic wave."],
    ],
    checks: [
      {
        q: "Frequency is measured in...",
        choices: ["Hz", "Ω", "Tesla"],
        correct: "Hz",
        why: "Frequency units are hertz.",
      },
      {
        q: "A problem gives frequency and wavelength. What formula?",
        choices: ["v = fλ", "V = IR", "F = ma"],
        correct: "v = fλ",
        why: "Frequency and wavelength point to wave speed.",
      },
    ],
    solver: {
      problem: "A wave has frequency 10 Hz and wavelength 2 m. What is wave speed?",
      steps: [
        "Circle clues: frequency, wavelength, wave speed.",
        "Pick formula: v = fλ.",
        "List givens: f = 10 Hz, λ = 2 m.",
        "Plug in: v = 10 × 2.",
        "Final answer: v = 20 m/s.",
      ],
    },
    boss: {
      q: "Boss: Wavelength means...",
      choices: ["Length of one wave", "Current in a circuit", "Magnetic force"],
      correct: "Length of one wave",
      why: "Wavelength is crest-to-crest distance.",
    },
  },
  {
    chapter: 24,
    title: "Geometrical Optics",
    emoji: "🔍",
    formula: "1/f = 1/do + 1/di",
    tiny: "Optics = where light goes and where the image forms.",
    bigIdea:
      "Geometrical optics studies how light rays reflect and refract to form images.",
    concepts: [
      "Reflection means light bounces.",
      "Refraction means light bends between materials.",
      "Lenses and mirrors form images.",
      "The lens equation connects focal length, object distance, and image distance.",
    ],
    clues: ["lens", "mirror", "image", "object distance", "image distance", "focal length"],
    cards: [
      ["f means?", "Focal length."],
      ["do means?", "Object distance."],
      ["di means?", "Image distance."],
      ["Refraction means?", "Light bends."],
    ],
    checks: [
      {
        q: "A problem gives object distance and image distance. What topic?",
        choices: ["Optics", "Magnetism", "Ohm’s Law"],
        correct: "Optics",
        why: "Object and image distance are lens/mirror clues.",
      },
      {
        q: "Refraction means light...",
        choices: ["Bends", "Becomes charge", "Stops forever"],
        correct: "Bends",
        why: "Refraction is bending between materials.",
      },
    ],
    solver: {
      problem:
        "A lens has object distance 10 cm and image distance 20 cm. What is focal length?",
      steps: [
        "Circle clues: lens, object distance, image distance, focal length.",
        "Pick formula: 1/f = 1/do + 1/di.",
        "List givens: do = 10 cm, di = 20 cm.",
        "Plug in: 1/f = 1/10 + 1/20.",
        "Add: 0.10 + 0.05 = 0.15.",
        "Invert: f = 1/0.15.",
        "Final answer: f = 6.67 cm.",
      ],
    },
    boss: {
      q: "Boss: The lens equation connects...",
      choices: ["f, do, and di", "V, I, and R", "q, v, and B"],
      correct: "f, do, and di",
      why: "Those are the lens equation variables.",
    },
  },
  {
    chapter: 25,
    title: "Physical Optics",
    emoji: "✨",
    formula: "Constructive adds. Destructive cancels.",
    tiny: "Constructive = brighter. Destructive = darker. Diffraction = waves spread.",
    bigIdea:
      "Physical optics studies light as a wave, especially interference and diffraction.",
    concepts: [
      "Constructive interference means waves add together.",
      "Destructive interference means waves cancel.",
      "Bright fringe usually means constructive interference.",
      "Diffraction means waves bend or spread around openings.",
    ],
    clues: ["interference", "diffraction", "bright fringe", "dark fringe", "slit", "crest"],
    cards: [
      ["Constructive interference?", "Waves add."],
      ["Destructive interference?", "Waves cancel."],
      ["Bright fringe usually means?", "Constructive interference."],
      ["Diffraction means?", "Waves bend or spread."],
    ],
    checks: [
      {
        q: "Crest meets crest and makes a bright fringe. What is this?",
        choices: ["Constructive interference", "Destructive interference", "Ohm’s Law"],
        correct: "Constructive interference",
        why: "Crest with crest means waves add.",
      },
      {
        q: "Diffraction means waves...",
        choices: ["Bend or spread", "Become batteries", "Turn into mass"],
        correct: "Bend or spread",
        why: "Diffraction is wave spreading around edges or openings.",
      },
    ],
    solver: {
      problem:
        "Two light waves meet crest-to-crest and create a bright fringe. What type of interference is this?",
      steps: [
        "Circle clues: crest-to-crest, bright fringe, interference.",
        "Pick topic: physical optics / interference.",
        "Crest-to-crest means waves line up.",
        "When waves line up, they add together.",
        "Adding waves creates constructive interference.",
        "Bright fringe also means constructive interference.",
        "Final answer: constructive interference.",
      ],
    },
    boss: {
      q: "Boss: Dark fringe usually means...",
      choices: ["Destructive interference", "Constructive interference", "Electric field"],
      correct: "Destructive interference",
      why: "Dark fringes happen when waves cancel.",
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
  }

  function answer(choice, item) {
    if (choice === item.correct) {
      setFeedback("✅ Correct. " + item.why);
      setScore(score + 10);
    } else {
      setFeedback("🧠 Not quite. " + item.why);
    }
  }

  function nextCard() {
    if (flashIndex + 1 < chapter.cards.length) {
      setFlashIndex(flashIndex + 1);
      setShowBack(false);
    } else {
      setScreen("check");
    }
  }

  function nextCheck() {
    if (checkIndex + 1 < chapter.checks.length) {
      setCheckIndex(checkIndex + 1);
      setFeedback("");
    } else {
      setScreen("solver");
      setFeedback("");
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
        <Text style={styles.title}>Physics 2 Final Boss</Text>
        <Text style={styles.subtitle}>Chapters 16–25 • All Unlocked</Text>

        <View style={styles.card}>
          <Text style={styles.bigText}>Study like Physics 1, but deeper.</Text>
          <Text style={styles.text}>
            Pick any chapter. You get concept notes, clue words, flashcards,
            concept checks, a guided problem solver, and a boss question.
          </Text>

          <Pressable
            style={tbiMode ? styles.tbiOn : styles.tbiOff}
            onPress={() => setTbiMode(!tbiMode)}
          >
            <Text style={styles.darkButton}>
              {tbiMode ? "TBI Mode: ON 🧠" : "TBI Mode: OFF"}
            </Text>
          </Pressable>

          <Text style={styles.score}>Score: {score}</Text>
        </View>

        {chapters.map((ch, index) => (
          <Pressable key={ch.chapter} style={styles.chapterButton} onPress={() => openChapter(index)}>
            <Text style={styles.emoji}>{ch.emoji}</Text>
            <Text style={styles.chapterTitle}>Chapter {ch.chapter}: {ch.title}</Text>
            <Text style={styles.formulaSmall}>{ch.formula}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  if (screen === "chapter") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{chapter.emoji} Chapter {chapter.chapter}</Text>
        <Text style={styles.subtitle}>{chapter.title}</Text>

        <View style={styles.card}>
          <Text style={styles.section}>Big Idea</Text>
          <Text style={styles.text}>{chapter.bigIdea}</Text>

          {tbiMode && (
            <>
              <Text style={styles.section}>Tiny Brain Version</Text>
              <Text style={styles.highlight}>{chapter.tiny}</Text>
            </>
          )}

          <Text style={styles.section}>Formula / Rule</Text>
          <Text style={styles.formula}>{chapter.formula}</Text>

          <Text style={styles.section}>Clue Words</Text>
          <Text style={styles.clues}>{chapter.clues.join(" • ")}</Text>

          <Text style={styles.section}>Important Concepts</Text>
          {chapter.concepts.map((concept, index) => (
            <Text key={index} style={styles.concept}>• {concept}</Text>
          ))}

          <Pressable style={styles.primary} onPress={() => setScreen("flashcards")}>
            <Text style={styles.buttonText}>Start Flashcards</Text>
          </Pressable>

          <Pressable style={styles.purple} onPress={() => setScreen("solver")}>
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
          <Text style={styles.flashText}>{showBack ? card[1] : card[0]}</Text>
        </View>

        <Pressable style={styles.primary} onPress={() => setShowBack(!showBack)}>
          <Text style={styles.buttonText}>{showBack ? "Show Front" : "Flip Card"}</Text>
        </Pressable>

        <Pressable style={styles.orange} onPress={nextCard}>
          <Text style={styles.buttonText}>
            {flashIndex + 1 < chapter.cards.length ? "Next Card" : "Concept Check"}
          </Text>
        </Pressable>

        <Pressable style={styles.secondary} onPress={() => setScreen("chapter")}>
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
            <Pressable key={choice} style={styles.choice} onPress={() => answer(choice, check)}>
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <Pressable style={styles.orange} onPress={nextCheck}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>

          <Pressable style={styles.secondary} onPress={() => setScreen("chapter")}>
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
        <Text style={styles.subtitle}>Chapter {chapter.chapter}: {chapter.title}</Text>

        <View style={styles.card}>
          <Text style={styles.section}>Problem</Text>
          <Text style={styles.question}>{chapter.solver.problem}</Text>

          <Text style={styles.section}>One Step at a Time</Text>
          <Text style={styles.solverStep}>
            Step {solverStep + 1}: {chapter.solver.steps[solverStep]}
          </Text>

          <Pressable style={styles.orange} onPress={nextSolver}>
            <Text style={styles.buttonText}>
              {solverStep + 1 < chapter.solver.steps.length ? "Next Step" : "Fight Boss"}
            </Text>
          </Pressable>

          <Pressable style={styles.secondary} onPress={() => setScreen("chapter")}>
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
        <Text style={styles.subtitle}>Chapter {chapter.chapter}: {chapter.title}</Text>

        <View style={styles.card}>
          <Text style={styles.boss}>THE BOSS ASKS:</Text>
          <Text style={styles.question}>{chapter.boss.q}</Text>

          {chapter.boss.choices.map((choice) => (
            <Pressable key={choice} style={styles.choice} onPress={() => answer(choice, chapter.boss)}>
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
        <Text style={styles.title}>Physics 2 Run Complete</Text>
        <Text style={styles.subtitle}>Chapters 16–25 Reviewed</Text>

        <View style={styles.card}>
          <Text style={styles.victory}>🏆🧠⚡</Text>
          <Text style={styles.question}>Final Score: {score}</Text>
          <Text style={styles.text}>
            You reviewed charge, fields, voltage, circuits, magnetism, induction,
            waves, geometrical optics, and physical optics.
          </Text>

          <Pressable
            style={styles.primary}
            onPress={() => {
              setScore(0);
              setChapterIndex(0);
              setScreen("home");
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
    fontSize: 23,
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