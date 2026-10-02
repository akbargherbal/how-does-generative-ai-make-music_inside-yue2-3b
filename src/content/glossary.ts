/**
 * Glossary for "How Does Generative AI Make Music?"
 * Every technical term is explained in plain English with an everyday analogy
 * and a Python developer parallel. (Golden Rules G1 & G3).
 */

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  analogy: string;
  pythonAnalogy: string;
  firstChapter: number;
  relatedChapters: number[];
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  "model": {
    id: "model",
    term: "Model",
    definition: "A program whose behavior is determined by billions of learned numerical weights rather than hand-written if/else rules.",
    analogy: "A digital piano synthesizer where the sound comes from millions of preset dial settings rather than acoustic strings.",
    pythonAnalogy: "A giant function `def predict(inputs) -> output:` whose internal coefficients were learned from millions of examples.",
    firstChapter: 0,
    relatedChapters: [0, 1, 6, 12, 13]
  },
  "parameter": {
    id: "parameter",
    term: "Parameter (Weight)",
    definition: "A single adjustable number inside a neural network that controls how strongly one signal influences the next.",
    analogy: "One knob on an enormous sound mixing board with 3 billion tiny volume sliders.",
    pythonAnalogy: "A floating-point variable `w = 0.42` in an equation `y = w * x + b`.",
    firstChapter: 0,
    relatedChapters: [0, 5, 6, 12]
  },
  "generative-ai": {
    id: "generative-ai",
    term: "Generative AI",
    definition: "Machine learning systems designed to produce new content (text, images, or music) by predicting plausible continuations.",
    analogy: "An experienced jazz player who has heard thousands of solos and improvises a new, fitting phrase when you start a groove.",
    pythonAnalogy: "A generator function `def generate_next(): yield ...` that repeatedly produces new elements matching a learned pattern.",
    firstChapter: 0,
    relatedChapters: [0, 1, 5]
  },
  "probability-distribution": {
    id: "probability-distribution",
    term: "Probability Distribution",
    definition: "A list of all possible choices where each choice has a percentage score, and all scores add up to 100%.",
    analogy: "A roulette wheel where some slots are wider than others—the ball can land anywhere, but wider slots win more often.",
    pythonAnalogy: "A `dict[str, float]` where `sum(d.values()) == 1.0`, fed to `random.choices(keys, weights=values)`.",
    firstChapter: 1,
    relatedChapters: [1, 4, 5]
  },
  "token": {
    id: "token",
    term: "Token",
    definition: "The fundamental atomic unit processed by a model—often a whole word, a syllable piece, a musical symbol, or an audio code.",
    analogy: "A single LEGO brick with a specific number stamped underneath from a standard kit catalog.",
    pythonAnalogy: "An integer ID representing an item in an immutable lookup list, like `tokens = [42, 1083, 7]`.",
    firstChapter: 2,
    relatedChapters: [2, 3, 4, 5, 8, 9]
  },
  "tokenizer": {
    id: "tokenizer",
    term: "Tokenizer",
    definition: "A tool that converts human-readable text, music notation, or audio into a list of numbered token IDs (and back).",
    analogy: "A barcode scanner at the supermarket that scans a box of cereal into SKU number 84920.",
    pythonAnalogy: "A bidirectional converter with `encode(text: str) -> list[int]` and `decode(ids: list[int]) -> str`.",
    firstChapter: 2,
    relatedChapters: [2, 8, 9]
  },
  "vocabulary": {
    id: "vocabulary",
    term: "Vocabulary",
    definition: "The complete, fixed dictionary of all possible tokens that the model is allowed to know.",
    analogy: "The official Scrabble dictionary—any word or piece not in this book cannot be placed on the board.",
    pythonAnalogy: "A `dict[str, int]` mapping every known piece of text to a unique sequential integer from 0 to N-1.",
    firstChapter: 2,
    relatedChapters: [2, 5]
  },
  "embedding": {
    id: "embedding",
    term: "Embedding",
    definition: "A list of numbers that places a token on an imaginary multi-dimensional map so related concepts sit close to each other.",
    analogy: "GPS coordinates for concepts: 'coffee' and 'tea' share a street corner, while 'submarine' is miles away in the ocean.",
    pythonAnalogy: "A `list[float]` like `[0.82, -0.15, 0.44]` retrieved from a lookup table `embeddings[token_id]`.",
    firstChapter: 3,
    relatedChapters: [3, 4]
  },
  "vector": {
    id: "vector",
    term: "Vector",
    definition: "An ordered list of numbers that can represent coordinates, directions, or features.",
    analogy: "A recipe ingredient card: `[2 eggs, 100g flour, 50ml milk]` uniquely describes a batter recipe.",
    pythonAnalogy: "A standard Python list of numbers `[float, ...]`, or a 1D NumPy array.",
    firstChapter: 3,
    relatedChapters: [3, 4]
  },
  "dimension": {
    id: "dimension",
    term: "Dimension",
    definition: "One independent axis or measurement feature on a map or data array.",
    analogy: "Width, height, and depth in physical space; an embedding space simply adds more imaginary axes.",
    pythonAnalogy: "The length of an embedding list `len(vector)`—YuE2 uses thousands of dimensions per token.",
    firstChapter: 3,
    relatedChapters: [3]
  },
  "similarity": {
    id: "similarity",
    term: "Similarity (Distance)",
    definition: "A numeric measure of how closely related two embeddings are in their coordinate space.",
    analogy: "The straight-line mileage between two cities on a road map.",
    pythonAnalogy: "Computed via `math.dist(vec_a, vec_b)` or dot product sum `sum(a * b for a, b in zip(vec_a, vec_b))`.",
    firstChapter: 3,
    relatedChapters: [3, 4]
  },
  "transformer": {
    id: "transformer",
    term: "Transformer",
    definition: "A neural network architecture that processes sequences by comparing every item to every other item through attention.",
    analogy: "A roundtable committee where each participant listens to everyone else and updates their notes before speaking.",
    pythonAnalogy: "A pipeline of functions where each layer transforms an array of token vectors by cross-referencing all positions.",
    firstChapter: 4,
    relatedChapters: [4, 5, 12]
  },
  "attention": {
    id: "attention",
    term: "Attention Mechanism",
    definition: "The formula that calculates how much weight or focus one token should give to other tokens in the sequence.",
    analogy: "A highlighter pen that marks relevant earlier words when you are trying to understand what the word 'it' refers to.",
    pythonAnalogy: "A nested loop computing a relevance matrix `weights[i][j]` between every pair of tokens `i` and `j`.",
    firstChapter: 4,
    relatedChapters: [4, 12]
  },
  "query-key-value": {
    id: "query-key-value",
    term: "Query, Key, Value (QKV)",
    definition: "The three roles in attention: Query is what you're looking for, Key is the label on each item, and Value is the actual content.",
    analogy: "Searching a library: Query = your search term, Key = book spine titles, Value = the chapters inside the matching book.",
    pythonAnalogy: "Three separate projections `q = dot(x, W_q)`, `k = dot(x, W_k)`, `v = dot(x, W_v)`.",
    firstChapter: 4,
    relatedChapters: [4]
  },
  "softmax": {
    id: "softmax",
    term: "Softmax",
    definition: "A mathematical function that turns any list of arbitrary positive or negative numbers into clean percentages summing to 100%.",
    analogy: "Converting raw applause volume into percentage shares of a prize purse.",
    pythonAnalogy: "Exponentials divided by their sum: `exps = [math.exp(x) for x in scores]; total = sum(exps); probs = [e / total for e in exps]`.",
    firstChapter: 4,
    relatedChapters: [4, 5]
  },
  "layer": {
    id: "layer",
    term: "Layer",
    definition: "One processing tier in a deep neural network; stacking layers allows simple patterns to combine into complex understanding.",
    analogy: "An assembly line where station 1 shapes the wood, station 2 adds frets, and station 3 attaches strings.",
    pythonAnalogy: "Calling functions in a chain: `x = layer_3(layer_2(layer_1(x)))`.",
    firstChapter: 4,
    relatedChapters: [4, 6, 12]
  },
  "head": {
    id: "head",
    term: "Attention Head",
    definition: "One independent attention calculation running in parallel, looking for its own specific type of relationship (rhyme, rhythm, grammar).",
    analogy: "Three different critics reviewing the same song: one watches lyrics, one tracks drum beats, one listens for chord changes.",
    pythonAnalogy: "Running multiple parallel attention functions and concatenating their results: `[head(x) for head in heads]`.",
    firstChapter: 4,
    relatedChapters: [4, 12]
  },
  "causal-mask": {
    id: "causal-mask",
    term: "Causal Mask",
    definition: "A filter in attention that blocks tokens from seeing future tokens, forcing the model to generate strictly from past context.",
    analogy: "A book reader holding a card to cover upcoming lines so they cannot read ahead or cheat.",
    pythonAnalogy: "Setting attention weights to `-infinity` wherever `column_index > row_index` before softmax.",
    firstChapter: 4,
    relatedChapters: [4, 5, 12]
  },
  "context-window": {
    id: "context-window",
    term: "Context Window",
    definition: "The maximum number of tokens a model can hold in memory and reference at any one moment.",
    analogy: "The width of an open desk where you can only lay out a certain number of sheets of music at once.",
    pythonAnalogy: "The maximum length of the list of input tokens passed into `model.forward(tokens[:MAX_LEN])`.",
    firstChapter: 4,
    relatedChapters: [4, 8, 9]
  },
  "autoregressive": {
    id: "autoregressive",
    term: "Autoregressive (AR)",
    definition: "Generating a sequence by predicting one token at a time, appending it, and feeding the updated sequence back into the input.",
    analogy: "Your phone's autocomplete typing a message: suggest word -> tap word -> repeat.",
    pythonAnalogy: "A loop `while token != STOP: next_tok = predict(history); history.append(next_tok)`.",
    firstChapter: 5,
    relatedChapters: [5, 9, 10, 12]
  },
  "sampling": {
    id: "sampling",
    term: "Sampling",
    definition: "The process of picking one candidate token from the model's predicted probability distribution.",
    analogy: "Rolling weighted dice to make a choice instead of always robotically taking the single top option.",
    pythonAnalogy: "`chosen = random.choices(candidates, weights=probabilities)[0]`.",
    firstChapter: 5,
    relatedChapters: [5, 14]
  },
  "temperature": {
    id: "temperature",
    term: "Temperature",
    definition: "A slider that flattens (higher) or sharpens (lower) probabilities, controlling how adventurous or repetitive the generation is.",
    analogy: "How wildly a musician is willing to improvise: low temperature = stick to safe notes; high temperature = try spicy runs.",
    pythonAnalogy: "Dividing logits by temperature before softmax: `[score / temp for score in scores]`.",
    firstChapter: 5,
    relatedChapters: [5, 14]
  },
  "top-k": {
    id: "top-k",
    term: "Top-k Filtering",
    definition: "Discarding all choices except the top K most likely candidates before sampling.",
    analogy: "Only allowing the 5 best dishes on the restaurant menu to be considered, eliminating the bizarre ones.",
    pythonAnalogy: "`sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k]`.",
    firstChapter: 5,
    relatedChapters: [5]
  },
  "top-p": {
    id: "top-p",
    term: "Top-p (Nucleus) Sampling",
    definition: "Keeping only the smallest set of top choices whose cumulative probability adds up to percentage P (e.g., 90%).",
    analogy: "Adding the most popular ice cream flavors to your tasting plate until you've covered 90% of all customer orders.",
    pythonAnalogy: "Sorting choices descending and accumulating probabilities until `cumulative_prob >= p`.",
    firstChapter: 5,
    relatedChapters: [5]
  },
  "seed": {
    id: "seed",
    term: "Random Seed",
    definition: "An initial number that initializes a pseudo-random number generator, ensuring identical results when repeated.",
    analogy: "Setting the starting gear on a shuffle machine so the exact same card deck sequence is dealt every time.",
    pythonAnalogy: "`random.seed(1234)` or `torch.manual_seed(1234)`.",
    firstChapter: 5,
    relatedChapters: [5, 8, 14]
  },
  "stop-token": {
    id: "stop-token",
    term: "Stop Token (EOS)",
    definition: "A special marker token that signals to the autoregressive loop that generation is complete and the loop should end.",
    analogy: "The conductor raising both hands to signal the final held note and silence.",
    pythonAnalogy: "The break condition in a while loop: `if token == '<|endoftext|>': break`.",
    firstChapter: 5,
    relatedChapters: [5, 8]
  },
  "training": {
    id: "training",
    term: "Training",
    definition: "The automated process of adjusting a model's billions of parameters so its predictions get closer to real training data.",
    analogy: "Practicing scales with a metronome for months, adjusting your finger position whenever you play a flat note.",
    pythonAnalogy: "A loop over millions of songs: predict, compute loss, update parameters using an optimizer.",
    firstChapter: 6,
    relatedChapters: [6, 15]
  },
  "loss": {
    id: "loss",
    term: "Loss",
    definition: "A single number that measures how wrong the model's current prediction is compared to the true answer (0 is perfect).",
    analogy: "The distance your dart landed away from the bullseye.",
    pythonAnalogy: "A penalty score function, such as mean squared error `(predicted - actual) ** 2`.",
    firstChapter: 6,
    relatedChapters: [6]
  },
  "gradient": {
    id: "gradient",
    term: "Gradient",
    definition: "A mathematical indicator pointing in the direction of steepest increase in loss; walking the opposite way decreases error.",
    analogy: "Feeling the slope of the ground beneath your boots on a foggy hill to know which way is downhill.",
    pythonAnalogy: "The rate of change `d_loss / d_param` telling you whether increasing `w` raises or lowers loss.",
    firstChapter: 6,
    relatedChapters: [6]
  },
  "gradient-descent": {
    id: "gradient-descent",
    term: "Gradient Descent",
    definition: "The core algorithm that repeatedly takes small steps downhill along the gradient to find the minimum loss.",
    analogy: "Hikers descending a foggy mountain by always stepping in whichever direction the ground slopes down.",
    pythonAnalogy: "`param = param - learning_rate * gradient` repeated in a loop.",
    firstChapter: 6,
    relatedChapters: [6]
  },
  "learning-rate": {
    id: "learning-rate",
    term: "Learning Rate",
    definition: "A multiplier controlling how big of a step the model takes during each parameter update.",
    analogy: "The stride length of the hiker: too huge and you leap over the valley; too tiny and you never reach the bottom.",
    pythonAnalogy: "The step scale float `lr = 0.0001` in `weight -= lr * grad`.",
    firstChapter: 6,
    relatedChapters: [6]
  },
  "overfitting": {
    id: "overfitting",
    term: "Overfitting",
    definition: "When a model memorizes the exact training samples by heart instead of learning general patterns, failing on new inputs.",
    analogy: "A student memorizing exact question numbers from past practice tests rather than learning the actual math principles.",
    pythonAnalogy: "A hardcoded dictionary lookup that looks up exact training keys but throws `KeyError` on any new input.",
    firstChapter: 6,
    relatedChapters: [6]
  },
  "inference": {
    id: "inference",
    term: "Inference",
    definition: "Running a pre-trained model to generate new outputs with its weights locked, without any learning updates.",
    analogy: "Performing on stage on concert night without stopping to practice or rewrite the sheet music.",
    pythonAnalogy: "Calling `model.predict()` with `torch.no_grad()` enabled.",
    firstChapter: 6,
    relatedChapters: [0, 6, 13]
  },
  "sample-rate": {
    id: "sample-rate",
    term: "Sample Rate",
    definition: "The number of distinct audio pressure measurements captured or played per second.",
    analogy: "The frame rate of a film reel: 24 frames/sec looks like smooth motion; 48,000 samples/sec sounds like continuous crystal sound.",
    pythonAnalogy: "An integer constant `SAMPLE_RATE = 48000` defining how many floating-point numbers represent one second of sound.",
    firstChapter: 7,
    relatedChapters: [7, 11]
  },
  "khz": {
    id: "khz",
    term: "Kilohertz (kHz)",
    definition: "Thousands of cycles or audio samples per second (48 kHz means 48,000 samples each second).",
    analogy: "Kilometers per hour, but for sound measurements per second.",
    pythonAnalogy: "`48_000` samples per second.",
    firstChapter: 7,
    relatedChapters: [0, 7, 11]
  },
  "stereo": {
    id: "stereo",
    term: "Stereo Audio",
    definition: "Audio with two independent channels (left and right ear) providing spatial depth and width.",
    analogy: "Having two ears so you can tell whether the drummer's hi-hat is to your left or right.",
    pythonAnalogy: "A 2D array with shape `(2, total_samples)` or `list[tuple[float, float]]`.",
    firstChapter: 7,
    relatedChapters: [0, 7, 11]
  },
  "waveform": {
    id: "waveform",
    term: "Waveform",
    definition: "A visual or numerical plot showing air pressure oscillations over time that speaker cones turn into sound.",
    analogy: "The wavy groove carved into a vinyl record that causes the needle to vibrate.",
    pythonAnalogy: "A list of floating-point numbers between `-1.0` and `1.0` representing speaker displacements.",
    firstChapter: 7,
    relatedChapters: [7, 10, 11]
  },
  "compression": {
    id: "compression",
    term: "Compression (Audio)",
    definition: "Encoding complex data into a much smaller representation while keeping the essential perceptual information.",
    analogy: "Packing a tent tightly into a tiny stuff sack that can expand into a full shelter later.",
    pythonAnalogy: "Converting 17 million audio numbers into 3,000 latent codes.",
    firstChapter: 7,
    relatedChapters: [7, 10, 11]
  },
  "symbolic": {
    id: "symbolic",
    term: "Symbolic Music",
    definition: "Representing music as discrete semantic instructions (notes, pitches, chords, tempo) rather than raw sound waves.",
    analogy: "Sheet music or MIDI: it tells the musicians *what* notes to play, not the microsecond sound of the vibrating air.",
    pythonAnalogy: "Data structures with note names: `[{'pitch': 'C4', 'duration': 1.0, 'chord': 'Am'}]`.",
    firstChapter: 8,
    relatedChapters: [8, 14]
  },
  "abc-notation": {
    id: "abc-notation",
    term: "ABC Notation",
    definition: "A standard plain-text format for writing musical melodies, chords, keys, and rhythms using standard ASCII letters.",
    analogy: "Markdown, but for sheet music instead of bold text.",
    pythonAnalogy: "A multi-line text string starting with headers like `X:1\\nT:Song\\nK:C\\nC D E F|G2 G2|`.",
    firstChapter: 8,
    relatedChapters: [8, 14]
  },
  "chain-of-thought": {
    id: "chain-of-thought",
    term: "Chain of Thought (Planning)",
    definition: "A technique where an AI model generates an explicit plan or reasoning steps before producing the final result.",
    analogy: "An architect sketching a floor plan blueprint before directing construction crews to pour concrete.",
    pythonAnalogy: "Calling `plan = pipe.plan()` first, then passing `plan` into subsequent synthesis functions.",
    firstChapter: 8,
    relatedChapters: [8, 13]
  },
  "melody": {
    id: "melody",
    term: "Melody",
    definition: "A sequence of single musical notes perceived as a memorable, singable line.",
    analogy: "The vocal tune you hum in the shower.",
    pythonAnalogy: "A sequence of note pitches played one after another over time.",
    firstChapter: 8,
    relatedChapters: [8, 14]
  },
  "chord": {
    id: "chord",
    term: "Chord",
    definition: "A group of three or more musical notes played simultaneously to provide harmonic color and emotion.",
    analogy: "The background accompaniment strummed on a guitar while someone sings.",
    pythonAnalogy: "A list of notes played at the exact same timestamp: `['C4', 'E4', 'G4']`.",
    firstChapter: 8,
    relatedChapters: [8, 14]
  },
  "semantic-tokens": {
    id: "semantic-tokens",
    term: "Semantic Tokens",
    definition: "Low-framerate discrete tokens that capture high-level musical structure, rhythms, and vocal phonetics without instrument timbres.",
    analogy: "A pencil storyboard of a film: outlines the actors and action, but not the final lighting or camera grain.",
    pythonAnalogy: "A list of integers produced at ~25 to 50 tokens per second summarizing musical intent.",
    firstChapter: 9,
    relatedChapters: [9, 10, 12, 13]
  },
  "conditioning": {
    id: "conditioning",
    term: "Conditioning",
    definition: "Providing extra context (such as lyrics, style prompts, or plans) to guide what the model generates.",
    analogy: "Giving a chef specific dietary requirements and a cuisine style before they cook.",
    pythonAnalogy: "Passing arguments into a function: `synthesize(condition=lyrics_and_style)`.",
    firstChapter: 9,
    relatedChapters: [9, 10, 14]
  },
  "cfg": {
    id: "cfg",
    term: "Classifier-Free Guidance (CFG)",
    definition: "A steering technique that evaluates predictions with and without prompt guidance, boosting differences to amplify adherence.",
    analogy: "A tutor asking you 'What would you say with the prompt?' and 'What would you say randomly?', then telling you to double down on the prompt's unique flavor.",
    pythonAnalogy: "`final_pred = unconditional + cfg_scale * (conditional - unconditional)`.",
    firstChapter: 9,
    relatedChapters: [9, 14]
  },
  "acoustic-latents": {
    id: "acoustic-latents",
    term: "Acoustic Latents",
    definition: "Continuous, dense representations of audio containing all textural sound details, ready to be decoded into sound waves.",
    analogy: "A highly compressed digital audio file format that is unzipped by the decoder right before playback.",
    pythonAnalogy: "A multi-dimensional floating point tensor `latents` with shape `(batch, channels, time)`.",
    firstChapter: 10,
    relatedChapters: [10, 11, 13]
  },
  "latent-space": {
    id: "latent-space",
    term: "Latent Space",
    definition: "The mathematical coordinate space where compressed representations (latents) reside.",
    analogy: "The hidden recipe book where every dish is described by a minimal set of flavor ratios.",
    pythonAnalogy: "An internal continuous coordinate tensor before it gets mapped back to raw audio samples.",
    firstChapter: 10,
    relatedChapters: [10, 11]
  },
  "nar": {
    id: "nar",
    term: "Non-Autoregressive (NAR)",
    definition: "Generating all parts of an output simultaneously in parallel, rather than step-by-step from left to right.",
    analogy: "Developing an instant Polaroid photo: the entire image appears at once and becomes sharper over time.",
    pythonAnalogy: "A function that updates all array elements simultaneously in a vectorized matrix operation.",
    firstChapter: 10,
    relatedChapters: [10, 12]
  },
  "flow-matching": {
    id: "flow-matching",
    term: "Flow Matching",
    definition: "A modern generative technique that learns a straight trajectory to smoothly transform pure random noise into structured audio latents.",
    analogy: "Starting with a block of rough marble and applying small chipping strokes to reveal a detailed statue.",
    pythonAnalogy: "A loop `for t in range(steps): latents += velocity_model(latents, t, condition) * dt`.",
    firstChapter: 10,
    relatedChapters: [10, 12, 13]
  },
  "diffusion": {
    id: "diffusion",
    term: "Diffusion Models",
    definition: "A closely related family of generative models that remove noise step-by-step; flow matching is a faster, straighter formulation.",
    analogy: "Clearing fog off a mirror by taking small wipes until the reflection is crisp.",
    pythonAnalogy: "Iteratively subtracting predicted noise from a tensor across a series of timesteps.",
    firstChapter: 10,
    relatedChapters: [10]
  },
  "noise": {
    id: "noise",
    term: "Gaussian Noise",
    definition: "Completely unstructured random numbers sampled from a normal bell-curve distribution.",
    analogy: "The static hiss you hear when an old radio is tuned between stations.",
    pythonAnalogy: "`[random.gauss(0, 1) for _ in range(N)]`.",
    firstChapter: 10,
    relatedChapters: [10]
  },
  "autoencoder": {
    id: "autoencoder",
    term: "Autoencoder",
    definition: "A dual-network system consisting of an encoder (compresses input to a small code) and a decoder (reconstructs input from that code).",
    analogy: "A document scanner that compresses a paper into a tight PDF and a printer that reproduces it on paper.",
    pythonAnalogy: "Two paired functions: `latent = encode(audio)` and `audio = decode(latent)`.",
    firstChapter: 11,
    relatedChapters: [11]
  },
  "encoder": {
    id: "encoder",
    term: "Encoder",
    definition: "The component of an autoencoder that compresses high-dimensional raw audio into compact latent codes.",
    analogy: "A packing specialist who folds a giant tent into a small backpack pouch.",
    pythonAnalogy: "A neural net `encoder(raw_audio) -> latents`.",
    firstChapter: 11,
    relatedChapters: [11]
  },
  "decoder": {
    id: "decoder",
    term: "Decoder",
    definition: "The component that expands compact latent codes back into full-fidelity 48 kHz stereo audio waves.",
    analogy: "A film projector taking a compact transparent 35mm film frame and projecting a huge wall-sized picture.",
    pythonAnalogy: "A neural net `pipe.decode(latents) -> audio_waveform`.",
    firstChapter: 11,
    relatedChapters: [11, 13]
  },
  "vae": {
    id: "vae",
    term: "Variational Autoencoder (VAE)",
    definition: "An autoencoder whose latent space is regularized into a smooth continuous distribution, allowing clean interpolation and generation.",
    analogy: "A smart compression system where any random coordinate in the packing suitcase still unpacks into a realistic song.",
    pythonAnalogy: "A neural decoder network trained to turn latent tensors into audio waves without artifacts.",
    firstChapter: 11,
    relatedChapters: [11, 13]
  },
  "backbone": {
    id: "backbone",
    term: "Backbone",
    definition: "The central foundational neural network architecture that handles the core representations across tasks.",
    analogy: "The central steel frame and engine of a vehicle that can be fitted with different wheels or cabins.",
    pythonAnalogy: "The primary transformer model instance that powers both autoregressive planning and synthesis.",
    firstChapter: 12,
    relatedChapters: [12]
  },
  "mixture-of-transformers": {
    id: "mixture-of-transformers",
    term: "Mixture-of-Transformers (MoT)",
    definition: "An architecture unifying sequential (AR) and parallel (NAR) transformer paths within a single shared model structure.",
    analogy: "An office where sequential composers and parallel sound designers share the same central reference library.",
    pythonAnalogy: "A transformer class configured to route tokens through AR attention heads for text/tokens and NAR heads for latents.",
    firstChapter: 12,
    relatedChapters: [12]
  },
  "benchmark": {
    id: "benchmark",
    term: "Benchmark",
    definition: "A standardized test suite used to evaluate and compare different AI models on identical tasks.",
    analogy: "A standardized musical jury audition where every candidate must perform the exact same repertoire.",
    pythonAnalogy: "A suite of automated evaluation tests calculating quality scores across a test dataset.",
    firstChapter: 15,
    relatedChapters: [11, 15]
  },
  "phoneme-error-rate": {
    id: "phoneme-error-rate",
    term: "Phoneme Error Rate",
    definition: "A metric measuring the percentage of vocal sound units (phonemes) in generated singing that don't match the lyrics prompt.",
    analogy: "A choir judge counting how many syllables the singer slurred or mispronounced.",
    pythonAnalogy: "The Levenshtein edit distance between intended phonemes and transcribed phonemes divided by total phonemes.",
    firstChapter: 15,
    relatedChapters: [15]
  },
  "quantization": {
    id: "quantization",
    term: "Quantization",
    definition: "Converting model numbers from high-precision floats (e.g. 32-bit or 16-bit) to smaller integer formats (8-bit or 4-bit) to save memory.",
    analogy: "Rounding dollar cents to the nearest dime: saves space in a notebook with minimal loss of overall budget accuracy.",
    pythonAnalogy: "Casting float tensors to `int8` representations with scale factors.",
    firstChapter: 15,
    relatedChapters: [13, 15]
  },
  "vram": {
    id: "vram",
    term: "Video RAM (VRAM)",
    definition: "Ultra-fast dedicated memory on a graphics processing unit (GPU) required to hold neural model weights and activations.",
    analogy: "The working surface of a professional chef's prep table—faster to access than a pantry down the hall.",
    pythonAnalogy: "Memory allocated on `device='cuda'`, measured in gigabytes (YuE2 needs ~11 GiB peak during generation).",
    firstChapter: 13,
    relatedChapters: [13, 15]
  },
  "bf16": {
    id: "bf16",
    term: "Bfloat16 (BF16)",
    definition: "A 16-bit brain floating-point format that keeps the dynamic range of 32-bit floats while cutting memory consumption in half.",
    analogy: "A compact travel notebook format that records the same wide numerical range using fewer decimal spaces.",
    pythonAnalogy: "`torch.bfloat16` data type used by YuE2's 7.3 GB weights file.",
    firstChapter: 13,
    relatedChapters: [13]
  },
  "safetensors": {
    id: "safetensors",
    term: "SafeTensors",
    definition: "A modern, secure file format for storing deep learning model weights that prevents arbitrary code execution vulnerabilities.",
    analogy: "A tamper-evident, sealed storage box that only contains numbers, avoiding risks found in legacy Python pickle files.",
    pythonAnalogy: "Using `safetensors.torch.load_file('model.safetensors')` instead of unsafe `pickle.load()`.",
    firstChapter: 13,
    relatedChapters: [13]
  },
  "cc-by-nc-40": {
    id: "cc-by-nc-40",
    term: "CC BY-NC 4.0 License",
    definition: "Creative Commons Attribution-NonCommercial 4.0 International license: allows free sharing and modification for non-commercial purposes with credit.",
    analogy: "A community library book you are welcome to study, share, and build on, but you cannot sell it for commercial profit.",
    pythonAnalogy: "A legal header governing model usage: commercial deployment requires separate licensing from M-A-P.",
    firstChapter: 0,
    relatedChapters: [0, 15]
  }
};
