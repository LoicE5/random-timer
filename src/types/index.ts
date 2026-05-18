export type Status = 'idle' | 'running' | 'paused' | 'finished';

export type SoundName = 'bell' | 'gong' | 'beep' | 'chime' | 'none';

export interface SoundOption {
  value: SoundName;
  label: string;
}

export interface TimerErrors {
  min?: string;
  max?: string;
}

export interface TimerProps {
  status: Status;
  totalSeconds: number;
  remainingSeconds: number;
  chosenDuration: number;
  showCountdown: boolean;
  canStart: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export interface SettingsProps {
  minMinutes: number;
  maxMinutes: number;
  sound: SoundName;
  showCountdown: boolean;
  errors: TimerErrors;
  onTestSound: () => void;
}
