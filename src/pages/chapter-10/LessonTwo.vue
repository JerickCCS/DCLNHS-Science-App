<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <div class="lesson-toolbar">
        <button class="toolbar-btn" @click="goBack">
          <q-icon name="arrow_back" size="24px" />
        </button>
        <div class="lesson-toolbar-title">Lesson 2: Measuring Earthquakes</div>
        <button class="bookmark-btn" @click="toggleBookmark">
          <span class="material-icons" :style="{ color: isBookmarked ? '#FFD600' : 'white', fontSize: '24px' }">
            {{ isBookmarked ? 'bookmark' : 'bookmark_border' }}
          </span>
        </button>
      </div>
      <q-linear-progress :value="progress" size="4px" color="white" class="header-progress" />
    </q-header>

    <q-page-container class="night-sky">
      <q-page>
        <div class="stars"></div>
        <div class="lesson-container">
          <div id="viewer">
            <transition name="fade-slide" mode="out-in">
              <div :key="currentPage" v-html="pages[currentPage]"></div>
            </transition>
          </div>

          <div class="buttons">
            <q-btn class="nav-button" :disable="currentPage === 0" @click="prevPage" no-caps>Previous</q-btn>

            <div class="text-subtitle2 text-white">{{ currentPage + 1 }} / {{ pages.length }}</div>

            <q-btn class="nav-button" @click="nextPage" :label="currentPage === pages.length - 1 ? 'Finish' : 'Next'"
              :style="currentPage === pages.length - 1 ? finishButtonStyle : null" no-caps />
          </div>

          <div class="speak-btn" @click="toggleAudio">
            <img :src="isPlaying ? '/icons/stop.png' : '/icons/speak.png'" alt="Speak Button" class="cursor-pointer"
              style="width: 20px; height: 20px;" />
          </div>
        </div>
      </q-page>
    </q-page-container>

    <audio id="lesson-complete-audio" src="assets/audio/completed.mp3" preload="auto"></audio>

    <q-dialog v-model="showLessonComplete" @show="startConfetti" @hide="stopConfetti" persistent>
      <q-card class="lesson-complete-card q-pa-md text-center relative-position">
        <q-card-section>
          <div class="stars-row flex justify-center items-center q-gutter-md">
            <img src="assets/icons/five-stars.gif" class="star-icon big-star" />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-bold">🎉 Congratulations!</div>
          <div class="text-subtitle2 q-mt-sm">You have completed this lesson.</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="OK" color="primary" unelevated rounded class="lesson-ok-btn" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useTTS } from "src/composables/useTTS"
import confetti from "canvas-confetti"
import { getCurrentUser, setCurrentUser } from "src/utils/session"
import { flatLessons } from "src/utils/lessons"
import { LocalStorage } from "quasar"
import '@google/model-viewer';
import { audioManager } from "src/utils/audioManager"
import { onBeforeRouteLeave } from "vue-router"

export default {
  name: "ScientificModelsLesson",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const currentPage = ref(0)
    const progress = ref(0)
    const showLessonComplete = ref(false)

    // --- TTS composable ---
    const { isPlaying, toggleAudio, stopSpeaking } = useTTS()

    const currentUser = ref(getCurrentUser())
    let confettiInterval = null
    const lesson = flatLessons.find(l => l.route === route.path)
    const lessonId = lesson ? String(lesson.id) : "72"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
  <div>
    <!-- Card 1 -->
    <div class="header">
      <div>
        <div class="title">How Are Earthquakes Measured?</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/measuring earthquakes.png" alt="Placeholder">
      <p style="margin-top: 20px">How Are Earthquakes Measured?
Seismograph measuring earthquake
Earthquakes vary in strength—some earthquakes are too weak to be noticed, while others are so strong that they cause catastrophic damage. To describe the size and degree of shaking caused by an earthquake, the terms intensity and magnitude are used.</p>
    </div>
  </div>
  `,

      `
  <div>
    <!-- Card 2 -->
    <div class="header">
      <div>
        <div class="title">Intensity of an Earthquake</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/intensity.png" alt="Placeholder">
    </div>
    <p>Intensity of an Earthquake
Earthquake intensity scale
Intensity refers to the perceptible strength of an earthquake in a certain locality or area. It describes the effects or the amount of damage earthquakes has caused on people, infrastructures, natural objects, and land surfaces.</p>
<p>In 1996, PHIVOLCS adopted a 10-point intensity scale to replace the Rossi-Forel scale, which is one of the first seismic scales that describes the intensity of an earthquake. The adopted scale, called the PHIVOLCS Earthquake Intensity Scale (PEIS), categorizes earthquakes from scarcely perceptible (I) to completely devastating (X).</p>
  </div>
  `,

      `
  <div>
    <!-- Card 3 -->
    <div class="header">
      <div>
        <div class="title">Table 10-1. PHIVOLCS Earthquake Intensity Scale (PEIS)
</div>
      </div>
    </div>

    <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse: collapse; min-width:600px; height: 60vh;">
        <thead>
            <tr>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Intensity</th>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Shaking</th>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding:10px; border:1px solid #ddd;">I</td>
                <td style="padding:10px; border:1px solid #ddd;">Scarcely perceptible</td>
                <td style="padding:10px; border:1px solid #ddd;">The earthquake is scarcely perceptible to people. Still water in containers oscillates slowly.</td>
            </tr>
            <tr>
                <td style="padding:10px; border:1px solid #ddd;">II</td>
                <td style="padding:10px; border:1px solid #ddd;">Slightly felt</td>
                <td style="padding:10px; border:1px solid #ddd;">The earthquake is felt by few individuals at rest indoors. Still water in containers oscillates noticeably.</td>
            </tr>
            <tr>
                <td style="padding:10px; border:1px solid #ddd;">III</td>
                <td style="padding:10px; border:1px solid #ddd;">Weak</td>
                <td style="padding:10px; border:1px solid #ddd;">The earthquake is felt by many people indoors, especially in upper floors of buildings. The perceived vibrations are like those made by a passing light truck. Dizziness and nausea are experienced by some people. Hanging objects swing moderately. Still water in containers oscillates moderately.</td>
            </tr>
            <tr>
                <td style="padding:10px; border:1px solid #ddd;">IV</td>
                <td style="padding:10px; border:1px solid #ddd;">Moderately strong</td>
                <td style="padding:10px; border:1px solid #ddd;">The earthquake is generally felt by people indoors and by some people outdoors. Light sleepers are awakened. The perceived vibrations are like those made by a passing heavy truck. Hanging objects swing considerably. Parked motorcars may rock slightly. Liquids in containers are slightly disturbed. Water in containers oscillates strongly. Rumbling sounds may be heard.</td>
            </tr>
                 <tr>
                <td style="padding:10px; border:1px solid #ddd;">V</td>
                <td style="padding:10px; border:1px solid #ddd;">Strong</td>
                <td style="padding:10px; border:1px solid #ddd;">The earthquake is generally felt by most people indoors and outdoors. Many sleeping people are awakened. Some are frightened; some run outdoors. Strong shaking and rocking is felt throughout the building. Hanging objects swing violently. Dining utensils clatter and some may be damaged. Parked vehicles rock noticeably. Shaking of leaves and twigs of trees are noticeable.</td>
            </tr>
        </tbody>
    </table>
</div>

   
  </div>
  `,

      `
  <div>
    <!-- Card 4 -->
    <div class="header">
      <div>
        <div class="title">Table 10-1. PHIVOLCS Earthquake Intensity Scale (PEIS)
</div>
      </div>
    </div>

    <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse: collapse; min-width:600px;">
        <thead>
            <tr>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Intensity</th>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Shaking</th>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Description</th>
            </tr>
        </thead>
        <tbody>
               <tr>
                <td style="padding:10px; border:1px solid #ddd;">VI</td>
                <td style="padding:10px; border:1px solid #ddd;">Very strong</td>
                <td style="padding:10px; border:1px solid #ddd;">Some people lose their balance. Motorists feel like they are driving on flat tires. Heavy objects or furniture move or are slightly displaced. Small church bells may ring. Old or poorly built houses and human-made structures are slightly damaged. Trees shake noticeably.</td>
            </tr>
            <tr>
                <td style="padding:10px; border:1px solid #ddd;">VII</td>
                <td style="padding:10px; border:1px solid #ddd;">Destructive</td>
                <td style="padding:10px; border:1px solid #ddd;">People may find it difficult to stand. Heavy objects and furniture may overturn or topple. Big church bells ring. Old or poorly built structures suffer considerable damage. Some well-built structures are slightly damaged. Some cracks may appear on dikes, fishponds, road surfaces, or concrete hollow block walls. Limited liquefaction, lateral spreading, and landslides are observed.</td>
            </tr>
              <tr>
                <td style="padding:10px; border:1px solid #ddd;">VIII</td>
                <td style="padding:10px; border:1px solid #ddd;">Very destructive</td>
                <td style="padding:10px; border:1px solid #ddd;">People find it difficult to stand indoors and outdoors. Many well-built buildings are considerably damaged. Concrete dikes and foundations of bridges are destroyed. Tombstones may be displaced, twisted, or overturned. Utility posts, towers, and monuments may tilt or topple. Water and sewer pipes may be bent, twisted, or broken. Liquefaction and lateral spreading cause man-made structures to sink, tilt, or topple. Landslides and rock falls occur in mountainous and hilly areas. Boulders, particularly those near the epicenter, roll out from their positions. Fissures and faults rupture may be observed. Trees shake violently. Water splashes over dikes or banks of rivers.</td>
            </tr>
        </tbody>
    </table>
</div>

  </div>
  `,

      `
  <div>
    <!-- Card 5 -->
    <div class="header">
      <div>
        <div class="title">Table 10-1. PHIVOLCS Earthquake Intensity Scale (PEIS)
</div>
      </div>
    </div>

    <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse: collapse; min-width:600px;">
        <thead>
            <tr>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Intensity</th>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Shaking</th>
                <th style="background-color: #6911c8; color: white; padding:10px; border:1px solid #ddd; text-align:left;">Description</th>
            </tr>
        </thead>
        <tbody>
          
            <tr>
                <td style="padding:10px; border:1px solid #ddd;">IX</td>
                <td style="padding:10px; border:1px solid #ddd;">Devastating</td>
                <td style="padding:10px; border:1px solid #ddd;">People are forcibly thrown to the ground. Most buildings are totally damaged. Bridges and elevated concrete structures are toppled or destroyed. Utility posts, towers, and monuments are tilted, toppled, or broken. Water sewer pipes are bent, twisted, or broken. Landslides and liquefaction with lateral spreading and sand boils are widespread. Trees are shaken very violently, with some toppled or uprooted. Boulders are commonly thrown out of their position. River water splashes violently or slops over dikes and banks.</td>
            </tr>
            <tr>
                <td style="padding:10px; border:1px solid #ddd;">X</td>
                <td style="padding:10px; border:1px solid #ddd;">Completely devastating</td>
                <td style="padding:10px; border:1px solid #ddd;">Practically all human-made structures are destroyed. Massive landslides and liquefaction, large-scale subsidence, and uplifting of landforms and many ground fissures are observed. Changes in river courses and destructive seiches in large lakes occur. Many trees are toppled, broken, or uprooted.</td>
            </tr>
        </tbody>
    </table>

    <div>
    <!-- Card 8 -->
    <p style="margin-top: 20px;"><strong>Intensity</strong> is generally greater in areas near the epicenter; however, it is possible that two nearby areas may experience different intensities. Factors that affect or control the intensity or shaking of an earthquake include the depth of the earthquake, distance from fault rupture, ground material, and building construction.</p>
  </div>

</div>
 `,

      `
    <!-- Card 9 -->
    <div class="header">
      <div>
        <div class="title">Magnitude of an Earthquake
</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/seismograph.png" alt="Placeholder">
      <div class="caption">Figure 10-4: Ground motions detected by a seismograph or seismometer are recorded on a seismogram.</div>
    </div>
<div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/whereas.mp4" controls alt="intensity and magnitude" type="video/mp4">
          </video>
          <div class="caption">Intensity and Magnitude</div>
        </div>
  </div>
  `,

      `
  <div>
    <!-- Card 10 -->
    <div class="header">
      <div>
        <div class="title">Table 10-2. Richter Magnitude Scale</div>
      </div>
    </div>

    <div style="overflow-x:auto;">
  <table border="1" style="width:100%; border-collapse: collapse; min-width:700px; height:80vh;">
    <thead>
      <tr>
        <th style="padding: 8px; background-color: #6911c8; color:white; text-align: left;">Magnitude</th>
        <th style="padding: 8px; background-color: #6911c8; color:white; text-align: left;">Description</th>
        <th style="padding: 8px; background-color: #6911c8; color:white; text-align: left;">Earthquake Effects</th>
        <th style="padding: 8px; background-color: #6911c8; color:white; text-align: left;">Frequency</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px;">Less than 2.0</td>
        <td style="padding: 8px;">Micro</td>
        <td style="padding: 8px;">Microearthquakes are not felt or felt only by sensitive people. They are only recorded by seismographs.</td>
        <td style="padding: 8px;">Continual or several millions per year</td>
      </tr>
      <tr>
        <td style="padding: 8px;">2.0–2.9</td>
        <td style="padding: 8px;">Minor</td>
        <td style="padding: 8px;">Minor earthquakes are slightly felt by some people. There is no damage to buildings.</td>
        <td style="padding: 8px;">Over one million per year</td>
      </tr>
      <tr>
        <td style="padding: 8px;">3.0–3.9</td>
        <td style="padding: 8px;">Minor</td>
        <td style="padding: 8px;">Minor earthquakes are often felt by people, but very rarely cause damage. Shaking of indoor objects can be noticeable.</td>
        <td style="padding: 8px;">Over 100,000 per year</td>
      </tr>
      <tr>
        <td style="padding: 8px;">4.0–4.9</td>
        <td style="padding: 8px;">Light</td>
        <td style="padding: 8px;">
Light earthquakes are felt by most people in the affected area and generally cause no to minimal damage. Moderate to significant damage is very unlikely. Shaking of indoor objects and rattling noises are noticeable. Some objects may fall off shelves or be knocked over.</td>
        <td style="padding: 8px;">10,000–15,000 per year</td>
      </tr>
      <tr>
        <td style="padding: 8px;">5.0–5.9</td>
        <td style="padding: 8px;">Moderate</td>
        <td style="padding: 8px;">Moderate earthquakes are felt by everyone and can cause damage of varying severity to poorly built buildings. At most, there is none to slight damage to all other buildings. Casualties range from none to a few.</td>
        <td style="padding: 8px;">1,000–1,500 per year</td>
      </tr>
    </tbody>
  </table>
</div>

  </div>
  `,

      `
  <div>
    <!-- Card 11 -->
<div style="overflow-x:auto;" ">
  <table border="1" style="width:100%; border-collapse: collapse; min-width:700px; height:80vh;">
    <thead>
      <tr>
        <th style="padding: 8px; background-color: #6911c8; color:white; text-align: left;">Magnitude</th>
        <th style="padding: 8px; background-color: #6911c8; color:white; text-align: left;">Description</th>
        <th style="padding: 8px; background-color: #6911c8; color:white; text-align: left;">Earthquake Effects</th>
        <th style="padding: 8px; background-color: #6911c8; color:white; text-align: left;">Frequency</th>
      </tr>
    </thead>
    <tbody>
       <tr>
        <td style="padding: 8px;">6.0–6.9</td>
        <td style="padding: 8px;">Strong</td>
        <td style="padding: 8px;">Strong earthquakes are felt in wider areas, up to hundreds of kilometers from the epicenter. They can cause damage to areas far from the epicenter. There is strong to violent shaking in the epicenter and the immediate area. Many buildings in populated areas are damaged. Earthquake-resistant structures survive with slight to moderate damage. Poorly built structures receive moderate to severe damage..</td>
        <td style="padding: 8px;">100–150 per year</td>
      </tr>
      <tr>
        <td style="padding: 8px;">7.0–7.9</td>
        <td style="padding: 8px;">Major</td>
        <td style="padding: 8px;">Major earthquakes are felt in large areas and can cause damage to most buildings. Some buildings partially or completely collapse or sustain severe damage. Well-built structures are likely to receive damage.</td>
        <td style="padding: 8px;">10–20 per year</td>
      </tr>
      <tr>
        <td style="padding: 8px;">8.0–8.9</td>
        <td style="padding: 8px;">Great</td>
        <td style="padding: 8px;">Great earthquakes are felt in extremely large regions and can cause major damage to buildings. Structures are likely to be destroyed. There is moderate to heavy damage to sturdy or earthquake-resistant buildings. Some buildings are totally destroyed and large areas are damaged.</td>
        <td style="padding: 8px;">One per year</td>
      </tr>
      <tr>
        <td style="padding: 8px;">9.0–9.9</td>
        <td style="padding: 8px;">Great</td>
        <td style="padding: 8px;">There is near or total destruction—all buildings sustain severe damage or collapse completely. Damage and shaking extend to distant locations. There are permanent changes in ground topography.</td>
        <td style="padding: 8px;">One per 10–50 years</td>
      </tr>
      <tr>
        <td style="padding: 8px;">10.0 and greater</td>
        <td style="padding: 8px;">Epic</td>
        <td style="padding: 8px;">Never been recorded.</td>
        <td style="padding: 8px;">—</td>
      </tr>
    </tbody>
  </table>
</div>
</div>
  `,

      `
  <div>
    <!-- Card 12 -->
<div class="info-card" >
      <div class="info-title">MINI TEST 10-4</div>
      <div class="info-content">
        <div class="info-text">
          <p  > 1. Describe the intensity of an earthquake as you move farther from the epicenter.</p>
          <p  >2. Define earthquake using the terms magnitude, intensity, and energy.</p>

          <div class="start-btn-container" >
            <q-btn data-route="/mini-test-10-4" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="header">
      <div>
        <div class="title">Earthquake Hazards</div>
      </div>
    </div>
    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/earthquake-hazards.mp4" controls alt="earthquake hazards" type="video/mp4">
          </video>
          <div class="caption">Earthquake Hazards Animation</div>
        </div>
  </div>
  `,

      `
  <div>
    <!-- Card 13 -->
    <div class="header">
      <div>
        <div class="title">Primary Earthquake Hazards</div>
      </div>
    </div>

       <p>In brief, the hazards associated with earthquakes depend on the strength of the earthquake and the physical features of the areas it affects.</p>

          <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/ground-shaking.mp4" controls alt="figure 11-3" type="video/mp4">
          </video>
          </div>
          <p >Ground shaking is the main cause of destruction during an earthquake. Vibrations may cause tall buildings to collapse, roads and railroad tracks to break, electric posts to topple, water pipes to dislodge, dams to fail, and landslides to occur.</p>
        


  </div>
  `,

      `
  <div>
    <!-- Card 14 -->
    <div class="header">
      <div>
        <div class="title">Primary Earthquake Hazards</div>
      </div>
    </div>
          <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/liquefaction.mp4" controls alt="video" type="video/mp4">
          </video>
          </div>
        <p style="margin-top: 20px;">Liquefaction results in ground subsidence, and causes structures to sink or tilt. During earthquakes, loose sand and soil that are saturated with water become incapable of supporting structures, causing collapse.</p>

          <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/fblite_video-4.mp4" controls alt="video" type="video/mp4">
          </video>
        </div><p>Landslide refers to the downward movement of soil or rock. This happens because ground shaking can loosen rock and soil materials and reduce the cohesion among the particles. This makes it easier for the force of gravity to pull the materials downward.</p>
      
  </div>
  `,

      `
  <div>
    <!-- Card 15 -->
    <div class="header">
      <div>
        <div class="title">Primary Earthquake Hazards</div>
      </div>
    </div>
          <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/fblite_video-2.mp4" controls alt="video" type="video/mp4">
          </video>
          </div>
          <p style="margin-top: 20px;">Ground rupture is the deformation on the ground that occurs along existing faults. Places located on top of and along faults trace face a high risk of ground rupture. Structures on top of a ruptured fault are destroyed.</p>

          <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/fblite_video-1.mp4" controls alt="video" type="video/mp4">
          </video>
          </div>
        <p>Tsunami is a Japanese term used to describe a series of ocean waves generated by the displacement of water due to underwater earthquakes or volcanic eruptions.</p>
  </div>
  `,
      `
  <div>
    <!-- Card 16 -->
        <p>The tsunami that hit the island of Sulawesi in Indonesia on September 28, 2018 shows the destruction that tsunamis can cause. This tsunami, triggered by a 7.5 magnitude earthquake, caused water to smash buildings and houses, killing more than 400 people and badly injuring another 400. The epicenter of the earthquake was located in the mountainous region of Donggala Regency in the Central Sulawesi Province of Indonesia. The earthquake was triggered by the movement of the Palu-Koro fault which is 20 kilometers deep.</p>

    <p>For a tsunami to be formed, an earthquake of great magnitude must have occurred. Earthquakes of magnitude between 6.5 and 7.5 do not usually produce tsunamis. Earthquakes of magnitude 7.9 and greater might produce destructive local tsunamis near the epicenter.<p>
 
  `,

      `
      
    <p>The source of energy should be big enough and close enough to the ocean floor. The energy of an 8.0 magnitude earthquake is equivalent to about 6,270,000 tons of TNT explosives. Most tsunamis are generated by earthquakes less than 100 kilometers below the Earth's surface.</p>

    <p>The energy from such an earthquake causes the ocean floor to rise or fall, triggering a tsunami. Volcanic eruption under the ocean, submarine landslides or landslides in the mountains carrying a big volume of debris to the ocean can also cause tsunamis. Large meteorite plunging into the Ocean may also cause tsunamis.</p>

 `,

      `
  <div>
    <!-- Card 17 -->
    <div class="header">
      <div>
        <div class="title">Tsunami Safety Measures</div>
      </div>
    </div>
          <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/lv_0_20260121155223.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">Howto be safe from tsunamis?</div>
        </div>

     <div class="info-card">
      <div class="info-title">Mini Lab 10-4</div>
      <div class="info-content">
        <div class="info-text">
          <p>Survey your community for potential earthquake hazards.</p>

          <p>Create a poster, infographic, or comic strip to help your community understand these hazards.</p>

          <p>Include also the necessary courses of action in case of a tsunami</p>

        </div>
      </div>
    </div>
  </div>   

  `
    ])

    // --- Lesson completion ---
    const isLessonComplete = computed(() =>
      currentUser.value?.progress?.[lessonId]?.completed || false
    )

    const markLessonComplete = () => {
      if (!currentUser.value) return
      if (!currentUser.value.progress) currentUser.value.progress = {}

      currentUser.value.progress[lessonId] = {
        ...currentUser.value.progress[lessonId],
        completed: true
      }

      setCurrentUser(currentUser.value)

      let students = LocalStorage.getItem("students") || []
      students = students.map(student =>
        student.id === currentUser.value.id
          ? { ...student, progress: currentUser.value.progress }
          : student
      )
      LocalStorage.set("students", students)
      currentUser.value = getCurrentUser()
    }

    const finishButtonStyle = {
      background: "#fe3223",
      color: "#fff",
      boxShadow: "7px 7px 0px 0px rgba(0, 0, 0, 0.16)"
    }

    // --- Bookmarks ---
    const saveBookmarks = (bookmarksArr) => {
      const user = getCurrentUser()
      if (!user) return
      const key = user.studentId ?? user.id ?? user.name
      let allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}")
      allBookmarks[key] = bookmarksArr
      localStorage.setItem("bookmarks", JSON.stringify(allBookmarks))
    }

    const loadBookmarks = () => {
      const user = getCurrentUser()
      if (!user) return []
      const key = user.studentId ?? user.id ?? user.name
      let allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}")
      return allBookmarks[key] || []
    }

    const toggleBookmark = () => {
      const bookmark = { route: route.name || route.path, page: currentPage.value, lessonId }
      let existing = loadBookmarks()
      const index = existing.findIndex(b => b.route === bookmark.route && b.page === bookmark.page)
      if (index !== -1) existing.splice(index, 1)
      else existing.push(bookmark)
      saveBookmarks(existing)
      bookmarkedPages.value = loadBookmarks()
    }

    const isBookmarked = computed(() =>
      bookmarkedPages.value.some(
        b => b.route === (route.name || route.path) && b.page === currentPage.value
      )
    )

    // --- Progress & Navigation ---
    const updateProgress = () => { progress.value = (currentPage.value + 1) / pages.value.length }

    onBeforeRouteLeave(() => {
      stopSpeaking()
    })

    const nextPage = () => {
      if (isPlaying.value) stopSpeaking()
      if (currentPage.value < pages.value.length - 1) {
        currentPage.value++
        updateProgress()
      } else {
        markLessonComplete()
        showLessonComplete.value = true
      }
    }

    const prevPage = () => {
      if (isPlaying.value) stopSpeaking()
      if (currentPage.value > 0) {
        currentPage.value--
        updateProgress()
      }
    }

    const goBack = () => {
      if (window.history.length > 1) router.back()
      else router.push("/chapters")
    }

    watch(currentPage, (newPage) => {
      router.replace({ path: route.path, query: { page: newPage } })
    })

    // --- Confetti ---
    const startConfetti = () => {
      stopConfetti()
      const audio = document.getElementById("lesson-complete-audio")
      if (audio) { audio.currentTime = 0; audio.play().catch(() => { }) }
      confettiInterval = setInterval(() => {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })
      }, 500)
    }

    const stopConfetti = () => {
      if (confettiInterval) { clearInterval(confettiInterval); confettiInterval = null }
    }

    // --- Lifecycle ---
    onMounted(() => {
      /* Reload Fix */

      currentUser.value = getCurrentUser()
      bookmarkedPages.value = loadBookmarks()
      updateProgress()

      const pageFromQuery = parseInt(route.query.page, 10)
      if (!isNaN(pageFromQuery) && pageFromQuery < pages.value.length) currentPage.value = pageFromQuery

      // Stars animation
      const starContainer = document.querySelector('.stars')
      if (starContainer) {
        for (let i = 0; i < 100; i++) {
          const star = document.createElement('div')
          star.classList.add('star')
          star.style.top = Math.random() * 100 + '%'
          star.style.left = Math.random() * 100 + '%'
          star.style.width = (Math.random() * 2 + 1) + 'px'
          star.style.height = star.style.width
          star.style.animationDuration = (2 + Math.random() * 3) + 's'
          star.style.animationDelay = (Math.random() * 3) + 's'
          starContainer.appendChild(star)
        }
      }

      // Click to navigate mini-tests
      const viewer = document.querySelector('#viewer')
      if (viewer) {
        viewer.addEventListener('click', (e) => {
          const target = e.target.closest('[data-route]')
          if (target) router.push(target.dataset.route)
        })
      }
    })

    onUnmounted(() => {
      stopSpeaking()
      stopConfetti()
      audioManager.restoreBg()
    })

    return {
      currentPage,
      isPlaying,
      pages,
      showLessonComplete,
      bookmarkedPages,
      progress,
      isBookmarked,
      finishButtonStyle,
      toggleAudio: () => toggleAudio(pages.value[currentPage.value]),
      nextPage,
      prevPage,
      goBack,
      toggleBookmark,
      startConfetti,
      stopConfetti,
      currentUser,
      isLessonComplete,
      markLessonComplete
    }
  }
}
</script>


<style src="src/css/lessonBackground.css"></style>
<style src="src/css/lesson.css" scoped></style>