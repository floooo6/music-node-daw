export class MelodyGeneratorNode {
  constructor(id) {
    this.id = id;
    this.engine = null;
    this.pattern = 'up'; // 'up', 'down', 'random'
  }

  setPattern(pattern) {
    this.pattern = pattern;
  }

  process(event) {
    // Si on reçoit un accord, on l'arpège ou on choisit une note
    if (event.type === 'chord' && event.notes && event.notes.length > 0) {
      let chosenNote;

      switch (this.pattern) {
        case 'up':
          chosenNote = event.notes[event.notes.length - 1]; // On prend la plus haute (basique)
          break;
        case 'down':
          chosenNote = event.notes[0]; // On prend la plus basse
          break;
        case 'random':
        default:
          const randomIndex = Math.floor(Math.random() * event.notes.length);
          chosenNote = event.notes[randomIndex];
          break;
      }

      if (this.engine) {
        this.engine.emitEvent(this.id, {
          type: 'note',
          time: event.time,
          note: chosenNote,
          duration: event.duration || '8n',
          velocity: 0.8
        });
      }
    }
  }
}
