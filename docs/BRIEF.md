# TOKIMEMO PROTO — Brief BMAD v2

> **Nom de code provisoire.** Dating sim système-driven inspiré de Tokimeki Memorial (Konami, 1994).
> Document de référence game design + scope + jalons. Vivant, à itérer.
>
> **v2** : refonte complète après audit des mécaniques originales. Intègre lieux de rendez-vous, format date courte, clubs, examens, Tokimeki State, vérification d'affection indirecte, cutscenes spéciales, et bad ending sur stats. Roadmap post-launch séparée.

---

## 1. PITCH

**Tokimemo Proto** est un dating sim 2D web inspiré du système de Tokimeki Memorial. Le joueur incarne un lycéen sur une année scolaire (36 semaines) et doit développer ses stats, gérer son emploi du temps, et conquérir l'une des trois filles disponibles — sans déclencher de "bombe" relationnelle qui ruinerait toutes ses chances.

Le cœur de l'expérience n'est pas l'histoire, c'est **le système** : allocation de temps, stats cachées, lieux de rendez-vous, rumeurs entre PNJ, affection invisible, examens, clubs. Les joueurs lisent les indices (sprites, dialogues, comportements) plutôt qu'une jauge.

**Direction artistique** : pixel art cohérent avec l'univers de Kenny (retro PS1/PS2, sensibilité Y2K/Frutiger Aero possible pour les écrans système).

**Setting** : romance lycée classique, japon contemporain stylisé.

**Durée cible d'une run** : 4-6 heures pour finir un ending.

**Langue du jeu** : **English** (international reach on itch.io). Les noms des personnages restent japonais pour l'authenticité du setting. Tous les dialogues, UI, textes seront en EN dès le départ.

---

## 2. PILIERS DE DESIGN

Les 5 piliers non négociables qui définissent l'expérience :

### 2.1 Système avant histoire
La boucle de gameplay (calendrier → activité → événement → date → résolution) doit être satisfaisante même sans contenu narratif. Les stats, les rumeurs, les drapeaux sont le vrai jeu.

### 2.2 Affection cachée
Aucune jauge "amour" visible. Le joueur déduit l'état des relations via les sprites, dialogues, disponibilités, et via une **vérification indirecte** auprès du meilleur ami PNJ. Cette opacité est ce qui rend Tokimeki tendu et mémorable.

### 2.3 Densité d'interactions > profondeur narrative
Beaucoup de **mini-décisions** courtes plutôt que peu de grosses. Une date = 1-2 questions à choix multiples, pas une scène de 10 minutes. Le joueur fait 30+ choix par run, pas 5.

### 2.4 Le système de bombe
Négliger une fille à qui on a donné de l'attention provoque des rumeurs négatives qui contaminent les autres relations. Force le joueur à choisir et à gérer activement, plutôt que de courtiser tout le monde.

### 2.5 L'optimisation comme victoire
Atteindre 100 d'affection ne suffit pas pour finir avec une fille. Il faut **affection ET stats correspondant à ses goûts**. Le challenge mathématique de toucher tous les seuils sans déclencher de bombe = la vraie skill du jeu.

---

## 3. BOUCLE DE GAMEPLAY

### 3.1 Boucle macro (1 an scolaire = 36 semaines)

```
SEMAINE n
├─ MENU PLANNING
│  ├─ Choix d'activité de semaine (1 parmi 6)
│  └─ Bonus passif du club (si membre)
├─ ÉVÉNEMENT POSSIBLE
│  ├─ Rencontre aléatoire après l'école (choix poli/grossier)
│  ├─ Examen (semaines 12, 24, 35)
│  ├─ Compétition de club (rare)
│  └─ Rumeur / appel surprise d'une fille
├─ APPEL TÉLÉPHONIQUE (1/semaine max)
│  └─ Proposer un jour + un lieu à une fille
├─ WEEKEND
│  ├─ Rendez-vous (si appel accepté)
│  ├─ Vérifier affection via meilleur ami
│  ├─ Repos / Activité solo / Réviser
│  └─ Pratique de club (obligatoire certains weekends)
├─ RÉSOLUTION
│  ├─ Stats mises à jour
│  ├─ Stress mis à jour
│  ├─ Affection mise à jour (par fille concernée)
│  ├─ Drapeaux narratifs activés
│  └─ Risque maladie si stress > seuil
└─ SEMAINE n+1
```

### 3.2 Phases narratives sur l'année

| Phase | Semaines | Enjeu |
|---|---|---|
| **Découverte** | 1-8 | Rencontrer les 3 filles, choisir un club, obtenir leurs numéros |
| **Construction** | 9-20 | Premier examen (S12), monter affection + stats |
| **Tension** | 21-30 | Premières bombes possibles, événements clés, deuxième examen (S24) |
| **Résolution** | 31-36 | Examen final (S35), confession ou échec, ending |

### 3.3 Activités hebdomadaires (6 choix)

| Activité | Effets primaires | Stress |
|---|---|---|
| **Bibliothèque** | Études +3 | +1 |
| **Salle de sport** | Sport +3 | +2 |
| **Atelier d'art** | Art +3 | +1 |
| **Café avec amis** | Charme +2, Études +1 | -1 |
| **Job à temps partiel** | Argent +500¥, Charme +1 | +2 |
| **Repos** | Stress -3 | -3 |

> Valeurs indicatives. À tuner pendant le balancing.

### 3.4 Activités weekend

- **Rendez-vous** (si appel précédent accepté) → scène ink courte, +affection si réussi
- **Solo** → boost stat de ton choix (+2 stat, +2 stress)
- **Repos** → −5 stress
- **Réviser** → Études +4, +2 stress
- **Pratique club** (obligatoire certains weekends si membre)

### 3.5 Règle d'or de l'appel téléphonique

**1 appel par semaine maximum.** Le joueur choisit :
1. Quelle fille appeler
2. Quel jour proposer (samedi / dimanche)
3. Quel lieu proposer (parmi les lieux débloqués)

Réponse de la fille basée sur :
- Affection actuelle (probabilité acceptation croît avec affection)
- Préférence pour le lieu proposé (booste affection si bonne, pénalise si mauvaise)
- Disponibilité (si elle est dans un club et c'est son jour de pratique, refus auto)
- Tension actuelle (si elle est en état "tendu", refus probable)

**Cette mécanique est centrale.** L'unique appel par semaine crée le dilemme structurant du jeu.

---

## 4. SYSTÈMES

### 4.1 Stats joueur

5 stats simplifiées (vs 8 dans Tokimeki original) :

| Stat | Plage | Description |
|---|---|---|
| **Études** (`studies`) | 0-100 | Réussite scolaire, attire les intellos, conditionne examens |
| **Sport** (`athletics`) | 0-100 | Forme, attire les sportives |
| **Art** (`art`) | 0-100 | Sensibilité créative, attire les artistes |
| **Charme** (`charm`) | 0-100 | Aisance sociale, multiplicateur d'affection |
| **Stress** (`stress`) | 0-100 | Caché. Au-delà de 70, risque maladie |

**Argent** : variable séparée, pas une stat. Sert pour les rendez-vous et déblocages futurs.

### 4.2 Affection (par fille, cachée)

Trois jauges 0-100 jamais affichées au joueur. Communiquées via :

| Palier | État interne | Sprite | Comportement |
|---|---|---|---|
| 0-29 | Indifférente | Neutre | Refuse les invitations, dialogues courts |
| 30-49 | Amicale | Souriant occasionnel | Accepte certaines invitations |
| 50-69 | Intéressée | Joyeux | Accepte la plupart des invitations, dialogues longs |
| 70-89 | Amoureuse | Blushing | Peut t'inviter spontanément |
| 90-99 | Quasi-Tokimeki | Spécial | Confession sur le point d'être disponible |
| **100 = Tokimeki State** | État spécial nommé | Sprite confession | Confession finale débloquée si stats correctes |

### 4.3 Vérification d'affection indirecte (via meilleur ami)

Ton meilleur ami PNJ (appelons-le **Yoshi**, hommage non-déguisé à Yoshio) peut être appelé/rencontré pour :
- Te dire ce que les filles "pensent de toi" (info qualitative, pas chiffre)
- Te donner un numéro de téléphone d'une fille rencontrée
- Te confirmer qu'une fille a l'air contrariée (signal de bombe imminente)

**Exemple de dialogue de Yoshi (en jeu = anglais) :**
- Affection 0-29 : *"Rin? Hmm, she barely knows you."*
- Affection 30-49 : *"Rin said you were chill the other day."*
- Affection 50-69 : *"You and Rin seem to vibe, huh."*
- Affection 70-89 : *"Hey, Rin's been talking about you a lot lately…"*
- Affection 90+ : *"Dude, I think Rin's completely fallen for you. Seriously."*
- État tendu : *"Rin looked kinda disappointed earlier. What did you do?"*

**1 vérification par semaine** (consomme ton créneau de "Café avec amis" ou un slot dédié).

### 4.4 Système de match (préférences cachées)

Chaque fille a un **profil cible** sur les 4 stats publiques. À chaque rendez-vous ou interaction significative, on calcule un **score de compatibilité** :

```
compat = 100 - moyenne(|stat_joueur - stat_cible|)
```

Multiplie le gain d'affection :
- compat ≥ 80 : +affection × 1.5
- 60 ≤ compat < 80 : +affection × 1.0
- 40 ≤ compat < 60 : +affection × 0.5
- compat < 40 : +affection × 0 ou même négatif

### 4.5 Système de lieux de rendez-vous

**8 lieux disponibles**, débloqués progressivement ou présents dès le début :

| Lieu | Disponible | Coût | Type |
|---|---|---|---|
| Parc | Dès semaine 1 | Gratuit | Calme, romantique |
| Café | Dès semaine 1 | 500¥ | Discussion, mid |
| Bibliothèque | Dès semaine 3 | Gratuit | Intello, calme |
| Cinéma | Dès semaine 5 | 1000¥ | Date classique |
| Salle d'arcade | Dès semaine 5 | 800¥ | Fun, énergique |
| Aquarium | Dès semaine 8 | 1500¥ | Romantique, contemplatif |
| Plage | Été (S20-26) | Gratuit | Saisonnier, sport |
| Parc d'attractions | Dès semaine 12 | 2000¥ | Date "spéciale" (cutscenes uniques) |

**Chaque fille a 3 lieux préférés et 2 lieux qu'elle déteste.** Inviter une fille à un lieu qu'elle aime = +1.5x affection. Lieu qu'elle déteste = -50% ou même -affection.

**Le joueur ne sait pas explicitement quels lieux chaque fille aime.** Il déduit via :
- Dialogues lors d'autres scènes ("J'adore les aquariums…")
- Réaction de la fille pendant la date (sprite content/déçu)
- Yoshi (rare, à un palier d'affection élevé)

### 4.6 Format de rendez-vous (COURT, dense)

**Structure standard d'une date (~1-2 minutes de jeu) :**

```
1. Arrivée au lieu — sprite + dialogue d'accueil (1-3 lignes)
2. Question 1 (choix multiple, 2-3 options) — impact affection +/- 5
3. Mini-segment narratif (1-2 lignes selon réussite Q1)
4. Question 2 (parfois absente) — impact affection +/- 5
5. Conclusion — sprite + dialogue final (1-3 lignes)
```

**Total** : 1-2 décisions max. Le joueur enchaîne 30+ dates par run.

### 4.7 Cutscenes spéciales (collection cachée)

**Chaque fille a 3-4 cutscenes spéciales** débloquées par combinaisons précises de :
- Lieu spécifique
- Période de l'année (semaines X à Y)
- Affection minimum
- Drapeau narratif déjà actif

**Exemple — Rin :**
- Cutscene 1 (Arcade, S4-8, affection ≥30) : Rin te bat à un rhythm game et te chambre
- Cutscene 2 (Cinéma, S15-20, affection ≥50) : larme discrète à un film d'auteur, blâme la clim
- Cutscene 3 (Aquarium, affection ≥70) : moment intime, sprite spécial
- Cutscene confession (Parc d'attractions, S30+, affection 100, stats validées)

Ces cutscenes sont **la récompense narrative principale**. Elles motivent la rejouabilité (compléter la galerie de chaque fille).

### 4.8 Système de bombe (signature Tokimeki)

**Règle MVP :**

```
SI fille.affection ≥ 40
ET semaine_actuelle - fille.derniere_interaction ≥ 4
ALORS fille passe en état "tendue" (signaux subtils)

SI fille.affection ≥ 40
ET semaine_actuelle - fille.derniere_interaction ≥ 6
ALORS BOMBE :
  - −20 affection sur TOUTES les autres filles
  - rumeur diffusée pendant 3 semaines (modificateur −10% sur tous les gains)
  - cooldown : la fille n'est plus invitable pendant 4 semaines
  - la fille reste "bombée" jusqu'à un appel d'excuses (consomme 1 appel)
```

**Signaux d'état tendu (visibles mais non explicités) :**
- Yoshi mentionne qu'elle "avait l'air un peu déçue"
- Sprite triste si croisée à l'école
- Refus systématique des invitations même au lieu préféré

### 4.9 Rencontres aléatoires après l'école

Tous les 1-2 semaines, en sortant de l'école, le joueur croise une fille (probabilité pondérée par affection actuelle, semaine, etc.).

**Choix :**
- "Marcher avec elle" (+petit bonus affection, prend 1 slot d'activité)
- "Décliner poliment" (neutre)
- "Décliner brutalement" (-affection)

**Subtilité Tokimeki :** dire "Je ne suis pas occupé" puis refuser l'invitation = pire que dire "Désolé je suis occupé". La politesse compte.

### 4.10 Système de clubs (1 par run)

**Au début du jeu** (semaine 2), le joueur choisit **un club** parmi 3 :

| Club | Stat passive +1/sem | Fille associée | Pratique obligatoire |
|---|---|---|---|
| **Club d'athlétisme** | Sport | Rin* | 2 weekends/mois |
| **Club littéraire** | Études | Naomi | 1 weekend/mois |
| **Club d'art** | Art | Mio | 2 weekends/mois |

> \* Rin est associée au club d'athlétisme : justifié narrativement (elle y a fui après l'humiliation de 1ère année — voir `CHARACTERS.md`).

**Effets :**
- +1 stat passive correspondante chaque semaine (sans utiliser ton activité)
- Rencontres semi-aléatoires avec la fille du club (booste affection)
- Compétition annuelle (semaine 28) : si tu gagnes (basé sur stat), +10 affection avec toutes les filles
- **Rejoindre un club ne bloque pas les autres filles** mais facilite énormément la fille associée

**Pénalités :**
- Manquer une pratique obligatoire = -2 réputation (impact sur acceptations futures)
- Trop manquer = exclusion du club (perte du bonus passif)

**Choix de NE PAS rejoindre de club** = liberté totale mais aucun bonus passif. Viable mais difficile.

### 4.11 Système d'examens

**3 examens par an** : semaine 12, 24, 35.

Réussite basée sur ta stat **Études** au moment de l'examen :
- Études ≥ 60 : Réussite excellente (+5 réputation, +2 affection toutes filles)
- Études 40-59 : Passe (neutre)
- Études 20-39 : Échec mineur (-3 réputation, -2 affection toutes filles)
- Études < 20 : Échec catastrophique (-10 réputation, -5 affection toutes filles, événement humiliant scénarisé)

**Réputation** : variable cachée 0-100. Modifie la probabilité d'acceptation des invitations et l'amplitude des gains d'affection. Démarre à 50.

### 4.12 Bad ending malgré affection max

**Pour qu'une fille te confesse, il faut :**
1. Affection = 100 (Tokimeki State)
2. Stats joueur correspondent à son profil cible (toutes les stats cibles atteintes ±10)
3. Aucune bombe active à la semaine 36

**Si seulement (1) sans (2)** : la fille ne te confesse pas. À la place, scène de "presque mais pas tout à fait" — bittersweet ending. Le joueur comprend qu'il a investi dans la mauvaise direction.

**Cette règle force l'optimisation.** Tu ne peux pas juste spammer les dates. Tu dois aussi devenir le mec qu'elle veut.

### 4.13 Drapeaux narratifs (flags)

Booléens stockés par fille pour gérer les événements scénarisés :

```typescript
flags: {
  metAtFestival: boolean
  knowsHerSecret: boolean
  rejectedOnce: boolean
  saw_cutscene_1_park: boolean
  saw_cutscene_2_beach: boolean
  apologized_after_bomb: boolean
  // ...
}
```

Utilisés dans inkjs pour conditionner les dialogues et débloquer les cutscenes.

---

## 5. PERSONNAGES

### 5.1 Le protagoniste

Personnalisable : prénom + nom (pour que les filles puissent l'appeler par son prénom dans les dialogues). Pas de sprite — perspective FPS de VN classique.

**Stats de départ** : tout à 10. Stress 0. Réputation 50. Argent 1000¥.

### 5.2 Yoshi — Le meilleur ami (PNJ)

Pas une love interest. Sert de **système d'information indirecte** sur les filles. Présent dès la semaine 1. Phone number obtenu d'office.

**Mécaniques :**
- Appel téléphonique → check affection qualitatif d'une fille
- Apparitions aléatoires à l'école → te file un tip ou un numéro
- Peut introduire une fille que tu n'as pas encore rencontrée si conditions remplies

### 5.3 Les 3 filles (résumé — voir `CHARACTERS.md` pour les profils complets)

#### Rin — La cool girl qui calcule tout
- **Archétype** : détachée, ironique, populaire sans effort. Twist : masque construit après une humiliation publique.
- **Profil cible** : Études 60+, Charme 70+, Art 50+
- **Rencontre** : auto si club athlétisme, sinon stat Charme ≥ 25, semaine 4+
- **Lieux préférés** : Salle d'arcade, Cinéma, Parc (nuit)
- **Lieux détestés** : Bibliothèque, Aquarium (jusqu'à cutscene 3)
- **Particularité** : test des choix de dialogue (+5/-3 au lieu de +/-2)

#### Naomi — La fille modèle qui se déteste
- **Archétype** : déléguée parfaite. Twist : vide identitaire, étouffée par les attentes parentales.
- **Profil cible** : Études 70+, Art 60+, Charme 50+
- **Rencontre** : auto si club littéraire, sinon stat Études ≥ 25, semaine 4+
- **Lieux préférés** : Café, Aquarium, Bibliothèque (devient hated après affection 60 — twist signature)
- **Lieux détestés** : Salle d'arcade, Parc d'attractions (sauf confession)
- **Particularité** : sélectivité inversée — accepte tout au début, exigeante en fin

#### Mio — La fille bizarre qui ne ment jamais
- **Archétype** : neuroatypique implicite, observation sensorielle, honnêteté brutale. Pas de twist — *elle est le twist*.
- **Profil cible** : Art 80+, Études 50+
- **Rencontre** : auto si club d'art, sinon stat Art ≥ 25, semaine 4+
- **Lieux préférés** : Aquarium, Parc, Bibliothèque
- **Lieux détestés** : Salle d'arcade, Parc d'attractions (sauf confession)
- **Particularité** : 3 questions fixes dans la run, mentir = -20 affection, vérité = +15

> Profils détaillés (background, twist progressif, cutscenes, dialogues par palier) dans `CHARACTERS.md`.

---

## 6. SCOPE MVP

### 6.1 Ce qui EST dans le MVP

#### Boucle et systèmes
- ✅ Boucle 36 semaines complète
- ✅ 5 stats + stress + argent + réputation
- ✅ 6 activités semaine + 4 activités weekend
- ✅ Système d'appel téléphonique (1/semaine, jour + lieu)
- ✅ 8 lieux de rendez-vous avec préférences par fille
- ✅ Format date courte (1-2 questions)
- ✅ Système de clubs (3 clubs au choix, effets passifs + pratique)
- ✅ 3 examens (S12, S24, S35) avec impact réputation

#### Filles et narration
- ✅ 3 filles complètes avec affection cachée + profil cible + préférences de lieux
- ✅ Yoshi (meilleur ami PNJ) — vérification d'affection + intro filles
- ✅ ~12 cutscenes spéciales (4 par fille, dont la confession)
- ✅ ~20 scènes de date courtes par fille (réutilisables avec variations)
- ✅ ~8 événements aléatoires génériques
- ✅ Tokimeki State nommée à 100 affection
- ✅ Bad ending si stats incorrectes malgré Tokimeki State

#### Système de bombe
- ✅ Système de bombe complet avec état tendu
- ✅ Signaux subtils (Yoshi, sprites)
- ✅ Mécanique d'excuses par appel

#### UI/UX
- ✅ Sauvegarde unique localStorage + 3 slots manuels
- ✅ Écrans : titre, calendrier, planning semaine, écran téléphone, scène ink, fin de semaine, examen, game over, ending
- ✅ Audio : 3-4 BGM (titre, école, date, tension), ~10 SFX
- ✅ Écran "fin d'année" avec confession ou bad ending

#### Endings
- ✅ 3 good endings (1 par fille)
- ✅ 3 bad endings "presque mais pas" (stats incorrectes malgré affection max)
- ✅ 1 solo ending (aucune fille à 100)
- ✅ 1 game over (échec catastrophique aux examens / neurose)

### 6.2 Ce qui N'EST PAS dans le MVP — voir Roadmap Post-Launch

- ❌ Rival NPC qui vole une fille
- ❌ État de neurose (juste maladie simple)
- ❌ Plus de 3 filles
- ❌ Plusieurs années scolaires
- ❌ Mini-jeux (compétitions de club = juste résolution mathématique)
- ❌ Voice acting
- ❌ Système d'items / cadeaux évolués
- ❌ Galerie de CG débloquables
- ❌ Achievements
- ❌ NG+
- ❌ Localisation (FR only au lancement)
- ❌ Système de mode (vêtements / apparence)
- ❌ Saisons multiples scénarisées (juste été pour la plage)

---

## 7. ROADMAP POST-LAUNCH

Découpée en **vagues**, chaque vague étant un update potentiellement annoncé/marketé.

### Vague 1 : "Polish & Quality of Life" (1-2 mois après launch)
*Objectif : répondre aux retours immédiats, améliorer l'expérience.*

- 🎯 **Galerie CG débloquables** — visualiser les cutscenes obtenues
- 🎯 **Achievements** simples (~15) : finir chaque ending, voir toutes les CG d'une fille, finir sans bombe, etc.
- 🎯 **Mode skip texte** (Ctrl pour fast-forward, standard VN)
- 🎯 **Sauvegarde rapide** (F5 / F9)
- 🎯 **Log de dialogue** (revoir les dernières lignes)
- 🎯 **Améliorations balance** basées sur feedback joueurs

### Vague 2 : "Le Rival" (2-3 mois)
*Objectif : ajouter la mécanique signature manquante.*

- 🎯 **Rival NPC** (extension de Yoshi ou nouveau personnage) qui peut voler une fille
- 🎯 Rival a son propre tracker d'affection avec chaque fille
- 🎯 Si à la fin de l'année le rival a plus d'affection avec une fille que toi → confession volée, ending alternatif
- 🎯 Événements scénarisés impliquant le rival (compétition directe)
- 🎯 Achievement "Battre le rival sur sa propre fille préférée"

### Vague 3 : "La Quatrième Fille" (3-4 mois)
*Objectif : étendre le contenu, ajouter du mystère pour les complétistes.*

- 🎯 **Fille secrète** débloquable uniquement avec des conditions précises (stats spécifiques, événements vus, drapeaux)
- 🎯 Archétype suggéré : la "consolation girl" (apparaît si tu rates les 3 autres) OU la "secret crush" (n'apparaît qu'à des conditions très précises)
- 🎯 Son arc narratif est plus court mais plus intense
- 🎯 Cutscenes uniques + ending dédié

### Vague 4 : "Année 2" (6+ mois, gros chantier)
*Objectif : étendre la run de 1 à 2 ans scolaires.*

- 🎯 **Année 2 complète** : nouvelles activités, nouveaux lieux saisonniers (hiver, voyage scolaire)
- 🎯 **Choix d'orientation** en fin d'année 1 (impacte les stats max et événements)
- 🎯 **Voyage scolaire** scénarisé (3-4 jours intenses, événements uniques par fille)
- 🎯 **État de neurose** complet (vrai game over psychologique différent de la maladie)
- 🎯 **Festival culturel** comme grand événement de fin d'année

### Vague 5 : "Stretch goals divers" (à intercaler ou groupé)
- 🎯 **Mode NG+** : conserve une partie des stats + accès anticipé à certains lieux
- 🎯 **Localisation EN** (priorité 1 hors FR), JP en stretch
- 🎯 **Système de mode/apparence** : vêtements achetables qui modifient sprites + stats
- 🎯 **Compétitions de club** comme mini-événements scénarisés (pas mini-jeux, mais résolutions narratives)
- 🎯 **Items / cadeaux** : achetables, à offrir lors des dates, augmentent affection si bien choisis
- 🎯 **Mode "histoire condensée"** : run courte de 12 semaines avec 1 fille pour les nouveaux joueurs

---

## 8. STACK TECHNIQUE

```
Vite + React 19 + TypeScript (strict)
+ Zustand (persist + immer)
+ XState
+ inkjs
+ Tailwind 4
+ Motion (ex-Framer Motion)
+ Howler.js
+ Aseprite (sprites/UI/CG)
```

**Justification** :
- **Vite** : build statique léger, pas de SSR inutile, dev server ultra-rapide
- **React + TS strict** : composants UI complexes (calendrier, stats, menus, écran téléphone, écran lieux), typage indispensable vu le nombre de structures de données croisées
- **Zustand** : état global simple et performant pour le game state
- **XState** : machine à états pour la boucle de jeu (semaine → événement → appel → date → résolution → examen), évite le spaghetti de conditions
- **inkjs** : narration branchée pour les scènes scénarisées (cutscenes spéciales, dates) uniquement
- **Tailwind 4** : vélocité UI sur les écrans système
- **Motion** : transitions, feedback visuel, sprites animés
- **Howler.js** : audio robuste cross-browser

**Cible de déploiement** : itch.io (zip statique) en priorité, GitHub Pages en backup.

---

## 9. ARCHITECTURE DOSSIERS (proposée)

```
tokimemo-proto/
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ assets/
│  │  ├─ sprites/         (sprites filles, expressions)
│  │  ├─ backgrounds/     (lieux : école, café, parc, aquarium...)
│  │  ├─ ui/              (frames, boutons, icônes téléphone)
│  │  ├─ bgm/             (musiques)
│  │  └─ sfx/             (sons d'interface)
│  ├─ components/
│  │  ├─ screens/         (TitleScreen, CalendarScreen, PhoneScreen, DateScreen, ExamScreen...)
│  │  ├─ ui/              (StatBar, GirlSprite, DialogueBox, LocationCard...)
│  │  └─ layout/          (GameContainer, TransitionWrapper)
│  ├─ game/
│  │  ├─ machine.ts       (machine XState principale)
│  │  ├─ store.ts         (store Zustand)
│  │  ├─ types.ts         (types TS du game state)
│  │  ├─ activities.ts    (data des activités)
│  │  ├─ girls.ts         (data des filles, profils cibles, préférences lieux)
│  │  ├─ locations.ts     (data des 8 lieux)
│  │  ├─ clubs.ts         (data des 3 clubs)
│  │  ├─ exams.ts         (logique examens)
│  │  ├─ events.ts        (table des événements aléatoires)
│  │  ├─ bomb.ts          (logique système de bombe)
│  │  └─ formulas.ts      (calculs : compatibilité, affection, etc.)
│  ├─ ink/
│  │  ├─ rin.ink          (scènes Rin)
│  │  ├─ naomi.ink        (scènes Naomi)
│  │  ├─ mio.ink          (scènes Mio)
│  │  ├─ yoshi.ink        (dialogues meilleur ami)
│  │  ├─ exams.ink        (scènes d'examen)
│  │  └─ generic.ink      (événements génériques, rencontres aléatoires)
│  ├─ ink-runtime/
│  │  └─ inkAdapter.ts    (bridge inkjs ↔ React state)
│  ├─ audio/
│  │  └─ audioManager.ts  (singleton Howler)
│  └─ utils/
│     └─ save.ts          (export/import save)
├─ public/
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.ts
└─ package.json
```

---

## 10. JALONS

Découpage en sprints de ~2 semaines chacun. Cadence solo soir/weekend.

### M0 — Setup (3-4 jours)
- [ ] Init projet Vite + TS strict + Tailwind + dépendances
- [ ] Structure dossiers
- [ ] Repo Git
- [ ] CI build itch.io (optionnel)
- [ ] Premier render "Hello Tokimemo" stylisé

### M1 — Boucle nue (2 semaines)
- [ ] Store Zustand : game state + persist
- [ ] Machine XState : MENU → SEMAINE → ACTIVITÉ → RÉSOLUTION → SEMAINE+1
- [ ] Écran calendrier (grille 36 semaines minimaliste)
- [ ] Écran planning : choix activité (6 boutons placeholder)
- [ ] Écran résolution : "tu as gagné +3 études"
- [ ] Système de stats + stress fonctionnel
- [ ] Système de réputation + 3 examens (placeholder)
- [ ] Test : tu peux jouer 36 semaines avec stats qui montent + examens, sans aucune fille

**Livrable** : prototype jouable, vide narrativement, mais boucle complète + examens.

### M2 — Une fille + lieux + appel (2 semaines)
- [ ] Rin : data, sprites placeholder, profil cible, préférences de lieux
- [ ] Système d'affection : calcul, persistance, debug overlay
- [ ] **Système d'appel téléphonique** (écran phone, choix jour + lieu)
- [ ] **Système de lieux** : 8 lieux avec préférences par fille
- [ ] Première rencontre (scène ink)
- [ ] Format date courte (1-2 questions)
- [ ] Calcul compatibilité + impact sur affection selon lieu choisi

**Livrable** : tu peux courtiser Rin en 36 semaines avec mécanique d'appel et lieux fonctionnelle.

### M3 — Trois filles + clubs + Yoshi (2 semaines)
- [ ] Naomi + Mio : data, sprites, scènes
- [ ] Système de clubs (3 au choix, effets passifs, pratique)
- [ ] Yoshi : meilleur ami PNJ avec dialogues d'affection qualitatifs
- [ ] Événements aléatoires (rencontres après l'école avec choix poli/grossier)

**Livrable** : 3 filles, 3 clubs, Yoshi. Toute la mécanique structurelle est là.

### M4 — Bombe + cutscenes spéciales + endings (2 semaines)
- [ ] **Système de bombe complet** (état tendu, signaux subtils, excuses par appel)
- [ ] **Cutscenes spéciales** : 4 par fille, conditions de déclenchement (lieu + semaine + affection + flags)
- [ ] **Tokimeki State** + confession finale
- [ ] **Bad ending si stats incorrectes** malgré affection max
- [ ] Solo ending + game over (échec examens / maladie stress)

**Livrable** : MVP fonctionnel start-to-finish avec tous les endings.

### M5 — Direction artistique (2 semaines)
- [ ] Sprites définitifs des 3 filles (5 expressions chacune : neutre, sourire, content, blushing, triste)
- [ ] Sprite Yoshi
- [ ] Backgrounds des 8 lieux + école + classe
- [ ] UI cohérente (frames, boutons, écran téléphone stylisé)
- [ ] Police principale + secondaire
- [ ] Palette de couleurs verrouillée

**Livrable** : le jeu a une vraie identité visuelle.

### M6 — Audio + polish (1 semaine)
- [ ] BGM (4-5 morceaux ou licences libres : titre, école, date romantique, tension/bombe, examen)
- [ ] SFX (clics, transitions, notifications, sonnerie téléphone)
- [ ] Crossfades, ambiance sonore par lieu
- [ ] Animations Motion sur transitions, sprites, jauges
- [ ] Effets sonores feedback (gain affection, montée stat, bombe, Tokimeki State)

**Livrable** : le jeu a une vraie identité sonore.

### M7 — Balance + QA (1-2 semaines)
- [ ] Tester chaque ending au moins 2x
- [ ] Ajuster valeurs stats/stress/affection/réputation
- [ ] Vérifier bombe se déclenche bien
- [ ] Vérifier tous les seuils d'examens
- [ ] Vérifier les conditions de déclenchement des 12 cutscenes
- [ ] Edge cases (sauvegarde corrompue, refresh en pleine scène, etc.)
- [ ] Build de production + test sur itch.io

**Livrable** : MVP shipable.

### M8 — Sortie itch.io (1-3 jours)
- [ ] Page itch.io (description, screenshots, GIFs, tags)
- [ ] Trailer 30-45s (capture OBS + Reaper)
- [ ] Build final
- [ ] Annonce (Twitter/Bluesky/Discord)

**Total estimé** : 12-14 semaines en cadence solo soir/weekend.

> Le scope MVP a augmenté vs v1 (+~2 semaines) à cause de l'intégration des mécaniques signature (lieux, appel, clubs, examens, cutscenes, bad ending). C'est volontaire : sans ces mécaniques, ce serait un dating sim générique, pas un Tokimeki-like.

---

## 11. RISQUES & MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Scope creep narratif (vouloir 8 cutscenes par fille au lieu de 4) | Élevée | Élevé | Verrouiller M4 livrable AVANT de toucher au polish narratif. Quota strict : 4 cutscenes/fille au MVP. |
| Balance dégueulasse (trop facile/dur, bombe trop violente, examens triviaux) | Élevée | Moyen | Réserver M7 pour ça, jouer le jeu en entier 5+ fois, instrumenter avec debug overlay |
| Direction artistique qui prend 3 mois | Moyenne | Élevé | Commencer M2-M4 avec sprites grossiers, n'investir en art qu'au M5 |
| Système de bombe pas lisible | Moyenne | Élevé | Logs visibles en mode debug ; signaux visuels redondants en mode normal (Yoshi + sprite triste) |
| Mélanie indispo pour les sprites | Moyenne | Moyen | Faire le MVP M1-M4 avec placeholders ; sprites = M5 dédié |
| Ennui en mid-game (semaines 15-25 répétitives) | Élevée | Élevé | Densifier les événements aléatoires, examens scénarisés, compétitions club |
| **Système d'appel + lieux pas intuitif** | Moyenne | Élevé | UX prototype dès M2 avec tests sur 2-3 amis avant de coder M3 |
| **Joueurs ne comprennent pas le bad ending** | Élevée | Moyen | Indices via Yoshi tout au long du jeu sur les goûts de chaque fille ; ending bittersweet explicite |
| **Cutscenes ratables sans le savoir** | Élevée | Moyen | Au lieu de cacher complètement, indices Yoshi sur "Tu devrais inviter X à tel endroit" à partir d'un palier d'affection |

---

## 12. RÉFÉRENCES

### Mécaniques
- **Tokimeki Memorial 1** (1994) — la référence absolue (lieux, appel, club, bombe, Tokimeki State)
- **Tokimeki Memorial Forever With You** (1995, PSX) — version la plus accessible/canonique
- **Tokimeki Memorial 2** (1999) — système plus mature, plus de filles, voice
- **Tokimeki Memorial Girl's Side** — pour les variantes UX (panel d'affection visible avec icônes hearts/notes)

### Visual novels modernes
- **Doki Doki Literature Club** — pour la subversion du genre (hors scope ici, mais inspirant pour mécaniques cachées)
- **Hatoful Boyfriend** — pour la lisibilité d'UI minimaliste
- **Long Live the Queen** — pour le système de stats et planning hebdomadaire (très proche de notre boucle)
- **Princess Maker 2** — pour l'allocation de temps stat-driven sur le long terme

### Esthétique pixel art
- **VA-11 HALL-A** — pour le pixel art VN moderne
- **Coffee Talk** — pour les sprites stylisés et ambiances

### Lectures de référence
- *25 Years With an Invisible Elephant* (Tom James, Medium) — analyse design de Tokimeki
- Wiki Tokimeki Memorial / Fandom — détails mécaniques précis
- Guides Dinklations Shiori Run — psychologie de l'optimisation

---

## 13. NEXT STEPS IMMÉDIATS

1. **Validation de ce brief v2** — relecture, ajustements sur les piliers, le scope MVP, la roadmap post-launch
2. **Profils de filles détaillés** — doc séparé `TOKIMEMO_characters.md` (archétypes, dialogues d'exemple, palettes, références)
3. **Doc design système** — formules complètes, table d'événements, équilibrage chiffré, table des cutscenes (`TOKIMEMO_design.md`)
4. **Setup technique M0** — `npm create vite@latest`, push initial sur Git
5. **Mood board pixel art** — Aseprite, palette, références (Mélanie ou solo en attendant)

---

*Document v2 — à itérer au fil du développement. v1 archivée.*
