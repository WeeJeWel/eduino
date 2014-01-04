#pragma strict

var bgTexture : Texture;
var titleStyle : GUIStyle;
var subtitleStyle : GUIStyle;
//var buttonStyle : GUIStyle;

// Overlay
var overlayTexture : Texture;
private var overlayOpacity = 1.0;
private var overlayCompleted = false;

function Start () {

}

function Update () {

}

function OnGUI() {
    GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), bgTexture, ScaleMode.ScaleAndCrop, true, 0);
    GUI.Label(Rect( 0, 0, Screen.width, Screen.height - 80 ), "Eduino", titleStyle);
    GUI.Label(Rect( 0, 0, Screen.width, Screen.height ), "You have learned the basics of the Arduino!", subtitleStyle);
    var startButton = GUI.Button(Rect( (Screen.width/2) - 50 , Screen.height/2 + 30, 100, 30), "Start again");
    
    
    // check if the user has pressed the start buttom
    if(startButton) {
		Application.LoadLevel("Lesson1");
    }
    
    if( overlayOpacity <= 1f && !overlayCompleted ) {
		// Fade in scene
		GUI.color = new Color(0, 0, 0, overlayOpacity);
		GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), overlayTexture);
		overlayOpacity -= 0.01f;		
	}
}