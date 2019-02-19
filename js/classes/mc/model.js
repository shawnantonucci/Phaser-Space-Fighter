class Model
{
    constructor()
    {
        this._score = 0;
        this.soundOn = true;
        this._musicOn = true;
        this.gameOver = false;
    }

    set musicOn(val)
    {
        this._musicOn = val;
        // emitter.emit(G.MUSIC_CHANGED);
        mediaManager.musicChanged();
    }
    get musicOn()
    {
        return this._musicOn;
    }

    set score(val)
    {
        this._score = val;
        console.log("Score Updated")
        emitter.emit(G.SCORE_UPDATED);
    }
    get score()
    {
        return this._score;
    }
}