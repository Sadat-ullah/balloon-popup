export interface LevelExplanation {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'expression';
  text: string;
  a?: number;
  b?: number;
  op?: string;
}

export interface LevelData {
  level: number;
  question: string;
  expr: string;
  answer: number;
  balloonCount: number;
  options: number[];
  category: string;
  explanation: LevelExplanation;
}

export function generateAllLevels(): LevelData[] {
  const levels: LevelData[] = [];

  for (let lvl = 1; lvl <= 100; lvl++) {
    let question = '';
    let expr = '';
    let answer = 0;
    let distractors: number[] = [];
    let balloonCount = 3;
    let category = 'Single-digit Addition';
    let explanation: LevelExplanation = {
      type: 'addition',
      text: '',
    };

    if (lvl <= 10) {
      category = 'Single-digit Addition';
      const a = (lvl % 5) + 1;
      const b = ((lvl * 2) % 4) + 1;
      expr = `${a} + ${b}`;
      question = `${expr} = ?`;
      answer = a + b;
      balloonCount = 3;
      distractors = [answer - 1, answer + 1, answer + 2].filter((n) => n > 0 && n !== answer);
      explanation = {
        type: 'addition',
        a,
        b,
        op: '+',
        text: `Count them together: ${a} and ${b} make ${answer}!`,
      };
    } else if (lvl <= 20) {
      category = 'Two-digit Addition';
      const a = 10 + ((lvl * 3) % 25);
      const b = 12 + ((lvl * 4) % 25);
      expr = `${a} + ${b}`;
      question = `${expr} = ?`;
      answer = a + b;
      balloonCount = 4;
      distractors = [answer - 10, answer + 10, answer + 1, answer - 1].filter((n) => n > 0 && n !== answer);
      explanation = {
        type: 'addition',
        a,
        b,
        op: '+',
        text: `Add the ones and tens: ${a} + ${b} = ${answer}!`,
      };
    } else if (lvl <= 30) {
      category = 'Whole Subtraction';
      const b = 5 + ((lvl * 3) % 15);
      const a = b + 5 + ((lvl * 2) % 20);
      expr = `${a} - ${b}`;
      question = `${expr} = ?`;
      answer = a - b;
      balloonCount = 4;
      distractors = [answer + b, answer - 2, answer + 2, answer + 10].filter((n) => n > 0 && n !== answer);
      explanation = {
        type: 'subtraction',
        a,
        b,
        op: '-',
        text: `Start with ${a}, take away ${b} to get ${answer}!`,
      };
    } else if (lvl <= 40) {
      category = 'Mixed Addition & Subtraction';
      const a = 15 + ((lvl * 2) % 15);
      const b = 4 + (lvl % 6);
      const c = 2 + (lvl % 5);
      expr = `${a} + ${b} - ${c}`;
      question = `${expr} = ?`;
      answer = a + b - c;
      balloonCount = lvl > 35 ? 5 : 4;
      distractors = [answer + c, answer - b, answer + 1, answer - 1, answer + 10].filter((n) => n > 0 && n !== answer);
      explanation = {
        type: 'expression',
        text: `Step 1: ${a} + ${b} = ${a + b}. Step 2: ${a + b} - ${c} = ${answer}!`,
      };
    } else if (lvl <= 50) {
      category = 'Multiplication Tables';
      const a = 3 + (lvl % 7);
      const b = 2 + ((lvl * 3) % 8);
      expr = `${a} × ${b}`;
      question = `${expr} = ?`;
      answer = a * b;
      balloonCount = 5;
      distractors = [a + b, answer + a, answer - b, answer + 2, answer - 2].filter((n) => n > 0 && n !== answer);
      explanation = {
        type: 'multiplication',
        a,
        b,
        op: '×',
        text: `${a} groups of ${b} make ${answer}!`,
      };
    } else if (lvl <= 60) {
      category = 'Add, Subtract & Multiply';
      const a = 4 + (lvl % 6);
      const b = 2 + (lvl % 4);
      const c = 3 + ((lvl * 2) % 5);
      expr = `${a} + ${b} × ${c}`;
      question = `${expr} = ?`;
      answer = a + b * c;
      balloonCount = 5;
      const l2rTrap = (a + b) * c;
      distractors = [l2rTrap, answer + 2, answer - 2, answer + a, answer - 1].filter((n) => n > 0 && n !== answer);
      explanation = {
        type: 'expression',
        text: `BODMAS Rule: Multiply first! ${b} × ${c} = ${b * c}, then add ${a} = ${answer}!`,
      };
    } else if (lvl <= 70) {
      category = 'Exact Division';
      const b = 3 + (lvl % 7);
      const answerQuotient = 4 + ((lvl * 2) % 8);
      const a = b * answerQuotient;
      expr = `${a} ÷ ${b}`;
      question = `${expr} = ?`;
      answer = answerQuotient;
      balloonCount = 5;
      distractors = [answer + 1, answer - 1, answer + 2, answer * 2, answer + b].filter((n) => n > 0 && n !== answer);
      explanation = {
        type: 'division',
        a,
        b,
        op: '÷',
        text: `${a} split into ${b} equal parts is ${answer}!`,
      };
    } else if (lvl <= 80) {
      category = 'All Four Operations';
      const d = 2 + (lvl % 3);
      const mult = 2 + ((lvl * 3) % 4);
      const divNum = d * (2 + (lvl % 4));
      const addNum = 10 + (lvl % 15);
      expr = `${addNum} + ${divNum} ÷ ${d} × ${mult}`;
      question = `${expr} = ?`;
      answer = addNum + (divNum / d) * mult;
      balloonCount = lvl > 75 ? 6 : 5;
      distractors = [answer + 4, answer - 3, answer + mult, Math.floor(((addNum + divNum) / d) * mult), answer + 1].filter(
        (n) => n > 0 && n !== answer
      );
      explanation = {
        type: 'expression',
        text: `Precedence: ${divNum} ÷ ${d} = ${divNum / d}, then × ${mult} = ${(divNum / d) * mult}, + ${addNum} = ${answer}!`,
      };
    } else if (lvl <= 94) {
      category = 'Extended Expressions';
      const divBase = 10 + (lvl % 10) * 5;
      const divBy = 5;
      const m1 = 4 + (lvl % 6);
      const m2 = 3 + (lvl % 4);
      const sub = 5 + (lvl % 10);
      expr = `${divBase} ÷ ${divBy} + ${m1} × ${m2} - ${sub}`;
      question = `${expr} = ?`;
      answer = divBase / divBy + m1 * m2 - sub;
      balloonCount = 6;
      distractors = [answer + 5, answer - 5, answer + 2, answer - 3, answer + 10, answer - 1].filter(
        (n) => n > 0 && n !== answer
      );
      explanation = {
        type: 'expression',
        text: `Division & Multiplication first: ${divBase / divBy} + ${m1 * m2} - ${sub} = ${answer}!`,
      };
    } else {
      category = 'Zero, One & BODMAS Master';
      if (lvl === 95) {
        expr = '25 + 1 × 0';
        answer = 25;
        distractors = [0, 26, 1, 24, 27];
      } else if (lvl === 96) {
        expr = '14 × 1 + 0 ÷ 7';
        answer = 14;
        distractors = [0, 1, 15, 21, 7];
      } else if (lvl === 97) {
        expr = '50 - 5 × 0 + 10';
        answer = 60;
        distractors = [0, 10, 50, 55, 45];
      } else if (lvl === 98) {
        expr = '100 × 0 + 35 ÷ 7';
        answer = 5;
        distractors = [0, 35, 105, 1, 12];
      } else if (lvl === 99) {
        expr = '8 + 8 ÷ 8 + 8 × 0';
        answer = 9;
        distractors = [0, 2, 8, 16, 1];
      } else {
        expr = '12 + 12 × 1 - 0 + 6 ÷ 2';
        answer = 27;
        distractors = [15, 24, 30, 0, 26];
      }
      question = `${expr} = ?`;
      balloonCount = 6;
      explanation = {
        type: 'expression',
        text: `Remember: Any number multiplied by 0 is 0. Multiplication/Division take priority! Result: ${answer}!`,
      };
    }

    // Deduplicate and pad distractors to exact balloonCount
    const uniqueOptions = new Set<number>([answer]);
    for (const d of distractors) {
      if (uniqueOptions.size < balloonCount && Number.isInteger(d) && d >= 0) {
        uniqueOptions.add(d);
      }
    }
    let offset = 1;
    while (uniqueOptions.size < balloonCount) {
      if (answer - offset >= 0) uniqueOptions.add(answer - offset);
      if (uniqueOptions.size < balloonCount) uniqueOptions.add(answer + offset);
      offset++;
    }

    // Deterministic or pseudo-random shuffle seeded by level
    const options = Array.from(uniqueOptions);
    for (let i = options.length - 1; i > 0; i--) {
      const j = ((lvl * 17 + i * 31) % (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    levels.push({
      level: lvl,
      question,
      expr,
      answer,
      balloonCount,
      options,
      category,
      explanation,
    });
  }

  return levels;
}

export const LEVELS = generateAllLevels();
