import JsonParser from "./JsonParser";

const { ccclass, property } = cc._decorator;
export enum Difficult {
    EASY,
    NORMAL,
    HARD
}
@ccclass('SectionNotes')
export class SectionNotes {
    timeStart: number = 0;
    pos: number = 0;
    length: number = 0;
}
@ccclass('Notes')
export class Notes {
    typeOffSection: number = 0;
    lengthInSteps: number = 0;
    sectionNotes: number[][] = [];
    mustHitSection: boolean = false;
    sectionData: SectionNotes[] = [];
}
@ccclass('Song')
export class Song {
    song: String = "";
    notes: Notes[] = [];
    needsVoices: boolean = false;
    speed: number = 0;
    bpm: number = 0;
}
@ccclass('SongData')
export class SongData {
    song: Song = null;
}
@ccclass('SongClip')
export class SongClip {
    @property(cc.String)
    song: string = "";
    @property({
        type: cc.AudioClip
    })
    clipSong: cc.AudioClip = null;
    @property({
        type: cc.AudioClip
    })
    clipVoice: cc.AudioClip = null;
}

@ccclass
export default class ReadData extends cc.Component {
    @property(cc.JsonAsset)
    asset: cc.JsonAsset = null;
    songData: SongData = null;
    // @property([SongClip])
    // songAudio: SongClip[] = [];
    @property(cc.Integer)
    timeStartIChoose: number = 0;
    @property({ type: cc.Enum(Difficult) })
    public diff: Difficult = Difficult.EASY;
    // @property(cc.String)
    // pathData: string = "";
    // @property(cc.String)
    // pathSong: string = "";
    GetSongData() {
        return this.songData.song;
    }
    GetSongClip() {

    }
    protected start(): void {
        this.GenerateSFX();
    }
    GenerateSFX() {
        //let diff = Difficult.EASY;
        //let json = cc.sys.localStorage.getItem(this.pathData);
        //let song = JsonParser.parse<SongData>(this.pathData);
        //cc.log(song.song);
        // this.scheduleOnce(() => {
        //     cc.log(JSON.stringify(JsonParser.parse<SongData>(this.pathData)));
        // }, 1);
        // let person: Person = new Person();
        // person.id = 10;
        // person.name = "Hieu";
        // let json = JSON.stringify(person);
        // cc.log(json);
        //var url = cc.url.raw(this.pathData);
        //cc.loader.loadRes('24 2zavodila-hard', cc.JsonAsset, (err, res) => {
        //console.log("Load Json");
        //let json = JSON.stringify(res);
        //let song: SongData = Object.assign(new SongData(), JSON.parse(res.json));
        //cc.log(res.json);
        //});     


        //RenderData Json - Hieu Wilson 
        let songFromJson = this.asset.json["song"][0];
        let songDataFromJson: SongData = new SongData();
        songDataFromJson.song = Object.assign(new SongData(), songFromJson);
        songDataFromJson.song.song = songFromJson.song;
        songDataFromJson.song.notes = songFromJson.notes;
        songDataFromJson.song.needsVoices = songFromJson.needsVoices;
        songDataFromJson.song.speed = songFromJson.speed;
        songDataFromJson.song.bpm = songFromJson.bpm;
        for (let i = 0; i < songFromJson.notes.length; i++) {
            songDataFromJson.song.notes[i].sectionData = [];
            for (let j = 0; j < songFromJson.notes[i].sectionNotes.length; j++) {
                let section: SectionNotes = new SectionNotes();
                section.timeStart = songDataFromJson.song.notes[i].sectionNotes[j][0] / 1000;
                section.pos = Math.round(songDataFromJson.song.notes[i].sectionNotes[j][1]);
                section.length = songDataFromJson.song.notes[i].sectionNotes[j][2];
                songDataFromJson.song.notes[i].sectionData.push(section);
            }
            songDataFromJson.song.notes[i].sectionData.sort((n1, n2) => n1.timeStart - n2.timeStart);
        }
        for (let i = 0; i < songDataFromJson.song.notes.length; i++) {
            for (let j = 0; j < songDataFromJson.song.notes[i].sectionData.length; j++) {
                if (songDataFromJson.song.notes[i].sectionData[j].timeStart < this.timeStartIChoose) {
                    songDataFromJson.song.notes[i].sectionData.splice(j);
                }
            }
        }
		 for (let i = 0; i < songDataFromJson.song.notes.length; i++) {
            for (let j = 0; j < songDataFromJson.song.notes[i].sectionData.length; j++) {
                songDataFromJson.song.notes[i].sectionData[j].timeStart  = songDataFromJson.song.notes[i].sectionData[j].timeStart - this.timeStartIChoose;			
                }
        }    
        for (let i = 0; i < songDataFromJson.song.notes.length; i++) {
            for (let j = 0; j < songDataFromJson.song.notes[i].sectionData.length; j++) {
                for (let k = j + 1; k < songDataFromJson.song.notes[i].sectionData.length - 1; k++) {
                    if (songDataFromJson.song.notes[i].sectionData[j].timeStart == songDataFromJson.song.notes[i].sectionData[k].timeStart
                        && songDataFromJson.song.notes[i].sectionData[j].pos != songDataFromJson.song.notes[i].sectionData[k].pos) {
                        songDataFromJson.song.notes[i].sectionData[k].pos = songDataFromJson.song.notes[i].sectionData[j].pos;
                    }
                }
            }
        }

        this.songData = songDataFromJson;
        // for (let i = 0; i < this.songData.song.notes.length; i++) {
        //     for (let j = 0; j < this.songData.song.notes[i].sectionData.length; j++) {
        //         cc.log("time: " + this.songData.song.notes[i].sectionData[j].timeStart);
        //     }
        // }
    }

}

