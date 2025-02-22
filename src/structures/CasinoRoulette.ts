export class CasinoRoulette {
  private readonly possibleEmojis: { symbol: string; probability: number }[];

  constructor() {
    this.possibleEmojis = [
      { symbol: "🍒", probability: 0.6 },
      { symbol: "💎", probability: 0.25 },
      { symbol: "🍀", probability: 0.15 },
    ];
  }

  private getRandomEmoji(): string {
    const random = Math.random();
    let acumulado = 0;

    for (const emoji of this.possibleEmojis) {
      acumulado += emoji.probability;
      if (random < acumulado) {
        return emoji.symbol;
      }
    }

    return this.possibleEmojis[0].symbol;
  }

  public spin(): {
    symbols: string[];
    win: boolean;
  } {
    const symbols = [
      this.getRandomEmoji(),
      this.getRandomEmoji(),
      this.getRandomEmoji(),
    ];

    const win = symbols[0] === symbols[1] && symbols[1] === symbols[2];

    return {
      symbols,
      win,
    };
  }
}
