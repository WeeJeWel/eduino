#pragma strict

function Start () {
	this.renderer.material.color = new Color(2,2,2);
}

function Update () {

}

function OnMouseOver() {
	this.renderer.material.color = new Color(3,3,3);
}

function OnMouseExit() {
	this.renderer.material.color = new Color(2,2,2);
}

function OnMouseUp() 
{
	var s : Lesson1 = Camera.main.GetComponent("Lesson1");
	s.editorVisible = true;
	s.next();
}