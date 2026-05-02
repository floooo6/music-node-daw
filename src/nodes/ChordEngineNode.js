export class ChordEngineNode {
  constructor(id) {
    this.id = id;
    this.engine = null; // Injecté par l'engine

    // Une progression II-V-I simple en Do Majeur par exemple
    this.progressions = {
      'II-V-I': [['D4', 'F4', 'A4'], ['G3', 'B3', 'D4', 'F4'], ['C4', 'E4', 'G4', 'B4']]
    };

    this.currentProgression = 'II-V-I';
    this.step = 0;
  }

  setProgression(progName) {
    if (this.progressions[progName]) {
      this.currentProgression = progName;
      this.step = 0; // On réinitialise à chaque changement
    }
  }

  process(event) {
    if (event.type === 'tick') {
      const chords = this.progressions[this.currentProgression];
      const currentChord = chords[this.step % chords.length];

      this.step++;

      // On propage un événement "chord"
      if (this.engine) {
        this.engine.emitEvent(this.id, {
          type: 'chord',
          time: event.time,
          notes: currentChord,
          duration: '4n' // on peut ajuster la durée ou la passer dynamiquement
        });
      }
    }
  }
}
