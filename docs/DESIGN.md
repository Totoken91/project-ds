# TOKIMEMO PROTO — Design Document

> Référence technique d'implémentation : formules, équilibrage chiffré, tables d'événements, conditions de déclenchement.
> Document compagnon de `TOKIMEMO_brief_v2.md` et `TOKIMEMO_characters.md`.
>
> **À utiliser comme source de vérité** lors du développement. Toute valeur en dur dans le code doit venir d'ici.

---

## 1. CONSTANTES GLOBALES

### 1.1 Calendrier

```typescript
const TOTAL_WEEKS = 36
const SCHOOL_START_WEEK = 1
const SCHOOL_END_WEEK = 36

const SEASONS = {
  spring: [1, 12],    // S1-S12
  summer: [13, 22],   // S13-S22 (plage débloquée)
  fall:   [23, 30],   // S23-S30
  winter: [31, 36]    // S31-S36 (parc d'attractions saisonnier final)
}

const EXAM_WEEKS = [12, 24, 35]
const CLUB_COMPETITION_WEEK = 28
const FESTIVAL_WEEK = 18
```

### 1.2 Stats initiales du joueur

```typescript
const INITIAL_PLAYER_STATS = {
  studies: 10,
  athletics: 10,
  art: 10,
  charm: 10,
  stress: 0,
  reputation: 50,
  money: 1000
}
```

### 1.3 Plages de stats

```typescript
const STAT_RANGE = { min: 0, max: 100 }
const STRESS_RANGE = { min: 0, max: 100 }
const REPUTATION_RANGE = { min: 0, max: 100 }
const AFFECTION_RANGE = { min: 0, max: 100 }
const MONEY_RANGE = { min: 0, max: 99999 }
```

### 1.4 Seuils critiques

```typescript
const STRESS_SICKNESS_THRESHOLD = 70   // au-delà, risque maladie
const STRESS_NEUROSIS_THRESHOLD = 90   // au-delà, game over (post-launch : neurose)
const SICKNESS_PROBABILITY = (stress) => Math.max(0, (stress - 70) / 30) // 0 à 1 entre 70 et 100
```

---

## 2. ACTIVITÉS HEBDOMADAIRES

### 2.1 Table complète des activités semaine

| ID | Nom | Études | Sport | Art | Charme | Stress | Argent | Précondition |
|---|---|---|---|---|---|---|---|---|
| `library` | Bibliothèque | +3 | 0 | 0 | 0 | +1 | 0 | — |
| `gym` | Salle de sport | 0 | +3 | 0 | 0 | +2 | 0 | — |
| `art_studio` | Atelier d'art | 0 | 0 | +3 | 0 | +1 | 0 | — |
| `cafe` | Café avec amis | +1 | 0 | 0 | +2 | -1 | -200 | — |
| `part_time_job` | Job temps partiel | 0 | 0 | 0 | +1 | +2 | +500 | — |
| `rest` | Repos | 0 | 0 | 0 | 0 | -3 | 0 | — |

### 2.2 Activités weekend

| ID | Nom | Effets | Précondition |
|---|---|---|---|
| `date` | Rendez-vous | Variable selon fille + lieu (voir §6) | Appel précédent accepté |
| `solo_boost` | Activité solo | +2 stat au choix, +2 stress | — |
| `weekend_rest` | Repos weekend | -5 stress | — |
| `study_hard` | Réviser | +4 études, +2 stress | — |
| `club_practice` | Pratique club | +1 club_xp, +1 stat club, +1 stress | Membre + jour de pratique |

### 2.3 Bonus passifs hebdomadaires (clubs)

```typescript
// Appliqués automatiquement chaque fin de semaine SI membre du club
const CLUB_PASSIVE_BONUS = {
  athletics_club: { athletics: +1, club_xp: +2 },
  literary_club:  { studies: +1,   club_xp: +2 },
  art_club:       { art: +1,       club_xp: +2 }
}
```

---

## 3. SYSTÈME D'AFFECTION

### 3.1 Paliers et seuils

```typescript
const AFFECTION_TIERS = {
  indifferent:   { min: 0,  max: 29 },
  friendly:      { min: 30, max: 49 },
  interested:    { min: 50, max: 69 },
  loving:        { min: 70, max: 89 },
  near_tokimeki: { min: 90, max: 99 },
  tokimeki:      { min: 100, max: 100 }  // état spécial nommé
}
```

### 3.2 Formule de calcul du gain d'affection lors d'un rendez-vous

```typescript
function calculateDateAffectionGain(player, girl, location, dialogueChoiceScores) {
  // 1. Score de compatibilité de stats
  const targetStats = girl.targetStats
  const diffs = ['studies', 'athletics', 'art', 'charm']
    .map(stat => Math.abs(player.stats[stat] - targetStats[stat]))
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length
  const compat = 100 - avgDiff  // 0 à 100

  let compatMultiplier
  if (compat >= 80) compatMultiplier = 1.5
  else if (compat >= 60) compatMultiplier = 1.0
  else if (compat >= 40) compatMultiplier = 0.5
  else compatMultiplier = 0  // ou même négatif si compat < 20

  // 2. Multiplicateur de lieu
  let locationMultiplier
  if (girl.lovedLocations.includes(location)) locationMultiplier = 1.5
  else if (girl.hatedLocations.includes(location)) locationMultiplier = -0.5
  else locationMultiplier = 1.0

  // 3. Score brut des choix de dialogue (somme algébrique)
  const dialogueScore = dialogueChoiceScores.reduce((a, b) => a + b, 0)

  // 4. Multiplicateur de réputation
  const repMultiplier = 0.5 + (player.stats.reputation / 100)  // 0.5 à 1.5

  // 5. Pénalité bombe active (si rumeur en cours, -10%)
  const bombPenalty = girl.activeRumor ? 0.9 : 1.0

  // Formule finale
  const gain = dialogueScore * compatMultiplier * locationMultiplier * repMultiplier * bombPenalty

  return Math.round(gain)
}
```

### 3.3 Score des choix de dialogue par fille

| Fille | Bonne réponse | Réponse moyenne | Mauvaise réponse |
|---|---|---|---|
| Rin | +5 | 0 | -3 |
| Naomi | +3 | +1 | -2 |
| Mio | +4 | 0 | -3 |
| **Mio (question fixe)** | +15 | — | -20 |

### 3.4 Décroissance d'affection (passive)

```typescript
// Chaque semaine où le joueur n'a AUCUNE interaction avec une fille (date, rencontre aléatoire, appel)
// ET que son affection est ≥ 30
const PASSIVE_AFFECTION_DECAY = -1  // -1/semaine

// Note : ce décroissement est désactivé pendant la phase Tension → Résolution (S30+)
// pour ne pas saboter le joueur en fin de partie
```

---

## 4. SYSTÈME DE BOMBE

### 4.1 États possibles d'une fille

```typescript
type GirlBombState =
  | 'normal'          // OK
  | 'tense'           // pas vue depuis 4 sem (≥40 affection)
  | 'bombed'          // pas vue depuis 6 sem (≥40 affection) — bombe active
  | 'reconciled'      // après appel d'excuses, retour normal
```

### 4.2 Logique de transition

```typescript
function updateBombState(girl, currentWeek) {
  const weeksSinceLastInteraction = currentWeek - girl.lastInteractionWeek

  if (girl.affection < 40) {
    girl.bombState = 'normal'
    return
  }

  if (girl.bombState === 'reconciled') {
    // Cooldown 4 semaines après réconciliation, puis retour normal
    if (weeksSinceLastInteraction >= 4) girl.bombState = 'normal'
    return
  }

  if (weeksSinceLastInteraction >= 6 && girl.bombState !== 'bombed') {
    triggerBomb(girl)
    girl.bombState = 'bombed'
  } else if (weeksSinceLastInteraction >= 4 && girl.bombState === 'normal') {
    girl.bombState = 'tense'
  }
}
```

### 4.3 Effets de la bombe

```typescript
function triggerBomb(bombedGirl, allGirls) {
  // 1. -20 affection sur TOUTES les autres filles
  for (const girl of allGirls) {
    if (girl.id !== bombedGirl.id && girl.affection >= 30) {
      girl.affection = Math.max(0, girl.affection - 20)
    }
  }

  // 2. Rumeur active pendant 3 semaines
  bombedGirl.activeRumor = { duration: 3, multiplier: 0.9 }

  // 3. Cooldown 4 semaines : la fille refuse toutes les invitations
  bombedGirl.invitationLocked = { until: currentWeek + 4 }

  // 4. La fille reste "bombed" jusqu'à appel d'excuses du joueur
  // (consomme 1 appel, n'est pas un rendez-vous)
}
```

### 4.4 Appel d'excuses (réconciliation)

```typescript
function apologyCall(girl) {
  if (girl.bombState !== 'bombed') return { success: false, message: "Inutile." }

  girl.bombState = 'reconciled'
  girl.affection = Math.max(20, girl.affection - 10)  // -10 pour la peine
  girl.lastInteractionWeek = currentWeek
  girl.invitationLocked = null
  // L'appel d'excuses consomme le créneau d'appel hebdo
}
```

### 4.5 Signaux visuels d'état tendu

| État | Signal |
|---|---|
| `tense` | Yoshi peut mentionner ("Elle a l'air un peu déçue") + sprite triste si croisée à l'école |
| `bombed` | Animation visible quand on tente de l'appeler (sonnerie, raccrochage) + Yoshi explicite ("Tu lui as fait un sale coup, mec") |
| `reconciled` | Sprite "fragile" pendant 2 semaines + Yoshi ("Elle te pardonne pas encore vraiment") |

---

## 5. SYSTÈME DE LIEUX

### 5.1 Table complète des lieux

| ID | Nom | Coût | Disponibilité | Type ambiance |
|---|---|---|---|---|
| `park` | Parc | 0¥ | S1+ | Calme, romantique |
| `cafe_loc` | Café | 500¥ | S1+ | Discussion, mid |
| `library_loc` | Bibliothèque | 0¥ | S3+ | Intello, calme |
| `cinema` | Cinéma | 1000¥ | S5+ | Date classique |
| `arcade` | Salle d'arcade | 800¥ | S5+ | Fun, énergique |
| `aquarium` | Aquarium | 1500¥ | S8+ | Romantique contemplatif |
| `beach` | Plage | 0¥ | S20-26 (été uniquement) | Saisonnier, sport |
| `theme_park` | Parc d'attractions | 2000¥ | S12+ | Date "spéciale", confessions |

### 5.2 Préférences par fille

```typescript
const GIRL_LOCATION_PREFERENCES = {
  rin: {
    loved:   ['arcade', 'cinema', 'park'],   // park = nuit pour Rin
    hated:   ['library_loc', 'aquarium'],    // aquarium devient neutre après cutscene
    neutral: ['cafe_loc', 'beach', 'theme_park']
  },
  naomi: {
    loved:   ['cafe_loc', 'aquarium', 'library_loc'],  // library devient hated après affection 60
    hated:   ['arcade', 'theme_park'],                 // theme_park reste hated SAUF confession
    neutral: ['park', 'beach', 'cinema']
  },
  mio: {
    loved:   ['aquarium', 'park', 'library_loc'],
    hated:   ['arcade', 'theme_park'],                 // theme_park reste hated SAUF confession
    neutral: ['cafe_loc', 'beach', 'cinema']
  }
}
```

### 5.3 Twists dynamiques de préférences

```typescript
// Naomi : la bibliothèque bascule loved → hated après affection 60
// (parce qu'elle veut sortir de sa case "fille modèle qui révise")
if (girl.id === 'naomi' && girl.affection >= 60) {
  // library_loc passe de loved à hated
  // Si le joueur l'invite à la biblio à ce stade, -affection au lieu de +
}

// Rin : aquarium bascule hated → neutral après cutscene 3 (poisson plastique)
if (girl.id === 'rin' && girl.flags.saw_aquarium_cutscene) {
  // aquarium passe de hated à neutral, et même loved après affection 80
}

// Confession : theme_park redevient acceptable pour Naomi ET Mio uniquement pour la confession finale
// (vérifié séparément dans la logique de confession, pas dans le calcul de date normal)
```

---

## 6. SYSTÈME D'APPEL TÉLÉPHONIQUE

### 6.1 Logique d'acceptation d'invitation

```typescript
function calculateInvitationAcceptance(girl, dayProposed, locationProposed, currentWeek) {
  // Refus auto
  if (girl.bombState === 'bombed') return { accepted: false, reason: 'busy' }
  if (girl.invitationLocked && currentWeek < girl.invitationLocked.until) {
    return { accepted: false, reason: 'busy' }
  }
  if (isClubPracticeDay(girl, dayProposed)) {
    return { accepted: false, reason: 'club_practice' }
  }
  if (girl.affection < 20) return { accepted: false, reason: 'not_interested' }

  // Probabilité base selon affection
  let probability = girl.affection / 100  // 0.20 à 1.00

  // Bonus si lieu adoré
  if (girl.lovedLocations.includes(locationProposed)) probability += 0.15

  // Malus si lieu détesté
  if (girl.hatedLocations.includes(locationProposed)) probability -= 0.30

  // Malus si état tendu
  if (girl.bombState === 'tense') probability -= 0.20

  // Malus si réputation basse
  if (player.stats.reputation < 30) probability -= 0.10

  // Bonus si réputation élevée
  if (player.stats.reputation > 70) probability += 0.10

  probability = Math.max(0.05, Math.min(0.95, probability))

  return { accepted: Math.random() < probability, probability }
}
```

### 6.2 Réponses téléphoniques (templates par palier)

Voir `TOKIMEMO_characters.md` §3 pour les exemples de dialogues. Implementation :

```typescript
function getPhoneResponse(girl, accepted, location) {
  const tier = getAffectionTier(girl.affection)
  // Pioche dans une table de templates ink ou JSON par fille × tier × accepted/refused × location_category
  return phoneResponseTable[girl.id][tier][accepted ? 'yes' : 'no']
}
```

---

## 7. CUTSCENES SPÉCIALES

### 7.1 Conditions de déclenchement

Une cutscene se déclenche **automatiquement à la fin d'un rendez-vous** si toutes les conditions sont remplies. Sinon date normale.

```typescript
type CutsceneCondition = {
  girlId: string
  cutsceneId: string
  location: string
  weekRange: [number, number]
  minAffection: number
  requiredFlags?: string[]
  blockedFlags?: string[]  // ne pas déclencher si déjà vu
}
```

### 7.2 Table complète des cutscenes (12 cutscenes + 3 confessions)

#### Rin

```typescript
{
  girlId: 'rin', cutsceneId: 'rin_arcade_chamber',
  location: 'arcade', weekRange: [4, 8], minAffection: 30,
  blockedFlags: ['rin_saw_arcade_chamber']
},
{
  girlId: 'rin', cutsceneId: 'rin_cinema_tear',
  location: 'cinema', weekRange: [15, 20], minAffection: 50,
  blockedFlags: ['rin_saw_cinema_tear']
},
{
  girlId: 'rin', cutsceneId: 'rin_aquarium_fish',
  location: 'aquarium', weekRange: [20, 99], minAffection: 60,
  blockedFlags: ['rin_saw_aquarium_fish']
  // setFlags après : ['rin_saw_aquarium_cutscene'] (modifie préférences lieux)
},
{
  girlId: 'rin', cutsceneId: 'rin_park_night_revelation',
  location: 'park', weekRange: [28, 99], minAffection: 80,
  requiredFlags: ['rin_saw_aquarium_fish'],
  blockedFlags: ['rin_saw_park_night']
},
{
  girlId: 'rin', cutsceneId: 'rin_confession',
  location: 'theme_park', weekRange: [33, 36], minAffection: 100,
  requiredStats: { studies: 60, charm: 70 },  // tolérance ±10 chacune
  requiredFlags: ['rin_saw_park_night']
}
```

#### Naomi

```typescript
{
  girlId: 'naomi', cutsceneId: 'naomi_cafe_matcha',
  location: 'cafe_loc', weekRange: [6, 10], minAffection: 30,
  blockedFlags: ['naomi_saw_cafe_matcha']
},
{
  girlId: 'naomi', cutsceneId: 'naomi_library_parents',
  location: 'library_loc', weekRange: [15, 20], minAffection: 50,
  blockedFlags: ['naomi_saw_library_parents']
  // ATTENTION : après cette cutscene, library_loc devient HATED pour Naomi
},
{
  girlId: 'naomi', cutsceneId: 'naomi_aquarium_drawing',
  location: 'aquarium', weekRange: [20, 25], minAffection: 60,
  requiredFlags: ['naomi_saw_library_parents'],
  blockedFlags: ['naomi_saw_aquarium_drawing']
},
{
  girlId: 'naomi', cutsceneId: 'naomi_beach_skipped_council',
  location: 'beach', weekRange: [22, 26], minAffection: 80,
  requiredFlags: ['naomi_saw_aquarium_drawing'],
  blockedFlags: ['naomi_saw_beach_skipped']
},
{
  girlId: 'naomi', cutsceneId: 'naomi_confession',
  location: 'theme_park', weekRange: [33, 36], minAffection: 100,
  requiredStats: { studies: 70, art: 60 },
  requiredFlags: ['naomi_saw_beach_skipped']
}
```

#### Mio

```typescript
{
  girlId: 'mio', cutsceneId: 'mio_library_cephalopods',
  location: 'library_loc', weekRange: [5, 9], minAffection: 30,
  blockedFlags: ['mio_saw_library_cephalopods']
},
{
  girlId: 'mio', cutsceneId: 'mio_park_notebook',
  location: 'park', weekRange: [15, 20], minAffection: 50,
  blockedFlags: ['mio_saw_park_notebook']
},
{
  girlId: 'mio', cutsceneId: 'mio_aquarium_jellyfish',
  location: 'aquarium', weekRange: [20, 26], minAffection: 60,
  requiredFlags: ['mio_saw_park_notebook'],
  blockedFlags: ['mio_saw_aquarium_jellyfish']
},
{
  girlId: 'mio', cutsceneId: 'mio_art_studio_friendship',
  // Lieu unique : atelier de l'école (pas un lieu de date classique)
  // Déclenché par événement aléatoire au lieu d'une date
  location: 'art_studio_school', weekRange: [28, 99], minAffection: 80,
  requiredFlags: ['mio_saw_aquarium_jellyfish'],
  blockedFlags: ['mio_saw_friendship']
},
{
  girlId: 'mio', cutsceneId: 'mio_confession',
  location: 'theme_park', weekRange: [33, 36], minAffection: 100,
  requiredStats: { art: 80, studies: 50 },
  requiredFlags: ['mio_saw_friendship']
}
```

### 7.3 Mio — questions fixes (mécanique unique)

3 moments dans l'année où Mio pose une question directe. Mentir = -20 affection. Vérité même dure = +15.

```typescript
const MIO_FIXED_QUESTIONS = [
  {
    week: 9, minAffection: 30,
    question: "Tu m'aimes bien ou tu as pitié de moi ?",
    truthful: ["Je t'aime bien", "Je suis pas sûr·e mais je veux apprendre"],
    lying: ["Pitié ? Mais non !", "T'es bizarre"]
  },
  {
    week: 19, minAffection: 50,
    question: "Pourquoi tu reviens me parler ? Sois précis·e.",
    truthful: ["Tu es la seule qui ne joue pas", "J'aime ta manière de voir"],
    lying: ["Parce que t'es cool", "Je sais pas"]
  },
  {
    week: 29, minAffection: 70,
    question: "Si je te disais que je ne sais pas si je suis capable d'aimer comme tout le monde, tu ferais quoi ?",
    truthful: ["Je m'en fous des modèles", "On invente notre propre version"],
    lying: ["Bien sûr que tu peux !", "T'inquiète"]
  }
]
```

---

## 8. ÉVÉNEMENTS ALÉATOIRES

### 8.1 Tirage hebdomadaire

À la fin de chaque semaine (avant résolution), tirage d'un événement avec probabilités pondérées.

```typescript
const WEEKLY_EVENT_TABLE = [
  { id: 'no_event',           weight: 40 },
  { id: 'random_encounter',   weight: 25 },  // rencontre après l'école
  { id: 'yoshi_tip',          weight: 15 },  // Yoshi te file un tuyau
  { id: 'rumor_check',        weight: 10 },  // info sur état d'une fille
  { id: 'unexpected_call',    weight: 5  },  // une fille t'appelle
  { id: 'minor_setback',      weight: 3  },  // -1 stat random ou +5 stress
  { id: 'lucky_break',        weight: 2  }   // +5 argent ou -3 stress
]
```

### 8.2 Rencontre aléatoire après l'école

Tirage de la fille rencontrée pondéré par affection actuelle :

```typescript
function pickEncounterGirl(girls) {
  const weights = girls.map(g => Math.max(5, g.affection))  // min 5 pour qu'aucune ne soit oubliée
  return weightedRandom(girls, weights)
}
```

Choix proposés au joueur :
| Choix | Effet |
|---|---|
| Marcher avec elle | +3 affection, +1 stress, slot weekend consommé |
| Décliner poliment | 0 affection, slot weekend libre |
| Décliner brutalement | -5 affection, -2 réputation, slot weekend libre |
| "Pas occupé·e" puis refus | -8 affection (pire que décliner brutalement) |

### 8.3 Yoshi tip

Yoshi te file une info utile :

```typescript
const YOSHI_TIPS = [
  // Tips lieux préférés (révèlent progressivement les goûts)
  { type: 'location_hint', condition: girl => girl.affection >= 30 },
  // Tips bombe imminente
  { type: 'bomb_warning', condition: girl => girl.bombState === 'tense' },
  // Tips stat préférée
  { type: 'stat_hint', condition: girl => girl.affection >= 50 },
  // Tips examen
  { type: 'exam_warning', condition: () => weeksToNextExam() <= 3 }
]
```

---

## 9. SYSTÈME D'EXAMENS

### 9.1 Logique de résolution

```typescript
const EXAM_THRESHOLDS = {
  excellent:    { minStudies: 60, repDelta: +5,  affectionDelta: +2 },
  pass:         { minStudies: 40, repDelta: 0,   affectionDelta: 0  },
  minor_fail:   { minStudies: 20, repDelta: -3,  affectionDelta: -2 },
  catastrophic: { minStudies: 0,  repDelta: -10, affectionDelta: -5 }
}

function resolveExam(player, allGirls) {
  const studies = player.stats.studies
  let result
  if (studies >= 60) result = 'excellent'
  else if (studies >= 40) result = 'pass'
  else if (studies >= 20) result = 'minor_fail'
  else result = 'catastrophic'

  const threshold = EXAM_THRESHOLDS[result]
  player.stats.reputation = clamp(player.stats.reputation + threshold.repDelta, 0, 100)

  for (const girl of allGirls) {
    girl.affection = clamp(girl.affection + threshold.affectionDelta, 0, 100)
  }

  // Catastrophique : événement humiliant scénarisé
  if (result === 'catastrophic') triggerHumiliationCutscene()

  return result
}
```

### 9.2 Augmentation de difficulté par examen

| Examen | Semaine | Seuil "excellent" |
|---|---|---|
| Mid-1 | 12 | studies ≥ 50 |
| Mid-2 | 24 | studies ≥ 60 |
| Final | 35 | studies ≥ 70 |

> Le seuil "pass" reste à 40 sur tous les examens. Seuls les seuils excellence/échec se durcissent.

---

## 10. SYSTÈME DE CLUBS

### 10.1 Choix initial

Semaine 2, le joueur choisit 1 club parmi 3 (ou aucun).

```typescript
const CLUBS = {
  athletics_club: {
    name: "Club d'athlétisme",
    passiveStat: 'athletics',
    associatedGirl: 'rin',  // Rin a fui au club d'athlétisme après l'humiliation de 1ère année (cf. CHARACTERS.md)
    // Note design : on peut associer Rin au club d'athlétisme parce qu'elle y a fui après l'humiliation
    practiceDays: ['saturday'],  // 2 weekends/mois
    practiceFrequency: 2,
    competitionWeek: 28
  },
  literary_club: {
    name: "Club littéraire",
    passiveStat: 'studies',
    associatedGirl: 'naomi',
    practiceDays: ['sunday'],
    practiceFrequency: 1,  // 1/mois
    competitionWeek: 28  // concours d'écriture
  },
  art_club: {
    name: "Club d'art",
    passiveStat: 'art',
    associatedGirl: 'mio',
    practiceDays: ['saturday'],
    practiceFrequency: 2,
    competitionWeek: 28  // expo annuelle
  }
}
```

### 10.2 Mécaniques détaillées

```typescript
// +1 stat passive chaque semaine si membre
applyClubPassive()

// Rencontres semi-aléatoires avec la fille du club (probabilité +20% par semaine)
maybeTriggerClubGirlEncounter()

// Pratique obligatoire : si manqué, -2 réputation
if (missedPractice && currentWeek > 4) {  // grace period 4 semaines
  player.reputation -= 2
  if (totalMissedPractices >= 3) excludeFromClub()
}

// Compétition annuelle (S28)
function clubCompetition(player, club) {
  const stat = player.stats[club.passiveStat]
  const won = stat >= 70  // seuil simple
  if (won) {
    for (const girl of allGirls) girl.affection += 10
    player.reputation += 15
    return 'victory'
  } else {
    player.reputation -= 5
    return 'defeat'
  }
}
```

### 10.3 Choix "no club"

Pas de club = liberté totale, pas de pratique obligatoire, pas de bonus passif. Viable pour speed-runs ou stratégies équilibrées multi-stats. Mais aucune fille n'a son club facilité → on les rencontre par les conditions stat-driven (Rin via Charm 25+, Naomi via Studies 25+, Mio via Art 25+).

---

## 11. SYSTÈME DE RENCONTRE INITIALE DES FILLES

```typescript
function checkGirlIntroduction(girl, player, currentWeek) {
  // Méthode 1 : club
  if (player.club === girl.associatedClub && currentWeek >= 3) {
    return triggerIntroduction(girl)
  }

  // Méthode 2 : stat-driven (auto si stat élevée)
  const statThresholds = {
    rin:   { stat: 'charm', value: 25, weekMin: 4 },
    naomi: { stat: 'studies', value: 25, weekMin: 4 },
    mio:   { stat: 'art', value: 25, weekMin: 4 }
  }
  const threshold = statThresholds[girl.id]
  if (player.stats[threshold.stat] >= threshold.value && currentWeek >= threshold.weekMin) {
    return triggerIntroduction(girl)
  }

  // Méthode 3 : Yoshi (fallback si pas rencontrée à la semaine 10)
  if (currentWeek >= 10 && !girl.met) {
    return triggerYoshiIntroduction(girl)
  }
}
```

**Garantie de design** : à la semaine 12 (premier examen), toutes les filles ont été rencontrées. Le joueur choisit ensuite qui poursuivre activement.

---

## 12. ÉCRAN "FIN D'ANNÉE" — LOGIQUE DE CONFESSION

### 12.1 Conditions pour chaque ending

```typescript
function determineEnding(player, allGirls) {
  // 1. Game over checks (priorité)
  if (player.totalExamFails >= 3) return 'expulsion_ending'
  if (player.stats.stress >= 90) return 'breakdown_ending'

  // 2. Filles candidates pour Tokimeki State
  const tokimekiGirls = allGirls.filter(g => g.affection >= 100)

  if (tokimekiGirls.length === 0) return 'solo_ending'

  // 3. Vérifier stats correspondantes
  for (const girl of tokimekiGirls) {
    if (statsMatchProfile(player.stats, girl.requiredStats, tolerance = 10)) {
      return `${girl.id}_good_ending`
    }
  }

  // 4. Affection max mais stats ratées : bittersweet
  return `${tokimekiGirls[0].id}_bad_ending`
}
```

### 12.2 Endings du MVP

| Ending | Condition | Description |
|---|---|---|
| `rin_good_ending` | Rin Tokimeki + stats OK | Confession parc d'attractions, "Tu m'as eu, connard." |
| `rin_bad_ending` | Rin Tokimeki, stats KO | Elle te dit qu'elle te trouvait bien mais "tu vas devoir grandir". Bittersweet. |
| `naomi_good_ending` | Naomi Tokimeki + stats OK | Elle a menti à ses parents, première fois. Liberté. |
| `naomi_bad_ending` | Naomi Tokimeki, stats KO | Elle pleure mais retourne dans sa case. "Je suis désolée. Je ne peux pas." |
| `mio_good_ending` | Mio Tokimeki + stats OK | Elle nomme l'amour, précisément, une fois pour toutes. |
| `mio_bad_ending` | Mio Tokimeki, stats KO | Elle te remercie de l'avoir aidée à comprendre l'amitié. Tu n'es pas l'amour. C'est ok. |
| `solo_ending` | Aucune fille à 100 | Diplôme. Année écoulée. Rétrospective douce-amère, possible "next year ?" |
| `expulsion_ending` | 3 examens ratés | Game over scolaire, ton tragi-comique |
| `breakdown_ending` | Stress 90+ | Game over psychologique, ton sec |

---

## 13. BALANCE — VALEURS À TUNER EN QA

> Ces valeurs sont les **valeurs de départ** — à ajuster pendant M7 (Balance + QA).

### 13.1 Cibles de progression de stats

À la semaine 36, un joueur "moyen" (allocation équilibrée, pas optimisé) devrait atteindre :
- Études : 50-60
- Sport : 40-50
- Art : 40-50
- Charme : 40-55

Un joueur **optimisé sur une stat** devrait atteindre **80+** sur cette stat (suffisant pour les profils cibles).

### 13.2 Vélocité d'affection cible

Pour qu'une run ciblée mène une fille à 100 sans effort surhumain :
- Affection moyenne par date réussie : 8-12
- Nombre de dates nécessaires : 10-12 dates ciblées
- Sur 36 semaines, 1 appel/sem = 36 appels max → 30+ dates possibles → margin OK
- Cutscenes spéciales boost +5 affection bonus chacune

### 13.3 Difficulté par fille

| Fille | Difficulté | Pourquoi |
|---|---|---|
| Rin | ⭐⭐ Moyenne | Test des choix mais lieux faciles à deviner |
| Naomi | ⭐⭐⭐ Difficile | Twist library + sélectivité tardive + Charm élevé requis |
| Mio | ⭐⭐ Moyenne | Questions fixes brutales mais lieux/préférences cohérents |

### 13.4 Coût économique total

Sur une run optimale ciblant Naomi :
- 8 dates café × 500 = 4000¥
- 4 dates aquarium × 1500 = 6000¥
- 1 confession theme park = 2000¥
- Total minimum : ~12000¥
- Job temps partiel rapporte 500¥/sem → besoin de ~24 semaines de job
- **Conclusion** : impossible de tout faire sans optimisation. C'est voulu.

---

## 14. DEBUG & QA

### 14.1 Mode debug overlay (dev uniquement)

```typescript
// Toggle avec touche `~` en dev
type DebugOverlay = {
  showAffectionGauges: boolean   // valeurs numériques visibles
  showCompatScores: boolean      // affiché lors des dates
  showFlagState: boolean         // tous les drapeaux narratifs
  showBombState: boolean         // état de chaque fille
  forceWeekJump: boolean         // sauter à une semaine arbitraire
  forceAffection: boolean        // setter manuel
}
```

### 14.2 Métriques à logger pendant QA

- Nombre moyen de dates par fille à la fin d'une run
- Taux de bombes par playthrough
- Distribution des endings sur 10 runs aveugles
- Stats moyennes au moment de chaque examen
- Cutscenes ratées par playthrough (objectif < 30%)

### 14.3 Save data structure (TypeScript)

```typescript
interface SaveData {
  version: string
  player: {
    name: string
    stats: { studies, athletics, art, charm, stress: number }
    reputation: number
    money: number
    club: 'athletics_club' | 'literary_club' | 'art_club' | null
    examResults: ('excellent' | 'pass' | 'minor_fail' | 'catastrophic')[]
  }
  girls: {
    [girlId: string]: {
      affection: number
      met: boolean
      lastInteractionWeek: number | null
      bombState: GirlBombState
      activeRumor: { duration, multiplier } | null
      invitationLocked: { until: number } | null
      flags: Record<string, boolean>
    }
  }
  currentWeek: number
  phoneCallUsedThisWeek: boolean
  scheduledDate: { girlId, day, location } | null
  gameTime: number  // seconds played
  saveSlot: 1 | 2 | 3
  savedAt: string  // ISO date
}
```

---

## 15. CHECKLIST DE COHÉRENCE

À la fin de l'implémentation, vérifier :

- [ ] Chaque fille peut atteindre 100 affection en 36 semaines avec optimisation
- [ ] Chaque cutscene est déclenchable au moins une fois par run
- [ ] La bombe peut être évitée si le joueur joue prudemment (max 2 filles courtisées)
- [ ] Les 3 endings good sont accessibles
- [ ] Le bittersweet ending donne assez d'indices au joueur sur ce qu'il a raté
- [ ] Yoshi donne des tips cohérents avec l'état réel des filles
- [ ] Les 3 questions fixes de Mio se déclenchent aux bons moments
- [ ] L'examen catastrophique a sa cutscene scénarisée
- [ ] Le système de réputation a un vrai impact (tester avec rep < 30 vs > 70)
- [ ] La sauvegarde survit à un refresh du navigateur en plein milieu d'une scène

---

## 16. NEXT STEPS

1. **Validation de ce design.md** — relecture, ajustements valeurs/formules
2. **Setup M0** : prompt Claude Code packagé avec brief + characters + design pour générer le squelette projet
3. **Itération sur les valeurs** pendant M1-M3 (instrumentation debug overlay dès le départ)
4. **QA balance** au M7

---

*Document v1 — référence d'implémentation. Source de vérité pour les chiffres.*
