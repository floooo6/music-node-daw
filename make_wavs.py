import wave
import struct

def create_silent_wav(filename, duration_sec=0.1, sample_rate=44100):
    num_samples = int(duration_sec * sample_rate)
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        # Create silent frames
        for _ in range(num_samples):
            wav_file.writeframes(struct.pack('h', 0))

if __name__ == '__main__':
    notes = ['C4', 'E4', 'G4', 'B4']
    for note in notes:
        create_silent_wav(f"public/samples/piano_{note}.wav")
        print(f"Created public/samples/piano_{note}.wav")
