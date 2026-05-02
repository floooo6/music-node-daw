import * as Tone from 'tone';

export class ClockNode {
  constructor(id) {
    this.id = id;
    this.engine = null; // Injecté par l'engine
    this.interval = '4n'; // Par défaut une noire
    this.eventId = null;
  }

  setInterval(interval) {
    this.interval = interval;
    if (this.eventId !== null) {
      Tone.Transport.clear(this.eventId);
      this.start();
    }
  }

  start() {
    this.eventId = Tone.Transport.scheduleRepeat((time) => {
      // On émet un événement "tick" en précisant le temps d'exécution
      if (this.engine) {
        this.engine.emitEvent(this.id, { type: 'tick', time });
      }
    }, this.interval);
  }

  stop() {
    if (this.eventId !== null) {
      Tone.Transport.clear(this.eventId);
      this.eventId = null;
    }
  }

  destroy() {
    this.stop();
  }
}
