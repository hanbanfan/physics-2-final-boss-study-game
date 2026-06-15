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
    .replaceAll("lambda", "lambda")
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

function result({ topic, givens, unknown, formula, steps, answer, trap, memory }) {
  return {
    topic,
    givens: givens || [],
    unknown,
    formula,
    steps,
    answer,
    trap,
    memory,
  };
}

function solveHomework(text) {
  const lower = normalize(text);
  const sci = allScientific(text);
  const givens = [...sci.map((n) => n.toExponential(3)), ...allNumbers(text)];

  if (!text.trim()) {
    return result({
      topic: "Paste Any Homework Question",
      givens: [],
      unknown: "Whatever the problem asks for",
      formula: "The app will pick the formula from clue words.",
      steps:
        "Paste the whole problem, including units and answer choices.\n\nThe solver will give:\n1. Topic\n2. Givens\n3. Unknown\n4. Formula\n5. Steps\n6. Answer or strategy\n7. Trap check",
      answer: "Waiting for homework problem.",
      trap: "Do not paste only numbers. The sentence tells the app what physics model to use.",
      memory: "Memory move: before pasting, guess the chapter first.",
    });
  }

  const K = 8.99e9;
  const E_CHARGE = 1.60e-19;
  const EPS0 = 8.854e-12;
  const PROTON_MASS = 1.67e-27;
  const PROTON_Q = 1.60e-19;

  // CH 16: charge from electrons appears in electrostatics homework too
  if (hasAny(lower, ["electrons are added", "excess electrons", "number of electrons"])) {
    const N = sci[0] || numsBefore(text, "electrons")[0];
    let ans = "Need the number of electrons.";
    if (N) {
      const Q = -N * E_CHARGE;
      ans = `Q = N(-e)\nQ = (${N.toExponential(3)})(-1.60 x 10^-19 C)\nQ = ${Q.toExponential(3)} C\n\nFinal Answer: ${Q.toExponential(2)} C`;
    }
    return result({
      topic: "Ch. 22/23: Charge from Added Electrons",
      givens,
      unknown: "Net charge Q",
      formula: "Q = N(-e)",
      steps: "Electrons are negative. Multiply number of added electrons by -1.60 x 10^-19 C.",
      answer: ans,
      trap: "Added electrons make the object negative.",
      memory: "Electrons added = negative. Electrons removed = positive.",
    });
  }

  // CH 16: string tension
  if (hasAny(lower, ["string", "tension"]) && hasAny(lower, ["speed", "wave speed", "m/s"])) {
    const speeds = numsBefore(text, "m\\s*/\\s*s");
    const tensions = numsBefore(text, "n\\b");
    const v1 = speeds[0];
    const v2 = speeds[1];
    const T1 = tensions[0];
    let ans = "Need v1, T1, and v2.";
    if (v1 && v2 && T1) {
      const T2 = T1 * Math.pow(v2 / v1, 2);
      ans = `T2 = T1(v2/v1)^2\nT2 = ${T1}(${v2}/${v1})^2\nT2 = ${nice(T2)} N\n\nFinal Answer: ${nice(T2)} N`;
    }
    return result({
      topic: "Ch. 16: Wave Speed on a String",
      givens,
      unknown: "New tension T2",
      formula: "v = sqrt(T/mu), so T2 = T1(v2/v1)^2",
      steps: "Same string means mu stays constant. Since v depends on sqrt(T), tension depends on speed squared.",
      answer: ans,
      trap: "Do not use the speed ratio directly. Square it.",
      memory: "String speed: more tension = faster wave. Tension ratio uses v squared.",
    });
  }

  // CH 16: waves concepts
  if (hasAny(lower, ["transverse", "longitudinal"])) {
    return result({
      topic: "Ch. 16: Transverse vs Longitudinal Waves",
      givens,
      unknown: "Wave type",
      formula: "Transverse = perpendicular. Longitudinal = parallel.",
      steps:
        "Ask: how does the medium move compared with the wave direction?\n\nPerpendicular motion = transverse.\nParallel motion = longitudinal.\nSound in air = longitudinal pressure wave.",
      answer: "Transverse: perpendicular. Longitudinal: parallel.",
      trap: "Do not confuse wave travel direction with particle motion.",
      memory: "T in transverse = turns sideways. L in longitudinal = lines up.",
    });
  }

  if (hasAny(lower, ["y(x,t)", "sin", "kx", "omega", "phase", "wave equation"])) {
    return result({
      topic: "Ch. 16: Sinusoidal Traveling Wave",
      givens,
      unknown: "A, k, omega, phi, speed, wavelength, or frequency",
      formula: "y(x,t) = A sin(kx - omega t + phi)",
      steps:
        "A = amplitude\nk = 2pi/lambda\nomega = 2pi f\nphi = phase shift\nv = omega/k = f lambda\n\nkx - omega t usually travels in +x direction.",
      answer: "Use lambda = 2pi/k, f = omega/(2pi), and v = omega/k.",
      trap: "k belongs to position. omega belongs to time.",
      memory: "k is space. omega is time. A is height. phi is shift.",
    });
  }

  if (hasAny(lower, ["sound", "bulk modulus", "rho", "density", "pressure wave"])) {
    return result({
      topic: "Ch. 16: Sound Speed in a Fluid",
      givens,
      unknown: "Speed of sound",
      formula: "v = sqrt(B/rho)",
      steps:
        "Sound in air/water is a longitudinal pressure wave.\n\nB = bulk modulus/stiffness\nrho = density\nv = sqrt(B/rho)",
      answer: "Use v = sqrt(B/rho).",
      trap: "Do not use string formula sqrt(T/mu) for sound in fluids.",
      memory: "Sound speed in fluid: stiff over dense.",
    });
  }

  if (hasAny(lower, ["intensity", "decibel", "db", "spherical", "inverse square"])) {
    return result({
      topic: "Ch. 16: Sound Intensity and Decibels",
      givens,
      unknown: "Intensity, distance effect, or decibel level",
      formula: "I = P/(4pi r^2), so I is proportional to 1/r^2",
      steps:
        "Spherical waves spread energy over area 4pi r^2.\n\nDouble distance -> intensity becomes 1/4.\nTriple distance -> intensity becomes 1/9.\n\nDecibels are logarithmic.",
      answer: "Use inverse-square for intensity. Add intensities before converting to dB.",
      trap: "Two sources do not mean twice the decibels.",
      memory: "Sound spreads like glitter on a balloon: bigger sphere, less intensity.",
    });
  }

  if (hasAny(lower, ["doppler", "ambulance", "siren", "blue shift", "red shift", "sonic boom", "mach"])) {
    return result({
      topic: "Ch. 16: Doppler Effect",
      givens,
      unknown: "Observed frequency",
      formula: "f' = f(v +/- v_observer)/(v -/+ v_source)",
      steps:
        "Think before signs:\n\nMoving together -> observed frequency goes up.\nMoving apart -> observed frequency goes down.\nSource toward observer -> higher pitch.\nSource away -> lower pitch.\nMach > 1 -> sonic boom.",
      answer: "Toward = higher frequency. Away = lower frequency.",
      trap: "Do not memorize signs blindly. First predict up or down.",
      memory: "Toward = tighter waves = higher pitch. Away = stretched waves = lower pitch.",
    });
  }

  // Light frequency/refraction
  if (hasAny(lower, ["light", "wavelength", "nm", "index of refraction"])) {
    const nm = numsBefore(text, "nm\\b");
    let ans = "Use f = c/lambda and convert nm to m.";
    if (lower.includes("450") && lower.includes("650")) {
      const fBlue = 3e8 / (450e-9);
      const fRed = 3e8 / (650e-9);
      const n = 650 / 450;
      ans =
        `Blue: f = c/lambda = ${fBlue.toExponential(3)} Hz\n` +
        `Red: f = c/lambda = ${fRed.toExponential(3)} Hz\n` +
        `Index: n = lambda_vacuum/lambda_material = 650/450 = ${nice(n)}`;
    } else if (nm[0]) {
      const f = 3e8 / (nm[0] * 1e-9);
      ans = `lambda = ${nm[0]} nm = ${nm[0]} x 10^-9 m\nf = c/lambda = ${f.toExponential(3)} Hz`;
    }
    return result({
      topic: "Ch. 16/31: Light Frequency and Refraction",
      givens,
      unknown: "Frequency or index of refraction",
      formula: "c = f lambda and n = lambda_vacuum/lambda_material",
      steps: "Convert nm to meters. Frequency stays constant in a material; speed and wavelength change.",
      answer: ans,
      trap: "nm must become meters. Index has no units.",
      memory: "Light: c = f lambda. Refraction: frequency stays.",
    });
  }

  // Conductors/insulators
  if (hasAny(lower, ["plastic balls", "copper ball", "test charge", "weakly attracted", "strongly attracted", "strongly repelled"])) {
    return result({
      topic: "Ch. 22/23: Conductors, Insulators, and Polarization",
      givens,
      unknown: "Attractive, repulsive, or neither",
      formula: "Like repel. Opposites attract. Neutral objects can attract by polarization.",
      steps:
        "Strong repulsion from positive test charge -> positive object.\nStrong attraction to positive test charge and plastic -> negative object.\nWeak attraction -> neutral insulator.\nNeutral conductor near a charge -> strong attraction by induced separation.",
      answer:
        "A negative plastic, B positive plastic, C neutral plastic, D neutral copper.\nA-B attractive.\nA-C attractive but weaker.\nA-D attractive.\nC-D neither.",
      trap: "Neutral objects can still be attracted.",
      memory: "Conductors polarize strongly. Insulators polarize weakly.",
    });
  }

  if (hasAny(lower, ["rod", "end a", "end b", "negative charge", "many contacts", "several contacts"])) {
    return result({
      topic: "Ch. 22/23: Charging Rods by Contact",
      givens,
      unknown: "Charge arrangement or attraction/repulsion",
      formula: "Conductor spreads charge. Insulator traps charge locally.",
      steps:
        "First approach to neutral object -> attraction by polarization.\nAfter negative contact -> electrons transfer.\nPlastic insulator: negative charge stays near contact end.\nConductor: negative charge spreads everywhere.",
      answer:
        "Plastic rod: after contacts, negative charge stays on end A; end B mostly neutral.\nConducting rod: after many contacts, negative charge spreads across both ends.\nThen a negative ball is repelled by charged ends.",
      trap: "Always identify conductor vs insulator first.",
      memory: "Conductor = charge cruises. Insulator = charge is stuck.",
    });
  }

  // Coulomb vectors
  if (hasAny(lower, ["particle 0", "q_0", "q subscript 0", "d_1"])) {
    if (hasAny(lower, ["particle 3", "q_3", "d_2, d_2", "(0,d_2,d_2)"])) {
      return result({
        topic: "Ch. 22/23: Coulomb Vector from Particle 3",
        givens,
        unknown: "i, j, k components",
        formula: "F = kq0q3/r^2, then split into y and z",
        steps:
          "Particle 3 at (0,d2,d2).\nr = sqrt(2)d2.\nr^2 = 2d2^2.\nForce repels q0 toward -j and -k equally.",
        answer:
          "i: 0\nj: -k*q_0*q_3/(2*sqrt(2)*d_2^2)\nk: -k*q_0*q_3/(2*sqrt(2)*d_2^2)",
        trap: "Do not forget the sqrt(2) component split.",
        memory: "Equal y and z distance means equal j and k components.",
      });
    }

    if (hasAny(lower, ["ratio", "no net force", "balance", "d_1 divided by d_2"])) {
      return result({
        topic: "Ch. 22/23: Balance Coulomb Forces",
        givens,
        unknown: "d1/d2",
        formula: "kq0q1/d1^2 = kq0q2/d2^2",
        steps:
          "Set force magnitudes equal.\nCancel k and q0.\nq1/d1^2 = q2/d2^2.\nTake square root.",
        answer: "d1/d2 = sqrt(q_1/q_2)",
        trap: "k and q0 cancel.",
        memory: "Balance force? Set magnitudes equal.",
      });
    }

    if (hasAny(lower, ["particle 2", "q_2", "negative q 2", "third"])) {
      return result({
        topic: "Ch. 22/23: Net Coulomb Force on q0",
        givens,
        unknown: "i, j, k components",
        formula: "Superposition: Fnet = F1 + F2",
        steps:
          "Positive q1 above q0 repels q0 downward: -j.\nNegative q2 above q0 attracts q0 upward: +j.",
        answer: "i: 0\nj: -k*q_0*q_1/d_1^2 + k*q_0*q_2/d_2^2\nk: 0",
        trap: "q2 is the magnitude; direction gives the sign.",
        memory: "Like repel away. Opposites pull toward.",
      });
    }

    return result({
      topic: "Ch. 22/23: Coulomb Force Vector",
      givens,
      unknown: "i, j, k components",
      formula: "F = kq0q1/r^2",
      steps: "q1 is positive above q0. Both positive means repulsion, so q0 is pushed downward.",
      answer: "i: 0\nj: -k*q_0*q_1/d_1^2\nk: 0",
      trap: "Direction matters as much as magnitude.",
      memory: "Charge above pushes origin charge down if same sign.",
    });
  }

  // Coulomb numeric two masses
  if (hasAny(lower, ["kg masses", "frictionless table", "each has", "uc of charge"])) {
    const mass = numsBefore(text, "kg")[0];
    const qMicro = numsBefore(text, "uc")[0];
    const distance = numsBefore(text, "m\\b")[0] || 1.0;
    let ans = "Use F = kq^2/r^2, then a = F/m.";
    if (mass && qMicro) {
      const q = qMicro * 1e-6;
      const F = K * q * q / (distance * distance);
      const a = F / mass;
      ans = `F = kq^2/r^2 = ${nice(F)} N\na = F/m = ${nice(a)} m/s^2`;
    }
    return result({
      topic: "Ch. 22/23: Coulomb Force and Acceleration",
      givens,
      unknown: "Force or acceleration",
      formula: "F = kq^2/r^2 and a = F/m",
      steps: "Convert microcoulombs to coulombs. Find electric force. Then use Newton's second law.",
      answer: ans,
      trap: "Mass affects acceleration, not electric force.",
      memory: "Electricity gives F. Physics I turns F into a.",
    });
  }

  // Point charge electric field
  if (hasAny(lower, ["electric field", "plastic bead", "charged to", "nc", "cm from"])) {
    const qNc = numsBefore(text, "nc")[0];
    const cm = numsBefore(text, "cm")[0];
    let ans = "Use E = k|q|/r^2.";
    if (qNc && cm) {
      const q = Math.abs(qNc) * 1e-9;
      const r = cm / 100;
      const E = K * q / (r * r);
      const direction = hasAny(lower, ["minus", "-"]) ? "toward the bead" : "away from the bead";
      ans = `E = k|q|/r^2 = ${E.toExponential(3)} N/C\nDirection: ${direction}`;
    }
    return result({
      topic: "Ch. 23: Electric Field of a Point Charge",
      givens,
      unknown: "Electric field strength or direction",
      formula: "E = k|q|/r^2",
      steps: "Convert nC to C. Convert cm to m. Use magnitude for strength.",
      answer: ans,
      trap: "Field points toward negative charges and away from positive charges.",
      memory: "Positive pushes field out. Negative pulls field in.",
    });
  }

  // Electric field simulation/dipole
  if (hasAny(lower, ["e-field sensor", "dipole", "positive charge", "negative charge", "grid", "field strength"])) {
    return result({
      topic: "Ch. 23: Electric Field Simulation and Dipoles",
      givens,
      unknown: "Direction, relative strength, or zero field",
      formula: "Point charge: E = k|q|/r^2. Dipole far field drops faster than 1/r^2.",
      steps:
        "Positive charge: field points outward.\nNegative charge: field points inward.\nSame distance and same |q|: same field magnitude.\nTwo positives: midpoint cancels.\nDipole midpoint: fields point from + toward -.",
      answer:
        "1 m vs 2 m: field at 1 m is 4 times stronger.\nIf E=9 V/m at 1 m, E=1 V/m at 3 m.\nSmall dipole field decreases more quickly than 1/r^2.",
      trap: "Electric field is a vector. Add components.",
      memory: "Point charge: 1/r^2. Dipole far away: faster fade.",
    });
  }

  // Finite wire
  if (hasAny(lower, ["finite charged wire", "wire of length", "linear charge density", "point p", "midpoint of the wire"])) {
    return result({
      topic: "Ch. 23/24: Finite Charged Wire Field",
      givens,
      unknown: "Direction or magnitude of E",
      formula: "E = 2*k*lambda*L/(d*sqrt(d^2+L^2))",
      steps:
        "Wire lies from -L to +L on x-axis. Point P is above midpoint.\nBy symmetry, x-components cancel and y-components add.",
      answer: "Direction: +j\nMagnitude: 2*k*lambda*L/(d*sqrt(d^2+L^2))",
      trap: "Do not include x-components.",
      memory: "Symmetry kills sideways components.",
    });
  }

  // Ring
  if (hasAny(lower, ["uniformly charged ring", "ring in the xy", "z axis", "radius a"])) {
    return result({
      topic: "Ch. 23/24: Charged Ring Field and SHM",
      givens,
      unknown: "Direction, field, trajectory, or omega",
      formula: "E(z)=k*q*z/(z^2+a^2)^(3/2)",
      steps:
        "Circular symmetry cancels x and y components. Only z survives.\nMastering-safe denominator: (z^2+a^2)*sqrt(z^2+a^2).\nNear center z << a: E approx kqz/a^3.",
      answer:
        "Direction: parallel to z axis.\nE(z)=k*q*z/((z^2+a^2)*sqrt(z^2+a^2))\nNegative ball near center oscillates between d and -d.\nomega = sqrt(k*q*q_0/(m*a^3))",
      trap: "If ^(3/2) fails, use the sqrt denominator form.",
      memory: "Ring on z-axis: only z lives.",
    });
  }

  // Parallel plate capacitor charge
  if (hasAny(lower, ["parallel-plate capacitor", "diameter electrodes", "charge on each electrode"])) {
    return result({
      topic: "Ch. 24/26: Parallel-Plate Charge",
      givens,
      unknown: "Charge on each plate",
      formula: "Q = epsilon0*A*E",
      steps:
        "Find plate area A = pi r^2. Then use E = Q/(epsilon0 A), so Q = epsilon0 A E.",
      answer:
        "For 6.0 cm diameter and E=6.0 x 10^6 N/C:\nr = 0.030 m\nA = 0.002827 m^2\nQ = 1.50 x 10^-7 C = 150 nC",
      trap: "Plate spacing is not needed if E is already given.",
      memory: "Plate charge = epsilon0 times area times field.",
    });
  }

  // Proton between plates
  if (hasAny(lower, ["proton", "oppositely charged parallel plates", "released from rest", "strikes"])) {
    return result({
      topic: "Ch. 23/24: Proton Between Plates",
      givens,
      unknown: "Electric field or final speed",
      formula: "d = 1/2 at^2, E = ma/q, v = at",
      steps:
        "Starts from rest. Use kinematics first.\na = 2d/t^2.\nThen electric field: E = ma/q.\nFinal speed: v = at.",
      answer:
        "For d=1.50 cm and t=1.46 x 10^-6 s:\na = 1.41 x 10^10 m/s^2\nE = 147 N/C\nv = 2.05 x 10^4 m/s",
      trap: "Watch powers of ten when dividing by proton charge.",
      memory: "Motion first, field second.",
    });
  }

  // Ch 24 Gauss/flux fallback
  if (hasAny(lower, ["flux", "gauss", "enclosed charge", "closed surface", "electric flux"])) {
    return result({
      topic: "Ch. 24: Electric Flux and Gauss's Law",
      givens,
      unknown: "Flux, field, or enclosed charge",
      formula: "Phi = EA cos(theta) and Phi = q_enclosed/epsilon0",
      steps:
        "For flat area/angle: use Phi = EA cos(theta).\nFor closed surface/enclosed charge: use Gauss's law.",
      answer: "Only enclosed charge matters for total flux through a closed surface.",
      trap: "Charges outside a closed surface do not change net flux.",
      memory: "Gauss cares about what is inside the bubble.",
    });
  }

  return result({
    topic: "Universal Physics Breakdown",
    givens,
    unknown: "The thing the question asks for",
    formula: "Not confidently classified yet.",
    steps:
      "1. Circle clue words.\n2. List givens.\n3. Identify unknown.\n4. Pick chapter/model.\n5. Choose formula.\n6. Check units.\n\nPaste the answer choices too if it is multiple choice.",
    answer: "I will not invent an answer if the problem type is unclear.",
    trap: "Full wording matters. Mastering problems hide the model in the sentence.",
    memory: "No panic: givens -> unknown -> model -> formula.",
  });
}

const CHAPTERS = [
  {
    id: 16,
    title: "Ch. 16 Waves, Sound, Doppler",
    color: COLORS.blue,
    formula: "v=f lambda, v=sqrt(T/mu), y=A sin(kx-omega t+phi)",
    goals: [
      "Know transverse vs longitudinal waves",
      "Use v=sqrt(T/mu) for strings",
      "Use y(x,t)=A sin(kx-omega t+phi)",
      "Understand snapshot/history graphs",
      "Use sound intensity inverse square",
      "Understand Doppler frequency shifts",
    ],
  },
  {
    id: 22,
    title: "Ch. 22 Charge and Coulomb Force",
    color: COLORS.yellow,
    formula: "Q=Ne, F=kq1q2/r^2",
    goals: [
      "Know electrons added means negative charge",
      "Use Coulomb force magnitude",
      "Determine attraction vs repulsion",
      "Use i, j, k vector components",
    ],
  },
  {
    id: 23,
    title: "Ch. 23 Electric Fields",
    color: COLORS.green,
    formula: "E=F/q, E=k|q|/r^2",
    goals: [
      "Know field direction from positive/negative charges",
      "Use superposition",
      "Understand polarization",
      "Solve point charge field problems",
      "Understand dipoles",
    ],
  },
  {
    id: 24,
    title: "Ch. 24 Flux, Gauss, Symmetry",
    color: COLORS.purple,
    formula: "Phi=EA cos(theta), Phi=q_enc/epsilon0",
    goals: [
      "Use electric flux",
      "Know enclosed charge controls net flux",
      "Use symmetry for rings and wires",
      "Handle parallel plates/proton motion",
    ],
  },
];

const MEMORY_CARDS = [
  ["Ch16", "Transverse wave?", "Medium moves perpendicular to wave direction."],
  ["Ch16", "Longitudinal wave?", "Medium moves parallel to wave direction."],
  ["Ch16", "String speed formula?", "v = sqrt(T/mu)."],
  ["Ch16", "Wave number?", "k = 2pi/lambda."],
  ["Ch16", "Angular frequency?", "omega = 2pi f."],
  ["Ch16", "Wave speed from k and omega?", "v = omega/k."],
  ["Ch16", "Snapshot graph?", "D vs x at one instant."],
  ["Ch16", "History graph?", "D vs t at one position."],
  ["Ch16", "Sound speed in fluid?", "v = sqrt(B/rho)."],
  ["Ch16", "Intensity vs distance?", "I proportional to 1/r^2."],
  ["Ch16", "Doppler toward?", "Observed frequency increases."],
  ["Ch16", "Doppler away?", "Observed frequency decreases."],
  ["Ch22", "Charge of one electron?", "-1.60 x 10^-19 C."],
  ["Ch22", "Electrons added means?", "Object becomes negative."],
  ["Ch22", "Coulomb force?", "F = kq1q2/r^2."],
  ["Ch22", "Like charges?", "Repel."],
  ["Ch22", "Opposite charges?", "Attract."],
  ["Ch23", "Electric field from point charge?", "E = k|q|/r^2."],
  ["Ch23", "Field direction from positive charge?", "Away."],
  ["Ch23", "Field direction from negative charge?", "Toward."],
  ["Ch23", "Conductor charge behavior?", "Spreads across surface."],
  ["Ch23", "Insulator charge behavior?", "Stays local."],
  ["Ch23", "Neutral object attraction?", "Polarization."],
  ["Ch24", "Flux through flat surface?", "Phi = EA cos(theta)."],
  ["Ch24", "Gauss law?", "Phi = q_enclosed/epsilon0."],
  ["Ch24", "Gauss trap?", "Only enclosed charge counts."],
  ["Ch24", "Ring field axis direction?", "Parallel to z-axis."],
  ["Ch24", "Finite wire field direction above midpoint?", "Positive j direction."],
  ["Ch24", "Parallel plate charge from field?", "Q = epsilon0 A E."],
  ["Ch24", "Proton between plates first step?", "Use d = 1/2 at^2 to find a."],
];

const BOSS_QUESTIONS = [
  {
    q: "2.0 x 10^10 electrons are added. What is the sign of Q?",
    choices: ["Negative", "Positive", "Zero", "Depends on mass"],
    a: "Negative",
    teach: "Electrons are negative, so adding them gives negative net charge.",
  },
  {
    q: "What is Q for 2.0 x 10^10 added electrons?",
    choices: ["-3.2 x 10^-9 C", "+3.2 x 10^-9 C", "-3.2 x 10^9 C", "0 C"],
    a: "-3.2 x 10^-9 C",
    teach: "Q = N(-e) = (2.0e10)(-1.60e-19) = -3.2e-9 C.",
  },
  {
    q: "For a string, increasing tension does what to wave speed?",
    choices: ["Increases it", "Decreases it", "No change", "Makes it zero"],
    a: "Increases it",
    teach: "v = sqrt(T/mu).",
  },
  {
    q: "Sound intensity from a spherical source follows:",
    choices: ["1/r^2", "r^2", "1/r", "constant always"],
    a: "1/r^2",
    teach: "Energy spreads over area 4pi r^2.",
  },
  {
    q: "A negative point charge has field lines pointing:",
    choices: ["Toward it", "Away from it", "In circles", "Only upward"],
    a: "Toward it",
    teach: "A positive test charge would be attracted toward a negative source.",
  },
  {
    q: "A neutral conductor near a charged object is often:",
    choices: ["Strongly attracted", "Always repelled", "Always unaffected", "Destroyed emotionally"],
    a: "Strongly attracted",
    teach: "Free charges shift strongly in a conductor.",
  },
  {
    q: "Gauss's law cares about:",
    choices: ["Enclosed charge", "Only outside charge", "Color", "Mass only"],
    a: "Enclosed charge",
    teach: "Net flux through a closed surface equals q_enclosed/epsilon0.",
  },
  {
    q: "For a ring in the xy-plane, field on the z-axis points:",
    choices: ["Along z", "Along x", "Along y", "In a circle"],
    a: "Along z",
    teach: "Symmetry cancels the sideways components.",
  },
];

function loadProgress() {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem("physicsMemoryProgress");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("physicsMemoryProgress", JSON.stringify(progress));
    }
  } catch {}
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
  const [chapter, setChapter] = useState(CHAPTERS[0]);
  const [problem, setProblem] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [bossIndex, setBossIndex] = useState(0);
  const [bossMessage, setBossMessage] = useState("");
  const [progress, setProgress] = useState(loadProgress);

  const solved = useMemo(() => solveHomework(problem), [problem]);
  const currentCard = MEMORY_CARDS[cardIndex % MEMORY_CARDS.length];
  const boss = BOSS_QUESTIONS[bossIndex % BOSS_QUESTIONS.length];

  function markMemory(level) {
    const key = currentCard[1];
    const next = {
      ...progress,
      [key]: {
        level,
        lastSeen: Date.now(),
        misses: level === "again" ? ((progress[key]?.misses || 0) + 1) : (progress[key]?.misses || 0),
      },
    };
    setProgress(next);
    saveProgress(next);
    setShowAnswer(false);
    setCardIndex((i) => i + 1);
  }

  const missed = Object.entries(progress).filter(([, v]) => v.level === "again").length;
  const mastered = Object.entries(progress).filter(([, v]) => v.level === "easy").length;

  if (screen === "home") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Physics Final Boss Memory App</Text>
        <Text style={styles.subtitle}>
          Built to make formulas stick: paste homework, drill recall, review misses, then boss fight.
        </Text>

        <Card color={COLORS.yellow}>
          <Text style={styles.sectionTitle}>Today&apos;s Memory Stats</Text>
          <Text style={styles.body}>Mastered: {mastered}</Text>
          <Text style={styles.body}>Needs review: {missed}</Text>
          <Text style={styles.body}>Rule: if you miss it, the app keeps bringing it back.</Text>
        </Card>

        <Button title="Paste Homework Solver" onPress={() => setScreen("solver")} color={COLORS.green} />
        <Button title="Memory Mode: Flashcards" onPress={() => setScreen("memory")} color={COLORS.yellow} />
        <Button title="Homework Boss Game" onPress={() => setScreen("boss")} color={COLORS.red} />
        <Button title="Formula Map" onPress={() => setScreen("formulas")} color={COLORS.purple} />
        <Button title="Exam Cram Plan" onPress={() => setScreen("cram")} color={COLORS.blue} />

        <Text style={styles.sectionTitle}>Chapters</Text>
        {CHAPTERS.map((ch) => (
          <Pressable
            key={ch.id}
            style={[styles.chapterButton, { borderColor: ch.color }]}
            onPress={() => {
              setChapter(ch);
              setScreen("chapter");
            }}
          >
            <Text style={styles.chapterTitle}>{ch.title}</Text>
            <Text style={styles.body}>{ch.formula}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  if (screen === "solver") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Paste Homework Solver</Text>
        <Text style={styles.subtitle}>Paste the full problem. It will not invent an answer if it cannot classify it.</Text>

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

  if (screen === "memory") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Memory Mode</Text>
        <Text style={styles.subtitle}>Answer out loud before pressing show answer. That is how it gets into your brain.</Text>

        <Card color={COLORS.yellow}>
          <Text style={styles.label}>{currentCard[0]}</Text>
          <Text style={styles.bigQuestion}>{currentCard[1]}</Text>

          {showAnswer ? (
            <>
              <Text style={styles.answer}>{currentCard[2]}</Text>
              <Button title="Again - I missed it" onPress={() => markMemory("again")} color={COLORS.red} />
              <Button title="Good - I got it" onPress={() => markMemory("good")} color={COLORS.blue} />
              <Button title="Easy - I own this" onPress={() => markMemory("easy")} color={COLORS.green} />
            </>
          ) : (
            <Button title="Show Answer" onPress={() => setShowAnswer(true)} color={COLORS.yellow} />
          )}
        </Card>

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "boss") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Homework Boss Game</Text>
        <Text style={styles.subtitle}>Fast recall. No calculator first. Build instincts.</Text>

        <Card color={COLORS.red}>
          <Text style={styles.label}>Round {bossIndex + 1}</Text>
          <Text style={styles.bigQuestion}>{boss.q}</Text>

          {boss.choices.map((choice) => (
            <Pressable
              key={choice}
              style={styles.choice}
              onPress={() => {
                if (choice === boss.a) {
                  setBossMessage("Correct. " + boss.teach);
                } else {
                  setBossMessage("Not yet. " + boss.teach);
                }
              }}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}

          {bossMessage ? <Text style={styles.answer}>{bossMessage}</Text> : null}

          <Button
            title="Next Boss Round"
            onPress={() => {
              setBossMessage("");
              setBossIndex((i) => i + 1);
            }}
            color={COLORS.red}
          />
        </Card>

        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "chapter") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{chapter.title}</Text>
        <Card color={chapter.color}>
          <Text style={styles.label}>Core Formula</Text>
          <Text style={styles.answer}>{chapter.formula}</Text>
          <Text style={styles.label}>Memory Goals</Text>
          {chapter.goals.map((g) => (
            <Text key={g} style={styles.body}>- {g}</Text>
          ))}
        </Card>
        <Button title="Practice Memory Cards" onPress={() => setScreen("memory")} color={COLORS.yellow} />
        <Button title="Paste Homework From This Chapter" onPress={() => setScreen("solver")} color={COLORS.green} />
        <Button title="Back Home" onPress={() => setScreen("home")} />
      </ScrollView>
    );
  }

  if (screen === "formulas") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Formula Map</Text>
        {CHAPTERS.map((ch) => (
          <Card key={ch.id} color={ch.color}>
            <Text style={styles.sectionTitle}>{ch.title}</Text>
            <Text style={styles.answer}>{ch.formula}</Text>
            {ch.goals.map((g) => <Text key={g} style={styles.body}>- {g}</Text>)}
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
          <Text style={styles.sectionTitle}>The 4-Step Memory Loop</Text>
          <Text style={styles.body}>1. Paste one homework problem into Solver.</Text>
          <Text style={styles.body}>2. Say the formula out loud before reading the answer.</Text>
          <Text style={styles.body}>3. Do 10 Memory Cards.</Text>
          <Text style={styles.body}>4. Do 5 Boss Game rounds.</Text>
        </Card>
        <Card color={COLORS.yellow}>
          <Text style={styles.sectionTitle}>Cheat Sheet Rule</Text>
          <Text style={styles.body}>Do not write only formulas. Write:</Text>
          <Text style={styles.body}>Formula | clue words | units | trap | example</Text>
        </Card>
        <Card color={COLORS.green}>
          <Text style={styles.sectionTitle}>Before Exam</Text>
          <Text style={styles.body}>Ch. 16: waves, sound, Doppler</Text>
          <Text style={styles.body}>Ch. 22: charge and Coulomb force</Text>
          <Text style={styles.body}>Ch. 23: electric fields and polarization</Text>
          <Text style={styles.body}>Ch. 24: flux, Gauss, symmetry</Text>
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
    fontSize: 26,
    lineHeight: 34,
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
});
