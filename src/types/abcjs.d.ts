declare module 'abcjs' {
  export interface AbcVisualOptions {
    responsive?: 'resize' | 'scroll';
    scale?: number;
    staffwidth?: number;
    add_classes?: boolean;
    foregroundColor?: string;
    selectionColor?: string;
    clickListener?: (abcelem: unknown, tuneNumber: number, classes: string, analysis: unknown, drag: unknown) => void;
    [key: string]: unknown;
  }

  export function renderAbc(
    target: string | HTMLElement,
    abc: string,
    options?: AbcVisualOptions
  ): unknown[];

  export namespace synth {
    export interface SynthControllerOptions {
      displayLoop?: boolean;
      displayRestart?: boolean;
      displayPlay?: boolean;
      displayProgress?: boolean;
      displayWarp?: boolean;
    }

    export class SynthController {
      load(selector: string | HTMLElement, cursorControl?: unknown, visualOptions?: SynthControllerOptions): void;
      setTune(visualObj: unknown, userAction: boolean, audioParams?: unknown): Promise<unknown>;
      play(): void;
      pause(): void;
      stop(): void;
      destroy(): void;
    }

    export class CreateSynth {
      init(options: {
        visualObj: unknown;
        audioContext?: AudioContext;
        millisecondsPerMeasure?: number;
        options?: unknown;
      }): Promise<unknown>;
      prime(): Promise<unknown>;
      start(): void;
      stop(): void;
      pause(): void;
      seek(position: number): void;
    }

    export function playEvent(
      pitches: Array<{ pitch: number; duration: number }>,
      midiPitches?: unknown,
      audioContext?: AudioContext
    ): Promise<unknown>;
  }
}
