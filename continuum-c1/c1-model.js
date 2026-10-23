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
  function group(id,name,parent,material,mechanism,size,explode,status='现有技术可支撑的功能概念') {
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

  let halo=group('H01','主头环',headset,'PC-ABS外壳／内部铝合金骨架','提供电极位置与佩戴支撑；不参与意识读取','外包络 204 × 240 × 16 mm',[0,8,0]);
  ring(halo,102,120,12,16,128,mats.shell,true);ring(halo,96,114,5,11,128,mats.dark);ring(halo,103,121,2,2,130,mats.metal);
  let liner=group('H02','可拆软衬',headset,'成型硅胶／闭孔泡棉','分散压力；接触皮肤部分需另行完成适配与材料验证','环形衬垫，名义厚度 5 mm',[0,-18,0]);ring(liner,91,109,6,10,126,mats.soft);
  let crown=group('H03','顶部主梁',headset,'PC-ABS，名义壁厚 4 mm','连接前后头环；内部预留线束空间','宽 22 mm；拱顶约 217 mm',[0,72,0]);arch(crown,0,128,112,87,22,5,mats.shell,true);arch(crown,0,125,109,85,12,3,mats.soft);
  [-1,1].forEach((s)=>{let g=group(s<0?'H04':'H05',s<0?'左电极导轨':'右电极导轨',headset,'PC-ABS／弹性电极支座','固定四个电极模块；弧线为概念尺寸，尚未进行头型适配','宽 12 mm；中心偏置 ±52 mm',[s*40,45,0]);arch(g,s*52,128,96,72,12,4,mats.shell,true);});
  let electrodes=[];[-1,1].forEach((s)=>[72,26,-26,-72].forEach((z,j)=>{let x=s*52,y=128+72*Math.sqrt(1-z*z/(96*96)),normal=new T.Vector3(s*.37,.84,z/160).normalize();let id='E'+String((s<0?0:4)+j+1).padStart(2,'0');let g=group(id,(s<0?'左':'右')+'侧采集电极 '+(j+1),headset,'银／氯化银接触件占位；弹性绝缘支座','记录局部头皮电位差；不能读取单个神经元或完整记忆','模块直径 23 mm；行程与接触压力待设计',[s*25,92+j*5,z*.3]);let p=new T.Vector3(x,y,z);cylinder(g,11.5,9,p.toArray(),mats.dark,normal.toArray());cylinder(g,9,2,p.clone().addScaledVector(normal,-6).toArray(),mats.metal,normal.toArray());cylinder(g,7.5,1.5,p.clone().addScaledVector(normal,5.4).toArray(),mats.gold,normal.toArray());cylinder(g,3,2,p.clone().addScaledVector(normal,7).toArray(),mats.blue,normal.toArray());electrodes.push({g,p,normal});}));
  let refs=group('E09','参考与偏置接触组件',headset,'表面电极／硅胶绝缘连接件','提供参考电位和采集系统偏置连接；不是向脑内写入信息','2 个接触件，直径 12 mm',[0,-40,-20]);[-1,1].forEach(s=>{wire(refs,[[s*87,126,-59],[s*91,112,-62],[s*88,102,-64]],2,mats.soft);cylinder(refs,6,3,[s*86,102,-64],mats.metal,[s,0,0]);});
  let cable=group('H06','低噪声信号线束',headset,'屏蔽导线／柔性线路占位','将电极信号接入模拟前端；与无线传输链路分离','8 路信号＋参考／偏置',[0,40,-25]);
  electrodes.forEach(({p})=>{let x=p.x,z=p.z,y=p.y;wire(cable,[[x,y+7,z],[x,203,0],[x*.6,167,-91],[x*.25,140,-126]],.8,mats.dark);paths.push({from:p.toArray(),to:[0,139,-128]});});
  let rearShell=group('H07','后部电子舱',headset,'PC-ABS外壳，名义壁厚 2.5 mm','收纳模拟前端与数字控制板；壳体不产生神经读取能力','78 × 34 × 35 mm',[0,25,-75]);
  box(rearShell,78,34,2.5,[0,137,-148],mats.shell,8,true);box(rearShell,78,3,32,[0,121.5,-131],mats.shell,1,true);box(rearShell,78,3,32,[0,152.5,-131],mats.shell,1,true);[-1,1].forEach(s=>box(rearShell,2.5,29,32,[s*37.75,137,-131],mats.shell,1,true));
  let afe=group('H08','AFE／ADC采集板',headset,'FR-4板／模拟前端与ADC占位封装','电位差 → 放大与调理 → 模数转换；器件位置仅为占位','板外形 64 × 24 mm',[0,55,-52]);boardDetails(afe,[0,133,-131],64,24);
  let ctrl=group('H09','控制与无线板',headset,'FR-4板／MCU、缓存与无线芯片占位','加时间标记、缓存、打包；无线发送到接收端','板外形 55 × 22 mm',[0,90,-73]);boardDetails(ctrl,[0,144,-131],55,22);wire(ctrl,[[-26,148,-140],[-26,149,-122],[25,149,-122]],.65,mats.gold);
  let power=group('H10','可拆电池组件',headset,'绝缘电池盒／受保护电池包占位','只为采集与通信供电；佩戴时不充电','外包络 24 × 27 × 64 mm',[-70,0,0]);box(power,24,27,64,[-108,128,-22],mats.dark,7,true);box(power,17,19,45,[-108,128,-22],mats.metal,4);box(power,2.2,8,22,[-121,130,-22],mats.blue,1);
  let adjust=group('H11','后部松紧调节',headset,'聚合物旋钮／机械调节占位','提供佩戴调节意图；齿轮、带长与受力结构尚未工程化','旋钮直径 29 mm',[0,0,-95]);cylinder(adjust,14.5,9,[0,133,-155],mats.dark,[0,0,1]);cylinder(adjust,10.5,1,[0,133,-160],mats.metal,[0,0,1]);
  let status=group('H12','前部状态条',headset,'PC透光件／LED板占位','显示接触、采集与传输状态；不显示“意识上传进度”','54 × 15 × 8 mm',[0,0,50]);box(status,54,15,8,[0,128,119],mats.dark,5,true);for(let i=-1;i<=1;i++)box(status,9,2,1,[i*13,128,123.7],mats.blue,.8);

  let base=group('D01','底座下壳',dock,'PC-ABS／铝质承重底板','固定存储与接收组件；与头部设备仅通过无线通信','240 × 190 × 44 mm',[0,-12,0]);
  plate(base,240,190,4,[0,5,0],mats.dark,24);frame(base,240,190,36,3,[0,25,0],mats.shell,24,true);
  let lid=group('D02','可拆底座上盖',dock,'PC-ABS，名义厚度 3 mm','覆盖存储底座；爆炸视图可查看内部概念布局','240 × 190 × 3 mm',[0,45,0]);plate(lid,240,190,3,[0,44.5,0],mats.shell,24,true);
  let cradle=group('D03','停放支架与软垫',dock,'PC-ABS／硅胶软垫','承托闲置头环；停放支架不连接人体电极','支撑高度 77 mm',[0,20,0]);[-1,1].forEach(s=>{box(cradle,15,65,25,[s*73,78,-37],mats.dark,5);box(cradle,25,8,35,[s*73,113,-37],mats.soft,4);});
  let mainboard=group('D04','接收与加密处理板',dock,'FR-4／处理器与安全芯片占位','接收数据 → 校验 → 加密 → 本地存储；所需软件尚未实现','96 × 70 mm',[-72,80,0]);boardDetails(mainboard,[-44,17,-10],96,70);plate(mainboard,24,24,7,[-46,23,-10],mats.metal,3);for(let i=0;i<5;i++)box(mainboard,21,3,1,[-46,28,-18+i*4],mats.dark,.3);
  let storage=group('D05','可移除存储模块',dock,'M.2 SSD外形占位／金属保护托架','保存加密脑电与资料；不是意识存储介质','托架 34 × 92 × 9 mm',[85,65,45]);plate(storage,34,92,3,[64,17,6],mats.metal,4);boardDetails(storage,[64,20,6],22,80);plate(storage,30,85,2,[64,25,6],mats.dark,3);
  let io=group('D06','电源与网络接口',dock,'绝缘接口座／连接器占位','为底座供电并接入网络；具体连接器型号待工程选型','接口布置于底座后侧',[0,35,-90]);box(io,15,7,5,[-42,24,-96],mats.dark,2);box(io,18,14,5,[-13,24,-96],mats.dark,2);box(io,22,8,5,[23,24,-96],mats.dark,2);
  let indicator=group('D07','同步状态面板',dock,'透光盖板／LED或屏幕占位','显示采集数据同步状态；动画为机理示意','88 × 15 × 3 mm',[0,0,45]);box(indicator,88,15,3,[0,25,95.8],mats.glass,4);for(let i=0;i<7;i++)box(indicator,5,2,1,[-28+i*9,25,97.7],mats.blue,.5);
  let foot=group('D08','防滑脚垫与紧固件',dock,'硅胶脚垫／M3紧固件占位','稳定桌面设备；孔位与公差尚未完成生产设计','4 个脚垫，直径 18 mm',[0,-30,0]);[-1,1].forEach(s=>[-1,1].forEach(t=>{cylinder(foot,9,4,[s*88,1,t*61],mats.soft);screw(foot,[s*100,43,t*70]);}));
  let port=group('D09','未来研究接口占位',dock,'空白绝缘盖板；没有意识读取器件','仅预留扩展空间；全脑状态读取、意识编码与主体连续性没有已知实现','占位空间 42 × 30 × 15 mm',[65,100,-60],'未实现的研究接口，不具备意识上传功能');frame(port,42,30,15,2,[65,19,-62],mats.amber,4);plate(port,42,30,2,[65,28,-62],mats.dark,4,true);
  root.userData={title:'续存 C1 / CONTINUUM',version:'0.1-concept',units:'millimetres',scope:'Industrial design concept; not production CAD or an implemented consciousness uploader',channels:8,referenceContacts:2};
  root.updateMatrixWorld(true);
  return {root,headset,dock,parts,skins,mats,paths,electrodes};
}
