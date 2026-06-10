import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

  const solved = solveProblem(problem);

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
});
