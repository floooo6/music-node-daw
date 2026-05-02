import * as Tone from 'tone';

export class VariationNode {
  constructor(id) {
    this.id = id;
    this.engine = null;
    this.transpose = 0; // Transposition en demi-tons
    this.humanize = 0.02; // Décalage aléatoire en secondes (ex: 20ms)
    this.inversion = false; // Inverse les accords
    this.retrograde = false; // Rétrograde (joue à l'envers) les accords
  }

  setTranspose(amount) {
    this.transpose = parseInt(amount, 10);
  }

  setHumanize(amount) {
    this.humanize = parseFloat(amount);
  }

  setInversion(val) {
    this.inversion = val;
  }

  setRetrograde(val) {
    this.retrograde = val;
  }

  // Fonction simplifiée pour transposer une note (ex: C4 -> C#4)
  transposeNote(noteStr, amount) {
    if (amount === 0) return noteStr;
    try {
      const midiVal = Tone.Frequency(noteStr).toMidi();
      return Tone.Frequency(midiVal + amount, "midi").toNote();
    } catch(e) {
      return noteStr;
    }
  }

  process(event) {
    if (event.type === 'note' || event.type === 'chord') {
      // Cloner l'événement pour ne pas modifier l'original par référence
      const newEvent = { ...event };

      // Appliquer l'humanisation (décalage aléatoire du temps)
      if (this.humanize > 0) {
        const offset = (Math.random() * 2 - 1) * this.humanize;
        newEvent.time += offset;
      }

      // Appliquer la transposition
      if (this.transpose !== 0) {
        if (newEvent.type === 'note') {
          newEvent.note = this.transposeNote(newEvent.note, this.transpose);
        } else if (newEvent.type === 'chord') {
          newEvent.notes = newEvent.notes.map(n => this.transposeNote(n, this.transpose));
        }
      }

      // Appliquer inversion et retrogradation sur les accords
      if (newEvent.type === 'chord') {
        if (this.inversion && newEvent.notes.length > 0) {
          // Inversion simple: on monte la basse d'une octave
          const firstNote = newEvent.notes[0];
          try {
            const invertedNote = Tone.Frequency(firstNote).transpose(12).toNote();
            newEvent.notes = [...newEvent.notes.slice(1), invertedNote];
          } catch(e) {}
        }

        if (this.retrograde) {
          // Joue l'accord dans le sens inverse
          newEvent.notes = [...newEvent.notes].reverse();
        }
      }

      if (this.engine) {
        this.engine.emitEvent(this.id, newEvent);
      }
    }
  }
}
