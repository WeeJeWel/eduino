import Vectrosity;

var arduinoTexture : Texture;
var bgTexture : Texture;
var gradientTexture : Texture;
private var stringToEdit : String = "/*\n  Blink\n  Turns on an LED on for one second, then off for one second, repeatedly.\n \n  This example code is in the public domain.\n */\n \n// Pin 13 has an LED connected on most Arduino boards.\n// give it a name:\nint led = 13;\n\n// the setup routine runs once when you press reset:\nvoid setup() {                \n  // initialize the digital pin as an output.\n  pinMode(led, OUTPUT);     \n}\n\n// the loop routine runs over and over again forever:\nvoid loop() {\n  digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)\n  delay(1000);               // wait for a second\n  digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW\n  delay(1000);               // wait for a second\n}";
var infotextStyle : GUIStyle;
var editorStyle : GUIStyle;
var editorValidateStyle : GUIStyle;
var editorRunStyle : GUIStyle;
var editorLabelStyle : GUIStyle;
var editorLabelText = "";

// Game Objects
var arduino : GameObject;
var arduinoLed : GameObject;
var usb_cable : GameObject;
var usb_cable_handle : GameObject;
var breadboard : GameObject;
var broadboardWireExample : GameObject;
var led : GameObject;
var ledArrow : GameObject;
var wire_a_start : GameObject;
var wire_a_end : GameObject;
var wire_b_start : GameObject;
var wire_b_end : GameObject;
var wire_a_start_helper : GameObject;
var wire_a_end_helper : GameObject;
var wire_b_start_helper : GameObject;
var wire_b_end_helper : GameObject;
var wire_a_start_arrow : GameObject;
var wire_b_start_arrow : GameObject;
var resistor : GameObject;
var resistor_flame : GameObject;
var electron : GameObject;

// Audio Sources
var windowsUsbConnect : AudioClip;
var audio_complete : GameObject;

// Code Editor
public var editorVisible = true;

// Bottom text
private var bottomText : String = "";
private var bottomNext : boolean = false;

// Overlay
var overlayTexture : Texture;
private var overlayOpacity = 1.0;
private var overlayCompleted = false;
private var fadeOutScene = false;

// Missions
private var updateFunction;
private var guiFunction;
private var currentMission = -1;
private var missions;
var skipAmount = 0; // debug
private var blinking = false;
private var editMission = false;

// Input
private var mouseButtonDown = false;
private var mouseButtonDownPosition = null;

// Vectrocity
private var lineSegments = 50;
private var wire_a;
private var wire_b;

function Start() {

	missions = [
		// Intro
		function(){
			Debug.Log("Intro started");
			setBottom("This is the <i>arduino</i>. You can do a lot of cool stuff with it, very easily! \nYou will learn the basics, so you can buy your own and get started with it!");
			bottomNext = true;
			
			updateFunction = function() {
	    		arduino.transform.Rotate(Vector3.up * Time.deltaTime * 15);
			};
		},
		
		// ConnectTheCable
		function(){
			Debug.Log("ConnectTheCable started");
			setBottom("First, we need to power the Arduino.\n<b>Connect the USB cable to the arduino.</b>");
			
			usb_cable_handle.GetComponent("Drag").dragOnXAxis = true;
			
			iTween.RotateTo( arduino, {
				"y": 160,
				"time": 2
			});
			
			updateFunction = function() {
				if( usb_cable_handle.transform.position.x > -11.1f && usb_cable_handle.GetComponent("Drag").dragOnXAxis ) {
					usb_cable_handle.GetComponent("Drag").dragOnXAxis = false;
					
					iTween.MoveTo(usb_cable_handle, {
						"x": -11.1f,
						"time": 0.1
					});
										
					usb_cable.audio.Play();
					
					StartCoroutine( ConnectTheCable_BlinkArduinoLed(0) );
					
					setBottom("Well done!");
					bottomNext = true;
				}
			};
			
		},
		
		// HelloBreadboard
		function(){
			Debug.Log("HelloBreadboard started");
			setBottom("This is a <i>breadboard</i>. It helps you to connect components faster.");
			iTween.MoveAdd(this.gameObject, new Vector3(5, 1, -10), 3);
			iTween.RotateTo(this.gameObject, new Vector3(40, 0, 0), 3);
			iTween.MoveTo(breadboard, {
				"x": 3.453153,
				"z": -6.061965,
				"time": 3,
				"oncomplete": "HelloBreadboardMoveTo0Complete"
			});
			
			bottomNext = true;
		},
		
		// BreadboardWorkings
		function(){
			Debug.Log("BreadboardWorkings started");
			setBottom("The breadboard connects wires horizontally (as the pink line). \nYou can put any type of component with legs in the breadboard.");			
			//iTween.ScaleTo( broadboardWireExample, new Vector3(0.2, 0.01, 1.2), 2);
			
			iTween.ColorTo( broadboardWireExample, {
				"time": 1,
				"color": new Color(1, 0, 0.2, 1),
				"looptype": iTween.LoopType.pingPong
			});
			bottomNext = true;
		},
		
		// HelloLed
		function() {
			Debug.Log("HelloLed started");
			setBottom("Look, there's a LED! It's a component that converts power into light! \n<b>Drag the LED into the breadboard.</b>");
			
			iTween.Stop( broadboardWireExample );
			iTween.ColorTo( broadboardWireExample, {
				"time": 1,
				"color": new Color(1, 0, 0.2, 1)
			});
			
			
			iTween.MoveTo( led, {
				"y": 5,
				"time": 3
			});
			iTween.MoveTo( ledArrow, {
				"y": 2,
				"time": 0,
				"delay": 4
			});
			iTween.MoveAdd( ledArrow, {
				"z": 0.75,
				"time": 0.5,
				"looptype" : iTween.LoopType.pingPong
			});
			
			updateFunction = function() {
				if( led.transform.position.y <= 2 && led.GetComponent("Drag").dragOnYAxis ) {
					// disable future dragging
					led.GetComponent("Drag").dragOnYAxis = false;
				
					bottomNext = true;
					ledArrow.renderer.enabled = false;
					led.transform.position.y = 2;
					playCompleteSound();
					setBottom("Well done!");
				}
			};
		},
		
		// AddWires
		function() {
			Debug.Log("AddWires started");
			setBottom("The LED needs power from the arduino. \n<b>Connect the wires.</b>");
			//bottomNext = true;
			
			// Zoom the camera in, move and rotate
			iTween.ValueTo(this.gameObject, {
				"time": 2f,
				"delay": 0.5f,
				"from": this.camera.fieldOfView,
				"to": 23,
				"onupdate": "iTweenZoomCameraCallback"
			});
								
			iTween.MoveTo(this.gameObject, {
				"x": -7f,
				"z": -20f,
				"time": 2f,
				"delay": 0.5f
			});
			
			iTween.RotateTo(this.gameObject, {
				"x": 35,
				"y": 30,
				"time": 2f,
				"delay": 0.5f
			});
			
			// Animate the wires into the screen
			iTween.MoveTo( wire_a_start, 	{ "x": 4, "time": 4, "delay": 1 });
			iTween.MoveTo( wire_a_end, 		{ "x": 7, 	"time": 4, "delay": 1 });
			iTween.MoveTo( wire_b_start, 	{ "x": 6, "time": 4, "delay": 1.5 });
			iTween.MoveTo( wire_b_end, 		{ "x": 8, "time": 4, "delay": 1.5 });
				
			var done_a_start = false;
			var done_a_end = false;
			var done_b_start = false;
			var done_b_end = false;
			
			var callbackExecuted = false;
			
			iTween.MoveTo( wire_a_start_arrow, {
				"y": 2,
				"time": 0,
				"delay": 4
			});
			iTween.MoveAdd( wire_a_start_arrow, {
				"z": 0.75,
				"time": 0.5,
				"looptype" : iTween.LoopType.pingPong
			});
			
			iTween.MoveTo( wire_b_start_arrow, {
				"y": 2,
				"time": 0,
				"delay": 4
			});
			iTween.MoveAdd( wire_b_start_arrow, {
				"z": 0.75,
				"time": 0.5,
				"looptype" : iTween.LoopType.pingPong
			});
			
			updateFunction = function() {
			
				// Check if the wires are in correct positions				
				if( !done_a_start ) {				
					if( Vector3.Distance( new Vector3(1.058863, wire_a_start.transform.position.y, -1.254774),  wire_a_start.transform.position) < 0.45 ) {
						wire_a_start.GetComponent("Drag").dragOnXAxis = false;
						wire_a_start.GetComponent("Drag").dragOnZAxis = false;
						iTween.MoveTo( wire_a_start, {
							"time": 1,
							"x": 1.058863,
							"z": -1.254774
						});
						iTween.MoveTo( wire_a_start, {
							"time": 0.5,
							"delay": 1,
							"y": 1.215914
						});
						iTween.Stop(wire_a_start_arrow);
						wire_a_start_arrow.renderer.enabled = false;
						
						done_a_start = true;
					}
				}
				
				if( !done_a_end ) {
					if( Vector3.Distance( new Vector3(4.581469, wire_a_end.transform.position.y, -4.567579),  wire_a_end.transform.position) < 0.35 ) {
						wire_a_end.GetComponent("Drag").dragOnXAxis = false;
						wire_a_end.GetComponent("Drag").dragOnZAxis = false;
						iTween.MoveTo( wire_a_end, {
							"time": 1,
							"x": 4.581469,
							"z": -4.567579
						});
						iTween.MoveTo( wire_a_end, {
							"time": 0.5,
							"delay": 1,
							"y": 1.1
						});
						
						done_a_end = true;
					}
				}
				
				if( !done_b_start ) {
					if( Vector3.Distance( new Vector3(1.55299, wire_b_start.transform.position.y, -1.098209),  wire_b_start.transform.position) < 0.35 ) {
						wire_b_start.GetComponent("Drag").dragOnXAxis = false;
						wire_b_start.GetComponent("Drag").dragOnZAxis = false;
						iTween.MoveTo( wire_b_start, {
							"time": 1,
							"x": 1.55299,
							"z": -1.098209
						});
						iTween.MoveTo( wire_b_start, {
							"time": 0.5,
							"delay": 1,
							"y": 1.215914
						});
						iTween.Stop(wire_b_start_arrow);
						wire_b_start_arrow.renderer.enabled = false;
						
						done_b_start = true;
					}
				}
				
				if( !done_b_end ) {
					if( Vector3.Distance( new Vector3(4.980532, wire_b_end.transform.position.y, -4.455519),  wire_b_end.transform.position) < 0.35 ) {
						wire_b_end.GetComponent("Drag").dragOnXAxis = false;
						wire_b_end.GetComponent("Drag").dragOnZAxis = false;
						iTween.MoveTo( wire_b_end, {
							"time": 1,
							"x": 4.980532,
							"z": -4.455519
						});
						iTween.MoveTo( wire_b_end, {
							"time": 0.5,
							"delay": 1,
							"y": 1.1
						});
						
						done_b_end = true;
					}
				}
				
				if( done_a_start && done_a_end && done_b_start && done_b_end ) {
					if( !callbackExecuted ) {
						callbackExecuted = true;
						StartCoroutine("AddWires_callback");
					}
				}
				
			};
			
			//bottomNext = true;
		},
		
		// MovingElectrons
		function(){
			
			electron.transform.Find("Sphere").renderer.enabled = true;
			
			iTween.MoveTo( electron, {
				"time": 5,
				"path": iTweenPath.GetPath("electronPath"),
				"looptype": "loop",
				"easetype": "linear"
			});
			
			setBottom("The blue trail shows how the <i>electrons</i> travel through the wires and the LED.");
			bottomNext = true;
		},
		
		// LedBurns
		function(){
			
			electron.transform.Find("Sphere").renderer.enabled = false;
			iTween.Stop( electron );
			
			led.Find("smoke").GetComponent(ParticleRenderer).enabled = true;
			led.Find("smoke").GetComponent(ParticleEmitter).particleEmitter.maxSize = 2;
			//led.Find("Sphere").GetComponent("Halo").enabled = false;
			setBottom("Whoops! Looks like the LED is overheating... How could this happen?");
			bottomNext = true;
		},
		
		// ExplainBurning
		function(){
			setBottom("We have put too much <i>voltage (V)</i> through the LED. \nThis green LED only needs 2.2V, but the Arduino provided 3.3V. That was too much and the LED started smoking!");
			bottomNext = true;
		},
		
		// AddResistor
		function(){
			setBottom("To prevent this, we must add a component called the <i>resistor</i>. When placed just before the LED (called <i>in series</i>), \nthe resistor 'uses' the remaining voltage. In our case, 3.3V (Arduino or <i>source</i>) - 2.2V (LED) = 1.1V.");
			bottomNext = true;
			
			iTween.MoveTo( resistor, {
				"time": 3,
				"y": 14
			});
			iTween.RotateBy( resistor, {
				"time": 6,
				"z": 1,
				"easetype": "linear",
				"looptype": "loop"
			});
		},
		
		// ExplainResistor
		function(){
			setBottom("Because energy can never be lost, the resistor uses electrical power and converts it into heat.");
			bottomNext = true;
			
			resistor_flame.Find("InnerCore").particleEmitter.maxEnergy = 2;
			
			iTween.Stop( resistor );
			iTween.RotateTo( resistor, {
				"time": 2,
				"y": 0,
				"z": 30
			});
		},
		
		// PlaceResistor
		function(){
			bottomNext = true;
			
			resistor_flame.Find("InnerCore").particleEmitter.maxEnergy = 0;
			
			// put resistor in place
			iTween.MoveTo( resistor, {
				"time": 2,
				"x": 4.231814,
				"y": 1.43999,
				"z": -4.954222
			});
			iTween.RotateTo( resistor, {
				"time": 2,
				"y": 340
			});
			
			// rearrange wire
			iTween.MoveTo( wire_a_end, {
				"time": 0.5,
				"delay": 2,
				"y": 2
			});
			iTween.MoveTo( wire_a_end, {
				"time": 1,
				"delay": 2.5,
				"x": 3.8,
				"z": -4.9
			});
			iTween.MoveTo( wire_a_end, {
				"time": 0.5,
				"delay": 3.5,
				"y": 1.1
			});
			
			StartCoroutine("PlaceResistor_callback");
			
		},
		
		// OpenEditor
		function() {
			Debug.Log("OpenEditor started");
			setBottom("Let's use our computer to program the Arduino. We are going to make the LED blink!\n<b>Open the Arduino program.</b>");
			bottomNext = false;
			//editorState = editorStates.visible;
			/*
			iTween.MoveTo(this.gameObject, {
				"time": 4,
				"x": 0.2779676,
				"y": 33.17332,
				"z": -46.50637
			});
			iTween.RotateTo(this.gameObject, {
				"time": 4,
				"x": 30.505,
				"y": 344.6743,
				"z": 354.1188
			});
			*/
			
			iTween.MoveTo(this.gameObject, {
				"time": 4,
				"x": -6,
				"y": 7.5,
				"z": -46
			});
			iTween.RotateTo(this.gameObject, {
				"time": 4,
				"x": 0,
				"y": 0,
				"z": 0
			});
			iTween.ValueTo(this.gameObject, {
				"time": 4f,
				"delay": 0.5f,
				"from": this.camera.fieldOfView,
				"to": 28,
				"onupdate": "iTweenZoomCameraCallback"
			});
			
			
		},
		
		// VerifyBlink
		function() {
			setBottom("This is Arduino code. First, verify the program by pressing the <i>verify</i> button");
		},
		
		
		// UploadBlink
		function() {
    		setBottom("That went OK. Now press the <i>upload</i> button to upload the compiled code to the Arduino!");			
		},
		
		// RunBlink
		function() {
    		blinking = true;
    		StartCoroutine("RunBlink_callback");
    		setBottom("Good job! The Arduino is now switching on and off it's power port, \nand therefore blinking our LED!");
    		bottomNext = true;
		},
		
		// ModifyBlink
		function() {
    		setBottom("Now the last challenge. Try to make the LED blink every 3 seconds.");
    		editMission = true;
			blinking = false;
		},
		
		// Overview
		function() {
		
			editorVisible = false;
		
			iTween.MoveTo(this.gameObject, {
				"time": 10,
				"x": -6.343922,
				"y": 20.97432,
				"z": -35.77119
			});
			iTween.RotateTo(this.gameObject, {
				"time": 10,
				"x": 30,
				"y": 10,
				"z": 0
			});
			
			StartCoroutine("Overview_callback");
		},
		
		// Finish
		function() {
			fadeOutScene = true;
		}
	];

	// Do stuff in advance
	broadboardWireExample.renderer.material.color = new Color(1, 0, 0.2, 0);
			
			// Create the wires
			var linePoints = new Vector3[lineSegments+1];
			wire_a = new VectorLine("wire_a", linePoints, Color(0.8f, 0, 0), null, 3.0, LineType.Continuous, Joins.Weld);
			wire_b = new VectorLine("wire_b", linePoints, Color(0, 0, 0), null, 3.0, LineType.Continuous, Joins.Weld);
	
	// Start the tutorial
	next();
	
	// debug, skip scenes
	for( var i = 0; i < skipAmount; i++ ) {
		next();
	}
}

function OnGUI() {
	// GUI styles etc
	GUI.skin.settings.cursorColor = Color.black;
	GUI.skin.settings.cursorFlashSpeed = 1;

	// Background
    //GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), bgTexture, ScaleMode.ScaleAndCrop, true, 0);
    
    // Render the 3D model above the background
    //camera.DoClear();
    //camera.Render();
    
    // Editor    
    if( editorVisible ) {
    	
    	// Window
    	GUI.DrawTexture(Rect(
    		( Screen.width - arduinoTexture.width ) / 2,
    		0,
    		arduinoTexture.width,
    		arduinoTexture.height
    	), arduinoTexture, ScaleMode.ScaleToFit, true, 0);
    	
    	// Verify button
    	if (GUI.Button(Rect( ( Screen.width - arduinoTexture.width ) / 2 + 62 ,62,23,23), "Verify", editorValidateStyle) ) {
    		editorLabelText = "Done compiling.";
    		if( editMission ) {
    			
    		} else {
    			playCompleteSound();
    			next();
    		}
    	}
    	
    	// Run button
    	if (GUI.Button(Rect( ( Screen.width - arduinoTexture.width ) / 2 + 89 ,62,23,23), "Upload", editorRunStyle) ) {
    		editorLabelText = "Uploading...";
    		if( editMission ) {
    			
    			if( stringToEdit.Contains("delay(3000)") ) {
    				blinking = true;
    				StartCoroutine("RunBlink3000_callback");
    			} else {
    				StartCoroutine("UploadFoo");
    			}
    			
    		} else {
    			playCompleteSound();
    			next();
    		}
    	}
    	
    	// Output
    	GUI.Label( Rect( ( Screen.width - arduinoTexture.width ) / 2 + 57 , 524, 500, 33), editorLabelText, editorLabelStyle);
    	
    	// Text editor
    	stringToEdit = GUI.TextArea (Rect (
    		( Screen.width - arduinoTexture.width ) / 2 + 57,
    		123,
    		arduinoTexture.width - 128,
    		arduinoTexture.height - 246
    	), stringToEdit, editorStyle);
    }
	
	// Bottom text and buttons
	GUI.DrawTexture(Rect(0, Screen.height-150, Screen.width, 150), gradientTexture, ScaleMode.StretchToFill, true, 0);	
	
	GUI.Label( Rect( 25, Screen.height-100, Screen.width, 75), bottomText, infotextStyle );
	
	if( bottomNext ) {
		if( GUI.Button( Rect( Screen.width - 100, Screen.height - 50, 75, 30), "Next") ) {
			next();
		}
	}
    		
    // Fade in/out
    if( overlayOpacity > 0 && !overlayCompleted ) { // Fade in scene
		GUI.color = new Color(0, 0, 0, overlayOpacity);
		GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), overlayTexture);
		overlayOpacity -= 0.01f;
		
		if( overlayOpacity <= 0.0f ) {
		
			overlayCompleted = true;
		}
		
	}
	
	if( fadeOutScene ) {
		// Fade out scene
		GUI.color = new Color(0 , 0, 0, overlayOpacity);
		GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), overlayTexture);
		overlayOpacity += 0.005f;
		
		if( overlayOpacity >= 1.0f ) {
		
			overlayCompleted = false;
			Application.LoadLevel("Finish");	
		}
		
	}
	
	guiFunction();
}

function Update () {

	// Update wire a
	var wire_a_center = (wire_a_start_helper.transform.position + wire_a_end_helper.transform.position ) /2 + new Vector3(0, 2.5, 0);

	wire_a.MakeCurve ([
		wire_a_start_helper.transform.position,
		wire_a_center,
		wire_a_end_helper.transform.position,
		wire_a_center
	], lineSegments);
	wire_a.Draw();
	
	// Update wire b
	var wire_b_center = (wire_b_start_helper.transform.position + wire_b_end_helper.transform.position ) /2 + new Vector3(0, 2.5, 0);

	wire_b.MakeCurve ([
		wire_b_start_helper.transform.position,
		wire_b_center,
		wire_b_end_helper.transform.position,
		wire_b_center
	], lineSegments);
	
	// Draw the wires
	wire_b.Draw();

	updateFunction();
}

function setBottom( text ) {
	bottomText = text;
}

function next() {
	Debug.Log("Next");
	currentMission++;
	
	bottomNext = false;
	bottomText = "";
	guiFunction = function(){};
	updateFunction = function(){};
	
	missions[ currentMission ]();
}

function playCompleteSound() {
	audio_complete.audio.Play();
}

// iTween callback functions
function iTweenZoomCameraCallback( value ) {
	this.camera.fieldOfView = value;
}

// Coroutines (setTimeout)
function ConnectTheCable_BlinkArduinoLed( times : int ) {
	for( var i = 0; i < 5; i++ ) {
		yield WaitForSeconds(0.05);
		arduinoLed.renderer.material.color = new Color(0.25f, 1, 0, 0.2);
		arduinoLed.GetComponent("Halo").enabled = false;
		yield WaitForSeconds(0.05);
		arduinoLed.renderer.material.color = new Color(0.25f, 1, 0, 1);
		arduinoLed.GetComponent("Halo").enabled = true;
	}	
}

function AddWires_callback() {
	yield WaitForSeconds(1.5);	
	led.Find("Sphere").GetComponent("Halo").enabled = true;
	playCompleteSound();
	setBottom("Well done! The power now flows from the Arduino, through the black wire,\nthrough the LED and back to the Arduino. You have made a <i>circuit</i>!");
	bottomNext = true;
}

function PlaceResistor_callback() {
	yield WaitForSeconds(2);
	led.Find("Sphere").GetComponent("Halo").enabled = false;
	led.Find("smoke").GetComponent(ParticleEmitter).particleEmitter.minSize = 0;
	led.Find("smoke").GetComponent(ParticleEmitter).particleEmitter.maxSize = 0;
	
	yield WaitForSeconds(2);
	//led.Find("smoke").GetComponent(ParticleRenderer).enabled = false;
	led.Find("Sphere").GetComponent("Halo").enabled = true;
	setBottom("This is a good circuit! The LED is safe now.");
	bottomNext = true;
}

function RunBlink_callback() {
	led.Find("Sphere").GetComponent("Halo").enabled = false;
	yield WaitForSeconds(2);
	editorLabelText = "Done";
	while( blinking ) {
		led.Find("Sphere").GetComponent("Halo").enabled = true;
		yield WaitForSeconds(1);
		led.Find("Sphere").GetComponent("Halo").enabled = false;
		yield WaitForSeconds(1);
	}
}

function RunBlink3000_callback() {	
	led.Find("Sphere").GetComponent("Halo").enabled = false;
	yield WaitForSeconds(2);
	bottomNext = true;
	setBottom("Well done, you are good!");
	playCompleteSound();
	editorLabelText = "Done";
	while( blinking ) {
		led.Find("Sphere").GetComponent("Halo").enabled = true;
		yield WaitForSeconds(3);
		led.Find("Sphere").GetComponent("Halo").enabled = false;
		yield WaitForSeconds(3);
	}
}

function UploadFoo() {
	yield WaitForSeconds(2);
	editorLabelText = "Done";
}

function Overview_callback() {
	yield WaitForSeconds(8);
	fadeOutScene = true;
}