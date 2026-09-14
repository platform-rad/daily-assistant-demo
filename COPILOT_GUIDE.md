# Daily Assistant - Copilot Guide

## 🎯 Vue d'ensemble

Daily Assistant est un **Copilot métier** qui vous aide à orchestrer des actions complexes à travers plusieurs systèmes (MyClientDev, MyCreditApp, etc.).

## 🚀 Fonctionnalités principales

### 1. **Chat contextuel**
- L'assistant détecte automatiquement le contexte (quel système est ouvert)
- Les suggestions de skills s'adaptent au contexte
- Exemples de contextes détectés:
  - 📊 **MyClientDev** - Gestion des clients
  - 💳 **MyCreditApp** - Gestion des crédits
  - 📈 **Dashboard** - Vue d'ensemble
  - 📑 **Reporting** - Rapports

### 2. **Suggestions intelligentes (Skills)**
Selon le contexte, vous verrez différentes suggestions:

#### MyClientDev:
- **Créer un client** - Ajoute un nouveau client avec infos
- **Analyse exposition** - Analyse complète du client
- **Générer doc** - Crée un memo d'analyse

#### MyCreditApp:
- **Ajouter facility** - Crée une credit facility
- **Vérifier risque** - Analyse les risques de crédit
- **KPI détaillés** - Affiche les statistiques

#### Dashboard:
- **Vue d'ensemble** - Résumé du portefeuille
- **Alertes** - Points d'attention
- **Rapport journalier** - Synthèse du jour

#### Reporting:
- **Générer rapport** - Rapport complet
- **Tendances** - Analyse des trends
- **Clients à risque** - Identification des risques

### 3. **Workflow Copilot**
Le flux de travail ressemble à celui-ci:

```
Vous décrivez une tâche
        ↓
L'assistant explique son plan
        ↓
Affiche quels outils il va utiliser
        ↓
Demande votre autorisation
        ↓
Exécute les actions
        ↓
Affiche les résultats
        ↓
Vous pouvez ouvrir les outils ou éditer
```

## 📋 Exemples d'utilisation

### Exemple 1: Créer un client avec une facility

**Vous:** "Crée un nouveau client 'TechCorp France' avec une credit facility de 10M EUR"

**L'assistant:**
1. Explique ce qu'il va faire
2. Identifie qu'il a besoin de: MyClientDev + MyCreditApp
3. Montre les étapes:
   - Créer le client dans MyClientDev
   - Ajouter la facility dans MyCreditApp
   - Lier les deux
4. Demande: **[Autoriser]** ou **[Aperçu]**
5. Si autorisé: Exécute et affiche les résultats
6. Boutons: **Ouvrir MyCreditApp** ou **Ouvrir MyClientDev**

### Exemple 2: Analyser un client
**Vous:** "Fais une analyse d'exposition pour TechCorp"

**L'assistant:**
1. Récupère les données de MyClientDev
2. Génère une analyse complète
3. Affiche les KPI clés
4. Propose de générer un document

### Exemple 3: Gérer les risques
**Vous:** "Quels sont les clients à risque?"

**L'assistant:**
1. Accède à MyCreditApp et le Dashboard
2. Identifie les clients avec risques
3. Affiche les alertes prioritaires
4. Propose des actions (vérifier, mettre à jour, notifier)

## 🎨 Interface

### Vue d'accueil (quand pas de messages)
- Titre: "Qu'y a-t-il pour vous?"
- Affichage du contexte détecté
- 3 suggestions de skills cliquables

### Chat en cours
- Messages utilisateur: bleu à droite
- Messages assistant: gris à gauche
- Action cards avec boutons d'autorisation
- Aperçus des outils dans des modals

## 🔧 Comment ça fonctionne

### Détection contextuelle
L'assistant simule la détection du contexte en changeant tous les 30 secondes. En production, il détecterait vraiment ce qui est ouvert.

### Orchestration
- L'IA identifie quels outils sont nécessaires
- Analyse les étapes requises
- Demande permission avant toute action
- Exécute et retourne les résultats

### Prévisualisations
- Cliquez **[Aperçu]** pour voir ce qui va se passer
- Modals pour MyClientDev et MyCreditApp
- Affiche les données actuelles et les changements

## 💡 Conseils d'utilisation

1. **Soyez spécifique** - "Crée un client TechCorp" > "Crée un client"
2. **Utilisez les suggestions** - Les skills sont optimisés pour le contexte
3. **Vérifiez l'aperçu** - Avant d'autoriser, vérifiez ce qui va changer
4. **Gardez l'historique** - L'assistant se souvient de vos actions précédentes

## 🖥️ Modes d'utilisation

### Standalone (Mode Desktop)
- L'app s'ouvre dans une fenêtre flottante
- Peut être redimensionnée (min: 400x500)
- Peut être placée à droite du desktop
- Reste toujours accessible dans la taskbar

### Widget (Intégré dans d'autres apps)
- Apparaît comme panneau dans MyClientDev, etc.
- Même interface et skills
- Contexte détecté automatiquement

### Legacy (Mode classique)
- Interface MyClientDev + Daily Assistant widget
- Ancien mode de fonctionnement

## 🚀 Démarrage

### Mode Web (développement)
```bash
npm run dev
# Ouvre http://localhost:5173/
# Par défaut en mode standalone
```

### Mode Desktop (Tauri)
```bash
npm run tauri:dev
# Lance l'app en tant qu'application Windows native
```

### Mode Standalone HTML
```bash
npm run build:standalone
# Génère daily-assistant.html
# À partager ou envoyer par email
```

## 🔄 Prochaines étapes

1. **Détection réelle** - Intégrer une vraie API pour détecter les fenêtres ouvertes
2. **Apprentissage** - L'assistant apprend de votre workflow
3. **Automations** - Sauvegardez les workflows favoris
4. **Intégrations** - Connectez d'autres systèmes (Bloomberg, Dealogic, etc.)
5. **Analytics** - Suivez vos actions et optimisez

## 📞 Support

Questions ou suggestions? Le contexte détecté est affiché dans l'en-tête pour vous aider à comprendre ce que l'assistant voit.
