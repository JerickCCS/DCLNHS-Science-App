import{c as W,o as I,w as l,a as s,H as o,Q as m,V as A,J as P,$ as j,G as U,Z as G,a0 as J,N as Y,O as B,Y as Z,a1 as K,S as X,R as $,m as u,e as L,a2 as ee,n as te,U as ae,a3 as ie,F as se,P as M}from"./index-CmL3c1Ml.js";import{Q as oe,c as le}from"./lessonBackground.css_vue_type_style_index_0_src_true_lang-BPnM_jjp.js";import{Q as ne}from"./QToolbar-BCkdDmum.js";import{Q as re}from"./QHeader-CAl7Qje9.js";import{Q as de}from"./QLinearProgress-DWcSpnXV.js";import{Q as ce}from"./QPage-0yw1Xnyg.js";import{Q as ve}from"./QPageContainer-D_--Wqgv.js";import{Q as pe}from"./QLayout-DBusqh9Z.js";import{C as ue}from"./ClosePopup-kr1oCrOw.js";import{u as he}from"./useTTS-C95BXznO.js";import{g as f,s as ge}from"./session-CxZR9QsD.js";import{f as me}from"./lessons-Dp0zXrbx.js";import"./modelViewer-3VdA1PxK.js";import{_ as fe}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./QResizeObserver-CUBW-q3m.js";const ke={name:"ScientificModelsLesson",setup(){const c=X(),a=$(),n=u(0),e=u(0),C=u(!1),{isPlaying:k,toggleAudio:h,stopSpeaking:q}=he(),r=u(f());let b=null;const F=me.find(t=>t.route===c.path),w=F?String(F.id):"71",y=u([]),g=u([`
  <div>
    <!-- Card 1 -->
    <div class="header">
      <div>
        <div class="title">What Are Earthquakes?</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/earthquake.gif" alt="Placeholder">
      <p>Earthquakes are sudden, rapid shaking of the ground caused by the breaking and shifting of rock beneath the Earth's surface. They can happen anywhere, but occur most frequently along fault lines.</p>
      <div class="fun-fact-card">
        <span class="highlight">Fun Fact:</span> Our country is located in an earthquake-prone region. Did you know that earthquakes are recorded in the Philippines every day? Fortunately, most of them are too weak to be felt or noticed.
      </div>
    </div>
  </div>
  `,`
  <div>
    <!-- Card 2 -->
    <div class="header">
      <div>
        <div class="title">Why Do Earthquakes Happen?</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/plate tectonics.png" alt="Placeholder">
    </div>
    <p>The Earth's crust is made up of tectonic plates that are constantly moving. When these plates get stuck at their edges due to friction, stress builds up. When the stress exceeds the friction, the plates suddenly slip, releasing energy as seismic waves.</p>
    <div class="fun-fact-card">
      <span class="highlight">Fun Fact:</span> Plate Fact: The Philippines sits at the boundary of two major tectonic plates - the Philippine Sea Plate and the Eurasian Plate.
    </div>
  </div>
  `,`
  <div>
    <!-- Card 3 -->
    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/animation.webm" type="video/webm">
          </video>
          <div class="caption">Animation showing how earthquakes occur along faults due to the movement of tectonic plates.</div>
          </div>
  </div>
  `,`
  <div>
    <!-- Card 4 -->
    <div class="header">
      <div>
        <div class="title">Focus and Epicenter</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/figure 10-1.png" alt="Placeholder">
      <div class="caption">Figure 10-1. The epicenter of an earthquake is located directly above its focus, or the point of origin of an earthquake.</div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/lv_0_20260124190522.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">What is focus and types of earthquakes?</div>
        </div>
  </div>
  `,`
  <div>
    <!-- Card 5 -->
    <div class="info-card">
      <div class="info-title">Mini Test 10-1</div>
      <div class="info-content">
        <div class="info-text">
          <p style="text-align: center;"><strong>What is the difference between the epicenter and the focus of an earthquake? How do faults generate earthquakes?</strong></p>
          <p style="text-align: center; color: purple;">Present your answers by doing one of the following:</p>
          <p>1. Create an animation.</p>
          <p>2. Act out the concept.</p>
          <p>3. Write a news article.</p>
        </div>
      </div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/fblite_video.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The Earth's tectonic plates and their movement.</div>
        </div>
  </div>
  `,`
  <div>
    <!-- Card 6 -->
    <div class="header">
      <div>
        <div class="title">Active and Inactive Faults</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/slide6.png" alt="Placeholder">
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/IMG_20260124_191358_804fblite_video.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">Active and inactive faults.</div>
        </div>
  </div>
  `,`
  <div>
    <!-- Card 7 -->
    <div class="header">
      <div>
        <div class="title">Dip-Slip, Strike-Slip, and Oblique-Slip Faults</div>
      </div>
    </div>

    <p>In a dip-slip fault, the ground moves either up or down along the slope of the fault. The dip is the angle the fault makes with respect to the surface. The block above the fault is the hanging wall, while the block below is the footwall. Depending on how these blocks move in relation to the hanging wall and footwall, dip-slip faults are categorized as normal or reverse. In a normal dip-slip fault (figure 10-2A), the hanging wall moves down in relation to the footwall. In a reverse dip-slip fault, the opposite happens; the hanging wall moves up in relation to the footwall (figure 10-2B).</p>
  </div>
  `,`
  <div>
    <!-- Card 8 -->
    <p>In a strike-slip fault, the blocks move side to side, sliding past one another (figure 10-2C). The strike is where the fault cuts across a horizontal surface. In a sinistral strike-slip fault, a fault block moves to the left with respect to the opposite block. In a dextral strike-slip fault, the movement is to the right.</p>
    <div class="model-viewer-block">
        <model-viewer src="models/strike_slip.glb" alt="Strike-slip fault" camera-controls auto-rotate interaction-prompt="auto" loading="eager"></model-viewer>
        <a href="/html/strike_slip.html" class="eye-icon">
          <img src="assets/icons/eye.png" alt="View 3D Model" />
        </a>
        <div class="caption">Strike-slip Fault Model</div>
      </div>
    <div class="fun-fact-card">
      <span class="highlight">Science Tips:</span> Hanging wall and footwall are mining terms that have been adopted in geology. In mining, a hanging wall is the mass of rock overlying mineral deposits, while a footwall is the rock below the mass. These terms are used by geologists to refer to the block of rock above the fault plane (hanging wall) and the block below (footwall).
    </div>
  </div>
  `,`
  <div>
    <!-- Card 9 -->
    <div class="header">
      <div>
        <div class="title">Oblique-Slip Faults</div>
      </div>
    </div>

    <p>An oblique-slip fault exhibits both dip-slip and strike-slip displacements: either an upward or downward sliding of the fault block, and a horizontal movement to the left or to the right of one fault block with respect to the opposite block (figure 10-2D)</p>

    <div class="illustration">
      <img src="assets/img/chapter 10/figure10-2.png" alt="Placeholder">
      <div class="caption">Figure 10-2. Different faults based on orientation of displacement: (a) normal dip-slip fault, (b) reverse dip-slip fault, (c) strike-slip fault, and (d) oblique-slip fault.</div>
    </div>
  </div>
  `,`
  <div>
    <!-- Card 10 -->
    <div class="header">
      <div>
        <div class="title">Apply Your Knowledge</div>
      </div>
    </div>

    <p>Now that you've learned about different types of faults and how they generate earthquakes, it's time to apply this knowledge. The next activity will challenge you to demonstrate your understanding through a practical exercise.</p>

    <div class="info-card">
      <div class="info-title">MINI LAB 10-2</div>
      <div class="info-content">
        <div class="info-text">
          <p>Apply what you have learned by performing the activity on faults. Click the button to go to the next page.</p>
          <div class="start-btn-container">
            <q-btn data-route="/mini-lab-10-2" unelevated class="start-btn">
              Answer
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,`
  <div>
    <!-- Card 11 -->
    <div class="header">
      <div>
        <div class="title">How Movement along Faults Generate Earthquakes</div>
      </div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/1769331258299.mp4" controls alt="figure 11-3" type="video/mp4">
          </video>
          <div class="caption">Three Basic Fault Types</div>
        </div>
    <p>At or near tectonic plate boundaries, there is a large concentration of faults. The reason for this is that the movement of tectonic plates provides stress. Rocks on the Earth's surface break in response to this stress.</p>
  </div>
  `,`
  <div>
    <!-- Card 12 -->
    <div class="header">
      <div>
        <div class="title">Normal Faults</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/Normal Fault-12.png" alt="Placeholder">
    </div>

    <p>Normal faults are caused by rocks being stretched. They are formed as a block of rock falls after being fractured. Sudden movement along these faults causes earthquakes as the movement releases stored up energy. The earthquake focus is the place where the rocks break.</p>
  </div>
  `,`
      <div class="illustration">
      <img src="assets/img/chapter 10/Normal_Fault (1).gif" alt="Placeholder">
      <div class="caption">Normal Fault Animation</div>
    </div>
      </div>
 `,`
  <div>
    <!-- Card 13 -->
    <div class="header">
      <div>
        <div class="title">Reverse Fault Earthquakes</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/Reverse Fault-13.png" alt="Placeholder">
    </div>

    <p>In a reverse fault, the hanging wall has moved upward relative to the footwall due to compressional force. Earthquakes happen due to this sudden movement.</p>
  </div>
  `,`
      <div class="illustration">
      <img src="assets/img/chapter 10/Reverse_Fault (1).gif" alt="Placeholder">
      <div class="caption">Reverse Fault Animation</div>
    </div>
      </div>
 `,`
  <div>
    <!-- Card 14 -->
    <div class="header">
      <div>
        <div class="title">Strike-Slip Fault Earthquakes</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/Strike Fault-14.jpg" alt="Placeholder">
    </div>

    <p>In strike-slip faults, two plates move horizontally sideways in opposite directions. As the plates move against one another, strain is built up. As energy is released, earthquakes occur. Strike-slip faults can produce major earthquakes with a magnitude as great as 8.</p>
  </div>
  `,`
      <div>
  <div class="illustration">
      <img src="assets/img/chapter 10/Strike-Slip_Fault.gif" alt="Placeholder">
      <div class="caption">Strike-Slip Fault Animation</div>
    </div>
      </div>
 `,`
  <div>
    <!-- Card 15 -->
    <div class="header">
      <div>
        <div class="title">Mini Test 10-2</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">MINI TEST 10-2</div>
      <div class="info-content">
        <div class="info-text">
          <p>1. Draw the graphic organizer on your paper as shown below.</p>
          <p>2. For each set of rectangles, fill the top with the tectonic plate and the bottom with the associated type of fault.</p>

          <div class="illustration">
            <img src="assets/img/chapter 10/mini test 10-2.png" alt="Placeholder">
          </div>

          <div class="start-btn-container">
            <q-btn data-route="/mini-test-10-2" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,`
  <div>
    <!-- Card 16 -->
    <div class="header">
      <div>
        <div class="title">Types of Faults in the Philippines</div>
      </div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter10-lesson1.mp4" controls alt="philippine fault" type="video/mp4">
          </video>
          <div class="caption">The Types of Faults in the Philippines Animation</div>
        </div>
  </div>
  `,`
  <div>
    <!-- Card 18 -->
    <p>The Philippines is considered one of the most tectonically and seismically active areas in the world. PHIVOLCS records at least five earthquakes a day in the Philippines, all of which are due to active faults.</p>
    <p>The Philippine Fault Zone (PFZ) is an important tectonic and seismic feature that cuts across the Philippine archipelago from northwestern Luzon to southeastern Mindanao. The PFZ is generally strike-slip in nature and is made up of several segments. Large magnitude earthquakes in recent years originated from this fault zone.</p>

    <div class="fun-fact-card">
      <span class="highlight">Did You Know?:</span> During an earthquake, stay away from windows, heavy furniture, and objects that could fall.
    </div>
  </div>
  `,`
  <div>
    <!-- Card 19 -->
    <div class="header">
      <div>
        <div class="title">Philippine Fault Lines</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/philippines-map.jpeg" alt="Placeholder">
      <div class="caption">Figure 10-3: Distribution of active faults in the Philippines</div>
    </div>
  </div>
  `,`
  <div>
    <!-- Card 20 -->
    <div class="header">
      <div>
        <div class="title">Mini Lab 10-3</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">Mini Lab 10-3</div>
      <div class="info-content">
        <div class="info-text">
          <p>Fill in the second column with examples of the type of faults found in the Philippines.</p>

          <div class="illustration">
            <img src="assets/img/chapter 10/mini lab 10-3.png" alt="Placeholder">
          </div>

          <div class="start-btn-container">
            <q-btn data-route="/mini-lab-10-3" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,`
  <div>
    <!-- Card 21 -->
    <div class="info-card">
      <div class="info-title">MINI TEST 10-3</div>
      <div class="info-content">
        <div class="info-text">
         
          <div class="illustration">
            <img src="assets/img/chapter 10/mini test 10-3.png" alt="Placeholder">
          </div>

          <div class="start-btn-container">
            <q-btn data-route="/mini-test-10-3" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  `]),Q=L(()=>r.value?.progress?.[w]?.completed||!1),x=()=>{if(!r.value)return;r.value.progress||(r.value.progress={}),r.value.progress[w]={...r.value.progress[w],completed:!0},ge(r.value);let t=M.getItem("students")||[];t=t.map(i=>i.id===r.value.id?{...i,progress:r.value.progress}:i),M.set("students",t),r.value=f()},E={background:"#fe3223",color:"#fff",boxShadow:"0 8px 0 0 #db0e00"},N=t=>{const i=f();if(!i)return;const p=i.studentId??i.id??i.name;let v=JSON.parse(localStorage.getItem("bookmarks")||"{}");v[p]=t,localStorage.setItem("bookmarks",JSON.stringify(v))},S=()=>{const t=f();if(!t)return[];const i=t.studentId??t.id??t.name;return JSON.parse(localStorage.getItem("bookmarks")||"{}")[i]||[]},D=()=>{const t={route:c.name||c.path,page:n.value,lessonId:w};let i=S();const p=i.findIndex(v=>v.route===t.route&&v.page===t.page);p!==-1?i.splice(p,1):i.push(t),N(i),y.value=S()},H=L(()=>y.value.some(t=>t.route===(c.name||c.path)&&t.page===n.value)),_=()=>{e.value=(n.value+1)/g.value.length};ee(()=>{q()});const O=()=>{k.value&&q(),n.value<g.value.length-1?(n.value++,_()):(x(),C.value=!0)},R=()=>{k.value&&q(),n.value>0&&(n.value--,_())},z=()=>{window.history.length>1?a.back():a.push("/chapters")};te(n,t=>{a.replace({path:c.path,query:{page:t}})});const V=()=>{T();const t=document.getElementById("lesson-complete-audio");t&&(t.currentTime=0,t.play().catch(()=>{})),b=setInterval(()=>{le({particleCount:60,spread:70,origin:{y:.6}})},500)},T=()=>{b&&(clearInterval(b),b=null)};return ae(()=>{if(!c.query._reloaded){a.replace({path:c.path,query:{...c.query,_reloaded:"1"}}).then(()=>{window.location.reload()});return}r.value=f(),y.value=S(),_();const t=parseInt(c.query.page,10);!isNaN(t)&&t<g.value.length&&(n.value=t);const i=document.querySelector(".stars");if(i)for(let v=0;v<100;v++){const d=document.createElement("div");d.classList.add("star"),d.style.top=Math.random()*100+"%",d.style.left=Math.random()*100+"%",d.style.width=Math.random()*2+1+"px",d.style.height=d.style.width,d.style.animationDuration=2+Math.random()*3+"s",d.style.animationDelay=Math.random()*3+"s",i.appendChild(d)}const p=document.querySelector("#viewer");p&&p.addEventListener("click",v=>{const d=v.target.closest("[data-route]");d&&a.push(d.dataset.route)})}),ie(()=>{se.restoreBg()}),{currentPage:n,isPlaying:k,pages:g,showLessonComplete:C,bookmarkedPages:y,progress:e,isBookmarked:H,finishButtonStyle:E,toggleAudio:()=>h(g.value[n.value]),nextPage:O,prevPage:R,goBack:z,toggleBookmark:D,startConfetti:V,stopConfetti:T,currentUser:r,isLessonComplete:Q,markLessonComplete:x}}},be={class:"row items-center q-gutter-sm"},we={class:"text-subtitle2"},ye={class:"lesson-container"},Pe={id:"viewer"},Ce=["innerHTML"],qe={class:"buttons"},Se={class:"progress-section"},_e={class:"page-count"},Fe=["src"];function xe(c,a,n,e,C,k){return I(),W(pe,{view:"hHh lpR fFf"},{default:l(()=>[s(re,{class:"bg-white text-black"},{default:l(()=>[s(ne,null,{default:l(()=>[s(m,{flat:"",dense:"",round:"",icon:"arrow_back","aria-label":"Go back",onClick:e.goBack,class:"q-mr-sm"},null,8,["onClick"]),s(oe,{class:"navbar-title"},{default:l(()=>[...a[2]||(a[2]=[A("Lesson 1: Earthquakes along Faults",-1)])]),_:1}),o("div",be,[o("div",we,P(e.currentPage+1)+" / "+P(e.pages.length),1),s(m,{flat:"",dense:"",round:"",icon:e.isBookmarked?"bookmark":"bookmark_border",color:"primary",onClick:e.toggleBookmark},null,8,["icon","onClick"])])]),_:1})]),_:1}),s(ve,{class:"night-sky"},{default:l(()=>[s(ce,null,{default:l(()=>[a[4]||(a[4]=o("div",{class:"stars"},null,-1)),o("div",ye,[o("div",Pe,[s(j,{name:"fade-slide",mode:"out-in"},{default:l(()=>[(I(),U("div",{key:e.currentPage,innerHTML:e.pages[e.currentPage]},null,8,Ce))]),_:1})]),o("div",qe,[s(m,{class:"nav-button",disable:e.currentPage===0,onClick:e.prevPage,"no-caps":""},{default:l(()=>[...a[3]||(a[3]=[A("Previous",-1)])]),_:1},8,["disable","onClick"]),o("div",Se,[o("div",_e,P(e.currentPage+1)+" / "+P(e.pages.length),1),s(de,{value:e.progress,size:"10px",color:"primary"},null,8,["value"])]),s(m,{class:"nav-button",onClick:e.nextPage,label:e.currentPage===e.pages.length-1?"Finish":"Next",style:G(e.currentPage===e.pages.length-1?e.finishButtonStyle:null),"no-caps":""},null,8,["onClick","label","style"])]),o("div",{class:"speak-btn",onClick:a[0]||(a[0]=(...h)=>e.toggleAudio&&e.toggleAudio(...h))},[o("img",{src:e.isPlaying?"/icons/stop.png":"/icons/speak.png",alt:"Speak Button",class:"cursor-pointer",style:{width:"20px",height:"20px"}},null,8,Fe)])])]),_:1})]),_:1}),a[7]||(a[7]=o("audio",{id:"lesson-complete-audio",src:"assets/audio/completed.mp3",preload:"auto"},null,-1)),s(J,{modelValue:e.showLessonComplete,"onUpdate:modelValue":a[1]||(a[1]=h=>e.showLessonComplete=h),onShow:e.startConfetti,onHide:e.stopConfetti,persistent:""},{default:l(()=>[s(Y,{class:"lesson-complete-card q-pa-md text-center relative-position"},{default:l(()=>[s(B,null,{default:l(()=>[...a[5]||(a[5]=[o("div",{class:"stars-row flex justify-center items-center q-gutter-md"},[o("img",{src:"assets/icons/five-stars.gif",class:"star-icon big-star"})],-1)])]),_:1}),s(B,null,{default:l(()=>[...a[6]||(a[6]=[o("div",{class:"text-h6 text-bold"},"🎉 Congratulations!",-1),o("div",{class:"text-subtitle2 q-mt-sm"},"You have completed this lesson.",-1)])]),_:1}),s(Z,{align:"center"},{default:l(()=>[K(s(m,{label:"OK",color:"primary",unelevated:"",rounded:"",class:"lesson-ok-btn"},null,512),[[ue]])]),_:1})]),_:1})]),_:1},8,["modelValue","onShow","onHide"])]),_:1})}const We=fe(ke,[["render",xe],["__scopeId","data-v-aae7328c"]]);export{We as default};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGVzc29uT25lLURxS3RDN0RSLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFnZXMvY2hhcHRlci0xMC9MZXNzb25PbmUudnVlIl0sInNvdXJjZXNDb250ZW50IjpbIjx0ZW1wbGF0ZT5cclxuICA8cS1sYXlvdXQgdmlldz1cImhIaCBscFIgZkZmXCI+XHJcbiAgICA8cS1oZWFkZXIgY2xhc3M9XCJiZy13aGl0ZSB0ZXh0LWJsYWNrXCI+XHJcbiAgICAgIDxxLXRvb2xiYXI+XHJcbiAgICAgICAgPHEtYnRuIGZsYXQgZGVuc2Ugcm91bmQgaWNvbj1cImFycm93X2JhY2tcIiBhcmlhLWxhYmVsPVwiR28gYmFja1wiIEBjbGljaz1cImdvQmFja1wiIGNsYXNzPVwicS1tci1zbVwiIC8+XHJcbiAgICAgICAgPHEtdG9vbGJhci10aXRsZSBjbGFzcz1cIm5hdmJhci10aXRsZVwiPkxlc3NvbiAxOiBFYXJ0aHF1YWtlcyBhbG9uZyBGYXVsdHM8L3EtdG9vbGJhci10aXRsZT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGl0ZW1zLWNlbnRlciBxLWd1dHRlci1zbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtc3VidGl0bGUyXCI+e3sgY3VycmVudFBhZ2UgKyAxIH19IC8ge3sgcGFnZXMubGVuZ3RoIH19PC9kaXY+XHJcbiAgICAgICAgICA8cS1idG4gZmxhdCBkZW5zZSByb3VuZCA6aWNvbj1cImlzQm9va21hcmtlZCA/ICdib29rbWFyaycgOiAnYm9va21hcmtfYm9yZGVyJ1wiIGNvbG9yPVwicHJpbWFyeVwiXHJcbiAgICAgICAgICAgIEBjbGljaz1cInRvZ2dsZUJvb2ttYXJrXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9xLXRvb2xiYXI+XHJcbiAgICA8L3EtaGVhZGVyPlxyXG5cclxuICAgIDxxLXBhZ2UtY29udGFpbmVyIGNsYXNzPVwibmlnaHQtc2t5XCI+XHJcbiAgICAgIDxxLXBhZ2U+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInN0YXJzXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImxlc3Nvbi1jb250YWluZXJcIj5cclxuICAgICAgICAgIDxkaXYgaWQ9XCJ2aWV3ZXJcIj5cclxuICAgICAgICAgICAgPHRyYW5zaXRpb24gbmFtZT1cImZhZGUtc2xpZGVcIiBtb2RlPVwib3V0LWluXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiA6a2V5PVwiY3VycmVudFBhZ2VcIiB2LWh0bWw9XCJwYWdlc1tjdXJyZW50UGFnZV1cIj48L2Rpdj5cclxuICAgICAgICAgICAgPC90cmFuc2l0aW9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cclxuICAgICAgICAgICAgPHEtYnRuIGNsYXNzPVwibmF2LWJ1dHRvblwiIDpkaXNhYmxlPVwiY3VycmVudFBhZ2UgPT09IDBcIiBAY2xpY2s9XCJwcmV2UGFnZVwiIG5vLWNhcHM+UHJldmlvdXM8L3EtYnRuPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1jb3VudFwiPnt7IGN1cnJlbnRQYWdlICsgMSB9fSAvIHt7IHBhZ2VzLmxlbmd0aCB9fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxxLWxpbmVhci1wcm9ncmVzcyA6dmFsdWU9XCJwcm9ncmVzc1wiIHNpemU9XCIxMHB4XCIgY29sb3I9XCJwcmltYXJ5XCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8cS1idG4gY2xhc3M9XCJuYXYtYnV0dG9uXCIgQGNsaWNrPVwibmV4dFBhZ2VcIiA6bGFiZWw9XCJjdXJyZW50UGFnZSA9PT0gcGFnZXMubGVuZ3RoIC0gMSA/ICdGaW5pc2gnIDogJ05leHQnXCJcclxuICAgICAgICAgICAgICA6c3R5bGU9XCJjdXJyZW50UGFnZSA9PT0gcGFnZXMubGVuZ3RoIC0gMSA/IGZpbmlzaEJ1dHRvblN0eWxlIDogbnVsbFwiIG5vLWNhcHMgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGVhay1idG5cIiBAY2xpY2s9XCJ0b2dnbGVBdWRpb1wiPlxyXG4gICAgICAgICAgICA8aW1nIDpzcmM9XCJpc1BsYXlpbmcgPyAnL2ljb25zL3N0b3AucG5nJyA6ICcvaWNvbnMvc3BlYWsucG5nJ1wiIGFsdD1cIlNwZWFrIEJ1dHRvblwiIGNsYXNzPVwiY3Vyc29yLXBvaW50ZXJcIlxyXG4gICAgICAgICAgICAgIHN0eWxlPVwid2lkdGg6IDIwcHg7IGhlaWdodDogMjBweDtcIiAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvcS1wYWdlPlxyXG4gICAgPC9xLXBhZ2UtY29udGFpbmVyPlxyXG5cclxuICAgIDxhdWRpbyBpZD1cImxlc3Nvbi1jb21wbGV0ZS1hdWRpb1wiIHNyYz1cImFzc2V0cy9hdWRpby9jb21wbGV0ZWQubXAzXCIgcHJlbG9hZD1cImF1dG9cIj48L2F1ZGlvPlxyXG5cclxuICAgIDxxLWRpYWxvZyB2LW1vZGVsPVwic2hvd0xlc3NvbkNvbXBsZXRlXCIgQHNob3c9XCJzdGFydENvbmZldHRpXCIgQGhpZGU9XCJzdG9wQ29uZmV0dGlcIiBwZXJzaXN0ZW50PlxyXG4gICAgICA8cS1jYXJkIGNsYXNzPVwibGVzc29uLWNvbXBsZXRlLWNhcmQgcS1wYS1tZCB0ZXh0LWNlbnRlciByZWxhdGl2ZS1wb3NpdGlvblwiPlxyXG4gICAgICAgIDxxLWNhcmQtc2VjdGlvbj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGFycy1yb3cgZmxleCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXIgcS1ndXR0ZXItbWRcIj5cclxuICAgICAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvaWNvbnMvZml2ZS1zdGFycy5naWZcIiBjbGFzcz1cInN0YXItaWNvbiBiaWctc3RhclwiIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L3EtY2FyZC1zZWN0aW9uPlxyXG4gICAgICAgIDxxLWNhcmQtc2VjdGlvbj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWg2IHRleHQtYm9sZFwiPvCfjokgQ29uZ3JhdHVsYXRpb25zITwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtc3VidGl0bGUyIHEtbXQtc21cIj5Zb3UgaGF2ZSBjb21wbGV0ZWQgdGhpcyBsZXNzb24uPC9kaXY+XHJcbiAgICAgICAgPC9xLWNhcmQtc2VjdGlvbj5cclxuICAgICAgICA8cS1jYXJkLWFjdGlvbnMgYWxpZ249XCJjZW50ZXJcIj5cclxuICAgICAgICAgIDxxLWJ0biBsYWJlbD1cIk9LXCIgY29sb3I9XCJwcmltYXJ5XCIgdW5lbGV2YXRlZCByb3VuZGVkIGNsYXNzPVwibGVzc29uLW9rLWJ0blwiIHYtY2xvc2UtcG9wdXAgLz5cclxuICAgICAgICA8L3EtY2FyZC1hY3Rpb25zPlxyXG4gICAgICA8L3EtY2FyZD5cclxuICAgIDwvcS1kaWFsb2c+XHJcbiAgPC9xLWxheW91dD5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQsIHdhdGNoIH0gZnJvbSBcInZ1ZVwiXHJcbmltcG9ydCB7IHVzZVJvdXRlLCB1c2VSb3V0ZXIgfSBmcm9tIFwidnVlLXJvdXRlclwiXHJcbmltcG9ydCB7IHVzZVRUUyB9IGZyb20gXCJzcmMvY29tcG9zYWJsZXMvdXNlVFRTXCJcclxuaW1wb3J0IGNvbmZldHRpIGZyb20gXCJjYW52YXMtY29uZmV0dGlcIlxyXG5pbXBvcnQgeyBnZXRDdXJyZW50VXNlciwgc2V0Q3VycmVudFVzZXIgfSBmcm9tIFwic3JjL3V0aWxzL3Nlc3Npb25cIlxyXG5pbXBvcnQgeyBmbGF0TGVzc29ucyB9IGZyb20gXCJzcmMvdXRpbHMvbGVzc29uc1wiXHJcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCJxdWFzYXJcIlxyXG5pbXBvcnQgJ0Bnb29nbGUvbW9kZWwtdmlld2VyJztcclxuaW1wb3J0IHsgYXVkaW9NYW5hZ2VyIH0gZnJvbSBcInNyYy91dGlscy9hdWRpb01hbmFnZXJcIlxyXG5pbXBvcnQgeyBvbkJlZm9yZVJvdXRlTGVhdmUgfSBmcm9tIFwidnVlLXJvdXRlclwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogXCJTY2llbnRpZmljTW9kZWxzTGVzc29uXCIsXHJcbiAgc2V0dXAoKSB7XHJcbiAgICBjb25zdCByb3V0ZSA9IHVzZVJvdXRlKClcclxuICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXHJcbiAgICBjb25zdCBjdXJyZW50UGFnZSA9IHJlZigwKVxyXG4gICAgY29uc3QgcHJvZ3Jlc3MgPSByZWYoMClcclxuICAgIGNvbnN0IHNob3dMZXNzb25Db21wbGV0ZSA9IHJlZihmYWxzZSlcclxuXHJcbiAgICAvLyAtLS0gVFRTIGNvbXBvc2FibGUgLS0tXHJcbiAgICBjb25zdCB7IGlzUGxheWluZywgdG9nZ2xlQXVkaW8sIHN0b3BTcGVha2luZyB9ID0gdXNlVFRTKClcclxuXHJcbiAgICBjb25zdCBjdXJyZW50VXNlciA9IHJlZihnZXRDdXJyZW50VXNlcigpKVxyXG4gICAgbGV0IGNvbmZldHRpSW50ZXJ2YWwgPSBudWxsXHJcbiAgICBjb25zdCBsZXNzb24gPSBmbGF0TGVzc29ucy5maW5kKGwgPT4gbC5yb3V0ZSA9PT0gcm91dGUucGF0aClcclxuICAgIGNvbnN0IGxlc3NvbklkID0gbGVzc29uID8gU3RyaW5nKGxlc3Nvbi5pZCkgOiBcIjcxXCJcclxuXHJcbiAgICBjb25zdCBib29rbWFya2VkUGFnZXMgPSByZWYoW10pXHJcblxyXG4gICAgLy8gLS0tIExlc3NvbiBwYWdlcyAtLS1cclxuICAgIGNvbnN0IHBhZ2VzID0gcmVmKFtcclxuICAgICAgYFxyXG4gIDxkaXY+XHJcbiAgICA8IS0tIENhcmQgMSAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5XaGF0IEFyZSBFYXJ0aHF1YWtlcz88L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaWxsdXN0cmF0aW9uXCI+XHJcbiAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltZy9jaGFwdGVyIDEwL2VhcnRocXVha2UuZ2lmXCIgYWx0PVwiUGxhY2Vob2xkZXJcIj5cclxuICAgICAgPHA+RWFydGhxdWFrZXMgYXJlIHN1ZGRlbiwgcmFwaWQgc2hha2luZyBvZiB0aGUgZ3JvdW5kIGNhdXNlZCBieSB0aGUgYnJlYWtpbmcgYW5kIHNoaWZ0aW5nIG9mIHJvY2sgYmVuZWF0aCB0aGUgRWFydGgncyBzdXJmYWNlLiBUaGV5IGNhbiBoYXBwZW4gYW55d2hlcmUsIGJ1dCBvY2N1ciBtb3N0IGZyZXF1ZW50bHkgYWxvbmcgZmF1bHQgbGluZXMuPC9wPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZnVuLWZhY3QtY2FyZFwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiaGlnaGxpZ2h0XCI+RnVuIEZhY3Q6PC9zcGFuPiBPdXIgY291bnRyeSBpcyBsb2NhdGVkIGluIGFuIGVhcnRocXVha2UtcHJvbmUgcmVnaW9uLiBEaWQgeW91IGtub3cgdGhhdCBlYXJ0aHF1YWtlcyBhcmUgcmVjb3JkZWQgaW4gdGhlIFBoaWxpcHBpbmVzIGV2ZXJ5IGRheT8gRm9ydHVuYXRlbHksIG1vc3Qgb2YgdGhlbSBhcmUgdG9vIHdlYWsgdG8gYmUgZmVsdCBvciBub3RpY2VkLlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcblxyXG4gICAgICBgXHJcbiAgPGRpdj5cclxuICAgIDwhLS0gQ2FyZCAyIC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPldoeSBEbyBFYXJ0aHF1YWtlcyBIYXBwZW4/PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImlsbHVzdHJhdGlvblwiPlxyXG4gICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvY2hhcHRlciAxMC9wbGF0ZSB0ZWN0b25pY3MucG5nXCIgYWx0PVwiUGxhY2Vob2xkZXJcIj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHA+VGhlIEVhcnRoJ3MgY3J1c3QgaXMgbWFkZSB1cCBvZiB0ZWN0b25pYyBwbGF0ZXMgdGhhdCBhcmUgY29uc3RhbnRseSBtb3ZpbmcuIFdoZW4gdGhlc2UgcGxhdGVzIGdldCBzdHVjayBhdCB0aGVpciBlZGdlcyBkdWUgdG8gZnJpY3Rpb24sIHN0cmVzcyBidWlsZHMgdXAuIFdoZW4gdGhlIHN0cmVzcyBleGNlZWRzIHRoZSBmcmljdGlvbiwgdGhlIHBsYXRlcyBzdWRkZW5seSBzbGlwLCByZWxlYXNpbmcgZW5lcmd5IGFzIHNlaXNtaWMgd2F2ZXMuPC9wPlxyXG4gICAgPGRpdiBjbGFzcz1cImZ1bi1mYWN0LWNhcmRcIj5cclxuICAgICAgPHNwYW4gY2xhc3M9XCJoaWdobGlnaHRcIj5GdW4gRmFjdDo8L3NwYW4+IFBsYXRlIEZhY3Q6IFRoZSBQaGlsaXBwaW5lcyBzaXRzIGF0IHRoZSBib3VuZGFyeSBvZiB0d28gbWFqb3IgdGVjdG9uaWMgcGxhdGVzIC0gdGhlIFBoaWxpcHBpbmUgU2VhIFBsYXRlIGFuZCB0aGUgRXVyYXNpYW4gUGxhdGUuXHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG5cclxuICAgICAgYFxyXG4gIDxkaXY+XHJcbiAgICA8IS0tIENhcmQgMyAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj5cclxuICAgICAgICAgIDx2aWRlbyBjb250cm9scyB3aWR0aD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgPHNvdXJjZSBzcmM9XCJhc3NldHMvdmlkZW9zL2FuaW1hdGlvbi53ZWJtXCIgdHlwZT1cInZpZGVvL3dlYm1cIj5cclxuICAgICAgICAgIDwvdmlkZW8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPkFuaW1hdGlvbiBzaG93aW5nIGhvdyBlYXJ0aHF1YWtlcyBvY2N1ciBhbG9uZyBmYXVsdHMgZHVlIHRvIHRoZSBtb3ZlbWVudCBvZiB0ZWN0b25pYyBwbGF0ZXMuPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG5cclxuICAgICAgYFxyXG4gIDxkaXY+XHJcbiAgICA8IS0tIENhcmQgNCAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5Gb2N1cyBhbmQgRXBpY2VudGVyPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImlsbHVzdHJhdGlvblwiPlxyXG4gICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvY2hhcHRlciAxMC9maWd1cmUgMTAtMS5wbmdcIiBhbHQ9XCJQbGFjZWhvbGRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPkZpZ3VyZSAxMC0xLiBUaGUgZXBpY2VudGVyIG9mIGFuIGVhcnRocXVha2UgaXMgbG9jYXRlZCBkaXJlY3RseSBhYm92ZSBpdHMgZm9jdXMsIG9yIHRoZSBwb2ludCBvZiBvcmlnaW4gb2YgYW4gZWFydGhxdWFrZS48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj5cclxuICAgICAgICAgIDx2aWRlbyBjb250cm9scyB3aWR0aD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgPHNvdXJjZSBzcmM9XCJhc3NldHMvdmlkZW9zL2NoYXB0ZXIgMTAvbHZfMF8yMDI2MDEyNDE5MDUyMi5tcDRcIiBjb250cm9scyBhbHQ9XCJ2aWRlb1wiIHR5cGU9XCJ2aWRlby9tcDRcIj5cclxuICAgICAgICAgIDwvdmlkZW8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPldoYXQgaXMgZm9jdXMgYW5kIHR5cGVzIG9mIGVhcnRocXVha2VzPzwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcblxyXG4gICAgICBgXHJcbiAgPGRpdj5cclxuICAgIDwhLS0gQ2FyZCA1IC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImluZm8tY2FyZFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiaW5mby10aXRsZVwiPk1pbmkgVGVzdCAxMC0xPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLWNvbnRlbnRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby10ZXh0XCI+XHJcbiAgICAgICAgICA8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj48c3Ryb25nPldoYXQgaXMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgZXBpY2VudGVyIGFuZCB0aGUgZm9jdXMgb2YgYW4gZWFydGhxdWFrZT8gSG93IGRvIGZhdWx0cyBnZW5lcmF0ZSBlYXJ0aHF1YWtlcz88L3N0cm9uZz48L3A+XHJcbiAgICAgICAgICA8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjsgY29sb3I6IHB1cnBsZTtcIj5QcmVzZW50IHlvdXIgYW5zd2VycyBieSBkb2luZyBvbmUgb2YgdGhlIGZvbGxvd2luZzo8L3A+XHJcbiAgICAgICAgICA8cD4xLiBDcmVhdGUgYW4gYW5pbWF0aW9uLjwvcD5cclxuICAgICAgICAgIDxwPjIuIEFjdCBvdXQgdGhlIGNvbmNlcHQuPC9wPlxyXG4gICAgICAgICAgPHA+My4gV3JpdGUgYSBuZXdzIGFydGljbGUuPC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj5cclxuICAgICAgICAgIDx2aWRlbyBjb250cm9scyB3aWR0aD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgPHNvdXJjZSBzcmM9XCJhc3NldHMvdmlkZW9zL2NoYXB0ZXIgMTAvZmJsaXRlX3ZpZGVvLm1wNFwiIGNvbnRyb2xzIGFsdD1cInZpZGVvXCIgdHlwZT1cInZpZGVvL21wNFwiPlxyXG4gICAgICAgICAgPC92aWRlbz5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXB0aW9uXCI+VGhlIEVhcnRoJ3MgdGVjdG9uaWMgcGxhdGVzIGFuZCB0aGVpciBtb3ZlbWVudC48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG5cclxuICAgICAgYFxyXG4gIDxkaXY+XHJcbiAgICA8IS0tIENhcmQgNiAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5BY3RpdmUgYW5kIEluYWN0aXZlIEZhdWx0czwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJpbGx1c3RyYXRpb25cIj5cclxuICAgICAgPGltZyBzcmM9XCJhc3NldHMvaW1nL2NoYXB0ZXIgMTAvc2xpZGU2LnBuZ1wiIGFsdD1cIlBsYWNlaG9sZGVyXCI+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+XHJcbiAgICAgICAgICA8dmlkZW8gY29udHJvbHMgd2lkdGg9XCIxMDAlXCI+XHJcbiAgICAgICAgICAgIDxzb3VyY2Ugc3JjPVwiYXNzZXRzL3ZpZGVvcy9jaGFwdGVyIDEwL0lNR18yMDI2MDEyNF8xOTEzNThfODA0ZmJsaXRlX3ZpZGVvLm1wNFwiIGNvbnRyb2xzIGFsdD1cInZpZGVvXCIgdHlwZT1cInZpZGVvL21wNFwiPlxyXG4gICAgICAgICAgPC92aWRlbz5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXB0aW9uXCI+QWN0aXZlIGFuZCBpbmFjdGl2ZSBmYXVsdHMuPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuXHJcbiAgICAgIGBcclxuICA8ZGl2PlxyXG4gICAgPCEtLSBDYXJkIDcgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+RGlwLVNsaXAsIFN0cmlrZS1TbGlwLCBhbmQgT2JsaXF1ZS1TbGlwIEZhdWx0czwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxwPkluIGEgZGlwLXNsaXAgZmF1bHQsIHRoZSBncm91bmQgbW92ZXMgZWl0aGVyIHVwIG9yIGRvd24gYWxvbmcgdGhlIHNsb3BlIG9mIHRoZSBmYXVsdC4gVGhlIGRpcCBpcyB0aGUgYW5nbGUgdGhlIGZhdWx0IG1ha2VzIHdpdGggcmVzcGVjdCB0byB0aGUgc3VyZmFjZS4gVGhlIGJsb2NrIGFib3ZlIHRoZSBmYXVsdCBpcyB0aGUgaGFuZ2luZyB3YWxsLCB3aGlsZSB0aGUgYmxvY2sgYmVsb3cgaXMgdGhlIGZvb3R3YWxsLiBEZXBlbmRpbmcgb24gaG93IHRoZXNlIGJsb2NrcyBtb3ZlIGluIHJlbGF0aW9uIHRvIHRoZSBoYW5naW5nIHdhbGwgYW5kIGZvb3R3YWxsLCBkaXAtc2xpcCBmYXVsdHMgYXJlIGNhdGVnb3JpemVkIGFzIG5vcm1hbCBvciByZXZlcnNlLiBJbiBhIG5vcm1hbCBkaXAtc2xpcCBmYXVsdCAoZmlndXJlIDEwLTJBKSwgdGhlIGhhbmdpbmcgd2FsbCBtb3ZlcyBkb3duIGluIHJlbGF0aW9uIHRvIHRoZSBmb290d2FsbC4gSW4gYSByZXZlcnNlIGRpcC1zbGlwIGZhdWx0LCB0aGUgb3Bwb3NpdGUgaGFwcGVuczsgdGhlIGhhbmdpbmcgd2FsbCBtb3ZlcyB1cCBpbiByZWxhdGlvbiB0byB0aGUgZm9vdHdhbGwgKGZpZ3VyZSAxMC0yQikuPC9wPlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcblxyXG4gICAgICBgXHJcbiAgPGRpdj5cclxuICAgIDwhLS0gQ2FyZCA4IC0tPlxyXG4gICAgPHA+SW4gYSBzdHJpa2Utc2xpcCBmYXVsdCwgdGhlIGJsb2NrcyBtb3ZlIHNpZGUgdG8gc2lkZSwgc2xpZGluZyBwYXN0IG9uZSBhbm90aGVyIChmaWd1cmUgMTAtMkMpLiBUaGUgc3RyaWtlIGlzIHdoZXJlIHRoZSBmYXVsdCBjdXRzIGFjcm9zcyBhIGhvcml6b250YWwgc3VyZmFjZS4gSW4gYSBzaW5pc3RyYWwgc3RyaWtlLXNsaXAgZmF1bHQsIGEgZmF1bHQgYmxvY2sgbW92ZXMgdG8gdGhlIGxlZnQgd2l0aCByZXNwZWN0IHRvIHRoZSBvcHBvc2l0ZSBibG9jay4gSW4gYSBkZXh0cmFsIHN0cmlrZS1zbGlwIGZhdWx0LCB0aGUgbW92ZW1lbnQgaXMgdG8gdGhlIHJpZ2h0LjwvcD5cclxuICAgIDxkaXYgY2xhc3M9XCJtb2RlbC12aWV3ZXItYmxvY2tcIj5cclxuICAgICAgICA8bW9kZWwtdmlld2VyIHNyYz1cIm1vZGVscy9zdHJpa2Vfc2xpcC5nbGJcIiBhbHQ9XCJTdHJpa2Utc2xpcCBmYXVsdFwiIGNhbWVyYS1jb250cm9scyBhdXRvLXJvdGF0ZSBpbnRlcmFjdGlvbi1wcm9tcHQ9XCJhdXRvXCIgbG9hZGluZz1cImVhZ2VyXCI+PC9tb2RlbC12aWV3ZXI+XHJcbiAgICAgICAgPGEgaHJlZj1cIi9odG1sL3N0cmlrZV9zbGlwLmh0bWxcIiBjbGFzcz1cImV5ZS1pY29uXCI+XHJcbiAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9pY29ucy9leWUucG5nXCIgYWx0PVwiVmlldyAzRCBNb2RlbFwiIC8+XHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXB0aW9uXCI+U3RyaWtlLXNsaXAgRmF1bHQgTW9kZWw8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZnVuLWZhY3QtY2FyZFwiPlxyXG4gICAgICA8c3BhbiBjbGFzcz1cImhpZ2hsaWdodFwiPlNjaWVuY2UgVGlwczo8L3NwYW4+IEhhbmdpbmcgd2FsbCBhbmQgZm9vdHdhbGwgYXJlIG1pbmluZyB0ZXJtcyB0aGF0IGhhdmUgYmVlbiBhZG9wdGVkIGluIGdlb2xvZ3kuIEluIG1pbmluZywgYSBoYW5naW5nIHdhbGwgaXMgdGhlIG1hc3Mgb2Ygcm9jayBvdmVybHlpbmcgbWluZXJhbCBkZXBvc2l0cywgd2hpbGUgYSBmb290d2FsbCBpcyB0aGUgcm9jayBiZWxvdyB0aGUgbWFzcy4gVGhlc2UgdGVybXMgYXJlIHVzZWQgYnkgZ2VvbG9naXN0cyB0byByZWZlciB0byB0aGUgYmxvY2sgb2Ygcm9jayBhYm92ZSB0aGUgZmF1bHQgcGxhbmUgKGhhbmdpbmcgd2FsbCkgYW5kIHRoZSBibG9jayBiZWxvdyAoZm9vdHdhbGwpLlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuXHJcbiAgICAgIGBcclxuICA8ZGl2PlxyXG4gICAgPCEtLSBDYXJkIDkgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+T2JsaXF1ZS1TbGlwIEZhdWx0czwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxwPkFuIG9ibGlxdWUtc2xpcCBmYXVsdCBleGhpYml0cyBib3RoIGRpcC1zbGlwIGFuZCBzdHJpa2Utc2xpcCBkaXNwbGFjZW1lbnRzOiBlaXRoZXIgYW4gdXB3YXJkIG9yIGRvd253YXJkIHNsaWRpbmcgb2YgdGhlIGZhdWx0IGJsb2NrLCBhbmQgYSBob3Jpem9udGFsIG1vdmVtZW50IHRvIHRoZSBsZWZ0IG9yIHRvIHRoZSByaWdodCBvZiBvbmUgZmF1bHQgYmxvY2sgd2l0aCByZXNwZWN0IHRvIHRoZSBvcHBvc2l0ZSBibG9jayAoZmlndXJlIDEwLTJEKTwvcD5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaWxsdXN0cmF0aW9uXCI+XHJcbiAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltZy9jaGFwdGVyIDEwL2ZpZ3VyZTEwLTIucG5nXCIgYWx0PVwiUGxhY2Vob2xkZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNhcHRpb25cIj5GaWd1cmUgMTAtMi4gRGlmZmVyZW50IGZhdWx0cyBiYXNlZCBvbiBvcmllbnRhdGlvbiBvZiBkaXNwbGFjZW1lbnQ6IChhKSBub3JtYWwgZGlwLXNsaXAgZmF1bHQsIChiKSByZXZlcnNlIGRpcC1zbGlwIGZhdWx0LCAoYykgc3RyaWtlLXNsaXAgZmF1bHQsIGFuZCAoZCkgb2JsaXF1ZS1zbGlwIGZhdWx0LjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuXHJcbiAgICAgIGBcclxuICA8ZGl2PlxyXG4gICAgPCEtLSBDYXJkIDEwIC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPkFwcGx5IFlvdXIgS25vd2xlZGdlPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPHA+Tm93IHRoYXQgeW91J3ZlIGxlYXJuZWQgYWJvdXQgZGlmZmVyZW50IHR5cGVzIG9mIGZhdWx0cyBhbmQgaG93IHRoZXkgZ2VuZXJhdGUgZWFydGhxdWFrZXMsIGl0J3MgdGltZSB0byBhcHBseSB0aGlzIGtub3dsZWRnZS4gVGhlIG5leHQgYWN0aXZpdHkgd2lsbCBjaGFsbGVuZ2UgeW91IHRvIGRlbW9uc3RyYXRlIHlvdXIgdW5kZXJzdGFuZGluZyB0aHJvdWdoIGEgcHJhY3RpY2FsIGV4ZXJjaXNlLjwvcD5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5mby1jYXJkXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLXRpdGxlXCI+TUlOSSBMQUIgMTAtMjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiaW5mby1jb250ZW50XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImluZm8tdGV4dFwiPlxyXG4gICAgICAgICAgPHA+QXBwbHkgd2hhdCB5b3UgaGF2ZSBsZWFybmVkIGJ5IHBlcmZvcm1pbmcgdGhlIGFjdGl2aXR5IG9uIGZhdWx0cy4gQ2xpY2sgdGhlIGJ1dHRvbiB0byBnbyB0byB0aGUgbmV4dCBwYWdlLjwvcD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGFydC1idG4tY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDxxLWJ0biBkYXRhLXJvdXRlPVwiL21pbmktbGFiLTEwLTJcIiB1bmVsZXZhdGVkIGNsYXNzPVwic3RhcnQtYnRuXCI+XHJcbiAgICAgICAgICAgICAgQW5zd2VyXHJcbiAgICAgICAgICAgIDwvcS1idG4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG5cclxuICAgICAgYFxyXG4gIDxkaXY+XHJcbiAgICA8IS0tIENhcmQgMTEgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+SG93IE1vdmVtZW50IGFsb25nIEZhdWx0cyBHZW5lcmF0ZSBFYXJ0aHF1YWtlczwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj5cclxuICAgICAgICAgIDx2aWRlbyBjb250cm9scyB3aWR0aD1cIjEwMCVcIj5cclxuICAgICAgICAgICAgPHNvdXJjZSBzcmM9XCJhc3NldHMvdmlkZW9zL2NoYXB0ZXIgMTAvMTc2OTMzMTI1ODI5OS5tcDRcIiBjb250cm9scyBhbHQ9XCJmaWd1cmUgMTEtM1wiIHR5cGU9XCJ2aWRlby9tcDRcIj5cclxuICAgICAgICAgIDwvdmlkZW8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlRocmVlIEJhc2ljIEZhdWx0IFR5cGVzPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8cD5BdCBvciBuZWFyIHRlY3RvbmljIHBsYXRlIGJvdW5kYXJpZXMsIHRoZXJlIGlzIGEgbGFyZ2UgY29uY2VudHJhdGlvbiBvZiBmYXVsdHMuIFRoZSByZWFzb24gZm9yIHRoaXMgaXMgdGhhdCB0aGUgbW92ZW1lbnQgb2YgdGVjdG9uaWMgcGxhdGVzIHByb3ZpZGVzIHN0cmVzcy4gUm9ja3Mgb24gdGhlIEVhcnRoJ3Mgc3VyZmFjZSBicmVhayBpbiByZXNwb25zZSB0byB0aGlzIHN0cmVzcy48L3A+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuICAgICAgYFxyXG4gIDxkaXY+XHJcbiAgICA8IS0tIENhcmQgMTIgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+Tm9ybWFsIEZhdWx0czwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJpbGx1c3RyYXRpb25cIj5cclxuICAgICAgPGltZyBzcmM9XCJhc3NldHMvaW1nL2NoYXB0ZXIgMTAvTm9ybWFsIEZhdWx0LTEyLnBuZ1wiIGFsdD1cIlBsYWNlaG9sZGVyXCI+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8cD5Ob3JtYWwgZmF1bHRzIGFyZSBjYXVzZWQgYnkgcm9ja3MgYmVpbmcgc3RyZXRjaGVkLiBUaGV5IGFyZSBmb3JtZWQgYXMgYSBibG9jayBvZiByb2NrIGZhbGxzIGFmdGVyIGJlaW5nIGZyYWN0dXJlZC4gU3VkZGVuIG1vdmVtZW50IGFsb25nIHRoZXNlIGZhdWx0cyBjYXVzZXMgZWFydGhxdWFrZXMgYXMgdGhlIG1vdmVtZW50IHJlbGVhc2VzIHN0b3JlZCB1cCBlbmVyZ3kuIFRoZSBlYXJ0aHF1YWtlIGZvY3VzIGlzIHRoZSBwbGFjZSB3aGVyZSB0aGUgcm9ja3MgYnJlYWsuPC9wPlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcblxyXG4gICAgICBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJpbGx1c3RyYXRpb25cIj5cclxuICAgICAgPGltZyBzcmM9XCJhc3NldHMvaW1nL2NoYXB0ZXIgMTAvTm9ybWFsX0ZhdWx0ICgxKS5naWZcIiBhbHQ9XCJQbGFjZWhvbGRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPk5vcm1hbCBGYXVsdCBBbmltYXRpb248L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuIGAsXHJcbiAgICAgIGBcclxuICA8ZGl2PlxyXG4gICAgPCEtLSBDYXJkIDEzIC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlJldmVyc2UgRmF1bHQgRWFydGhxdWFrZXM8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaWxsdXN0cmF0aW9uXCI+XHJcbiAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltZy9jaGFwdGVyIDEwL1JldmVyc2UgRmF1bHQtMTMucG5nXCIgYWx0PVwiUGxhY2Vob2xkZXJcIj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxwPkluIGEgcmV2ZXJzZSBmYXVsdCwgdGhlIGhhbmdpbmcgd2FsbCBoYXMgbW92ZWQgdXB3YXJkIHJlbGF0aXZlIHRvIHRoZSBmb290d2FsbCBkdWUgdG8gY29tcHJlc3Npb25hbCBmb3JjZS4gRWFydGhxdWFrZXMgaGFwcGVuIGR1ZSB0byB0aGlzIHN1ZGRlbiBtb3ZlbWVudC48L3A+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuXHJcbiAgICAgIGBcclxuICAgICAgPGRpdiBjbGFzcz1cImlsbHVzdHJhdGlvblwiPlxyXG4gICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvY2hhcHRlciAxMC9SZXZlcnNlX0ZhdWx0ICgxKS5naWZcIiBhbHQ9XCJQbGFjZWhvbGRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlJldmVyc2UgRmF1bHQgQW5pbWF0aW9uPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiBgLFxyXG4gICAgICBgXHJcbiAgPGRpdj5cclxuICAgIDwhLS0gQ2FyZCAxNCAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5TdHJpa2UtU2xpcCBGYXVsdCBFYXJ0aHF1YWtlczwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJpbGx1c3RyYXRpb25cIj5cclxuICAgICAgPGltZyBzcmM9XCJhc3NldHMvaW1nL2NoYXB0ZXIgMTAvU3RyaWtlIEZhdWx0LTE0LmpwZ1wiIGFsdD1cIlBsYWNlaG9sZGVyXCI+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8cD5JbiBzdHJpa2Utc2xpcCBmYXVsdHMsIHR3byBwbGF0ZXMgbW92ZSBob3Jpem9udGFsbHkgc2lkZXdheXMgaW4gb3Bwb3NpdGUgZGlyZWN0aW9ucy4gQXMgdGhlIHBsYXRlcyBtb3ZlIGFnYWluc3Qgb25lIGFub3RoZXIsIHN0cmFpbiBpcyBidWlsdCB1cC4gQXMgZW5lcmd5IGlzIHJlbGVhc2VkLCBlYXJ0aHF1YWtlcyBvY2N1ci4gU3RyaWtlLXNsaXAgZmF1bHRzIGNhbiBwcm9kdWNlIG1ham9yIGVhcnRocXVha2VzIHdpdGggYSBtYWduaXR1ZGUgYXMgZ3JlYXQgYXMgOC48L3A+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuXHJcbiAgICAgIGBcclxuICAgICAgPGRpdj5cclxuICA8ZGl2IGNsYXNzPVwiaWxsdXN0cmF0aW9uXCI+XHJcbiAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltZy9jaGFwdGVyIDEwL1N0cmlrZS1TbGlwX0ZhdWx0LmdpZlwiIGFsdD1cIlBsYWNlaG9sZGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjYXB0aW9uXCI+U3RyaWtlLVNsaXAgRmF1bHQgQW5pbWF0aW9uPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiBgLFxyXG4gICAgICBgXHJcbiAgPGRpdj5cclxuICAgIDwhLS0gQ2FyZCAxNSAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5NaW5pIFRlc3QgMTAtMjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJpbmZvLWNhcmRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImluZm8tdGl0bGVcIj5NSU5JIFRFU1QgMTAtMjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiaW5mby1jb250ZW50XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImluZm8tdGV4dFwiPlxyXG4gICAgICAgICAgPHA+MS4gRHJhdyB0aGUgZ3JhcGhpYyBvcmdhbml6ZXIgb24geW91ciBwYXBlciBhcyBzaG93biBiZWxvdy48L3A+XHJcbiAgICAgICAgICA8cD4yLiBGb3IgZWFjaCBzZXQgb2YgcmVjdGFuZ2xlcywgZmlsbCB0aGUgdG9wIHdpdGggdGhlIHRlY3RvbmljIHBsYXRlIGFuZCB0aGUgYm90dG9tIHdpdGggdGhlIGFzc29jaWF0ZWQgdHlwZSBvZiBmYXVsdC48L3A+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlsbHVzdHJhdGlvblwiPlxyXG4gICAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvY2hhcHRlciAxMC9taW5pIHRlc3QgMTAtMi5wbmdcIiBhbHQ9XCJQbGFjZWhvbGRlclwiPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInN0YXJ0LWJ0bi1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgPHEtYnRuIGRhdGEtcm91dGU9XCIvbWluaS10ZXN0LTEwLTJcIiB1bmVsZXZhdGVkIGNsYXNzPVwic3RhcnQtYnRuXCI+QW5zd2VyPC9xLWJ0bj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcblxyXG4gICAgICBgXHJcbiAgPGRpdj5cclxuICAgIDwhLS0gQ2FyZCAxNiAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5UeXBlcyBvZiBGYXVsdHMgaW4gdGhlIFBoaWxpcHBpbmVzPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgPHZpZGVvIGNvbnRyb2xzIHdpZHRoPVwiMTAwJVwiPlxyXG4gICAgICAgICAgICA8c291cmNlIHNyYz1cImFzc2V0cy92aWRlb3MvY2hhcHRlcjEwLWxlc3NvbjEubXA0XCIgY29udHJvbHMgYWx0PVwicGhpbGlwcGluZSBmYXVsdFwiIHR5cGU9XCJ2aWRlby9tcDRcIj5cclxuICAgICAgICAgIDwvdmlkZW8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlRoZSBUeXBlcyBvZiBGYXVsdHMgaW4gdGhlIFBoaWxpcHBpbmVzIEFuaW1hdGlvbjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcblxyXG4gICAgICBgXHJcbiAgPGRpdj5cclxuICAgIDwhLS0gQ2FyZCAxOCAtLT5cclxuICAgIDxwPlRoZSBQaGlsaXBwaW5lcyBpcyBjb25zaWRlcmVkIG9uZSBvZiB0aGUgbW9zdCB0ZWN0b25pY2FsbHkgYW5kIHNlaXNtaWNhbGx5IGFjdGl2ZSBhcmVhcyBpbiB0aGUgd29ybGQuIFBISVZPTENTIHJlY29yZHMgYXQgbGVhc3QgZml2ZSBlYXJ0aHF1YWtlcyBhIGRheSBpbiB0aGUgUGhpbGlwcGluZXMsIGFsbCBvZiB3aGljaCBhcmUgZHVlIHRvIGFjdGl2ZSBmYXVsdHMuPC9wPlxyXG4gICAgPHA+VGhlIFBoaWxpcHBpbmUgRmF1bHQgWm9uZSAoUEZaKSBpcyBhbiBpbXBvcnRhbnQgdGVjdG9uaWMgYW5kIHNlaXNtaWMgZmVhdHVyZSB0aGF0IGN1dHMgYWNyb3NzIHRoZSBQaGlsaXBwaW5lIGFyY2hpcGVsYWdvIGZyb20gbm9ydGh3ZXN0ZXJuIEx1em9uIHRvIHNvdXRoZWFzdGVybiBNaW5kYW5hby4gVGhlIFBGWiBpcyBnZW5lcmFsbHkgc3RyaWtlLXNsaXAgaW4gbmF0dXJlIGFuZCBpcyBtYWRlIHVwIG9mIHNldmVyYWwgc2VnbWVudHMuIExhcmdlIG1hZ25pdHVkZSBlYXJ0aHF1YWtlcyBpbiByZWNlbnQgeWVhcnMgb3JpZ2luYXRlZCBmcm9tIHRoaXMgZmF1bHQgem9uZS48L3A+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImZ1bi1mYWN0LWNhcmRcIj5cclxuICAgICAgPHNwYW4gY2xhc3M9XCJoaWdobGlnaHRcIj5EaWQgWW91IEtub3c/Ojwvc3Bhbj4gRHVyaW5nIGFuIGVhcnRocXVha2UsIHN0YXkgYXdheSBmcm9tIHdpbmRvd3MsIGhlYXZ5IGZ1cm5pdHVyZSwgYW5kIG9iamVjdHMgdGhhdCBjb3VsZCBmYWxsLlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuXHJcbiAgICAgIGBcclxuICA8ZGl2PlxyXG4gICAgPCEtLSBDYXJkIDE5IC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlBoaWxpcHBpbmUgRmF1bHQgTGluZXM8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaWxsdXN0cmF0aW9uXCI+XHJcbiAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltZy9jaGFwdGVyIDEwL3BoaWxpcHBpbmVzLW1hcC5qcGVnXCIgYWx0PVwiUGxhY2Vob2xkZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNhcHRpb25cIj5GaWd1cmUgMTAtMzogRGlzdHJpYnV0aW9uIG9mIGFjdGl2ZSBmYXVsdHMgaW4gdGhlIFBoaWxpcHBpbmVzPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG5cclxuICAgICAgYFxyXG4gIDxkaXY+XHJcbiAgICA8IS0tIENhcmQgMjAgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+TWluaSBMYWIgMTAtMzwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJpbmZvLWNhcmRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImluZm8tdGl0bGVcIj5NaW5pIExhYiAxMC0zPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLWNvbnRlbnRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby10ZXh0XCI+XHJcbiAgICAgICAgICA8cD5GaWxsIGluIHRoZSBzZWNvbmQgY29sdW1uIHdpdGggZXhhbXBsZXMgb2YgdGhlIHR5cGUgb2YgZmF1bHRzIGZvdW5kIGluIHRoZSBQaGlsaXBwaW5lcy48L3A+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlsbHVzdHJhdGlvblwiPlxyXG4gICAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvY2hhcHRlciAxMC9taW5pIGxhYiAxMC0zLnBuZ1wiIGFsdD1cIlBsYWNlaG9sZGVyXCI+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3RhcnQtYnRuLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICA8cS1idG4gZGF0YS1yb3V0ZT1cIi9taW5pLWxhYi0xMC0zXCIgdW5lbGV2YXRlZCBjbGFzcz1cInN0YXJ0LWJ0blwiPkFuc3dlcjwvcS1idG4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG5cclxuICAgICAgYFxyXG4gIDxkaXY+XHJcbiAgICA8IS0tIENhcmQgMjEgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5mby1jYXJkXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLXRpdGxlXCI+TUlOSSBURVNUIDEwLTM8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImluZm8tY29udGVudFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLXRleHRcIj5cclxuICAgICAgICAgXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWxsdXN0cmF0aW9uXCI+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltZy9jaGFwdGVyIDEwL21pbmkgdGVzdCAxMC0zLnBuZ1wiIGFsdD1cIlBsYWNlaG9sZGVyXCI+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3RhcnQtYnRuLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICA8cS1idG4gZGF0YS1yb3V0ZT1cIi9taW5pLXRlc3QtMTAtM1wiIHVuZWxldmF0ZWQgY2xhc3M9XCJzdGFydC1idG5cIj5BbnN3ZXI8L3EtYnRuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYFxyXG4gICAgXSlcclxuXHJcbiAgICAvLyAtLS0gTGVzc29uIGNvbXBsZXRpb24gLS0tXHJcbiAgICBjb25zdCBpc0xlc3NvbkNvbXBsZXRlID0gY29tcHV0ZWQoKCkgPT5cclxuICAgICAgY3VycmVudFVzZXIudmFsdWU/LnByb2dyZXNzPy5bbGVzc29uSWRdPy5jb21wbGV0ZWQgfHwgZmFsc2VcclxuICAgIClcclxuXHJcbiAgICBjb25zdCBtYXJrTGVzc29uQ29tcGxldGUgPSAoKSA9PiB7XHJcbiAgICAgIGlmICghY3VycmVudFVzZXIudmFsdWUpIHJldHVyblxyXG4gICAgICBpZiAoIWN1cnJlbnRVc2VyLnZhbHVlLnByb2dyZXNzKSBjdXJyZW50VXNlci52YWx1ZS5wcm9ncmVzcyA9IHt9XHJcblxyXG4gICAgICBjdXJyZW50VXNlci52YWx1ZS5wcm9ncmVzc1tsZXNzb25JZF0gPSB7XHJcbiAgICAgICAgLi4uY3VycmVudFVzZXIudmFsdWUucHJvZ3Jlc3NbbGVzc29uSWRdLFxyXG4gICAgICAgIGNvbXBsZXRlZDogdHJ1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRDdXJyZW50VXNlcihjdXJyZW50VXNlci52YWx1ZSlcclxuXHJcbiAgICAgIGxldCBzdHVkZW50cyA9IExvY2FsU3RvcmFnZS5nZXRJdGVtKFwic3R1ZGVudHNcIikgfHwgW11cclxuICAgICAgc3R1ZGVudHMgPSBzdHVkZW50cy5tYXAoc3R1ZGVudCA9PlxyXG4gICAgICAgIHN0dWRlbnQuaWQgPT09IGN1cnJlbnRVc2VyLnZhbHVlLmlkXHJcbiAgICAgICAgICA/IHsgLi4uc3R1ZGVudCwgcHJvZ3Jlc3M6IGN1cnJlbnRVc2VyLnZhbHVlLnByb2dyZXNzIH1cclxuICAgICAgICAgIDogc3R1ZGVudFxyXG4gICAgICApXHJcbiAgICAgIExvY2FsU3RvcmFnZS5zZXQoXCJzdHVkZW50c1wiLCBzdHVkZW50cylcclxuICAgICAgY3VycmVudFVzZXIudmFsdWUgPSBnZXRDdXJyZW50VXNlcigpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZmluaXNoQnV0dG9uU3R5bGUgPSB7XHJcbiAgICAgIGJhY2tncm91bmQ6IFwiI2ZlMzIyM1wiLFxyXG4gICAgICBjb2xvcjogXCIjZmZmXCIsXHJcbiAgICAgIGJveFNoYWRvdzogXCIwIDhweCAwIDAgI2RiMGUwMFwiXHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tIEJvb2ttYXJrcyAtLS1cclxuICAgIGNvbnN0IHNhdmVCb29rbWFya3MgPSAoYm9va21hcmtzQXJyKSA9PiB7XHJcbiAgICAgIGNvbnN0IHVzZXIgPSBnZXRDdXJyZW50VXNlcigpXHJcbiAgICAgIGlmICghdXNlcikgcmV0dXJuXHJcbiAgICAgIGNvbnN0IGtleSA9IHVzZXIuc3R1ZGVudElkID8/IHVzZXIuaWQgPz8gdXNlci5uYW1lXHJcbiAgICAgIGxldCBhbGxCb29rbWFya3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9va21hcmtzXCIpIHx8IFwie31cIilcclxuICAgICAgYWxsQm9va21hcmtzW2tleV0gPSBib29rbWFya3NBcnJcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib29rbWFya3NcIiwgSlNPTi5zdHJpbmdpZnkoYWxsQm9va21hcmtzKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkQm9va21hcmtzID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB1c2VyID0gZ2V0Q3VycmVudFVzZXIoKVxyXG4gICAgICBpZiAoIXVzZXIpIHJldHVybiBbXVxyXG4gICAgICBjb25zdCBrZXkgPSB1c2VyLnN0dWRlbnRJZCA/PyB1c2VyLmlkID8/IHVzZXIubmFtZVxyXG4gICAgICBsZXQgYWxsQm9va21hcmtzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJvb2ttYXJrc1wiKSB8fCBcInt9XCIpXHJcbiAgICAgIHJldHVybiBhbGxCb29rbWFya3Nba2V5XSB8fCBbXVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZUJvb2ttYXJrID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCBib29rbWFyayA9IHsgcm91dGU6IHJvdXRlLm5hbWUgfHwgcm91dGUucGF0aCwgcGFnZTogY3VycmVudFBhZ2UudmFsdWUsIGxlc3NvbklkIH1cclxuICAgICAgbGV0IGV4aXN0aW5nID0gbG9hZEJvb2ttYXJrcygpXHJcbiAgICAgIGNvbnN0IGluZGV4ID0gZXhpc3RpbmcuZmluZEluZGV4KGIgPT4gYi5yb3V0ZSA9PT0gYm9va21hcmsucm91dGUgJiYgYi5wYWdlID09PSBib29rbWFyay5wYWdlKVxyXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSBleGlzdGluZy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgIGVsc2UgZXhpc3RpbmcucHVzaChib29rbWFyaylcclxuICAgICAgc2F2ZUJvb2ttYXJrcyhleGlzdGluZylcclxuICAgICAgYm9va21hcmtlZFBhZ2VzLnZhbHVlID0gbG9hZEJvb2ttYXJrcygpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaXNCb29rbWFya2VkID0gY29tcHV0ZWQoKCkgPT5cclxuICAgICAgYm9va21hcmtlZFBhZ2VzLnZhbHVlLnNvbWUoXHJcbiAgICAgICAgYiA9PiBiLnJvdXRlID09PSAocm91dGUubmFtZSB8fCByb3V0ZS5wYXRoKSAmJiBiLnBhZ2UgPT09IGN1cnJlbnRQYWdlLnZhbHVlXHJcbiAgICAgIClcclxuICAgIClcclxuXHJcbiAgICAvLyAtLS0gUHJvZ3Jlc3MgJiBOYXZpZ2F0aW9uIC0tLVxyXG4gICAgY29uc3QgdXBkYXRlUHJvZ3Jlc3MgPSAoKSA9PiB7IHByb2dyZXNzLnZhbHVlID0gKGN1cnJlbnRQYWdlLnZhbHVlICsgMSkgLyBwYWdlcy52YWx1ZS5sZW5ndGggfVxyXG5cclxuICAgIG9uQmVmb3JlUm91dGVMZWF2ZSgoKSA9PiB7XHJcbiAgICAgIHN0b3BTcGVha2luZygpXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IG5leHRQYWdlID0gKCkgPT4ge1xyXG4gICAgICBpZiAoaXNQbGF5aW5nLnZhbHVlKSBzdG9wU3BlYWtpbmcoKVxyXG4gICAgICBpZiAoY3VycmVudFBhZ2UudmFsdWUgPCBwYWdlcy52YWx1ZS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2UudmFsdWUrK1xyXG4gICAgICAgIHVwZGF0ZVByb2dyZXNzKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtYXJrTGVzc29uQ29tcGxldGUoKVxyXG4gICAgICAgIHNob3dMZXNzb25Db21wbGV0ZS52YWx1ZSA9IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByZXZQYWdlID0gKCkgPT4ge1xyXG4gICAgICBpZiAoaXNQbGF5aW5nLnZhbHVlKSBzdG9wU3BlYWtpbmcoKVxyXG4gICAgICBpZiAoY3VycmVudFBhZ2UudmFsdWUgPiAwKSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2UudmFsdWUtLVxyXG4gICAgICAgIHVwZGF0ZVByb2dyZXNzKClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGdvQmFjayA9ICgpID0+IHtcclxuICAgICAgaWYgKHdpbmRvdy5oaXN0b3J5Lmxlbmd0aCA+IDEpIHJvdXRlci5iYWNrKClcclxuICAgICAgZWxzZSByb3V0ZXIucHVzaChcIi9jaGFwdGVyc1wiKVxyXG4gICAgfVxyXG5cclxuICAgIHdhdGNoKGN1cnJlbnRQYWdlLCAobmV3UGFnZSkgPT4ge1xyXG4gICAgICByb3V0ZXIucmVwbGFjZSh7IHBhdGg6IHJvdXRlLnBhdGgsIHF1ZXJ5OiB7IHBhZ2U6IG5ld1BhZ2UgfSB9KVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyAtLS0gQ29uZmV0dGkgLS0tXHJcbiAgICBjb25zdCBzdGFydENvbmZldHRpID0gKCkgPT4ge1xyXG4gICAgICBzdG9wQ29uZmV0dGkoKVxyXG4gICAgICBjb25zdCBhdWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVzc29uLWNvbXBsZXRlLWF1ZGlvXCIpXHJcbiAgICAgIGlmIChhdWRpbykgeyBhdWRpby5jdXJyZW50VGltZSA9IDA7IGF1ZGlvLnBsYXkoKS5jYXRjaCgoKSA9PiB7IH0pIH1cclxuICAgICAgY29uZmV0dGlJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBjb25mZXR0aSh7IHBhcnRpY2xlQ291bnQ6IDYwLCBzcHJlYWQ6IDcwLCBvcmlnaW46IHsgeTogMC42IH0gfSlcclxuICAgICAgfSwgNTAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0b3BDb25mZXR0aSA9ICgpID0+IHtcclxuICAgICAgaWYgKGNvbmZldHRpSW50ZXJ2YWwpIHsgY2xlYXJJbnRlcnZhbChjb25mZXR0aUludGVydmFsKTsgY29uZmV0dGlJbnRlcnZhbCA9IG51bGwgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLSBMaWZlY3ljbGUgLS0tXHJcbiAgICBvbk1vdW50ZWQoKCkgPT4ge1xyXG4gICAgICBpZiAoIXJvdXRlLnF1ZXJ5Ll9yZWxvYWRlZCkge1xyXG4gICAgICAgIHJvdXRlci5yZXBsYWNlKHsgcGF0aDogcm91dGUucGF0aCwgcXVlcnk6IHsgLi4ucm91dGUucXVlcnksIF9yZWxvYWRlZDogJzEnIH0gfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICBjdXJyZW50VXNlci52YWx1ZSA9IGdldEN1cnJlbnRVc2VyKClcclxuICAgICAgYm9va21hcmtlZFBhZ2VzLnZhbHVlID0gbG9hZEJvb2ttYXJrcygpXHJcbiAgICAgIHVwZGF0ZVByb2dyZXNzKClcclxuXHJcbiAgICAgIGNvbnN0IHBhZ2VGcm9tUXVlcnkgPSBwYXJzZUludChyb3V0ZS5xdWVyeS5wYWdlLCAxMClcclxuICAgICAgaWYgKCFpc05hTihwYWdlRnJvbVF1ZXJ5KSAmJiBwYWdlRnJvbVF1ZXJ5IDwgcGFnZXMudmFsdWUubGVuZ3RoKSBjdXJyZW50UGFnZS52YWx1ZSA9IHBhZ2VGcm9tUXVlcnlcclxuXHJcbiAgICAgIC8vIFN0YXJzIGFuaW1hdGlvblxyXG4gICAgICBjb25zdCBzdGFyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJzJylcclxuICAgICAgaWYgKHN0YXJDb250YWluZXIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBzdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgIHN0YXIuY2xhc3NMaXN0LmFkZCgnc3RhcicpXHJcbiAgICAgICAgICBzdGFyLnN0eWxlLnRvcCA9IE1hdGgucmFuZG9tKCkgKiAxMDAgKyAnJSdcclxuICAgICAgICAgIHN0YXIuc3R5bGUubGVmdCA9IE1hdGgucmFuZG9tKCkgKiAxMDAgKyAnJSdcclxuICAgICAgICAgIHN0YXIuc3R5bGUud2lkdGggPSAoTWF0aC5yYW5kb20oKSAqIDIgKyAxKSArICdweCdcclxuICAgICAgICAgIHN0YXIuc3R5bGUuaGVpZ2h0ID0gc3Rhci5zdHlsZS53aWR0aFxyXG4gICAgICAgICAgc3Rhci5zdHlsZS5hbmltYXRpb25EdXJhdGlvbiA9ICgyICsgTWF0aC5yYW5kb20oKSAqIDMpICsgJ3MnXHJcbiAgICAgICAgICBzdGFyLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gKE1hdGgucmFuZG9tKCkgKiAzKSArICdzJ1xyXG4gICAgICAgICAgc3RhckNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFyKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2xpY2sgdG8gbmF2aWdhdGUgbWluaS10ZXN0c1xyXG4gICAgICBjb25zdCB2aWV3ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdmlld2VyJylcclxuICAgICAgaWYgKHZpZXdlcikge1xyXG4gICAgICAgIHZpZXdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldC5jbG9zZXN0KCdbZGF0YS1yb3V0ZV0nKVxyXG4gICAgICAgICAgaWYgKHRhcmdldCkgcm91dGVyLnB1c2godGFyZ2V0LmRhdGFzZXQucm91dGUpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBvblVubW91bnRlZCgoKSA9PiB7IGF1ZGlvTWFuYWdlci5yZXN0b3JlQmcoKSB9KVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGN1cnJlbnRQYWdlLFxyXG4gICAgICBpc1BsYXlpbmcsXHJcbiAgICAgIHBhZ2VzLFxyXG4gICAgICBzaG93TGVzc29uQ29tcGxldGUsXHJcbiAgICAgIGJvb2ttYXJrZWRQYWdlcyxcclxuICAgICAgcHJvZ3Jlc3MsXHJcbiAgICAgIGlzQm9va21hcmtlZCxcclxuICAgICAgZmluaXNoQnV0dG9uU3R5bGUsXHJcbiAgICAgIHRvZ2dsZUF1ZGlvOiAoKSA9PiB0b2dnbGVBdWRpbyhwYWdlcy52YWx1ZVtjdXJyZW50UGFnZS52YWx1ZV0pLFxyXG4gICAgICBuZXh0UGFnZSxcclxuICAgICAgcHJldlBhZ2UsXHJcbiAgICAgIGdvQmFjayxcclxuICAgICAgdG9nZ2xlQm9va21hcmssXHJcbiAgICAgIHN0YXJ0Q29uZmV0dGksXHJcbiAgICAgIHN0b3BDb25mZXR0aSxcclxuICAgICAgY3VycmVudFVzZXIsXHJcbiAgICAgIGlzTGVzc29uQ29tcGxldGUsXHJcbiAgICAgIG1hcmtMZXNzb25Db21wbGV0ZVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG48L3NjcmlwdD5cclxuXHJcblxyXG48c3R5bGUgc3JjPVwic3JjL2Nzcy9sZXNzb25CYWNrZ3JvdW5kLmNzc1wiPjwvc3R5bGU+XHJcbjxzdHlsZSBzcmM9XCJzcmMvY3NzL2xlc3Nvbi5jc3NcIiBzY29wZWQ+PC9zdHlsZT5cclxuIl0sIm5hbWVzIjpbIl9zZmNfbWFpbiIsInJvdXRlIiwidXNlUm91dGUiLCJyb3V0ZXIiLCJ1c2VSb3V0ZXIiLCJjdXJyZW50UGFnZSIsInJlZiIsInByb2dyZXNzIiwic2hvd0xlc3NvbkNvbXBsZXRlIiwiaXNQbGF5aW5nIiwidG9nZ2xlQXVkaW8iLCJzdG9wU3BlYWtpbmciLCJ1c2VUVFMiLCJjdXJyZW50VXNlciIsImdldEN1cnJlbnRVc2VyIiwiY29uZmV0dGlJbnRlcnZhbCIsImxlc3NvbiIsImZsYXRMZXNzb25zIiwibCIsImxlc3NvbklkIiwiYm9va21hcmtlZFBhZ2VzIiwicGFnZXMiLCJpc0xlc3NvbkNvbXBsZXRlIiwiY29tcHV0ZWQiLCJtYXJrTGVzc29uQ29tcGxldGUiLCJzZXRDdXJyZW50VXNlciIsInN0dWRlbnRzIiwiTG9jYWxTdG9yYWdlIiwic3R1ZGVudCIsImZpbmlzaEJ1dHRvblN0eWxlIiwic2F2ZUJvb2ttYXJrcyIsImJvb2ttYXJrc0FyciIsInVzZXIiLCJrZXkiLCJhbGxCb29rbWFya3MiLCJsb2FkQm9va21hcmtzIiwidG9nZ2xlQm9va21hcmsiLCJib29rbWFyayIsImV4aXN0aW5nIiwiaW5kZXgiLCJiIiwiaXNCb29rbWFya2VkIiwidXBkYXRlUHJvZ3Jlc3MiLCJvbkJlZm9yZVJvdXRlTGVhdmUiLCJuZXh0UGFnZSIsInByZXZQYWdlIiwiZ29CYWNrIiwid2F0Y2giLCJuZXdQYWdlIiwic3RhcnRDb25mZXR0aSIsInN0b3BDb25mZXR0aSIsImF1ZGlvIiwiY29uZmV0dGkiLCJvbk1vdW50ZWQiLCJwYWdlRnJvbVF1ZXJ5Iiwic3RhckNvbnRhaW5lciIsImkiLCJzdGFyIiwidmlld2VyIiwiZSIsInRhcmdldCIsIm9uVW5tb3VudGVkIiwiYXVkaW9NYW5hZ2VyIiwiX2hvaXN0ZWRfMSIsIl9ob2lzdGVkXzIiLCJfaG9pc3RlZF8zIiwiX2hvaXN0ZWRfNCIsIl9ob2lzdGVkXzYiLCJfaG9pc3RlZF83IiwiX2hvaXN0ZWRfOCIsIl9jcmVhdGVCbG9jayIsIlFMYXlvdXQiLCJfY3JlYXRlVk5vZGUiLCJRSGVhZGVyIiwiUVRvb2xiYXIiLCJRQnRuIiwiJHNldHVwIiwiUVRvb2xiYXJUaXRsZSIsIl9jYWNoZSIsIl9jcmVhdGVFbGVtZW50Vk5vZGUiLCJfdG9EaXNwbGF5U3RyaW5nIiwiUVBhZ2VDb250YWluZXIiLCJRUGFnZSIsIl9UcmFuc2l0aW9uIiwiX2NyZWF0ZUVsZW1lbnRCbG9jayIsIlFMaW5lYXJQcm9ncmVzcyIsImFyZ3MiLCJRRGlhbG9nIiwiJGV2ZW50IiwiUUNhcmQiLCJRQ2FyZFNlY3Rpb24iLCJRQ2FyZEFjdGlvbnMiXSwibWFwcGluZ3MiOiIrNEJBNkVBLE1BQUtBLEdBQVUsQ0FDYixLQUFNLHlCQUNOLE9BQVEsQ0FDTixNQUFNQyxFQUFRQyxFQUFRLEVBQ2hCQyxFQUFTQyxFQUFTLEVBQ2xCQyxFQUFjQyxFQUFJLENBQUMsRUFDbkJDLEVBQVdELEVBQUksQ0FBQyxFQUNoQkUsRUFBcUJGLEVBQUksRUFBSyxFQUc5QixDQUFFLFVBQUFHLEVBQVcsWUFBQUMsRUFBYSxhQUFBQyxDQUFXLEVBQU1DLEdBQU0sRUFFakRDLEVBQWNQLEVBQUlRLEdBQWdCLEVBQ3hDLElBQUlDLEVBQW1CLEtBQ3ZCLE1BQU1DLEVBQVNDLEdBQVksS0FBS0MsR0FBS0EsRUFBRSxRQUFVakIsRUFBTSxJQUFJLEVBQ3JEa0IsRUFBV0gsRUFBUyxPQUFPQSxFQUFPLEVBQUUsRUFBSSxLQUV4Q0ksRUFBa0JkLEVBQUksRUFBRSxFQUd4QmUsRUFBUWYsRUFBSSxDQUNoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFtQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBbUJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFZQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQXVCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUF5QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBc0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBaUJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFrQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQTJCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFrQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFpQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FPQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWlCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQU9BO0FBQUE7QUFBQTtBQUFB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
