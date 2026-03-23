export const ACADEMY_CONTENT: Record<number, { article: string; quiz: { question: string; options: string[]; answerIndex: number }[] }> = {
  1: {
    article: `
# Prediction Markets 101

Prediction markets are exchange-traded markets created for the purpose of trading the outcome of events. The market prices can indicate what the crowd thinks the probability of the event is.

## Binary Options
In a binary prediction market, a contract pays out $1 if an event happens (YES) and $0 if it doesn't (NO). Because the payout is exactly $1, the price of a YES share (e.g., $0.60) directly translates to the market's implied probability of the event occurring (60%).

## Order Books
Like traditional stock exchanges, prediction markets use an order book. Buyers place bids (the maximum they are willing to pay), and sellers place asks (the minimum they are willing to accept). The current market price is where the highest bid and lowest ask meet.

## The Rule of One
In a mutually exclusive binary market, the probability of YES and NO must add up to 100%. If YES is trading at $0.60, NO must be trading at $0.40. If they don't add up to $1.00, an arbitrage opportunity exists.
    `,
    quiz: [
      {
        question: "What is the payout of a winning binary prediction market contract?",
        options: ["$100", "$1", "The amount you bet", "Variable based on odds"],
        answerIndex: 1
      },
      {
        question: "If a YES share costs $0.75, what is the market's implied probability?",
        options: ["25%", "50%", "75%", "100%"],
        answerIndex: 2
      },
      {
        question: "What does an order book consist of?",
        options: ["Only buyers", "Only sellers", "Bids and Asks", "Market makers only"],
        answerIndex: 2
      },
      {
        question: "If YES is trading at $0.30, what should NO theoretically trade at?",
        options: ["$0.30", "$0.50", "$0.70", "$1.00"],
        answerIndex: 2
      },
      {
        question: "What happens if YES and NO prices add up to less than $1.00?",
        options: ["The market closes", "An arbitrage opportunity exists", "The event is canceled", "Prices automatically adjust"],
        answerIndex: 1
      }
    ]
  },
  2: {
    article: `
# Expected Value & Edge

Expected Value (EV) is the anticipated value for a given investment at some point in the future. In prediction markets, calculating EV is how you determine if a bet is mathematically profitable in the long run.

## Calculating EV
The formula for Expected Value is:
**EV = (Probability of Winning × Amount Won) - (Probability of Losing × Amount Lost)**

For example, if you believe an event has a 50% chance of happening, but the market prices it at $0.40 (40% implied probability):
- If you buy 1 share for $0.40, you win $0.60 if you are right.
- You lose $0.40 if you are wrong.
- EV = (0.50 × $0.60) - (0.50 × $0.40) = $0.30 - $0.20 = +$0.10.

Since the EV is positive, this is a profitable bet over the long term.

## Finding Your Edge
Your "edge" is the difference between your calculated probability and the market's implied probability. If your model says an event has a 60% chance, and the market says 50%, you have a 10% edge.
    `,
    quiz: [
      {
        question: "What does EV stand for?",
        options: ["Estimated Value", "Expected Value", "Event Value", "Edge Value"],
        answerIndex: 1
      },
      {
        question: "If you have a positive EV, what does that mean?",
        options: ["You will definitely win the next bet", "The bet is mathematically profitable long-term", "The market is wrong", "You should bet your entire bankroll"],
        answerIndex: 1
      },
      {
        question: "What is the formula for EV?",
        options: ["(P_win × Amount Won) - (P_loss × Amount Lost)", "(P_win + P_loss) / 2", "Amount Won - Amount Lost", "P_win × P_loss"],
        answerIndex: 0
      },
      {
        question: "If your model predicts a 70% chance and the market prices it at $0.60, do you have an edge?",
        options: ["Yes, a 10% edge", "No, the market is higher", "Yes, a 70% edge", "No edge exists"],
        answerIndex: 0
      },
      {
        question: "Why is calculating EV important?",
        options: ["It guarantees a win", "It helps identify profitable long-term bets", "It changes the market price", "It predicts the exact future"],
        answerIndex: 1
      }
    ]
  },
  3: {
    article: `
# The Kelly Criterion

The Kelly Criterion is a mathematical formula used to determine the optimal size of a series of bets. In prediction markets, it helps you maximize long-term growth while minimizing the risk of ruin.

## The Formula
The basic Kelly formula is:
**f* = p - (q / b)**

Where:
- **f*** = The fraction of your bankroll to bet.
- **p** = The probability of winning.
- **q** = The probability of losing (1 - p).
- **b** = The proportion of the bet gained with a win (e.g., if you bet $1 and win $2 total, b = 1).

## Fractional Kelly
Betting the full Kelly fraction can be highly volatile. Many professional quantitative traders use a "Fractional Kelly" (e.g., Half-Kelly or Quarter-Kelly) to smooth out their equity curve and reduce drawdowns while still maintaining strong long-term growth.
    `,
    quiz: [
      {
        question: "What is the primary purpose of the Kelly Criterion?",
        options: ["To guarantee a win", "To determine optimal bet sizing", "To predict market prices", "To calculate Expected Value"],
        answerIndex: 1
      },
      {
        question: "In the Kelly formula, what does 'p' represent?",
        options: ["Price", "Probability of winning", "Payout", "Position size"],
        answerIndex: 1
      },
      {
        question: "What does 'b' represent in the Kelly formula?",
        options: ["Bankroll", "Base probability", "Proportion of bet gained with a win", "Binary outcome"],
        answerIndex: 2
      },
      {
        question: "Why do many traders use a 'Fractional Kelly'?",
        options: ["Because the math is easier", "To increase volatility", "To reduce drawdowns and volatility", "Because full Kelly is illegal"],
        answerIndex: 2
      },
      {
        question: "If you have no edge (EV is 0 or negative), what will the Kelly formula suggest?",
        options: ["Bet 10%", "Bet 50%", "Bet 0%", "Bet 100%"],
        answerIndex: 2
      }
    ]
  },
  4: {
    article: `
# Automated Execution

High-Frequency Strategic Quant (HFSQ) trading relies on automated execution. Instead of manually clicking buttons, you write code that interacts with the exchange's API to place orders in milliseconds.

## APIs and WebSockets
- **REST APIs** are used to send commands, like placing or canceling an order.
- **WebSockets** are used to receive real-time data, like order book updates or price changes, without having to constantly refresh.

## Rate Limits
Exchanges impose rate limits (e.g., 10 requests per second) to prevent their servers from crashing. Your bot must handle these limits gracefully, often by queuing orders or using exponential backoff when it hits a limit.

## Slippage and Liquidity
When automating trades, you must account for liquidity. If you try to buy 10,000 shares but there are only 1,000 available at the current price, your order will "slip" and fill at worse prices. Smart bots use limit orders to control the maximum price they are willing to pay.
    `,
    quiz: [
      {
        question: "What is the main advantage of automated execution?",
        options: ["It guarantees profit", "Speed and lack of emotion", "It bypasses fees", "It predicts the future"],
        answerIndex: 1
      },
      {
        question: "What technology is best for receiving real-time order book updates?",
        options: ["REST APIs", "WebSockets", "Email alerts", "Manual refreshing"],
        answerIndex: 1
      },
      {
        question: "Why do exchanges impose rate limits?",
        options: ["To make less money", "To prevent server overload", "To punish profitable traders", "To slow down the market"],
        answerIndex: 1
      },
      {
        question: "What is 'slippage'?",
        options: ["When your mouse slips", "When an order fills at a worse price due to lack of liquidity", "When the exchange goes offline", "When you forget your password"],
        answerIndex: 1
      },
      {
        question: "How can a bot prevent negative slippage?",
        options: ["By trading faster", "By using market orders", "By using limit orders", "By ignoring the order book"],
        answerIndex: 2
      }
    ]
  }
};
