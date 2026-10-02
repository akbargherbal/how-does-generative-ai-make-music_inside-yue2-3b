import { Chapter } from "../types";

export const ch10_stage3_latents: Chapter = {
  id: 10,
  slug: "stage-3-acoustic-latents-flow-matching",
  title: "Stage 3: Adding the Detail",
  subtitle: "Non-autoregressive flow matching sculpts sound from noise",
  pipelineStage: "acoustic",
  estMinutes: 8,
  hook: "If predicting notes one by one is too slow for 17 million numbers, how can an AI generate thousands of audio details in parallel all at once?",
  analogy: {
    title: "Developing a Polaroid Photo from Grain",
    body: "When you snap an instant Polaroid camera, you don't watch the picture print line by line from the top of the photo to the bottom like an inkjet printer. Instead, the chemical film starts as a gray, cloudy blur. Over 30 seconds, the entire image sharpens uniformly everywhere at once: the sky, the faces, and the grass all emerge together. Flow matching works like that photo developing.",
    breaksDown: "Polaroid development is a chemical oxidation-reduction reaction on paper. Flow matching in YuE2 is solving a mathematical differential equation: iteratively applying small vector velocity nudges to a multi-dimensional array of numbers over discrete numerical steps."
  },
  concept: [
    {
      heading: "Screen 1: AR vs. NAR (Two Ways to Build)",
      content: "Up to this point, we used Autoregressive (AR) generation: predict token 1, then token 2, then token 3. AR is great for storylines and melodies where sequence order matters. But for dense audio details across a 3-minute song, AR would require tens of thousands of serial steps. Non-Autoregressive (NAR) generation instead generates all audio frames in parallel across time simultaneously.",
      eli5Content: "Autoregressive is writing a letter word by word. Non-autoregressive is stamping an entire page at once and then making the ink sharper and clearer!"
    },
    {
      heading: "Screen 2: Flow Matching as Sculpting from Noise",
      content: "Flow matching starts with a block of pure Gaussian noise (completely random numbers, like radio static). In a Python loop of N steps (e.g. 25 steps), the model predicts a 'velocity' vector field pointing from noise toward realistic acoustic latents, conditioned on the semantic tokens. At each step, it nudges the numbers slightly along this straight trajectory: `latents = latents + velocity * step_size`.",
      eli5Content: "The AI starts with a cloud of TV static. Over 25 steps, it pushes the static particles along straight lines until they form the exact shape of musical sound!"
    },
    {
      heading: "Screen 3: What Is an Acoustic Latent?",
      content: "An acoustic latent is a compressed numerical representation of audio. Rather than storing 48,000 separate numbers per second, the latent space stores a few dozen continuous numbers per frame that describe the harmonic spectrum, formant resonances, and stereo balance. It contains everything needed to reconstruct the song, but in a footprint that the GPU can compute easily.",
      eli5Content: "A latent is like a freeze-dried soup cube: it takes up 100 times less space than a bowl of soup, but when you add hot water (the decoder), you get the full meal back."
    }
  ],
  inYuE2: {
    summary: "pipe.synthesize(semantic) executes the non-autoregressive flow matching stage, transforming random Gaussian noise into rich acoustic latents conditioned on the semantic draft.",
    factIds: ["architecture_claim", "two_stages_audio", "pipeline_methods"]
  },
  pythonCorner: [
    {
      title: "Flow Matching Euler Step in Pure Python",
      language: "python",
      type: "runnable",
      description: "A runnable, pure-Python simulation of moving numbers from noise toward a structured target using flow matching steps.",
      code: `import random

# A toy 1D simulation: 5 random noise values moving toward target values
noise  = [random.gauss(0.0, 1.0) for _ in range(5)]
target = [2.0, -1.5, 3.0, 0.5, -2.0]  # The ideal latent coordinates
steps = 10
dt = 1.0 / steps

current = list(noise)
print(f"Step  0 (Pure noise):  {[round(x, 2) for x in current]}")

for step in range(1, steps + 1):
    # In flow matching, the model predicts the velocity pointing toward target
    # Velocity = (target - noise)
    velocity = [(tgt - n) for tgt, n in zip(target, noise)]
    current = [x + v * dt for x, v in zip(current, velocity)]

print(f"Step 10 (Target shape): {[round(x, 2) for x in current]}")
print(f"True target values:    {[round(x, 2) for x in target]}")`
    },
    {
      title: "Calling Synthesis in the Real YuE2 API",
      language: "python",
      type: "needs-gpu",
      description: "How pipe.synthesize() turns semantic tokens into continuous acoustic latents.",
      code: `# Requires: Linux, 24GB NVIDIA GPU, pip install yue2_infer-0.1.5
# Stage 3: Flow matching synthesis (NAR)
latents = pipe.synthesize(
    semantic_tokens,
    num_steps=25,   # Number of flow matching integration steps
    seed=1234
)

print("Acoustic latents tensor shape:", latents.shape)`
    }
  ],
  newTerms: [
    "nar",
    "flow-matching",
    "acoustic-latents",
    "latent-space",
    "noise",
    "diffusion"
  ],
  recap: [
    "Non-Autoregressive (NAR) generation creates or refines all output frames in parallel across time.",
    "Flow matching starts from pure Gaussian noise and moves along straight trajectories toward realistic data.",
    "Each step solves an ordinary differential equation (ODE) using small numerical steps.",
    "Acoustic latents compress audio into continuous frames that are far smaller than raw waveforms."
  ],
  quiz: [
    {
      id: "q10_1",
      question: "What is the primary operational difference between Autoregressive (AR) and Non-Autoregressive (NAR) generation?",
      options: [
        "AR only runs on Apple computers, while NAR runs on Linux",
        "AR generates sequentially one token after another; NAR updates all frames simultaneously in parallel",
        "AR requires an internet connection, while NAR is always offline",
        "AR produces stereo audio, while NAR produces mono"
      ],
      correctIndex: 1,
      explanation: "Autoregressive generation predicts items serially in order; Non-Autoregressive models process and refine the entire sequence in parallel."
    },
    {
      id: "q10_2",
      question: "What does flow matching start with before producing acoustic latents?",
      options: [
        "A pre-existing MP3 downloaded from YouTube",
        "A tensor of pure random Gaussian noise (static)",
        "A blank text document with spaces",
        "A MIDI file recorded on a keyboard"
      ],
      correctIndex: 1,
      explanation: "Flow matching initializes from an unstructured random Gaussian noise distribution and uses learned velocity vector fields to guide it toward structured latents."
    },
    {
      id: "q10_3",
      question: "Why is generating in a 'latent space' advantageous compared to raw 48 kHz audio samples?",
      options: [
        "Latent space is copyrighted by the government",
        "Latent spaces compress the audio by orders of magnitude, making parallel computation on GPUs fast and tractable",
        "Latents only use integers between 0 and 9",
        "Latent space eliminates the need for speakers"
      ],
      correctIndex: 1,
      explanation: "Acoustic latents pack high-resolution spectral and temporal audio characteristics into a fraction of the data size of uncompressed 48 kHz PCM samples."
    }
  ]
};

export const ch11_stage4_vae: Chapter = {
  id: 11,
  slug: "stage-4-vae-decoder-sound-waves",
  title: "Stage 4: From Numbers to Sound",
  subtitle: "The VAE decoder and 48 kHz stereo waveforms",
  pipelineStage: "decode",
  estMinutes: 7,
  hook: "Acoustic latents are still just abstract matrices of numbers. How do we turn them into physical air vibrations your ears can hear?",
  analogy: {
    title: "The Film Projector Lens",
    body: "Think of an old 35mm motion picture projector. The film reel contains tiny transparent frames just 1 inch wide. You cannot project that tiny reel onto the cinema wall with your bare eyes. But when bright light passes through the projector lens, it expands that 1-inch frame into a glowing 40-foot display with vibrant colors and rich textures. The VAE decoder is that expansion lens.",
    breaksDown: "A physical projector lens refracts photons through glass curvature. A neural VAE decoder is a deep convolutional network performing upsampling layers, calculating 48,000 stereo values for every second."
  },
  concept: [
    {
      heading: "What Is a Variational Autoencoder (VAE)?",
      content: "An autoencoder consists of two matching networks trained as a pair:\n1. Encoder: Takes raw 48 kHz audio and squeezes it down into compact acoustic latents.\n2. Decoder: Takes acoustic latents and expands them back into raw 48 kHz stereo audio waves.\nDuring training, both halves run together. But once trained, YuE2 discards the encoder and only keeps the decoder for generation!",
      eli5Content: "An autoencoder is a compressor and uncompressor pair. YuE2 uses the uncompressor to blow up the compact audio cubes into real sound waves!"
    },
    {
      heading: "YuE2-Vae vs. YuE2-Vae-Legacy",
      content: "The YuE2 repository provides two different pretrained VAE decoders:\n- YuE2-Vae (default): Optimized for superior perceptual audio quality, high-frequency air, and vocal clarity.\n- YuE2-Vae-legacy: An earlier checkpoint that scored slightly higher on automated musicality benchmarks, but has slightly more compression artifacts.",
      eli5Content: "M-A-P built two decoders: the default one sounds crisper to human ears; the legacy one scored higher on certain robot tests."
    },
    {
      heading: "The Final Waveform: 48 kHz Stereo",
      content: "The decoder's output is an array of floating-point numbers between -1.0 and +1.0. These numbers directly control the physical position of speaker diaphragms, oscillating back and forth up to 48,000 times per second per ear. Using standard audio libraries like `soundfile`, this array is saved to disk as a `.flac` or `.wav` file.",
      eli5Content: "The output numbers push and pull your headphone speakers forward and backward thousands of times a second to make real sound waves in the air."
    }
  ],
  inYuE2: {
    summary: "pipe.decode(latents) runs the neural VAE decoder to reconstruct the final 48 kHz stereo PCM audio waveform from acoustic latents.",
    factIds: ["audio_output", "decoder_variants", "pipeline_methods"]
  },
  pythonCorner: [
    {
      title: "Decoding Latents and Saving Audio in Python",
      language: "python",
      type: "needs-gpu",
      description: "The final step of the YuE2 pipeline, converting latents to 48 kHz audio and saving to disk.",
      code: `# Requires: Linux, 24GB NVIDIA GPU, pip install yue2_infer-0.1.5
# Stage 4: Decode acoustic latents into physical stereo waveform
# By default, uses YuE2-Vae
audio = pipe.decode(latents)

print(f"Decoded audio shape: {audio.shape}")
# Shape: (2, N_samples) -> 2 channels (Left/Right) at 48,000 Hz

# Save to uncompressed FLAC or WAV format
pipe.save(audio, "morning_light.flac")
print("Saved 48 kHz stereo track to morning_light.flac")`
    }
  ],
  newTerms: [
    "autoencoder",
    "encoder",
    "decoder",
    "vae"
  ],
  recap: [
    "A VAE consists of an encoder (compresses audio) and a decoder (reconstructs audio).",
    "During music generation, YuE2 only needs the decoder to expand acoustic latents into sound waves.",
    "YuE2 offers two decoder checkpoints: YuE2-Vae (cleaner perceptual sound) and YuE2-Vae-legacy.",
    "The final output is 48 kHz stereo floating-point samples saved in standard formats like FLAC or WAV."
  ],
  quiz: [
    {
      id: "q11_1",
      question: "Which component of the Variational Autoencoder (VAE) is actually used during song generation in YuE2?",
      options: [
        "Only the Encoder",
        "Only the Decoder",
        "Both the Encoder and Decoder simultaneously",
        "Neither; the VAE is completely deleted"
      ],
      correctIndex: 1,
      explanation: "During generation, we already have the generated acoustic latents; only the Decoder is needed to expand those latents into audio waves."
    },
    {
      id: "q11_2",
      question: "According to the model card, how do YuE2-Vae and YuE2-Vae-legacy differ?",
      options: [
        "YuE2-Vae only produces piano music, while legacy produces drums",
        "YuE2-Vae (default) offers better perceptual audio quality, while legacy scored higher on certain benchmark musicality metrics",
        "YuE2-Vae runs on Windows, while legacy only runs on macOS",
        "YuE2-Vae requires 100 GB of VRAM"
      ],
      correctIndex: 1,
      explanation: "The authors document that YuE2-Vae has superior perceptual audio fidelity, whereas YuE2-Vae-legacy scored slightly higher on specific musicality benchmarks."
    },
    {
      id: "q11_3",
      question: "What physical action do the output numbers of the VAE decoder represent?",
      options: [
        "The speed of the computer's CPU cooling fan",
        "The back-and-forth physical displacement of headphone or speaker diaphragms over time",
        "The brightness of the monitor pixels",
        "The volume slider on the Windows taskbar"
      ],
      correctIndex: 1,
      explanation: "Digital audio PCM samples represent the displacement voltage pushing and pulling the speaker cone to vibrate the air."
    }
  ]
};

export const ch12_brain_layout: Chapter = {
  id: 12,
  slug: "brain-layout-ar-nar-mixture-of-transformers",
  title: "The Brain Layout",
  subtitle: "Inside the AR–NAR Mixture-of-Transformers",
  pipelineStage: "wrapup",
  estMinutes: 8,
  hook: "Earlier we learned that AR writes sequentially and NAR refines in parallel. How can one single model do both?",
  analogy: {
    title: "The Shared Architectural Firm",
    body: "Picture an architectural firm operating out of one central building. Team A works on the concept sketches and narrative zoning approvals sequentially (AR). Team B works on the structural 3D blueprints, calculating all load-bearing columns across the whole building simultaneously in parallel (NAR). Both teams share the same central reference library, material catalogs, and executive conference rooms (shared transformer backbone), but each team sits at their own specialized workstations.",
    breaksDown: "In a real office, human architects can chat in hallways or switch tasks on a whim. In YuE2, the routing between AR mode (for planning/semantic tokens) and NAR mode (for acoustic latents) is deterministic and governed by the pipeline method called in code."
  },
  concept: [
    {
      heading: "Why Not Two Completely Separate Models?",
      content: "A naive approach would train two separate neural networks: a language model for ABC/semantic tokens, and a diffusion model for audio latents. But training two disjoint models requires twice as much memory and discards shared knowledge. Musical rhythm, harmonic structures, and lyrical emotions are relevant to BOTH sheet music and acoustic sound.",
      eli5Content: "Instead of building two separate AI brains that can't talk to each other, YuE2 uses one brain that knows how to think sequentially AND in parallel."
    },
    {
      heading: "The AR–NAR Mixture-of-Transformers (MoT)",
      content: "YuE2 uses a unified AR–NAR Mixture-of-Transformers backbone:\n- When generating ABC notation or semantic tokens: It activates its causal autoregressive attention paths, predicting one token at a time with a causal mask.\n- When running flow matching: It switches to its non-autoregressive bidirectional attention paths, updating all latent frames together across the timeline.",
      eli5Content: "When it needs to write lyrics or notes, it uses its one-by-one mode. When it needs to paint sound textures, it flips a switch and uses its all-at-once mode!"
    },
    {
      heading: "Mixture-of-Transformers vs. Mixture-of-Experts",
      content: "Do not confuse Mixture-of-Transformers (MoT) with Mixture-of-Experts (MoE). In standard MoE (like Mixtral), a router directs each token to different small feed-forward networks within the same layer. In YuE2's MoT, the architecture unifies distinct sequence modeling paradigms (sequential AR vs parallel NAR) within one shared transformer backbone.",
      eli5Content: "MoE routes words to different expert teachers; YuE2's MoT switches how the whole brain thinks (step-by-step vs all-at-once)."
    }
  ],
  inYuE2: {
    summary: "YuE2's central architecture claim is 'One AR–NAR Mixture-of-Transformers backbone writes the score and semantic tokens, then generates acoustic latents through flow matching.'",
    factIds: ["architecture_claim", "parameter_count", "supervision_models"]
  },
  pythonCorner: [
    {
      title: "Conceptual Pseudocode for AR-NAR Switching",
      language: "python",
      type: "runnable",
      description: "A Python class sketch showing how a single backbone switches attention masks depending on the mode.",
      code: `class UnifiedBackbone:
    def __init__(self, num_layers=24):
        self.num_layers = num_layers
        print(f"Initialized unified backbone with {num_layers} layers.")

    def forward(self, inputs, mode="AR"):
        if mode == "AR":
            # Autoregressive: use causal triangular mask (can't see future)
            print("Mode AR: Applied causal mask. Predicting next token.")
            return "next_token_logits"
        elif mode == "NAR":
            # Non-autoregressive: full bidirectional attention (all frames see all)
            print("Mode NAR: Applied bidirectional mask. Flow matching velocity step.")
            return "velocity_tensor"
        else:
            raise ValueError(f"Unknown mode: {mode}")

model = UnifiedBackbone()
# Step 1 & 2 use AR mode
model.forward("lyrics + prompt", mode="AR")
# Step 3 uses NAR mode
model.forward("noise + semantic_condition", mode="NAR")`
    }
  ],
  newTerms: [
    "backbone",
    "mixture-of-transformers"
  ],
  recap: [
    "YuE2 uses a single unified AR-NAR Mixture-of-Transformers backbone rather than multiple disconnected models.",
    "The backbone switches attention masking: causal masking for AR generation, and bidirectional attention for NAR flow matching.",
    "This shared architecture saves memory and enables cross-modality understanding of musical structure.",
    "MoT differs from MoE: it bridges sequential and parallel generation paradigms."
  ],
  quiz: [
    {
      id: "q12_1",
      question: "What is the primary advantage of a single unified AR-NAR backbone over two separate disconnected models?",
      options: [
        "It makes the Python script 5,000 lines longer",
        "It shares representations of musical harmony and structure between stages while reducing total GPU memory footprint",
        "It eliminates the need for electricity",
        "It automatically writes song lyrics in rhyming couplets"
      ],
      correctIndex: 1,
      explanation: "A unified backbone allows the model to leverage common musical knowledge across both symbolic composition and acoustic synthesis without duplicating weights."
    },
    {
      id: "q12_2",
      question: "How does the attention mechanism change between the AR and NAR stages inside YuE2?",
      options: [
        "AR turns off the GPU; NAR turns it back on",
        "AR uses a causal mask so tokens cannot look ahead; NAR uses bidirectional attention across all frames simultaneously",
        "AR only looks at vowels; NAR only looks at consonants",
        "AR runs on the CPU, while NAR runs on the screen"
      ],
      correctIndex: 1,
      explanation: "Autoregressive generation restricts attention to past positions (causal mask); Non-autoregressive flow matching allows all time frames to attend to each other."
    },
    {
      id: "q12_3",
      question: "How does Mixture-of-Transformers (MoT) differ from traditional Mixture-of-Experts (MoE)?",
      options: [
        "MoT is a text editor; MoE is an operating system",
        "MoT unifies distinct generative paradigms (AR and NAR) across tasks, rather than simply routing tokens to sub-networks within layers",
        "MoT only works with acoustic guitars",
        "There is zero difference; they are exact synonyms"
      ],
      correctIndex: 1,
      explanation: "MoE routes individual tokens to specialized feed-forward experts; YuE2's MoT coordinates sequential autoregression and parallel flow matching within one model."
    }
  ]
};
