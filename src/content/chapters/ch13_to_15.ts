import { Chapter } from "../types";

export const ch13_walkthrough: Chapter = {
  id: 13,
  slug: "full-journey-guided-walkthrough",
  title: "The Full Journey",
  subtitle: "Tracing our song through every stage of the pipeline",
  pipelineStage: "wrapup",
  estMinutes: 8,
  hook: "What does the model's memory look like at each microsecond of our indie pop song generation?",
  analogy: {
    title: "The Automobile Factory Line",
    body: "Follow a car along a factory assembly line. Station 1 punches the chassis blueprint from metal coils. Station 2 installs the drivetrain and steering column so it can move. Station 3 molds the body panels and aerodynamic curves. Station 4 applies the high-gloss enamel paint and polishes the headlights. At each station, the car gains resolution and fidelity.",
    breaksDown: "Car factories take hours and move physical tons of steel along conveyor belts. YuE2 processes numbers at gigabytes per second through GPU tensor cores in roughly one minute."
  },
  concept: [
    {
      heading: "Our Running Example",
      content: "Let's trace our original request all the way through:\n- Style: 'Indie pop, warm female vocal, acoustic guitar, soft drums'\n- Lyrics: 'Sunlight through the kitchen glass, / Watch the quiet morning pass.'\n- Seed: 1234\n- Plan mode: cot='full'",
      eli5Content: "Let's watch our two-line morning poem turn into a real recorded song step by step!"
    },
    {
      heading: "Line-by-Line Code Annotation",
      content: "Here is the exact Python invocation and what happens behind the scenes:\n1. `pipe = YuE2Pipeline.from_pretrained('m-a-p/YuE2-3B', device='cuda')`: Loads 7.3 GB of BF16 parameters from model.safetensors into GPU VRAM.\n2. `song = pipe(style=style, lyrics=lyrics, cot='full', seed=1234)`: Executes all 4 pipeline stages sequentially.\n3. `song.save('song.flac')`: Exports 48 kHz 24-bit stereo sound.\n4. `song.save_artifacts('outputs/')`: Saves the ABC score, token arrays, and metadata for inspection.",
      eli5Content: "With just four lines of Python, the computer loads the dials, runs all four stages, and saves the song to your hard drive."
    },
    {
      heading: "What Your GPU Is Doing (Hardware Telemetry)",
      content: "When tested on an NVIDIA RTX 4090:\n- Weights memory: ~7.3 GB loaded from safetensors in BF16 precision.\n- Peak VRAM during generation: ~11 GiB (leaving room for context activations).\n- Generation time: ~71 seconds for a full 3.6-minute stereo song (faster than real-time playback!).\n- Hardware requirements: Linux, Python 3.10+, and an NVIDIA GPU with at least 24 GB of VRAM.",
      eli5Content: "An RTX 4090 GPU finishes a 3.6-minute song in about 71 seconds, using around 11 GB of graphics card memory."
    }
  ],
  inYuE2: {
    summary: "The official YuE2 benchmark demonstrates a 3.6-minute song generated in ~71 seconds on an RTX 4090, peaking at ~11 GiB VRAM.",
    factIds: ["benchmark_speed", "hardware_specs", "weights_format", "reproducibility"]
  },
  pythonCorner: [
    {
      title: "The Complete YuE2 Python Script with Artifact Export",
      language: "python",
      type: "needs-gpu",
      description: "Full runnable production snippet demonstrating pipeline options, seed setting, and artifact saving.",
      code: `# Requires: Linux, 24GB NVIDIA GPU, pip install yue2_infer-0.1.5
from yue2 import YuE2Pipeline

# 1. Load pipeline onto NVIDIA CUDA GPU
# Uses BF16 precision by default (~7.3 GB weights)
pipe = YuE2Pipeline.from_pretrained("m-a-p/YuE2-3B", device="cuda")

# 2. Define inputs
style = "Indie pop, warm female vocal, acoustic guitar, soft drums"
lyrics = """Sunlight through the kitchen glass,
Watch the quiet morning pass."""

# 3. Generate with full symbolic planning and reproducible seed
song = pipe(
    style=style,
    lyrics=lyrics,
    cot="full",
    seed=1234
)

# 4. Save 48 kHz stereo audio
song.save("morning_light.flac")

# 5. Save all intermediate artifacts: ABC score, semantic tokens, latents
song.save_artifacts("outputs/morning_light")
print("Saved song and intermediate artifacts to outputs/morning_light")`
    }
  ],
  newTerms: [
    "vram",
    "bf16",
    "safetensors"
  ],
  recap: [
    "The 4 stages flow seamlessly: Text Prompt -> ABC Plan -> Semantic Tokens -> Acoustic Latents -> 48 kHz Stereo Audio.",
    "pipe.save_artifacts() preserves all intermediate stages for debugging, editing, or analysis.",
    "On an RTX 4090, generation takes ~71 seconds for 3.6 minutes of audio, peaking at ~11 GiB VRAM.",
    "BF16 precision keeps memory manageable while preserving numerical stability."
  ],
  quiz: [
    {
      id: "q13_1",
      question: "According to the official benchmarks on an NVIDIA RTX 4090, how fast does YuE2-3B generate a 3.6-minute song?",
      options: [
        "In 5 hours",
        "In approximately 71 seconds (around 3x faster than real-time playback)",
        "In 0.001 seconds",
        "In 12 minutes"
      ],
      correctIndex: 1,
      explanation: "As documented by M-A-P, an RTX 4090 produces a full 3.6-minute song in roughly 71 seconds."
    },
    {
      id: "q13_2",
      question: "What does the Bfloat16 (BF16) format achieve compared to traditional 32-bit floats?",
      options: [
        "It cuts memory usage in half while maintaining the wide dynamic numerical range of 32-bit floats",
        "It eliminates all need for a GPU",
        "It converts text into MP3 files automatically",
        "It makes songs twice as loud"
      ],
      correctIndex: 0,
      explanation: "BF16 uses 16 bits per number instead of 32, halving RAM/VRAM storage with negligible impact on model precision."
    },
    {
      id: "q13_3",
      question: "What does the function `song.save_artifacts()` do?",
      options: [
        "Uploads the song to Spotify",
        "Saves the intermediate ABC score, tokens, latents, and generation settings to disk",
        "Deletes the weights from the GPU",
        "Transcribes the song into French"
      ],
      correctIndex: 1,
      explanation: "Saving artifacts writes out the intermediate representations from each stage of the pipeline."
    }
  ]
};

export const ch14_steering: Chapter = {
  id: 14,
  slug: "steering-the-model-style-seeds-covers",
  title: "Steering the Model",
  subtitle: "Style prompts, seeds, cover songs, and agentic editing",
  pipelineStage: "wrapup",
  estMinutes: 8,
  hook: "Can you change an indie folk ballad into a roaring heavy metal song without rewriting the melody?",
  analogy: {
    title: "The Theater Play Director",
    body: "Imagine directing Shakespeare's Romeo and Juliet. You keep Shakespeare's original spoken lines and dramatic beats intact (the melody and lyrics), but you instruct the costume team to dress everyone in cyberpunk leather jackets, swap acoustic violins for distorted electric guitars, and speed up the tempo. That is how YuE2 performs style steering and cover generation.",
    breaksDown: "A theater cast interprets cues through human imagination. YuE2 changes its output because the new style tokens alter attention weight vectors across the entire model."
  },
  concept: [
    {
      heading: "1. Style Prompts: Guiding the Mood",
      content: "The style string is not just metadata; it is tokenized and placed directly into the model's context window. Descriptors like 'lo-fi hip-hop', 'warm analog synthesizer', or 'female vocal, reverb' bias the model's probability distribution toward specific drum patterns, instrumentation, and vocal inflections.",
      eli5Content: "Your style prompt is like whispering to the band: 'Play this with acoustic guitar and a soft, gentle voice!'"
    },
    {
      heading: "2. Cover Songs with SheetSage2 and `cot='melody'`",
      content: "To generate a cover song:\n1. Transcribe an existing recording into ABC notation using SheetSage2.\n2. Keep the vocal melody notes, but discard the original chords.\n3. Run YuE2 with `cot='melody'` and a brand new style prompt (e.g. 'heavy metal' or 'jazz funk').\nThe model keeps the recognizable vocal melody while inventing brand new instrumentation, drums, and harmonic chords!",
      eli5Content: "You keep the familiar singing tune from a song you know, but tell the band to play it as heavy metal or funk!"
    },
    {
      heading: "3. Agentic Music Editing",
      content: "Because YuE2 writes readable ABC text scores, an external LLM (like Gemini or Claude) can act as an intelligent music editor. A user can say: 'Make the chorus feel more melancholic and shift to D minor'. The LLM modifies the ABC notation score, and YuE2 re-renders the audio through its synthesis pipeline.",
      eli5Content: "You can ask an AI assistant to change chords or transpose the key on the sheet music, and YuE2 immediately plays the updated version!"
    }
  ],
  inYuE2: {
    summary: "YuE2 supports zero-shot cover song generation and agentic music editing via its companion models SheetSage2 and MERT2.",
    factIds: ["supervision_models", "planning_modes", "symbolic_planning"]
  },
  pythonCorner: [
    {
      title: "Cover Song Generation in Python",
      language: "python",
      type: "needs-gpu",
      description: "Providing a pre-transcribed melody and letting YuE2 harmonize it in an entirely different style.",
      code: `# Requires: Linux, 24GB NVIDIA GPU, pip install yue2_infer-0.1.5
from yue2 import YuE2Pipeline

pipe = YuE2Pipeline.from_pretrained("m-a-p/YuE2-3B", device="cuda")

# Traditional melody transcribed by SheetSage2 into ABC notation
traditional_melody_abc = """X:1
T:Auld Lang Syne
M:4/4
L:1/4
K:F
C | F>F A F | G>F G A | F>F A c | d3 d |
c>A A F | G>F G A | F>D D C | F3 ||"""

# Provide a completely different genre style prompt
style = "70s Jazz Funk, slap bass, electric piano, brass section, groovy drums"
lyrics = "Should auld acquaintance be forgot, and never brought to mind?"

# Use cot="melody" to freeze the melody while harmonizing in the new style
cover_song = pipe(
    style=style,
    lyrics=lyrics,
    melody=traditional_melody_abc,
    cot="melody",
    seed=999
)
cover_song.save("auld_lang_syne_funk.flac")`
    }
  ],
  newTerms: [
    "symbolic",
    "melody",
    "chord"
  ],
  recap: [
    "Style prompts provide conditioning tokens that bias instrumentation, vocal tone, and rhythmic grooves.",
    "Changing the random seed produces a different interpretation of the exact same prompt and lyrics.",
    "Cover songs are generated using cot='melody': preserving melody while harmonizing in an entirely new genre.",
    "SheetSage2 can transcribe audio into ABC notation; external LLMs can edit the score prior to synthesis."
  ],
  quiz: [
    {
      id: "q14_1",
      question: "How does YuE2 generate a cover song of an existing tune in a new musical style?",
      options: [
        "By pitch-shifting an existing MP3 file",
        "By using SheetSage2 to transcribe the melody to ABC notation, then synthesizing with cot='melody' and a new style prompt",
        "By asking the original recording artist for permission in an email",
        "By downloading the song from iTunes"
      ],
      correctIndex: 1,
      explanation: "Using `cot='melody'` fixes the core melodic line while allowing YuE2 to compose fresh harmony, instruments, and style."
    },
    {
      id: "q14_2",
      question: "What is 'agentic music editing' in the context of YuE2?",
      options: [
        "A secret agent hiring musicians in Vienna",
        "An LLM reading the human-readable ABC score, editing notes or chords based on user feedback, and passing it back to YuE2",
        "A Python script that automatically deletes bad songs",
        "Running the model without any electricity"
      ],
      correctIndex: 1,
      explanation: "Because ABC notation is readable text, language model agents can inspect and intelligently revise the musical score before audio rendering."
    },
    {
      id: "q14_3",
      question: "What happens if you keep the prompt, lyrics, and settings identical, but change the seed integer from 100 to 200?",
      options: [
        "The model produces the exact same file byte-for-byte",
        "The model produces a new, musically distinct variation of the same song",
        "The song is converted to 8-bit mono",
        "The program crashes with an invalid seed exception"
      ],
      correctIndex: 1,
      explanation: "Changing the seed alters the pseudo-random sampling rolls, yielding a fresh musical variation with different nuances."
    }
  ]
};

export const ch15_limits_ethics: Chapter = {
  id: 15,
  slug: "limits-ethics-and-whats-next",
  title: "Limits, Ethics & What's Next",
  subtitle: "Understanding boundaries, licensing, and future directions",
  pipelineStage: "wrapup",
  estMinutes: 7,
  hook: "If YuE2 can make a song in 71 seconds, does that mean human musicians are obsolete?",
  analogy: {
    title: "The Player Piano vs. The Concert Pianist",
    body: "When the mechanical player piano was popularized in the early 1900s, critics feared live musicians would vanish. A paper roll punched with holes could play complex Chopin études with inhuman mechanical precision. Yet player pianos never replaced human pianists, because music is fundamentally a conversation of human experience, shared culture, and vulnerable emotion.",
    breaksDown: "Player pianos followed static mechanical holes on paper rolls. Generative AI is dynamic and probabilistic, creating new variations and vocal synthesis, raising unique legal and creative questions."
  },
  concept: [
    {
      heading: "Probabilistic Limits & The Phoneme Error Rate",
      content: "YuE2 is a statistical model: it does not understand vocal anatomy, grammar, or acoustics. It occasionally mispronounces lyrics, slurs syllables, or drifts in tempo. The authors measure this using Phoneme Error Rate (PER): the percentage of sung phonemes that fail to match the input lyrics. While competitive with top systems, errors still occur.",
      eli5Content: "The AI doesn't know what words actually mean! Sometimes it mumbles a syllable or slurs a word just like a singer who forgot the lyrics."
    },
    {
      heading: "Training Data, Consent, and Legal Debates",
      content: "Music generation models require tens of thousands of hours of audio recordings to learn guitar timbres, vocal resonances, and drum rhythms. The legal and ethical standards surrounding copyrighted training data, artist consent, and fair use are actively evolving worldwide. Responsible engineers must respect artist rights and intellectual property.",
      eli5Content: "Learning to make music requires listening to existing music. The world is actively debating how to protect and reward human artists whose music helped teach AI models."
    },
    {
      heading: "The CC BY-NC 4.0 License",
      content: "YuE2-3B's model weights are distributed under the Creative Commons Attribution-NonCommercial 4.0 International license (CC BY-NC 4.0). You are free to download, run, study, and remix the weights for personal, research, or educational projects. However, you may not monetize or commercially exploit the model or its weights without a separate license from M-A-P.",
      eli5Content: "You can freely learn from and experiment with YuE2 for fun and school, but you cannot sell its outputs or use it in a commercial business!"
    }
  ],
  inYuE2: {
    summary: "YuE2-3B is released by M-A-P under CC BY-NC 4.0. Its technical paper (arXiv:2609.33757) documents rigorous benchmark evaluations against leading public and commercial systems.",
    factIds: ["license", "developer", "task"]
  },
  pythonCorner: [
    {
      title: "Verifying License and Model Info in Python",
      language: "python",
      type: "runnable",
      description: "A Python check verifying model metadata and non-commercial license compliance before execution.",
      code: `MODEL_INFO = {
    "name": "m-a-p/YuE2-3B",
    "developer": "Multimodal Art Projection (M-A-P)",
    "license": "CC BY-NC 4.0",
    "commercial_use_allowed": False,
    "paper": "arXiv:2609.33757",
}

def verify_license_compliance(use_case: str):
    if use_case.lower() in ["commercial", "business", "paid_streaming"]:
        if not MODEL_INFO["commercial_use_allowed"]:
            raise PermissionError(
                f"{MODEL_INFO['name']} is licensed under {MODEL_INFO['license']}. "
                "Commercial use is strictly prohibited without commercial agreement."
            )
    return f"Authorized for {use_case} under {MODEL_INFO['license']}."

print(verify_license_compliance("educational_research"))
# print(verify_license_compliance("commercial")) # Would raise PermissionError`
    }
  ],
  newTerms: [
    "benchmark",
    "phoneme-error-rate",
    "quantization"
  ],
  recap: [
    "YuE2 is a probabilistic statistical system; it can produce pronunciation glitches and structural drifts.",
    "The Phoneme Error Rate measures how accurately sung audio matches written lyrics.",
    "The model weights are strictly licensed under CC BY-NC 4.0 (non-commercial only).",
    "Generative AI provides powerful creative instruments for human artists rather than replacing human musical soul."
  ],
  quiz: [
    {
      id: "q15_1",
      question: "What does the 'Phoneme Error Rate' measure in generative music models?",
      options: [
        "The number of times the user's smartphone drops a call",
        "The percentage of sung phonetic sound units that fail to match the requested lyrics",
        "The volume level of the bass drum",
        "The price of GPU rental per hour"
      ],
      correctIndex: 1,
      explanation: "Phoneme Error Rate (PER) evaluates speech/singing fidelity by measuring how many pronounced phonemes deviate from the target lyrics."
    },
    {
      id: "q15_2",
      question: "Can an individual or company use the public weights of YuE2-3B to sell generated songs commercially?",
      options: [
        "Yes, with zero restrictions",
        "No; the weights are licensed under CC BY-NC 4.0 which strictly prohibits commercial use without authorization",
        "Only on Tuesdays",
        "Only if the song is shorter than 10 seconds"
      ],
      correctIndex: 1,
      explanation: "The CC BY-NC 4.0 license expressly forbids commercial use without separate commercial licensing from M-A-P."
    },
    {
      id: "q15_3",
      question: "Where can a developer go next to study the foundational code behind models like YuE2?",
      options: [
        "The official YuE2 GitHub repository and technical report on arXiv (2609.33757)",
        "The Hugging Face open-source community tutorials and minGPT-style implementations",
        "Educational interactive explainers like this one",
        "All of the above"
      ],
      correctIndex: 3,
      explanation: "All of these resources offer rich, open material to deepen understanding of generative audio and transformer modeling."
    }
  ]
};
