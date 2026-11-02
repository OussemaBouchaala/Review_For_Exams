// @section dp | Adaptateur (Adapter)
// Patron Adaptateur : MediaAdapter fait entrer AdvancedMediaPlayer dans l'interface MediaPlayer.
// Compiler et lancer :  java AdapterDemo.java

public class AdapterDemo {
    public static void main(String[] args) {
        AudioPlayer audioPlayer = new AudioPlayer();   // le client ne connaît que MediaPlayer
        audioPlayer.play("mp3", "beyond the horizon.mp3");
        audioPlayer.play("mp4", "alone.mp4");
        audioPlayer.play("vlc", "far far away.vlc");
        audioPlayer.play("avi", "mind me.avi");
    }
}

// Cible : l'interface que le client attend
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// Adapté : une interface existante, incompatible avec MediaPlayer
interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

class VlcPlayer implements AdvancedMediaPlayer {
    public void playVlc(String fileName) { System.out.println("Playing vlc file. Name: " + fileName); }
    public void playMp4(String fileName) { /* ne fait rien */ }
}

class Mp4Player implements AdvancedMediaPlayer {
    public void playVlc(String fileName) { /* ne fait rien */ }
    public void playMp4(String fileName) { System.out.println("Playing mp4 file. Name: " + fileName); }
}

// Adaptateur : implémente la Cible et CONTIENT un Adapté (adaptateur d'objet, par composition)
class MediaAdapter implements MediaPlayer {
    private final AdvancedMediaPlayer advancedMusicPlayer;

    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMusicPlayer = new VlcPlayer();
        } else {
            advancedMusicPlayer = new Mp4Player();
        }
    }

    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMusicPlayer.playVlc(fileName);      // traduction de l'appel
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMusicPlayer.playMp4(fileName);
        }
    }
}

// Client concret : lit le mp3 lui-même, délègue le reste à l'adaptateur
class AudioPlayer implements MediaPlayer {
    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("mp3")) {
            System.out.println("Playing mp3 file. Name: " + fileName);
        } else if (audioType.equalsIgnoreCase("vlc") || audioType.equalsIgnoreCase("mp4")) {
            MediaAdapter mediaAdapter = new MediaAdapter(audioType);
            mediaAdapter.play(audioType, fileName);
        } else {
            System.out.println("Invalid media. " + audioType + " format not supported");
        }
    }
}
