// Global Audio Manager for Character Voices to prevent double playback instances
class CharacterAudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  public play(audioUrl: string) {
    this.stop();

    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.volume = 0.9;
    this.currentAudio = audio;
    this.isPlaying = true;
    this.notify();

    audio.onended = () => {
      this.isPlaying = false;
      this.currentAudio = null;
      this.notify();
    };

    audio.onerror = () => {
      this.isPlaying = false;
      this.currentAudio = null;
      this.notify();
    };

    audio.play().catch(() => {
      this.isPlaying = false;
      this.notify();
    });
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  public toggle(audioUrl: string) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play(audioUrl);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public subscribe(callback: (playing: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isPlaying);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isPlaying));
  }
}

export const characterAudioManager = new CharacterAudioManager();
