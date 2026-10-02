import { Chapter } from "../types";

export const ch04_transformer: Chapter = {
  id: 4,
  slug: "transformer-and-attention",
  title: "The Transformer & Attention",
  subtitle: "Who should I listen to in the room?",
  pipelineStage: "foundations",
  estMinutes: 9,
  hook: "In the sentence 'The singer dropped the acoustic guitar because it was heavy', how does a computer know what 'it' refers to?",
  analogy: {
    title: "The Committee Meeting of Words",
    body: "Picture a meeting room where every word or note is a person sitting at a large circular conference table. Before anyone speaks, each person looks around the room and assigns a percentage of attention to everyone else. The word 'it' stares intently at 'guitar' (90%) and barely glances at 'dropped' (5%) or 'singer' (5%). Each person then blends what they heard into an updated understanding of their own role.",
    breaksDown: "People in a meeting have thoughts, personal goals, and social cues. Attention in a transformer is strictly matrix multiplication: multiplying vectors, scaling by the square root of the dimension, and applying a softmax formula to get percentages."
  },
  concept: [
    {
      heading: "Screen 1: The Context Problem",
      content: "A word alone has ambiguous meaning. Is 'lead' a heavy metal, or a lead guitar solo? Meaning is determined by context. Earlier recurrent neural networks (RNNs) processed words one by one like a conveyor belt, often forgetting early words by the end of a long verse. The Transformer processes all tokens in the context window simultaneously.",
      eli5Content: "Words change meaning depending on who they are hanging out with. A transformer looks at all words in a sentence at the exact same time so nothing is forgotten."
    },
    {
      heading: "Screen 2: Attention Scores and Softmax",
      content: "For every pair of tokens, the model calculates a compatibility score. To make these scores usable as blending weights, the model runs them through the softmax function. Softmax converts any list of raw scores into clean percentages that are all positive and add up to exactly 100%.",
      eli5Content: "Softmax turns raw point scores into fair percentage slices of a pie, so they always total 100%."
    },
    {
      heading: "Screen 3: Query, Key, and Value (The Library Search)",
      content: "Attention breaks each token into three distinct projections:\n- Query: What this token is searching for ('I am an adjective looking for a noun').\n- Key: The label or index on each token ('I am an acoustic instrument noun').\n- Value: The actual feature content to be passed forward.\nWhen a token's Query matches another token's Key, they produce a high attention score, and that token's Value gets mixed into the output.",
      eli5Content: "Think of looking up books in a library: Query is the title you typed in the search bar; Key is the sticker on the book spine; Value is the story inside the book."
    },
    {
      heading: "Screen 4: Layers, Heads, and the Causal Mask",
      content: "A single attention head might focus on rhyme, while another tracks rhythmic beats. Transformers run multiple heads in parallel (Multi-Head Attention), stacked through dozens of layers. When generating new tokens step by step, the model applies a Causal Mask: a triangular filter that forbids tokens from looking into the future.",
      eli5Content: "We stack many rounds of this meeting (layers), and let different people focus on different questions (heads). When writing a new song, we cover future notes with a blindfold (causal mask) so the AI can't cheat."
    }
  ],
  inYuE2: {
    summary: "YuE2 uses transformer layers for both its autoregressive planning/semantic stage and its non-autoregressive acoustic stage, sharing foundational attention concepts.",
    factIds: ["architecture_claim", "parameter_count"]
  },
  pythonCorner: [
    {
      title: "Single-Head Attention in 14 Lines of Pure Python",
      language: "python",
      type: "runnable",
      description: "A runnable, pure-Python calculation of attention scores, softmax conversion, and value blending with zero dependencies.",
      code: `import math

# Three 2D token vectors: [Query, Key, Value] for "acoustic", "guitar", "solo"
tokens = ["acoustic", "guitar", "solo"]
queries = [[1.0, 0.0], [0.8, 0.6], [0.0, 1.0]]
keys    = [[1.0, 0.0], [0.9, 0.5], [0.1, 0.9]]
values  = [[10.0],     [20.0],     [30.0]]

# Focus on token 1: "guitar" looking at all tokens
q_guitar = queries[1]

# 1. Compute dot product scores with all keys
scores = [sum(q * k for q, k in zip(q_guitar, k_vec)) for k_vec in keys]

# 2. Scale by sqrt(dimension) and apply softmax to get weights summing to 1.0
scale = math.sqrt(len(q_guitar))
exp_scores = [math.exp(s / scale) for s in scores]
total = sum(exp_scores)
weights = [e / total for e in exp_scores]

# 3. Blend values using attention weights
output = sum(w * v[0] for w, v in zip(weights, values))

print("Attention weights from 'guitar':", [round(w, 3) for w in weights])
print("Blended value for 'guitar':", round(output, 2))`
    }
  ],
  newTerms: [
    "transformer",
    "attention",
    "query-key-value",
    "softmax",
    "layer",
    "head",
    "causal-mask",
    "context-window"
  ],
  recap: [
    "Attention allows every token to examine and blend information from every other token in the sequence.",
    "Query matches Key to calculate attention weight; the weight determines how much Value gets copied forward.",
    "Softmax ensures all attention percentages for a token add up to exactly 100%.",
    "Multi-head attention allows different heads to simultaneously track different relationships (e.g., rhythm, rhyme, harmony).",
    "A causal mask prevents the model from peeking at future tokens during sequential generation."
  ],
  quiz: [
    {
      id: "q4_1",
      question: "In the Query, Key, Value analogy of a library search, what does the 'Key' represent?",
      options: [
        "The search query typed into the computer by the user",
        "The spine label / index on the catalog item that matches the query",
        "The library card used to check out books",
        "The fine paid for returning a book late"
      ],
      correctIndex: 1,
      explanation: "The Query is what is sought; the Key is the indexing tag compared against the Query; the Value is the content retrieved."
    },
    {
      id: "q4_2",
      question: "What does the softmax function do to raw attention scores?",
      options: [
        "Rounds every number to the nearest integer",
        "Converts arbitrary numbers into positive percentages that sum to 100%",
        "Deletes all negative numbers and replaces them with zeros",
        "Multiplies all numbers by the learning rate"
      ],
      correctIndex: 1,
      explanation: "Softmax exponentiates scores and normalizes them by their sum, yielding a valid probability distribution that totals 100%."
    },
    {
      id: "q4_3",
      question: "Why is a causal mask necessary during autoregressive music generation?",
      options: [
        "To stop the model from overheating the GPU",
        "To ensure tokens can only attend to past tokens, preventing cheating by looking at future notes that haven't been written yet",
        "To translate English lyrics into Chinese ABC notation",
        "To turn stereo audio into mono"
      ],
      correctIndex: 1,
      explanation: "During autoregressive generation, future tokens do not yet exist. The causal mask blocks attention to subsequent positions."
    }
  ]
};

export const ch05_autoregression: Chapter = {
  id: 5,
  slug: "generating-one-token-at-a-time",
  title: "Generating: One Token at a Time",
  subtitle: "Autoregression, dice rolls, and temperature",
  pipelineStage: "foundations",
  estMinutes: 7,
  hook: "If an AI generates a song one tiny token at a time, why doesn't it loop the same word over and over or veer off into random gibberish?",
  analogy: {
    title: "Rolling Weighted Dice at the Improv Club",
    body: "Imagine sitting at a typewriter with a 20-sided die. After every word you type, you consult a chart showing the most likely next words. But instead of always picking word #1 (which gets boring and repetitive), you roll the die. High-probability words take up 14 sides of the die; surprising words take up 2 sides. Temperature is a dial that changes how many sides rare words get.",
    breaksDown: "Dice are physical objects subject to gravity and air resistance. Neural network sampling uses pseudo-random number generator math in Python (`random.random()`), initialized by a fixed integer called a seed."
  },
  concept: [
    {
      heading: "The Autoregressive Loop",
      content: "Autoregressive (AR) generation is a simple while-loop. You provide a prompt. The model predicts probabilities for the next token. You sample one token, append it to your list, and feed the entire expanded list back into the model. The loop terminates when the model predicts the special stop token `<|endoftext|>`. In Python: `while token != STOP: history.append(sample(model(history)))`.",
      eli5Content: "The model writes a word, glues it to the end of the page, reads the whole page again, and writes the next word. It keeps doing this until it writes the special 'The End' symbol."
    },
    {
      heading: "Sampling Controls: Temperature and Top-k",
      content: "Always picking the highest-scoring token (greedy search) leads to robotic, looping text. Instead, we sample probabilistically using two controls:\n- Temperature: Dividing scores by a temperature float. Low temperature (< 0.7) sharpens probabilities toward safe favorites; high temperature (> 1.0) flattens them, encouraging creative variety.\n- Top-k: Eliminates all choices except the top K candidates, preventing bizarre tail options from being selected.",
      eli5Content: "Temperature is a spice dial: turn it down for safe, predictable notes; turn it up for jazzier, unexpected notes. Top-k throws away the weirdest choices so the AI doesn't pick gibberish."
    },
    {
      heading: "The Seed: Reproducible Randomness",
      content: "Computers cannot generate truly random numbers; they use pseudo-random formulas that begin with an initial integer called a seed. If you run YuE2 with `seed=1234`, you get the exact same sequence of dice rolls every time. Change the seed to `1235`, and you get an entirely different rendition.",
      eli5Content: "The seed is like saving the starting position of a shuffle machine: start from the same number, and the cards come out in the exact same order every time!"
    }
  ],
  inYuE2: {
    summary: "YuE2 uses autoregressive sampling to write its ABC sheet music and its semantic music tokens, accepting a seed parameter to ensure full reproducibility.",
    factIds: ["reproducibility", "symbolic_planning", "two_stages_audio"]
  },
  pythonCorner: [
    {
      title: "An Autoregressive Sampling Loop in Pure Python",
      language: "python",
      type: "runnable",
      description: "This runnable Python loop demonstrates temperature scaling, top-k filtering, and seeded random sampling.",
      code: `import math
import random

def sample_next_token(logits: dict[str, float], temperature: float = 1.0, top_k: int = 3, seed: int = 42):
    rng = random.Random(seed)
    
    # 1. Sort and keep top-k items
    sorted_items = sorted(logits.items(), key=lambda x: x[1], reverse=True)[:top_k]
    tokens = [item[0] for item in sorted_items]
    raw_scores = [item[1] for item in sorted_items]
    
    # 2. Scale by temperature and apply softmax
    scaled = [s / max(temperature, 0.01) for s in raw_scores]
    exp_scores = [math.exp(s - max(scaled)) for s in scaled]
    total = sum(exp_scores)
    probs = [e / total for e in exp_scores]
    
    # 3. Roll the weighted dice
    return rng.choices(tokens, weights=probs, k=1)[0]

# Candidate scores for next note in a melody
logits = {"C4": 2.5, "E4": 2.2, "G4": 1.8, "D4": 0.4, "F#4": -1.2}

print("Safe sample (temp=0.3):", sample_next_token(logits, temperature=0.3, seed=10))
print("Creative sample (temp=1.2):", sample_next_token(logits, temperature=1.2, seed=10))`
    }
  ],
  newTerms: [
    "autoregressive",
    "sampling",
    "temperature",
    "top-k",
    "top-p",
    "seed",
    "stop-token"
  ],
  recap: [
    "Autoregression generates output one token at a time, appending each new token to the input history.",
    "Sampling picks from the probability distribution rather than always picking the single highest probability.",
    "Temperature controls randomness: lower means safer and more predictable; higher means more adventurous.",
    "Top-k and Top-p restrict sampling to plausible candidates, preventing bizarre errors.",
    "The seed guarantees reproducible generations when all other parameters remain identical."
  ],
  quiz: [
    {
      id: "q5_1",
      question: "What happens if you run YuE2 twice with the exact same prompt, settings, and seed value?",
      options: [
        "You get two completely different songs because GPUs have hardware fluctuations",
        "The model crashes with a duplicate key error",
        "You get the exact same song note-for-note because the pseudo-random generator starts at the same state",
        "The second run will run twice as fast"
      ],
      correctIndex: 2,
      explanation: "A pseudo-random number generator initialized with the same seed will produce the identical deterministic sequence of numbers."
    },
    {
      id: "q5_2",
      question: "What effect does setting a very low temperature (e.g. 0.1) have on sampling?",
      options: [
        "It makes the model pick completely random, unpredictable tokens",
        "It sharpens the distribution, causing the model to almost always choose the top, safest candidate",
        "It doubles the audio volume of the output song",
        "It halves the number of layers in the neural network"
      ],
      correctIndex: 1,
      explanation: "Low temperature magnifies differences between scores, making the highest-scoring candidate dominate almost 100% of the probability."
    },
    {
      id: "q5_3",
      question: "How does the autoregressive generation loop know when a song or section is finished?",
      options: [
        "It stops when the user presses Ctrl+C",
        "It generates until the GPU runs out of electrical power",
        "It encounters a designated stop token (EOS) predicting that generation is complete",
        "It stops after exactly 1,000 words every time"
      ],
      correctIndex: 2,
      explanation: "The model learns when an ending is appropriate and outputs a special stop token (like `<|endoftext|>`), terminating the generation loop."
    }
  ]
};

export const ch06_training: Chapter = {
  id: 6,
  slug: "training-how-the-model-learned",
  title: "Training: How the Model Learned",
  subtitle: "Hiking down a foggy mountain to minimize loss",
  pipelineStage: "foundations",
  estMinutes: 8,
  hook: "YuE2-3B has over 3 billion parameters. How did all 3,000,000,000 dials get set to the right numbers?",
  analogy: {
    title: "Hiking Down a Foggy Mountain",
    body: "Imagine waking up on a steep mountain completely wrapped in dense white fog. You cannot see the valley lodge below. How do you reach safety? You feel the slope of the terrain with your hiking boots. If the ground slopes downward toward the southeast, you take a small, deliberate step southeast. Repeat this small step ten thousand times, and you descend straight into the valley. In deep learning, the mountain's altitude is the loss (error), and each step is gradient descent.",
    breaksDown: "A physical hiker walks in a 3D landscape with 2 ground directions (North/South, East/West). A deep learning optimizer navigates a landscape with 3 billion dimensions simultaneously!"
  },
  concept: [
    {
      heading: "The Training Loop: Guess, Measure, Nudge",
      content: "Training follows a repeating 4-step loop:\n1. Show: Feed the model a piece of existing music or lyrics.\n2. Predict: Have the model guess the next token.\n3. Measure Loss: Calculate how far its guess was from reality using a loss formula.\n4. Nudge (Backprop): Calculate the gradient (which way slopes down) and nudge every parameter slightly using gradient descent.",
      eli5Content: "The computer makes a guess. We tell it how wrong it was. Then it nudges its dials a tiny bit so next time it is a little bit less wrong. Repeat billions of times!"
    },
    {
      heading: "Loss, Gradients, and Learning Rate",
      content: "Loss is a single number summarizing error (0 = perfect). The gradient tells us the direction that increases loss; walking the opposite way decreases error. The learning rate is a tiny multiplier (like `0.0001`) that controls how big of a step we take. Too large, and the model overshoots into chaos; too small, and training takes decades.",
      eli5Content: "The gradient tells you which way is downhill. The learning rate is your step size: big leaps make you trip; tiny baby steps take forever."
    },
    {
      heading: "What 3 Billion Parameters Actually Means",
      content: "When stored on disk, YuE2-3B's parameters occupy about 7.3 gigabytes of storage in BF16 format (`model.safetensors`). These 7.3 GB are not recordings of MP3s or stored audio clips. They are simply the final numerical dial settings discovered after weeks of training on massive GPU clusters.",
      eli5Content: "The 7.3 GB file isn't a folder of songs—it's just a gigantic list of numbers for the dials on the computer's sound synthesizer."
    }
  ],
  inYuE2: {
    summary: "YuE2-3B contains about 3 to 4 billion parameters distributed in model.safetensors (~7.3 GB in BF16 format). Once trained, inference is run with weights frozen.",
    factIds: ["parameter_count", "weights_format", "supervision_models"]
  },
  pythonCorner: [
    {
      title: "Gradient Descent in 12 Lines of Pure Python",
      language: "python",
      type: "runnable",
      description: "A runnable, pure-Python demonstration fitting a single parameter dial (w) to predict target values using gradient descent.",
      code: `# Learn the relationship: target = 3.0 * x (true dial should be 3.0)
data = [(1.0, 3.0), (2.0, 6.0), (3.0, 9.0), (4.0, 12.0)]

# Start with a random initial parameter dial
w = 0.1
learning_rate = 0.05

for step in range(20):
    total_loss = 0.0
    gradient = 0.0
    for x, target in data:
        prediction = w * x
        error = prediction - target
        total_loss += error ** 2
        # Derivative of (w*x - target)^2 with respect to w is 2 * error * x
        gradient += 2 * error * x
    
    # Nudge parameter downhill
    w -= learning_rate * (gradient / len(data))
    if step % 5 == 0:
        print(f"Step {step:2d} | Dial w: {w:.3f} | Mean Loss: {total_loss/len(data):.4f}")

print(f"Final learned dial w: {w:.3f} (target was 3.0)")`
    }
  ],
  newTerms: [
    "training",
    "loss",
    "gradient",
    "gradient-descent",
    "learning-rate",
    "overfitting",
    "inference"
  ],
  recap: [
    "Training adjusts parameters so that the model's predictions align with human music data.",
    "Loss measures how wrong a prediction is; the goal is to drive loss as close to zero as possible.",
    "Gradient descent uses calculus derivatives to identify which direction reduces loss.",
    "Once training completes, parameters are frozen, and the model enters inference mode to generate songs."
  ],
  quiz: [
    {
      id: "q6_1",
      question: "What does 'loss' represent in machine learning training?",
      options: [
        "The financial cost of electricity consumed by the server",
        "A single number quantifying how incorrect the model's prediction was compared to the actual target",
        "The number of audio files deleted from the training drive",
        "The compression ratio of a FLAC file"
      ],
      correctIndex: 1,
      explanation: "Loss is the mathematical error penalty calculated between the model's prediction and the true ground-truth target."
    },
    {
      id: "q6_2",
      question: "What role does the 'learning rate' play in gradient descent?",
      options: [
        "It sets the playback speed of the audio track",
        "It acts as a multiplier determining how large of a step to take along the gradient during parameter updates",
        "It measures how many words per minute the student can read",
        "It counts the number of attention heads"
      ],
      correctIndex: 1,
      explanation: "The learning rate scales the gradient step size: setting it too high causes unstable divergence, while setting it too low makes training extremely slow."
    },
    {
      id: "q6_3",
      question: "When YuE2-3B is generating a song on your computer, what state are its weights in?",
      options: [
        "They are actively updating and learning from your lyrics",
        "They are frozen (inference mode); no gradient updates or learning occur",
        "They are completely deleted and re-downloaded for every note",
        "They are randomized every 5 seconds"
      ],
      correctIndex: 1,
      explanation: "During inference (generation), the model's parameters are fixed and frozen. It does not learn or alter its weights during user generation."
    }
  ]
};
