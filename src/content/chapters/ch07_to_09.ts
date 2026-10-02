import { Chapter } from "../types";

export const ch07_harder: Chapter = {
  id: 7,
  slug: "why-music-is-harder-than-text",
  title: "Why Music Is Harder Than Text",
  subtitle: "The 17-million number explosion",
  pipelineStage: "foundations",
  estMinutes: 7,
  hook: "A standard ChatGPT response contains a few hundred tokens. A 3-minute song contains over 17 million numbers. Why is audio so much harder?",
  analogy: {
    title: "Building an Architectural Skyscraper",
    body: "If you want to construct a 50-story skyscraper, you do not start by laying individual bricks one by one with no plan. If you did, after ten floors the building would twist, lean, and collapse under its own weight. Instead, the architect first drafts a master blueprint. Next, civil engineers map the structural steel frame. Then concrete teams build the floors. Finally, interior designers install carpets and glass. YuE2 builds music using the exact same multi-level hierarchy.",
    breaksDown: "Physical skyscrapers are constrained by concrete stress and gravity. Digital audio is constrained by GPU memory (VRAM), computational attention complexity, and mathematical precision."
  },
  concept: [
    {
      heading: "The Number Explosion",
      content: "Let's do the math that every audio engineer knows:\n- Sample rate: 48,000 samples per second (48 kHz) captures high frequencies up to 24 kHz.\n- Stereo: 2 independent channels (Left and Right ear).\n- 1 second = 48,000 * 2 = 96,000 floating-point numbers.\n- A standard 3-minute song (180 seconds) = 180 * 96,000 = 17,280,000 numbers!",
      eli5Content: "Just one second of crisp stereo music needs 96,000 numbers! A 3-minute song is over 17 million numbers—far too many for a computer to predict one-by-one."
    },
    {
      heading: "Why Transformers Choke on Raw Audio",
      content: "Transformers compare every token to every other token. A context window of 2,000 text tokens is easy; a context window of 17,000,000 raw audio samples would require a memory matrix with trillions of cells, which would immediately crash any computer. Furthermore, audio samples spaced 1/48,000th of a second apart carry almost zero musical meaning on their own.",
      eli5Content: "If the AI tried to predict every single tiny vibration of a speaker cone one by one, its brain would run out of memory in less than two seconds."
    },
    {
      heading: "The Solution: Multi-Level Compression",
      content: "YuE2 solves this by decomposing the song across multiple levels of abstraction:\n1. Symbolic Score: ~500 ABC text tokens describing notes and chords.\n2. Semantic Tokens: ~4,000 tokens describing vocal phrasing and rhythm (~25-50 tokens/sec).\n3. Acoustic Latents: Compressed continuous audio frames (~50 frames/sec).\n4. Raw Waveform: Expanded by a VAE decoder into 17.28 million samples at the very last moment.",
      eli5Content: "The trick is to start with a tiny cheat sheet (the sheet music), then a rough voice sketch, and only turn on the giant 17-million number machine at the very end!"
    }
  ],
  inYuE2: {
    summary: "YuE2 outputs 48 kHz stereo audio, converting ~17 million output values from compact intermediate representations via its 4-stage pipeline.",
    factIds: ["audio_output", "two_stages_audio", "pipeline_methods"]
  },
  pythonCorner: [
    {
      title: "Audio Data Size Calculator in Pure Python",
      language: "python",
      type: "runnable",
      description: "A runnable calculation proving the exact number of data points in text vs audio.",
      code: `# Comparing text representations to 48 kHz stereo audio
tweet_words = 30
tweet_tokens = int(tweet_words * 1.3)  # ~39 tokens

book_page_words = 350
book_page_tokens = int(book_page_words * 1.3)  # ~455 tokens

song_duration_sec = 216  # 3.6 minutes (the YuE2 benchmark duration)
sample_rate = 48000      # 48 kHz
channels = 2             # Stereo (Left + Right)

total_audio_samples = song_duration_sec * sample_rate * channels
audio_mb_float32 = (total_audio_samples * 4) / (1024 * 1024)

print(f"Tweet tokens:          {tweet_tokens:,}")
print(f"Book page tokens:      {book_page_tokens:,}")
print(f"3.6-min song samples:  {total_audio_samples:,} numbers!")
print(f"Raw 32-bit PCM size:   {audio_mb_float32:.1f} MB (uncompressed)")`
    }
  ],
  newTerms: [
    "sample-rate",
    "khz",
    "stereo",
    "waveform",
    "compression"
  ],
  recap: [
    "One second of 48 kHz stereo audio requires 96,000 numbers; a 3.6-minute song requires over 20 million numbers.",
    "Predicting raw audio samples directly with a transformer is computationally impossible.",
    "Individual audio samples lack high-level musical context like chords or vocal syllables.",
    "YuE2 solves this by working at multiple levels of compression: sheet music -> semantic tokens -> acoustic latents -> waveform."
  ],
  quiz: [
    {
      id: "q7_1",
      question: "How many floating-point numbers are needed to represent 1 second of 48 kHz stereo audio?",
      options: [
        "48 numbers",
        "4,800 numbers",
        "96,000 numbers (48,000 samples x 2 channels)",
        "17 million numbers"
      ],
      correctIndex: 2,
      explanation: "Stereo audio has 2 channels, each taking 48,000 samples per second, totaling 48,000 * 2 = 96,000 numbers every single second."
    },
    {
      id: "q7_2",
      question: "Why can't an AI model easily generate raw audio samples one-by-one with standard attention?",
      options: [
        "Because attention memory cost scales quadratically with sequence length, causing memory exhaustion on millions of samples",
        "Because sound waves are illegal to store in computer memory",
        "Because Python does not support floating-point numbers",
        "Because the GPU can only render pictures, not sound"
      ],
      correctIndex: 0,
      explanation: "Standard transformer attention on 17+ million individual steps would require astronomical memory and compute."
    },
    {
      id: "q7_3",
      question: "How does YuE2 solve the data explosion problem of audio?",
      options: [
        "It limits all generated songs to a maximum duration of 1 second",
        "It lowers the quality to 8-bit mono telephone sound",
        "It generates in stages of increasing detail, keeping the sequence lengths short until the final VAE decoding stage",
        "It asks the user to hum the melody into a microphone"
      ],
      correctIndex: 2,
      explanation: "By structuring generation into symbolic planning, semantic tokens, and acoustic latents, each stage handles a manageable sequence length."
    }
  ]
};

export const ch08_stage1_plan: Chapter = {
  id: 8,
  slug: "stage-1-symbolic-planning-sheet-music",
  title: "Stage 1: Plan Before You Play",
  subtitle: "Symbolic planning and sheet music in ABC notation",
  pipelineStage: "plan",
  estMinutes: 8,
  hook: "Why does an AI model that makes audio start by writing text sheet music?",
  analogy: {
    title: "The Composer's Lead Sheet",
    body: "Before a studio band steps up to their instruments, the bandleader passes around a lead sheet: one piece of paper showing the key (e.g. Key of C), the time signature (4/4), the chord names (Am, F, C, G), and the main vocal melody notes. The musicians don't have to guess what's coming next—the structure is already locked in.",
    breaksDown: "A human lead sheet leaves wide room for human interpretation, expressive timing, and improvised solos. In YuE2, the generated ABC text is directly converted into token IDs that condition the subsequent neural synthesis stages."
  },
  concept: [
    {
      heading: "Chain-of-Thought for Music",
      content: "In large language models, 'chain-of-thought' means thinking step-by-step before answering. In YuE2, writing an ABC notation score before generating audio is music's chain-of-thought. It separates the cognitive challenge of musical composition (harmony, melody, song structure) from the mechanical challenge of acoustic sound production.",
      eli5Content: "Writing the sheet music first is like thinking before you speak! The AI decides the tune and chords on paper before trying to make any noise."
    },
    {
      heading: "What Is ABC Notation?",
      content: "ABC notation is a simple, standardized plain-text format for writing music. Header fields specify title (`T:`), meter (`M:4/4`), tempo (`Q:120`), and key (`K:C`). Notes are represented as letters (C, D, E, F, G, A, B), numbers set durations (`C2` is twice as long as `C`), and chord names are placed in quotation marks (`\"Am\"C D \"G\"E G`). Because it is standard text, language models can learn to write it effortlessly!",
      eli5Content: "ABC notation writes musical notes using regular keyboard letters! 'C D E' means play notes Do, Re, Mi."
    },
    {
      heading: "The Three Planning Modes (`cot=`)",
      content: "YuE2 gives you explicit control over this stage via the `cot` argument in Python:\n- `cot='full'`: Generates both the vocal melody and harmonic chord progressions (default for new original songs).\n- `cot='melody'`: Generates only the melody, allowing style/genre to freely harmonize (recommended for cover songs!).\n- `cot='off'`: Skips symbolic planning entirely and generates audio directly (faster, but scores lower on musicality).",
      eli5Content: "You can tell the AI to write the full plan with chords (`full`), just the tune (`melody`), or skip planning altogether (`off`)."
    }
  ],
  inYuE2: {
    summary: "YuE2 generates ABC notation during its pipe.plan() call. The paper (arXiv:2609.33757) proves that symbolic planning significantly increases musicality benchmarks and expert ratings.",
    factIds: ["symbolic_planning", "planning_modes", "pipeline_methods"]
  },
  pythonCorner: [
    {
      title: "Inspecting and Saving the Plan in Python",
      language: "python",
      type: "needs-gpu",
      description: "Using the real YuE2 Python API to generate and inspect the intermediate symbolic ABC score.",
      code: `# Requires: Linux, 24GB NVIDIA GPU, pip install yue2_infer-0.1.5
from yue2 import YuE2Pipeline

pipe = YuE2Pipeline.from_pretrained("m-a-p/YuE2-3B", device="cuda")

style = "Indie pop, warm female vocal, acoustic guitar, soft drums"
lyrics = """Sunlight through the kitchen glass,
Watch the quiet morning pass."""

# Stage 1: Generate symbolic plan only
plan = pipe.plan(style=style, lyrics=lyrics, cot="full", seed=1234)

# Print the generated ABC text score
print("Generated ABC Sheet Music:")
print(plan.abc_text)

# Save the artifact to disk for inspection or manual edits
plan.save("plan_morning_light.json")`
    }
  ],
  newTerms: [
    "symbolic",
    "abc-notation",
    "chain-of-thought",
    "melody",
    "chord"
  ],
  recap: [
    "YuE2 begins generation by writing a symbolic musical plan in ABC notation text.",
    "Symbolic planning decouples high-level composition from raw acoustic rendering.",
    "ABC notation represents musical notes, keys, meters, and chords in plain ASCII text.",
    "Planning modes include 'full' (melody + chords), 'melody' (melody only, ideal for covers), and 'off' (skip planning).",
    "Users can inspect, edit, or provide custom ABC scores to steer the song."
  ],
  quiz: [
    {
      id: "q8_1",
      question: "Why does YuE2 use ABC notation for its symbolic planning stage?",
      options: [
        "Because ABC notation is a binary file format that only GPUs can read",
        "Because ABC notation represents notes and chords in plain ASCII text, which transformer language models can generate naturally",
        "Because it is the only music format recognized by the United Nations",
        "Because ABC notation automatically plays audio through computer speakers without a decoder"
      ],
      correctIndex: 1,
      explanation: "ABC notation uses plain characters (letters, numbers, quotes), allowing the model's text tokenizer and transformer to compose music just like natural language."
    },
    {
      id: "q8_2",
      question: "Which planning mode is recommended in YuE2 for creating cover songs of existing melodies?",
      options: [
        "cot='off'",
        "cot='full'",
        "cot='melody'",
        "cot='random'"
      ],
      correctIndex: 2,
      explanation: "In `cot='melody'` mode, the vocal melody is fixed while the harmonic chord progressions and instrumental style are left open to adapt to the new genre."
    },
    {
      id: "q8_3",
      question: "According to the YuE2 technical report, what is the primary benefit of symbolic planning?",
      options: [
        "It eliminates the need for an NVIDIA GPU",
        "It significantly improves the overall musicality, harmonic structure, and coherence of the generated songs",
        "It shortens the lyrics automatically",
        "It doubles the file size of the MP3"
      ],
      correctIndex: 1,
      explanation: "Expert evaluations and benchmark tests in the paper confirmed that symbolic planning leads to much higher musicality and structural coherence."
    }
  ]
};

export const ch09_stage2_semantic: Chapter = {
  id: 9,
  slug: "stage-2-the-rough-draft-semantic-tokens",
  title: "Stage 2: The Rough Draft",
  subtitle: "Semantic tokens and classifier-free guidance",
  pipelineStage: "semantic",
  estMinutes: 7,
  hook: "How does the model bridge the gap between static sheet music letters and living audio?",
  analogy: {
    title: "The Film Storyboard Sketch",
    body: "Before filming a movie with 4K cameras, movie directors draw a storyboard: quick pencil sketches showing where the actors stand, when they move, and what expressions they have. It has no lighting, no makeup, and no color grading. It is a rough draft that maps out what happens when. Semantic tokens are the musical storyboard.",
    breaksDown: "A storyboard is drawn on paper by a human hand. Semantic tokens are discrete integer IDs predicted autoregressively at roughly 25 to 50 tokens per second."
  },
  concept: [
    {
      heading: "What Are Semantic Tokens?",
      content: "Semantic tokens represent the high-level musical content: which vocal phoneme is being pronounced right now, the pitch inflection of the singer's vibrato, and the rhythmic pulse of the instruments. They deliberately discard the fine acoustic details (like room reverb, stereo pan, and audio frequencies above 8 kHz).",
      eli5Content: "Semantic tokens are a quick voice sketch: they say 'sing the word SUN right here with a rising note', but don't worry yet about the exact sparkle of the microphone."
    },
    {
      heading: "Autoregressive Generation from the Plan",
      content: "In this stage, the autoregressive transformer generates semantic tokens sequentially, conditioned on:\n1. The user's style prompt.\n2. The input lyrics.\n3. The ABC sheet music plan from Stage 1.\nBecause it runs autoregressively, each token knows exactly what came before, ensuring the vocal flow aligns rhythmically with the lyrics.",
      eli5Content: "The AI reads the sheet music plan and lyrics, then writes the voice sketch token-by-token from the beginning of the song to the end."
    },
    {
      heading: "Classifier-Free Guidance (CFG)",
      content: "When generating, how closely should the model stick to your prompt? Classifier-Free Guidance (CFG) runs two predictions at each step: one with your prompt, and one without it (unconditional). It then nudges the prediction away from the unconditional answer by a scale factor (`cfg_scale`). The model card defaults CFG to 1.0 for planned modes, and 1.01 for unguided mode.",
      eli5Content: "CFG asks: 'What would a generic song sound like, and what makes YOUR requested song special?' Then it pushes harder on what makes yours special!"
    }
  ],
  inYuE2: {
    summary: "pipe.generate_semantic(plan) produces semantic audio tokens supervised with MERT2 representations, aligning vocal timing and musical arrangement.",
    factIds: ["two_stages_audio", "guidance_cfg", "supervision_models", "pipeline_methods"]
  },
  pythonCorner: [
    {
      title: "Generating Semantic Tokens in Python",
      language: "python",
      type: "needs-gpu",
      description: "Calling pipe.generate_semantic() with explicit Classifier-Free Guidance parameters.",
      code: `# Requires: Linux, 24GB NVIDIA GPU, pip install yue2_infer-0.1.5
from yue2 import YuE2Pipeline

pipe = YuE2Pipeline.from_pretrained("m-a-p/YuE2-3B", device="cuda")

# Stage 2: Turn the symbolic plan into semantic audio tokens
# semantic_cfg_scale defaults to 1.0 for cot="full"
semantic_tokens = pipe.generate_semantic(
    plan,
    cfg_scale=1.0,
    temperature=0.9,
    seed=1234
)

print(f"Generated {len(semantic_tokens)} semantic tokens.")
# Inspect the first 10 discrete integer IDs
print("Sample tokens:", semantic_tokens[:10])`
    }
  ],
  newTerms: [
    "semantic-tokens",
    "conditioning",
    "cfg"
  ],
  recap: [
    "Semantic tokens are discrete integer IDs representing musical rhythm, vocal phonetics, and phrasing at a low token rate.",
    "They act as a rough draft bridging the text plan and raw sound waves.",
    "Stage 2 generates these tokens autoregressively, conditioned on the ABC plan, lyrics, and style.",
    "Classifier-Free Guidance (CFG) pushes the generation to adhere more strongly to the prompt."
  ],
  quiz: [
    {
      id: "q9_1",
      question: "What information is captured by semantic tokens?",
      options: [
        "The exact 48 kHz stereo air pressure waveform",
        "Vocal phrasing, phoneme timing, and musical structure, without fine acoustic sound textures",
        "The credit card details of the user",
        "The manufacturer of the headphones"
      ],
      correctIndex: 1,
      explanation: "Semantic tokens capture the high-level musical content (melody contour, lyrics timing, arrangement) rather than microsecond acoustic timbres."
    },
    {
      id: "q9_2",
      question: "How does Classifier-Free Guidance (CFG) adjust model predictions?",
      options: [
        "It translates the lyrics into another language",
        "It compares predictions with and without the prompt, boosting the features that match the prompt",
        "It reduces the volume of the bass frequencies",
        "It forces the model to generate in mono"
      ],
      correctIndex: 1,
      explanation: "CFG calculates both conditional and unconditional predictions, magnifying the difference so the model follows the prompt more decisively."
    },
    {
      id: "q9_3",
      question: "What is the default semantic CFG scale in YuE2 for 'full' and 'melody' planning modes?",
      options: [
        "10.5",
        "1.0",
        "0.0",
        "99.0"
      ],
      correctIndex: 1,
      explanation: "As documented in the official model card, semantic CFG defaults to 1.0 when planning is enabled."
    }
  ]
};
