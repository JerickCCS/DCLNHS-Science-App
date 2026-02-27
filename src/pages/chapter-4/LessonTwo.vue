<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <q-toolbar class="toolbar-row">
        <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
        <q-toolbar-title class="navbar-title">Lesson 2: The Cell: The Basic Unit of Life</q-toolbar-title>
        <div class="row items-center q-gutter-sm">
          <q-btn flat dense round :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" color="yellow"
            @click="toggleBookmark" />
        </div>
      </q-toolbar>
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
    const lessonId = lesson ? String(lesson.id) : "29"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
    <div>
      <!-- Card 1 -->
      <p></p>
      <div class="header">
        <div class="title">The Cell: The Basic Unit of Life</div>
      </div>
      <p style="font-weight: bold; padding-top: 10px; margin-bottom: 1px;">Why are cells important?</p>
      <p style="font-weight: bold; padding-top: 10px; margin-bottom: 1px;">A Closer Look at the Cell</p>
      <p style="font-weight: bold; padding-top: 10px; margin-bottom: 1px;">Is life possible without the cell?</p>
      <p>Cells are microscopic units that collectively carry out the processes that make an organism a living entity. Your body is composed of trillions of cells of around 200 different types. Your brain is made up of brain cells, your skeleton of bone cells, and your heart of cardiac muscle cells.</p>
      <p>The discovery of cells changed the way scientists study living organisms. Up to the early 1600s, people only knew of organisms that they could see with the unaided eye. They had no knowledge of the existence of microscopic life-forms.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 2 -->
      <p>Scientists consider Robert Hooke and his early contemporaries to have paved the way for the development of modern biology. Hooke used an early microscope like the one shown in figure 4-3 to examine a thin slice of cork from a mature tree. He observed tiny, box-shaped structures which he called cellulae, meaning "small room" in Latin; hence the term. What Hooke actually observed were the cell walls of dead plant cells, which are components of the cork. The simplicity of his instrument limited his work, but scientists who came after him succeeded in unraveling the intricate design of a living cell.</p>
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-3.png" alt="figure 4-3">
        <div class="caption">Figure 4-3. Cork cells under the early microscope</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 3 -->
      <div class="header">
        <div class="title">The Cell Theory</div>
      </div>
      <p>In 1839, German botanist Matthias Schleiden and German physician Theodor Schwann formulated the cell theory, which states that all living things are made up of cells. German physician Rudolf Virchow also contributed to this theory. He stated that new cells came from preexisting cells. The classical cell theory formulated by Schleiden, Schwann, and Virchow is the foundation of modern biology.</p>
      <p>Modern molecular biology has added many principles to cell theory. These are:</p>
      <p>1. Energy flows within cells.</p>
      <p>2. Cells contain deoxyribonucleic acid (DNA), which is passed on from a parent cell to the daughter cells during cell division.</p>
      <p>3. All cells have basically the same chemical composition and metabolic activities.</p>
      <p>Sibs Publishing Hou</p>
      <p>4. Cell activity depends on the activities of subcellular structures within the cell.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <div class="title">Prokaryotic versus Eukaryotic Cells</div>
      </div>
      <p>There are two main types of cell: prokaryotic and eukaryotic which is shown on figure 4-4. Prokaryotic cells lack a nucleus and membrane bound organelles. An example of a prokaryotic cell is a bacterium. Bacteria are among the earliest life-forms to appear on Earth, and are present in most of its habitats. They play significant roles in nutriment cycles in the environment. Eukaryotic cells, on the other hand, have both a nucleus and membrane-Bound organelles. Structurally, eukaryotic cells are more complex than prokaryotic cells.</p>
      <p>Eukaryotic cells can be found in unicellular organisms like protozoa and multicellular organisms made up of many cells which include some examples of fungi, some protists, plants, and animals.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 5 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-4.png" alt="figure 4-4">
        <div class="caption">Figure 4-4. Diagram of (a) a prokaryotic cell and (b) a eukaryotic cell</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 6 -->
      <div class="header">
        <div class="title">Unicellular versus Multicellular Organisms</div>
      </div>
      <p>An organism can be classified as unicellular or multicellular, Unicellular organisms are considered "one cell-one-organism, which means that they are made up of only a single cell. They can be a prokaryote, like the bacteria, or eukaryote like some protists.</p>
      <p>Multicellular organisms are made up of more than one cell. The cell's function mutt be interconnected with the other cells. Though each cell of multicellular organisms contains similar organelles, the function and survival of one cell depends on the other cells, Most fung plants, and animals are multicellular. Examples of these are found on figure 4-5,</p>
    </div>
    `,
      `
    <div>
      <!-- Card 7 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-5 a.png" alt="figure 4-5">
      </div>
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-5 b.png" alt="figure 4-5">
        <div class="caption">Figure 4-5. Examples of unicellular and multicellular organisms</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 8 -->
      <div class="header">
        <div class="title">Examples under Types of Cells and Organisms</div>
      </div>
      <p><strong>Bacteria</strong></p>
      <p>They are one of the most abundant organisms on Earth due to their ability to survive in various environments or conditions. You can find them almost everywhere-on coins doorknobs, shoes, bags, pens, skin, and even inside your body. Scientists estimate that bacteria have existed for more or less 3.5 billion years, making them among the oldest organisms on Earth</p>
    </div>
    `,
      `
    <div>
      <!-- Card 9 -->
      <p>Bacteria are so small that around 3000 of them could fit in the period at the end of this sentence. Bacteria can be classified based on their shape (figure 4-6) rod (bacillus), spherical (coccus), spiral (spirillum), comma (vibrio, or coiled (spirochete).</p>
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-6.png" alt="figure 4-6">
        <div class="caption">Figure 4-6. (a) Bacillus, (b) coccus, (c) spirillum, (d) vibrio, and (e) spirochete are the different shapes of bacteria</div>
      </div>
      <p>Bacteria can live as a single cell or in colonies. A colony is a group of identical bacterial cells closely associated with one another, although they are independent of one another. They may join together in clusters or in chains.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 10 -->
      <p>Bacteria are prokaryotic; they have no distinct nucleus and lack membrane-bound organelles. Even so, they are still able to perform the activities of a living organism.</p>
      <p><strong>Protists</strong></p>
      <p>Protists are eukaryotic organisms that can be unicellular or multicellular. They are grouped into animal like, plantlike, and fungus-like protists.</p>
      <p><strong>Plantlike Protists</strong></p>
      <p>Plantlike protists, or algae, are diverse and widely distributed. They range from single celled to colonial and multicellular forms. Algae are not considered plants since they do not have structures that protect their reproductive cells. They are not classified as animals either because they do not move using appendages. Nor are they considered fungi since they do not have chitin in their cell walls.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 11 -->
      <p>Some phytoplankton are classified as protists. Phytoplankton (figure 4-7a) are unicellular photosynthetic organisms that float on the surface of freshwater and saltwater. These organisms are responsible for 50% to 85% of the oxygen in the atmosphere. Other examples of plantlike protists are dinoflagellates, Euglena (figure 4-7b), diatoms, and golden-brown algae. which are ecologically classified as primary producers in aquatic habitats.</p>
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-7.png" alt="figure 4-7">
        <div class="caption">Figure 4-7. (a) Phytoplankton and (b) Euglena are plantlike protists</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 12 -->
      <p>Dinoflagellates are also plantlike protists. They are named such due to the presence of two flagella in each cell. They are similar to Euglena, but are mostly found in marine environments. Under certain conditions, dinoflagellates can grow or bloom rapidly, turning water along coasts reddish brown. This phenomenon is commonly called red tide. A large dinoflagellate population produces large amounts of neurotoxins that harm marine organisms, as well as terrestrial organisms that feed on them.</p>
      <p><strong>Animallike Protists</strong></p>
      <p>Animallike protists or protozoans are heterotrophic, which means they depend on other organisms for food. Protozoans include the sarcodines (Amoeba in figure 4-8a), ciliates (Paramecium in figure 4-8b), and zooflagellates (Trypanosoma in figure 4-8c).</p>
    </div>
    `,
      `
    <div>
      <!-- Card 13 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-8.png" alt="figure 4-8">
        <div class="caption">Figure 4-8. (a) Amoeba, (b) Paramecium, and (c) Trypanosoma are animallike protists.</div>
      </div>
      <p>An Amoeba is one of the simplest known protozoans. It consists of a nucleus and all other cellular parts present in a eukaryotic cell. It "crawls" using its pseudopodia, or false feet, into which its cytoplasm flows. This is referred to as amoeboid movement, powered by a protein called actin. It also eats tiny food particles present in its surroundings using its pseudopodia. The food particles are enclosed by food vacuole, and are intracellularly digested through the help of enzymes from the lysosomes. Excess water is ejected through the contractile vacuole, which pulsates alternately with the radiating canals.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 14 -->
      <p><strong>Fungus-like Protists</strong></p>
      <p>Fungus-like protists, or slime molds, are saprophytic, which means that they derive food and energy by breaking down dead organic matter. They include the plasmodial slime molds and cellular slime molds, which both undergo asexual and sexual reproduction.</p>
      <p>A summary of the characteristics of the three groups of protists is given in table 4-2.</p>
      <p style="font-weight: bold; padding-top: 10px; margin-bottom: 1px;">Table 4-2. Comparison of the Three Groups of Protists</p>
      <div style="overflow-x: auto;">
  <table border="1" style="width: 850px; min-width: 100%; border-collapse: collapse; table-layout: fixed; text-align: left; font-family: Arial, sans-serif; border: 2px solid #333;">
      <thead>
        <tr style="background: linear-gradient(to right, #8e2de2, #ff6a9f); color: white;">
          <th style="padding: 12px; width: 200px;">Characteristic</th>
          <th style="padding: 12px; width: 215px;">Plantlike</th>
          <th style="padding: 12px; width: 215px;">Animallike</th>
          <th style="padding: 12px; width: 220px;">Fungus-like</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #fdf4ff;">
          <td style="padding: 10px; font-weight: bold;">Number of cells</td>
          <td style="padding: 10px;">Unicellular; few are multicellular</td>
          <td style="padding: 10px;">Unicellular</td>
          <td style="padding: 10px;">Unicellular</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; font-weight: bold;">Organ for locomotion</td>
          <td style="padding: 10px;">Flagella; others have none</td>
          <td style="padding: 10px;">Flagella, pseudopodia, cilia; others have none</td>
          <td style="padding: 10px;">Pseudopodia</td>
        </tr>
        <tr style="background-color: #fdf4ff;">
          <td style="padding: 10px; font-weight: bold;">Mode of nutrition</td>
          <td style="padding: 10px;">Autotrophic (can feed on their own)</td>
          <td style="padding: 10px;">Heterotrophic (dependent on others for food)</td>
          <td style="padding: 10px;">Heterotrophic (saprophytic: feeds on dead matter)</td>
        </tr>
      </tbody>
  </table>
</div>
    </div>
    `,
      `
    <div>
      <!-- Card 16 -->
      <p style="font-size: 20px; font-weight: bold;">Fungi</p>
      <p>Kingdom Fungi includes a wide variety of species, such as yeasts, molds, and mushrooms. Generally, there are four major groups of fungi: Zygomycetes or zygote fungi (eg, bread mold), Ascomycetes or sac fungi (e.g., yeasts), Basidiomycetes or club fungi (e.g., oyster mushrooms), and Chytridiomycetes or chytrids (e.g., Allomyces).</p>
      <p>Fungi are found in almost all types of environment. Fungi have eukaryotic cells with cell walls made of chitin, a structural polysaccharide also found in the exoskeletons of arthropods. They lack chlorophyll, and so they must procure their food from other sources, Most fungi are saprophytic. Some fungi may also obtain their nutrients through parasitism, as in the case of Septobasidium sp., a parasite of plants and insects. A few fungi are unicellular, while most are multicellular. Yeasts are examples of unicellular fungi that reproduce through budding Multicellular fungi, such as mushrooms (figure 4-9a), grow larger than yeasts Fungi and reproduce via spores.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 17 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-9.png" alt="figure 4-9">
        <div class="caption">Figure 4-9. (a) Mushrooms and (b) molds belong to Kingdom Fungi</div>
      </div>
      <p>Some species of fungi are made up of threadlike filaments called hyphae (sing, hypha). Hyphae are elongated, tubular, and have branching filaments that form the mycelium. In food that is contaminated with fungi, it is the mycelium you see spreading across. The hyphae of the mycelium secrete enzymes that digest the food. Some fungi live alongside some autotrophic green algae or blue-green bacteria.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 18 -->
      <p>One of the most common types of fungi is the bread mold (figure 4-96). Its mycelium has several types of specialized hyphae. In moldy food, the horizontal hyphae grow across the surface of the food. A branching network of hyphae, called rhizoids, grows into the food. Bread molds can reproduce asexually by growing vertical hyphae. On top of these stalks, black spore cases called sporangium form. Inside each spore case are individual spores with one or more nuclei. They may be dispersed by several agents and can develop into a new mycelium.</p>
      <p>Table 4-3 summarizes the characteristics of bacteria, protists, and fungi.</p>
      <div style="overflow-x: auto;">
  <table border="1" style="width: 900px; min-width: 100%; border-collapse: collapse; table-layout: fixed; text-align: left; font-family: Arial, sans-serif; border: 2px solid #2c3e50;">
      <thead>
        <tr style="background: linear-gradient(to right, #11998e, #38ef7d); color: white;">
          <th style="padding: 12px; width: 220px;">Distinguishing feature</th>
          <th style="padding: 12px; width: 220px;">Bacteria</th>
          <th style="padding: 12px; width: 230px;">Protists</th>
          <th style="padding: 12px; width: 230px;">Fungi</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #e8fdf5;">
          <td style="padding: 10px; font-weight: bold;">Type of cell</td>
          <td style="padding: 10px;">Prokaryotic</td>
          <td style="padding: 10px;">Eukaryotic</td>
          <td style="padding: 10px;">Eukaryotic</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; font-weight: bold;">Number of cells</td>
          <td style="padding: 10px;">Unicellular</td>
          <td style="padding: 10px;">Unicellular;<br>Multicellular; Colonial</td>
          <td style="padding: 10px;">Multicellular; few are unicellular</td>
        </tr>
        <tr style="background-color: #e8fdf5;">
          <td style="padding: 10px; font-weight: bold;">Component of cell wall</td>
          <td style="padding: 10px;">Peptidoglycan</td>
          <td style="padding: 10px;">Present in some members; varied composition</td>
          <td style="padding: 10px;">Chitin</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; font-weight: bold;">Mode of nutrition</td>
          <td style="padding: 10px;">Autotrophic;<br>Heterotrophic</td>
          <td style="padding: 10px;">Autotrophic;<br>Heterotrophic</td>
          <td style="padding: 10px;">Heterotrophic (saprophytic)</td>
        </tr>
        <tr style="background-color: #e8fdf5;">
          <td style="padding: 10px; font-weight: bold;">Means of locomotion</td>
          <td style="padding: 10px;">Flagella</td>
          <td style="padding: 10px;">Flagella, cilia, and pseudopodia; others have none</td>
          <td style="padding: 10px;">Absent</td>
        </tr>
      </tbody>
  </table>
</div>
    </div>
    `,
      `
    <div>
      <!-- Card 19 -->
      <div class="header">
        <div class="title">SCIENCE CAREER</div>
      </div>
      <div class="illustration">
        <img src="assets/img/chapter 4/cytotech.png" alt="cytotechnologist">
        <div class="caption">Cytotechnologist at work</div>
      </div>
      <p>Cytotechnologists play a big role in the field of cytology, the study of cells. They work with cell samples coming from the patients.</p>
      <p>Their responsibilities include preparing microscopic specimens, analyzing them in the laboratory, and recording the findings. Laboratory specimens being studied may include a variety of samples, like blood, cells, tissues, and other body fluids. They are also expected to preserve the samples to make those viable and visible for future reference. Their duties may include labeling of specimens, and keeping an accurate record of the samples examined. Notes regarding the samples may be included, after which, they submit them to a pathologist for confirmation.</p>
      <p>A cytotechnologist works with different laboratory specimens, such as blood, cells, tissues, and other body fluids.</p>
      <p>How do you qualify for the job? If you decide to be a cytotechnologist, education and certification are the primary qualifications that you need. You need at least a bachelor's degree in biology or chemistry, or any related field. Your degree must focus on equipping you with the laboratory skills necessary for the job. Some universities and hospitals may require you to have a license first before yo can work in a laboratory.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 20 -->
      <div class="header">
        <div class="title">Parts and Functions of a Cell</div>
      </div>
      <p>How does knowledge of each level of the biological organization help you understand how your body work</p>
      <p>There may be different types of eukaryotic cells, but they generally have three basic parts: cell membrane, nucleus, and cytoplasm</p>
    </div>
    `,
      `
    <div>
      <!-- Card 21 -->
      <div class="header">
        <div class="title">Cell Membrane: The Gateway to the Cell</div>
      </div>
      <p>The cell membrane, also known as plasma membrane. is the outermost boundary of the cell. It has several functions: separates a cell from other cells, (2) it plays an important role in how cells communicate with one another, and (3) it regulates the movement of materials into and out of the cell. The ability of the cell membrane to allow certain substances to move into and out of the cell is called semipermeability. The structure of the cell membrane and its parts are presented in figure 4-10</p>
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-10.png" alt="figure 4-10">
        <div class="caption">Figure 4-10. Structure of the cell membrane</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 22 -->
      <div class="header">
        <div class="title">Nucleus: The Information Center</div>
      </div>
      <p>The nucleus is a membrane-bound structure usually located at the center of the cell. It contains the genetic material (DNA) of an organism. It is the control center of the cell, which means that all the activities of the cell is controlled by the nucleus. The components of the nucleus are the nuclear membrane, chromatin, and nucleolus (figure 4-11).</p>
      <p>Nuclear membrane: the gateway to the nucleus - The nuclear membrane separates the nucleus from the cytoplasm and is continuous with the endoplasmic reticulum (ER) at several points. There are around 2000 nuclear pores embedded in the nuclear membrane. Nuclear pores are small openings that permit molecules to move into and out of the nucleus.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 23 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-11.png" alt="figure 4-11">
        <div class="caption">Figure 4-11. The parts of the nucleus</div>
      </div>
      <p><strong>Chromosomes carriers of the genes</strong>- Chromosomes are made up of DNA and proteins called histones. The DNA serves as the genetic blueprint of an organism.</p>
      <p><strong>Nucleolus center for ribosomal assembly</strong> - The nucleolus is found in the nucleoplasm, the semi fluid matrix enveloped by the nuclear membrane. They are the pre-assembly points for ribosomes and usually contain proteins and ribonucleic acid (RNA)</p>
    </div>
    `,
      `
    <div>
      <!-- Card 24 -->
      
    </div>
    `,
      `
    <div>
      <!-- Card 25 -->
      <div class="header">
        <div class="title">SCIENCE HISTORY</div>
      </div>
      <p style="font-weight: bold; font-size: 20px; text-align: center; padding-top: 10px; margin-bottom: 0;">The Discovery of the Nucleus</p>
      <p>The nucleus was the first organelle to be discovered. However, the exact date of its discovery and the identity of the person who discovered it are still unverified, in 1802. Austrian botanical artist Franz Bauer sketched orchid cells and labeled their nucleus. In 1825, Czech physiologist Jan Evangelista Purkinje discovered the nucleus of a chicken oocyte and called it "vesicula germanitiva." Then in the 1830, Scottish botanist Robert Brown observed the nucleus of various plant cells and coined the term "nucleus," but in his time the function of the nucleus was not yet known. Instead, scientists focused on studying its location in the cell and its appearance. Later, the nucleus was deliberately observed and became a key principle in the creation of the cell theory. Scientists thought the nucleus was the only cell organelle until they discovered other organelles such as the Golgi bodies, mitochondria, and endoplasmic reticulum. This provided more insight into the nature and structure of cells. Due to advancements in biotechnology, the study of the cell nucleus has been brought to the nanoscale range, opening new frontiers in cell research and biotechnology.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 26 -->
      <div class="header">
        <div class="title">Cytoplasm: Other Cell Organelles and Cytoplasmic Inclusions</div>
      </div>
      <p>The cytoplasm is the largest part of the cell in terms of volume. It is composed of membrane-bound structures called organelles, other cytoplasmic inclusions, and the semifluid portion called cytosol, where dissolved substances are suspended. The cytoplasm supports and suspends organelles and cellular molecules. Many cellular processes, including protein synthesis, also occur in the cytoplasm.</p>
      <div class="header">
        <div class="title">The Organelles</div>
      </div>
      <p><strong>Endoplasmic reticulum (ER): channel for transport</strong> - The ER is an interconnecting membranous network of vesicles, tubules, and flattened sacs. It serves as the quality control unit of the cell. There are two types of ER: rough and smooth. The rough ER is characterized by the presence of ribosomes (figure 4-12), where protein synthesis occurs. The smooth ER, on the other hand, does not have ribosomes. It is the site of lipid and steroid synthesis. Proteins made in the ER are either transported out from the cell in the form of secretory products or used by the other parts of the cell.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 27 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-12.png" alt="figure 4-12">
        <div class="caption">Figure 4-12. Ribosomes are attached to the rough endoplasmic reticulum.</div>
      </div>
      <p>The number of ribosomes depends on the activities of the cell. There are more ribosomes in cells that have a secretory function. For instance, the secretory cells found in the pancreas have numerous ribosomes because it secretes proteins in the form of enzymes and hormones.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 28 -->
      <p><strong>Golgi body: packaging of secretory materials</strong> - Golgi bodies are stacks of flattened, disk-like membranes (figure 4-13) that are associated with the ER in the cytoplasm. Proteins from the ribosomes are chemically modified, packed, and sealed off in small packets called vesicles. These vesicles move from the ER to the Golgi bodies and are grouped into batches, either for export or for use by the cell. Just like the ribosomes. their abundance is relative to the cell's activity. Some cells can have only one large stack, whereas others can have hundreds or even thousands of Golgi bodies.</p>
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-13.png" alt="figure 4-13">
        <div class="caption">Figure 4-13. Disklike membranes form the Golgi body.</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 29 -->
      <p><strong>Lysosome: breakdown and degradation of substances</strong> - Lysosomes contain digestive enzymes that break down complex chemical compounds into simpler ones. They can also destroy other worn-out organelles within the cell by enclosing and digesting them to recycle their materials for other uses.</p>
      <p><strong>Peroxisome: detoxification of harmful compounds</strong> - Peroxisomes help the cell use oxygen. They produce the toxic hydrogen peroxide (H₂O) in the process, but contain enzymes that convert it into water and oxygen. When free radicals such as H₂O, build up in cells. peroxisomes release catalase, an enzyme that breaks down H₂O,. This reaction leaves behind harmless water and oxygen molecules. The liver and kidney cells are rich in peroxisomes that help remove toxins from the blood.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 30 -->
      <p><strong>Mitochondria: the energy generators</strong> - Mitochondria (sing. mitochondrion) are spherical or elongated structures (figure 4-14) found in the cytoplasm. Mitochondria harness energy from the food you eat and convert it into a usable form of energy called adenosine triphosphate (ATP). This energy is an important product of cellular respiration.</p>
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-14.gif" alt="figure 4-14">
        <div class="caption">Figure 4-14. The powerhouse of the cell-the mitochondrion.</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 31 -->
      <p>The number of mitochondria also varies depending on the function and type of cell. Some cells have only a few mitochondria, while others have as many as 2000. The liver cells and muscle cells, for example, have about 2000 mitochondria since they have active processes and require more energy.</p>
      <p><strong>Vacuole: for storage and support</strong> - Vacuoles are membranous sacs that are present in plant cells, some animal cells, and some protists. Although vacuoles appear to be empty sacs, they are actually filled with fluids and soluble molecules that play a variety of roles.</p>
      <p>The vacuoles found in plant cells are more prominent than those in animal cells. Their primary function is to store water, sugar, proteins, or pigments. The fluid inside the vacuole of a plant cell also contributes in maintaining turgor pressure which keeps the cell rigid.</p>
      <p>Vacuoles in animal cells are relatively small. They also help with the active transport of substances into and out of the cell.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 32 -->
      <p>Single-celled protists, such as Amoeba and Paramecium, have contractile vacuoles that regulate fluids within the cell. In the absence of contractile vacuoles, the cells will burst and eventually die.</p>
      <div class="header">
        <div class="title">Cell Organelles Found Only in Certain Organisms</div>
      </div>
      <p><strong>Plastid</strong> - Plastids are double membrane-bound special structures that are present only in plants and in some protists Most plastids contain pigments. Chloroplast (figure 4-15), for instance is a type of plastid found in plants and green algae that contain the green pigment chlorophyll. Chlorophyll enables plant cells to be photosynthetic, carbohydrate-producing factories. This pigment captures light energy to be used in the production of sugar</p>
    </div>
    `,
      `
    <div>
      <!-- Card 33 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-15.png" alt="figure 4-15">
        <div class="caption">Figure 4-15. Cross section of a chloroplast showing its parts. A chloroplast may be round, oval or in disk shape.</div>
      </div>
      <p>Other plastids that contain other pigments are called chromoplasts. Colorless plastids are called leucoplasts, which also function as storage for proteins, oils, or starch.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 34 -->
      <p><strong>Centriole</strong>: for the formation of spindle fibers - Centrioles are rod-like structures composed of microtubules. They are found in pairs at right angles to each other, close to the nucleus of an animal cell. They are responsible for spindle formation during cell division. In this process, the spindle fibers pull chromosomes to the opposite poles of the cell.</p>
      <p><strong>Cell wall: for protection and covering</strong> - While the covering of an animal cell consists only of a cell membrane, a plant cell has both a cell membrane and a cell wall, which serve as its outermost part. The cell wall supports and defines the shape of plant cells. It also protects the cell from mechanical injury and invasion of microorganisms. There are holes all over the ell wall called plasmodesmata (sing. plasmodesma), which allow the transport of materials between cells.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 35 -->
      <p>Cell walls have two types-the cellulose-rich primary cell wall, which is formed just after ell division, and the thicker, more rigid secondary cell wall.</p>
      <p><strong>Cell junction: for cell connections</strong> - In plants, cells are linked from cell wall to cell wall by me middle lamella. In animals, cells are linked from cell membrane to cell membrane by cell junctions. There are three types of cell junction in animal cells.</p>
      <p>• Tight junctions occur between the cells of special types of tissue to prevent the entry of infective microorganisms and the leaking of acids in the tissues of the intestine.</p>
      <p>• Desmosomes hold two adjacent cells together at one point. Desmosomes hold together cells that are subjected to stretching, such as cells in the skin and heart tissues.</p>
      <p>• Gap junctions are small open channels that link the cytoplasm of adjacent cells. They provide rapid communication between cells.</p>
      <p>A small intestine cell junction consists of the three types of cell junction found in animal</p>
    </div>
    `,
      `
    <div>
      <!-- Card 36 -->
      <div class="header">
        <div class="title">Other Cytoplasmic Inclusions</div>
      </div>
      <p><strong>Ribosome</strong>: protein factory Ribosomes may be free of attached, and single of in clusters These small round bodies are present in all cells. They are regarded as the sites of protein synthesis. They receive genetic information in the form of messenger RNA from the nucleus. They then translate the genetic information into amino acids that make up a protein molecule</p>
      <p><strong>Cytoskeleton</strong>: cellular strength and motility The framework of most cells consists of a network of intermediate filaments (figure 4-164), microtubules (figure 4-166), and microfilaments (figure 4-16c). Microtubules are hollow, cylindrical structures found in the cytoplasm. These structures facilitate the movement of chromosomes during cell division and help in the movement of secretory vesicles. Microfilaments are solid rod-like structures containing actin. They provide structural support and assistance in cell motility, such as in the case of Amoeba, and for allowing cell contraction in the muscle cell. Intermediate filaments are larger than microfilaments, but smaller than microtubules. These structures are not directly involved in cellular movement, they instead provide mechanical support to the cell.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 37 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-16.png" alt="figure 4-16">
        <div class="caption">Figure 4-16. The cytoskeleton of the cell</div>
      </div>
      <div class="info-card">
  <div class="info-title">MINI LAB 4-1</div>
  <div class="info-content">
    <div class="info-text">
      <p><strong>Materials:</strong> a pack of gelatin (preferably white), a transparent small plastic bag, a transparent plastic container (tumbler), a piece of red grape, and raisins</p>
      
      <p><strong>Procedures:</strong></p>
      <p>1. Cook the gelatin as instructed.</p>
      <p>2. Place the small plastic bag into the plastic container so that the open end of the plastic bag extends over the edge of the plastic container.</p>
      <p>3. Pour the gelatin into the plastic bag enough to fill it. Let it cool.</p>
      <p>4. Before the gelatin hardens, insert the grape in the middle, and scatter some raisin on top of the gelatin randomly.</p>

      <p><strong>Questions:</strong></p>
      <p>1. What part is represented by the: plastic container, plastic bag, gelatin, grape, and raisins?</p>
      <p>2. Which cell part occupies most of the space of the cell?</p>

      <div class="start-btn-container">
        <q-btn data-route="/mini-lab-4-1" unelevated class="start-btn">
          Answer
        </q-btn>
      </div>
    </div>
  </div>
</div>

    </div>
    `,
      `
    <div>
      <!-- Card 38 -->
      <div class="header">
        <div class="title">Difference between Plant and Animal Cells</div>
      </div>
      <p>Plant and animal cells have similarities and differences.</p>
      <p>Some organelles are found only in animal cells or only in plant</p>
      <p>cells. Figure 4-17 and table 4-4 show the parts and comparison</p>
      <p>of plant and animal cells based on the presence of cellular parts/</p>
      <p>organelles or macromolecules.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 39 -->
      <div class="illustration">
        <img src="assets/img/chapter 4/figure 4-17.png" alt="figure 4-17">
        <div class="caption">Figure 4-17. (a) A plant cell and (b) an animal cell and their parts</div>
      </div>
        <p style="text-align: center; padding-top: 10px; margin-bottom: 0;">Table 4-4. Difference between a Plant and an Animal Cell</p>
        <div style="overflow-x: auto;">
  <table border="1" style="width: 350px; min-width: 100%; border-collapse: collapse; table-layout: fixed; text-align: center; font-family: Arial, sans-serif; border: 2px solid #1f3c88;">
      <thead>
        <tr style="background: linear-gradient(to right, #1f3c88, #00c6ff); color: white;">
          <th style="padding: 12px; width: 200px; text-align: left;">Parts/Organelles/Macromolecules</th>
          <th style="padding: 12px; width: 50px;">Plant Cell</th>
          <th style="padding: 12px; width: 50px;">Animal Cell</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #eef5ff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Cell Wall</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">❌</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Cell Membrane</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #eef5ff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Nucleus</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Cytoplasm</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #eef5ff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Endoplasmic Reticulum</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Golgi body</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #eef5ff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Lysosome</td>
          <td style="padding: 10px;">❌</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Peroxisome</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #eef5ff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Mitochondria</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Vacuoles</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #eef5ff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Plastid (Chloroplast)</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">❌</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Centriole</td>
          <td style="padding: 10px;">❌</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #eef5ff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Cell junctions</td>
          <td style="padding: 10px;">❌</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Ribosomes</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
        <tr style="background-color: #eef5ff;">
          <td style="padding: 10px; text-align: left; font-weight: bold;">Cytoskeleton</td>
          <td style="padding: 10px;">✅</td>
          <td style="padding: 10px;">✅</td>
        </tr>
      </tbody>
  </table>
</div>
    </div>
    `,
      `
    <div>
      <!-- Card 40 -->
      <div class="info-card">
  <div class="info-title">MINI TEST 4-2</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> The cell is composed of parts that work together to perform specific functions for the body. How does the concept of division of labor and spirit of cooperation work inside the cell? Explain your answer.</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-4-2" unelevated class="start-btn">
          Answer
        </q-btn>
      </div>
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
      if (!route.query._reloaded) {
        router.replace({ path: route.path, query: { ...route.query, _reloaded: '1' } }).then(() => {
          window.location.reload()
        })
        return
      }

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

    onUnmounted(() => { audioManager.restoreBg() })

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
