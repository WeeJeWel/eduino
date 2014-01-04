using UnityEngine;
using System.Collections;
 
[RequireComponent(typeof(MeshCollider))]
 
public class Drag : MonoBehaviour
{
	
	public bool dragOnXAxis = true;
	public bool dragOnYAxis = true;
	public bool dragOnZAxis = true;
	
	public Transform child;
	
	private Vector3 screenPoint;
	private Vector3 offset;
	
	private Color oldColor;
	
	void Start() {		
		//oldColor = this.renderer.material.color;		
	}
	
	void OnMouseOver() {	
		//setColor();
	}
	
	void OnMouseExit() {
		//unsetColor();
	}
	
	void OnMouseDown()
	{
		if( child ) {
			screenPoint = Camera.main.WorldToScreenPoint(child.gameObject.transform.position);
			offset = child.gameObject.transform.position - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenPoint.z));
		} else {
			screenPoint = Camera.main.WorldToScreenPoint(gameObject.transform.position);
			offset = gameObject.transform.position - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenPoint.z));
		}
	}
	 
	void OnMouseDrag()
	{
		//setColor();
		
		Vector3 curScreenPoint = new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenPoint.z);
		 
		Vector3 curPosition = Camera.main.ScreenToWorldPoint(curScreenPoint) + offset;
		
		if( !dragOnXAxis ) {
			curPosition.x = this.transform.position.x;
		}
		if( !dragOnYAxis ) {
			curPosition.y = this.transform.position.y;
		}
		if( !dragOnZAxis ) {
			curPosition.z = this.transform.position.z;
		}
		
		transform.position = curPosition;
		
		if( child ) {
			child.transform.position = curPosition;
		}
	 
	}
	
	void setColor() {
		this.renderer.material.color = new Color(0, 0.6f, 0);			
	}
	
	void unsetColor() {
		this.renderer.material.color = oldColor;			
	}
 
}