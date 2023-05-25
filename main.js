import * as THREE from 'three';

let camera, scene, renderer;

init();
render();

function init() {

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 2;

  scene = new THREE.Scene();

  const vertices = [
    0, 0, 0,
    1, 0, 0,
    1, 1, 0,
    0, 1, 0
  ];
  const vertices1 = [
    0.5, 0.5, 0,
    0.5, 1.5, 0,
    -0.5, 1.5, 0,
    -0.5, 0.5, 0
  ];

  const material = new THREE.MeshBasicMaterial( { color: 0xfff000  } );
  const material1 = new THREE.MeshBasicMaterial({ color: 0x000fff });

  const myshape = createQuad(vertices,material1);
  scene.add(myshape);

  const shape2 = createQuad(vertices1,material)
  scene.add(shape2);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
 
}

function render() {

  renderer.render(scene, camera);

}

function getFarthestPoint(shape, direction) {
	const geometry = shape.geometry;
	const positionAttribute = geometry.getAttribute('position');
	const vertices = positionAttribute.array;
	const numVertices = vertices.length;
  
	if (numVertices === 0) {
	  return null; // No vertices in the shape
	}
    let newvertex = new THREE.Vector3(vertices[0],vertices[1],vertices[2]);
	let farthestPoint = new THREE.Vector3();
	farthestPoint.copy(newvertex).applyMatrix4(shape.matrixWorld);
	let maxProjection = farthestPoint.dot(direction);
  
	for (let i = 3; i < numVertices; i+=3) {
		let newvertex = new THREE.Vector3(vertices[i],vertices[i+1],vertices[i+2]);
		let vertex = new THREE.Vector3();
		vertex.copy(newvertex).applyMatrix4(shape.matrixWorld);
		let projection = vertex.dot(direction);
		if(projection > maxProjection){
			farthestPoint = vertex;
			maxProjection = projection;
	  	}
	}
	return farthestPoint;

}

function createQuad(vertices,material){
	const geometry = new THREE.BufferGeometry();
	const indices = [
		0, 1, 2, // first triangle
		2, 3, 0 // second triangle
	  ];
	  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	  geometry.setIndex(indices);
	  const myshape = new THREE.Mesh(geometry, material);
	  return myshape;
}
