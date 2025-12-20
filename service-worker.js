const CACHE_NAME = "cold-memories-v6";

// Lista de arquivos para cache (adicione mais conforme necessário)
const urlsToCache = [
  "/",
  "/index.html",
  "/city.html",
  "/city.css",
  "/city.js",
  "/cutscene.html",
  "/end.html",
  "/end.css",
  "/end.js",
  "/loader.js",
  "/dev.js",
  "/fullscreen.js",
  "/manifest.json",
  // =====================================================
  // BIBLIOTECAS EXTERNAS CRÍTICAS
  // =====================================================
  "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
  "https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/tsparticles-preset-fire@2/tsparticles.preset.fire.bundle.min.js",
  "/core/global.css",
  "/core/global.js",
  "/core/caixa_dialogo/falas.js",
  "/core/caixa_dialogo/script.js",
  "/core/menu_interativo/script.js",
  "/core/menu_interativo/style.css",
  "/core/popup/script.js",
  "/core/popup/style.css",
  "/core/save/script.js",
  "/core/save/style.css",
  "/core/sound/script.js",
  "/core/sound/style.css",
  "/core/yesorno/script.js",
  "/core/yesorno/style.css",
  // Cenários
  "/cenarios/bar/index.html",
  "/cenarios/bar/script.js",
  "/cenarios/bar/style.css",
  "/cenarios/blizzard/index.html",
  "/cenarios/blizzard/script.js",
  "/cenarios/blizzard/style.css",
  "/cenarios/cave/index.html",
  "/cenarios/cave/script.js",
  "/cenarios/cave/style.css",
  "/cenarios/final/index.html",
  "/cenarios/fire/index.html",
  "/cenarios/fire/script.js",
  "/cenarios/fire/style.css",
  "/cenarios/forest/index.html",
  "/cenarios/forest/script.js",
  "/cenarios/forest/style.css",
  "/cenarios/lake/index.html",
  "/cenarios/lake/script.js",
  "/cenarios/lake/style.css",
  "/cenarios/market/index.html",
  "/cenarios/market/script.js",
  "/cenarios/market/style.css",
  "/cenarios/snow/index.html",
  "/cenarios/snow/style.css",
  "/cenarios/templo/index.html",
  "/cenarios/templo/script.js",
  "/cenarios/templo/style.css",
  // Scripts
  "/scripts/dropmoon/script.js",
  "/scripts/dropmoon/style.css",
  "/scripts/jardim/script.js",
  "/scripts/jardim/style.css",
  "/scripts/mesas/script.js",
  "/scripts/mesas/style.css",
  "/scripts/pescaria/script.js",
  "/scripts/pescaria/style.css",
  "/scripts/wendigo_fight/script.js",
  "/scripts/wendigo_fight/style.css",

  // =====================================================
  // FONTES
  // =====================================================
  "/assets/fonts/Wild-Words-Bold-Italic.ttf",
  "/assets/fonts/Wild-Words-Italic.ttf",
  "/assets/fonts/Wild-Words-Roman.ttf",

  // =====================================================
  // ÍCONES DO PWA
  // =====================================================
  "/assets/img/icons/icon-48x48.png",
  "/assets/img/icons/icon-72x72.png",
  "/assets/img/icons/icon-96x96.png",
  "/assets/img/icons/icon-128x128.png",
  "/assets/img/icons/icon-144x144.png",
  "/assets/img/icons/icon-152x152.png",
  "/assets/img/icons/icon-192x192.png",
  "/assets/img/icons/icon-256x256.png",
  "/assets/img/icons/icon-384x384.png",
  "/assets/img/icons/icon-512x512.png",

  // =====================================================
  // IMAGENS PRINCIPAIS (assets/img/)
  // =====================================================
  "/assets/img/2-04.png",
  "/assets/img/7-02.png",
  "/assets/img/7-03.png",
  "/assets/img/7-05.png",
  "/assets/img/7-06-half.png",
  "/assets/img/7-06.png",
  "/assets/img/7-08.png",
  "/assets/img/bf.png",
  "/assets/img/BG_Banner.png",
  "/assets/img/BG_Bar.png",
  "/assets/img/BG_Base.png",
  "/assets/img/BG_Cave.png",
  "/assets/img/BG_Final-boss.png",
  "/assets/img/BG_Market.png",
  "/assets/img/BG_Temple.png",
  "/assets/img/boss.png",
  "/assets/img/box.png",
  "/assets/img/Bubble.png",
  "/assets/img/Button-ko-fi.png",
  "/assets/img/Button-Patreon.png",
  "/assets/img/cap.png",
  "/assets/img/choco.png",
  "/assets/img/cocoa.png",
  "/assets/img/coffee.png",
  "/assets/img/Corner-table.png",
  "/assets/img/Counter.png",
  "/assets/img/Crab-1.png",
  "/assets/img/Crab-heart.png",
  "/assets/img/Crab-hourglass.png",
  "/assets/img/Crab-jellyfish.png",
  "/assets/img/Dark-matter.png",
  "/assets/img/Droplet-Moon.png",
  "/assets/img/Droplet-Sun.png",
  "/assets/img/Fish-Carp.png",
  "/assets/img/Fish-catfish.png",
  "/assets/img/Fish-Legendary.png",
  "/assets/img/Fish-pond-smelt.png",
  "/assets/img/Fish-Rainbow-trout.png",
  "/assets/img/fish.png",
  "/assets/img/Fishing-pole.png",
  "/assets/img/Food-cake.png",
  "/assets/img/Food-cake1.png",
  "/assets/img/Food-cake2.png",
  "/assets/img/Food-coffee.png",
  "/assets/img/Food-coke.png",
  "/assets/img/Food-friedchicken.png",
  "/assets/img/Food-fries.png",
  "/assets/img/Food-hamburger.png",
  "/assets/img/Food-hotcocoa.png",
  "/assets/img/Food-hotdog.png",
  "/assets/img/Food-milkshake.png",
  "/assets/img/Food-pizza.png",
  "/assets/img/Food-salad.png",
  "/assets/img/Food-tea.png",
  "/assets/img/Food-whisky.png",
  "/assets/img/forest.png",
  "/assets/img/gf.png",
  "/assets/img/ghost.png",
  "/assets/img/glasses.png",
  "/assets/img/greenie.png",
  "/assets/img/Hole.png",
  "/assets/img/Hole2.png",
  "/assets/img/Honey.png",
  "/assets/img/Ice.png",
  "/assets/img/Incubator-stage-only-drop.png",
  "/assets/img/Incubator-stage-only-honey.png",
  "/assets/img/Incubator-stage0.png",
  "/assets/img/lac.png",
  "/assets/img/Lily-garden-item1.png",
  "/assets/img/Lily-garden-item10.png",
  "/assets/img/Lily-garden-item11.png",
  "/assets/img/Lily-garden-item12.png",
  "/assets/img/Lily-garden-item2.png",
  "/assets/img/Lily-garden-item3.png",
  "/assets/img/Lily-garden-item4.png",
  "/assets/img/Lily-garden-item5.png",
  "/assets/img/Lily-garden-item6.png",
  "/assets/img/Lily-garden-item7.png",
  "/assets/img/Lily-garden-item8.png",
  "/assets/img/Lily-garden-item9.png",
  "/assets/img/Lily-garden.png",
  "/assets/img/Locker-Chest.png",
  "/assets/img/Locker-password-black.png",
  "/assets/img/Locker-password.png",
  "/assets/img/Locker-symbol-1.png",
  "/assets/img/Locker-symbol-2.png",
  "/assets/img/Locker-symbol-3.png",
  "/assets/img/Locker-symbol-4.png",
  "/assets/img/Locker-symbol-5.png",
  "/assets/img/Locker-symbol-6.png",
  "/assets/img/Locker-symbol-7.png",
  "/assets/img/Locker.png",
  "/assets/img/nodata-sobbing.png",
  "/assets/img/NPC_Assistent.png",
  "/assets/img/NPC_Ballerina.png",
  "/assets/img/NPC_Barman.png",
  "/assets/img/NPC_Cat.png",
  "/assets/img/NPC_Day25.png",
  "/assets/img/NPC_Felicia.png",
  "/assets/img/NPC_Forest.png",
  "/assets/img/NPC_Leader.png",
  "/assets/img/NPC_Lily.png",
  "/assets/img/NPC_Maid.png",
  "/assets/img/NPC_Marin.png",
  "/assets/img/NPC_Minion.png",
  "/assets/img/NPC_Mint.png",
  "/assets/img/NPC_Myopic1.png",
  "/assets/img/NPC_Myopic2-half.png",
  "/assets/img/NPC_Myopic2.png",
  "/assets/img/NPC_nan.png",
  "/assets/img/NPC_nodata.png",
  "/assets/img/NPC_portrait-Assistent.png",
  "/assets/img/NPC_portrait-Ballerina.png",
  "/assets/img/NPC_portrait-Barman.png",
  "/assets/img/NPC_portrait-Day-25.png",
  "/assets/img/NPC_portrait-Felicia1.png",
  "/assets/img/NPC_portrait-Felicia2.png",
  "/assets/img/NPC_portrait-Leader1.png",
  "/assets/img/NPC_portrait-Leader2.png",
  "/assets/img/NPC_portrait-Lily.png",
  "/assets/img/NPC_portrait-Marin1.png",
  "/assets/img/NPC_portrait-Marin2.png",
  "/assets/img/NPC_portrait-Mint.png",
  "/assets/img/NPC_portrait-Myopic1.png",
  "/assets/img/NPC_portrait-Myopic2.png",
  "/assets/img/NPC_portrait-Nan1.png",
  "/assets/img/NPC_portrait-Nan2.png",
  "/assets/img/NPC_portrait-Nodata1.png",
  "/assets/img/NPC_portrait-Nodata2.png",
  "/assets/img/NPC_portrait-Pine-forest.png",
  "/assets/img/NPC_portrait-Warrior.png",
  "/assets/img/NPC_portrait-Wayway1.png",
  "/assets/img/NPC_portrait-Wayway2.png",
  "/assets/img/NPC_Snake-Aldebaran.png",
  "/assets/img/NPC_Snake-Aldebaran2.png",
  "/assets/img/NPC_Snake-Capella.png",
  "/assets/img/NPC_Snake-Kofongo.png",
  "/assets/img/NPC_Snake-Pollux.png",
  "/assets/img/NPC_Snake-Rigel.png",
  "/assets/img/NPC_Snake-Sirius.png",
  "/assets/img/NPC_Warrior-attack.png",
  "/assets/img/NPC_Warrior-guard.png",
  "/assets/img/NPC_wayway.png",
  "/assets/img/Pole-turned-off.png",
  "/assets/img/Pole-turned-on.png",
  "/assets/img/poleachie.png",
  "/assets/img/Queens-power.png",
  "/assets/img/skys_pray.png",
  "/assets/img/snake.png",
  "/assets/img/Star-hairpin.png",
  "/assets/img/statue1.png",
  "/assets/img/statue2.png",
  "/assets/img/statue3.png",
  "/assets/img/statue4.png",
  "/assets/img/statue5.png",
  "/assets/img/stb.png",
  "/assets/img/Stone.png",
  "/assets/img/table1.png",
  "/assets/img/table2.png",
  "/assets/img/table3.png",
  "/assets/img/table4.png",
  "/assets/img/Villain-fairycuffs-left.png",
  "/assets/img/Villain-fairycuffs-right.png",
  "/assets/img/Villain-hand-left.png",
  "/assets/img/Villain-hand-right.png",
  "/assets/img/Villain.png",
  "/assets/img/Villain2.png",

  // =====================================================
  // MYO (Make Your Own) - TODOS OS ASSETS
  // =====================================================
  "/assets/img/MYO/Accessory-1.png",
  "/assets/img/MYO/Accessory-2.png",
  "/assets/img/MYO/Accessory-3.png",
  "/assets/img/MYO/Accessory-4.png",
  "/assets/img/MYO/Accessory-5.png",
  "/assets/img/MYO/Accessory-6.png",
  "/assets/img/MYO/Accessory-7.png",
  "/assets/img/MYO/Accessory-8.png",
  "/assets/img/MYO/Accessory-9.png",
  "/assets/img/MYO/BASE-1.png",
  "/assets/img/MYO/BASE-2.png",
  "/assets/img/MYO/BASE-3.png",
  "/assets/img/MYO/BASE-4.png",
  "/assets/img/MYO/Claws-1.png",
  "/assets/img/MYO/Claws-2.png",
  "/assets/img/MYO/Claws-3.png",
  "/assets/img/MYO/Cloth-1.png",
  "/assets/img/MYO/Cloth-2.png",
  "/assets/img/MYO/Cloth-3.png",
  "/assets/img/MYO/Cloth-4.png",
  "/assets/img/MYO/Cloth-5.png",
  "/assets/img/MYO/Cloth-6.png",
  "/assets/img/MYO/Cloth-7.png",
  "/assets/img/MYO/Cloth-8.png",
  "/assets/img/MYO/Cloth-9.png",
  "/assets/img/MYO/Cloth-10.png",
  "/assets/img/MYO/Cloth-11.png",
  "/assets/img/MYO/Cloth-12.png",
  "/assets/img/MYO/Cloth-13.png",
  "/assets/img/MYO/Cloth-14.png",
  "/assets/img/MYO/Cloth-15.png",
  "/assets/img/MYO/Cloth-16.png",
  "/assets/img/MYO/Eyebrows-1.png",
  "/assets/img/MYO/Eyebrows-2.png",
  "/assets/img/MYO/Eyebrows-3.png",
  "/assets/img/MYO/Eyebrows-4.png",
  "/assets/img/MYO/Eyes-1.png",
  "/assets/img/MYO/Eyes-2.png",
  "/assets/img/MYO/Eyes-3.png",
  "/assets/img/MYO/Eyes-4.png",
  "/assets/img/MYO/Eyes-5.png",
  "/assets/img/MYO/Eyes-6.png",
  "/assets/img/MYO/Eyes-7.png",
  "/assets/img/MYO/Eyes-8.png",
  "/assets/img/MYO/Hair1-Black.png",
  "/assets/img/MYO/Hair1-Blue.png",
  "/assets/img/MYO/Hair1-Brown.png",
  "/assets/img/MYO/Hair1-Green.png",
  "/assets/img/MYO/Hair1-Pink.png",
  "/assets/img/MYO/Hair1-Purple.png",
  "/assets/img/MYO/Hair1-Red.png",
  "/assets/img/MYO/Hair1-White.png",
  "/assets/img/MYO/Hair1-Yellow.png",
  "/assets/img/MYO/Hair2-Black.png",
  "/assets/img/MYO/Hair2-Blue.png",
  "/assets/img/MYO/Hair2-Brown.png",
  "/assets/img/MYO/Hair2-Green.png",
  "/assets/img/MYO/Hair2-Pink.png",
  "/assets/img/MYO/Hair2-Purple.png",
  "/assets/img/MYO/Hair2-Red.png",
  "/assets/img/MYO/Hair2-White.png",
  "/assets/img/MYO/Hair2-Yellow.png",
  "/assets/img/MYO/Hair3-Black.png",
  "/assets/img/MYO/Hair3-Blue.png",
  "/assets/img/MYO/Hair3-Brown.png",
  "/assets/img/MYO/Hair3-Green.png",
  "/assets/img/MYO/Hair3-Pink.png",
  "/assets/img/MYO/Hair3-Purple.png",
  "/assets/img/MYO/Hair3-Red.png",
  "/assets/img/MYO/Hair3-White.png",
  "/assets/img/MYO/Hair3-Yellow.png",
  "/assets/img/MYO/Hair4-Black.png",
  "/assets/img/MYO/Hair4-Blue.png",
  "/assets/img/MYO/Hair4-Brown.png",
  "/assets/img/MYO/Hair4-Green.png",
  "/assets/img/MYO/Hair4-Pink.png",
  "/assets/img/MYO/Hair4-Purple.png",
  "/assets/img/MYO/Hair4-Red.png",
  "/assets/img/MYO/Hair4-White.png",
  "/assets/img/MYO/Hair4-Yellow.png",
  "/assets/img/MYO/Hair5-Black.png",
  "/assets/img/MYO/Hair5-Blue.png",
  "/assets/img/MYO/Hair5-Brown.png",
  "/assets/img/MYO/Hair5-Green.png",
  "/assets/img/MYO/Hair5-Pink.png",
  "/assets/img/MYO/Hair5-Purple.png",
  "/assets/img/MYO/Hair5-Red.png",
  "/assets/img/MYO/Hair5-White.png",
  "/assets/img/MYO/Hair5-Yellow.png",
  "/assets/img/MYO/Hair6-Black.png",
  "/assets/img/MYO/Hair6-Blue.png",
  "/assets/img/MYO/Hair6-Brown.png",
  "/assets/img/MYO/Hair6-Green.png",
  "/assets/img/MYO/Hair6-Pink.png",
  "/assets/img/MYO/Hair6-Purple.png",
  "/assets/img/MYO/Hair6-Red.png",
  "/assets/img/MYO/Hair6-White.png",
  "/assets/img/MYO/Hair6-Yellow.png",
  "/assets/img/MYO/Hair7-Black.png",
  "/assets/img/MYO/Hair7-Blue.png",
  "/assets/img/MYO/Hair7-Brown.png",
  "/assets/img/MYO/Hair7-Green.png",
  "/assets/img/MYO/Hair7-Pink.png",
  "/assets/img/MYO/Hair7-Purple.png",
  "/assets/img/MYO/Hair7-Red.png",
  "/assets/img/MYO/Hair7-White.png",
  "/assets/img/MYO/Hair7-Yellow.png",
  "/assets/img/MYO/Hair8-Black.png",
  "/assets/img/MYO/Hair8-Blue.png",
  "/assets/img/MYO/Hair8-Brown.png",
  "/assets/img/MYO/Hair8-Green.png",
  "/assets/img/MYO/Hair8-Pink.png",
  "/assets/img/MYO/Hair8-Purple.png",
  "/assets/img/MYO/Hair8-Red.png",
  "/assets/img/MYO/Hair8-White.png",
  "/assets/img/MYO/Hair8-Yellow.png",
  "/assets/img/MYO/Hair9-Black.png",
  "/assets/img/MYO/Hair9-Blue.png",
  "/assets/img/MYO/Hair9-Brown.png",
  "/assets/img/MYO/Hair9-Green.png",
  "/assets/img/MYO/Hair9-Pink.png",
  "/assets/img/MYO/Hair9-Purple.png",
  "/assets/img/MYO/Hair9-Red.png",
  "/assets/img/MYO/Hair9-White.png",
  "/assets/img/MYO/Hair9-Yellow.png",
  "/assets/img/MYO/Hair10-Black.png",
  "/assets/img/MYO/Hair10-Blue.png",
  "/assets/img/MYO/Hair10-Brown.png",
  "/assets/img/MYO/Hair10-Green.png",
  "/assets/img/MYO/Hair10-Pink.png",
  "/assets/img/MYO/Hair10-Purple.png",
  "/assets/img/MYO/Hair10-Red.png",
  "/assets/img/MYO/Hair10-White.png",
  "/assets/img/MYO/Hair10-Yellow.png",
  "/assets/img/MYO/Hair11-Black.png",
  "/assets/img/MYO/Hair11-Blue.png",
  "/assets/img/MYO/Hair11-Brown.png",
  "/assets/img/MYO/Hair11-Green.png",
  "/assets/img/MYO/Hair11-Pink.png",
  "/assets/img/MYO/Hair11-Purple.png",
  "/assets/img/MYO/Hair11-Red.png",
  "/assets/img/MYO/Hair11-White.png",
  "/assets/img/MYO/Hair11-Yellow.png",
  "/assets/img/MYO/Hair12-Black.png",
  "/assets/img/MYO/Hair12-Blue.png",
  "/assets/img/MYO/Hair12-Brown.png",
  "/assets/img/MYO/Hair12-Green.png",
  "/assets/img/MYO/Hair12-Pink.png",
  "/assets/img/MYO/Hair12-Purple.png",
  "/assets/img/MYO/Hair12-Red.png",
  "/assets/img/MYO/Hair12-White.png",
  "/assets/img/MYO/Hair12-Yellow.png",
  "/assets/img/MYO/Hair13-Black.png",
  "/assets/img/MYO/Hair13-Blue.png",
  "/assets/img/MYO/Hair13-Brown.png",
  "/assets/img/MYO/Hair13-Green.png",
  "/assets/img/MYO/Hair13-Pink.png",
  "/assets/img/MYO/Hair13-Purple.png",
  "/assets/img/MYO/Hair13-Red.png",
  "/assets/img/MYO/Hair13-White.png",
  "/assets/img/MYO/Hair13-Yellow.png",
  "/assets/img/MYO/Hair14-Black.png",
  "/assets/img/MYO/Hair14-Blue.png",
  "/assets/img/MYO/Hair14-Brown.png",
  "/assets/img/MYO/Hair14-Green.png",
  "/assets/img/MYO/Hair14-Pink.png",
  "/assets/img/MYO/Hair14-Purple.png",
  "/assets/img/MYO/Hair14-Red.png",
  "/assets/img/MYO/Hair14-White.png",
  "/assets/img/MYO/Hair14-Yellow.png",
  "/assets/img/MYO/Hair15-Black.png",
  "/assets/img/MYO/Hair15-Blue.png",
  "/assets/img/MYO/Hair15-Brown.png",
  "/assets/img/MYO/Hair15-Green.png",
  "/assets/img/MYO/Hair15-Pink.png",
  "/assets/img/MYO/Hair15-Purple.png",
  "/assets/img/MYO/Hair15-Red.png",
  "/assets/img/MYO/Hair15-White.png",
  "/assets/img/MYO/Hair15-Yellow.png",
  "/assets/img/MYO/Hair16-Black.png",
  "/assets/img/MYO/Hair16-Blue.png",
  "/assets/img/MYO/Hair16-Brown.png",
  "/assets/img/MYO/Hair16-Green.png",
  "/assets/img/MYO/Hair16-Pink.png",
  "/assets/img/MYO/Hair16-Purple.png",
  "/assets/img/MYO/Hair16-Red.png",
  "/assets/img/MYO/Hair16-White.png",
  "/assets/img/MYO/Hair16-Yellow.png",
  "/assets/img/MYO/Hair17-Black.png",
  "/assets/img/MYO/Hair17-Blue.png",
  "/assets/img/MYO/Hair17-Brown.png",
  "/assets/img/MYO/Hair17-Green.png",
  "/assets/img/MYO/Hair17-Pink.png",
  "/assets/img/MYO/Hair17-Purple.png",
  "/assets/img/MYO/Hair17-Red.png",
  "/assets/img/MYO/Hair17-White.png",
  "/assets/img/MYO/Hair17-Yellow.png",
  "/assets/img/MYO/Hair18-Black.png",
  "/assets/img/MYO/Hair18-Blue.png",
  "/assets/img/MYO/Hair18-Brown.png",
  "/assets/img/MYO/Hair18-Green.png",
  "/assets/img/MYO/Hair18-Pink.png",
  "/assets/img/MYO/Hair18-Purple.png",
  "/assets/img/MYO/Hair18-Red.png",
  "/assets/img/MYO/Hair18-White.png",
  "/assets/img/MYO/Hair18-Yellow.png",
  "/assets/img/MYO/Hair19-Black.png",
  "/assets/img/MYO/Hair19-Blue.png",
  "/assets/img/MYO/Hair19-Brown.png",
  "/assets/img/MYO/Hair19-Green.png",
  "/assets/img/MYO/Hair19-Pink.png",
  "/assets/img/MYO/Hair19-Purple.png",
  "/assets/img/MYO/Hair19-Red.png",
  "/assets/img/MYO/Hair19-White.png",
  "/assets/img/MYO/Hair19-Yellow.png",
  "/assets/img/MYO/Hair20-Black.png",
  "/assets/img/MYO/Hair20-Blue.png",
  "/assets/img/MYO/Hair20-Brown.png",
  "/assets/img/MYO/Hair20-Green.png",
  "/assets/img/MYO/Hair20-Pink.png",
  "/assets/img/MYO/Hair20-Purple.png",
  "/assets/img/MYO/Hair20-Red.png",
  "/assets/img/MYO/Hair20-White.png",
  "/assets/img/MYO/Hair20-Yellow.png",
  "/assets/img/MYO/Horns-1.png",
  "/assets/img/MYO/Horns-2.png",
  "/assets/img/MYO/Horns-3.png",
  "/assets/img/MYO/Marks-1.png",
  "/assets/img/MYO/Marks-2.png",
  "/assets/img/MYO/Marks-3.png",
  "/assets/img/MYO/Marks-4.png",
  "/assets/img/MYO/Marks-5.png",
  "/assets/img/MYO/Mouth-1.png",
  "/assets/img/MYO/Mouth-2.png",
  "/assets/img/MYO/Mouth-3.png",
  "/assets/img/MYO/Mouth-4.png",
  "/assets/img/MYO/Mouth-5.png",
  "/assets/img/MYO/Mouth-6.png",
  "/assets/img/MYO/Mouth-7.png",
  "/assets/img/MYO/Mouth-8.png",
  "/assets/img/MYO/Mouth-9.png",
  "/assets/img/MYO/Mouth-10.png",
  "/assets/img/MYO/Tail-1.png",
  "/assets/img/MYO/Tail-2.png",
  "/assets/img/MYO/Tail-3.png",

  // =====================================================
  // SONS - TRILHAS
  // =====================================================
  "/assets/sounds/trilhas/bar.mp3",
  "/assets/sounds/trilhas/boss.mp3",
  "/assets/sounds/trilhas/cave.mp3",
  "/assets/sounds/trilhas/celt.mp3",
  "/assets/sounds/trilhas/city.mp3",
  "/assets/sounds/trilhas/forest.mp3",
  "/assets/sounds/trilhas/intro.mp3",
  "/assets/sounds/trilhas/lake.mp3",
  "/assets/sounds/trilhas/market.mp3",
  "/assets/sounds/trilhas/moon.mp3",
  "/assets/sounds/trilhas/sun.mp3",
  "/assets/sounds/trilhas/templo.mp3",

  // =====================================================
  // SONS - EFEITOS
  // =====================================================
  "/assets/sounds/efeitos/barrier.mp3",
  "/assets/sounds/efeitos/bell.mp3",
  "/assets/sounds/efeitos/bolha.mp3",
  "/assets/sounds/efeitos/bolha2.mp3",
  "/assets/sounds/efeitos/click.wav",
  "/assets/sounds/efeitos/cuffs.mp3",
  "/assets/sounds/efeitos/fade.mp3",
  "/assets/sounds/efeitos/fire.wav",
  "/assets/sounds/efeitos/fire_spell.wav",
  "/assets/sounds/efeitos/gear.wav",
  "/assets/sounds/efeitos/ice.mp3",
  "/assets/sounds/efeitos/ice2.mp3",
  "/assets/sounds/efeitos/ice_crack.mp3",
  "/assets/sounds/efeitos/magic.wav",
  "/assets/sounds/efeitos/melt.mp3",
  "/assets/sounds/efeitos/reel.mp3",
  "/assets/sounds/efeitos/reveal.mp3",
  "/assets/sounds/efeitos/steam.mp3",
  "/assets/sounds/efeitos/swoosh.mp3",
  "/assets/sounds/efeitos/whooshfogo.mp3",
  "/assets/sounds/efeitos/win.wav",
  "/assets/sounds/efeitos/win2.mp3",
  "/assets/sounds/efeitos/win3.mp3",
  "/assets/sounds/efeitos/win4.wav",
  "/assets/sounds/efeitos/wind.mp3",
];

// =====================================================
// SISTEMA DE CACHE ULTRA-RÁPIDO
// =====================================================

const MAX_RETRIES = 1; // Só 1 retry para não travar
const RETRY_DELAY = 200; // 200ms entre tentativas
const MAX_PARALLEL_DOWNLOADS = 50; // Downloads simultâneos - MUITO mais rápido

// Função para baixar um arquivo com retry mínimo
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { cache: "no-cache" });
      if (response && response.status === 200) {
        return response;
      }
      throw new Error(`Status ${response.status}`);
    } catch (error) {
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw error;
      }
    }
  }
}

// Função para cachear arquivos em paralelo MASSIVO
async function cacheAllAssets(cache) {
  const failedUrls = [];
  let cached = 0;
  const total = urlsToCache.length;

  // Processa em lotes grandes de MAX_PARALLEL_DOWNLOADS
  for (let i = 0; i < urlsToCache.length; i += MAX_PARALLEL_DOWNLOADS) {
    const batch = urlsToCache.slice(i, i + MAX_PARALLEL_DOWNLOADS);

    await Promise.allSettled(
      batch.map(async (url) => {
        try {
          const response = await fetchWithRetry(url);
          await cache.put(url, response);
          cached++;
        } catch (error) {
          failedUrls.push(url);
        }
      })
    );

    // Log a cada lote
    console.log(
      `📥 Progress: ${Math.min(i + MAX_PARALLEL_DOWNLOADS, total)}/${total}`
    );
  }

  return { cached, total, failedUrls };
}

// Função para verificar integridade do cache
async function verifyCache() {
  const cache = await caches.open(CACHE_NAME);
  const missingUrls = [];

  for (const url of urlsToCache) {
    const response = await cache.match(url);
    if (!response) {
      missingUrls.push(url);
    }
  }

  return missingUrls;
}

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        console.log(
          "🎮 Cold Memories - Iniciando download completo do jogo..."
        );
        console.log(`📦 Total de arquivos: ${urlsToCache.length}`);

        const result = await cacheAllAssets(cache);

        if (result.failedUrls.length === 0) {
          console.log("✅ SUCESSO! Todos os arquivos foram cacheados!");
          // Notifica a página que o cache está completo
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "CACHE_COMPLETE",
                cached: result.cached,
                total: result.total,
              });
            });
          });
        } else {
          console.error(
            `❌ ATENÇÃO: ${result.failedUrls.length} arquivos falharam:`
          );
          result.failedUrls.forEach((url) => console.error(`  - ${url}`));

          // Notifica a página sobre as falhas
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "CACHE_FAILED",
                failedUrls: result.failedUrls,
                cached: result.cached,
                total: result.total,
              });
            });
          });
        }
      })
      .catch((error) => {
        console.error("❌ Erro crítico ao fazer cache:", error);
        // Notifica sobre erro crítico
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "CACHE_ERROR",
              error: error.message,
            });
          });
        });
      })
  );
  // Força a ativação imediata
  self.skipWaiting();
});

// Listener para mensagens da página (retry manual, verificação, etc.)
self.addEventListener("message", async (event) => {
  if (event.data.type === "RETRY_FAILED") {
    // Tenta baixar novamente os arquivos que falharam
    const cache = await caches.open(CACHE_NAME);
    const failedUrls = event.data.urls || [];
    const newFailed = [];

    for (const url of failedUrls) {
      try {
        const response = await fetchWithRetry(url);
        await cache.put(url, response);
        console.log(`✅ Recuperado: ${url}`);
      } catch (error) {
        newFailed.push(url);
      }
    }

    event.source.postMessage({
      type: newFailed.length === 0 ? "RETRY_SUCCESS" : "RETRY_PARTIAL",
      failedUrls: newFailed,
      recovered: failedUrls.length - newFailed.length,
    });
  }

  if (event.data.type === "VERIFY_CACHE") {
    const missingUrls = await verifyCache();
    event.source.postMessage({
      type: "VERIFY_RESULT",
      complete: missingUrls.length === 0,
      missingUrls: missingUrls,
      totalExpected: urlsToCache.length,
    });
  }
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Limpar cache antigo
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Removendo cache antigo:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // NOVO: Verificar integridade do cache na ativação
      (async () => {
        const missingUrls = await verifyCache();
        if (missingUrls.length > 0) {
          console.warn(
            `⚠️ CACHE INCOMPLETO NA ATIVAÇÃO: ${missingUrls.length} arquivos faltam`
          );
          console.warn("URLs faltando:", missingUrls.slice(0, 10)); // Mostra primeiras 10

          // Notifica clientes sobre a situação
          const clients = await self.clients.matchAll();
          clients.forEach((client) => {
            client.postMessage({
              type: "CACHE_INCOMPLETE_ON_ACTIVATE",
              missingCount: missingUrls.length,
              totalExpected: urlsToCache.length,
            });
          });

          // Inicia tentativa automática de recuperação em background
          // (não bloqueia a ativação)
          setTimeout(async () => {
            console.log(
              "🔄 Iniciando recuperação automática de cache incompleto..."
            );
            const cache = await caches.open(CACHE_NAME);
            let recovered = 0;

            for (const url of missingUrls) {
              try {
                const response = await fetchWithRetry(url, 3);
                await cache.put(url, response);
                recovered++;
              } catch (error) {
                console.warn(`Não conseguiu recuperar ${url}`);
              }
            }

            console.log(
              `✅ Recuperação: ${recovered}/${missingUrls.length} arquivos`
            );

            // Notifica resultado
            const clients = await self.clients.matchAll();
            clients.forEach((client) => {
              client.postMessage({
                type: "AUTO_RECOVERY_COMPLETE",
                recovered: recovered,
                failed: missingUrls.length - recovered,
              });
            });
          }, 5000); // Espera 5 segundos antes de começar
        } else {
          console.log("✅ Cache íntegro na ativação!");
        }
      })(),
    ])
  );

  // Toma controle de todas as páginas imediatamente
  self.clients.claim();
});

// Estratégia: Network First com fallback para cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, armazena no cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tenta buscar do cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Se não encontrar no cache, retorna uma página offline básica para navegação
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
      })
  );
});
