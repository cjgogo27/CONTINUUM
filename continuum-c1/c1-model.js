/* CONTINUUM C1 — original concept assembly. Units: millimetres.
   Geometry is an envelope-level industrial design, not a manufactured medical device.
   Electronics are schematic volumes; no implemented consciousness-reading mechanism. */
function createContinuumC1(T) {
  const root=new T.Group(); root.name='CONTINUUM_C1_CONCEPT_MM';
  const headset=new T.Group(); headset.name='HEADSET'; root.add(headset);
  const dock=new T.Group(); dock.name='ARCHIVE_DOCK'; root.add(dock);
  const parts=[], skins=[], paths=[];
  const mats={
    shell:new T.MeshStandardMaterial({color:0xe0e6e6,metalness:.32,roughness:.32}),
    dark:new T.MeshStandardMaterial({color:0x27363b,metalness:.28,roughness:.38}),
    soft:new T.MeshStandardMaterial({color:0x141c21,roughness:.92}),
    metal:new T.MeshStandardMaterial({color:0xa6b9be,metalness:.85,roughness:.28}),
    gold:new T.MeshStandardMaterial({color:0xc5a669,metalness:.72,roughness:.3}),
    pcb:new T.MeshStandardMaterial({color:0x216462,metalness:.18,roughness:.58}),
    chip:new T.MeshStandardMaterial({color:0x151f25,metalness:.1,roughness:.4}),
    blue:new T.MeshStandardMaterial({color:0x25bcca,emissive:0x1496a2,emissiveIntensity:.3,metalness:.35,roughness:.25}),
    glass:new T.MeshStandardMaterial({color:0x365d68,metalness:.32,roughness:.2}),
    amber:new T.MeshStandardMaterial({color:0xe6aa43,metalness:.35,roughness:.3})
  };
  Object.values(mats).forEach(m=>{m.color.convertSRGBToLinear();m.emissive.convertSRGBToLinear();});
  function group(id,name,parent,material,mechanism,size,explode,status='Design concept based on existing technology') {
    let g=new T.Group();g.name=id+'_'+name;g.userData={id,name,material,mechanism,size,explode,status};
    parent.add(g);parts.push(g);return g;
  }
  function mesh(g,geo,mat,pos=[0,0,0],rot=[0,0,0],skin=false){
    let m=new T.Mesh(geo,mat.clone());m.position.set(...pos);m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;
    g.add(m);m.userData.part=g.userData.id;m.userData.baseColor=m.material.color.getHex();
    if(skin){m.userData.skin=true;skins.push(m);}return m;
  }
  function shape(w,h,r){let s=new T.Shape(),x=-w/2,y=-h/2;r=Math.min(r,w/2-.01,h/2-.01);s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
  function box(g,w,h,d,pos,mat,r=2,skin=false){let geo=new T.ExtrudeGeometry(shape(w,h,r),{depth:d,bevelEnabled:false,curveSegments:6});geo.translate(0,0,-d/2);return mesh(g,geo,mat,pos,[0,0,0],skin);}
  function plate(g,w,d,h,pos,mat,r=8,skin=false){let geo=new T.ExtrudeGeometry(shape(w,d,r),{depth:h,bevelEnabled:false,curveSegments:10});geo.translate(0,0,-h/2);geo.rotateX(-Math.PI/2);return mesh(g,geo,mat,pos,[0,0,0],skin);}
  function frame(g,w,d,h,thickness,pos,mat,r=10,skin=false){let s=shape(w,d,r),hole=shape(w-2*thickness,d-2*thickness,Math.max(1,r-thickness));s.holes.push(new T.Path(hole.getPoints(12)));let geo=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:10});geo.translate(0,0,-h/2);geo.rotateX(-Math.PI/2);return mesh(g,geo,mat,pos,[0,0,0],skin);}
  function cylinder(g,r,h,pos,mat,normal=[0,1,0],r2=r){let m=mesh(g,new T.CylinderGeometry(r,r2,h,32),mat,pos);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...normal).normalize());return m;}
  function wire(g,points,r,mat){let c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));mesh(g,new T.TubeGeometry(c,48,r,6,false),mat);return c;}
  function ring(g,rx,rz,wide,h,y,mat,skin=false){let s=new T.Shape();s.absellipse(0,0,rx,rz,0,2*Math.PI,false,0);let hole=new T.Path();hole.absellipse(0,0,rx-wide,rz-wide,0,2*Math.PI,true,0);s.holes.push(hole);let geo=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:72});geo.translate(0,0,-h/2);geo.rotateX(-Math.PI/2);return mesh(g,geo,mat,[0,y,0],[0,0,0],skin);}
  function arch(g,x,y,zr,yr,w,t,mat,skin=false){let v=[],idx=[],n=48;for(let i=0;i<=n;i++){let a=Math.PI*i/n;for(let j=0;j<4;j++){let side=(j===0||j===3)?-1:1,rad=j<2?1:-1;v.push(x+side*w/2,y+yr*Math.sin(a)+rad*t/2*Math.sin(a),zr*Math.cos(a)+rad*t/2*Math.cos(a));}}
    for(let i=0;i<n;i++){for(let j=0;j<4;j++){let a=i*4+j,b=i*4+(j+1)%4,c=b+4,d=a+4;idx.push(a,b,d,b,c,d);}}idx.push(0,3,1,1,3,2);let b=n*4;idx.push(b,b+1,b+3,b+1,b+2,b+3);let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(idx);geo.computeVertexNormals();return mesh(g,geo,mat,[0,0,0],[0,0,0],skin);}
  function screw(g,p,normal=[0,1,0]){cylinder(g,2,1.2,p,mats.metal,normal);}
  function boardDetails(g,p,w,d){plate(g,w,d,1.6,p,mats.pcb,2);for(let i=-1;i<=1;i++)box(g,10,3,9,[p[0]+i*14,p[1]+2.4,p[2]],mats.chip,.5);for(let i=0;i<6;i++)box(g,3,1.5,2,[p[0]-20+i*8,p[1]+1.8,p[2]+d/2-4],mats.gold,.3);}

  let halo=group('H01','Headband',headset,'PC-ABS shell with an aluminum alloy frame','Holds the electrodes in position and supports the headset. It does not read consciousness.','Outer envelope: 204 × 240 × 16 mm',[0,8,0]);
  ring(halo,102,120,12,16,128,mats.shell,true);ring(halo,96,114,5,11,128,mats.dark);ring(halo,103,121,2,2,130,mats.metal);
  let liner=group('H02','Removable liner',headset,'Molded silicone or closed-cell foam','Distributes pressure. Skin-contact materials and fit still need validation.','Ring-shaped pad; nominal thickness: 5 mm',[0,-18,0]);ring(liner,91,109,6,10,126,mats.soft);
  let crown=group('H03','Crown arch',headset,'PC-ABS; nominal wall thickness: 4 mm','Connects the front and rear of the headband and leaves space for wiring.','Width: 22 mm; arch apex at approximately 217 mm',[0,72,0]);arch(crown,0,128,112,87,22,5,mats.shell,true);arch(crown,0,125,109,85,12,3,mats.soft);
  [-1,1].forEach((s)=>{let g=group(s<0?'H04':'H05',s<0?'Left electrode rail':'Right electrode rail',headset,'PC-ABS with compliant electrode mounts','Holds four electrodes. The rail curvature has not been validated for fit.','Width: 12 mm; centerline offset: ±52 mm',[s*40,45,0]);arch(g,s*52,128,96,72,12,4,mats.shell,true);});
  let electrodes=[];[-1,1].forEach((s)=>[72,26,-26,-72].forEach((z,j)=>{let x=s*52,y=128+72*Math.sqrt(1-z*z/(96*96)),normal=new T.Vector3(s*.37,.84,z/160).normalize();let id='E'+String((s<0?0:4)+j+1).padStart(2,'0');let g=group(id,(s<0?'Left':'Right')+' sensing electrode '+(j+1),headset,'Ag/AgCl contact placeholder with a compliant insulating mount','Intended to measure local scalp potential differences. It cannot read individual neurons or complete memories.','Module diameter: 23 mm; travel and contact pressure not yet specified',[s*25,92+j*5,z*.3]);let p=new T.Vector3(x,y,z);cylinder(g,11.5,9,p.toArray(),mats.dark,normal.toArray());cylinder(g,9,2,p.clone().addScaledVector(normal,-6).toArray(),mats.metal,normal.toArray());cylinder(g,7.5,1.5,p.clone().addScaledVector(normal,5.4).toArray(),mats.gold,normal.toArray());cylinder(g,3,2,p.clone().addScaledVector(normal,7).toArray(),mats.blue,normal.toArray());electrodes.push({g,p,normal});}));
  let refs=group('E09','Reference and bias contacts',headset,'Surface electrodes with insulated silicone fittings','Provide a reference potential and a bias connection for acquisition. They do not write information to the brain.','Two contacts, each 12 mm in diameter',[0,-40,-20]);[-1,1].forEach(s=>{wire(refs,[[s*87,126,-59],[s*91,112,-62],[s*88,102,-64]],2,mats.soft);cylinder(refs,6,3,[s*86,102,-64],mats.metal,[s,0,0]);});
  let cable=group('H06','Signal cable harness',headset,'Shielded wires or flexible circuit placeholder','Routes eight electrode signals to the analog front end, upstream of the wireless link.','8 signal channels plus reference and bias',[0,40,-25]);
  electrodes.forEach(({p})=>{let x=p.x,z=p.z,y=p.y;wire(cable,[[x,y+7,z],[x,203,0],[x*.6,167,-91],[x*.25,140,-126]],.8,mats.dark);paths.push({from:p.toArray(),to:[0,139,-128]});});
  let rearShell=group('H07','Rear electronics enclosure',headset,'PC-ABS shell; nominal wall thickness: 2.5 mm','Houses the analog front end and digital control board. The enclosure itself has no sensing function.','78 × 34 × 35 mm',[0,25,-75]);
  box(rearShell,78,34,2.5,[0,137,-148],mats.shell,8,true);box(rearShell,78,3,32,[0,121.5,-131],mats.shell,1,true);box(rearShell,78,3,32,[0,152.5,-131],mats.shell,1,true);[-1,1].forEach(s=>box(rearShell,2.5,29,32,[s*37.75,137,-131],mats.shell,1,true));
  let afe=group('H08','Analog front end and ADC board',headset,'FR-4 board with placeholder analog front end and ADC packages','Amplifies and conditions the potential difference, then converts it to digital samples. Component locations are provisional.','Board outline: 64 × 24 mm',[0,55,-52]);boardDetails(afe,[0,133,-131],64,24);
  let ctrl=group('H09','Controller and radio board',headset,'FR-4 board with placeholder MCU, buffer and radio packages','Timestamps, buffers and packages samples for wireless transmission to the dock.','Board outline: 55 × 22 mm',[0,90,-73]);boardDetails(ctrl,[0,144,-131],55,22);wire(ctrl,[[-26,148,-140],[-26,149,-122],[25,149,-122]],.65,mats.gold);
  let power=group('H10','Removable battery pack',headset,'Insulated housing with a placeholder protected battery pack','Powers acquisition and communication only. The design excludes charging while worn.','Outer envelope: 24 × 27 × 64 mm',[-70,0,0]);box(power,24,27,64,[-108,128,-22],mats.dark,7,true);box(power,17,19,45,[-108,128,-22],mats.metal,4);box(power,2.2,8,22,[-121,130,-22],mats.blue,1);
  let adjust=group('H11','Rear adjustment dial',headset,'Polymer knob with a placeholder adjustment mechanism','Illustrates the fit adjustment. The gearing, strap length and load-bearing parts are not engineered.','Dial diameter: 29 mm',[0,0,-95]);cylinder(adjust,14.5,9,[0,133,-155],mats.dark,[0,0,1]);cylinder(adjust,10.5,1,[0,133,-160],mats.metal,[0,0,1]);
  let status=group('H12','Front status strip',headset,'Translucent polycarbonate with a placeholder LED board','Indicates contact, recording and transmission status. It does not indicate consciousness upload progress.','54 × 15 × 8 mm',[0,0,50]);box(status,54,15,8,[0,128,119],mats.dark,5,true);for(let i=-1;i<=1;i++)box(status,9,2,1,[i*13,128,123.7],mats.blue,.8);

  let base=group('D01','Lower dock housing',dock,'PC-ABS shell and load-bearing aluminum baseplate','Supports the storage and receiver modules. The headset communicates with the dock wirelessly.','240 × 190 × 44 mm',[0,-12,0]);
  plate(base,240,190,4,[0,5,0],mats.dark,24);frame(base,240,190,36,3,[0,25,0],mats.shell,24,true);
  let lid=group('D02','Removable dock lid',dock,'PC-ABS; nominal thickness: 3 mm','Covers the dock. The exploded view reveals the proposed internal layout.','240 × 190 × 3 mm',[0,45,0]);plate(lid,240,190,3,[0,44.5,0],mats.shell,24,true);
  let cradle=group('D03','Headset cradle and pads',dock,'PC-ABS with silicone pads','Supports the headset when parked. The cradle does not connect to the electrodes.','Support height: 77 mm',[0,20,0]);[-1,1].forEach(s=>{box(cradle,15,65,25,[s*73,78,-37],mats.dark,5);box(cradle,25,8,35,[s*73,113,-37],mats.soft,4);});
  let mainboard=group('D04','Receiver and encryption board',dock,'FR-4 with placeholder processor and security chip','Receives, verifies and encrypts data before local storage. This software has not been implemented.','96 × 70 mm',[-72,80,0]);boardDetails(mainboard,[-44,17,-10],96,70);plate(mainboard,24,24,7,[-46,23,-10],mats.metal,3);for(let i=0;i<5;i++)box(mainboard,21,3,1,[-46,28,-18+i*4],mats.dark,.3);
  let storage=group('D05','Removable storage module',dock,'M.2 SSD form-factor placeholder with a metal carrier','Intended to store encrypted EEG recordings and related files. It does not store consciousness.','Carrier: 34 × 92 × 9 mm',[85,65,45]);plate(storage,34,92,3,[64,17,6],mats.metal,4);boardDetails(storage,[64,20,6],22,80);plate(storage,30,85,2,[64,25,6],mats.dark,3);
  let io=group('D06','Power and network ports',dock,'Insulated mounts with placeholder connectors','Provide dock power and network access. Connector types have not been selected.','Ports are at the rear of the dock',[0,35,-90]);box(io,15,7,5,[-42,24,-96],mats.dark,2);box(io,18,14,5,[-13,24,-96],mats.dark,2);box(io,22,8,5,[23,24,-96],mats.dark,2);
  let indicator=group('D07','Sync status panel',dock,'Translucent cover with a placeholder LED array or display','Indicates recording synchronization status. The animation illustrates the proposed data path.','88 × 15 × 3 mm',[0,0,45]);box(indicator,88,15,3,[0,25,95.8],mats.glass,4);for(let i=0;i<7;i++)box(indicator,5,2,1,[-28+i*9,25,97.7],mats.blue,.5);
  let foot=group('D08','Non-slip feet and fasteners',dock,'Silicone feet with placeholder M3 fasteners','Stabilize the dock on a desk. Hole positions and tolerances are not ready for production.','Four feet, each 18 mm in diameter',[0,-30,0]);[-1,1].forEach(s=>[-1,1].forEach(t=>{cylinder(foot,9,4,[s*88,1,t*61],mats.soft);screw(foot,[s*100,43,t*70]);}));
  let port=group('D09','Reserved research bay',dock,'Blank insulating cover; no consciousness-reading hardware','Reserves space for future work. The design provides no method for reading a whole-brain state, encoding consciousness or preserving subjective continuity.','Reserved space: 42 × 30 × 15 mm',[65,100,-60],'Unimplemented research interface; no consciousness upload function');frame(port,42,30,15,2,[65,19,-62],mats.amber,4);plate(port,42,30,2,[65,28,-62],mats.dark,4,true);
  root.userData={title:'CONTINUUM C1',version:'0.1-concept',units:'millimetres',scope:'Industrial design concept; not production CAD or an implemented consciousness uploader',channels:8,referenceContacts:2};
  root.updateMatrixWorld(true);
  return {root,headset,dock,parts,skins,mats,paths,electrodes};
}
