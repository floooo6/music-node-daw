import * as Tone from 'tone';

export class SamplerNode {
  constructor(id) {
    this.id = id;
    this.engine = null;

    // Initialisation du sampler avec des fichiers locaux (dans /public/samples)
    this.sampler = new Tone.Sampler({
      urls: {
        "C4": "piano_C4.wav",
        "E4": "piano_E4.wav",
        "G4": "piano_G4.wav",
        "B4": "piano_B4.wav",
      },
      baseUrl: "/samples/",
      onload: () => {
        console.log(`Sampler ${this.id} loaded samples.`);
      }
    }).toDestination();
  }

  process(event) {
    // Le SamplerNode est généralement le point final, il ne propage plus, il joue
    if (event.type === 'note' && event.note) {
      this.sampler.triggerAttackRelease(event.note, event.duration || '8n', event.time, event.velocity || 1);
    } else if (event.type === 'chord' && event.notes) {
      this.sampler.triggerAttackRelease(event.notes, event.duration || '4n', event.time, event.velocity || 1);
    }
  }

  destroy() {
    this.sampler.dispose();
  }
}
